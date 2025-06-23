'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Home, AlertTriangle, Bug, MessageSquare } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter()

  useEffect(() => {
    // エラーログを記録
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Error Card */}
        <Card className="border-2 border-red-200 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              
              {/* Error Icon */}
              <div className="relative">
                <div className="text-8xl">🤖</div>
                <div className="absolute -bottom-2 -right-2 text-4xl">💔</div>
              </div>
              
              {/* Error Message */}
              <div className="space-y-3">
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  システムエラー
                </Badge>
                
                <h1 className="text-2xl font-bold text-gray-800">
                  申し訳ございません
                </h1>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  予期しないエラーが発生しました。
                  問題が継続する場合は、サポートチームにお知らせください。
                </p>

                {/* Error Details (development only) */}
                {process.env.NODE_ENV === 'development' && (
                  <details className="text-left mt-4">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                      技術的詳細を表示
                    </summary>
                    <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
                      <div className="font-bold mb-1">Error Message:</div>
                      <div className="mb-2">{error.message}</div>
                      {error.digest && (
                        <>
                          <div className="font-bold mb-1">Error ID:</div>
                          <div>{error.digest}</div>
                        </>
                      )}
                    </div>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={reset}
                  className="w-full"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  再試行
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    size="sm"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    ホーム
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/help')}
                    variant="outline"
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    サポート
                  </Button>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Recovery Options */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center justify-center">
                <Bug className="h-4 w-4 mr-1" />
                問題を解決するために
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>• ページを再読み込みしてみてください</div>
                <div>• ブラウザのキャッシュをクリアしてください</div>
                <div>• しばらく時間をおいて再度お試しください</div>
                <div>• 問題が続く場合はサポートにご連絡ください</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            緊急のサポートが必要な場合は
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/emergency-support')}
            className="text-xs"
          >
            <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
            緊急サポート
          </Button>
        </div>

      </div>
    </div>
  )
}