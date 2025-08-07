'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function TeamConnectPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'groups' | 'events' | 'messages'>('groups')
  const [joinedGroups, setJoinedGroups] = useState<number[]>([1, 3])

  const groups = [
    {
      id: 1,
      name: '朝活チーム',
      category: 'ライフスタイル',
      members: 234,
      description: '早起きと朝の習慣で1日を充実させよう',
      icon: '☀️',
      activity: '非常に活発',
      newPosts: 12,
      joined: true
    },
    {
      id: 2,
      name: 'マインドフルネス部',
      category: '瞑想',
      members: 189,
      description: '日々の瞑想と内省を共有する場所',
      icon: '🧘',
      activity: '活発',
      newPosts: 5,
      joined: false
    },
    {
      id: 3,
      name: '睡眠改善サークル',
      category: '健康',
      members: 456,
      description: '良質な睡眠を目指して情報交換',
      icon: '😴',
      activity: '活発',
      newPosts: 8,
      joined: true
    },
    {
      id: 4,
      name: 'ストレス管理研究会',
      category: 'メンタルヘルス',
      members: 312,
      description: 'ストレスと上手に付き合う方法を学ぶ',
      icon: '💆',
      activity: '普通',
      newPosts: 3,
      joined: false
    }
  ]

  const events = [
    {
      id: 1,
      title: '週末瞑想セッション',
      date: '8月10日(土)',
      time: '10:00 - 11:00',
      type: 'オンライン',
      host: 'マインドフルネス部',
      participants: 45,
      maxParticipants: 50,
      icon: '🧘',
      status: 'upcoming'
    },
    {
      id: 2,
      title: '睡眠習慣改善ワークショップ',
      date: '8月12日(月)',
      time: '20:00 - 21:30',
      type: 'オンライン',
      host: '睡眠改善サークル',
      participants: 28,
      maxParticipants: 100,
      icon: '🛏️',
      status: 'upcoming'
    },
    {
      id: 3,
      title: '朝ヨガチャレンジ',
      date: '毎日',
      time: '6:00 - 6:30',
      type: '自主参加',
      host: '朝活チーム',
      participants: 156,
      maxParticipants: null,
      icon: '🧘‍♀️',
      status: 'ongoing'
    }
  ]

  const messages = [
    {
      id: 1,
      group: '朝活チーム',
      sender: 'Yuki',
      avatar: '👤',
      content: '今朝も5時起きできました！皆さんはどうでしたか？',
      time: '5分前',
      unread: true
    },
    {
      id: 2,
      group: '睡眠改善サークル',
      sender: 'Mika',
      avatar: '👤',
      content: '新しい睡眠トラッカーアプリを見つけました。共有しますね！',
      time: '1時間前',
      unread: true
    },
    {
      id: 3,
      group: '朝活チーム',
      sender: 'Taro',
      avatar: '👤',
      content: '明日の朝ランニング、参加者募集中です',
      time: '3時間前',
      unread: false
    }
  ]

  const handleJoinGroup = (groupId: number) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter(id => id !== groupId))
    } else {
      setJoinedGroups([...joinedGroups, groupId])
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
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #374151'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#f3f4f6',
          margin: 0,
          marginBottom: '8px'
        }}>
          チームコネクト
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#9ca3af'
        }}>
          仲間と一緒に目標達成
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        padding: '16px',
        gap: '8px',
        borderBottom: '1px solid #374151'
      }}>
        {[
          { key: 'groups', label: 'グループ', badge: groups.length },
          { key: 'events', label: 'イベント', badge: events.filter(e => e.status === 'upcoming').length },
          { key: 'messages', label: 'メッセージ', badge: messages.filter(m => m.unread).length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: selectedTab === tab.key ? '#a3e635' : '#374151',
              color: selectedTab === tab.key ? '#111827' : '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '10px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '10px',
                minWidth: '18px'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {/* Groups Tab */}
        {selectedTab === 'groups' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {groups.map(group => {
              const isJoined = joinedGroups.includes(group.id)
              
              return (
                <div
                  key={group.id}
                  style={{
                    backgroundColor: '#1f2937',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: isJoined ? '4px solid #a3e635' : '4px solid transparent'
                  }}
                  onClick={() => {/* View group details */}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
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
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#374151',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        {group.icon}
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#f3f4f6',
                          marginBottom: '4px'
                        }}>
                          {group.name}
                        </h3>
                        <p style={{
                          fontSize: '13px',
                          color: '#9ca3af',
                          marginBottom: '8px'
                        }}>
                          {group.description}
                        </p>
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            backgroundColor: '#374151',
                            color: '#d1d5db',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}>
                            {group.category}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: '#9ca3af'
                          }}>
                            👥 {group.members}人
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: group.activity === '非常に活発' ? '#a3e635' : '#60a5fa'
                          }}>
                            • {group.activity}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {group.newPosts > 0 && (
                      <span style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 8px',
                        borderRadius: '12px'
                      }}>
                        {group.newPosts} new
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleJoinGroup(group.id)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: isJoined ? '#374151' : '#a3e635',
                      color: isJoined ? '#9ca3af' : '#111827',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isJoined ? '#4b5563' : '#84cc16'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isJoined ? '#374151' : '#a3e635'
                    }}
                  >
                    {isJoined ? '参加済み' : 'グループに参加'}
                  </button>
                </div>
              )
            })}

            {/* Create new group button */}
            <button
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'transparent',
                color: '#9ca3af',
                border: '2px dashed #374151',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4b5563'
                e.currentTarget.style.color = '#d1d5db'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#374151'
                e.currentTarget.style.color = '#9ca3af'
              }}
            >
              <span style={{ fontSize: '20px' }}>+</span>
              新しいグループを作成
            </button>
          </div>
        )}

        {/* Events Tab */}
        {selectedTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map(event => (
              <div
                key={event.id}
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderTop: event.status === 'ongoing' ? '3px solid #a3e635' : 'none'
                }}
                onClick={() => {/* View event details */}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: event.status === 'ongoing' ? '#a3e635' : '#374151',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {event.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '4px'
                    }}>
                      {event.title}
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: '#9ca3af'
                      }}>
                        <span>📅 {event.date}</span>
                        <span>⏰ {event.time}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: '#9ca3af'
                      }}>
                        <span style={{
                          backgroundColor: '#374151',
                          color: '#d1d5db',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px'
                        }}>
                          {event.type}
                        </span>
                        <span>主催: {event.host}</span>
                      </div>
                    </div>

                    {/* Participant progress */}
                    {event.maxParticipants && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: '#9ca3af'
                          }}>
                            参加者
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: '#a3e635',
                            fontWeight: '600'
                          }}>
                            {event.participants}/{event.maxParticipants}人
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
                            width: `${(event.participants / event.maxParticipants) * 100}%`,
                            backgroundColor: event.participants >= event.maxParticipants ? '#ef4444' : '#a3e635',
                            borderRadius: '2px'
                          }}></div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: event.status === 'ongoing' ? '#a3e635' : '#374151',
                        color: event.status === 'ongoing' ? '#111827' : '#d1d5db',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {event.status === 'ongoing' ? '参加中' : '参加する'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages Tab */}
        {selectedTab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map(message => (
              <div
                key={message.id}
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: message.unread ? '4px solid #a3e635' : '4px solid transparent'
                }}
                onClick={() => router.push('/chat')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#374151',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    {message.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <div>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#f3f4f6',
                          marginRight: '8px'
                        }}>
                          {message.sender}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: '#9ca3af'
                        }}>
                          in {message.group}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        color: '#9ca3af'
                      }}>
                        {message.time}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: message.unread ? '#f3f4f6' : '#9ca3af',
                      margin: 0,
                      lineHeight: '1.4',
                      fontWeight: message.unread ? '500' : '400'
                    }}>
                      {message.content}
                    </p>
                  </div>
                  {message.unread && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#a3e635',
                      borderRadius: '50%',
                      marginTop: '6px'
                    }}></div>
                  )}
                </div>
              </div>
            ))}

            {/* View all messages button */}
            <button
              onClick={() => router.push('/chat')}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#374151',
                color: '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
            >
              すべてのメッセージを見る
            </button>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}