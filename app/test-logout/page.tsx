'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { AppLayout } from '@/src/components/layout/AppLayout'
import { LogOut, RotateCcw, Trash2 } from 'lucide-react'

export default function TestLogoutPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('mindcare-auth')
    localStorage.removeItem('mindcare-last-checkin')
    router.push('/auth')
  }

  const handleClearCheckin = () => {
    localStorage.removeItem('mindcare-last-checkin')
    alert('チェックイン記録をクリアしました。次回アクセス時にチェックイン画面が表示されます。')
  }

  const handleClearAll = () => {
    localStorage.clear()
    alert('すべてのデータをクリアしました。')
    router.push('/')
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
            <div className="text-sm space-y-2">
              <div>
                <strong>認証状態:</strong> {localStorage.getItem('mindcare-auth') ? '✅ ログイン済み' : '❌ 未ログイン'}
              </div>
              <div>
                <strong>今日のチェックイン:</strong> {localStorage.getItem('mindcare-last-checkin') === new Date().toDateString() ? '✅ 完了' : '❌ 未完了'}
              </div>
              <div>
                <strong>セットアップ:</strong> {localStorage.getItem('mindcare-setup') ? '✅ 完了' : '❌ 未完了'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}