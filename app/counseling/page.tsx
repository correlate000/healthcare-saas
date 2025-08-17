'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CounselingChat } from '@/components/counseling/CounselingChat'
import { VoiceCharacter } from '@/components/VoiceCharacter'
import { Brain, Heart, Shield, Sparkles, TrendingUp, Calendar, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { conversationStorage, EmotionAnalysis } from '@/lib/conversation-storage'

export default function CounselingPage() {
  const [isActive, setIsActive] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [emotionTrends, setEmotionTrends] = useState<EmotionAnalysis[]>([])
  const [sessionCount, setSessionCount] = useState(0)
  const userId = typeof window !== 'undefined' ? 
    'user-' + (localStorage.getItem('userId') || Date.now()) : 
    'user-' + Date.now()

  useEffect(() => {
    loadUserStats()
  }, [])

  const loadUserStats = async () => {
    try {
      await conversationStorage.initialize()
      
      // 感情トレンドを取得
      const trends = await conversationStorage.getEmotionTrends(userId, 7)
      setEmotionTrends(trends)
      
      // セッション数を取得（簡易版）
      const history = await conversationStorage.getConversationHistory(userId, 100)
      const uniqueDays = new Set(
        history.map(h => new Date(h.timestamp).toDateString())
      )
      setSessionCount(uniqueDays.size)
    } catch (error) {
      console.error('Failed to load user stats:', error)
    }
  }

  const getEmotionSummary = () => {
    if (emotionTrends.length === 0) return null
    
    const emotionCounts: Record<string, number> = {}
    emotionTrends.forEach(e => {
      emotionCounts[e.primary] = (emotionCounts[e.primary] || 0) + 1
    })
    
    const mostCommon = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]
    
    return mostCommon ? mostCommon[0] : null
  }

  const getEmotionLabel = (emotion: string | null) => {
    switch (emotion) {
      case 'joy': return '喜び'
      case 'sadness': return '悲しみ'
      case 'anger': return '怒り'
      case 'fear': return '不安'
      case 'surprise': return '驚き'
      case 'love': return '愛情'
      default: return '平常'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>戻る</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">パーソナル悩み相談</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>プライバシー保護</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左サイドバー - AIキャラクター & 統計 */}
          <div className="space-y-6">
            {/* AIキャラクター */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span>AIカウンセラー</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <VoiceCharacter
                  isActive={isActive}
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  size={180}
                />
                <p className="text-sm text-gray-600 mt-4 text-center">
                  あなたの気持ちに寄り添い、<br />
                  パーソナライズされたサポートを提供します
                </p>
              </CardContent>
            </Card>

            {/* ユーザー統計 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span>あなたの状態</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">セッション数</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{sessionCount}</span>
                </div>

                {getEmotionSummary() && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">最近の主な感情</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {getEmotionLabel(getEmotionSummary())}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">今日のヒント</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    深呼吸をして、今この瞬間に意識を向けてみましょう。
                    小さな一歩が大きな変化につながります。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* メインチャットエリア */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>悩み相談チャット</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>すべての会話は暗号化されています</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full pb-6">
                <CounselingChat />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* フッター情報 */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>プライバシー保護</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span>AI駆動の分析</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-pink-600" />
              <span>24時間サポート</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              <span>パーソナライズ対応</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}