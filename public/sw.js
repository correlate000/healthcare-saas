// Enhanced Service Worker for Healthcare SaaS PWA
const CACHE_VERSION = 'v2.0.1'
const CACHE_NAME = `healthcare-saas-${CACHE_VERSION}`
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`

// Static resources to cache
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/checkin', 
  '/chat',
  '/voice-chat',
  '/analytics',
  '/achievements',
  '/daily-challenge',
  '/settings',
  '/offline',
  '/manifest.json',
  '/icon.svg'
]

// Cache strategies
const CACHE_STRATEGIES = {
  networkFirst: [
    '/api/',
    '/auth/'
  ],
  cacheFirst: [
    '/static/',
    '/_next/static/',
    '/images/',
    '/fonts/'
  ],
  staleWhileRevalidate: [
    '/',
    '/dashboard',
    '/checkin',
    '/chat'
  ]
}

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log(`Service Worker ${CACHE_VERSION}: Installing`)
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Pre-caching app shell')
        // Cache static resources with error handling
        return Promise.allSettled(
          STATIC_CACHE_URLS.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err)
            })
          )
        )
      })
      .then(() => {
        console.log('Service Worker: Skip waiting')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log(`Service Worker ${CACHE_VERSION}: Activating`)
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
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

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-HTTP(S) requests
  if (!url.protocol.startsWith('http')) {
    return
  }
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin && !url.href.includes('supabase')) {
    return
  }
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Determine cache strategy
  const strategy = getCacheStrategy(url.pathname)
  
  switch (strategy) {
    case 'networkFirst':
      event.respondWith(networkFirst(request))
      break
    case 'cacheFirst':
      event.respondWith(cacheFirst(request))
      break
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request))
      break
    default:
      event.respondWith(networkFirst(request))
  }
})

// Cache strategies implementation
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Clone the response before using it
      const responseToCache = networkResponse.clone()
      const cache = await caches.open(RUNTIME_CACHE)
      await cache.put(request, responseToCache)
    }
    
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline')
    }
    
    throw error
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Clone the response before using it
      const responseToCache = networkResponse.clone()
      const cache = await caches.open(RUNTIME_CACHE)
      await cache.put(request, responseToCache)
    }
    
    return networkResponse
  } catch (error) {
    // Return a fallback response for images
    if (request.destination === 'image') {
      return new Response('', { status: 404 })
    }
    throw error
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request)
  
  const fetchPromise = fetch(request).then(async networkResponse => {
    if (networkResponse.ok) {
      // Clone the response before using it
      const responseToCache = networkResponse.clone()
      const cache = await caches.open(RUNTIME_CACHE)
      await cache.put(request, responseToCache)
    }
    return networkResponse
  }).catch(error => {
    console.error('Fetch failed:', error)
    // Return cached response if network fails
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  })
  
  return cachedResponse || fetchPromise
}

function getCacheStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.includes(pattern))) {
      return strategy
    }
  }
  return 'networkFirst'
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received')
  
  let notificationData = {
    title: 'MindCare',
    body: 'メッセージがあります',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'mindcare-notification',
    data: { url: '/' }
  }
  
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = { ...notificationData, ...data }
    } catch (e) {
      notificationData.body = event.data.text()
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      vibrate: [200, 100, 200],
      data: notificationData.data,
      actions: [
        {
          action: 'open',
          title: '開く',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: '閉じる'
        }
      ]
    })
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action)
  event.notification.close()
  
  if (event.action === 'close') {
    return
  }
  
  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Check if app is already open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen)
            return client.focus()
          }
        }
        // Open new window if not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-checkins') {
    event.waitUntil(syncCheckins())
  } else if (event.tag === 'sync-conversations') {
    event.waitUntil(syncConversations())
  }
})

// Sync functions
async function syncCheckins() {
  try {
    // Get offline checkins from IndexedDB
    const db = await openDB()
    const tx = db.transaction('pending_checkins', 'readonly')
    const store = tx.objectStore('pending_checkins')
    const checkins = await store.getAll()
    
    for (const checkin of checkins) {
      try {
        const response = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checkin)
        })
        
        if (response.ok) {
          // Remove from pending after successful sync
          const deleteTx = db.transaction('pending_checkins', 'readwrite')
          await deleteTx.objectStore('pending_checkins').delete(checkin.id)
        }
      } catch (error) {
        console.error('Failed to sync checkin:', error)
      }
    }
  } catch (error) {
    console.error('Sync checkins failed:', error)
  }
}

async function syncConversations() {
  try {
    // Similar to syncCheckins but for conversations
    console.log('Syncing conversations...')
  } catch (error) {
    console.error('Sync conversations failed:', error)
  }
}

// IndexedDB helper
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mindcare_offline', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('pending_checkins')) {
        db.createObjectStore('pending_checkins', { keyPath: 'id' })
      }
      
      if (!db.objectStoreNames.contains('pending_conversations')) {
        db.createObjectStore('pending_conversations', { keyPath: 'id' })
      }
    }
  })
}

// Message handling for client communication
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  } else if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => 
        Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
      )
    )
  }
})

console.log(`Service Worker ${CACHE_VERSION} loaded`)