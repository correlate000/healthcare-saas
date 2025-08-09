'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'ユーザー名',
    email: 'user@example.com',
    bio: 'メンタルヘルスの改善を目指して毎日頑張っています',
    avatar: '👤',
    birthYear: '1990',
    gender: 'other',
    goals: ['ストレス管理', '睡眠改善', 'マインドフルネス'],
    interests: ['瞑想', '運動', '読書', '音楽'],
    joinDate: '2025年6月'
  })

  const [editForm, setEditForm] = useState({ ...profile })

  const avatarOptions = ['👤', '🦝', '🦊', '🐰', '🐸', '🦉', '🐻', '🐼', '🦁', '🐨']
  
  const goalOptions = [
    'ストレス管理', '睡眠改善', 'マインドフルネス', 
    '不安の軽減', '気分の改善', '集中力向上',
    '人間関係', '自己肯定感', 'ワークライフバランス'
  ]

  const interestOptions = [
    '瞑想', '運動', '読書', '音楽', 'ヨガ',
    '自然', 'アート', '料理', 'ゲーム', '映画'
  ]

  const stats = {
    level: 8,
    currentXP: 850,
    maxXP: 1000,
    totalSessions: 45,
    currentStreak: 15,
    longestStreak: 23,
    totalTime: '21時間',
    badges: 12,
    friends: 23,
    joinDate: '2025年6月'
  }

  const achievements = [
    { icon: '🔥', label: '連続記録', value: '15日' },
    { icon: '⭐', label: 'レベル', value: '8' },
    { icon: '🏆', label: 'バッジ', value: '12個' },
    { icon: '👥', label: '友達', value: '23人' }
  ]

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  const toggleGoal = (goal: string) => {
    if (editForm.goals.includes(goal)) {
      setEditForm({
        ...editForm,
        goals: editForm.goals.filter(g => g !== goal)
      })
    } else if (editForm.goals.length < 3) {
      setEditForm({
        ...editForm,
        goals: [...editForm.goals, goal]
      })
    }
  }

  const toggleInterest = (interest: string) => {
    if (editForm.interests.includes(interest)) {
      setEditForm({
        ...editForm,
        interests: editForm.interests.filter(i => i !== interest)
      })
    } else if (editForm.interests.length < 5) {
      setEditForm({
        ...editForm,
        interests: [...editForm.interests, interest]
      })
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            ...getTypographyStyles('h2'),
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            プロフィール
          </h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: isEditing ? '#a3e635' : 'rgba(163, 230, 53, 0.2)',
              color: isEditing ? '#111827' : '#a3e635',
              border: isEditing ? 'none' : '1px solid rgba(163, 230, 53, 0.3)',
              borderRadius: '10px',
              ...getTypographyStyles('button'),
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isEditing ? '保存' : '編集'}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Profile Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(163, 230, 53, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(163, 230, 53, 0.2) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Avatar Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {isEditing ? (
                <div>
                  <div style={{
                    ...getTypographyStyles('small'),
                    color: '#9ca3af',
                    marginBottom: '8px'
                  }}>
                    アバターを選択
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setEditForm({ ...editForm, avatar })}
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: editForm.avatar === avatar
                            ? 'rgba(163, 230, 53, 0.3)'
                            : 'rgba(55, 65, 81, 0.6)',
                          border: editForm.avatar === avatar
                            ? '2px solid #a3e635'
                            : '1px solid transparent',
                          borderRadius: '12px',
                          fontSize: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  boxShadow: '0 8px 24px rgba(163, 230, 53, 0.3)',
                  border: '3px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {profile.avatar}
                </div>
              )}

              {!isEditing && (
                <div>
                  <h2 style={{
                    ...getTypographyStyles('h2'),
                    fontWeight: '700',
                    color: '#f3f4f6',
                    marginBottom: '4px'
                  }}>
                    {profile.name}
                  </h2>
                  <p style={{
                    ...getTypographyStyles('base'),
                    color: '#9ca3af'
                  }}>
                    {profile.email}
                  </p>
                  <p style={{
                    ...getTypographyStyles('small'),
                    color: '#6b7280',
                    marginTop: '4px'
                  }}>
                    {profile.joinDate}から利用開始
                  </p>
                </div>
              )}
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div>
                  <label style={{
                    ...getTypographyStyles('label'),
                    color: '#9ca3af',
                    display: 'block',
                    marginBottom: '6px'
                  }}>
                    名前
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'rgba(55, 65, 81, 0.6)',
                      border: '1px solid rgba(55, 65, 81, 0.5)',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                      ...getTypographyStyles('base'),
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    ...getTypographyStyles('label'),
                    color: '#9ca3af',
                    display: 'block',
                    marginBottom: '6px'
                  }}>
                    自己紹介
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'rgba(55, 65, 81, 0.6)',
                      border: '1px solid rgba(55, 65, 81, 0.5)',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                      ...getTypographyStyles('base'),
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px'
                }}>
                  <div>
                    <label style={{
                      ...getTypographyStyles('label'),
                      color: '#9ca3af',
                      display: 'block',
                      marginBottom: '6px'
                    }}>
                      生年
                    </label>
                    <select
                      value={editForm.birthYear}
                      onChange={(e) => setEditForm({ ...editForm, birthYear: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'rgba(55, 65, 81, 0.6)',
                        border: '1px solid rgba(55, 65, 81, 0.5)',
                        borderRadius: '8px',
                        color: '#f3f4f6',
                        ...getTypographyStyles('base'),
                        outline: 'none'
                      }}
                    >
                      <option value="">選択</option>
                      {Array.from({ length: 80 }, (_, i) => 2010 - i).map(year => (
                        <option key={year} value={year}>{year}年</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      ...getTypographyStyles('label'),
                      color: '#9ca3af',
                      display: 'block',
                      marginBottom: '6px'
                    }}>
                      性別
                    </label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'rgba(55, 65, 81, 0.6)',
                        border: '1px solid rgba(55, 65, 81, 0.5)',
                        borderRadius: '8px',
                        color: '#f3f4f6',
                        ...getTypographyStyles('base'),
                        outline: 'none'
                      }}
                    >
                      <option value="other">選択しない</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Bio Display */}
            {!isEditing && profile.bio && (
              <p style={{
                ...getTypographyStyles('base'),
                color: '#d1d5db',
                lineHeight: '1.6',
                marginBottom: '20px',
                padding: '12px',
                backgroundColor: 'rgba(31, 41, 55, 0.4)',
                borderRadius: '12px'
              }}>
                {profile.bio}
              </p>
            )}

            {/* Level Progress */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ ...getTypographyStyles('label'), color: '#9ca3af' }}>レベル {stats.level}</span>
                <span style={{
                  ...getTypographyStyles('label'),
                  color: '#a3e635',
                  fontWeight: '600'
                }}>
                  {stats.currentXP} / {stats.maxXP} XP
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(55, 65, 81, 0.6)',
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(stats.currentXP / stats.maxXP) * 100}%`,
                  background: 'linear-gradient(90deg, #a3e635 0%, #84cc16 100%)',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease',
                  boxShadow: '0 0 10px rgba(163, 230, 53, 0.4)'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {achievements.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid rgba(55, 65, 81, 0.3)'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{
                ...getTypographyStyles('h2'),
                fontWeight: '700',
                color: '#a3e635',
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{
                ...getTypographyStyles('small'),
                color: '#9ca3af'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Goals & Interests */}
        {isEditing ? (
          <>
            {/* Edit Goals */}
            <div style={{
              marginBottom: '24px'
            }}>
              <h3 style={{
                ...getTypographyStyles('large'),
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '12px'
              }}>
                目標（最大3つ）
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: editForm.goals.includes(goal)
                        ? 'rgba(163, 230, 53, 0.2)'
                        : 'rgba(55, 65, 81, 0.6)',
                      color: editForm.goals.includes(goal) ? '#a3e635' : '#9ca3af',
                      border: editForm.goals.includes(goal)
                        ? '1px solid rgba(163, 230, 53, 0.3)'
                        : '1px solid transparent',
                      borderRadius: '20px',
                      ...getTypographyStyles('label'),
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Edit Interests */}
            <div style={{
              marginBottom: '24px'
            }}>
              <h3 style={{
                ...getTypographyStyles('large'),
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '12px'
              }}>
                興味（最大5つ）
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: editForm.interests.includes(interest)
                        ? 'rgba(96, 165, 250, 0.2)'
                        : 'rgba(55, 65, 81, 0.6)',
                      color: editForm.interests.includes(interest) ? '#60a5fa' : '#9ca3af',
                      border: editForm.interests.includes(interest)
                        ? '1px solid rgba(96, 165, 250, 0.3)'
                        : '1px solid transparent',
                      borderRadius: '20px',
                      ...getTypographyStyles('label'),
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'rgba(55, 65, 81, 0.6)',
                color: '#d1d5db',
                border: '1px solid rgba(55, 65, 81, 0.5)',
                borderRadius: '12px',
                ...getTypographyStyles('button'),
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              キャンセル
            </button>
          </>
        ) : (
          <>
            {/* Display Goals */}
            <div style={{
              marginBottom: '24px'
            }}>
              <h3 style={{
                ...getTypographyStyles('large'),
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '12px'
              }}>
                目標
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {profile.goals.map((goal) => (
                  <span
                    key={goal}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'rgba(163, 230, 53, 0.2)',
                      color: '#a3e635',
                      borderRadius: '20px',
                      ...getTypographyStyles('label'),
                      fontWeight: '500'
                    }}
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>

            {/* Display Interests */}
            <div style={{
              marginBottom: '24px'
            }}>
              <h3 style={{
                ...getTypographyStyles('large'),
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '12px'
              }}>
                興味・関心
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'rgba(96, 165, 250, 0.2)',
                      color: '#60a5fa',
                      borderRadius: '20px',
                      ...getTypographyStyles('label'),
                      fontWeight: '500'
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <button
                onClick={() => router.push('/achievements')}
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '12px',
                  ...getTypographyStyles('button'),
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>🏆</span>
                実績を見る
              </button>
              <button
                onClick={() => router.push('/settings')}
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(55, 65, 81, 0.6)',
                  color: '#d1d5db',
                  border: '1px solid rgba(55, 65, 81, 0.5)',
                  borderRadius: '12px',
                  ...getTypographyStyles('button'),
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>⚙️</span>
                設定
              </button>
            </div>
          </>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}