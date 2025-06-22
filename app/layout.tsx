import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/src/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindCare - ヘルスケアSaaS',
  description: 'AIキャラクターとの温かい対話で毎日の心の健康をサポート',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MindCare',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MindCare" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force disable service worker in development
              const isDevelopment = location.hostname === 'localhost' || 
                                  location.hostname === '127.0.0.1' || 
                                  location.port === '3002';
              
              if (isDevelopment) {
                console.log('🚫 Service Worker: Disabled in development');
                
                // Clear all existing service workers and caches
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    console.log('🧹 Clearing', registrations.length, 'service workers');
                    for(let registration of registrations) {
                      registration.unregister().then(success => {
                        console.log('✅ Unregistered SW:', success);
                      });
                    }
                  });
                  
                  // Clear all caches
                  if ('caches' in window) {
                    caches.keys().then(function(cacheNames) {
                      console.log('🗑️ Clearing', cacheNames.length, 'caches');
                      return Promise.all(
                        cacheNames.map(function(cacheName) {
                          return caches.delete(cacheName).then(success => {
                            console.log('✅ Deleted cache:', cacheName, success);
                          });
                        })
                      );
                    });
                  }
                }
              } else {
                // Only register service worker in production
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('✅ SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('❌ SW registration failed: ', registrationError);
                      });
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  )
}