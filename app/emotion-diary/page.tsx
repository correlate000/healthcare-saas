'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function EmotionDiaryPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEmotion, setSelectedEmotion] = useState('')
  const [diaryText, setDiaryText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const emotions = [
    { emoji: '😊', label: '幸せ', color: '#fbbf24' },
    { emoji: '😌', label: '穏やか', color: '#60a5fa' },
    { emoji: '😔', label: '悲しい', color: '#818cf8' },
    { emoji: '😰', label: '不安', color: '#f87171' },
    { emoji: '😤', label: 'イライラ', color: '#fb923c' },
    { emoji: '😴', label: '疲れた', color: '#a78bfa' }
  ]

  const tags = [
    '仕事', '家族', '友人', '健康', '趣味',
    '運動', '食事', '睡眠', '天気', 'その他'
  ]

  const diaryEntries = [
    {
      date: '2025/08/07',
      emotion: '😊',
      title: '充実した一日',
      content: '今日は朝から調子が良く、仕事も順調に進んだ。昼休みに同僚と楽しく話せて気分転換になった。',
      tags: ['仕事', '友人'],
      mood: 85
    },
    {
      date: '2025/08/06',
      emotion: '😌',
      title: '穏やかな休日',
      content: '久しぶりにゆっくり過ごせた。読書と散歩で心が落ち着いた。',
      tags: ['趣味', '運動'],
      mood: 75
    },
    {
      date: '2025/08/05',
      emotion: '😰',
      title: 'プレゼンの緊張',
      content: '大事なプレゼンがあって緊張した。でも無事に終わってホッとしている。',
      tags: ['仕事'],
      mood: 60
    }
  ]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#f3f4f6',
            margin: 0
          }}>
            感情日記
          </h1>
          <button
            onClick={() => {/* カレンダービュー */}}
            style={{
              backgroundColor: '#374151',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#d1d5db',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            📅 カレンダー
          </button>
        </div>
      </div>

      {/* New entry section */}
      <div style={{
        padding: '20px',
        backgroundColor: '#1f2937',
        marginBottom: '20px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f3f4f6',
          marginBottom: '16px'
        }}>
          今日の気持ちを記録
        </h2>

        {/* Date selector */}
        <div style={{
          marginBottom: '20px'
        }}>
          <label style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '8px',
            display: 'block'
          }}>
            日付
          </label>
          <input
            type="date"
            value={formatDate(selectedDate)}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
          />
        </div>

        {/* Emotion selector */}
        <div style={{
          marginBottom: '20px'
        }}>
          <label style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '12px',
            display: 'block'
          }}>
            今の感情は？
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            {emotions.map(emotion => (
              <button
                key={emotion.label}
                onClick={() => setSelectedEmotion(emotion.emoji)}
                style={{
                  backgroundColor: selectedEmotion === emotion.emoji ? emotion.color : '#374151',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: selectedEmotion === emotion.emoji ? 1 : 0.7
                }}
                onMouseEnter={(e) => {
                  if (selectedEmotion !== emotion.emoji) {
                    e.currentTarget.style.opacity = '1'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedEmotion !== emotion.emoji) {
                    e.currentTarget.style.opacity = '0.7'
                  }
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>
                  {emotion.emoji}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: selectedEmotion === emotion.emoji ? '#111827' : '#d1d5db',
                  fontWeight: '500'
                }}>
                  {emotion.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Diary text */}
        <div style={{
          marginBottom: '20px'
        }}>
          <label style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '8px',
            display: 'block'
          }}>
            今日の出来事や気持ち
          </label>
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            placeholder="今日はどんな一日でしたか？"
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#a3e635' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#374151' }}
          />
        </div>

        {/* Tags */}
        <div style={{
          marginBottom: '20px'
        }}>
          <label style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '12px',
            display: 'block'
          }}>
            タグを選択
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag))
                  } else {
                    setSelectedTags([...selectedTags, tag])
                  }
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: selectedTags.includes(tag) ? '#a3e635' : '#374151',
                  color: selectedTags.includes(tag) ? '#111827' : '#d1d5db',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={() => {
            // Save diary entry
            alert('日記を保存しました！')
          }}
          disabled={!selectedEmotion || !diaryText}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: selectedEmotion && diaryText ? '#a3e635' : '#374151',
            color: selectedEmotion && diaryText ? '#111827' : '#6b7280',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: selectedEmotion && diaryText ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease'
          }}
        >
          記録を保存
        </button>
      </div>

      {/* Past entries */}
      <div style={{
        padding: '0 20px 20px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f3f4f6',
          marginBottom: '16px'
        }}>
          過去の記録
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {diaryEntries.map((entry, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#1f2937',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: `4px solid ${emotions.find(e => e.emoji === entry.emotion)?.color || '#374151'}`
              }}
              onClick={() => {/* View detail */}}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>{entry.emotion}</span>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '2px'
                    }}>
                      {entry.title}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      {entry.date}
                    </span>
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#374151',
                  borderRadius: '8px',
                  padding: '4px 8px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#a3e635',
                    fontWeight: '600'
                  }}>
                    {entry.mood}%
                  </span>
                </div>
              </div>

              <p style={{
                fontSize: '14px',
                color: '#d1d5db',
                lineHeight: '1.5',
                marginBottom: '12px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {entry.content}
              </p>

              <div style={{
                display: 'flex',
                gap: '6px'
              }}>
                {entry.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#374151',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#9ca3af'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}