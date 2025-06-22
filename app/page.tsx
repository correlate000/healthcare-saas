'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            // Check authentication state
            const checkAuthAndRedirect = () => {
              try {
                const storedAuth = localStorage.getItem('mindcare-auth')
                if (storedAuth) {
                  const authData = JSON.parse(storedAuth)
                  if (authData.isAuthenticated && authData.user) {
                    // User is authenticated, check if they've checked in today
                    const today = new Date().toDateString()
                    const lastCheckin = localStorage.getItem('mindcare-last-checkin')
                    
                    if (lastCheckin === today) {
                      // Already checked in today, go to dashboard
                      router.push('/dashboard')
                    } else {
                      // Haven't checked in today, go to checkin
                      router.push('/checkin')
                    }
                    return
                  }
                }
              } catch (error) {
                console.error('Error checking auth state:', error)
              }
              
              // Not authenticated, go to auth page
              router.push('/auth')
            }

            checkAuthAndRedirect()
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="text-white font-bold text-xl">M</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MindCare</h1>
          <p className="text-gray-600">あなたの心の健康パートナー</p>
        </div>

        {/* Loading Animation */}
        <div className="space-y-4">
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-500">
            {progress < 30 && "AIキャラクターを準備中..."}
            {progress >= 30 && progress < 60 && "今日のメッセージを用意中..."}
            {progress >= 60 && progress < 90 && "パーソナライズ設定を読み込み中..."}
            {progress >= 90 && "準備完了！"}
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}