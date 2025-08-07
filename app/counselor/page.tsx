'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function CounselorPage() {
  const router = useRouter()
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  
  const counselors = [
    {
      id: 1,
      name: '田中 明子',
      title: '臨床心理士',
      specialties: ['不安障害', 'うつ病', 'ストレス管理'],
      experience: '15年',
      rating: 4.9,
      reviews: 234,
      available: true,
      nextSlot: '今日 15:00',
      image: '👩‍⚕️',
      introduction: '認知行動療法を専門とし、不安やストレスに悩む方々をサポートしています。'
    },
    {
      id: 2,
      name: '佐藤 健一',
      title: '公認心理師',
      specialties: ['人間関係', 'キャリア相談', '自己成長'],
      experience: '10年',
      rating: 4.8,
      reviews: 189,
      available: true,
      nextSlot: '明日 10:00',
      image: '👨‍⚕️',
      introduction: '対人関係やキャリアの悩みを中心に、あなたの成長をサポートします。'
    },
    {
      id: 3,
      name: '山田 美香',
      title: '精神保健福祉士',
      specialties: ['家族関係', 'トラウマケア', 'グリーフケア'],
      experience: '12年',
      rating: 4.9,
      reviews: 156,
      available: false,
      nextSlot: '月曜日 14:00',
      image: '👩‍⚕️',
      introduction: '家族関係の改善やトラウマからの回復を専門的にサポートしています。'
    },
    {
      id: 4,
      name: '鈴木 太郎',
      title: '産業カウンセラー',
      specialties: ['職場ストレス', 'ワークライフバランス', 'リーダーシップ'],
      experience: '8年',
      rating: 4.7,
      reviews: 203,
      available: true,
      nextSlot: '今日 18:00',
      image: '👨‍⚕️',
      introduction: '職場での悩みやキャリア形成について、実践的なアドバイスを提供します。'
    }
  ]

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  const BookingModal = () => {
    const counselor = counselors.find(c => c.id === selectedCounselor)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    
    if (!counselor) return null

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#f3f4f6'
            }}>
              予約する
            </h2>
            <button
              onClick={() => setShowBookingModal(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9ca3af',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#111827',
            borderRadius: '12px'
          }}>
            <span style={{ fontSize: '32px' }}>{counselor.image}</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6' }}>
                {counselor.name}
              </div>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                {counselor.title}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '14px',
              color: '#9ca3af',
              marginBottom: '8px',
              display: 'block'
            }}>
              日付を選択
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f3f4f6',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#a3e635' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#374151' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '14px',
              color: '#9ca3af',
              marginBottom: '8px',
              display: 'block'
            }}>
              時間を選択
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px'
            }}>
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '10px',
                    backgroundColor: selectedTime === time ? '#a3e635' : '#374151',
                    color: selectedTime === time ? '#111827' : '#d1d5db',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTime !== time) {
                      e.currentTarget.style.backgroundColor = '#4b5563'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTime !== time) {
                      e.currentTarget.style.backgroundColor = '#374151'
                    }
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setShowBookingModal(false)
              alert('予約が完了しました！')
            }}
            disabled={!selectedDate || !selectedTime}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: selectedDate && selectedTime ? '#a3e635' : '#374151',
              color: selectedDate && selectedTime ? '#111827' : '#6b7280',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            予約を確定する
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      paddingBottom: '140px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #374151'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#f3f4f6',
          marginBottom: '8px'
        }}>
          専門カウンセラー
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#9ca3af'
        }}>
          資格を持つ専門家があなたをサポートします
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{
        padding: '16px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {['すべて', '本日対応可', 'オンライン', '対面'].map(filter => (
          <button
            key={filter}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === 'すべて' ? '#a3e635' : '#374151',
              color: filter === 'すべて' ? '#111827' : '#d1d5db',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Counselor list */}
      <div style={{ padding: '16px' }}>
        {counselors.map(counselor => (
          <div
            key={counselor.id}
            style={{
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '2px solid transparent'
            }}
            onClick={() => {
              setSelectedCounselor(counselor.id)
              setShowBookingModal(true)
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#a3e635'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#374151',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                flexShrink: 0
              }}>
                {counselor.image}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '4px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '4px'
                    }}>
                      {counselor.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#9ca3af'
                    }}>
                      {counselor.title} • 経験{counselor.experience}
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ color: '#fbbf24', fontSize: '14px' }}>⭐</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#f3f4f6' }}>
                      {counselor.rating}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                      ({counselor.reviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#d1d5db',
              marginBottom: '12px',
              lineHeight: '1.5'
            }}>
              {counselor.introduction}
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '16px'
            }}>
              {counselor.specialties.map(specialty => (
                <span
                  key={specialty}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#374151',
                    color: '#a3e635',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {specialty}
                </span>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: counselor.available ? '#a3e635' : '#ef4444',
                  borderRadius: '50%'
                }}></div>
                <span style={{
                  fontSize: '14px',
                  color: counselor.available ? '#a3e635' : '#ef4444'
                }}>
                  {counselor.available ? '対応可能' : '予約済み'}
                </span>
              </div>
              
              <div style={{
                fontSize: '14px',
                color: '#9ca3af'
              }}>
                次回: {counselor.nextSlot}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency support button */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        zIndex: 100
      }}>
        <button
          onClick={() => router.push('/emergency-support')}
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)'
          }}
        >
          <span style={{ fontSize: '24px' }}>🆘</span>
        </button>
      </div>

      {showBookingModal && <BookingModal />}

      <MobileBottomNav />
    </div>
  )
}