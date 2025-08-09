'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function EmergencySupportPage() {
  const router = useRouter()
  const [selectedReason, setSelectedReason] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
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
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(31, 41, 55, 0.4)'
      }}>
        <h1 style={{
          ...typographyPresets.pageTitle(isMobile),
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #ef4444 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          緊急サポート
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Alert message */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(31, 41, 55, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          border: '2px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <p style={{
                ...getTypographyStyles('base', isMobile),
                color: '#fca5a5',
                margin: 0,
                fontWeight: '500'
              }}>
                あなたは一人ではありません。私たちがサポートします。
                緊急の場合は、すぐに下記の連絡先にお電話ください。
              </p>
            </div>
          </div>
        </div>

        {/* What's happening section */}
        <div style={{
          background: 'rgba(31, 41, 55, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid rgba(55, 65, 81, 0.3)'
        }}>
        <h2 style={{
          ...typographyPresets.sectionHeader(isMobile)
        }}>
          どのような状況ですか？
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '8px'
        }}>
          {reasons.map(reason => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              style={{
                padding: '12px',
                backgroundColor: selectedReason === reason 
                  ? 'rgba(239, 68, 68, 0.2)' 
                  : 'rgba(55, 65, 81, 0.6)',
                color: selectedReason === reason ? '#ef4444' : '#d1d5db',
                border: selectedReason === reason 
                  ? '2px solid rgba(239, 68, 68, 0.4)' 
                  : '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '10px',
                ...getTypographyStyles('label', isMobile),
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
          ...typographyPresets.sectionHeader(isMobile)
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
                background: contact.type === 'emergency' 
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(31, 41, 55, 0.8) 100%)'
                  : 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: contact.type === 'emergency' 
                  ? '2px solid rgba(239, 68, 68, 0.4)' 
                  : '1px solid rgba(55, 65, 81, 0.3)'
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
                    ...typographyPresets.cardTitle(isMobile),
                    marginBottom: '4px'
                  }}>
                    {contact.name}
                  </h3>
                  <p style={{
                    ...getTypographyStyles('base', isMobile),
                    color: '#9ca3af',
                    margin: 0
                  }}>
                    {contact.description}
                  </p>
                </div>
                <span style={{
                  ...getTypographyStyles('small', isMobile),
                  backgroundColor: contact.type === 'emergency' 
                    ? 'rgba(239, 68, 68, 0.3)' 
                    : 'rgba(163, 230, 53, 0.2)',
                  color: contact.type === 'emergency' ? '#ef4444' : '#a3e635',
                  padding: '4px 8px',
                  borderRadius: '6px',
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
                  ...getTypographyStyles('h4', isMobile),
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
          ...typographyPresets.sectionHeader(isMobile)
        }}>
          今すぐできる対処法
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          {copingStrategies.map(strategy => (
            <button
              key={strategy.title}
              onClick={() => {
                if (strategy.action === 'breathing') {
                  // TODO: breathing-exercise page needs to be implemented
                  alert('呼吸エクササイズ機能は準備中です')
                }
              }}
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(55, 65, 81, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(163, 230, 53, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(163, 230, 53, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.3)'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {strategy.icon}
              </div>
              <h3 style={{
                ...getTypographyStyles('base', isMobile),
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '4px'
              }}>
                {strategy.title}
              </h3>
              <p style={{
                ...getTypographyStyles('small', isMobile),
                color: '#9ca3af',
                margin: 0
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
            background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
            color: '#0f172a',
            border: 'none',
            borderRadius: '12px',
            ...getTypographyStyles('large', isMobile),
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(163, 230, 53, 0.3)'
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(163, 230, 53, 0.4)'
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(163, 230, 53, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>💬</span>
            AIカウンセラーと話す
          </div>
        </button>

        {/* Additional Resources */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'rgba(55, 65, 81, 0.3)',
          borderRadius: '12px',
          borderLeft: '3px solid #60a5fa'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>💙</span>
            <div>
              <h4 style={{
                ...getTypographyStyles('label', isMobile),
                color: '#f3f4f6',
                marginBottom: '4px'
              }}>
                セルフケアのヒント
              </h4>
              <p style={{
                ...getTypographyStyles('small', isMobile),
                color: '#9ca3af',
                margin: 0
              }}>
                深呼吸をして、今この瞬間に集中しましょう。あなたの安全と健康が最優先です。必要なサポートを求めることは勇気ある行動です。
              </p>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}