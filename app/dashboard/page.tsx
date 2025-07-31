'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { wireframeChallengeData, getDashboardMetrics } from '@/lib/challengeData'

// Get dashboard metrics from shared challenge data
const challengeMetrics = getDashboardMetrics(wireframeChallengeData)

// Wireframe page 14 exact data structure with challenge data integration
const dashboardData = {
  friendLevel: 85,
  currentLevel: 8,
  xp: '850 / 1000',
  todayProgress: challengeMetrics.progressPercentage,
  completedTasks: `${challengeMetrics.completedTasks}/${challengeMetrics.totalTasks}`,
  todayMessage: 'あなたの存在自体が、誰かにとっての光になっています。',
  todayLuckyColor: 'ブルー',
  weeklyRecords: {
    continuousRecord: challengeMetrics.currentStreak,
    totalRecord: '5ヶ月',
    weeklyCheckin: '5/7日'
  },
  level: 8,
  progressPercentage: challengeMetrics.progressPercentage,
  checkInTime: `${challengeMetrics.completedTasks}/${challengeMetrics.totalTasks}\nタスク完了`,
  challenges: challengeMetrics.challenges,
  recentAchievements: [
    { id: 1, title: '7日連続記録達成！', description: '新しいバッジと限定スタンプをゲット！', isNew: true },
    { id: 2, title: 'Lunaとのフレンドレベルアップ', description: '', isNew: true },
    { id: 3, title: 'チーム投稿が10いいね！', description: '', isNew: false }
  ],
  todayStats: {
    energy: 85,
    happiness: 78,
    weeklyGoal: '4/5'
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

        {/* Today's fortune and message - exact wireframe */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 shadow-sm">
          <h3 className="text-white font-semibold mb-3 tracking-wide">今日の運勢・メッセージ</h3>
          <p className="text-gray-200 text-sm leading-relaxed mb-3">
            {dashboardData.todayMessage}
          </p>
          <p className="text-gray-200 text-sm leading-relaxed mb-3">
            今日も自分らしく、一歩ずつ前に進んでいきましょう。
          </p>
          <div className="text-sm text-gray-400 font-medium">
            今日のラッキーカラー: {dashboardData.todayLuckyColor}
          </div>
        </div>

        {/* Weekly records section - exact wireframe layout */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">今週の記録</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300 font-medium">連続記録</span>
            <div className="text-right">
              <div className="text-sm text-white font-semibold">{dashboardData.weeklyRecords.continuousRecord}日</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300 font-medium">今週のチェックイン</span>
            <div className="text-right">
              <div className="text-sm text-white font-semibold">{dashboardData.weeklyRecords.weeklyCheckin}</div>
            </div>
          </div>
          
          <div className="text-sm text-gray-300 font-medium">lv.{dashboardData.level} {dashboardData.xp} xp</div>
        </div>

        {/* Today's achievement - exact wireframe */}
        <div className="text-center space-y-4">
          <button 
            onClick={() => router.push('/analytics')}
            className="touch-manipulation hover:scale-105 transition-transform duration-200"
          >
            <div className="text-5xl font-bold text-white mb-2">{dashboardData.progressPercentage}%</div>
            <div className="text-sm text-gray-300 font-medium">今日の達成度</div>
          </button>
          <div className="text-sm text-gray-300 font-medium">{dashboardData.completedTasks} タスク完了</div>
          
          {/* Check-in button - exact wireframe positioning */}
          <button 
            onClick={() => router.push('/checkin')}
            className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation hover:scale-105"
          >
            <div className="text-gray-800 text-xs font-semibold text-center leading-tight">{dashboardData.checkInTime}</div>
          </button>
        </div>

        {/* Today's challenges - exact wireframe layout */}
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
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      challenge.category === '簡単' 
                        ? 'bg-gray-600/90 text-gray-200' 
                        : 'bg-orange-600/90 text-orange-100'
                    }`}>
                      {challenge.category}
                    </span>
                    {challenge.completed && (
                      <span className="text-green-400 text-xs">完了</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">{challenge.timeEstimate}</span>
                    <span className="text-yellow-400 font-semibold">+{challenge.xp} XP</span>
                  </div>
                  {challenge.completed && (
                    <span className="text-green-400 text-xs">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent achievements - exact wireframe */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">最近の実績</h3>
          
          <div className="space-y-3">
            {dashboardData.recentAchievements.map((achievement) => (
              <button 
                key={achievement.id} 
                className="w-full bg-gray-700/95 rounded-xl p-4 border border-gray-600/30 shadow-sm hover:border-gray-500/50 transition-colors duration-200 text-left touch-manipulation" 
                onClick={() => router.push('/achievements')}
              >
                <div className="flex items-center space-x-3 mb-1">
                  <span className="text-sm font-semibold text-white tracking-wide">{achievement.title}</span>
                  {achievement.isNew && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium animate-pulse">NEW</span>
                  )}
                </div>
                {achievement.description && (
                  <span className="text-xs text-gray-300 font-medium">{achievement.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Today's record - exact wireframe */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold tracking-wide">今日の記録</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">{dashboardData.todayStats.energy}%</div>
              <div className="text-xs text-gray-300 font-medium">エネルギー</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-1">{dashboardData.todayStats.happiness}%</div>
              <div className="text-xs text-gray-300 font-medium">幸福度</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400 mb-1">{dashboardData.todayStats.weeklyGoal}</div>
              <div className="text-xs text-gray-300 font-medium">週間目標</div>
            </div>
          </div>
        </div>

        {/* 7-day achievement badge - exact wireframe */}
        <div className="bg-gray-700/95 rounded-2xl p-5 text-center border border-gray-600/30 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">🏆</span>
          </div>
          <div className="text-yellow-400 font-bold mb-2 text-lg">7日連続記録達成！</div>
          <div className="text-sm text-gray-200 mb-4 leading-relaxed">
            新しいバッジと限定スタンプをゲット！
          </div>
          <button 
            onClick={() => router.push('/achievements')}
            className="w-full bg-white text-gray-800 hover:bg-gray-100 rounded-xl font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200"
          >
            報酬を受け取る
          </button>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-24"></div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}