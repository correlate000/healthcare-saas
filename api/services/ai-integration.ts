// AI Response System Integration
// Supports multiple AI providers with healthcare-specific safety measures

import { EventEmitter } from 'events'
import { randomBytes, createHash } from 'crypto'

export interface AIProvider {
  id: string
  name: string
  type: 'openai' | 'anthropic' | 'google' | 'azure' | 'local'
  config: AIProviderConfig
  isActive: boolean
  priority: number
}

export interface AIProviderConfig {
  apiKey?: string
  endpoint?: string
  model: string
  maxTokens: number
  temperature: number
  safeguards: {
    contentFiltering: boolean
    crisisDetection: boolean
    personalizationLevel: 'high' | 'medium' | 'low'
    responseTimeoutMs: number
  }
  rateLimit: {
    requestsPerMinute: number
    tokensPerDay: number
  }
}

export interface AICharacterProfile {
  id: string
  name: string
  basePersonality: string
  conversationStyle: string
  specializations: string[]
  ethicalGuidelines: string[]
  responseTemplates: {
    greeting: string[]
    supportive: string[]
    crisis: string[]
    goodbye: string[]
  }
  adaptationRules: {
    userMood: Record<string, string>
    timeOfDay: Record<string, string>
    conversationLength: Record<string, string>
  }
}

export interface ConversationContext {
  userId: string
  anonymousId: string
  characterId: string
  sessionId: string
  conversationHistory: AIMessage[]
  userProfile: {
    preferences: any
    moodHistory: any[]
    relationshipLevel: number
    riskFactors: string[]
  }
  currentMood?: string
  sessionType: 'checkin' | 'chat' | 'crisis' | 'counselor_session'
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata: {
    characterId?: string
    sentiment?: number
    riskLevel?: 'low' | 'medium' | 'high' | 'crisis'
    interventionFlags?: string[]
    responseTime?: number
  }
}

export interface AIResponse {
  messageId: string
  content: string
  character: string
  confidence: number
  responseTime: number
  safeguardFlags: string[]
  adaptations: string[]
  suggestedActions?: {
    type: 'escalate' | 'resource' | 'activity' | 'followup'
    description: string
    priority: number
  }[]
}

export interface CrisisDetectionResult {
  riskLevel: 'low' | 'medium' | 'high' | 'crisis'
  confidence: number
  indicators: string[]
  recommendedAction: 'continue' | 'escalate' | 'emergency'
  resources: {
    type: 'hotline' | 'article' | 'exercise' | 'professional'
    title: string
    url?: string
    priority: number
  }[]
}

class AIIntegrationService extends EventEmitter {
  private providers: Map<string, AIProvider> = new Map()
  private characters: Map<string, AICharacterProfile> = new Map()
  private activeConversations: Map<string, ConversationContext> = new Map()
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map()
  
  constructor() {
    super()
    this.initializeCharacters()
    this.initializeProviders()
    this.startBackgroundTasks()
  }

