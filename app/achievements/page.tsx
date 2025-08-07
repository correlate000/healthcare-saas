'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function AchievementsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const userStats = {
    level: 8,
    currentXP: 850,
    maxXP: 1000,
    totalBadges: 12,
    recentBadges: 3,
    rank: 'シルバー'
  }

  const categories = [
    { id: 'all', label: 'すべて', count: 12 },
    { id: 'daily', label: 'デイリー', count: 5 },
    { id: 'weekly', label: 'ウィークリー', count: 4 },
    { id: 'special', label: 'スペシャル', count: 3 }
  ]

  const achievements = [
    {
      id: 1,
      title: '7日間連続ログイン',
      description: '1週間毎日チェックインを完了',
      icon: '🔥',
      category: 'daily',
      unlocked: true,
      progress: 100,
      xp: 100,
      date: '2025/08/01',
      rarity: 'common'
    },
    {
      id: 2,
      title: '初めての瞑想',
      description: '瞑想セッションを初めて完了',
      icon: '🧘',
      category: 'special',
      unlocked: true,
      progress: 100,
      xp: 50,
      date: '2025/07/28',
      rarity: 'common'
    },
    {
      id: 3,
      title: '気分改善マスター',
      description: '気分スコアを30%改善',
      icon: '😊',
      category: 'weekly',
      unlocked: true,
      progress: 100,
      xp: 150,
      date: '2025/08/05',
      rarity: 'rare'
    },
    {
      id: 4,
      title: '30日間の旅',
      description: '30日間連続でアプリを使用',
      icon: '🏆',
      category: 'special',
      unlocked: false,
      progress: 50,
      xp: 300,
      date: null,
      rarity: 'epic'
    },
    {
      id: 5,
      title: 'チームプレイヤー',
      description: 'チーム投稿で10いいね獲得',
      icon: '👥',
      category: 'weekly',
      unlocked: true,
      progress: 100,
      xp: 80,
      date: '2025/08/03',
      rarity: 'common'
    },
    {
      id: 6,
      title: 'ナイトオウル',
      description: '夜間セッションを10回完了',
      icon: '🦉',
      category: 'daily',
      unlocked: false,
      progress: 70,
      xp: 120,
      date: null,
      rarity: 'rare'
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return '#9ca3af'
      case 'rare': return '#60a5fa'
      case 'epic': return '#a78bfa'
      case 'legendary': return '#fbbf24'
      default: return '#9ca3af'
    }
  }

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory)

  // Cute bird character component
  const BirdCharacter = ({ emotion = 'happy' }: { emotion?: string }) => (
    <div style={{
      width: '60px',
      height: '60px',
      position: 'relative',
      display: 'inline-block'
    }}>
      {/* Body */}
      <div style={{
        position: 'absolute',
        bottom: '5px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '40px',
        height: '35px',
        backgroundColor: '#a3e635',
        borderRadius: '50% 50% 45% 45%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}></div>
      
      {/* Wings */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: '5px',
        width: '15px',
        height: '20px',
        backgroundColor: '#84cc16',
        borderRadius: '50% 0 50% 50%',
        transform: 'rotate(-15deg)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15px',
        right: '5px',
        width: '15px',
        height: '20px',
        backgroundColor: '#84cc16',
        borderRadius: '0 50% 50% 50%',
        transform: 'rotate(15deg)'
      }}></div>
      
      {/* Eyes */}
      <div style={{
        position: 'absolute',
        bottom: '25px',
        left: '18px',
        width: '6px',
        height: '8px',
        backgroundColor: '#111827',
        borderRadius: '50%'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '25px',
        right: '18px',
        width: '6px',
        height: '8px',
        backgroundColor: '#111827',
        borderRadius: '50%'
      }}></div>
      
      {/* Beak */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '8px',
        height: '6px',
        backgroundColor: '#f59e0b',
        borderRadius: '0 0 50% 50%'
      }}></div>
      
      {/* Emotion indicator */}
      {emotion === 'happy' && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '-5px',
          fontSize: '16px'
        }}>✨</div>
      )}
    </div>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '80px',
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
          gap: '12px',
          marginBottom: '8px'
        }}>
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
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#f3f4f6',
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            実績・バッジ
          </h1>
        </div>
      </div>

      {/* User Level Card with Bird */}
      <div style={{ padding: '20px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '8px'
              }}>
                <BirdCharacter emotion="happy" />
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'rgba(17,24,39,0.7)',
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}>
                    {userStats.rank}ランク
                  </div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: '800',
                    color: '#111827',
                    letterSpacing: '-1px'
                  }}>
                    レベル {userStats.level}
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ 
                    fontSize: '13px', 
                    color: 'rgba(17,24,39,0.8)',
                    fontWeight: '600'
                  }}>
                    次のレベルまで
                  </span>
                  <span style={{ 
                    fontSize: '13px', 
                    color: 'rgba(17,24,39,0.8)',
                    fontWeight: '700'
                  }}>
                    {userStats.currentXP} / {userStats.maxXP} XP
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: 'rgba(17,24,39,0.2)',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(userStats.currentXP / userStats.maxXP) * 100}%`,
                    backgroundColor: '#111827',
                    borderRadius: '5px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            </div>

            <div style={{ 
              textAlign: 'center',
              backgroundColor: 'rgba(17,24,39,0.1)',
              borderRadius: '12px',
              padding: '12px 16px'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '800',
                color: '#111827',
                marginBottom: '4px'
              }}>
                {userStats.totalBadges}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'rgba(17,24,39,0.7)',
                fontWeight: '600'
              }}>
                獲得バッジ
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '10px 16px',
                backgroundColor: selectedCategory === category.id ? '#a3e635' : '#374151',
                color: selectedCategory === category.id ? '#111827' : '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              {category.label}
              <span style={{
                backgroundColor: selectedCategory === category.id ? 'rgba(17,24,39,0.2)' : 'rgba(255,255,255,0.1)',
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px'
        }}>
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              style={{
                backgroundColor: achievement.unlocked ? '#1f2937' : '#1a1f2e',
                borderRadius: '12px',
                padding: '16px',
                position: 'relative',
                border: achievement.unlocked ? '2px solid transparent' : '2px solid #374151',
                opacity: achievement.unlocked ? 1 : 0.7,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Rarity indicator */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: getRarityColor(achievement.rarity)
              }}></div>

              {/* Icon */}
              <div style={{
                fontSize: '32px',
                marginBottom: '12px',
                filter: achievement.unlocked ? 'none' : 'grayscale(100%)'
              }}>
                {achievement.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: achievement.unlocked ? '#f3f4f6' : '#9ca3af',
                marginBottom: '4px',
                lineHeight: '1.3'
              }}>
                {achievement.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '12px',
                color: achievement.unlocked ? '#9ca3af' : '#6b7280',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {achievement.description}
              </p>

              {/* Progress or Date */}
              {achievement.unlocked ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#6b7280'
                  }}>
                    {achievement.date}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#a3e635',
                    fontWeight: '600'
                  }}>
                    +{achievement.xp} XP
                  </span>
                </div>
              ) : (
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      color: '#6b7280'
                    }}>
                      進捗
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      fontWeight: '600'
                    }}>
                      {achievement.progress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: '#374151',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${achievement.progress}%`,
                      backgroundColor: '#a3e635',
                      borderRadius: '2px'
                    }}></div>
                  </div>
                </div>
              )}

              {/* Lock overlay for locked achievements */}
              {!achievement.unlocked && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  fontSize: '16px',
                  opacity: 0.5
                }}>
                  🔒
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div style={{
          marginTop: '32px',
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '16px'
          }}>
            統計サマリー
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#a3e635',
                marginBottom: '4px'
              }}>
                {userStats.totalBadges}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                総バッジ数
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#60a5fa',
                marginBottom: '4px'
              }}>
                {userStats.recentBadges}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                今週獲得
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#fbbf24',
                marginBottom: '4px'
              }}>
                85%
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                達成率
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}