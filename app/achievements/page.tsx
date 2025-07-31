'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  ArrowLeft, 
  Star, 
  Trophy, 
  Target, 
  Flame, 
  Heart, 
  Award,
  CheckCircle
} from 'lucide-react'

// Simplified achievements page to match app consistency
export default function AchievementsPage() {
  const router = useRouter()

  const achievementsData = {
    userLevel: 8,
    totalXP: 850,
    nextLevelXP: 1000,
    streakDays: 12,
    achievements: [
      {
        id: 'streak_7',
        name: '7日連続記録達成！',
        description: '新しいバッジと限定スタンプをゲット！',
        icon: '🏆',
        earned: true,
        xp: 100
      },
      {
        id: 'friend_level',
        name: 'Lunaとのフレンドレベルアップ',
        description: 'AIキャラクターとの親密度が上がりました',
        icon: '💫',
        earned: true,
        xp: 50
      },
      {
        id: 'team_likes',
        name: 'チーム投稿が10いいね！',
        description: 'コミュニティで人気の投稿をしました',
        icon: '❤️',
        earned: false,
        progress: 7,
        total: 10,
        xp: 75
      },
      {
        id: 'mood_master',
        name: '気分向上マスター',
        description: '1週間連続で気分スコアが向上',
        icon: '🌟',
        earned: false,
        progress: 5,
        total: 7,
        xp: 150
      }
    ]
  }

  const currentLevelProgress = ((achievementsData.totalXP % 1000) / 1000) * 100

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-white text-lg font-semibold">実績とバッジ</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Level Progress */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <div>
                <h2 className="text-xl font-bold">レベル {achievementsData.userLevel}</h2>
                <p className="text-gray-400 text-sm">次のレベルまで {achievementsData.nextLevelXP - achievementsData.totalXP} XP</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{achievementsData.totalXP}</div>
              <div className="text-sm text-gray-400">総XP</div>
            </div>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700/95 rounded-xl p-4 text-center border border-gray-600/30">
            <div className="text-xl font-bold text-white mb-1">
              {achievementsData.achievements.filter(a => a.earned).length}
            </div>
            <div className="text-xs text-gray-400">獲得済み</div>
          </div>
          <div className="bg-gray-700/95 rounded-xl p-4 text-center border border-gray-600/30">
            <div className="text-xl font-bold text-white mb-1">{achievementsData.streakDays}</div>
            <div className="text-xs text-gray-400">連続記録</div>
          </div>
          <div className="bg-gray-700/95 rounded-xl p-4 text-center border border-gray-600/30">
            <div className="text-xl font-bold text-white mb-1">
              {Math.round((achievementsData.achievements.filter(a => a.earned).length / achievementsData.achievements.length) * 100)}%
            </div>
            <div className="text-xs text-gray-400">達成率</div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">実績一覧</h3>
          
          {achievementsData.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-700/95 rounded-2xl p-4 border ${
                achievement.earned
                  ? 'border-emerald-400/30 bg-emerald-500/5'
                  : 'border-gray-600/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  achievement.earned 
                    ? 'bg-emerald-500/20 border border-emerald-400/30' 
                    : 'bg-gray-600/50 border border-gray-500/30'
                }`}>
                  {achievement.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${
                      achievement.earned ? 'text-white' : 'text-gray-400'
                    }`}>
                      {achievement.name}
                    </h4>
                    {achievement.earned && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        獲得済み
                      </Badge>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 leading-relaxed ${
                    achievement.earned ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">+{achievement.xp} XP</span>
                    </div>
                  </div>

                  {!achievement.earned && achievement.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">進捗</span>
                        <span className="text-white text-sm font-medium">
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.total!) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-24"></div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}