  // Initialize AI character profiles
  private initializeCharacters(): void {
    const characters: AICharacterProfile[] = [
      {
        id: 'luna',
        name: 'Luna',
        basePersonality: 'empathetic, gentle, understanding, nurturing',
        conversationStyle: 'warm and supportive with gentle guidance',
        specializations: ['emotional support', 'stress management', 'sleep issues', 'anxiety'],
        ethicalGuidelines: [
          'Always prioritize user safety and wellbeing',
          'Encourage professional help when appropriate',
          'Maintain appropriate boundaries',
          'Respect user autonomy and choices'
        ],
        responseTemplates: {
          greeting: [
            'こんにちは。今日はどんな気持ちでいらっしゃいますか？',
            'お疲れ様です。お話を聞かせてください。',
            'いつでもあなたの味方です。何かお困りのことはありませんか？'
          ],
          supportive: [
            'あなたの気持ちがよく伝わってきます。',
            'そのように感じるのは自然なことです。',
            'あなたは一人ではありません。一緒に考えていきましょう。'
          ],
          crisis: [
            'とても辛い状況にいらっしゃるようですね。すぐに専門家に相談することをお勧めします。',
            'あなたの安全が最優先です。今すぐサポートが必要です。',
            '緊急の場合は遠慮なく専門機関にご連絡ください。'
          ],
          goodbye: [
            'また何かあれば、いつでもお話ししましょう。',
            'お疲れ様でした。ゆっくり休んでくださいね。',
            'あなたのことを応援しています。'
          ]
        },
        adaptationRules: {
          userMood: {
            'very_low': 'extra_gentle_and_supportive',
            'low': 'compassionate_and_understanding', 
            'neutral': 'friendly_and_encouraging',
            'high': 'upbeat_and_celebratory',
            'very_high': 'enthusiastic_but_grounded'
          },
          timeOfDay: {
            'morning': 'energizing_and_motivational',
            'afternoon': 'steady_and_supportive',
            'evening': 'calming_and_reflective',
            'night': 'soothing_and_peaceful'
          },
          conversationLength: {
            'short': 'concise_and_focused',
            'medium': 'detailed_and_exploratory',
            'long': 'patient_and_thorough'
          }
        }
      },
      {
        id: 'aria',
        name: 'Aria',
        basePersonality: 'optimistic, energetic, creative, motivating',
        conversationStyle: 'upbeat and encouraging with practical solutions',
        specializations: ['motivation', 'goal setting', 'creativity', 'productivity', 'team building'],
        ethicalGuidelines: [
          'Promote realistic optimism and achievable goals',
          'Encourage healthy habits and positive thinking',
          'Support user growth while respecting limits',
          'Foster independence and self-efficacy'
        ],
        responseTemplates: {
          greeting: [
            'こんにちは！今日も新しい可能性に満ちていますね。',
            'いらっしゃいませ！何か面白いことを一緒に考えてみませんか？',
            'こんにちは！今日はどんな素敵なことにチャレンジしますか？'
          ],
          supportive: [
            'そのアイデア、とても良いと思います！',
            'すでに大きな一歩を踏み出していますね。',
            '困難は成長のチャンスです。一緒に乗り越えましょう！'
          ],
          crisis: [
            '今は辛くても、必ず光が見えてきます。専門家の力を借りましょう。',
            'あなたには素晴らしい力があります。まずは安全を確保しましょう。',
            'この困難は一時的なものです。適切なサポートを受けてください。'
          ],
          goodbye: [
            'また今度、新しいアイデアを一緒に考えましょう！',
            '今日の話、とても刺激的でした。またお会いしましょう。',
            'あなたの可能性は無限大です。頑張って！'
          ]
        },
        adaptationRules: {
          userMood: {
            'very_low': 'gentle_optimism_with_hope',
            'low': 'encouraging_and_uplifting',
            'neutral': 'creative_and_inspiring',
            'high': 'enthusiastic_and_celebratory',
            'very_high': 'excited_but_grounded'
          },
          timeOfDay: {
            'morning': 'high_energy_and_motivational',
            'afternoon': 'productive_and_focused',
            'evening': 'reflective_and_planning',
            'night': 'gentle_and_inspiring'
          },
          conversationLength: {
            'short': 'quick_inspiration_and_tips',
            'medium': 'creative_exploration',
            'long': 'deep_goal_setting_session'
          }
        }
      },
      {
        id: 'zen',
        name: 'Zen',
        basePersonality: 'calm, wise, mindful, grounding',
        conversationStyle: 'peaceful and philosophical with mindful guidance',
        specializations: ['mindfulness', 'meditation', 'stress reduction', 'philosophy', 'balance'],
        ethicalGuidelines: [
          'Promote mindful awareness and present-moment focus',
          'Encourage balance and moderation in all things',
          'Respect the wisdom of silence and reflection',
          'Guide towards inner peace and self-understanding'
        ],
        responseTemplates: {
          greeting: [
            'こんにちは。今この瞬間に意識を向けてみませんか。',
            'ようこそ。深呼吸をして、心を落ち着けましょう。',
            'お疲れ様です。少し立ち止まって、自分の内側に目を向けてみましょう。'
          ],
          supportive: [
            'その感情も、雲のように流れていくものです。',
            '今感じていることを、ただ観察してみてください。',
            '全ては変化し続けます。この瞬間も、やがて過ぎていきます。'
          ],
          crisis: [
            '今は嵐の中にいるようですが、必ず静寂が戻ってきます。まずは安全を確保しましょう。',
            '深い苦しみの中にいるあなたを、心から理解します。専門家の支援を受けてください。',
            'この困難も人生の一部分です。適切な助けを求めることが賢明です。'
          ],
          goodbye: [
            'またお会いできることを楽しみにしています。',
            '心の平安があなたと共にありますように。',
            '今日の学びを大切に、穏やかな時間をお過ごしください。'
          ]
        },
        adaptationRules: {
          userMood: {
            'very_low': 'deeply_compassionate_and_grounding',
            'low': 'gentle_wisdom_and_acceptance',
            'neutral': 'mindful_and_balanced',
            'high': 'grateful_and_appreciative',
            'very_high': 'grounding_with_gentle_calm'
          },
          timeOfDay: {
            'morning': 'mindful_awakening',
            'afternoon': 'centered_awareness',
            'evening': 'reflective_gratitude',
            'night': 'peaceful_contemplation'
          },
          conversationLength: {
            'short': 'mindful_moments',
            'medium': 'deeper_reflection',
            'long': 'philosophical_exploration'
          }
        }
      }
    ]

    characters.forEach(character => {
      this.characters.set(character.id, character)
    })
  }

