'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function DailyChallengePage() {
  const router = useRouter()
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])

  const challenges = [
    {
      id: 1,
      category: 'マインドフルネス',
      title: '3分間の深呼吸',
      description: '静かな場所で3分間、深い呼吸に集中しましょう',
      duration: '3分',
      difficulty: 'easy',
      xp: 20,
      icon: '🫁',
      steps: [
        '快適な姿勢で座る',
        '目を閉じるか一点を見つめる',
        '4秒吸って、7秒止めて、8秒吐く',
        'これを3分間繰り返す'
      ]
    },
    {
      id: 2,
      category: '運動',
      title: '軽いストレッチ',
      description: '体をほぐして血流を改善しましょう',
      duration: '5分',
      difficulty: 'easy',
      xp: 25,
      icon: '🧘',
      steps: [
        '首を左右にゆっくり回す',
        '肩を前後に回す',
        '腕を大きく伸ばす',
        '前屈して背中を伸ばす'
      ]
    },
    {
      id: 3,
      category: '感謝',
      title: '感謝のリスト',
      description: '今日感謝できる3つのことを書き出しましょう',
      duration: '5分',
      difficulty: 'easy',
      xp: 30,
      icon: '📝',
      steps: [
        'ノートやアプリを開く',
        '今日あった良いことを思い出す',
        '3つ書き出す',
        'それぞれについて少し詳しく書く'
      ]
    },
    {
      id: 4,
      category: '瞑想',
      title: 'ボディスキャン瞑想',
      description: '体の各部位に意識を向けて緊張を解きましょう',
      duration: '10分',
      difficulty: 'medium',
      xp: 40,
      icon: '🧘‍♀️',
      steps: [
        '仰向けに横になる',
        '足先から頭まで順番に意識を向ける',
        '各部位の緊張を感じて解放する',
        '全身をスキャンしたら深呼吸'
      ]
    },
    {
      id: 5,
      category: '社交',
      title: '友人にメッセージ',
      description: '大切な人に感謝や応援のメッセージを送りましょう',
      duration: '2分',
      difficulty: 'easy',
      xp: 15,
      icon: '💬',
      steps: [
        '連絡を取りたい友人を選ぶ',
        '短いメッセージを考える',
        '送信する',
        '返信を楽しみに待つ'
      ]
    },
    {
      id: 6,
      category: '創造',
      title: '5分間スケッチ',
      description: '何でもいいので5分間描いてみましょう',
      duration: '5分',
      difficulty: 'medium',
      xp: 35,
      icon: '🎨',
      steps: [
        '紙とペンを用意',
        '周りにあるものを観察',
        '完璧を求めず自由に描く',
        '楽しむことを優先する'
      ]
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '#a3e635'
      case 'medium': return '#fbbf24'
      case 'hard': return '#f87171'
      default: return '#9ca3af'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return '簡単'
      case 'medium': return '普通'
      case 'hard': return '難しい'
      default: return difficulty
    }
  }

  const handleStartChallenge = (challengeId: number) => {
    setSelectedChallenge(challengeId)
    // Start timer or redirect to challenge detail
  }

  const handleCompleteChallenge = (challengeId: number) => {
    setCompletedChallenges([...completedChallenges, challengeId])
    setSelectedChallenge(null)
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
            今日のチャレンジ
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1f2937',
            padding: '8px 12px',
            borderRadius: '8px'
          }}>
            <span style={{ fontSize: '16px' }}>🔥</span>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#a3e635'
            }}>
              {completedChallenges.length}/{challenges.length}
            </span>
          </div>
        </div>
      </div>

      {/* Daily progress */}
      <div style={{
        padding: '20px',
        backgroundColor: '#1f2937',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6'
          }}>
            今日の進捗
          </h2>
          <span style={{
            fontSize: '14px',
            color: '#9ca3af'
          }}>
            {Math.round((completedChallenges.length / challenges.length) * 100)}% 完了
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#374151',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${(completedChallenges.length / challenges.length) * 100}%`,
            backgroundColor: '#a3e635',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '16px'
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '4px'
            }}>
              獲得XP
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#a3e635'
            }}>
              {completedChallenges.reduce((sum, id) => {
                const challenge = challenges.find(c => c.id === id)
                return sum + (challenge?.xp || 0)
              }, 0)}
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginBottom: '4px'
            }}>
              完了時間
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#60a5fa'
            }}>
              {completedChallenges.reduce((sum, id) => {
                const challenge = challenges.find(c => c.id === id)
                const duration = parseInt(challenge?.duration || '0')
                return sum + duration
              }, 0)}分
            </div>
          </div>
        </div>
      </div>

      {/* Challenges list */}
      <div style={{
        padding: '0 20px 20px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#f3f4f6',
          marginBottom: '16px'
        }}>
          利用可能なチャレンジ
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {challenges.map(challenge => {
            const isCompleted = completedChallenges.includes(challenge.id)
            const isSelected = selectedChallenge === challenge.id

            return (
              <div
                key={challenge.id}
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: isCompleted ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isCompleted ? 0.6 : 1,
                  border: isSelected ? '2px solid #a3e635' : '2px solid transparent'
                }}
                onClick={() => !isCompleted && handleStartChallenge(challenge.id)}
                onMouseEnter={(e) => {
                  if (!isCompleted) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompleted) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: isCompleted ? '#374151' : '#111827',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {isCompleted ? '✓' : challenge.icon}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#f3f4f6',
                        marginBottom: '4px'
                      }}>
                        {challenge.title}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#9ca3af',
                        marginBottom: '8px'
                      }}>
                        {challenge.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          backgroundColor: '#374151',
                          color: '#9ca3af',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}>
                          {challenge.category}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: '#9ca3af'
                        }}>
                          ⏱ {challenge.duration}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: '#a3e635',
                          fontWeight: '600'
                        }}>
                          +{challenge.xp} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: getDifficultyColor(challenge.difficulty),
                    color: '#111827',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {getDifficultyLabel(challenge.difficulty)}
                  </div>
                </div>

                {isSelected && !isCompleted && (
                  <div style={{
                    borderTop: '1px solid #374151',
                    paddingTop: '12px',
                    marginTop: '12px'
                  }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '12px'
                    }}>
                      手順:
                    </h4>
                    <ol style={{
                      margin: 0,
                      paddingLeft: '20px'
                    }}>
                      {challenge.steps.map((step, index) => (
                        <li
                          key={index}
                          style={{
                            fontSize: '13px',
                            color: '#d1d5db',
                            marginBottom: '6px',
                            lineHeight: '1.4'
                          }}
                        >
                          {step}
                        </li>
                      ))}
                    </ol>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCompleteChallenge(challenge.id)
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#a3e635',
                        color: '#111827',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '16px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635' }}
                    >
                      完了にする
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '12px',
                    padding: '8px',
                    backgroundColor: '#374151',
                    borderRadius: '8px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      color: '#a3e635',
                      fontWeight: '600'
                    }}>
                      ✓ 完了済み
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}