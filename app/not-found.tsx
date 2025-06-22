'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Home, ArrowLeft, Search, Map } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Error Card */}
        <Card className="border-2 border-red-200 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              
              {/* Error Icon */}
              <div className="relative">
                <div className="text-8xl">🤖</div>
                <div className="absolute -bottom-2 -right-2 text-4xl">❓</div>
              </div>
              
              {/* Error Message */}
              <div className="space-y-3">
                <h1 className="text-2xl font-bold text-gray-800">
                  ページが見つかりません
                </h1>
                <div className="text-4xl font-bold text-red-500">404</div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  お探しのページは存在しないか、移動された可能性があります。
                  URLを確認するか、以下のオプションをお試しください。
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                  size="lg"
                >
                  <Home className="h-4 w-4 mr-2" />
                  ホームに戻る
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => router.back()}
                    variant="outline"
                    size="sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    戻る
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/sitemap')}
                    variant="outline"
                    size="sm"
                  >
                    <Map className="h-4 w-4 mr-1" />
                    サイトマップ
                  </Button>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-4">
            <div className="text-center space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                よく使われるページ
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/checkin')}
                  className="text-xs"
                >
                  気分チェック
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/chat')}
                  className="text-xs"
                >
                  AIチャット
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/analytics')}
                  className="text-xs"
                >
                  分析
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/help')}
                  className="text-xs"
                >
                  ヘルプ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            問題が解決しない場合は
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/help')}
            className="text-xs"
          >
            <Search className="h-3 w-3 mr-1" />
            サポートに問い合わせ
          </Button>
        </div>

      </div>
    </div>
  )
}