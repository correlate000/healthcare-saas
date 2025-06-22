const CACHE_NAME = 'mindcare-v1.0.0'
const urlsToCache = [
  '/',
  '/dashboard',
  '/checkin',
  '/chat',
  '/analytics',
  '/booking',
  '/settings',
  '/offline',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch event - network first, cache as fallback (disabled for debugging)
self.addEventListener('fetch', (event) => {
  // Skip service worker for development - always fetch from network
  if (process.env.NODE_ENV === 'development') {
    return
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
        }
        return response
      })
      .catch(() => {
        // Only use cache as fallback, and only for specific requests
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response
            }
            // Return offline page only for navigation requests as last resort
            if (event.request.destination === 'document') {
              return caches.match('/offline')
            }
          })
      })
  )
})

// Background sync for check-ins
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-checkin') {
    event.waitUntil(doBackgroundSync())
  }
})

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'チェックインの時間です',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'checkin',
        title: 'チェックイン',
        icon: '/icon-checkin.png'
      },
      {
        action: 'close',
        title: '閉じる'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('MindCare', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'checkin') {
    event.waitUntil(
      clients.openWindow('/checkin')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync function
async function doBackgroundSync() {
  try {
    // Get pending check-ins from IndexedDB
    const pendingCheckins = await getPendingCheckins()
    
    for (const checkin of pendingCheckins) {
      try {
        await fetch('/api/checkin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkin)
        })
        
        // Remove from pending after successful sync
        await removePendingCheckin(checkin.id)
      } catch (error) {
        console.error('Failed to sync checkin:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// IndexedDB helpers (simplified)
async function getPendingCheckins() {
  // In a real implementation, this would use IndexedDB
  return []
}

async function removePendingCheckin(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing pending checkin:', id)
}