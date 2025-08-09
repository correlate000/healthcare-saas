'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function ExercisesPage() {
  const router = useRouter()
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const exercises = [
    {
      id: 1,
      title: '朝の軽いストレッチ',
      difficulty: 'easy',
      duration: '5分',
      icon: '🌅',
      description: '一日を気持ちよく始めるための簡単なストレッチ',
      color: '#10b981'
    },
    {
      id: 2,
      title: 'デスクワーク疲れ解消',
      difficulty: 'easy',
      duration: '3分',
      icon: '💻',
      description: '座ったままできる肩と首のエクササイズ',
      color: '#60a5fa'
    },
    {
      id: 3,
      title: '体幹トレーニング',
      difficulty: 'medium',
      duration: '10分',
      icon: '💪',
      description: 'コアを鍛える中級エクササイズ',
      color: '#f59e0b'
    },
    {
      id: 4,
      title: 'リラックスヨガ',
      difficulty: 'easy',
      duration: '15分',
      icon: '🧘',
      description: '心身をリラックスさせるヨガポーズ',
      color: '#a78bfa'
    },
    {
      id: 5,
      title: 'HIIT トレーニング',
      difficulty: 'hard',
      duration: '20分',
      icon: '🔥',
      description: '高強度インターバルトレーニング',
      color: '#ef4444'
    }
  ]

  const difficulties = [
    { id: 'all', label: 'すべて', color: '#9ca3af' },
    { id: 'easy', label: '簡単', color: '#10b981' },
    { id: 'medium', label: '普通', color: '#f59e0b' },
    { id: 'hard', label: '難しい', color: '#ef4444' }
  ]

  const filteredExercises = selectedDifficulty === 'all'
    ? exercises
    : exercises.filter(e => e.difficulty === selectedDifficulty)

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '#10b981'
      case 'medium': return '#f59e0b'
      case 'hard': return '#ef4444'
      default: return '#9ca3af'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '簡単'
      case 'medium': return '普通'
      case 'hard': return '難しい'
      default: return ''
    }
  }

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
          ...typographyPresets.pageTitle(),
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #10b981 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          エクササイズ
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Difficulty Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {difficulties.map(diff => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id)}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedDifficulty === diff.id
                  ? `linear-gradient(135deg, ${diff.color} 0%, ${diff.color}dd 100%)`
                  : 'rgba(55, 65, 81, 0.6)',
                color: selectedDifficulty === diff.id ? 'white' : '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                ...getTypographyStyles('button'),
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {diff.label}
            </button>
          ))}
        </div>

        {/* Exercises List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {filteredExercises.map(exercise => (
            <div
              key={exercise.id}
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(55, 65, 81, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onClick={() => alert(`エクササイズ「${exercise.title}」を開始します（準備中）`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.6)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              {/* Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: `${exercise.color}20`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                flexShrink: 0
              }}>
                {exercise.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <h3 style={{
                    ...getTypographyStyles('large'),
                    fontWeight: '600',
                    color: '#f3f4f6'
                  }}>
                    {exercise.title}
                  </h3>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: `${getDifficultyColor(exercise.difficulty)}20`,
                    color: getDifficultyColor(exercise.difficulty),
                    borderRadius: '6px',
                    ...getTypographyStyles('caption'),
                    fontWeight: '600'
                  }}>
                    {getDifficultyLabel(exercise.difficulty)}
                  </span>
                </div>
                <p style={{
                  ...getTypographyStyles('base'),
                  color: '#9ca3af',
                  marginBottom: '4px'
                }}>
                  {exercise.description}
                </p>
                <div style={{
                  ...getTypographyStyles('small'),
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ⏱ {exercise.duration}
                </div>
              </div>

              {/* Arrow */}
              <div style={{
                color: '#9ca3af',
                fontSize: '20px'
              }}>
                →
              </div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => router.push('/content-library')}
          style={{
            width: '100%',
            padding: '16px',
            marginTop: '24px',
            backgroundColor: 'rgba(55, 65, 81, 0.6)',
            color: '#d1d5db',
            border: '1px solid rgba(55, 65, 81, 0.3)',
            borderRadius: '12px',
            ...getTypographyStyles('button'),
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          ライブラリに戻る
        </button>
      </div>

      <MobileBottomNav />
    </div>
  )
}