  // Initialize AI providers
  private initializeProviders(): void {
    const providers: AIProvider[] = [
      {
        id: 'openai_primary',
        name: 'OpenAI GPT-4',
        type: 'openai',
        config: {
          apiKey: process.env.OPENAI_API_KEY,
          endpoint: 'https://api.openai.com/v1/chat/completions',
          model: 'gpt-4',
          maxTokens: 2048,
          temperature: 0.7,
          safeguards: {
            contentFiltering: true,
            crisisDetection: true,
            personalizationLevel: 'high',
            responseTimeoutMs: 30000
          },
          rateLimit: {
            requestsPerMinute: 50,
            tokensPerDay: 100000
          }
        },
        isActive: true,
        priority: 1
      },
      {
        id: 'anthropic_backup',
        name: 'Anthropic Claude',
        type: 'anthropic',
        config: {
          apiKey: process.env.ANTHROPIC_API_KEY,
          endpoint: 'https://api.anthropic.com/v1/messages',
          model: 'claude-3-sonnet-20240229',
          maxTokens: 2048,
          temperature: 0.6,
          safeguards: {
            contentFiltering: true,
            crisisDetection: true,
            personalizationLevel: 'high',
            responseTimeoutMs: 25000
          },
          rateLimit: {
            requestsPerMinute: 40,
            tokensPerDay: 80000
          }
        },
        isActive: true,
        priority: 2
      }
    ]

    providers.forEach(provider => {
      this.providers.set(provider.id, provider)
    })
  }

