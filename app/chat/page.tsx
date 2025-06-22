'use client'

import { useState, useEffect, useRef } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Send, Heart, Smile, Star, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CharacterReaction,
  FloatingNotification,
  RippleButton 
} from '@/components/ui/micro-interactions'

// AIキャラクターデータ
const characters = {
  luna: {
    name: 'Luna',
    avatar: '🌙',
    color: 'from-purple-400 to-purple-600',
    personality: 'caring',
    greeting: 'こんにちは！今日はどんな気分ですか？✨'
  },
  aria: {
    name: 'Aria', 
    avatar: '🌟',
    color: 'from-teal-400 to-teal-600',
    personality: 'energetic',
    greeting: 'やあ！今日も素晴らしい一日にしましょう！🎉'
  },
  zen: {
    name: 'Zen',
    avatar: '🧘‍♂️',
    color: 'from-indigo-400 to-indigo-600',
    personality: 'peaceful',
    greeting: '心静かに、今この瞬間に集中してみましょう。🕯️'
  }
}

// サンプル会話履歴
const initialMessages = [
  {
    id: 1,
    character: 'luna',
    message: 'こんにちは！今日はどんな気分ですか？✨',
    timestamp: '10:30',
    type: 'character'
  }
]

export default function ChatPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<keyof typeof characters>('luna')
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showReaction, setShowReaction] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
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

    // AIキャラクターの応答をシミュレート
    setTimeout(() => {
      const responses = {
        luna: [
          'それは素晴らしい気持ちですね。🌙 もう少し詳しく教えてください。',
          'あなたの感情を大切にしていますよ。✨ 一歩ずつ進んでいきましょう。',
          '今日のあなたは特に輝いて見えます。💫',
          'その感情は自然なものです。一緒に向き合ってみましょう。🌟'
        ],
        aria: [
          'わあ！それは素敵ですね！🎉 もっと聞かせてください！',
          'あなたの前向きなエネルギーを感じます！⚡ 一緒に楽しみましょう！',
          'その調子です！✨ あなたならできると信じています！',
          '今日はなんだか特別な日になりそうですね！🌟'
        ],
        zen: [
          '深く呼吸して、その感情を受け入れてみましょう。🧘‍♂️',
          '今この瞬間に意識を向けることで、心が落ち着きます。🕯️',
          'あなたの内なる平和を感じています。✨',
          '静寂の中に、答えが見つかることがあります。🌿'
        ]
      }

      const responseList = responses[selectedCharacter]
      const randomResponse = responseList[Math.floor(Math.random() * responseList.length)]

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
      
      // キャラクター反応表示
      setShowReaction(true)
      setTimeout(() => setShowReaction(false), 3000)
      
      // 通知表示
      setTimeout(() => setShowNotification(true), 1000)
    }, 1500)
  }

  const handleCharacterChange = (charId: keyof typeof characters) => {
    setSelectedCharacter(charId)
    
    // キャラクター切り替え時の挨拶メッセージ
    const greetingMessage = {
      id: Date.now(),
      character: charId,
      message: characters[charId].greeting,
      timestamp: new Date().toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'character' as const
    }
    
    setMessages(prev => [...prev, greetingMessage])
  }

  return (
    <AppLayout title="AIチャット" showBackButton>
      <div className="flex flex-col h-[calc(100vh-140px)] max-w-md mx-auto">
        
        {/* マイクロインタラクション */}
        <CharacterReaction
          isVisible={showReaction}
          character={{
            name: character.name,
            avatar: character.avatar,
            color: character.color
          }}
          reaction="happy"
        />

        <FloatingNotification
          isVisible={showNotification}
          title={`${character.name}からの返事`}
          message="新しいメッセージが届きました！"
          type="info"
          onClose={() => setShowNotification(false)}
        />

        {/* キャラクター選択 */}
        <div className="p-4">
          <Card className={`bg-gradient-to-r ${character.color} text-white`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                {Object.entries(characters).map(([id, char]) => (
                  <RippleButton
                    key={id}
                    onClick={() => handleCharacterChange(id as keyof typeof characters)}
                    className={`text-2xl p-2 rounded-full transition-all ${
                      selectedCharacter === id 
                        ? 'bg-white bg-opacity-20 scale-110' 
                        : 'hover:scale-105 bg-white bg-opacity-10'
                    }`}
                  >
                    {char.avatar}
                  </RippleButton>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{character.name}</h3>
                  <p className="text-sm text-white text-opacity-80">
                    いつでもあなたのそばにいます
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-xs">オンライン</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.message}</p>
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp}
                  </div>
                </div>
                
                {message.type === 'character' && (
                  <div className="order-1 mr-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-lg">
                        {characters[message.character as keyof typeof characters].avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* タイピング表示 */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-lg">
                    {character.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
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
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* メッセージ入力 */}
        <div className="p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`${character.name}にメッセージを送る...`}
              className="flex-1 rounded-full border-2 border-gray-200 focus:border-blue-400"
              disabled={isTyping}
            />
            <RippleButton
              type="submit"
              disabled={!newMessage.trim() || isTyping}
              className="w-12 h-12 p-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </RippleButton>
          </form>
          
          {/* クイックリアクション */}
          <div className="flex justify-center space-x-4 mt-3">
            {[
              { icon: Heart, label: '感謝', color: 'text-red-500' },
              { icon: Smile, label: '嬉しい', color: 'text-yellow-500' },
              { icon: Star, label: '素晴らしい', color: 'text-blue-500' },
              { icon: Sparkles, label: '感動', color: 'text-purple-500' }
            ].map((reaction, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setNewMessage(reaction.label)}
                className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${reaction.color}`}
              >
                <reaction.icon className="h-5 w-5" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}