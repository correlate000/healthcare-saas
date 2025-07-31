'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  CheckCircle, 
  Clock, 
  Star, 
  ArrowLeft
} from 'lucide-react'

// Wireframe page 23 exact data structure
const wireframeChallengeData = {
  todayMessage: '毎日の積み重ねで心の健康を',
  currentStreak: 7,
  completedToday: 1,
  totalToday: 7,
  todayXP: 32,
  totalXP: 2840,
  todayProgress: 14,
  date: '2025年6月19日',
  dailyChallenges: [
    { id: 1, title: '朝の気分チェック', category: '簡単', completed: true, xp: 20, timeEstimate: '1分', description: '今日の気分を3つの絵文字で表現してみましょう' },
    { id: 2, title: '感謝の記録', category: '簡単', completed: false, xp: 30, timeEstimate: '1分', description: '今日感謝したい小さなことを3つ見つけてみましょう' },
    { id: 3, title: '感謝の記録', category: '簡単', completed: false, xp: 30, timeEstimate: '1分', description: '今日感謝したい小さなことを3つ見つけてみましょう' },
    { id: 4, title: '3分間の深呼吸', category: '簡単', completed: false, xp: 40, timeEstimate: '3分', description: 'ガイド付きで3分間のマインドフルネスを体験しましょう' }
  ],
  completedChallenges: [
    { id: 'work-reflection', title: '仕事の振り返り', xp: 30 }
  ],
  streakBonus: {
    message: '7日連続でチャレンジを達成中！素晴らしい！',
    xp: 2
  }
}

export default function DailyChallenge() {
  const router = useRouter()
  const [currentStreak] = useState(wireframeChallengeData.currentStreak)

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Header - wireframe style */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-lg font-semibold">デイリーチャレンジ</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Title and message - exact wireframe */}
      <div className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl font-bold mb-2">デイリーチャレンジ</h1>
          <p className="text-gray-300 text-sm font-medium">{wireframeChallengeData.todayMessage}</p>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Stats grid - exact wireframe */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{wireframeChallengeData.todayXP}</div>
            <div className="text-xs text-gray-300">今日のXP</div>
          </div>
          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{wireframeChallengeData.totalXP}</div>
            <div className="text-xs text-gray-300">総XP</div>
          </div>
          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{wireframeChallengeData.completedToday}/{wireframeChallengeData.totalToday}</div>
            <div className="text-xs text-gray-300">達成チャレンジ</div>
          </div>
          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{currentStreak}日</div>
            <div className="text-xs text-gray-300">連続達成</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-medium">今日の進捗</span>
            <span className="text-white text-sm font-medium">{wireframeChallengeData.todayProgress}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${wireframeChallengeData.todayProgress}%` }}
            />
          </div>
        </div>

        {/* Today's challenges list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold tracking-wide">今日のチャレンジ</h3>
            <span className="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded-full">{wireframeChallengeData.date}</span>
          </div>
          
          <div className="space-y-3">
            {wireframeChallengeData.dailyChallenges.map((challenge) => (
              <motion.div 
                key={challenge.id} 
                className="bg-blue-600 rounded-xl p-4 shadow-sm"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-white tracking-wide">{challenge.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium bg-gray-800 text-gray-200`}>
                      {challenge.category}
                    </span>
                  </div>
                  {challenge.completed && (
                    <CheckCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <p className="text-xs text-blue-100 mb-3">{challenge.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-100">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {challenge.timeEstimate}
                    </span>
                    <span className="text-yellow-300 font-semibold">★ +{challenge.xp} XP</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed challenges */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">完了したチャレンジ</h3>
          
          <div className="space-y-2">
            {wireframeChallengeData.completedChallenges.map((challenge) => (
              <div key={challenge.id} className="bg-gray-700 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">{challenge.title}</span>
                </div>
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">+{challenge.xp}xp</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak bonus */}
        <div className="bg-gray-700 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🔥</div>
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-1">連続ログインボーナス</h4>
              <p className="text-gray-300 text-sm">{wireframeChallengeData.streakBonus.message}</p>
            </div>
            <div className="text-sm bg-gray-800 text-gray-300 px-2 py-1 rounded-full">+{wireframeChallengeData.streakBonus.xp}xp</div>
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