  // Generate AI response with character personality
  async generateResponse(context: ConversationContext, userMessage: string): Promise<AIResponse> {
    const startTime = performance.now()
    const messageId = randomBytes(16).toString('hex')

    try {
      // Crisis detection first
      const crisisResult = await this.detectCrisis(userMessage, context)
      
      if (crisisResult.recommendedAction === 'emergency') {
        return this.generateCrisisResponse(messageId, crisisResult, context.characterId)
      }

      // Get character profile
      const character = this.characters.get(context.characterId)
      if (!character) {
        throw new Error('Character not found')
      }

      // Build conversation prompt
      const prompt = this.buildConversationPrompt(character, context, userMessage, crisisResult)

      // Get response from AI provider
      const response = await this.callAIProvider(prompt, context)

      // Apply character adaptations
      const adaptedResponse = this.applyCharacterAdaptations(response, character, context)

      // Generate suggested actions
      const suggestedActions = this.generateSuggestedActions(userMessage, crisisResult, context)

      const responseTime = performance.now() - startTime

      const aiResponse: AIResponse = {
        messageId,
        content: adaptedResponse,
        character: character.name,
        confidence: 0.85, // Would be calculated based on AI model confidence
        responseTime,
        safeguardFlags: crisisResult.indicators,
        adaptations: this.getAppliedAdaptations(character, context),
        suggestedActions
      }

      // Update conversation context
      this.updateConversationContext(context, userMessage, aiResponse)

      // Emit events for monitoring
      this.emit('responseGenerated', {
        userId: context.anonymousId,
        characterId: context.characterId,
        responseTime,
        riskLevel: crisisResult.riskLevel
      })

      return aiResponse

    } catch (error) {
      console.error('AI response generation failed:', error)
      
      // Fallback to pre-defined response
      return this.generateFallbackResponse(messageId, context.characterId, error.message)
    }
  }

  // Crisis detection using pattern matching and AI
  private async detectCrisis(message: string, context: ConversationContext): Promise<CrisisDetectionResult> {
    const crisisIndicators = [
      // Suicide/self-harm indicators
      { pattern: /(自殺|死にたい|消えたい|終わりにしたい)/i, weight: 10, type: 'suicide' },
      { pattern: /(首を吊|飛び降り|薬を飲|死ぬ方法)/i, weight: 10, type: 'suicide_method' },
      
      // Self-harm indicators  
      { pattern: /(自分を傷つけ|切りつけ|リスカ|自傷)/i, weight: 8, type: 'self_harm' },
      
      // Severe depression/hopelessness
      { pattern: /(もう無理|希望がない|絶望|生きる意味)/i, weight: 6, type: 'depression' },
      
      // Substance abuse
      { pattern: /(大量の薬|アルコール依存|薬物|中毒)/i, weight: 7, type: 'substance' },
      
      // Violence indicators
      { pattern: /(誰かを傷つけ|暴力|怒りが抑えられない)/i, weight: 9, type: 'violence' }
    ]

    let totalScore = 0
    const detectedIndicators: string[] = []

    // Pattern-based detection
    for (const indicator of crisisIndicators) {
      if (indicator.pattern.test(message)) {
        totalScore += indicator.weight
        detectedIndicators.push(indicator.type)
      }
    }

    // Add context-based risk factors
    const riskFactors = context.userProfile.riskFactors || []
    const contextMultiplier = riskFactors.length > 0 ? 1.5 : 1.0
    totalScore *= contextMultiplier

    // Determine risk level
    let riskLevel: CrisisDetectionResult['riskLevel']
    let recommendedAction: CrisisDetectionResult['recommendedAction']

    if (totalScore >= 10) {
      riskLevel = 'crisis'
      recommendedAction = 'emergency'
    } else if (totalScore >= 6) {
      riskLevel = 'high'
      recommendedAction = 'escalate'
    } else if (totalScore >= 3) {
      riskLevel = 'medium'
      recommendedAction = 'escalate'
    } else {
      riskLevel = 'low'
      recommendedAction = 'continue'
    }

    // Generate appropriate resources
    const resources = this.generateCrisisResources(riskLevel, detectedIndicators)

    return {
      riskLevel,
      confidence: Math.min(totalScore / 10, 1.0),
      indicators: detectedIndicators,
      recommendedAction,
      resources
    }
  }

