'use client'

import React, { useState, useEffect } from 'react'
import { 
  DailyChallenge, 
  generateDailyChallenges, 
  difficultyConfig,
  calculateLevel 
} from '@/types/daily-challenge'
import { HapticsManager, createXpParticles, createLevelUpEffect } from '@/utils/haptics'
import { getTypographyStyles } from '@/styles/typography'
import { UserDataStorage } from '@/utils/storage'

interface DailyChallengesProps {
  onChallengeComplete?: (challenge: DailyChallenge, xpEarned: number) => void
}

export function DailyChallenges({ onChallengeComplete }: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([])
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [totalXp, setTotalXp] = useState(0)
  const [userLevel, setUserLevel] = useState(1)
  const [streakDays, setStreakDays] = useState(0)
  const [isAnimating, setIsAnimating] = useState<string | null>(null)

  useEffect(() => {
    // ユーザーデータを読み込み
    const xp = UserDataStorage.getXP()
    const streak = UserDataStorage.getStreak()
    const levelData = calculateLevel(xp)
    
    setTotalXp(xp)
    setUserLevel(levelData.level)
    setStreakDays(streak)
    
    // 今日のチャレンジを生成
    const todaysChallenges = generateDailyChallenges(levelData.level, streak)
    setChallenges(todaysChallenges)
    
    // 今日完了したチャレンジを読み込み
    const today = new Date().toDateString()
    
    // テスト用: URLに?reset=trueがある場合は完了状態をリセット
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('reset') === 'true') {
      console.log('テスト用: チャレンジ完了状態をリセットしました')
      localStorage.removeItem(`completed-challenges-${today}`)
      setCompletedToday([])
    } else {
      const savedCompleted = localStorage.getItem(`completed-challenges-${today}`)
      if (savedCompleted) {
        const completed = JSON.parse(savedCompleted)
        console.log('今日完了済みのチャレンジ:', completed)
        setCompletedToday(completed)
      }
    }
  }, [])

  const handleChallengeClick = async (challenge: DailyChallenge, event: React.MouseEvent) => {
    console.log('チャレンジがクリックされました:', challenge.title, challenge.id)
    
    if (completedToday.includes(challenge.id)) {
      console.log('このチャレンジは既に完了済みです:', challenge.id)
      return
    }
    
    if (challenge.unlockLevel && userLevel < challenge.unlockLevel) {
      console.log('レベルが足りません。必要レベル:', challenge.unlockLevel, '現在レベル:', userLevel)
      HapticsManager.error()
      return
    }
    
    console.log('チャレンジ処理を開始します...')

    // アニメーション開始
    setIsAnimating(challenge.id)
    
    // 触覚フィードバック
    HapticsManager.challengeComplete(challenge.difficulty)
    
    // XPパーティクル効果
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    createXpParticles(x, y, challenge.xpReward, difficultyConfig[challenge.difficulty].color)
    
    // XPを獲得
    const bonusXp = challenge.bonusXp || 0
    const totalXpEarned = challenge.xpReward + bonusXp
    const newTotalXp = totalXp + totalXpEarned
    
    // レベルアップチェック
    const oldLevel = calculateLevel(totalXp).level
    const newLevel = calculateLevel(newTotalXp).level
    
    if (newLevel > oldLevel) {
      setTimeout(() => {
        createLevelUpEffect(newLevel)
      }, 500)
    }
    
    // 状態を更新
    setTotalXp(newTotalXp)
    setUserLevel(newLevel)
    UserDataStorage.setXP(newTotalXp)
    
    // 完了状態を保存
    const newCompleted = [...completedToday, challenge.id]
    setCompletedToday(newCompleted)
    const today = new Date().toDateString()
    localStorage.setItem(`completed-challenges-${today}`, JSON.stringify(newCompleted))
    
    // コールバック
    if (onChallengeComplete) {
      onChallengeComplete(challenge, totalXpEarned)
    }
    
    // アニメーション終了
    setTimeout(() => {
      setIsAnimating(null)
    }, 1500)
  }

  const getDifficultyLabel = (difficulty: DailyChallenge['difficulty']) => {
    const labels = {
      easy: '簡単',
      medium: '普通',
      hard: '難しい',
      expert: 'エキスパート'
    }
    return labels[difficulty]
  }

  const completionRate = challenges.length > 0 
    ? Math.round((completedToday.length / challenges.length) * 100)
    : 0

  return (
    <div style={{
      backgroundColor: '#1f2937',
      borderRadius: '16px',
      padding: '16px'
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <h3 style={{
          ...getTypographyStyles('base'),
          color: '#f3f4f6',
          margin: 0,
          fontWeight: '700',
          fontSize: '16px'
        }}>
          今日のチャレンジ
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            ...getTypographyStyles('caption'),
            color: '#9ca3af',
            fontSize: '12px'
          }}>
            {completedToday.length}/{challenges.length}
          </span>
          <div style={{
            width: '50px',
            height: '4px',
            backgroundColor: '#374151',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${completionRate}%`,
              height: '100%',
              backgroundColor: '#a3e635',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      </div>

      {/* チャレンジリスト */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {challenges.map((challenge) => {
          const isCompleted = completedToday.includes(challenge.id)
          const isLocked = challenge.unlockLevel && userLevel < challenge.unlockLevel
          const isAnimatingNow = isAnimating === challenge.id
          const config = difficultyConfig[challenge.difficulty]

          return (
            <div
              key={challenge.id}
              onClick={(e) => !isLocked && !isCompleted && handleChallengeClick(challenge, e)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                padding: '12px',
                backgroundColor: isCompleted ? '#374151' : '#4b5563',
                borderRadius: '12px',
                cursor: isLocked ? 'not-allowed' : isCompleted ? 'default' : 'pointer',
                opacity: isLocked ? 0.5 : 1,
                transition: 'all 0.3s ease',
                transform: isAnimatingNow ? 'scale(1.02)' : 'scale(1)',
                border: isAnimatingNow ? `2px solid ${config.color}` : '2px solid transparent',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isCompleted && !isLocked) {
                  e.currentTarget.style.backgroundColor = '#60a5fa20'
                  e.currentTarget.style.transform = 'translateX(4px)'
                  HapticsManager.light()
                }
              }}
              onMouseLeave={(e) => {
                if (!isCompleted && !isLocked) {
                  e.currentTarget.style.backgroundColor = '#4b5563'
                  e.currentTarget.style.transform = 'translateX(0)'
                }
              }}
            >
              {/* 完了アニメーション背景 */}
              {isAnimatingNow && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '200%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, ${config.color}40, transparent)`,
                  animation: 'sweep 0.6s ease-out'
                }}></div>
              )}

              {/* チェックボックス */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${isCompleted ? config.color : '#6b7280'}`,
                backgroundColor: isCompleted ? config.color : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                marginTop: '2px',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                transform: isAnimatingNow ? 'rotate(360deg) scale(1.2)' : 'rotate(0) scale(1)'
              }}>
                {isCompleted && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              {/* アイコンと内容 */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '18px' }}>{challenge.icon}</span>
                  <span style={{
                    ...getTypographyStyles('small'),
                    color: isCompleted ? '#9ca3af' : '#f3f4f6',
                    fontWeight: '600',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    fontSize: '14px'
                  }}>
                    {challenge.title}
                  </span>
                  {isLocked && (
                    <span style={{
                      ...getTypographyStyles('caption'),
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      Lv.{challenge.unlockLevel}
                    </span>
                  )}
                </div>
                <div style={{
                  ...getTypographyStyles('caption'),
                  color: '#9ca3af',
                  marginBottom: '6px',
                  fontSize: '11px',
                  lineHeight: '1.4'
                }}>
                  {challenge.description}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    ...getTypographyStyles('caption'),
                    backgroundColor: config.color,
                    color: challenge.difficulty === 'easy' ? '#111827' : 'white',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '10px'
                  }}>
                    {getDifficultyLabel(challenge.difficulty)}
                  </span>
                  <span style={{
                    ...getTypographyStyles('caption'),
                    color: '#fbbf24',
                    fontWeight: '600',
                    fontSize: '11px'
                  }}>
                    +{challenge.xpReward} XP
                  </span>
                  <span style={{
                    ...getTypographyStyles('caption'),
                    color: '#9ca3af',
                    fontSize: '10px'
                  }}>
                    {challenge.timeEstimate}
                  </span>
                </div>
              </div>

              {/* 完了バッジ */}
              {isCompleted && (
                <div style={{
                  ...getTypographyStyles('small'),
                  backgroundColor: config.color,
                  color: challenge.difficulty === 'easy' ? '#111827' : 'white',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  animation: isAnimatingNow ? 'pulse 0.6s ease-out' : 'none'
                }}>
                  完了
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 全完了ボーナス */}
      {completionRate === 100 && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          borderRadius: '12px',
          textAlign: 'center',
          animation: 'glow 2s ease-in-out infinite'
        }}>
          <div style={{
            ...getTypographyStyles('h4'),
            color: '#111827',
            marginBottom: '4px',
            fontWeight: '700'
          }}>
            🎉 今日のチャレンジ全クリア！
          </div>
          <div style={{
            ...getTypographyStyles('base'),
            color: '#111827',
            opacity: 0.9
          }}>
            ボーナス +50 XP を獲得しました！
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes sweep {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(251, 191, 36, 0.8);
          }
        }
      `}</style>
    </div>
  )
}