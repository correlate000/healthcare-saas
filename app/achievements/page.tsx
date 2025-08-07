'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

const getRarityStyle = (rarity: string) => {
  switch(rarity) {
    case 'common': 
      return {
        gradient: 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(75, 85, 99, 0.1) 100%)',
        border: '1px solid rgba(156, 163, 175, 0.3)',
        glow: '0 4px 16px rgba(156, 163, 175, 0.1)'
      }
    case 'rare': 
      return {
        gradient: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
        border: '1px solid rgba(96, 165, 250, 0.4)',
        glow: '0 4px 20px rgba(96, 165, 250, 0.2)'
      }
    case 'epic': 
      return {
        gradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1px solid rgba(167, 139, 250, 0.5)',
        glow: '0 6px 24px rgba(167, 139, 250, 0.3)'
      }
    case 'legendary': 
      return {
        gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.2) 100%)',
        border: '1px solid rgba(251, 191, 36, 0.6)',
        glow: '0 8px 32px rgba(251, 191, 36, 0.4)'
      }
    default: 
      return {
        gradient: 'linear-gradient(135deg, rgba(156, 163, 175, 0.2) 0%, rgba(75, 85, 99, 0.1) 100%)',
        border: '1px solid rgba(156, 163, 175, 0.3)',
        glow: '0 4px 16px rgba(156, 163, 175, 0.1)'
      }
  }
}

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

  // Bird character component
  const BirdCharacter = ({ emotion = 'happy' }: { emotion?: string }) => (
    <div style={{
      width: '60px',
      height: '60px',
      position: 'relative',
      display: 'inline-block'
    }}>
      <svg width="60" height="60" viewBox="0 0 100 100" style={{ display: 'block' }}>
        <ellipse cx="50" cy="55" rx="30" ry="33" fill="#a3e635" />
        <ellipse cx="50" cy="60" rx="22" ry="25" fill="#ecfccb" />
        <ellipse cx="28" cy="50" rx="12" ry="20" fill="#a3e635" transform="rotate(-20 28 50)" />
        <ellipse cx="72" cy="50" rx="12" ry="20" fill="#a3e635" transform="rotate(20 72 50)" />
        <circle cx="40" cy="45" r="6" fill="white" />
        <circle cx="42" cy="45" r="4" fill="#111827" />
        <circle cx="60" cy="45" r="6" fill="white" />
        <circle cx="58" cy="45" r="4" fill="#111827" />
        <path d="M50 50 L45 55 L55 55 Z" fill="#fbbf24" />
      </svg>
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
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: '140px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* Animated background pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(163, 230, 53, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(167, 139, 250, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      {/* Header */}
      <div style={{ 
        padding: '20px',
        borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(31, 41, 55, 0.4)',
        position: 'relative',
        zIndex: 10
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
            fontSize: '24px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            実績・バッジ
          </h1>
        </div>
      </div>

      {/* User Level Card with Bird */}
      <div style={{ padding: '20px', position: 'relative', zIndex: 5 }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(163, 230, 53, 0.3), 0 2px 8px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
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
          gap: '12px',
          marginBottom: '32px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '4px'
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '12px 20px',
                background: selectedCategory === category.id 
                  ? 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)' 
                  : 'rgba(55, 65, 81, 0.6)',
                backdropFilter: 'blur(10px)',
                color: selectedCategory === category.id ? '#111827' : '#d1d5db',
                border: selectedCategory === category.id 
                  ? '1px solid rgba(163, 230, 53, 0.3)' 
                  : '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                boxShadow: selectedCategory === category.id 
                  ? '0 4px 16px rgba(163, 230, 53, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                transform: selectedCategory === category.id ? 'translateY(-2px)' : 'translateY(0)'
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {filteredAchievements.map((achievement) => {
            const rarityStyle = getRarityStyle(achievement.rarity)
            return (
            <div
              key={achievement.id}
              style={{
                background: achievement.unlocked 
                  ? `${rarityStyle.gradient}, rgba(31, 41, 55, 0.8)` 
                  : 'rgba(26, 31, 46, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '20px',
                position: 'relative',
                border: achievement.unlocked ? rarityStyle.border : '1px solid rgba(55, 65, 81, 0.3)',
                opacity: achievement.unlocked ? 1 : 0.6,
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                boxShadow: achievement.unlocked 
                  ? `${rarityStyle.glow}, 0 4px 16px rgba(0, 0, 0, 0.2)` 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
                if (achievement.unlocked) {
                  e.currentTarget.style.boxShadow = `${rarityStyle.glow}, 0 8px 32px rgba(0, 0, 0, 0.3)`
                } else {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                if (achievement.unlocked) {
                  e.currentTarget.style.boxShadow = `${rarityStyle.glow}, 0 4px 16px rgba(0, 0, 0, 0.2)`
                } else {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              {/* Rarity shimmer effect for unlocked achievements */}
              {achievement.unlocked && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, transparent, ${getRarityColor(achievement.rarity)}, transparent)`,
                  animation: achievement.rarity !== 'common' ? 'shimmer 2s ease-in-out infinite' : 'none'
                }}></div>
              )}

              {/* Icon with enhanced styling */}
              <div style={{
                fontSize: '40px',
                marginBottom: '16px',
                filter: achievement.unlocked 
                  ? `drop-shadow(0 4px 8px ${getRarityColor(achievement.rarity)}40)` 
                  : 'grayscale(100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: achievement.unlocked && achievement.rarity === 'legendary' 
                  ? 'legendary-glow 3s ease-in-out infinite' 
                  : 'none'
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
          )
          })}
        </div>

        {/* Stats Summary */}
        <div style={{
          marginTop: '40px',
          background: 'rgba(31, 41, 55, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid rgba(55, 65, 81, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '24px',
            textAlign: 'center'
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

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes legendary-glow {
          0%, 100% {
            filter: drop-shadow(0 4px 8px #fbbf2440);
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 8px 16px #fbbf2460);
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}