'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WifiOff, Home, RefreshCw, Smartphone } from 'lucide-react'

export default function Offline() {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Main Offline Card */}
        <Card className="border-2 border-orange-200 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              
              {/* Offline Icon */}
              <div className="relative">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center shadow-lg mx-auto">
                  <WifiOff className="h-10 w-10 text-orange-600" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Badge variant="secondary" className="bg-orange-400 text-orange-900">
                    <Smartphone className="h-3 w-3 mr-1" />
                    オフライン
                  </Badge>
                </div>
              </div>
              
              {/* Error Message */}
              <div className="space-y-3">
                <h1 className="text-2xl font-bold text-gray-800">
                  オフライン状態です
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  現在、インターネット接続がありません。<br/>
                  これは開発環境のサービスワーカーが原因の可能性があります。
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleGoHome}
                  className="w-full"
                  size="lg"
                >
                  <Home className="h-4 w-4 mr-2" />
                  ホームページに戻る
                </Button>
                
                <Button 
                  onClick={handleReload}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  ページを再読み込み
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Development Info */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4 pb-4">
            <div className="text-center space-y-3">
              <h3 className="text-sm font-medium text-yellow-800">
                🛠️ 開発者向け情報
              </h3>
              <div className="space-y-2 text-xs text-yellow-700">
                <div>• サービスワーカーは開発環境で無効化されています</div>
                <div>• ブラウザのキャッシュをクリアしてみてください</div>
                <div>• Developer Tools → Application → Storage → Clear storage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline Features */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <div className="space-y-3">
              <h3 className="font-medium text-blue-900 text-center">📱 オフライン機能</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• チェックインデータは一時保存されます</li>
                <li>• 過去の記録は閲覧可能です</li>
                <li>• 接続復旧時に自動同期されます</li>
              </ul>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}