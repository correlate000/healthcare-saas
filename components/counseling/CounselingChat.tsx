'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { VoiceInput } from '@/components/ui/voice-input'
import { Send, Mic, MicOff, Loader2, Heart, Brain, Sparkles } from 'lucide-react'
import { conversationStorage, ConversationMessage, EmotionAnalysis } from '@/lib/conversation-storage'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  emotion?: EmotionAnalysis
  isTyping?: boolean
}

export function CounselingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionAnalysis | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userId = 'user-' + (typeof window !== 'undefined' ? localStorage.getItem('userId') || Date.now() : Date.now())

  useEffect(() => {
    // ユーザーIDを保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId.replace('user-', ''))
    }
    
    // 過去の会話履歴を読み込み
    loadConversationHistory()
    
    // 初回メッセージ
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: 'こんにちは。今日はどのようなお話をお聞きしましょうか？お気軽にお話しください。',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversationHistory = async () => {
    try {
      await conversationStorage.initialize()
      const history = await conversationStorage.getConversationHistory(userId, 10)
      if (history.length > 0) {
        setMessages(history.map(h => ({
          ...h,
          timestamp: new Date(h.timestamp)
        })))
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error)
    }
  }

  const analyzeEmotion = async (text: string): Promise<EmotionAnalysis | null> => {
    try {
      const response = await fetch('/api/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userId })
      })

      if (response.ok) {
        const data = await response.json()
        return data.analysis
      }
    } catch (error) {
      console.error('Emotion analysis failed:', error)
    }
    return null
  }

  const getPersonalizedResponse = async (
    message: string,
    emotion: EmotionAnalysis | null
  ): Promise<{ response: string; suggestions: string[] }> => {
    try {
      const conversationHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await fetch('/api/personalized-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message,
          emotion,
          conversationHistory,
          responseStyle: 'empathetic'
        })
      })

      if (response.ok) {
        const data = await response.json()
        return {
          response: data.response,
          suggestions: data.suggestions || []
        }
      }
    } catch (error) {
      console.error('Failed to get personalized response:', error)
    }

    // フォールバック応答
    return {
      response: 'お話を聞かせていただき、ありがとうございます。あなたの気持ちに寄り添いたいと思います。',
      suggestions: []
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    // タイピング表示
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      // 感情分析
      const emotion = await analyzeEmotion(inputText)
      setCurrentEmotion(emotion)

      // ユーザーメッセージを保存
      const savedUserMessage: ConversationMessage = {
        ...userMessage,
        userId,
        emotion: emotion || undefined
      }
      await conversationStorage.saveMessage(savedUserMessage)

      // パーソナライズ応答を取得
      const { response, suggestions: newSuggestions } = await getPersonalizedResponse(
        inputText,
        emotion
      )
      setSuggestions(newSuggestions)

      // タイピング表示を削除して応答を追加
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing')
        const assistantMessage: Message = {
          id: Date.now().toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date()
        }

        // アシスタントメッセージを保存
        conversationStorage.saveMessage({
          ...assistantMessage,
          userId
        })

        return [...filtered, assistantMessage]
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => prev.filter(m => m.id !== 'typing'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = (transcript: string) => {
    setInputText(transcript)
    // 自動送信オプション
    if (transcript.trim()) {
      setTimeout(() => sendMessage(), 500)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
  }

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy':
        return '😊'
      case 'sadness':
        return '😢'
      case 'anger':
        return '😠'
      case 'fear':
        return '😰'
      case 'surprise':
        return '😮'
      case 'love':
        return '❤️'
      default:
        return '😐'
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      {/* 感情状態表示 */}
      {currentEmotion && (
        <Card className="p-3 mb-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                現在の感情状態
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getEmotionIcon(currentEmotion.primary)}</span>
              <span className="text-sm text-purple-700">
                {currentEmotion.primary === 'joy' ? '喜び' :
                 currentEmotion.primary === 'sadness' ? '悲しみ' :
                 currentEmotion.primary === 'anger' ? '怒り' :
                 currentEmotion.primary === 'fear' ? '不安' :
                 currentEmotion.primary === 'surprise' ? '驚き' :
                 currentEmotion.primary === 'love' ? '愛情' : '平常'}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              {message.isTyping ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">考えています...</span>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.emotion && message.role === 'user' && (
                    <div className="mt-2 pt-2 border-t border-blue-400">
                      <div className="flex items-center space-x-2 text-xs text-blue-100">
                        <Heart className="h-3 w-3" />
                        <span>
                          感情: {getEmotionIcon(message.emotion.primary)} 
                          ({Math.round(message.emotion.confidence * 100)}%確信度)
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 提案表示 */}
      {suggestions.length > 0 && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">おすすめのアクション</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs hover:bg-purple-100"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 入力エリア */}
      <div className="mt-4 space-y-3">
        {isVoiceMode ? (
          <VoiceInput
            onTranscript={handleVoiceInput}
            onError={(error) => console.error('Voice input error:', error)}
          />
        ) : (
          <div className="flex space-x-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="お気持ちをお聞かせください..."
              className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className="flex items-center space-x-2"
          >
            {isVoiceMode ? (
              <>
                <MicOff className="h-4 w-4" />
                <span>テキスト入力</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span>音声入力</span>
              </>
            )}
          </Button>

          {!isVoiceMode && (
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>送信</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}