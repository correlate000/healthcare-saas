'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

// AI Character data
const characters = {
  luna: {
    name: 'Luna',
    avatar: '🌙',
    greeting: 'XXさん、今日も一日お疲れ様でした。継続して記録していることが素晴らしいですね。明日もよい一日になりますように。'
  }
}

// Sample conversation based on wireframe
const initialMessages = [
  {
    id: 1,
    character: 'luna',
    message: 'XXさん、今日も一日お疲れ様でした。継続して記録していることが素晴らしいですね。明日もよい一日になりますように。',
    timestamp: '18:30',
    type: 'character'
  }
]

export default function ChatPage() {
  const router = useRouter()
  const [selectedCharacter] = useState<keyof typeof characters>('luna')
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const character = characters[selectedCharacter]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      character: 'user',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'user' as const
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'ありがとうございます。今日の気持ちはいかがでしたか？',
        'お疲れ様です。明日もお互い頑張りましょう。',
        '継続は力なりですね。素晴らしい取り組みです。',
        '今日はどんなことがありましたか？'
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const characterMessage = {
        id: Date.now() + 1,
        character: selectedCharacter,
        message: randomResponse,
        timestamp: new Date().toLocaleTimeString('ja-JP', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        type: 'character' as const
      }

      setMessages(prev => [...prev, characterMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Character area */}
      <div className="p-6 flex flex-col items-center">
        <div className="w-80 h-80 bg-lime-400 rounded-3xl flex items-center justify-center mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <span className="text-gray-800 text-xl font-bold tracking-wide">キャラクター</span>
        </div>
        
        {/* Achievement message - improved typography */}
        <div className="text-center mb-6">
          <h2 className="text-white text-xl font-bold mb-3 tracking-wide">今日もお疲れ様でした</h2>
          <p className="text-gray-200 text-sm font-medium">記録完了 - 15日連続ログイン達成！</p>
        </div>
        
        {/* Weekly records button - enhanced visual */}
        <Button className="w-full max-w-xs bg-gray-600/90 text-white hover:bg-gray-500 rounded-xl mb-6 font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200">
          今週の記録を見る
        </Button>
      </div>

      {/* Character comment section */}
      <div className="px-6 mb-4">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">XX</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium mb-1">XX:キャラクター名からのコメント</p>
          </div>
        </div>
        
        <div className="bg-gray-700/95 rounded-2xl p-5 mb-6 border border-gray-600/30 shadow-sm">
          <p className="text-gray-100 text-sm leading-relaxed font-medium">
            XXさん、今日も一日お疲れ様でした。継続して記録していることが素晴らしいですね。明日もよい一日になりますように。
          </p>
          <div className="mt-4 text-gray-400 text-xs font-medium">
            健康管理を続けることで、心身のバランスが整ってきますよ。
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 mb-4">
        <AnimatePresence>
          {messages.slice(0, 0).map((message) => ( // Hide initial message since it's shown above
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gray-600/90 text-white border border-gray-500/30'
                      : 'bg-gray-700/90 text-gray-100 border border-gray-600/30'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-700/90 px-4 py-3 rounded-2xl shadow-sm border border-gray-600/30">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gray-300 rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-6 pt-0 pb-20">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 bg-gray-700/90 text-white placeholder-gray-400 px-4 py-3 rounded-2xl border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 font-medium"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isTyping}
            className="w-12 h-12 bg-gray-600/90 hover:bg-gray-500 disabled:bg-gray-700/50 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none hover:scale-105 disabled:scale-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}