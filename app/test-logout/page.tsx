'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/layout/AppLayout'
import { LogOut, RotateCcw, Trash2 } from 'lucide-react'

export default function TestLogoutPage() {
  const router = useRouter()
  const [status, setStatus] = useState({
    auth: false,
    checkin: false,
    setup: false
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setStatus({
        auth: !!localStorage.getItem('mindcare-auth'),
        checkin: localStorage.getItem('mindcare-last-checkin') === new Date().toDateString(),
        setup: !!localStorage.getItem('mindcare-setup')
      })
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mindcare-auth')
      localStorage.removeItem('mindcare-last-checkin')
      router.push('/auth')
    }
  }

  const handleClearCheckin = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mindcare-last-checkin')
      alert('チェックイン記録をクリアしました。次回アクセス時にチェックイン画面が表示されます。')
      setStatus(prev => ({ ...prev, checkin: false }))
    }
  }

  const handleClearAll = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      alert('すべてのデータをクリアしました。')
      router.push('/')
    }
  }

  return (
    <AppLayout title="テスト・デバッグ" showBackButton>
      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle>🔧 開発者用テスト機能</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </Button>

            <Button
              onClick={handleClearCheckin}
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>チェックイン記録をクリア</span>
            </Button>

            <Button
              onClick={handleClearAll}
              variant="destructive"
              className="w-full flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>全データクリア</span>
            </Button>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• ログアウト: 認証状態をクリアして認証画面へ</p>
              <p>• チェックインクリア: 今日のチェックイン記録を削除</p>
              <p>• 全データクリア: すべてのローカルデータを削除</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 現在の状態</CardTitle>
          </CardHeader>
          <CardContent>
            {mounted ? (
              <div className="text-sm space-y-2">
                <div>
                  <strong>認証状態:</strong> {status.auth ? '✅ ログイン済み' : '❌ 未ログイン'}
                </div>
                <div>
                  <strong>今日のチェックイン:</strong> {status.checkin ? '✅ 完了' : '❌ 未完了'}
                </div>
                <div>
                  <strong>セットアップ:</strong> {status.setup ? '✅ 完了' : '❌ 未完了'}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">読み込み中...</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}