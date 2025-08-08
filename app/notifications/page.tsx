'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function NotificationsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'achievement',
      title: '新しいバッジを獲得！',
      message: '「7日間連続ログイン」バッジを獲得しました',
      time: '5分前',
      isRead: false,
      icon: '🏆',
      color: '#fbbf24'
    },
    {
      id: 2,
      type: 'friend',
      title: 'みゆきさんが友達リクエストを送信',
      message: 'プロフィールを見て承認しましょう',
      time: '1時間前',
      isRead: false,
      icon: '👥',
      color: '#60a5fa'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'チェックインの時間です',
      message: '今日の気分を記録しましょう',
      time: '2時間前',
      isRead: false,
      icon: '🔔',
      color: '#a3e635'
    },
    {
      id: 4,
      type: 'message',
      title: 'ルナちゃんからメッセージ',
      message: '最近の調子はどうですか？話を聞かせてください',
      time: '3時間前',
      isRead: true,
      icon: '💬',
      color: '#a78bfa'
    },
    {
      id: 5,
      type: 'group',
      title: 'モーニングメディテーション開始',
      message: '朝の瞑想セッションが始まります',
      time: '昨日',
      isRead: true,
      icon: '🧘',
      color: '#f87171'
    },
    {
      id: 6,
      type: 'system',
      title: 'アプリアップデートのお知らせ',
      message: '新機能が追加されました',
      time: '2日前',
      isRead: true,
      icon: '📱',
      color: '#9ca3af'
    }
  ])

  const unreadCount = notifications.filter(n => !n.isRead).length
  const filteredNotifications = selectedCategory === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    
    switch(notification.type) {
      case 'message':
        router.push('/chat')
        break
      case 'achievement':
        router.push('/achievements')
        break
      case 'friend':
        router.push('/team-connect')
        break
      case 'group':
        router.push('/team-connect')
        break
      case 'reminder':
        router.push('/dashboard')
        break
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
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            通知センター
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(163, 230, 53, 0.2)',
                color: '#a3e635',
                border: '1px solid rgba(163, 230, 53, 0.3)',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              すべて既読にする
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: selectedCategory === 'all'
                ? 'rgba(163, 230, 53, 0.2)'
                : 'transparent',
              color: selectedCategory === 'all' ? '#a3e635' : '#9ca3af',
              border: selectedCategory === 'all'
                ? '1px solid rgba(163, 230, 53, 0.3)'
                : '1px solid transparent',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            すべて ({notifications.length})
          </button>
          <button
            onClick={() => setSelectedCategory('unread')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: selectedCategory === 'unread'
                ? 'rgba(163, 230, 53, 0.2)'
                : 'transparent',
              color: selectedCategory === 'unread' ? '#a3e635' : '#9ca3af',
              border: selectedCategory === 'unread'
                ? '1px solid rgba(163, 230, 53, 0.3)'
                : '1px solid transparent',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            未読
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '12px',
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '10px',
                minWidth: '18px'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: 0.5
            }}>
              🔔
            </div>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af'
            }}>
              {selectedCategory === 'unread' ? '未読の通知はありません' : '通知はありません'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  background: notification.isRead
                    ? 'rgba(31, 41, 55, 0.6)'
                    : `linear-gradient(135deg, ${notification.color}10 0%, rgba(31, 41, 55, 0.8) 100%)`,
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: notification.isRead
                    ? '1px solid rgba(55, 65, 81, 0.3)'
                    : `2px solid ${notification.color}40`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onClick={() => handleNotificationClick(notification)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 8px 24px ${notification.color}20`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {!notification.isRead && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: notification.color,
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                )}
                
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: `${notification.color}20`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    {notification.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: notification.isRead ? '500' : '600',
                        color: notification.isRead ? '#d1d5db' : '#f3f4f6',
                        margin: 0
                      }}>
                        {notification.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#6b7280',
                          fontSize: '16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
                          e.currentTarget.style.color = '#ef4444'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = '#6b7280'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <p style={{
                      fontSize: '13px',
                      color: notification.isRead ? '#9ca3af' : '#d1d5db',
                      margin: '0 0 8px 0',
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {notification.time}
                      </span>
                      
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: 'rgba(163, 230, 53, 0.2)',
                            color: '#a3e635',
                            border: '1px solid rgba(163, 230, 53, 0.3)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          既読にする
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Settings Card */}
        <div style={{
          marginTop: '32px',
          background: 'rgba(31, 41, 55, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(55, 65, 81, 0.3)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚙️</span>
            通知設定
          </h3>
          
          <button
            onClick={() => router.push('/settings')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(55, 65, 81, 0.6)',
              color: '#d1d5db',
              border: '1px solid rgba(55, 65, 81, 0.5)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.6)'
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)'
              e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.5)'
            }}
          >
            通知設定を管理する
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}