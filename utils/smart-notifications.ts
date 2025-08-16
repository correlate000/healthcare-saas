// スマート通知システム - 習慣化を促進する通知管理

export interface NotificationPreference {
  enabled: boolean
  timeSlots: string[]
  frequency: 'daily' | 'weekly' | 'smart'
  types: {
    dailyReminder: boolean
    streakWarning: boolean
    achievement: boolean
    teamActivity: boolean
    weeklyReport: boolean
  }
}

export interface SmartNotification {
  id: string
  type: 'reminder' | 'streak' | 'achievement' | 'social' | 'insight'
  title: string
  body: string
  icon?: string
  action?: {
    label: string
    url: string
  }
  priority: 'high' | 'medium' | 'low'
  scheduledFor: Date
  sent?: boolean
}

export class SmartNotificationManager {
  private static instance: SmartNotificationManager
  private notifications: SmartNotification[] = []
  private userPatterns: {
    mostActiveHours: number[]
    averageSessionLength: number
    preferredDays: string[]
    responseRate: Map<string, number>
  } = {
    mostActiveHours: [],
    averageSessionLength: 0,
    preferredDays: [],
    responseRate: new Map()
  }

  private constructor() {
    this.loadUserPatterns()
    this.initializeNotificationWorker()
  }

  static getInstance(): SmartNotificationManager {
    if (!SmartNotificationManager.instance) {
      SmartNotificationManager.instance = new SmartNotificationManager()
    }
    return SmartNotificationManager.instance
  }

  // ユーザーの利用パターンを学習
  private loadUserPatterns() {
    const patterns = localStorage.getItem('userPatterns')
    if (patterns) {
      const parsed = JSON.parse(patterns)
      this.userPatterns = {
        ...this.userPatterns,
        ...parsed,
        responseRate: new Map(parsed.responseRate || [])
      }
    }
    this.analyzeUsagePatterns()
  }

  // 利用パターンの分析
  private analyzeUsagePatterns() {
    const usageLogs = JSON.parse(localStorage.getItem('usageLogs') || '[]')
    
    // 最もアクティブな時間帯を特定
    const hourCounts = new Array(24).fill(0)
    usageLogs.forEach((log: any) => {
      const hour = new Date(log.timestamp).getHours()
      hourCounts[hour]++
    })
    
    const maxCount = Math.max(...hourCounts)
    this.userPatterns.mostActiveHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(item => item.count >= maxCount * 0.7)
      .map(item => item.hour)
    
    // 平均セッション時間
    const sessionLengths = usageLogs
      .filter((log: any) => log.sessionLength)
      .map((log: any) => log.sessionLength)
    
    if (sessionLengths.length > 0) {
      this.userPatterns.averageSessionLength = 
        sessionLengths.reduce((a: number, b: number) => a + b, 0) / sessionLengths.length
    }
    
    this.saveUserPatterns()
  }

  private saveUserPatterns() {
    localStorage.setItem('userPatterns', JSON.stringify({
      ...this.userPatterns,
      responseRate: Array.from(this.userPatterns.responseRate.entries())
    }))
  }

  // 最適な通知時間を予測
  predictOptimalNotificationTime(type: string): Date {
    const now = new Date()
    const baseHour = this.userPatterns.mostActiveHours[0] || 9
    
    // タイプ別の調整
    const adjustments: { [key: string]: number } = {
      'morning_checkin': -1, // アクティブ時間の1時間前
      'evening_reflection': 2, // アクティブ時間の2時間後
      'streak_warning': 0, // アクティブ時間そのもの
      'weekly_report': 3 // アクティブ時間の3時間後
    }
    
    const adjustment = adjustments[type] || 0
    let targetHour = (baseHour + adjustment) % 24
    
    // 応答率に基づく微調整
    const responseRate = this.userPatterns.responseRate.get(type) || 0.5
    if (responseRate < 0.3) {
      // 応答率が低い場合は時間を変更
      targetHour = (targetHour + 2) % 24
    }
    
    const targetDate = new Date(now)
    targetDate.setHours(targetHour, 0, 0, 0)
    
    // 過去の時間なら翌日に設定
    if (targetDate <= now) {
      targetDate.setDate(targetDate.getDate() + 1)
    }
    
    return targetDate
  }

