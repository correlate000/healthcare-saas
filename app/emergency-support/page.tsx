'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmergencySupportPage() {
  const router = useRouter()
  const [selectedReason, setSelectedReason] = useState('')
  
  const emergencyContacts = [
    {
      name: 'いのちの電話',
      number: '0570-783-556',
      hours: '24時間',
      description: '心の悩みの相談',
      type: 'phone'
    },
    {
      name: '精神保健福祉センター',
      number: '0570-064-556',
      hours: '平日 9:00-17:00',
      description: '専門家による相談',
      type: 'phone'
    },
    {
      name: 'チャット相談',
      number: 'LINE',
      hours: '24時間',
      description: 'テキストでの相談',
      type: 'chat'
    },
    {
      name: '緊急医療',
      number: '119',
      hours: '24時間',
      description: '緊急時のみ',
      type: 'emergency'
    }
  ]

  const copingStrategies = [
    {
      icon: '🫁',
      title: '深呼吸エクササイズ',
      description: '4-7-8呼吸法を試してみましょう',
      action: 'breathing'
    },
    {
      icon: '🧊',
      title: '氷を持つ',
      description: '冷たい感覚で気持ちを落ち着ける',
      action: 'ice'
    },
    {
      icon: '🎵',
      title: '音楽を聴く',
      description: '落ち着く音楽でリラックス',
      action: 'music'
    },
    {
      icon: '📝',
      title: '気持ちを書き出す',
      description: '今の感情を紙に書いてみる',
      action: 'write'
    }
  ]

  const reasons = [
    '強い不安を感じている',
    '悲しみに押しつぶされそう',
    '怒りがコントロールできない',
    'パニックになりそう',
    '孤独でつらい',
    'その他'
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#374151',
            border: 'none',
            borderRadius: '50%',
            color: '#d1d5db',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ←
        </button>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#f3f4f6',
          margin: 0
        }}>
          緊急サポート
        </h1>
      </div>

      {/* Alert message */}
      <div style={{
        backgroundColor: '#fef2f2',
        border: '2px solid #ef4444',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#991b1b',
          margin: 0,
          lineHeight: '1.5',
          fontWeight: '500'
        }}>
          あなたは一人ではありません。私たちがサポートします。
          緊急の場合は、すぐに下記の連絡先にお電話ください。
        </p>
      </div>

      {/* What's happening section */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f3f4f6',
          marginBottom: '16px'
        }}>
          どのような状況ですか？
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {reasons.map(reason => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              style={{
                padding: '12px',
                backgroundColor: selectedReason === reason ? '#ef4444' : '#374151',
                color: selectedReason === reason ? 'white' : '#d1d5db',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency contacts */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f3f4f6',
          marginBottom: '16px'
        }}>
          すぐに相談できる窓口
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {emergencyContacts.map(contact => (
            <div
              key={contact.name}
              style={{
                backgroundColor: contact.type === 'emergency' ? '#7f1d1d' : '#1f2937',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: contact.type === 'emergency' ? '2px solid #ef4444' : 'none'
              }}
              onClick={() => {
                if (contact.type === 'phone' || contact.type === 'emergency') {
                  window.location.href = `tel:${contact.number}`
                }
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#f3f4f6',
                    marginBottom: '4px'
                  }}>
                    {contact.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    margin: 0
                  }}>
                    {contact.description}
                  </p>
                </div>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: contact.type === 'emergency' ? '#ef4444' : '#374151',
                  color: contact.type === 'emergency' ? 'white' : '#a3e635',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}>
                  {contact.hours}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: contact.type === 'emergency' ? '#ef4444' : '#a3e635'
                }}>
                  {contact.type === 'chat' ? '💬' : '📞'}
                </span>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#f3f4f6'
                }}>
                  {contact.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coping strategies */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f3f4f6',
          marginBottom: '16px'
        }}>
          今すぐできる対処法
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {copingStrategies.map(strategy => (
            <button
              key={strategy.title}
              onClick={() => {
                if (strategy.action === 'breathing') {
                  router.push('/breathing-exercise')
                }
              }}
              style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                padding: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#374151'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1f2937'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {strategy.icon}
              </div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '4px'
              }}>
                {strategy.title}
              </h3>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {strategy.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Safe place button */}
      <button
        onClick={() => router.push('/chat')}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#a3e635',
          color: '#111827',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635' }}
      >
        AIと話す
      </button>
    </div>
  )
}