'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function ChatPage() {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState('luna')

  const characters = [
    { id: 'luna', name: 'Luna', color: '#a3e635' },
    { id: 'aria', name: 'Aria', color: '#60a5fa' },
    { id: 'zen', name: 'Zen', color: '#f59e0b' },
  ]

  const messages = [
    {
      id: 1,
      type: 'character',
      content: 'こんにちは！今日の調子はいかがですか？',
      time: '10:30'
    },
    {
      id: 2,
      type: 'user',
      content: 'おはようございます。今日は少し疲れています。',
      time: '10:32'
    },
    {
      id: 3,
      type: 'character',
      content: 'そうですね。疲れているときは無理をせず、ゆっくり休息を取ることが大切です。深呼吸をしてみましょう。',
      time: '10:33'
    }
  ]

  const quickResponses = [
    '元気です',
    '疲れています',
    'ありがとう',
    'もっと聞きたい'
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setNewMessage('')
  }

  const handleQuickResponse = (response: string) => {
    setNewMessage(response)
  }

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
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => setSelectedCharacter(character.id)}
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
            backgroundColor: '#a3e635',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#111827', fontSize: '12px', fontWeight: '600' }}>
              キャラクター
            </span>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#f3f4f6' }}>Luna</div>
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
                backgroundColor: '#a3e635',
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
        <form onSubmit={handleSendMessage} style={{ 
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
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#a3e635',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#84cc16'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#a3e635'
            }}
          >
            <span style={{ color: '#111827', fontSize: '18px', fontWeight: '600' }}>➤</span>
          </button>
        </form>
      </div>

      <MobileBottomNav />
    </div>
  )
}