  // パーソナライズされた通知メッセージを生成
  generatePersonalizedMessage(type: string, data?: any): { title: string; body: string } {
    const userName = JSON.parse(localStorage.getItem('userSettings') || '{}').userName || 'あなた'
    const streakDays = parseInt(localStorage.getItem('streakDays') || '0')
    const level = Math.floor(parseInt(localStorage.getItem('totalXP') || '0') / 100)
    
    const templates = {
      daily_reminder: [
        {
          title: `${userName}さん、今日の調子はいかがですか？`,
          body: '5分だけでも自分の時間を作りましょう✨'
        },
        {
          title: 'こんにちは！今日も一緒に頑張りましょう',
          body: `${streakDays}日連続の記録を続けています🔥`
        },
        {
          title: '休憩時間にリフレッシュしませんか？',
          body: '簡単な呼吸法で気分転換しましょう'
        }
      ],
      streak_warning: [
        {
          title: `⚠️ ${streakDays}日の連続記録が途切れそうです`,
          body: '今すぐチェックインして記録を継続しましょう！'
        },
        {
          title: 'もう少しで記録が途切れてしまいます',
          body: `あと3時間以内にチェックインをお願いします`
        }
      ],
      achievement: [
        {
          title: '🎉 新しいバッジを獲得しました！',
          body: `レベル${level}に到達！素晴らしい成長です`
        },
        {
          title: '目標達成まであと少し！',
          body: 'もう一息で次のマイルストーンです'
        }
      ],
      team_activity: [
        {
          title: 'チームメンバーがあなたを応援しています',
          body: '新しいメッセージが届いています💬'
        },
        {
          title: 'チームチャレンジが開始されました',
          body: '仲間と一緒に目標を達成しましょう！'
        }
      ],
      weekly_report: [
        {
          title: `今週の振り返り - ${userName}さんの成長記録`,
          body: `気分スコアが15%改善しました📈`
        },
        {
          title: '週間レポートが準備できました',
          body: '素晴らしい1週間でした！詳細を確認しましょう'
        }
      ]
    }
    
    const messageList = templates[type as keyof typeof templates] || templates.daily_reminder
    const message = messageList[Math.floor(Math.random() * messageList.length)]
    
    return message
  }

  // 通知をスケジュール
  async scheduleNotification(
    type: string,
    scheduledFor?: Date,
    data?: any
  ): Promise<SmartNotification> {
    const message = this.generatePersonalizedMessage(type, data)
    const notification: SmartNotification = {
      id: `${type}_${Date.now()}`,
      type: this.getNotificationType(type),
      title: message.title,
      body: message.body,
      icon: this.getNotificationIcon(type),
      action: this.getNotificationAction(type),
      priority: this.getNotificationPriority(type),
      scheduledFor: scheduledFor || this.predictOptimalNotificationTime(type),
      sent: false
    }
    
    this.notifications.push(notification)
    this.saveNotifications()
    
    // 通知の送信をスケジュール
    this.scheduleNotificationDelivery(notification)
    
    return notification
  }

  private getNotificationType(type: string): SmartNotification['type'] {
    const typeMap: { [key: string]: SmartNotification['type'] } = {
      daily_reminder: 'reminder',
      streak_warning: 'streak',
      achievement: 'achievement',
      team_activity: 'social',
      weekly_report: 'insight'
    }
    return typeMap[type] || 'reminder'
  }

