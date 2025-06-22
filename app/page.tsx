'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { Heart, Sparkles, Shield, Users } from 'lucide-react'

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

  const loadingMessages = [
    { threshold: 0, message: "AIキャラクターを準備中...", icon: "🤖" },
    { threshold: 30, message: "今日のメッセージを用意中...", icon: "💬" },
    { threshold: 60, message: "パーソナライズ設定を読み込み中...", icon: "⚙️" },
    { threshold: 90, message: "準備完了！", icon: "✨" }
  ]

  const currentMessage = loadingMessages
    .reverse()
    .find(m => progress >= m.threshold) || loadingMessages[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Hero Card */}
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardContent className="pt-6">
            {/* Logo/Brand */}
            <div className="text-center space-y-4 mb-8">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-lg mx-auto">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Badge variant="secondary" className="px-2 py-1 text-xs font-bold bg-yellow-400 text-yellow-900">
                    AI
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  MindCare
                </h1>
                <p className="text-muted-foreground">あなたの心の健康パートナー</p>
              </div>
              
              {/* Feature highlights */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI対話
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  プライバシー保護
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  専門家サポート
                </Badge>
              </div>
            </div>

            {/* Loading Section */}
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="text-2xl">{currentMessage.icon}</div>
                <p className="text-sm text-muted-foreground font-medium">
                  {currentMessage.message}
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-3 bg-muted" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>読み込み中...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
              
              {/* Animated dots */}
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                24時間365日、あなたのペースで
              </p>
              <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                <span>• 無料で始める</span>
                <span>• データ暗号化</span>
                <span>• 匿名利用可能</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            緊急の場合は
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/emergency-support')}
            className="text-xs"
          >
            <Heart className="h-3 w-3 mr-1 text-red-500" />
            緊急サポート
          </Button>
        </div>

      </div>
    </div>
  )
}