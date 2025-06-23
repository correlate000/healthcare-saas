'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Bell, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Star,
  AlertCircle,
  Gift,
  TrendingUp,
  Settings,
  Check,
  X,
  Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock notifications data
const notificationsData = [
  {
    id: '1',
    type: 'checkin_reminder',
    title: 'チェックインのお時間です',
    message: 'Lunaがあなたをお待ちしています。今日の気分を聞かせてください。',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    read: false,
    urgent: false,
    action: {
      label: 'チェックイン',
      url: '/checkin'
    }
  },
  {
    id: '2',
    type: 'achievement',
    title: '新しいバッジを獲得！',
    message: '「一週間の継続」バッジを獲得しました。素晴らしい継続力です！',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    urgent: false,
    action: {
      label: 'バッジを見る',
      url: '/achievements'
    }
  },
  {
    id: '3',
    type: 'ai_message',
    title: 'Lunaからのメッセージ',
    message: '最近よく頑張っていますね。今日は少し休憩してみませんか？',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    urgent: false,
    action: {
      label: '返信する',
      url: '/chat'
    }
  },
  {
    id: '4',
    type: 'expert_booking',
    title: '面談予約の確認',
    message: '明日14:00の田中先生との面談が予約されています。',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
    urgent: true,
    action: {
      label: '詳細を見る',
      url: '/booking'
    }
  },
  {
    id: '5',
    type: 'weekly_report',
    title: '週次レポートが完成しました',
    message: 'この一週間のあなたの成長記録をご覧ください。',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    urgent: false,
    action: {
      label: 'レポートを見る',
      url: '/analytics'
    }
  },
  {
    id: '6',
    type: 'encouragement',
    title: '今日も素敵な一日を',
    message: 'あなたの存在自体が誰かの励みになっています。今日も自分らしく過ごしましょう。',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    urgent: false
  }
]

export default function Notifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(notificationsData)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'checkin_reminder': return <Heart className="h-5 w-5 text-blue-500" />
      case 'achievement': return <Star className="h-5 w-5 text-yellow-500" />
      case 'ai_message': return <MessageCircle className="h-5 w-5 text-purple-500" />
      case 'expert_booking': return <Calendar className="h-5 w-5 text-green-500" />
      case 'weekly_report': return <TrendingUp className="h-5 w-5 text-indigo-500" />
      case 'encouragement': return <Gift className="h-5 w-5 text-pink-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'checkin_reminder': return 'bg-blue-50 border-blue-200'
      case 'achievement': return 'bg-yellow-50 border-yellow-200'
      case 'ai_message': return 'bg-purple-50 border-purple-200'
      case 'expert_booking': return 'bg-green-50 border-green-200'
      case 'weekly_report': return 'bg-indigo-50 border-indigo-200'
      case 'encouragement': return 'bg-pink-50 border-pink-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}日前`
    if (hours > 0) return `${hours}時間前`
    if (minutes > 0) return `${minutes}分前`
    return 'たった今'
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.action?.url) {
      router.push(notification.action.url)
    }
  }

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || (filter === 'unread' && !notif.read)
  )

  const unreadCount = notifications.filter(notif => !notif.read).length

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new notification (for demo purposes)
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newNotification = {
          id: Date.now().toString(),
          type: 'encouragement',
          title: 'リアルタイムメッセージ',
          message: 'お疲れ様です！少し休憩してみませんか？',
          timestamp: new Date(),
          read: false,
          urgent: false
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-medium text-gray-900">通知</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500">{unreadCount}件の未読通知</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Filter Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            すべて ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            未読 ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">通知がありません</h3>
              <p className="text-sm text-gray-500">
                {filter === 'unread' ? '未読の通知はありません' : '新しい通知はありません'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  !notification.read 
                    ? `border-l-4 border-l-blue-500 ${getNotificationBg(notification.type)}`
                    : 'bg-white border-gray-200'
                } ${notification.urgent ? 'ring-2 ring-red-200' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          {notification.urgent && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-600'} mb-2`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          {notification.action && (
                            <Button variant="outline" size="sm" className="text-xs">
                              {notification.action.label}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Notification Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">通知設定</CardTitle>
            <CardDescription>受け取りたい通知をカスタマイズ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: 'checkin', label: 'チェックインリマインダー', enabled: true },
                { key: 'ai_messages', label: 'AIからのメッセージ', enabled: true },
                { key: 'achievements', label: '達成・バッジ通知', enabled: true },
                { key: 'expert', label: '専門家からのお知らせ', enabled: false },
                { key: 'reports', label: 'レポート・分析結果', enabled: true },
                { key: 'encouragement', label: '励ましメッセージ', enabled: true },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{setting.label}</span>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}