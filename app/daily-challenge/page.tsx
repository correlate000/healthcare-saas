'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function DailyChallengePage() {
  const router = useRouter()
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)

  const challenges = [
    {
      id: 1,
      title: '朝の瞑想',
      description: '5分間の呼吸瞑想を行いましょう',
      xp: 50,
      time: '5分',
      category: 'マインドフルネス',
      difficulty: '簡単',
      completed: false,
      locked: false
    },
    {
      id: 2,
      title: '感謝日記を書く',
      description: '今日感謝したい3つのことを記録',
      xp: 40,
      time: '3分',
      category: '記録',
      difficulty: '簡単',
      completed: false,
      locked: false
    },
    {
      id: 3,
      title: '15分ウォーキング',
      description: '外に出て軽い散歩をしましょう',
      xp: 60,
      time: '15分',
      category: '運動',
      difficulty: '普通',
      completed: false,
      locked: false
    },
    {
      id: 4,
      title: 'チームに投稿',
      description: '今日の気分をチームと共有',
      xp: 30,
      time: '2分',
      category: 'ソーシャル',
      difficulty: '簡単',
      completed: false,
      locked: false
    },
    {
      id: 5,
      title: 'ストレッチ',
      description: '仕事の合間に体をほぐしましょう',
      xp: 40,
      time: '5分',
      category: '運動',
      difficulty: '簡単',
      completed: false,
      locked: true
    },
    {
      id: 6,
      title: 'デジタルデトックス',
      description: '1時間スマホから離れる',
      xp: 80,
      time: '60分',
      category: 'ウェルビーイング',
      difficulty: '難しい',
      completed: false,
      locked: true
    }
  ]

  const streakData = {
    current: 15,
    best: 23,
    weeklyGoal: 5,
    weeklyProgress: 4
  }

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case '簡単': return '#65a30d'
      case '普通': return '#facc15'
      case '難しい': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const handleStartChallenge = (id: number) => {
    if (id === 1) {
      router.push('/meditation')
    } else if (id === 3) {
      router.push('/walking')
    } else if (id === 4) {
      router.push('/team-connect')
    } else {
      setSelectedChallenge(id)
    }
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
            デイリーチャレンジ
          </h1>
          <button
            onClick={() => router.push('/daily-challenge/streak')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#374151',
              color: '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
          >
            🔥 ストリーク
          </button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Streak overview */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          padding: '20px',
          marginBottom: '24px',
          border: '2px solid #a3e635'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>現在のストリーク</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '32px', fontWeight: '700', color: '#a3e635' }}>🔥 {streakData.current}</span>
                <span style={{ fontSize: '16px', color: '#d1d5db' }}>日</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>最高記録</div>
              <div style={{ fontSize: '20px', fontWeight: '600', color: '#f3f4f6' }}>{streakData.best}日</div>
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>今週の目標</span>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>{streakData.weeklyProgress}/{streakData.weeklyGoal}日</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#374151',
              borderRadius: '4px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                height: '100%',
                width: `${(streakData.weeklyProgress / streakData.weeklyGoal) * 100}%`,
                backgroundColor: '#a3e635',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        </div>

        {/* Today's challenges */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            今日のチャレンジ
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                style={{
                  backgroundColor: challenge.locked ? '#1a1f2e' : '#1f2937',
                  borderRadius: '12px',
                  padding: '16px',
                  opacity: challenge.locked ? 0.6 : 1,
                  cursor: challenge.locked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  border: selectedChallenge === challenge.id ? '2px solid #a3e635' : '2px solid transparent'
                }}
                onClick={() => !challenge.locked && handleStartChallenge(challenge.id)}
                onMouseEnter={(e) => { 
                  if (!challenge.locked) {
                    e.currentTarget.style.backgroundColor = '#374151'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => { 
                  if (!challenge.locked) {
                    e.currentTarget.style.backgroundColor = '#1f2937'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: challenge.locked ? '#6b7280' : '#f3f4f6',
                        margin: 0
                      }}>
                        {challenge.title}
                      </h3>
                      {challenge.locked && (
                        <span style={{ fontSize: '16px' }}>🔒</span>
                      )}
                    </div>
                    <p style={{ 
                      fontSize: '14px', 
                      color: challenge.locked ? '#4b5563' : '#9ca3af',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {challenge.description}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: getDifficultyColor(challenge.difficulty),
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>⚡</span>
                    <span style={{ fontSize: '14px', color: '#a3e635', fontWeight: '500' }}>
                      +{challenge.xp} XP
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px' }}>⏱</span>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                      {challenge.time}
                    </span>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    backgroundColor: '#374151',
                    borderRadius: '6px'
                  }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {challenge.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            今日の進捗
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '12px', 
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>0/6</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>完了</div>
            </div>
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '12px', 
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>0</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>獲得XP</div>
            </div>
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '12px', 
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>0分</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>活動時間</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => router.push('/daily-challenge/leaderboard')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: '#374151',
              color: '#d1d5db',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
          >
            🏆 ランキング
          </button>
          <button
            onClick={() => router.push('/achievements')}
            style={{
              flex: 1,
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
            🎖️ 実績を見る
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}