  // Generate crisis-appropriate resources
  private generateCrisisResources(riskLevel: string, indicators: string[]): CrisisDetectionResult['resources'] {
    const resources: CrisisDetectionResult['resources'] = []

    if (riskLevel === 'crisis' || indicators.includes('suicide')) {
      resources.push({
        type: 'hotline',
        title: '自殺予防いのちの電話',
        url: 'tel:0120-783-556',
        priority: 1
      })
      resources.push({
        type: 'hotline', 
        title: '緊急時は警察・消防',
        url: 'tel:110',
        priority: 1
      })
    }

    if (riskLevel === 'high' || riskLevel === 'medium') {
      resources.push({
        type: 'professional',
        title: '心の健康相談統一ダイヤル',
        url: 'tel:0570-064-556',
        priority: 2
      })
      resources.push({
        type: 'article',
        title: 'ストレス対処法ガイド',
        url: '/content-library/stress-management',
        priority: 3
      })
    }

    if (indicators.includes('depression')) {
      resources.push({
        type: 'exercise',
        title: '5分間マインドフルネス瞑想',
        url: '/content-library/mindfulness-5min',
        priority: 2
      })
    }

    return resources
  }

  // Build conversation prompt for AI
  private buildConversationPrompt(
    character: AICharacterProfile, 
    context: ConversationContext, 
    userMessage: string,
    crisisResult: CrisisDetectionResult
  ): string {
    const currentHour = new Date().getHours()
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : currentHour < 21 ? 'evening' : 'night'
    
    const systemPrompt = `You are ${character.name}, an AI companion for mental health support.

Character Profile:
- Personality: ${character.basePersonality}
- Style: ${character.conversationStyle}
- Specializations: ${character.specializations.join(', ')}

Ethical Guidelines:
${character.ethicalGuidelines.map(g => `- ${g}`).join('\n')}

Current Context:
- Time of day: ${timeOfDay}
- User mood: ${context.currentMood || 'unknown'}
- Relationship level: ${context.userProfile.relationshipLevel}/100
- Risk level: ${crisisResult.riskLevel}
- Session type: ${context.sessionType}

Adaptation Instructions:
- Adjust tone based on user mood: ${character.adaptationRules.userMood[context.currentMood || 'neutral']}
- Time-appropriate style: ${character.adaptationRules.timeOfDay[timeOfDay]}
- Conversation length: ${character.adaptationRules.conversationLength['medium']}

Safety Instructions:
${crisisResult.riskLevel !== 'low' ? '- This user may be at risk. Provide compassionate support and gently encourage professional help.' : ''}
${crisisResult.recommendedAction === 'escalate' ? '- Consider recommending additional resources or professional support.' : ''}

Recent conversation history:
${context.conversationHistory.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

Respond as ${character.name} to this message: "${userMessage}"

Guidelines:
- Stay in character
- Be supportive and helpful
- Keep responses conversational (1-3 sentences)
- If crisis detected, prioritize safety while maintaining character warmth
- Use natural Japanese expressions
- Show empathy and understanding`

    return systemPrompt
  }

  // Call AI provider with fallback
  private async callAIProvider(prompt: string, context: ConversationContext): Promise<string> {
    const sortedProviders = Array.from(this.providers.values())
      .filter(p => p.isActive)
      .sort((a, b) => a.priority - b.priority)

    for (const provider of sortedProviders) {
      try {
        // Check rate limits
        if (!this.checkRateLimit(provider.id)) {
          continue
        }

        const response = await this.callSpecificProvider(provider, prompt, context)
        return response
        
      } catch (error) {
        console.error(`Provider ${provider.id} failed:`, error.message)
        continue
      }
    }

    throw new Error('All AI providers failed')
  }

