import { createClient } from '@/lib/supabase/client'

export interface ConversationMessage {
  id: string
  userId: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  emotion?: EmotionAnalysis
  metadata?: {
    audioUrl?: string
    duration?: number
    isVoice?: boolean
  }
}

export interface EmotionAnalysis {
  primary: 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'love' | 'neutral'
  confidence: number
  sentimentScore: number // -1 to 1
  keywords: string[]
  topics: string[]
}

export interface UserProfile {
  userId: string
  emotionHistory: EmotionAnalysis[]
  personalityTraits: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  preferredTopics: string[]
  communicationStyle: 'formal' | 'casual' | 'empathetic' | 'direct'
  concernAreas: string[]
  lastUpdated: Date
}

export interface ConversationSession {
  id: string
  userId: string
  messages: ConversationMessage[]
  summary?: string
  startTime: Date
  endTime?: Date
  overallEmotion?: EmotionAnalysis
  actionItems?: string[]
  tags?: string[]
}

class ConversationStorage {
  private readonly DB_NAME = 'mental_health_conversations'
  private readonly DB_VERSION = 1
  private db: IDBDatabase | null = null

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Conversations store
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationStore = db.createObjectStore('conversations', { keyPath: 'id' })
          conversationStore.createIndex('userId', 'userId', { unique: false })
          conversationStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' })
          sessionStore.createIndex('userId', 'userId', { unique: false })
          sessionStore.createIndex('startTime', 'startTime', { unique: false })
        }

        // User profiles store
        if (!db.objectStoreNames.contains('userProfiles')) {
          const profileStore = db.createObjectStore('userProfiles', { keyPath: 'userId' })
        }

        // Emotion analytics store
        if (!db.objectStoreNames.contains('emotionAnalytics')) {
          const emotionStore = db.createObjectStore('emotionAnalytics', { keyPath: 'id', autoIncrement: true })
          emotionStore.createIndex('userId', 'userId', { unique: false })
          emotionStore.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  async saveMessage(message: ConversationMessage): Promise<void> {
    if (!this.db) await this.initialize()
    
    // Save to Supabase
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { error } = await supabase.from('conversations').insert({
          user_id: user.id,
          content: message.content,
          role: message.role,
          emotion_primary: message.emotion?.primary,
          emotion_confidence: message.emotion?.confidence,
          sentiment_score: message.emotion?.sentimentScore,
          keywords: message.emotion?.keywords,
          topics: message.emotion?.topics,
          metadata: message.metadata ? JSON.stringify(message.metadata) : null
        })
        
        if (error) {
          console.error('Failed to save to Supabase:', error)
        }
      }
    } catch (error) {
      console.error('Supabase save error:', error)
    }
    
    // Also save to IndexedDB as backup
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['conversations'], 'readwrite')
      const store = transaction.objectStore('conversations')
      const request = store.add(message)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getConversationHistory(userId: string, limit: number = 50): Promise<ConversationMessage[]> {
    if (!this.db) await this.initialize()

    // Try to get from Supabase first
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit)
        
        if (!error && data) {
          return data.map(msg => ({
            id: msg.id,
            userId: msg.user_id,
            content: msg.content,
            role: msg.role as 'user' | 'assistant',
            timestamp: new Date(msg.created_at),
            emotion: msg.emotion_primary ? {
              primary: msg.emotion_primary,
              confidence: msg.emotion_confidence || 0,
              sentimentScore: msg.sentiment_score || 0,
              keywords: msg.keywords || [],
              topics: msg.topics || []
            } : undefined,
            metadata: msg.metadata ? JSON.parse(msg.metadata) : undefined
          }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch from Supabase:', error)
    }

    // Fallback to IndexedDB
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['conversations'], 'readonly')
      const store = transaction.objectStore('conversations')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => {
        const messages = request.result
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit)
        resolve(messages)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async saveSession(session: ConversationSession): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessions'], 'readwrite')
      const store = transaction.objectStore('sessions')
      const request = store.put(session)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userProfiles'], 'readonly')
      const store = transaction.objectStore('userProfiles')
      const request = store.get(userId)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async updateUserProfile(profile: UserProfile): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userProfiles'], 'readwrite')
      const store = transaction.objectStore('userProfiles')
      const request = store.put(profile)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getEmotionTrends(userId: string, days: number = 30): Promise<EmotionAnalysis[]> {
    if (!this.db) await this.initialize()

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['emotionAnalytics'], 'readonly')
      const store = transaction.objectStore('emotionAnalytics')
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => {
        const emotions = request.result
          .filter(e => new Date(e.timestamp) > cutoffDate)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        resolve(emotions)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async clearUserData(userId: string): Promise<void> {
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ['conversations', 'sessions', 'userProfiles', 'emotionAnalytics'],
        'readwrite'
      )

      // Clear conversations
      const convStore = transaction.objectStore('conversations')
      const convIndex = convStore.index('userId')
      const convRequest = convIndex.getAllKeys(userId)
      
      convRequest.onsuccess = () => {
        convRequest.result.forEach(key => convStore.delete(key))
      }

      // Clear sessions
      const sessionStore = transaction.objectStore('sessions')
      const sessionIndex = sessionStore.index('userId')
      const sessionRequest = sessionIndex.getAllKeys(userId)
      
      sessionRequest.onsuccess = () => {
        sessionRequest.result.forEach(key => sessionStore.delete(key))
      }

      // Clear profile
      transaction.objectStore('userProfiles').delete(userId)

      // Clear emotions
      const emotionStore = transaction.objectStore('emotionAnalytics')
      const emotionIndex = emotionStore.index('userId')
      const emotionRequest = emotionIndex.getAllKeys(userId)
      
      emotionRequest.onsuccess = () => {
        emotionRequest.result.forEach(key => emotionStore.delete(key))
      }

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }
}

export const conversationStorage = new ConversationStorage()