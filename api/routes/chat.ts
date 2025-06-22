// Chat and AI Conversation API Routes
import { Request, Response } from 'express'
import { db } from '../db/connection'
import { AIIntegrationService } from '../services/ai-integration'
import { E2EEncryptionService } from '../../lib/security/e2e-encryption'
import { randomBytes } from 'crypto'

const aiService = new AIIntegrationService()
const encryption = new E2EEncryptionService({
  algorithm: 'aes-256-gcm',
  keyDerivationIterations: 100000,
  saltLength: 32,
  ivLength: 16,
  tagLength: 16,
  rsaKeySize: 2048,
  hashAlgorithm: 'sha256'
})

// Start new conversation
export async function startConversation(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req
    const { characterId, sessionType = 'chat' } = req.body

    // Validate character exists
    const characterResult = await db.query(`
      SELECT id, name, personality_traits, capabilities 
      FROM ai_characters 
      WHERE id = $1 AND is_active = true
    `, [characterId])

    if (characterResult.rows.length === 0) {
      res.status(404).json({ error: 'AI character not found' })
      return
    }

    const character = characterResult.rows[0]

    // Get user's relationship with character
    let relationshipResult = await db.query(`
      SELECT relationship_level, trust_score, conversation_count, total_interaction_time, preferences
      FROM user_character_relationships 
      WHERE user_id = $1 AND character_id = $2
    `, [user.realUserId || user.anonymousId, characterId])

    let relationship = relationshipResult.rows[0]

    // Create relationship if doesn't exist
    if (!relationship) {
      await db.query(`
        INSERT INTO user_character_relationships (
          user_id, character_id, relationship_level, trust_score, conversation_count
        ) VALUES ($1, $2, $3, $4, $5)
      `, [user.realUserId || user.anonymousId, characterId, 10, 20, 0])

      relationship = {
        relationship_level: 10,
        trust_score: 20,
        conversation_count: 0,
        total_interaction_time: '0 minutes',
        preferences: {}
      }
    }

    // Get user's recent mood data for context
    const moodResult = await db.query(`
      SELECT encrypted_mood_data, encryption_metadata, checkin_date
      FROM mood_checkins 
      WHERE user_id = $1 
      ORDER BY checkin_date DESC 
      LIMIT 5
    `, [user.realUserId || user.anonymousId])

    const moodHistory = moodResult.rows.map(row => {
      try {
        const metadata = JSON.parse(row.encryption_metadata)
        const decryptedMood = db.decryptData(
          metadata.encrypted,
          metadata.iv,
          metadata.tag,
          user.companyId
        )
        return {
          date: row.checkin_date,
          mood: JSON.parse(decryptedMood)
        }
      } catch {
        return null
      }
    }).filter(Boolean)

    // Start AI conversation
    const sessionId = await aiService.startConversation(
      user.anonymousId,
      characterId,
      sessionType
    )

    // Create conversation record
    const conversationId = randomBytes(16).toString('hex')
    
    const conversationData = {
      id: conversationId,
      sessionId,
      characterId,
      character: character.name,
      startedAt: new Date(),
      userContext: {
        relationship,
        moodHistory: moodHistory.slice(0, 3), // Last 3 moods for context
        sessionType
      }
    }

    // Encrypt conversation metadata
    const encryptionResult = db.encryptData(
      JSON.stringify(conversationData),
      user.companyId
    )

    // Store in database
    await db.query(`
      INSERT INTO conversations (
        id, user_id, character_id, encrypted_content, encryption_metadata,
        session_type, started_at, message_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      conversationId,
      user.realUserId || user.anonymousId,
      characterId,
      encryptionResult.encrypted,
      JSON.stringify({
        iv: encryptionResult.iv,
        tag: encryptionResult.tag,
        algorithm: 'aes-256-gcm'
      }),
      sessionType,
      new Date(),
      0
    ])

    // Log conversation start
    await db.logPrivacyAction({
      action: 'create',
      anonymousUserId: user.anonymousId,
      dataType: 'conversation',
      success: true,
      complianceFlags: ['CONVERSATION_STARTED', 'ENCRYPTED_STORAGE'],
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    // Generate initial greeting
    const greetingResponse = await aiService.generateResponse({
      userId: user.realUserId || user.anonymousId,
      anonymousId: user.anonymousId,
      characterId,
      sessionId,
      conversationHistory: [],
      userProfile: {
        preferences: relationship.preferences || {},
        moodHistory,
        relationshipLevel: relationship.relationship_level,
        riskFactors: []
      },
      sessionType: sessionType as any
    }, `こんにちは、${character.name}。今日はお話しできて嬉しいです。`)

    res.json({
      success: true,
      conversationId,
      sessionId,
      character: {
        id: character.id,
        name: character.name,
        personality: character.personality_traits,
        capabilities: character.capabilities
      },
      initialMessage: {
        id: greetingResponse.messageId,
        content: greetingResponse.content,
        character: greetingResponse.character,
        timestamp: new Date(),
        suggestedActions: greetingResponse.suggestedActions
      },
      relationship: {
        level: relationship.relationship_level,
        trustScore: relationship.trust_score,
        conversationCount: relationship.conversation_count
      }
    })

  } catch (error) {
    console.error('Start conversation failed:', error)
    res.status(500).json({ error: 'Failed to start conversation' })
  }
}

// Send message in conversation
export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req
    const { conversationId } = req.params
    const { message, messageType = 'text' } = req.body

    // Get conversation details
    const conversationResult = await db.query(`
      SELECT 
        c.id, c.user_id, c.character_id, c.encrypted_content, c.encryption_metadata,
        c.session_type, c.message_count,
        ch.name as character_name, ch.personality_traits
      FROM conversations c
      JOIN ai_characters ch ON c.character_id = ch.id
      WHERE c.id = $1 AND c.user_id = $2 AND c.ended_at IS NULL
    `, [conversationId, user.realUserId || user.anonymousId])

    if (conversationResult.rows.length === 0) {
      res.status(404).json({ error: 'Conversation not found or ended' })
      return
    }

    const conversation = conversationResult.rows[0]

    // Decrypt conversation data to get session context
    const metadata = JSON.parse(conversation.encryption_metadata)
    const decryptedContent = db.decryptData(
      conversation.encrypted_content,
      metadata.iv,
      metadata.tag,
      user.companyId
    )
    const conversationData = JSON.parse(decryptedContent)

    // Get recent messages for context
    const recentMessagesResult = await db.query(`
      SELECT encrypted_content, encryption_metadata, sender_type, timestamp
      FROM messages 
      WHERE conversation_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 10
    `, [conversationId])

    const conversationHistory = recentMessagesResult.rows.reverse().map(row => {
      try {
        const msgMetadata = JSON.parse(row.encryption_metadata)
        const decryptedMsg = db.decryptData(
          row.encrypted_content,
          msgMetadata.iv,
          msgMetadata.tag,
          user.companyId
        )
        const msgData = JSON.parse(decryptedMsg)
        
        return {
          id: msgData.id,
          role: row.sender_type === 'user' ? 'user' : 'assistant',
          content: msgData.content,
          timestamp: new Date(row.timestamp),
          metadata: msgData.metadata || {}
        }
      } catch {
        return null
      }
    }).filter(Boolean)

    // Generate AI response
    const aiResponse = await aiService.generateResponse({
      userId: user.realUserId || user.anonymousId,
      anonymousId: user.anonymousId,
      characterId: conversation.character_id,
      sessionId: conversationData.sessionId,
      conversationHistory,
      userProfile: conversationData.userContext.relationship ? {
        preferences: conversationData.userContext.relationship.preferences || {},
        moodHistory: conversationData.userContext.moodHistory || [],
        relationshipLevel: conversationData.userContext.relationship.relationship_level || 50,
        riskFactors: []
      } : {
        preferences: {},
        moodHistory: [],
        relationshipLevel: 50,
        riskFactors: []
      },
      sessionType: conversation.session_type as any
    }, message)

    // Check for crisis escalation
    const needsEscalation = aiResponse.safeguardFlags.includes('CRISIS_DETECTED') ||
                           aiResponse.suggestedActions?.some(action => action.type === 'escalate')

    if (needsEscalation) {
      // Log crisis event
      await db.query(`
        INSERT INTO emergency_support_logs (
          user_id, support_type, encrypted_details, encryption_metadata, status
        ) VALUES ($1, $2, $3, $4, $5)
      `, [
        user.realUserId || user.anonymousId,
        'crisis',
        '', // Would contain encrypted crisis details
        '{}',
        'pending'
      ])
    }

    // Store user message
    const userMessageData = {
      id: randomBytes(16).toString('hex'),
      content: message,
      type: messageType,
      timestamp: new Date(),
      metadata: {
        riskLevel: aiResponse.safeguardFlags.includes('CRISIS_DETECTED') ? 'high' : 'low',
        clientIP: req.ip
      }
    }

    const userMessageEncryption = db.encryptData(
      JSON.stringify(userMessageData),
      user.companyId
    )

    await db.query(`
      INSERT INTO messages (
        id, conversation_id, encrypted_content, encryption_metadata,
        sender_type, message_type, timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      userMessageData.id,
      conversationId,
      userMessageEncryption.encrypted,
      JSON.stringify({
        iv: userMessageEncryption.iv,
        tag: userMessageEncryption.tag,
        algorithm: 'aes-256-gcm'
      }),
      'user',
      messageType,
      userMessageData.timestamp
    ])

    // Store AI response
    const aiMessageData = {
      id: aiResponse.messageId,
      content: aiResponse.content,
      character: aiResponse.character,
      timestamp: new Date(),
      metadata: {
        confidence: aiResponse.confidence,
        responseTime: aiResponse.responseTime,
        safeguardFlags: aiResponse.safeguardFlags,
        adaptations: aiResponse.adaptations
      }
    }

    const aiMessageEncryption = db.encryptData(
      JSON.stringify(aiMessageData),
      user.companyId
    )

    await db.query(`
      INSERT INTO messages (
        id, conversation_id, encrypted_content, encryption_metadata,
        sender_type, message_type, timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      aiResponse.messageId,
      conversationId,
      aiMessageEncryption.encrypted,
      JSON.stringify({
        iv: aiMessageEncryption.iv,
        tag: aiMessageEncryption.tag,
        algorithm: 'aes-256-gcm'
      }),
      'ai',
      'text',
      aiMessageData.timestamp
    ])

    // Update conversation message count
    await db.query(`
      UPDATE conversations 
      SET message_count = message_count + 2,
          updated_at = NOW()
      WHERE id = $1
    `, [conversationId])

    // Update character relationship
    await db.query(`
      UPDATE user_character_relationships
      SET 
        conversation_count = conversation_count + 1,
        relationship_level = LEAST(relationship_level + 1, 100),
        trust_score = LEAST(trust_score + 2, 100),
        total_interaction_time = total_interaction_time + INTERVAL '5 minutes',
        updated_at = NOW()
      WHERE user_id = $1 AND character_id = $2
    `, [user.realUserId || user.anonymousId, conversation.character_id])

    // Log message exchange
    await db.logPrivacyAction({
      action: 'create',
      anonymousUserId: user.anonymousId,
      dataType: 'message',
      success: true,
      complianceFlags: [
        'MESSAGE_ENCRYPTED',
        'AI_RESPONSE_GENERATED',
        ...(needsEscalation ? ['CRISIS_DETECTED'] : [])
      ],
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    res.json({
      success: true,
      userMessage: {
        id: userMessageData.id,
        content: message,
        timestamp: userMessageData.timestamp,
        type: messageType
      },
      aiResponse: {
        id: aiResponse.messageId,
        content: aiResponse.content,
        character: aiResponse.character,
        timestamp: aiMessageData.timestamp,
        confidence: aiResponse.confidence,
        suggestedActions: aiResponse.suggestedActions
      },
      needsEscalation,
      conversationStats: {
        messageCount: conversation.message_count + 2,
        relationshipIncrease: needsEscalation ? 0 : 1
      }
    })

  } catch (error) {
    console.error('Send message failed:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
}

// Get conversation history
export async function getConversationHistory(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req
    const { conversationId } = req.params
    const { limit = 50, offset = 0 } = req.query

    // Verify conversation belongs to user
    const conversationResult = await db.query(`
      SELECT id, user_id, character_id, session_type, started_at, message_count
      FROM conversations 
      WHERE id = $1 AND user_id = $2
    `, [conversationId, user.realUserId || user.anonymousId])

    if (conversationResult.rows.length === 0) {
      res.status(404).json({ error: 'Conversation not found' })
      return
    }

    // Get messages
    const messagesResult = await db.query(`
      SELECT 
        id, encrypted_content, encryption_metadata, sender_type,
        message_type, timestamp, is_edited, edited_at
      FROM messages 
      WHERE conversation_id = $1 
      ORDER BY timestamp DESC 
      LIMIT $2 OFFSET $3
    `, [conversationId, Number(limit), Number(offset)])

    const messages = messagesResult.rows.reverse().map(row => {
      try {
        const metadata = JSON.parse(row.encryption_metadata)
        const decryptedContent = db.decryptData(
          row.encrypted_content,
          metadata.iv,
          metadata.tag,
          user.companyId
        )
        const messageData = JSON.parse(decryptedContent)

        return {
          id: row.id,
          content: messageData.content,
          sender: row.sender_type,
          type: row.message_type,
          timestamp: row.timestamp,
          isEdited: row.is_edited,
          editedAt: row.edited_at,
          metadata: {
            confidence: messageData.metadata?.confidence,
            character: messageData.character
          }
        }
      } catch (error) {
        console.error('Failed to decrypt message:', error)
        return null
      }
    }).filter(Boolean)

    // Log access
    await db.logPrivacyAction({
      action: 'access',
      anonymousUserId: user.anonymousId,
      dataType: 'conversation_history',
      success: true,
      complianceFlags: ['HISTORY_ACCESS', 'ENCRYPTED_DATA_READ'],
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    res.json({
      success: true,
      conversation: conversationResult.rows[0],
      messages,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        hasMore: messagesResult.rows.length === Number(limit)
      }
    })

  } catch (error) {
    console.error('Get conversation history failed:', error)
    res.status(500).json({ error: 'Failed to retrieve conversation history' })
  }
}

// End conversation
export async function endConversation(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req
    const { conversationId } = req.params
    const { rating, feedback } = req.body

    // Verify conversation belongs to user
    const conversationResult = await db.query(`
      SELECT id, user_id, character_id, started_at, message_count, session_type
      FROM conversations 
      WHERE id = $1 AND user_id = $2 AND ended_at IS NULL
    `, [conversationId, user.realUserId || user.anonymousId])

    if (conversationResult.rows.length === 0) {
      res.status(404).json({ error: 'Active conversation not found' })
      return
    }

    const conversation = conversationResult.rows[0]
    const duration = Date.now() - new Date(conversation.started_at).getTime()

    // Update conversation end time
    await db.query(`
      UPDATE conversations 
      SET ended_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `, [conversationId])

    // End AI service session
    try {
      // Get session ID from conversation data
      await aiService.endConversation(conversationId) // Use conversation ID as fallback
    } catch (error) {
      console.error('Failed to end AI session:', error)
    }

    // Update character relationship with session results
    const relationshipBonus = Math.min(Math.floor(conversation.message_count / 5), 10)
    const trustBonus = rating ? Math.floor(rating * 2) : 1

    await db.query(`
      UPDATE user_character_relationships
      SET 
        relationship_level = LEAST(relationship_level + $3, 100),
        trust_score = LEAST(trust_score + $4, 100),
        total_interaction_time = total_interaction_time + INTERVAL '${Math.floor(duration / 60000)} minutes',
        updated_at = NOW()
      WHERE user_id = $1 AND character_id = $2
    `, [
      user.realUserId || user.anonymousId,
      conversation.character_id,
      relationshipBonus,
      trustBonus
    ])

    // Store feedback if provided
    if (feedback) {
      const feedbackData = {
        conversationId,
        rating: rating || null,
        feedback,
        timestamp: new Date()
      }

      const feedbackEncryption = db.encryptData(
        JSON.stringify(feedbackData),
        user.companyId
      )

      // Store encrypted feedback (could be in a separate feedback table)
      await db.query(`
        INSERT INTO user_content_interactions (
          user_id, content_id, interaction_type, progress_percentage
        ) VALUES ($1, $2, $3, $4)
      `, [
        user.realUserId || user.anonymousId,
        conversationId,
        'feedback',
        rating || 0
      ])
    }

    // Log conversation end
    await db.logPrivacyAction({
      action: 'update',
      anonymousUserId: user.anonymousId,
      dataType: 'conversation',
      success: true,
      complianceFlags: ['CONVERSATION_ENDED', 'RELATIONSHIP_UPDATED'],
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    res.json({
      success: true,
      conversationSummary: {
        id: conversationId,
        duration: Math.floor(duration / 60000), // minutes
        messageCount: conversation.message_count,
        type: conversation.session_type,
        relationshipBonus,
        trustBonus
      },
      message: 'Conversation ended successfully'
    })

  } catch (error) {
    console.error('End conversation failed:', error)
    res.status(500).json({ error: 'Failed to end conversation' })
  }
}

// Get available AI characters
export async function getCharacters(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req

    // Get all active characters
    const charactersResult = await db.query(`
      SELECT id, name, personality_traits, capabilities, voice_config, visual_config
      FROM ai_characters 
      WHERE is_active = true
      ORDER BY name
    `)

    // Get user's relationships with characters
    const relationshipsResult = await db.query(`
      SELECT 
        character_id, relationship_level, trust_score, conversation_count,
        total_interaction_time, favorite_topics, preferences
      FROM user_character_relationships
      WHERE user_id = $1
    `, [user.realUserId || user.anonymousId])

    const relationships = new Map(
      relationshipsResult.rows.map(row => [row.character_id, row])
    )

    const characters = charactersResult.rows.map(character => ({
      id: character.id,
      name: character.name,
      personality: character.personality_traits,
      capabilities: character.capabilities,
      voiceConfig: character.voice_config,
      visualConfig: character.visual_config,
      relationship: relationships.get(character.id) || {
        relationship_level: 0,
        trust_score: 0,
        conversation_count: 0,
        total_interaction_time: '0 minutes',
        favorite_topics: [],
        preferences: {}
      }
    }))

    res.json({
      success: true,
      characters
    })

  } catch (error) {
    console.error('Get characters failed:', error)
    res.status(500).json({ error: 'Failed to retrieve characters' })
  }
}

// Get AI service metrics (admin only)
export async function getAIMetrics(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req

    // Check if user is admin
    if (!user.permissions.includes('admin_access')) {
      res.status(403).json({ error: 'Admin access required' })
      return
    }

    const metrics = {
      activeConversations: aiService.getActiveConversationCount(),
      characters: aiService.getCharacters().length,
      // Additional metrics would come from database queries
      totalConversations: 0,
      averageResponseTime: 0,
      crisisInterventions: 0
    }

    // Get database metrics
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_conversations,
        COUNT(CASE WHEN session_type = 'crisis' THEN 1 END) as crisis_conversations,
        AVG(message_count) as avg_message_count
      FROM conversations 
      WHERE started_at >= NOW() - INTERVAL '24 hours'
    `)

    if (statsResult.rows.length > 0) {
      const stats = statsResult.rows[0]
      metrics.totalConversations = parseInt(stats.total_conversations)
      metrics.crisisInterventions = parseInt(stats.crisis_conversations)
    }

    res.json({
      success: true,
      metrics,
      timestamp: new Date()
    })

  } catch (error) {
    console.error('Get AI metrics failed:', error)
    res.status(500).json({ error: 'Failed to retrieve metrics' })
  }
}

export {
  startConversation,
  sendMessage,
  getConversationHistory,
  endConversation,
  getCharacters,
  getAIMetrics
}