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
    <div className="min-h-screen bg-gray-800 text-white overscroll-contain">
      {/* Header with character and greeting */}
      <div className="p-6 flex items-start space-x-4">
        {/* Character area - improved shadow and spacing */}
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg transition-shadow duration-200">
          <span className="text-white text-sm font-semibold tracking-wide">キャラクター</span>
        </div>
        
        {/* Greeting area - mobile optimized */}
        <div className="flex-1 bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30 shadow-sm">
          <p className="text-gray-100 text-base leading-relaxed font-medium">
            おかえりなさい。今日はいかがでしたか？
          </p>
        </div>
      </div>

      <div className="px-4 space-y-5">
        {/* Friend level - improved visual hierarchy */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300 font-medium tracking-wide text-base">フレンドレベル 85</span>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-white rounded-full shadow-md transition-transform hover:scale-110"></div>
            <div className="w-8 h-8 bg-gray-600/70 rounded-full transition-colors hover:bg-gray-500"></div>
            <div className="w-8 h-8 bg-gray-600/70 rounded-full transition-colors hover:bg-gray-500"></div>
          </div>
        </div>

        {/* Daily message - enhanced contrast and spacing */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 shadow-sm">
          <h3 className="text-white font-semibold mb-3 tracking-wide text-lg">今日のメッセージ</h3>
          <p className="text-gray-200 text-base leading-relaxed mb-3">
            今日も自分らしく、一歩ずつ前に進んでいきましょう。
          </p>
          <div className="text-sm text-gray-400 font-medium">
            今日のラッキーカラー・ブルー
          </div>
        </div>

        {/* Today's record - improved visual hierarchy */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">今日の記録</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300 font-medium">調子の記録</span>
            <div className="text-right">
              <div className="text-sm text-white font-semibold">12日</div>
              <div className="text-sm text-white font-semibold">5ヶ月</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-300 font-medium">lvl.5</div>
          
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white mb-2">50%</div>
            <div className="text-sm text-gray-300 mb-4 font-medium">今日の進捗状況</div>
            
            {/* Check-in circle - enhanced visual */}
            <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-gray-800 text-xs font-semibold text-center leading-tight">24分の時</div>
            </div>
          </div>
        </div>

        {/* Daily challenges - improved readability */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold tracking-wide text-lg">今日のチャレンジ</h3>
            <span className="text-base text-gray-300 font-medium">2/4</span>
          </div>
          
          <div className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <button key={challenge.id} className="w-full bg-gray-700/95 rounded-xl p-5 border border-gray-600/30 shadow-sm hover:border-gray-500/50 transition-colors duration-200 text-left touch-manipulation" onClick={() => router.push('/daily-challenge')}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white tracking-wide">{challenge.title}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    challenge.category === 'チャレンジ' 
                      ? 'bg-orange-600/90 text-orange-100' 
                      : 'bg-gray-600/90 text-gray-200'
                  }`}>
                    {challenge.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${
                    challenge.completed ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {challenge.completed ? '完了' : '未完了'}
                  </span>
                  <span className="text-yellow-400 font-semibold">+{challenge.xp} XP</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent activities - enhanced spacing and typography */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">最近の実績</h3>
          
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <button key={activity.id} className="w-full bg-gray-700/95 rounded-xl p-5 border border-gray-600/30 shadow-sm hover:border-gray-500/50 transition-colors duration-200 text-left touch-manipulation" onClick={() => router.push('/achievements')}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-semibold text-white tracking-wide">{activity.title}</span>
                      {activity.isNew && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium animate-pulse">NEW</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-300 font-medium">{activity.description}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Today's record summary - better contrast and spacing */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold tracking-wide">今日の記録</span>
          </div>
          
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400 mb-1">65%</div>
              <div className="text-xs text-gray-300 font-medium">ストレス</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-1">78%</div>
              <div className="text-xs text-gray-300 font-medium">エネルギー</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">4/5</div>
              <div className="text-xs text-gray-300 font-medium">睡眠時間</div>
            </div>
          </div>
        </div>

        {/* Achievement notification - enhanced visual appeal */}
        <div className="bg-gray-700/95 rounded-2xl p-5 text-center border border-gray-600/30 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">🏆</span>
          </div>
          <div className="text-yellow-400 font-bold mb-2 text-lg">7日連続記録達成！</div>
          <div className="text-sm text-gray-200 mb-4 leading-relaxed">
            新しいバッジを獲得しました！おめでとう！
          </div>
          <Button 
            onClick={() => router.push('/achievements')}
            className="w-full bg-white text-gray-800 hover:bg-gray-100 rounded-xl font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200"
          >
            バッジを確認する
          </Button>
        </div>

        {/* Quick access to settings - improved accessibility */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold tracking-wide">設定・その他</h3>
              <p className="text-gray-300 text-sm font-medium">アカウント設定やプライバシー設定</p>
            </div>
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => router.push('/settings')}
              className="text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-xl px-6 py-4 transition-all duration-200 min-h-[48px] touch-manipulation"
            >
              →
            </Button>
          </div>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-24"></div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}