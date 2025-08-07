'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function EmotionDiaryPage() {
  const router = useRouter()
  const [selectedEmotion, setSelectedEmotion] = useState('')
  const [diaryText, setDiaryText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const emotions = [
    { id: 'happy', label: '嬉しい', emoji: '😊', color: '#fbbf24' },
    { id: 'calm', label: '穏やか', emoji: '😌', color: '#60a5fa' },
    { id: 'anxious', label: '不安', emoji: '😟', color: '#f87171' },
    { id: 'sad', label: '悲しい', emoji: '😢', color: '#a78bfa' },
    { id: 'angry', label: '怒り', emoji: '😠', color: '#fb923c' },
    { id: 'tired', label: '疲れ', emoji: '😫', color: '#94a3b8' }
  ]

  const tags = ['仕事', '家族', '友達', '健康', '趣味', '運動', '食事', '睡眠']

  const recentEntries = [
    { date: '8月6日', emotion: '😊', preview: '今日は友達と楽しい時間を過ごせた...', mood: 85 },
    { date: '8月5日', emotion: '😌', preview: '瞑想をして心が落ち着いた...', mood: 75 },
    { date: '8月4日', emotion: '😟', preview: '仕事のプレッシャーを感じている...', mood: 60 }
  ]

  const handleSave = () => {
    router.push('/analytics')
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #374151' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
            感情日記
          </h1>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Date */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>今日の日付</div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#f3f4f6' }}>2025年8月7日（水）</div>
        </div>

        {/* Emotion selection */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            今日の気分を選んでください
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => setSelectedEmotion(emotion.id)}
                style={{
                  padding: '16px',
                  backgroundColor: selectedEmotion === emotion.id ? emotion.color : '#374151',
                  border: selectedEmotion === emotion.id ? `2px solid ${emotion.color}` : '2px solid transparent',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: selectedEmotion === emotion.id ? 1 : 0.8
                }}
                onMouseEnter={(e) => { 
                  if (selectedEmotion !== emotion.id) {
                    e.currentTarget.style.backgroundColor = '#4b5563'
                  }
                }}
                onMouseLeave={(e) => { 
                  if (selectedEmotion !== emotion.id) {
                    e.currentTarget.style.backgroundColor = '#374151'
                  }
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{emotion.emoji}</div>
                <div style={{ 
                  fontSize: '14px', 
                  color: selectedEmotion === emotion.id ? '#111827' : '#d1d5db',
                  fontWeight: '500'
                }}>
                  {emotion.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Diary entry */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            今日の出来事を記録
          </h2>
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            placeholder="今日はどんな一日でしたか？感じたことを自由に書いてください..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '16px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#d1d5db',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none'
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#a3e635' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#374151' }}
          />
          <div style={{ textAlign: 'right', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{diaryText.length} 文字</span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            タグを追加
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedTags.includes(tag) ? '#a3e635' : '#374151',
                  color: selectedTags.includes(tag) ? '#111827' : '#d1d5db',
                  border: selectedTags.includes(tag) ? '1px solid #a3e635' : '1px solid #4b5563',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Recent entries */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
              最近の記録
            </h2>
            <button
              onClick={() => router.push('/analytics')}
              style={{
                fontSize: '14px',
                color: '#a3e635',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              すべて見る →
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentEntries.map((entry, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1f2937' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{entry.emotion}</span>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>{entry.date}</span>
                  </div>
                  <div style={{
                    backgroundColor: '#374151',
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}>
                    <span style={{ fontSize: '12px', color: '#a3e635', fontWeight: '600' }}>
                      {entry.mood}%
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>
                  {entry.preview}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!selectedEmotion || !diaryText}
          style={{
            width: '100%',
            padding: '16px',
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

      <MobileBottomNav />
    </div>
  )
}