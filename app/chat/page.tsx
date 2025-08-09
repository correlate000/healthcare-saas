'use client'

import { useState, useRef, useEffect } from 'react'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { getTypographyStyles, typographyPresets } from '@/styles/typography'

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
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const characters = [
    { id: 'luna', name: 'Luna', color: '#a3e635', bodyColor: '#a3e635', bellyColor: '#ecfccb' },
    { id: 'aria', name: 'Aria', color: '#60a5fa', bodyColor: '#60a5fa', bellyColor: '#dbeafe' },
    { id: 'zen', name: 'Zen', color: '#f59e0b', bodyColor: '#f59e0b', bellyColor: '#fed7aa' },
  ]
  
  // Bird character SVG component
  const BirdCharacter = ({ bodyColor, bellyColor, size = 30 }: { bodyColor: string, bellyColor: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <ellipse cx="50" cy="55" rx="35" ry="38" fill={bodyColor} />
      <ellipse cx="50" cy="60" rx="25" ry="28" fill={bellyColor} />
      <ellipse cx="25" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(-20 25 50)" />
      <ellipse cx="75" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(20 75 50)" />
      <circle cx="40" cy="45" r="6" fill="white" />
      <circle cx="42" cy="45" r="4" fill="#111827" />
      <circle cx="43" cy="44" r="2" fill="white" />
      <circle cx="60" cy="45" r="6" fill="white" />
      <circle cx="58" cy="45" r="4" fill="#111827" />
      <circle cx="59" cy="44" r="2" fill="white" />
      <path d="M50 52 L45 57 L55 57 Z" fill="#fbbf24" />
    </svg>
  )

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Check scroll position to show/hide scroll button
  useEffect(() => {
    const checkScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
        setShowScrollButton(!isAtBottom)
      }
    }

    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      checkScroll() // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
    
    // Reset scroll to top for new character
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0
    }
  }

  const currentCharacter = characters.find(c => c.id === selectedCharacter) || characters[0]

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header with large character display */}
      <div style={{ 
        background: `linear-gradient(180deg, ${currentCharacter.color}15 0%, #111827 100%)`,
        borderBottom: '1px solid #374151', 
        flexShrink: 0 
      }}>
        {/* Character selection tabs */}
        <div style={{ 
          padding: '12px 16px 0',
          display: 'flex',
          gap: '4px'
        }}>
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => handleCharacterChange(character.id)}
              style={{
                flex: 1,
                padding: '10px 8px',
                backgroundColor: selectedCharacter === character.id 
                  ? 'rgba(31, 41, 55, 0.8)' 
                  : 'transparent',
                color: selectedCharacter === character.id ? '#f3f4f6' : '#9ca3af',
                borderRadius: '12px 12px 0 0',
                border: 'none',
                ...getTypographyStyles('small'),
                fontWeight: selectedCharacter === character.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <BirdCharacter 
                bodyColor={character.bodyColor} 
                bellyColor={character.bellyColor}
                size={20}
              />
              {character.name}
            </button>
          ))}
        </div>
        
        {/* Large character display */}
        <div style={{ 
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: `radial-gradient(circle, ${currentCharacter.color}20 0%, transparent 70%)`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <BirdCharacter 
              bodyColor={currentCharacter.bodyColor} 
              bellyColor={currentCharacter.bellyColor}
              size={80}
            />
          </div>
          <h2 style={{ 
            ...getTypographyStyles('h3'), 
            fontWeight: '700', 
            color: currentCharacter.color,
            marginBottom: '4px'
          }}>
            {currentCharacter.name}
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#a3e635',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>
            <span style={{ 
              ...getTypographyStyles('small'), 
              color: '#9ca3af' 
            }}>
              話し相手になります
            </span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        style={{ 
          flex: 1, 
          padding: '20px', 
          paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minHeight: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(31, 41, 55, 0.2) 100%)',
          position: 'relative'
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
                width: '44px',
                height: '44px',
                background: `linear-gradient(135deg, ${currentCharacter.color}30 0%, ${currentCharacter.color}10 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 2px 8px ${currentCharacter.color}20`
              }}>
                <BirdCharacter 
                  bodyColor={currentCharacter.bodyColor} 
                  bellyColor={currentCharacter.bellyColor}
                  size={36}
                />
              </div>
            )}
            
            <div style={{
              maxWidth: '70%',
              padding: '14px 18px',
              borderRadius: message.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              backgroundColor: message.type === 'user' ? '#a3e635' : '#1f2937',
              color: message.type === 'user' ? '#111827' : '#f3f4f6',
              boxShadow: message.type === 'user' 
                ? '0 2px 8px rgba(163, 230, 53, 0.2)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: message.type === 'character' ? `1px solid ${currentCharacter.color}20` : 'none'
            }}>
              <p style={{ 
                ...getTypographyStyles('base'),
                margin: '0 0 4px 0', 
                lineHeight: '1.4',
                fontWeight: message.type === 'user' ? '500' : '400'
              }}>
                {message.content}
              </p>
              <span style={{ 
                ...getTypographyStyles('caption'), 
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
              width: '44px',
              height: '44px',
              background: `linear-gradient(135deg, ${currentCharacter.color}30 0%, ${currentCharacter.color}10 100%)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `0 2px 8px ${currentCharacter.color}20`,
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              <BirdCharacter 
                bodyColor={currentCharacter.bodyColor} 
                bellyColor={currentCharacter.bellyColor}
                size={36}
              />
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
        
        <div ref={messagesEndRef} style={{ height: '1px' }} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          style={{
            position: 'absolute',
            bottom: '180px',
            right: '20px',
            width: '44px',
            height: '44px',
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            border: '1px solid rgba(163, 230, 53, 0.3)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(163, 230, 53, 0.2)'
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.9)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 14L5 9L6.41 7.59L10 11.17L13.59 7.59L15 9L10 14Z" fill="#a3e635"/>
            <path d="M10 18L5 13L6.41 11.59L10 15.17L13.59 11.59L15 13L10 18Z" fill="#a3e635"/>
          </svg>
        </button>
      )}

      {/* Quick responses - only show for the very first message */}
      {messages.length === 1 && (
        <div style={{ padding: '0 16px 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                ...getTypographyStyles('base'),
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
      )}

      {/* Message input */}
      <div style={{ 
        padding: '16px', 
        paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
        flexShrink: 0,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(55, 65, 81, 0.3)',
        marginBottom: '0'
      }}>
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
              ...getTypographyStyles('base'),
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
            <span style={{ color: newMessage.trim() ? '#111827' : '#6b7280', ...getTypographyStyles('h4'), fontWeight: '600' }}>➤</span>
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}