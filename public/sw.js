// Service Worker for Healthcare SaaS
const CACHE_NAME = 'healthcare-saas-v1.0.0'
const urlsToCache = [
  '/',
  '/dashboard',
  '/checkin', 
  '/chat',
  '/analytics',
  '/booking',
  '/settings',
  '/manifest.json'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell')
        return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'})))
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error)
      })
      .then(() => {
        console.log('Service Worker: Skip waiting')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating')
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
    }).then(() => {
      console.log('Service Worker: Claiming clients')
      return self.clients.claim()
    })
  )
})

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone and cache successful responses for navigation and static assets
        if (event.request.destination === 'document' || 
            event.request.destination === 'script' ||
            event.request.destination === 'style' ||
            event.request.destination === 'image') {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
            .catch((error) => {
              console.log('Service Worker: Cache put failed', error)
            })
        }
        
        return response
      })
      .catch(() => {
        console.log('Service Worker: Network failed, trying cache')
        // Only use cache as fallback for specific requests
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              console.log('Service Worker: Serving from cache', event.request.url)
              return response
            }
            // For navigation requests, return a basic fallback
            if (event.request.destination === 'document') {
              return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                  <title>オフライン - Healthcare SaaS</title>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 50px; background: #1f2937; color: white; }
                    .container { max-width: 400px; margin: 0 auto; }
                    h1 { color: #10b981; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>オフライン</h1>
                    <p>インターネット接続を確認してください</p>
                    <button onclick="location.reload()">再試行</button>
                  </div>
                </body>
                </html>
              `, {
                headers: { 'Content-Type': 'text/html' }
              })
            }
            // For other requests, just reject
            return new Response('Network error', { status: 503 })
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