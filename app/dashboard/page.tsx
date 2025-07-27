'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

interface DailyChallenge {
  id: string
  title: string
  category: string
  completed: boolean
  xp: number
}

interface RecentActivity {
  id: string
  title: string
  description: string
  isNew: boolean
}

export default function Dashboard() {
  const router = useRouter()

  // Daily challenges from wireframe
  const [dailyChallenges] = useState<DailyChallenge[]>([
    {
      id: 'morning-checkin',
      title: '朝の気分チェック',
      category: '基本',
      completed: true,
      xp: 20
    },
    {
      id: 'gratitude',
      title: '今日の感謝',
      category: '基本', 
      completed: true,
      xp: 30
    },
    {
      id: 'breathing',
      title: '感情の記録',
      category: '基本',
      completed: false,
      xp: 40
    },
    {
      id: 'reflection',
      title: '30分のマインドフルネス',
      category: 'チャレンジ',
      completed: false,
      xp: 35
    }
  ])

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      title: '7日連続記録達成！',
      description: '素晴らしい継続力です！',
      isNew: true
    },
    {
      id: '2',
      title: 'Lunaとのフレンドレベルアップ',
      description: 'Lunaとのきずなが深まりました',
      isNew: false
    },
    {
      id: '3',
      title: 'チーム内順位が上昇！',
      description: '3位に上昇しました',
      isNew: false
    }
  ])

  const checkinPercentage = 50

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Header with character and greeting */}
      <div className="p-6 flex items-start space-x-4">
        {/* Character area - lime green circle */}
        <div className="w-24 h-24 bg-lime-400 rounded-3xl flex items-center justify-center flex-shrink-0">
          <span className="text-gray-800 text-sm font-medium">キャラクター</span>
        </div>
        
        {/* Greeting area */}
        <div className="flex-1 bg-gray-700 rounded-2xl p-4">
          <p className="text-white text-sm leading-relaxed">
            おかえりなさい。今日はどんな一日でしたか？午後の時間はいかがお過ごしでしたか？少し休憩してみましょう。...
          </p>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Friend level */}
        <div className="flex items-center justify-between text-sm">
          <span>フレンドレベル 85</span>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-white rounded-full"></div>
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        {/* Daily message */}
        <div className="bg-gray-700 rounded-2xl p-4">
          <h3 className="text-white font-medium mb-2">今日の運勢・メッセージ</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            あなたの存在自体が、誰かにとっての光になっています。今日も自分らしく、一歩ずつ前に進んでいきましょう。
          </p>
          <div className="mt-2 text-xs text-gray-400">
            今日のラッキーカラー・ブルー
          </div>
        </div>

        {/* Today's record */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">今日の記録</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">調子の記録</span>
            <div className="text-right">
              <div className="text-sm">12日</div>
              <div className="text-sm">5ヶ月</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-300">lvl.5</div>
          
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-white mb-1">50%</div>
            <div className="text-sm text-gray-300 mb-3">今日の進捗状況</div>
            
            {/* Check-in circle */}
            <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center">
              <div className="text-gray-800 text-xs">24分の時</div>
            </div>
          </div>
        </div>

        {/* Daily challenges */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">今日のチャレンジ</h3>
            <span className="text-sm text-gray-300">2/4</span>
          </div>
          
          <div className="space-y-2">
            {dailyChallenges.map((challenge) => (
              <div key={challenge.id} className="bg-gray-700 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{challenge.title}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    challenge.category === 'チャレンジ' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {challenge.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{challenge.completed ? '完了' : '未完了'}</span>
                  <span>+{challenge.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activities */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">最近の実績</h3>
          
          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="bg-gray-700 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">{activity.title}</span>
                      {activity.isNew && (
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">NEW</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-300">{activity.description}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's record summary */}
        <div className="bg-gray-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">今日の記録</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">65%</div>
              <div className="text-xs text-gray-300">ストレス</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">78%</div>
              <div className="text-xs text-gray-300">エネルギー</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">4/5</div>
              <div className="text-xs text-gray-300">睡眠時間</div>
            </div>
          </div>
        </div>

        {/* Achievement notification */}
        <div className="bg-gray-700 rounded-2xl p-4 text-center">
          <div className="w-12 h-12 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-gray-800 text-sm">🏆</span>
          </div>
          <div className="text-yellow-400 font-medium mb-1">7日連続記録達成！</div>
          <div className="text-xs text-gray-300 mb-3">
            新しいバッジを獲得しました！おめでとう！
          </div>
          <Button className="w-full bg-white text-gray-800 hover:bg-gray-100 rounded-xl">
            バッジを確認する
          </Button>
        </div>

        {/* Quick access to settings */}
        <div className="bg-gray-700 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">設定・その他</h3>
              <p className="text-gray-300 text-sm">アカウント設定やプライバシー設定</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/settings')}
              className="text-gray-300 hover:text-white"
            >
              →
            </Button>
          </div>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}