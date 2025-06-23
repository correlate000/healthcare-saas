'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Trash2, RefreshCw, CheckCircle, Home } from 'lucide-react'

export default function ClearCache() {
  const router = useRouter()
  const [isClearing, setIsClearing] = useState(false)
  const [clearResults, setClearResults] = useState<string[]>([])

  const clearAllCache = async () => {
    setIsClearing(true)
    setClearResults([])
    
    const results: string[] = []

    try {
      // Clear service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        results.push(`🔍 Found ${registrations.length} service workers`)
        
        for (const registration of registrations) {
          const success = await registration.unregister()
          results.push(`${success ? '✅' : '❌'} Unregistered SW: ${registration.scope}`)
        }
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        results.push(`🔍 Found ${cacheNames.length} caches`)
        
        for (const cacheName of cacheNames) {
          const success = await caches.delete(cacheName)
          results.push(`${success ? '✅' : '❌'} Deleted cache: ${cacheName}`)
        }
      }

      // Clear local storage
      localStorage.clear()
      results.push('✅ Cleared localStorage')

      // Clear session storage
      sessionStorage.clear()
      results.push('✅ Cleared sessionStorage')

      results.push('🎉 All cache clearing complete!')
      
    } catch (error) {
      results.push(`❌ Error: ${error}`)
    }

    setClearResults(results)
    setIsClearing(false)
  }

  const forceReload = () => {
    window.location.href = window.location.origin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Header Card */}
        <Card className="border-2 border-red-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Trash2 className="h-6 w-6 text-red-500" />
              <span>キャッシュクリア</span>
            </CardTitle>
            <Badge variant="destructive" className="mx-auto">
              <AlertTriangle className="h-3 w-3 mr-1" />
              開発者ツール
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                オフライン問題を解決するために、すべてのキャッシュとサービスワーカーを削除します。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={clearAllCache}
                  disabled={isClearing}
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  variant="destructive"
                >
                  {isClearing ? (
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  ) : (
                    <Trash2 className="h-6 w-6" />
                  )}
                  <span className="text-sm">
                    {isClearing ? 'クリア中...' : 'すべてクリア'}
                  </span>
                </Button>

                <Button
                  onClick={forceReload}
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  variant="outline"
                >
                  <RefreshCw className="h-6 w-6" />
                  <span className="text-sm">強制リロード</span>
                </Button>

                <Button
                  onClick={() => router.push('/')}
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  variant="outline"
                >
                  <Home className="h-6 w-6" />
                  <span className="text-sm">ホーム</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {clearResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>実行結果</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {clearResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                    {result}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">🛠️ 手動クリア手順</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Chrome/Edge:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1">
                  <li>F12 → Application タブ</li>
                  <li>Storage → Clear storage</li>
                  <li>Clear site data をクリック</li>
                </ol>
              </div>
              
              <div>
                <strong>Firefox:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1">
                  <li>F12 → Storage タブ</li>
                  <li>すべての項目を削除</li>
                </ol>
              </div>
              
              <div>
                <strong>Safari:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1">
                  <li>開発 → Webインスペクタ</li>
                  <li>ストレージ → すべてクリア</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Info */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-medium text-green-800">✅ クリア後のアクセス</h3>
              <p className="text-sm text-green-700">
                キャッシュクリア後は以下のURLに直接アクセス：
              </p>
              <div className="bg-white p-2 rounded border font-mono text-sm">
                http://localhost:3002
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}