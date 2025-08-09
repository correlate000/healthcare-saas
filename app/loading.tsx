'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Heart, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)

  const loadingMessages = [
    { text: "読み込み中...", icon: "📊" },
    { text: "AIを準備中...", icon: "🤖" },
    { text: "安全な接続を確立中...", icon: "🔒" },
    { text: "パーソナライズ中...", icon: "✨" },
    { text: "もうすぐ完了...", icon: "🎉" }
  ]

  useEffect(() => {
    // プログレスバーのアニメーション
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95
        return prev + Math.random() * 10
      })
    }, 200)

    // メッセージローテーション
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length)
    }, 1500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [])

  const currentMessage = loadingMessages[messageIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Loading Card */}
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              
              {/* Logo with Animation */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-lg mx-auto animate-pulse">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              
              {/* Brand */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  MindCare
                </h1>
                <p className="text-muted-foreground text-sm">
                  あなたの心の健康パートナー
                </p>
              </div>

              {/* Loading Message */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl animate-bounce" key={messageIndex}>
                    {currentMessage.icon}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {currentMessage.text}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={progress} className="h-2 bg-muted" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>読み込み中...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>

              {/* Animated Dots */}
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

        {/* Loading Stats */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                高速・安全・プライベート
              </p>
              <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                <span>• SSL暗号化</span>
                <span>• 99.9%稼働率</span>
                <span>• GDPR準拠</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tip */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 ヒント: 毎日の気分チェックで健康状態を記録できます
          </p>
        </div>

      </div>
    </div>
  )
}