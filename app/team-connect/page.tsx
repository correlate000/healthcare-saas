'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'

export default function TeamConnectPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'friends' | 'groups' | 'discover'>('friends')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)

  const friends = [
    {
      id: 1,
      name: 'みゆきさん',
      avatar: '🦝',
      status: 'オンライン',
      lastActive: '今',
      level: 12,
      streak: 23,
      mutualGoals: ['瞑想', 'ストレス管理'],
      mood: 'happy'
    },
    {
      id: 2,
      name: 'たくやさん',
      avatar: '🦊',
      status: 'オフライン',
      lastActive: '3時間前',
      level: 8,
      streak: 15,
      mutualGoals: ['運動', '睡眠改善'],
      mood: 'neutral'
    },
    {
      id: 3,
      name: 'さくらさん',
      avatar: '🐰',
      status: 'オンライン',
      lastActive: '今',
      level: 15,
      streak: 45,
      mutualGoals: ['マインドフルネス', '瞑想'],
      mood: 'happy'
    },
    {
      id: 4,
      name: 'けんたさん',
      avatar: '🐸',
      status: 'アクティブ',
      lastActive: '30分前',
      level: 10,
      streak: 7,
      mutualGoals: ['運動', 'ストレス管理'],
      mood: 'energetic'
    }
  ]

  const groups = [
    {
      id: 1,
      name: 'モーニングメディテーション',
      icon: '🌅',
      members: 24,
      activeNow: 5,
      description: '毎朝6時から瞑想セッション',
      category: '瞑想',
      isJoined: true,
      nextSession: '明日 6:00'
    },
    {
      id: 2,
      name: 'ストレスフリーチャレンジ',
      icon: '🎯',
      members: 89,
      activeNow: 12,
      description: '30日間のストレス管理プログラム',
      category: 'チャレンジ',
      isJoined: true,
      nextSession: '今日 20:00'
    },
    {
      id: 3,
      name: 'ヨガ＆ストレッチ',
      icon: '🧘‍♀️',
      members: 156,
      activeNow: 23,
      description: '初心者歓迎のヨガグループ',
      category: '運動',
      isJoined: false,
      nextSession: '毎日 19:00'
    },
    {
      id: 4,
      name: '睡眠改善サークル',
      icon: '😴',
      members: 67,
      activeNow: 3,
      description: '良質な睡眠を目指す仲間たち',
      category: '健康',
      isJoined: false,
      nextSession: '今夜 21:00'
    }
  ]

  const activities = [
    {
      id: 1,
      user: 'みゆきさん',
      avatar: '🦝',
      action: '7日間連続チャレンジを達成しました！',
      time: '5分前',
      type: 'achievement',
      reactions: 12,
      hasReacted: false
    },
    {
      id: 2,
      user: 'さくらさん',
      avatar: '🐰',
      action: '「モーニングメディテーション」に参加しました',
      time: '1時間前',
      type: 'activity',
      reactions: 5,
      hasReacted: true
    },
    {
      id: 3,
      user: 'けんたさん',
      avatar: '🐸',
      action: 'レベル10に到達しました！',
      time: '2時間前',
      type: 'levelup',
      reactions: 23,
      hasReacted: false
    }
  ]

  const challenges = [
    {
      id: 1,
      title: '週間瞑想マラソン',
      participants: 45,
      daysLeft: 3,
      progress: 60,
      reward: '限定バッジ'
    },
    {
      id: 2,
      title: '早起きチャレンジ',
      participants: 89,
      daysLeft: 5,
      progress: 40,
      reward: '100 XP'
    }
  ]

  const getMoodColor = (mood: string) => {
    switch(mood) {
      case 'happy': return '#a3e635'
      case 'energetic': return '#fbbf24'
      case 'neutral': return '#60a5fa'
      default: return '#9ca3af'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'オンライン': return '#a3e635'
      case 'アクティブ': return '#fbbf24'
      default: return '#6b7280'
    }
  }

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
          justifyContent: 'space-between',
          marginBottom: '16px'
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
            チームコネクト
          </h1>
          <button
            onClick={() => router.push('/notifications')}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(163, 230, 53, 0.2)',
              border: '1px solid rgba(163, 230, 53, 0.3)',
              borderRadius: '12px',
              color: '#a3e635',
              ...getTypographyStyles('h4'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            🔔
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid #111827'
            }}></span>
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: '16px'
        }}>
          <input
            type="text"
            placeholder="友達やグループを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              backgroundColor: 'rgba(55, 65, 81, 0.6)',
              border: '1px solid rgba(55, 65, 81, 0.5)',
              borderRadius: '12px',
              color: '#f3f4f6',
              ...getTypographyStyles('base'),
              outline: 'none'
            }}
          />
          <span style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            ...getTypographyStyles('large')
          }}>
            🔍
          </span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {[
            { id: 'friends', label: '友達', icon: '👥' },
            { id: 'groups', label: 'グループ', icon: '🌟' },
            { id: 'discover', label: '見つける', icon: '🔍' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: activeTab === tab.id
                  ? 'rgba(163, 230, 53, 0.2)'
                  : 'transparent',
                color: activeTab === tab.id ? '#a3e635' : '#9ca3af',
                border: activeTab === tab.id
                  ? '1px solid rgba(163, 230, 53, 0.3)'
                  : '1px solid transparent',
                borderRadius: '10px',
                ...getTypographyStyles('button'),
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <>
            {/* Friend Activity Feed */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid rgba(96, 165, 250, 0.2)'
            }}>
              <h3 style={{
                ...getTypographyStyles('large'),
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📢</span>
                最近のアクティビティ
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'rgba(31, 41, 55, 0.4)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'rgba(55, 65, 81, 0.6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...getTypographyStyles('h3')
                    }}>
                      {activity.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        ...getTypographyStyles('base'),
                        color: '#f3f4f6',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: '600' }}>{activity.user}</span>
                        <span style={{ color: '#9ca3af' }}> {activity.action}</span>
                      </div>
                      <div style={{
                        ...getTypographyStyles('small'),
                        color: '#6b7280'
                      }}>
                        {activity.time}
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: activity.hasReacted
                          ? 'rgba(163, 230, 53, 0.2)'
                          : 'rgba(55, 65, 81, 0.6)',
                        color: activity.hasReacted ? '#a3e635' : '#9ca3af',
                        border: 'none',
                        borderRadius: '8px',
                        ...getTypographyStyles('small'),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>👍</span>
                      {activity.reactions}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Friends List */}
            <h3 style={{
              ...getTypographyStyles('large'),
              fontWeight: '600',
              color: '#f3f4f6',
              marginBottom: '16px'
            }}>
              友達一覧（{friends.length}人）
            </h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  style={{
                    background: 'rgba(31, 41, 55, 0.6)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid rgba(55, 65, 81, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: 'rgba(55, 65, 81, 0.6)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...getTypographyStyles('h1'),
                        border: `2px solid ${getMoodColor(friend.mood)}`
                      }}>
                        {friend.avatar}
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '16px',
                        height: '16px',
                        backgroundColor: getStatusColor(friend.status),
                        borderRadius: '50%',
                        border: '2px solid #111827'
                      }}></div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          ...getTypographyStyles('large'),
                          fontWeight: '600',
                          color: '#f3f4f6'
                        }}>
                          {friend.name}
                        </span>
                        <span style={{
                          ...getTypographyStyles('small'),
                          backgroundColor: 'rgba(163, 230, 53, 0.2)',
                          color: '#a3e635',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: '600'
                        }}>
                          Lv.{friend.level}
                        </span>
                      </div>
                      <div style={{
                        ...getTypographyStyles('small'),
                        color: '#9ca3af',
                        marginBottom: '8px'
                      }}>
                        {friend.status} • {friend.lastActive}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{
                          ...getTypographyStyles('small'),
                          color: '#fbbf24',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          🔥 {friend.streak}日
                        </span>
                        <div style={{
                          display: 'flex',
                          gap: '4px'
                        }}>
                          {friend.mutualGoals.map((goal, index) => (
                            <span
                              key={index}
                              style={{
                                ...getTypographyStyles('caption'),
                                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                                color: '#60a5fa',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: 'rgba(163, 230, 53, 0.2)',
                        border: '1px solid rgba(163, 230, 53, 0.3)',
                        borderRadius: '10px',
                        color: '#a3e635',
                        ...getTypographyStyles('large'),
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push('/chat')
                      }}
                    >
                      💬
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <>
            {/* Active Challenges */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              <h3 style={{
                ...getTypographyStyles('large'),
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🏆</span>
                参加中のチャレンジ
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'rgba(31, 41, 55, 0.4)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        ...getTypographyStyles('base'),
                        fontWeight: '600',
                        color: '#f3f4f6',
                        marginBottom: '4px'
                      }}>
                        {challenge.title}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        ...getTypographyStyles('small'),
                        color: '#9ca3af'
                      }}>
                        <span>👥 {challenge.participants}人</span>
                        <span>⏱️ 残り{challenge.daysLeft}日</span>
                        <span style={{ color: '#fbbf24' }}>🎁 {challenge.reward}</span>
                      </div>
                      <div style={{
                        marginTop: '8px',
                        height: '6px',
                        backgroundColor: 'rgba(55, 65, 81, 0.6)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${challenge.progress}%`,
                          backgroundColor: '#fbbf24',
                          borderRadius: '3px'
                        }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Groups List */}
            <h3 style={{
              ...getTypographyStyles('large'),
              fontWeight: '600',
              color: '#f3f4f6',
              marginBottom: '16px'
            }}>
              参加中のグループ
            </h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {groups.filter(g => g.isJoined).map((group) => (
                <div
                  key={group.id}
                  style={{
                    background: selectedGroup === group.id
                      ? 'linear-gradient(135deg, rgba(163, 230, 53, 0.2) 0%, rgba(31, 41, 55, 0.6) 100%)'
                      : 'rgba(31, 41, 55, 0.6)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: selectedGroup === group.id
                      ? '2px solid rgba(163, 230, 53, 0.4)'
                      : '1px solid rgba(55, 65, 81, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: 'rgba(163, 230, 53, 0.2)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...getTypographyStyles('h1')
                    }}>
                      {group.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        ...getTypographyStyles('large'),
                        fontWeight: '600',
                        color: '#f3f4f6',
                        marginBottom: '4px'
                      }}>
                        {group.name}
                      </div>
                      <div style={{
                        ...getTypographyStyles('label'),
                        color: '#9ca3af',
                        marginBottom: '8px'
                      }}>
                        {group.description}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        ...getTypographyStyles('small')
                      }}>
                        <span style={{ color: '#a3e635' }}>
                          🟢 {group.activeNow}人がアクティブ
                        </span>
                        <span style={{ color: '#9ca3af' }}>
                          👥 {group.members}人
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedGroup === group.id && (
                    <div style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(55, 65, 81, 0.3)'
                    }}>
                      <div style={{
                        ...getTypographyStyles('label'),
                        color: '#f3f4f6',
                        marginBottom: '12px'
                      }}>
                        次のセッション: <span style={{ color: '#a3e635', fontWeight: '600' }}>{group.nextSession}</span>
                      </div>
                      <button
                        style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#a3e635',
                          color: '#111827',
                          border: 'none',
                          borderRadius: '10px',
                          ...getTypographyStyles('button'),
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        セッションに参加
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <>
            <h3 style={{
              ...getTypographyStyles('large'),
              fontWeight: '600',
              color: '#f3f4f6',
              marginBottom: '16px'
            }}>
              おすすめのグループ
            </h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {groups.filter(g => !g.isJoined).map((group) => (
                <div
                  key={group.id}
                  style={{
                    background: 'rgba(31, 41, 55, 0.6)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid rgba(55, 65, 81, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: 'rgba(96, 165, 250, 0.2)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...getTypographyStyles('h1')
                    }}>
                      {group.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        ...getTypographyStyles('large'),
                        fontWeight: '600',
                        color: '#f3f4f6',
                        marginBottom: '4px'
                      }}>
                        {group.name}
                      </div>
                      <div style={{
                        ...getTypographyStyles('label'),
                        color: '#9ca3af',
                        marginBottom: '8px'
                      }}>
                        {group.description}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        ...getTypographyStyles('small')
                      }}>
                        <span style={{
                          backgroundColor: 'rgba(96, 165, 250, 0.2)',
                          color: '#60a5fa',
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          {group.category}
                        </span>
                        <span style={{ color: '#9ca3af' }}>
                          👥 {group.members}人
                        </span>
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'rgba(163, 230, 53, 0.2)',
                        color: '#a3e635',
                        border: '1px solid rgba(163, 230, 53, 0.3)',
                        borderRadius: '10px',
                        ...getTypographyStyles('button'),
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      参加
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Invite Friends */}
            <div style={{
              marginTop: '32px',
              background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              border: '1px solid rgba(163, 230, 53, 0.2)'
            }}>
              <div style={{
                fontSize: '40px',
                marginBottom: '16px'
              }}>
                🎉
              </div>
              <h3 style={{
                ...getTypographyStyles('h4'),
                fontWeight: '700',
                color: '#f3f4f6',
                marginBottom: '8px'
              }}>
                友達を招待しよう！
              </h3>
              <p style={{
                ...getTypographyStyles('base'),
                color: '#9ca3af',
                marginBottom: '20px'
              }}>
                一緒に健康目標を達成する仲間を増やしましょう
              </p>
              <button
                style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '12px',
                  ...getTypographyStyles('large'),
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                招待リンクをシェア
              </button>
            </div>
          </>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}