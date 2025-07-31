'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

// Wireframe page 14 data structure
const dashboardData = {
  friendLevel: 85,
  currentLevel: 8,
  xp: '850 / 1000',
  todayProgress: '50%',
  completedTasks: '2/4',
  todayMessage: 'あなたの存在自体が、誰かにとっての光になっています。',
  weeklyRecords: {
    days: 12,
    months: 5
  },
  level: 5,
  progressPercentage: 50,
  checkInTime: '24分の時',
  challenges: [
    { id: 1, title: '朝の気分チェック', category: '基本', completed: true, xp: 20 },
    { id: 2, title: '今日の感謝', category: '基本', completed: true, xp: 30 },
    { id: 3, title: '感情の記録', category: '基本', completed: false, xp: 40 },
    { id: 4, title: '30分のマインドフルネス', category: 'チャレンジ', completed: false, xp: 35 }
  ],
  recentAchievements: [
    { id: 1, title: '7日連続記録達成！', description: '素晴らしい継続力です！', isNew: true },
    { id: 2, title: 'Lunaとのフレンドレベルアップ', description: 'Lunaとのきずなが深まりました', isNew: false },
    { id: 3, title: 'チーム内順位が上昇！', description: '3位に上昇しました', isNew: false }
  ],
  todayStats: {
    stress: 65,
    energy: 78,
    sleep: '4/5'
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [currentCharacter, setCurrentCharacter] = useState(0)

  const characters = [
    { id: 'luna', name: 'Luna', active: true },
    { id: 'aria', name: 'Aria', active: false },
    { id: 'zen', name: 'Zen', active: false }
  ]

  return (
    <div className="min-h-screen bg-gray-800 text-white overscroll-contain">
      {/* Header with character and greeting - matching wireframe */}
      <div className="p-6 flex items-start space-x-4">
        {/* Character area */}
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-sm font-semibold tracking-wide">キャラクター</span>
        </div>
        
        {/* Greeting message */}
        <div className="flex-1 bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30 shadow-sm">
          <p className="text-gray-100 text-base leading-relaxed font-medium">
            おかえりなさい。今日はいかがでしたか？
          </p>
        </div>
      </div>

      <div className="px-4 space-y-5">
        {/* Friend level with character dots */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300 font-medium tracking-wide text-base">フレンドレベル {dashboardData.friendLevel}</span>
          <div className="flex space-x-2">
            {characters.map((char, index) => (
              <button 
                key={char.id}
                onClick={() => setCurrentCharacter(index)}
                className={`w-8 h-8 rounded-full shadow-md transition-all duration-200 touch-manipulation ${
                  currentCharacter === index 
                    ? 'bg-white scale-110' 
                    : 'bg-gray-600/70 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Today's message - wireframe styling */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 shadow-sm">
          <h3 className="text-white font-semibold mb-3 tracking-wide">今日のメッセージ</h3>
          <p className="text-gray-200 text-sm leading-relaxed">
            {dashboardData.todayMessage}
          </p>
        </div>

        {/* Weekly records section */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">週間記録</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300 font-medium">調子の記録</span>
            <div className="text-right">
              <div className="text-sm text-white font-semibold">{dashboardData.weeklyRecords.days}日</div>
              <div className="text-sm text-white font-semibold">{dashboardData.weeklyRecords.months}ヶ月</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-300 font-medium">lvl.{dashboardData.level}</div>
        </div>

        {/* Today's progress - center focus */}
        <div className="text-center space-y-4">
          <button 
            onClick={() => router.push('/analytics')}
            className="touch-manipulation hover:scale-105 transition-transform duration-200"
          >
            <div className="text-5xl font-bold text-white mb-2">{dashboardData.progressPercentage}%</div>
            <div className="text-sm text-gray-300 font-medium">今日の進捗状況</div>
          </button>
          
          {/* Check-in button */}
          <button 
            onClick={() => router.push('/checkin')}
            className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation hover:scale-105"
          >
            <div className="text-gray-800 text-xs font-semibold text-center leading-tight">{dashboardData.checkInTime}</div>
          </button>
        </div>

        {/* Today's challenges */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold tracking-wide">今日のチャレンジ</h3>
            <span className="text-sm text-gray-300 font-medium">{dashboardData.completedTasks}</span>
          </div>
          
          <div className="space-y-3">
            {dashboardData.challenges.map((challenge) => (
              <button 
                key={challenge.id} 
                className="w-full bg-gray-700/95 rounded-xl p-4 border border-gray-600/30 shadow-sm hover:border-gray-500/50 transition-colors duration-200 text-left touch-manipulation" 
                onClick={() => router.push('/daily-challenge')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white tracking-wide">{challenge.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
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

        {/* Recent achievements */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">最近の実績</h3>
          
          <div className="space-y-3">
            {dashboardData.recentAchievements.map((achievement) => (
              <button 
                key={achievement.id} 
                className="w-full bg-gray-700/95 rounded-xl p-4 border border-gray-600/30 shadow-sm hover:border-gray-500/50 transition-colors duration-200 text-left touch-manipulation" 
                onClick={() => router.push('/achievements')}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-semibold text-white tracking-wide">{achievement.title}</span>
                  {achievement.isNew && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium animate-pulse">NEW</span>
                  )}
                </div>
                <span className="text-xs text-gray-300 font-medium">{achievement.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's stats summary */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold tracking-wide">今日の記録</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-400 mb-1">{dashboardData.todayStats.stress}%</div>
              <div className="text-xs text-gray-300 font-medium">ストレス</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">{dashboardData.todayStats.energy}%</div>
              <div className="text-xs text-gray-300 font-medium">エネルギー</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-1">{dashboardData.todayStats.sleep}</div>
              <div className="text-xs text-gray-300 font-medium">睡眠時間</div>
            </div>
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