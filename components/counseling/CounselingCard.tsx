import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Heart, MessageCircle, Shield } from 'lucide-react'

export function CounselingCard() {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span>パーソナル悩み相談</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">
          AIカウンセラーがあなたの気持ちに寄り添い、
          パーソナライズされたサポートを提供します。
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1 text-gray-600">
            <Heart className="h-3 w-3 text-pink-500" />
            <span>共感的な対話</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <MessageCircle className="h-3 w-3 text-blue-500" />
            <span>24時間対応</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Brain className="h-3 w-3 text-purple-500" />
            <span>感情分析</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Shield className="h-3 w-3 text-green-500" />
            <span>プライバシー保護</span>
          </div>
        </div>

        <Link href="/counseling">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            相談を始める
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}