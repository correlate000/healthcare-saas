/**
 * LocalStorage utility functions with error handling and cache management
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  expiry?: number
}

const CACHE_VERSION = 'v1'
const STORAGE_PREFIX = 'mindcare_'

export class StorageManager {
  /**
   * Set an item in localStorage with optional expiry
   */
  static setItem<T>(key: string, value: T, expiryMinutes?: number): boolean {
    try {
      const prefixedKey = `${STORAGE_PREFIX}${key}`
      const cacheItem: CacheItem<T> = {
        data: value,
        timestamp: Date.now(),
        expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : undefined
      }
      localStorage.setItem(prefixedKey, JSON.stringify(cacheItem))
      return true
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error)
      // Handle quota exceeded error
      if (error instanceof DOMException && error.code === 22) {
        this.clearExpiredItems()
        try {
          const prefixedKey = `${STORAGE_PREFIX}${key}`
          const cacheItem: CacheItem<T> = {
            data: value,
            timestamp: Date.now(),
            expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : undefined
          }
          localStorage.setItem(prefixedKey, JSON.stringify(cacheItem))
          return true
        } catch {
          return false
        }
      }
      return false
    }
  }

  /**
   * Get an item from localStorage, checking expiry
   */
  static getItem<T>(key: string): T | null {
    try {
      const prefixedKey = `${STORAGE_PREFIX}${key}`
      const item = localStorage.getItem(prefixedKey)
      if (!item) return null

      const cacheItem: CacheItem<T> = JSON.parse(item)
      
      // Check if item has expired
      if (cacheItem.expiry && Date.now() > cacheItem.expiry) {
        localStorage.removeItem(prefixedKey)
        return null
      }

      return cacheItem.data
    } catch (error) {
      console.error(`Failed to get ${key} from localStorage:`, error)
      return null
    }
  }

  /**
   * Remove an item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      const prefixedKey = `${STORAGE_PREFIX}${key}`
      localStorage.removeItem(prefixedKey)
      return true
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error)
      return false
    }
  }

  /**
   * Clear all expired items from localStorage
   */
  static clearExpiredItems(): void {
    try {
      const keys = Object.keys(localStorage)
      const now = Date.now()
      
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          try {
            const item = localStorage.getItem(key)
            if (item) {
              const cacheItem: CacheItem<any> = JSON.parse(item)
              if (cacheItem.expiry && now > cacheItem.expiry) {
                localStorage.removeItem(key)
              }
            }
          } catch {
            // Remove corrupted items
            localStorage.removeItem(key)
          }
        }
      })
    } catch (error) {
      console.error('Failed to clear expired items:', error)
    }
  }

  /**
   * Clear all MindCare items from localStorage
   */
  static clearAll(): boolean {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Failed to clear all items:', error)
      return false
    }
  }

  /**
   * Get storage size used by MindCare
   */
  static getStorageSize(): number {
    try {
      let size = 0
      const keys = Object.keys(localStorage)
      
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          const item = localStorage.getItem(key)
          if (item) {
            size += key.length + item.length
          }
        }
      })
      
      return size
    } catch (error) {
      console.error('Failed to calculate storage size:', error)
      return 0
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const testKey = `${STORAGE_PREFIX}test`
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }
}

// Convenience functions for specific data types
export const UserDataStorage = {
  setCheckinData(data: any): boolean {
    const existingData = StorageManager.getItem<any[]>('checkins') || []
    existingData.push(data)
    // Keep only last 30 days of data
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    const filteredData = existingData.filter(item => 
      item.timestamp && item.timestamp > thirtyDaysAgo
    )
    return StorageManager.setItem('checkins', filteredData)
  },

  getCheckinData(): any[] {
    return StorageManager.getItem<any[]>('checkins') || []
  },

  setStreak(days: number): boolean {
    return StorageManager.setItem('streak', days)
  },

  getStreak(): number {
    return StorageManager.getItem<number>('streak') || 0
  },

  setXP(xp: number): boolean {
    return StorageManager.setItem('xp', xp)
  },

  getXP(): number {
    return StorageManager.getItem<number>('xp') || 0
  },

  setFriendLevel(level: number): boolean {
    return StorageManager.setItem('friend_level', level)
  },

  getFriendLevel(): number {
    return StorageManager.getItem<number>('friend_level') || 1
  },

  setLastCheckin(date: string): boolean {
    return StorageManager.setItem('last_checkin', date)
  },

  getLastCheckin(): string | null {
    return StorageManager.getItem<string>('last_checkin')
  },

  setTodayProgress(progress: number): boolean {
    const data = {
      value: progress,
      date: new Date().toDateString()
    }
    return StorageManager.setItem('today_progress', data, 24 * 60) // Expires in 24 hours
  },

  getTodayProgress(): { value: number; date: string } | null {
    return StorageManager.getItem<{ value: number; date: string }>('today_progress')
  }
}

// Run cleanup on initialization
if (typeof window !== 'undefined') {
  StorageManager.clearExpiredItems()
}