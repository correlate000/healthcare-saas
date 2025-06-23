'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, CheckCircle } from 'lucide-react'

export default function TestSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            🎉 接続テスト成功！
          </h1>
          <p className="text-gray-600">
            すべてのコンポーネントが正常に読み込まれています
          </p>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>shadcn/ui テスト</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Card、Button、Badgeコンポーネントが正常に動作しています。
                </p>
                <div className="flex space-x-2">
                  <Badge variant="default">成功</Badge>
                  <Badge variant="secondary">テスト</Badge>
                  <Badge variant="outline">完了</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>構成テスト</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-green-600">✅ tsconfig.json</div>
                  <div className="font-medium text-green-600">✅ components.json</div>
                  <div className="font-medium text-green-600">✅ import paths</div>
                  <div className="font-medium text-green-600">✅ shadcn/ui</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Button>
              プライマリボタン
            </Button>
            <Button variant="outline">
              アウトラインボタン
            </Button>
            <Button variant="secondary">
              セカンダリボタン
            </Button>
          </div>
          
          <div className="space-x-4">
            <Button onClick={() => window.location.href = '/'}>
              ホームページに戻る
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              ダッシュボード
            </Button>
          </div>
        </div>

        {/* Info */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-green-800 mb-2">
                🎯 修正完了
              </h3>
              <p className="text-sm text-green-700">
                プロジェクト構造が正常化され、すべてのコンポーネントが正しく動作しています。
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}