  // Call specific AI provider
  private async callSpecificProvider(provider: AIProvider, prompt: string, context: ConversationContext): Promise<string> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), provider.config.safeguards.responseTimeoutMs)

    try {
      let response: Response

      switch (provider.type) {
        case 'openai':
          response = await fetch(provider.config.endpoint!, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${provider.config.apiKey}`,
              'Content-Type': 'application/json'
            },
            signal: controller.signal,
            body: JSON.stringify({
              model: provider.config.model,
              messages: [{ role: 'system', content: prompt }],
              max_tokens: provider.config.maxTokens,
              temperature: provider.config.temperature
            })
          })
          break

        case 'anthropic':
          response = await fetch(provider.config.endpoint!, {
            method: 'POST',
            headers: {
              'x-api-key': provider.config.apiKey!,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01'
            },
            signal: controller.signal,
            body: JSON.stringify({
              model: provider.config.model,
              max_tokens: provider.config.maxTokens,
              temperature: provider.config.temperature,
              messages: [{ role: 'user', content: prompt }]
            })
          })
          break

        default:
          throw new Error(`Unsupported provider type: ${provider.type}`)
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Extract response based on provider format
      let content: string
      if (provider.type === 'openai') {
        content = data.choices[0].message.content
      } else if (provider.type === 'anthropic') {
        content = data.content[0].text
      } else {
        throw new Error('Unknown response format')
      }

      // Update rate limit tracking
      this.updateRateLimit(provider.id)

      return content.trim()

    } finally {
      clearTimeout(timeout)
    }
  }

  // Apply character-specific adaptations
  private applyCharacterAdaptations(response: string, character: AICharacterProfile, context: ConversationContext): string {
    // This would include more sophisticated adaptation logic
    // For now, basic cleanup and character consistency
    
    let adaptedResponse = response

    // Ensure response matches character tone
    if (character.id === 'luna' && !adaptedResponse.match(/優しい|温かい|大丈夫/)) {
      adaptedResponse = adaptedResponse.replace(/。$/, '。優しく見守っています。')
    }

    if (character.id === 'aria' && !adaptedResponse.match(/！|頑張|素晴らしい/)) {
      adaptedResponse = adaptedResponse.replace(/。$/, '！きっと大丈夫です。')
    }

    if (character.id === 'zen' && !adaptedResponse.match(/落ち着い|静か|心/)) {
      adaptedResponse = adaptedResponse.replace(/。$/, '。心を静めて、今この瞬間に意識を向けてみてください。')
    }

    return adaptedResponse
  }

  // Generate crisis response
  private generateCrisisResponse(messageId: string, crisisResult: CrisisDetectionResult, characterId: string): AIResponse {
    const character = this.characters.get(characterId)!
    const crisisTemplate = character.responseTemplates.crisis[0]
    
    return {
      messageId,
      content: crisisTemplate,
      character: character.name,
      confidence: 1.0,
      responseTime: 0,
      safeguardFlags: ['CRISIS_DETECTED', 'EMERGENCY_RESPONSE'],
      adaptations: ['CRISIS_MODE'],
      suggestedActions: [
        {
          type: 'escalate',
          description: '緊急時サポートに接続',
          priority: 1
        },
        ...crisisResult.resources.map(r => ({
          type: 'resource' as const,
          description: r.title,
          priority: r.priority
        }))
      ]
    }
  }

  // Generate fallback response
  private generateFallbackResponse(messageId: string, characterId: string, error: string): AIResponse {
    const character = this.characters.get(characterId)
    const fallbackContent = character ? 
      '申し訳ございません。少し時間をおいて、もう一度お話しください。' :
      'システムにエラーが発生しました。しばらくお待ちください。'

    return {
      messageId,
      content: fallbackContent,
      character: character?.name || 'System',
      confidence: 0.0,
      responseTime: 0,
      safeguardFlags: ['FALLBACK_RESPONSE', 'SYSTEM_ERROR'],
      adaptations: [],
      suggestedActions: [{
        type: 'followup',
        description: 'システム管理者に報告',
        priority: 2
      }]
    }
  }

  // Rate limiting
  private checkRateLimit(providerId: string): boolean {
    const provider = this.providers.get(providerId)!
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute
    
    const current = this.requestCounts.get(providerId)
    if (!current || now > current.resetTime) {
      this.requestCounts.set(providerId, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (current.count >= provider.config.rateLimit.requestsPerMinute) {
      return false
    }

    current.count++
    return true
  }

  private updateRateLimit(providerId: string): void {
    // Already handled in checkRateLimit
  }

  // Helper methods
  private updateConversationContext(context: ConversationContext, userMessage: string, aiResponse: AIResponse): void {
    context.conversationHistory.push({
      id: randomBytes(8).toString('hex'),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      metadata: {}
    })

    context.conversationHistory.push({
      id: aiResponse.messageId,
      role: 'assistant', 
      content: aiResponse.content,
      timestamp: new Date(),
      metadata: {
        characterId: context.characterId,
        responseTime: aiResponse.responseTime
      }
    })

    // Keep only last 20 messages
    if (context.conversationHistory.length > 20) {
      context.conversationHistory = context.conversationHistory.slice(-20)
    }
  }

  private generateSuggestedActions(userMessage: string, crisisResult: CrisisDetectionResult, context: ConversationContext): AIResponse['suggestedActions'] {
    const actions: AIResponse['suggestedActions'] = []

    if (crisisResult.riskLevel === 'high' || crisisResult.riskLevel === 'crisis') {
      actions.push({
        type: 'escalate',
        description: '専門カウンセラーに相談',
        priority: 1
      })
    }

    if (userMessage.includes('ストレス') || userMessage.includes('疲れ')) {
      actions.push({
        type: 'activity',
        description: 'リラクゼーション練習',
        priority: 2
      })
    }

    if (context.sessionType === 'checkin') {
      actions.push({
        type: 'followup',
        description: '今日のチャレンジを確認',
        priority: 3
      })
    }

    return actions
  }

  private getAppliedAdaptations(character: AICharacterProfile, context: ConversationContext): string[] {
    const adaptations: string[] = []
    
    if (context.currentMood) {
      adaptations.push(`mood_${context.currentMood}`)
    }
    
    const hour = new Date().getHours()
    if (hour < 12) adaptations.push('morning_energy')
    else if (hour > 21) adaptations.push('evening_calm')
    
    if (context.userProfile.relationshipLevel > 75) {
      adaptations.push('high_familiarity')
    }

    return adaptations
  }

  // Background tasks
  private startBackgroundTasks(): void {
    // Clean up old conversations every hour
    setInterval(() => {
      const cutoff = Date.now() - (24 * 60 * 60 * 1000) // 24 hours
      for (const [sessionId, context] of this.activeConversations.entries()) {
        const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]
        if (lastMessage && lastMessage.timestamp.getTime() < cutoff) {
          this.activeConversations.delete(sessionId)
        }
      }
    }, 60 * 60 * 1000)

    // Reset rate limits
    setInterval(() => {
      this.requestCounts.clear()
    }, 60 * 1000)
  }

  // Public methods for conversation management
  async startConversation(userId: string, characterId: string, sessionType: string = 'chat'): Promise<string> {
    const sessionId = randomBytes(16).toString('hex')
    
    const context: ConversationContext = {
      userId,
      anonymousId: createHash('sha256').update(userId).digest('hex').substring(0, 16),
      characterId,
      sessionId,
      conversationHistory: [],
      userProfile: {
        preferences: {},
        moodHistory: [],
        relationshipLevel: 50,
        riskFactors: []
      },
      sessionType: sessionType as any
    }

    this.activeConversations.set(sessionId, context)
    
    this.emit('conversationStarted', { sessionId, userId: context.anonymousId, characterId })
    
    return sessionId
  }

  async endConversation(sessionId: string): Promise<void> {
    const context = this.activeConversations.get(sessionId)
    if (context) {
      this.emit('conversationEnded', { 
        sessionId, 
        userId: context.anonymousId, 
        characterId: context.characterId,
        messageCount: context.conversationHistory.length
      })
      this.activeConversations.delete(sessionId)
    }
  }

  getActiveConversationCount(): number {
    return this.activeConversations.size
  }

  getCharacters(): AICharacterProfile[] {
    return Array.from(this.characters.values())
  }
}

export { AIIntegrationService }
export type {
  AIProvider,
  AIProviderConfig,
  AICharacterProfile,
  ConversationContext,
  AIMessage,
  AIResponse,
  CrisisDetectionResult
}