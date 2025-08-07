'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

interface Message {
  id: number
  type: 'user' | 'character'
  content: string
  time: string
}

export default function ChatPage() {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState('luna')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'character',
      content: 'こんにちは！今日の調子はいかがですか？何かお話ししたいことがあれば、遠慮なく聞かせてくださいね。',
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const characters = [
    { id: 'luna', name: 'Luna', color: '#a3e635' },
    { id: 'aria', name: 'Aria', color: '#60a5fa' },
    { id: 'zen', name: 'Zen', color: '#f59e0b' },
  ]

  const quickResponses = [
    '元気です',
    '疲れています',
    'ありがとう',
    'もっと聞きたい'
  ]

  // Character responses based on personality
  const getCharacterResponse = (character: string, userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (character === 'luna') {
      if (lowerMessage.includes('元気') || lowerMessage.includes('いい')) {
        return 'それは素晴らしいですね！良い調子を保てているようで嬉しいです。今日は何か特別なことがありましたか？'
      } else if (lowerMessage.includes('疲れ') || lowerMessage.includes('つらい')) {
        return 'お疲れ様です。無理をせず、ゆっくり休息を取ることも大切ですよ。深呼吸をして、リラックスしてみましょうか。'
      } else if (lowerMessage.includes('ありがとう')) {
        return 'こちらこそ、お話を聞かせていただきありがとうございます。いつでもあなたのそばにいますからね。'
      } else {
        return 'なるほど、そうなんですね。もう少し詳しく聞かせていただけますか？あなたのペースで大丈夫ですよ。'
      }
    } else if (character === 'aria') {
      if (lowerMessage.includes('元気') || lowerMessage.includes('いい')) {
        return 'やったー！その調子です！今日も素敵な一日にしましょう！何か楽しいことをやってみませんか？'
      } else if (lowerMessage.includes('疲れ') || lowerMessage.includes('つらい')) {
        return '大丈夫！きっと明日はもっと良い日になりますよ！今は少し休んで、エネルギーをチャージしましょう！'
      } else {
        return 'わくわくしますね！一緒に頑張りましょう！どんなことでも、きっとうまくいきますよ！'
      }
    } else {
      if (lowerMessage.includes('疲れ') || lowerMessage.includes('つらい')) {
        return '心を静めて、今この瞬間に意識を向けてみましょう。呼吸に集中して、ゆっくりと深呼吸を3回してみてください。'
      } else {
        return '静かに内なる声に耳を傾けてみましょう。答えは既にあなたの中にあります。瞑想の時間を持つのも良いかもしれません。'
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: newMessage,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages([...messages, userMessage])
    setNewMessage('')
    setIsTyping(true)
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'character',
        content: getCharacterResponse(selectedCharacter, newMessage),
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickResponse = (response: string) => {
    setNewMessage(response)
    // Auto-send after setting the message
    setTimeout(() => {
      const form = document.getElementById('chat-form') as HTMLFormElement
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      }
    }, 100)
  }

  const handleCharacterChange = (characterId: string) => {
    setSelectedCharacter(characterId)
    const character = characters.find(c => c.id === characterId)
    
    // Clear messages and add new greeting
    setMessages([{
      id: 1,
      type: 'character',
      content: characterId === 'luna' 
        ? 'こんにちは！Lunaです。今日の調子はいかがですか？何でもお話しくださいね。'
        : characterId === 'aria'
        ? 'やっほー！Ariaだよ！今日も元気いっぱいにいこう！何か楽しいことあった？'
        : '静寂の中へようこそ。Zenです。心を落ち着けて、ゆっくりと話していきましょう。',
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    }])
  }

  const currentCharacter = characters.find(c => c.id === selectedCharacter) || characters[0]

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header with character selection */}
      <div style={{ padding: '16px', borderBottom: '1px solid #374151' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#f3f4f6', margin: '0 0 16px 0' }}>
          チャット
        </h1>
        
        {/* Character selection */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => handleCharacterChange(character.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: selectedCharacter === character.id ? character.color : '#374151',
                color: selectedCharacter === character.id ? '#111827' : '#d1d5db',
                borderRadius: '20px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: selectedCharacter === character.id ? '#111827' : character.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: '600',
                  color: selectedCharacter === character.id ? character.color : '#111827'
                }}>
                  AI
                </span>
              </div>
              {character.name}
            </button>
          ))}
        </div>

        {/* Character info */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={() => router.push('/characters')}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1f2937' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: currentCharacter.color,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#111827', fontSize: '12px', fontWeight: '600' }}>
              {currentCharacter.name.substring(0, 2)}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#f3f4f6' }}>{currentCharacter.name}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>オンライン</div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ 
        flex: 1, 
        padding: '16px', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: '8px'
            }}
          >
            {message.type === 'character' && (
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: currentCharacter.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: '#111827', fontSize: '10px', fontWeight: '600' }}>AI</span>
              </div>
            )}
            
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: message.type === 'user' ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
              backgroundColor: message.type === 'user' ? '#a3e635' : '#374151',
              color: message.type === 'user' ? '#111827' : '#f3f4f6'
            }}>
              <p style={{ 
                fontSize: '14px', 
                margin: '0 0 4px 0', 
                lineHeight: '1.4',
                fontWeight: message.type === 'user' ? '500' : '400'
              }}>
                {message.content}
              </p>
              <span style={{ 
                fontSize: '11px', 
                color: message.type === 'user' ? '#065f46' : '#9ca3af',
                fontWeight: '500'
              }}>
                {message.time}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: currentCharacter.color,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ color: '#111827', fontSize: '10px', fontWeight: '600' }}>AI</span>
            </div>
            <div style={{
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 6px',
              backgroundColor: '#374151'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ 
                  animation: 'typing 1.4s infinite',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}></span>
                <span style={{ 
                  animation: 'typing 1.4s infinite 0.2s',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}></span>
                <span style={{ 
                  animation: 'typing 1.4s infinite 0.4s',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick responses */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {quickResponses.map((response) => (
            <button
              key={response}
              onClick={() => handleQuickResponse(response)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#374151',
                color: '#d1d5db',
                border: '1px solid #4b5563',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563'
                e.currentTarget.style.color = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#374151'
                e.currentTarget.style.color = '#d1d5db'
              }}
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {/* Message input */}
      <div style={{ padding: '0 16px 16px' }}>
        <form id="chat-form" onSubmit={handleSendMessage} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          padding: '16px',
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          border: '1px solid #374151'
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#d1d5db',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: newMessage.trim() ? '#a3e635' : '#374151',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (newMessage.trim()) {
                e.currentTarget.style.backgroundColor = '#84cc16'
              }
            }}
            onMouseLeave={(e) => {
              if (newMessage.trim()) {
                e.currentTarget.style.backgroundColor = '#a3e635'
              }
            }}
          >
            <span style={{ color: newMessage.trim() ? '#111827' : '#6b7280', fontSize: '18px', fontWeight: '600' }}>➤</span>
          </button>
        </form>
      </div>

      <MobileBottomNav />

      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          30% {
            transform: translateY(-10px);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}