// プッシュ通知システム

import { notificationEscalation } from '@/types/character-emotion'

export class NotificationManager {
  private static permission: NotificationPermission = 'default'
  private static isSupported: boolean = typeof window !== 'undefined' && 'Notification' in window
  
  // 通知権限をリクエスト
  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported) return false
    
    try {
      this.permission = await Notification.requestPermission()
      return this.permission === 'granted'
    } catch (error) {
      console.error('通知権限のリクエストに失敗:', error)
      return false
    }
  }
  
  // 通知権限の状態を取得
  static getPermissionStatus(): NotificationPermission {
    if (!this.isSupported) return 'denied'
    return Notification.permission
  }
  
  // 基本的な通知を送信
  static async sendNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<Notification | null> {
    if (!this.isSupported) return null
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission()
      if (!granted) return null
    }
    
    try {
      const notificationOptions: NotificationOptions = {
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        ...options
      }
      
      // vibrate は NotificationOptions には含まれないが、
      // 一部のブラウザでは利用可能なので別途処理
      if ('vibrate' in navigator && Array.isArray((options as any)?.vibrate)) {
        navigator.vibrate((options as any).vibrate)
      }
      
      const notification = new Notification(title, notificationOptions)
      
      return notification
    } catch (error) {
      console.error('通知の送信に失敗:', error)
      return null
    }
  }
  
  // キャラクター感情に基づく通知
  static async sendCharacterNotification(
    characterName: string,
    mood: string,
    message: string,
    urgency: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<void> {
    const icons = {
      luna: '🌙',
      aria: '✨',
      zen: '🧘'
    }
    
    const vibrationPatterns = {
      low: [100],
      medium: [100, 50, 100],
      high: [200, 100, 200],
      critical: [300, 100, 200, 100, 300]
    }
    
    // バイブレーションを先に実行
    if ('vibrate' in navigator) {
      navigator.vibrate(vibrationPatterns[urgency])
    }
    
    const notification = await this.sendNotification(
      `${icons[characterName as keyof typeof icons]} ${characterName}からのメッセージ`,
      {
        body: message,
        tag: `character-${characterName}`,
        data: { characterName, mood, urgency }
      } as NotificationOptions
    )
    
    if (notification) {
      notification.onclick = () => {
        window.focus()
        window.location.href = '/checkin'
        notification.close()
      }
    }
  }
  
  // ストリーク警告通知
  static async sendStreakWarning(
    hoursRemaining: number,
    streakDays: number
  ): Promise<void> {
    let title = '🔥 ストリークが危険！'
    let body = ''
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low'
    
    if (hoursRemaining <= 1) {
      title = '🚨 緊急！ストリークが消えます！'
      body = `あと${Math.floor(hoursRemaining * 60)}分で${streakDays}日のストリークが途切れます！`
      urgency = 'critical'
    } else if (hoursRemaining <= 3) {
      title = '⚠️ ストリークが危険です！'
      body = `あと${Math.floor(hoursRemaining)}時間で${streakDays}日のストリークが途切れます。`
      urgency = 'high'
    } else if (hoursRemaining <= 6) {
      title = '📢 ストリーク継続のお知らせ'
      body = `今日のチェックインまであと${Math.floor(hoursRemaining)}時間です。`
      urgency = 'medium'
    }
    
    // バイブレーションを先に実行
    if ('vibrate' in navigator) {
      navigator.vibrate(urgency === 'critical' ? [500, 200, 500] : [200, 100, 200])
    }
    
    const notification = await this.sendNotification(title, {
      body,
      tag: 'streak-warning',
      data: { hoursRemaining, streakDays }
    } as NotificationOptions)
    
    if (notification) {
      notification.onclick = () => {
        window.focus()
        window.location.href = '/checkin'
        notification.close()
      }
    }
  }
  
  // デイリーチャレンジ通知
  static async sendDailyChallengeReminder(
    completedCount: number,
    totalCount: number
  ): Promise<void> {
    const remaining = totalCount - completedCount
    
    if (remaining === 0) return
    
    // バイブレーションを先に実行
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100])
    }
    
    const notification = await this.sendNotification(
      '📋 今日のチャレンジ',
      {
        body: `まだ${remaining}個のチャレンジが残っています。XPを獲得しましょう！`,
        tag: 'daily-challenge',
        data: { completedCount, totalCount }
      }
    )
    
    if (notification) {
      notification.onclick = () => {
        window.focus()
        window.location.href = '/dashboard'
        notification.close()
      }
    }
  }
  
  // レベルアップ通知
  static async sendLevelUpNotification(
    newLevel: number,
    unlockedFeatures?: string[]
  ): Promise<void> {
    let body = `レベル${newLevel}に到達しました！`
    
    if (unlockedFeatures && unlockedFeatures.length > 0) {
      body += ` 新機能がアンロック: ${unlockedFeatures.join(', ')}`
    }
    
    // バイブレーションを先に実行
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 100, 100, 100, 200])
    }
    
    const notification = await this.sendNotification(
      '🎉 レベルアップ！',
      {
        body,
        tag: 'level-up',
        data: { newLevel, unlockedFeatures }
      } as NotificationOptions
    )
    
    if (notification) {
      notification.onclick = () => {
        window.focus()
        window.location.href = '/achievements'
        notification.close()
      }
    }
  }
  
  // 時間帯別のパーソナライズ通知をスケジュール
  static schedulePersonalizedNotifications(
    lastCheckinDate: Date | null,
    streakDays: number
  ): void {
    if (!this.isSupported) return
    if (this.permission !== 'granted') return
    
    const now = new Date()
    const hour = now.getHours()
    
    // 朝の通知（7:00-9:00）
    if (hour >= 7 && hour < 9) {
      if (!lastCheckinDate || now.getTime() - lastCheckinDate.getTime() > 24 * 60 * 60 * 1000) {
        this.sendCharacterNotification(
          'るな',
          'normal',
          'おはよう！今日も一緒に頑張ろうね。朝のチェックインを忘れずに！',
          'low'
        )
      }
    }
    
    // 昼の通知（12:00-13:00）
    else if (hour >= 12 && hour < 13) {
      if (!lastCheckinDate || now.getDate() !== lastCheckinDate.getDate()) {
        this.sendDailyChallengeReminder(0, 5)
      }
    }
    
    // 夕方の通知（18:00-19:00）
    else if (hour >= 18 && hour < 19) {
      if (!lastCheckinDate || now.getDate() !== lastCheckinDate.getDate()) {
        const hoursLeft = 24 - (now.getHours() - (lastCheckinDate?.getHours() || 0))
        if (hoursLeft <= 6 && streakDays > 0) {
          this.sendStreakWarning(hoursLeft, streakDays)
        }
      }
    }
    
    // 夜の通知（21:00-22:00）
    else if (hour >= 21 && hour < 22) {
      if (!lastCheckinDate || now.getDate() !== lastCheckinDate.getDate()) {
        this.sendCharacterNotification(
          'ぜん',
          'worried',
          '今日はまだチェックインしていませんね。寝る前に今日を振り返りましょう。',
          'medium'
        )
      }
    }
  }
  
  // Service Workerを登録（PWA対応）
  static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker登録成功:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker登録失敗:', error)
      return null
    }
  }
  
  // バックグラウンド同期をスケジュール
  static async scheduleBackgroundSync(tag: string): Promise<void> {
    if (!('serviceWorker' in navigator) || !('SyncManager' in window)) return
    
    try {
      const registration = await navigator.serviceWorker.ready
      await (registration as any).sync.register(tag)
      console.log('バックグラウンド同期をスケジュール:', tag)
    } catch (error) {
      console.error('バックグラウンド同期のスケジュール失敗:', error)
    }
  }
}

// 通知スケジューラー（定期実行用）
export class NotificationScheduler {
  private static intervalId: number | null = null
  
  static start(
    lastCheckinDate: Date | null,
    streakDays: number,
    intervalMinutes: number = 60
  ): void {
    this.stop() // 既存のスケジューラーを停止
    
    // 初回実行
    NotificationManager.schedulePersonalizedNotifications(lastCheckinDate, streakDays)
    
    // 定期実行
    this.intervalId = window.setInterval(() => {
      NotificationManager.schedulePersonalizedNotifications(lastCheckinDate, streakDays)
    }, intervalMinutes * 60 * 1000)
  }
  
  static stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
  
  static isRunning(): boolean {
    return this.intervalId !== null
  }
}