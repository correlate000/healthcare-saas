'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function DailyChallengePage() {
  const router = useRouter()
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])
  const [activeTimer, setActiveTimer] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [streakDays] = useState(15)
  const [weeklyProgress] = useState([true, true, true, true, true, false, false]) // Mock data

  const challenges = [
    {
      id: 1,
      category: 'mindfulness',
      title: '3分間の深呼吸',
      description: '静かな場所で3分間、深い呼吸に集中しましょう',
      duration: '3分',
      durationMinutes: 3,
      difficulty: 'easy',
      xp: 20,
      icon: '🫁',
      color: '#60a5fa',
      steps: [
        '快適な姿勢で座る',
        '目を閉じるか一点を見つめる',
        '4秒吸って、7秒止めて、8秒吐く',
        'これを3分間繰り返す'
      ],
      benefits: ['ストレス軽減', 'リラックス効果', '集中力向上']
    },
    {
      id: 2,
      category: 'exercise',
      title: '軽いストレッチ',
      description: '体をほぐして血流を改善しましょう',
      duration: '5分',
      durationMinutes: 5,
      difficulty: 'easy',
      xp: 25,
      icon: '🧘',
      color: '#a3e635',
      steps: [
        '首を左右にゆっくり回す',
        '肩を前後に回す',
        '腕を大きく伸ばす',
        '前屈して背中を伸ばす'
      ],
      benefits: ['血行促進', '筋肉の緊張緩和', '柔軟性向上']
    },
    {
      id: 3,
      category: 'gratitude',
      title: '感謝のリスト',
      description: '今日感謝できる3つのことを書き出しましょう',
      duration: '5分',
      durationMinutes: 5,
      difficulty: 'easy',
      xp: 30,
      icon: '📝',
      color: '#fbbf24',
      steps: [
        'ノートやアプリを開く',
        '今日あった良いことを思い出す',
        '3つ書き出す',
        'それぞれについて少し詳しく書く'
      ],
      benefits: ['ポジティブ思考', '幸福感向上', 'ストレス軽減']
    },
    {
      id: 4,
      category: 'meditation',
      title: 'ボディスキャン瞑想',
      description: '体の各部位に意識を向けて緊張を解きましょう',
      duration: '10分',
      durationMinutes: 10,
      difficulty: 'medium',
      xp: 40,
      icon: '🧘‍♀️',
      color: '#a78bfa',
      steps: [
        '仰向けに横になる',
        '足先から頭まで順番に意識を向ける',
        '各部位の緊張を感じて解放する',
        '全身をスキャンしたら深呼吸'
      ],
      benefits: ['深いリラックス', '身体感覚の向上', '睡眠改善']
    },
    {
      id: 5,
      category: 'social',
      title: '友人にメッセージ',
      description: '大切な人に感謝や応援のメッセージを送りましょう',
      duration: '2分',
      durationMinutes: 2,
      difficulty: 'easy',
      xp: 15,
      icon: '💬',
      color: '#f87171',
      steps: [
        '連絡を取りたい友人を選ぶ',
        '短いメッセージを考える',
        '送信する',
        '返信を楽しみに待つ'
      ],
      benefits: ['人間関係の強化', '孤独感の軽減', '幸福感向上']
    },
    {
      id: 6,
      category: 'creative',
      title: '5分間スケッチ',
      description: '何でもいいので5分間描いてみましょう',
      duration: '5分',
      durationMinutes: 5,
      difficulty: 'medium',
      xp: 35,
      icon: '🎨',
      color: '#ec4899',
      steps: [
        '紙とペンを用意',
        '周りにあるものを観察',
        '完璧を求めず自由に描く',
        '楽しむことを優先する'
      ],
      benefits: ['創造性向上', 'マインドフルネス', 'ストレス解消']
    },
    {
      id: 7,
      category: 'nature',
      title: '窓の外を眺める',
      description: '5分間、窓の外の景色をじっくり観察しましょう',
      duration: '5分',
      durationMinutes: 5,
      difficulty: 'easy',
      xp: 20,
      icon: '🌳',
      color: '#10b981',
      steps: [
        '窓の近くに座る',
        '外の景色に注目する',
        '動くもの、色、形を観察',
        '自然のリズムを感じる'
      ],
      benefits: ['目の疲れ軽減', 'リフレッシュ', '気分転換']
    },
    {
      id: 8,
      category: 'hydration',
      title: '水分補給チャレンジ',
      description: 'コップ1杯の水をゆっくり味わいながら飲みましょう',
      duration: '1分',
      durationMinutes: 1,
      difficulty: 'easy',
      xp: 10,
      icon: '💧',
      color: '#06b6d4',
      steps: [
        'コップに水を注ぐ',
        '一口ずつゆっくり飲む',
        '水の温度や味を感じる',
        '体に水分が行き渡るのを感じる'
      ],
      benefits: ['水分補給', '健康維持', 'マインドフルネス']
    }
  ]

  const categories = [
    { id: 'all', label: 'すべて', icon: '🎯' },
    { id: 'mindfulness', label: 'マインドフルネス', icon: '🧠' },
    { id: 'exercise', label: '運動', icon: '💪' },
    { id: 'meditation', label: '瞑想', icon: '🧘' },
    { id: 'gratitude', label: '感謝', icon: '🙏' },
    { id: 'social', label: '社交', icon: '👥' },
    { id: 'creative', label: '創造', icon: '🎨' },
    { id: 'nature', label: '自然', icon: '🌿' },
    { id: 'hydration', label: '水分', icon: '💧' }
  ]

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory)

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
    const challenge = challenges.find(c => c.id === challengeId)
    if (challenge) {
      setSelectedChallenge(challengeId)
      setActiveTimer(challengeId)
      setTimeRemaining(challenge.durationMinutes * 60)
    }
  }

  const handleCompleteChallenge = (challengeId: number) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges([...completedChallenges, challengeId])
      
      // Show XP animation
      const xpElement = document.createElement('div')
      const challenge = challenges.find(c => c.id === challengeId)
      xpElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #a3e635;
        font-size: 48px;
        font-weight: 800;
        pointer-events: none;
        z-index: 9999;
        animation: xpBurst 1.5s ease-out forwards;
      `
      xpElement.textContent = `+${challenge?.xp} XP`
      document.body.appendChild(xpElement)
      setTimeout(() => xpElement.remove(), 1500)
    }
    
    setSelectedChallenge(null)
    setActiveTimer(null)
    setTimeRemaining(0)
  }

  // Timer effect
  useEffect(() => {
    if (activeTimer && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (activeTimer && timeRemaining === 0) {
      // Auto-complete when timer ends
      handleCompleteChallenge(activeTimer)
    }
  }, [activeTimer, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const totalXP = completedChallenges.reduce((sum, id) => {
    const challenge = challenges.find(c => c.id === id)
    return sum + (challenge?.xp || 0)
  }, 0)

  const totalTime = completedChallenges.reduce((sum, id) => {
    const challenge = challenges.find(c => c.id === id)
    return sum + (challenge?.durationMinutes || 0)
  }, 0)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: '140px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(31, 41, 55, 0.4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            デイリーチャレンジ
          </h1>
          <button
            onClick={() => router.push('/achievements')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#111827',
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <span style={{ fontSize: '16px' }}>🏆</span>
            実績を見る
          </button>
        </div>
      </div>

      {/* Streak & Progress */}
      <div style={{ padding: '20px' }}>
        {/* Streak Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(31, 41, 55, 0.6) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '20px',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '32px' }}>🔥</span>
                  <div>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#fbbf24'
                    }}>
                      {streakDays}日
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#d1d5db'
                    }}>
                      連続達成中！
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'flex-end'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(163, 230, 53, 0.2)',
                  borderRadius: '8px'
                }}>
                  <span>✅</span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#a3e635'
                  }}>
                    {completedChallenges.length}/{challenges.length}
                  </span>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#9ca3af'
                }}>
                  今日の完了
                </div>
              </div>
            </div>
            
            {/* Weekly Progress */}
            <div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginBottom: '8px'
              }}>
                今週の進捗
              </div>
              <div style={{
                display: 'flex',
                gap: '6px'
              }}>
                {['月', '火', '水', '木', '金', '土', '日'].map((day, index) => (
                  <div
                    key={day}
                    style={{
                      flex: 1,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: '10px',
                      color: '#6b7280',
                      marginBottom: '4px'
                    }}>
                      {day}
                    </div>
                    <div style={{
                      width: '100%',
                      height: '32px',
                      backgroundColor: weeklyProgress[index] ? '#fbbf24' : '#374151',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: index === new Date().getDay() - 1 ? '2px solid #fbbf24' : 'none'
                    }}>
                      {weeklyProgress[index] && '✓'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'rgba(31, 41, 55, 0.6)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid rgba(55, 65, 81, 0.3)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>⭐</div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#a3e635'
            }}>
              {totalXP}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              獲得XP
            </div>
          </div>
          
          <div style={{
            background: 'rgba(31, 41, 55, 0.6)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid rgba(55, 65, 81, 0.3)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>⏱️</div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#60a5fa'
            }}>
              {totalTime}分
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              実践時間
            </div>
          </div>
          
          <div style={{
            background: 'rgba(31, 41, 55, 0.6)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid rgba(55, 65, 81, 0.3)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📈</div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#fbbf24'
            }}>
              {Math.round((completedChallenges.length / challenges.length) * 100)}%
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              達成率
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === category.id 
                  ? 'rgba(163, 230, 53, 0.2)' 
                  : 'rgba(55, 65, 81, 0.6)',
                color: selectedCategory === category.id ? '#a3e635' : '#d1d5db',
                border: selectedCategory === category.id 
                  ? '1px solid rgba(163, 230, 53, 0.3)' 
                  : '1px solid transparent',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Challenges List */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#f3f4f6',
          marginBottom: '16px'
        }}>
          {selectedCategory === 'all' ? '今日のチャレンジ' : categories.find(c => c.id === selectedCategory)?.label}
        </h2>

        <div style={{
          display: 'grid',
          gap: '16px'
        }}>
          {filteredChallenges.map(challenge => {
            const isCompleted = completedChallenges.includes(challenge.id)
            const isSelected = selectedChallenge === challenge.id
            const isActive = activeTimer === challenge.id

            return (
              <div
                key={challenge.id}
                style={{
                  background: isCompleted 
                    ? 'rgba(31, 41, 55, 0.4)' 
                    : `linear-gradient(135deg, ${challenge.color}10 0%, rgba(31, 41, 55, 0.6) 100%)`,
                  backdropFilter: 'blur(12px)',
                  borderRadius: '20px',
                  padding: '20px',
                  cursor: isCompleted ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isCompleted ? 0.6 : 1,
                  border: isSelected 
                    ? `2px solid ${challenge.color}` 
                    : '1px solid rgba(55, 65, 81, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => !isCompleted && !isActive && handleStartChallenge(challenge.id)}
                onMouseEnter={(e) => {
                  if (!isCompleted) {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = `0 8px 24px ${challenge.color}20`
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompleted) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                {/* Background decoration */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '100px',
                  height: '100px',
                  background: `radial-gradient(circle, ${challenge.color}20 0%, transparent 70%)`,
                  borderRadius: '50%'
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      flex: 1
                    }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: isCompleted 
                          ? 'rgba(163, 230, 53, 0.2)' 
                          : `${challenge.color}20`,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        flexShrink: 0
                      }}>
                        {isCompleted ? '✅' : challenge.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#f3f4f6',
                          marginBottom: '6px'
                        }}>
                          {challenge.title}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#9ca3af',
                          marginBottom: '12px',
                          lineHeight: '1.5'
                        }}>
                          {challenge.description}
                        </p>
                        
                        {/* Tags */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginBottom: '12px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            backgroundColor: getDifficultyColor(challenge.difficulty) + '20',
                            color: getDifficultyColor(challenge.difficulty),
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontWeight: '500'
                          }}>
                            {getDifficultyLabel(challenge.difficulty)}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            backgroundColor: 'rgba(96, 165, 250, 0.2)',
                            color: '#60a5fa',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            ⏱️ {challenge.duration}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            backgroundColor: 'rgba(163, 230, 53, 0.2)',
                            color: '#a3e635',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontWeight: '600'
                          }}>
                            +{challenge.xp} XP
                          </span>
                        </div>

                        {/* Benefits */}
                        <div style={{
                          display: 'flex',
                          gap: '6px',
                          flexWrap: 'wrap'
                        }}>
                          {challenge.benefits.map((benefit, index) => (
                            <span
                              key={index}
                              style={{
                                fontSize: '11px',
                                color: '#6b7280',
                                padding: '2px 8px',
                                backgroundColor: 'rgba(55, 65, 81, 0.3)',
                                borderRadius: '4px'
                              }}
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Timer */}
                  {isActive && (
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#9ca3af',
                        marginBottom: '8px'
                      }}>
                        実践中...
                      </div>
                      <div style={{
                        fontSize: '36px',
                        fontWeight: '800',
                        color: '#a3e635',
                        fontFamily: 'monospace'
                      }}>
                        {formatTime(timeRemaining)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCompleteChallenge(challenge.id)
                        }}
                        style={{
                          marginTop: '12px',
                          padding: '8px 24px',
                          backgroundColor: '#a3e635',
                          color: '#111827',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        完了する
                      </button>
                    </div>
                  )}

                  {/* Steps (shown when selected) */}
                  {isSelected && !isCompleted && !isActive && (
                    <div style={{
                      borderTop: '1px solid rgba(55, 65, 81, 0.3)',
                      paddingTop: '16px',
                      marginTop: '16px'
                    }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#f3f4f6',
                        marginBottom: '12px'
                      }}>
                        実践ステップ：
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
                              marginBottom: '8px',
                              lineHeight: '1.5'
                            }}
                          >
                            {step}
                          </li>
                        ))}
                      </ol>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartChallenge(challenge.id)
                        }}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: `linear-gradient(135deg, ${challenge.color} 0%, ${challenge.color}80 100%)`,
                          color: '#111827',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          marginTop: '16px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { 
                          e.currentTarget.style.transform = 'scale(1.02)'
                        }}
                        onMouseLeave={(e) => { 
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        チャレンジを開始
                      </button>
                    </div>
                  )}

                  {/* Completed Badge */}
                  {isCompleted && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: 'rgba(163, 230, 53, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(163, 230, 53, 0.2)'
                    }}>
                      <span style={{
                        fontSize: '16px',
                        color: '#a3e635',
                        fontWeight: '600'
                      }}>
                        ✅ 完了済み（+{challenge.xp} XP獲得）
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes xpBurst {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -100px) scale(1);
            opacity: 0;
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}