  private getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      daily_reminder: '🌟',
      streak_warning: '🔥',
      achievement: '🏆',
      team_activity: '👥',
      weekly_report: '📊'
    }
    return icons[type] || '💬'
  }

  private getNotificationAction(type: string): SmartNotification['action'] {
    const actions: { [key: string]: SmartNotification['action'] } = {
      daily_reminder: { label: 'チェックイン', url: '/checkin' },
      streak_warning: { label: '今すぐ確認', url: '/dashboard' },
      achievement: { label: '確認する', url: '/achievements' },
      team_activity: { label: '見る', url: '/team-connect' },
      weekly_report: { label: 'レポートを見る', url: '/analytics' }
    }
    return actions[type]
  }

  private getNotificationPriority(type: string): SmartNotification['priority'] {
    const priorities: { [key: string]: SmartNotification['priority'] } = {
      streak_warning: 'high',
      daily_reminder: 'medium',
      achievement: 'medium',
      team_activity: 'low',
      weekly_report: 'low'
    }
    return priorities[type] || 'medium'
  }

  // 通知の配信をスケジュール
  private scheduleNotificationDelivery(notification: SmartNotification) {
    const delay = notification.scheduledFor.getTime() - Date.now()
    
    if (delay > 0) {
      setTimeout(() => {
        this.sendNotification(notification)
      }, Math.min(delay, 2147483647)) // 最大タイムアウト値を超えないように
    }
  }

  // 実際に通知を送信
  private async sendNotification(notification: SmartNotification) {
    // ブラウザ通知APIの権限確認
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const browserNotification = new Notification(notification.title, {
          body: notification.body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: notification.id,
          requireInteraction: notification.priority === 'high',
          data: {
            url: notification.action?.url
          }
        })
        
        browserNotification.onclick = () => {
          window.focus()
          if (notification.action?.url) {
            window.location.href = notification.action.url
          }
          browserNotification.close()
        }
        
        // 送信済みとしてマーク
        notification.sent = true
        this.saveNotifications()
        
        // 応答率を記録
        this.trackNotificationResponse(notification.type)
      } else if (Notification.permission === 'default') {
        // 権限をリクエスト
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          this.sendNotification(notification)
        }
      }
    }
    
    // アプリ内通知としても保存
    this.saveInAppNotification(notification)
  }

  // アプリ内通知として保存
  private saveInAppNotification(notification: SmartNotification) {
    const inAppNotifications = JSON.parse(
      localStorage.getItem('inAppNotifications') || '[]'
    )
    inAppNotifications.unshift({
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    })
    
    // 最新100件のみ保持
    if (inAppNotifications.length > 100) {
      inAppNotifications.splice(100)
    }
    
    localStorage.setItem('inAppNotifications', JSON.stringify(inAppNotifications))
  }

  // 通知への応答を追跡
  private trackNotificationResponse(type: string) {
    const currentRate = this.userPatterns.responseRate.get(type) || 0
    const newRate = currentRate * 0.9 + 0.1 // 指数移動平均で更新
    this.userPatterns.responseRate.set(type, newRate)
    this.saveUserPatterns()
  }

  // 通知を保存
  private saveNotifications() {
    const toSave = this.notifications.slice(-100) // 最新100件のみ保存
    localStorage.setItem('scheduledNotifications', JSON.stringify(toSave))
  }

  // Service Workerの初期化
  private async initializeNotificationWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/notification-worker.js')
        console.log('Notification worker registered:', registration)
      } catch (error) {
        console.error('Failed to register notification worker:', error)
      }
    }
  }

  // 習慣化スコアを計算
  calculateHabitScore(): number {
    const streakDays = parseInt(localStorage.getItem('streakDays') || '0')
    const totalCheckins = parseInt(localStorage.getItem('totalCheckins') || '0')
    const lastCheckin = localStorage.getItem('lastCheckinDate')
    
    let score = 0
    
    // 連続日数による加点（最大30点）
    score += Math.min(streakDays * 2, 30)
    
    // 総チェックイン数による加点（最大30点）
    score += Math.min(totalCheckins / 2, 30)
    
    // 最近のアクティビティによる加点（最大20点）
    if (lastCheckin) {
      const daysSinceLastCheckin = Math.floor(
        (Date.now() - new Date(lastCheckin).getTime()) / (1000 * 60 * 60 * 24)
      )
      score += Math.max(20 - daysSinceLastCheckin * 5, 0)
    }
    
    // 通知への応答率による加点（最大20点）
    let avgResponseRate = 0
    this.userPatterns.responseRate.forEach(rate => {
      avgResponseRate += rate
    })
    if (this.userPatterns.responseRate.size > 0) {
      avgResponseRate /= this.userPatterns.responseRate.size
      score += avgResponseRate * 20
    }
    
    return Math.round(score)
  }

  // 習慣化を促進する自動スケジューリング
  async setupHabitFormationSchedule() {
    const preferences = this.getUserPreferences()
    
    if (preferences.enabled) {
      // 毎日のリマインダー
      if (preferences.types.dailyReminder) {
        await this.scheduleNotification('daily_reminder')
      }
      
      // 連続記録の警告（夜8時に確認）
      if (preferences.types.streakWarning) {
        const warningTime = new Date()
        warningTime.setHours(20, 0, 0, 0)
        if (warningTime <= new Date()) {
          warningTime.setDate(warningTime.getDate() + 1)
        }
        await this.scheduleNotification('streak_warning', warningTime)
      }
      
      // 週次レポート（日曜日の夜）
      if (preferences.types.weeklyReport) {
        const reportTime = new Date()
        const daysUntilSunday = (7 - reportTime.getDay()) % 7
        reportTime.setDate(reportTime.getDate() + daysUntilSunday)
        reportTime.setHours(19, 0, 0, 0)
        await this.scheduleNotification('weekly_report', reportTime)
      }
    }
  }

  // ユーザー設定を取得
  private getUserPreferences(): NotificationPreference {
    const saved = localStorage.getItem('notificationPreferences')
    if (saved) {
      return JSON.parse(saved)
    }
    
    // デフォルト設定
    return {
      enabled: true,
      timeSlots: ['morning', 'evening'],
      frequency: 'smart',
      types: {
        dailyReminder: true,
        streakWarning: true,
        achievement: true,
        teamActivity: true,
        weeklyReport: true
      }
    }
  }

  // 通知設定を更新
  updatePreferences(preferences: NotificationPreference) {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences))
    this.setupHabitFormationSchedule()
  }
}

// シングルトンインスタンスをエクスポート
export const smartNotifications = SmartNotificationManager.getInstance()