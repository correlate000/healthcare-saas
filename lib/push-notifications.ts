// Push Notification Service for PWA

export class PushNotificationService {
  private static instance: PushNotificationService
  private registration: ServiceWorkerRegistration | null = null

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService()
    }
    return PushNotificationService.instance
  }

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications are not supported')
      return false
    }

    try {
      // Register service worker if not already registered
      this.registration = await navigator.serviceWorker.ready
      console.log('Service Worker is ready for push notifications')
      return true
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    console.log('Notification permission:', permission)
    return permission
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      console.error('Service Worker registration not found')
      return null
    }

    try {
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        console.log('Notification permission not granted')
        return null
      }

      // Check if already subscribed
      let subscription = await this.registration.pushManager.getSubscription()
      
      if (!subscription) {
        // Create new subscription
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
          console.error('VAPID public key not found')
          return null
        }

        const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey)
        
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        })
      }

      // Save subscription to backend
      await this.saveSubscription(subscription)
      
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        await this.removeSubscription(subscription)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      return null
    }

    return await this.registration.pushManager.getSubscription()
  }

  private async saveSubscription(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription.toJSON())
      })

      if (!response.ok) {
        throw new Error('Failed to save subscription')
      }
    } catch (error) {
      console.error('Error saving subscription:', error)
    }
  }

  private async removeSubscription(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      })

      if (!response.ok) {
        throw new Error('Failed to remove subscription')
      }
    } catch (error) {
      console.error('Error removing subscription:', error)
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    
    return outputArray
  }

  // Send local notification (for testing or immediate notifications)
  async sendLocalNotification(title: string, options?: NotificationOptions): Promise<void> {
    const permission = await this.requestPermission()
    
    if (permission === 'granted') {
      if (this.registration) {
        await this.registration.showNotification(title, {
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          vibrate: [200, 100, 200],
          ...options
        })
      } else {
        new Notification(title, options)
      }
    }
  }
}

// Notification templates
export const notificationTemplates = {
  checkInReminder: {
    title: '今日のチェックインの時間です！',
    body: '今日の気分を記録しましょう',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'checkin-reminder',
    data: { url: '/checkin' }
  },
  streakWarning: {
    title: '継続記録が途切れそうです！',
    body: 'チェックインして記録を続けましょう',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'streak-warning',
    data: { url: '/checkin' }
  },
  challengeAvailable: {
    title: '新しいチャレンジが利用可能です！',
    body: '今日のチャレンジに挑戦してXPを獲得しましょう',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'challenge-available',
    data: { url: '/daily-challenge' }
  },
  achievementUnlocked: {
    title: '実績を解除しました！',
    body: 'おめでとうございます！新しい実績を獲得しました',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'achievement-unlocked',
    data: { url: '/achievements' }
  }
}

export default PushNotificationService.getInstance()