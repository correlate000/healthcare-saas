'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  ArrowLeft, 
  Star, 
  Trophy, 
  Target, 
  Flame, 
  Heart, 
  MessageCircle,
  Calendar,
  Sparkles,
  Award,
  Crown,
  Zap,
  CheckCircle,
  Lock,
  Clock,
  Users
} from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  earned: boolean
  earnedDate?: string
  progress?: number
  total?: number
  xp: number
}

export default function AchievementsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'earned' | 'progress'>('all')

  const achievementsData = {
    userLevel: 12,
    totalXP: 2850,
    nextLevelXP: 3000,
    streakDays: 28,
    badges: [
      {
        id: 'first_checkin',
        name: '最初の一歩',
        description: '初回チェックインを完了',
        icon: '🌱',
        rarity: 'common' as const,
        earned: true,
        earnedDate: '2024-01-15',
        xp: 10
      },
      {
        id: 'week_streak',
        name: '一週間の継続',
        description: '7日連続でチェックイン',
        icon: '🔥',
        rarity: 'common' as const,
        earned: true,
        earnedDate: '2024-01-22',
        xp: 50
      },
      {
        id: 'month_warrior',
        name: '月の戦士',
        description: '30日連続でチェックイン',
        icon: '🏆',
        rarity: 'rare' as const,
        earned: false,
        progress: 28,
        total: 30,
        xp: 200
      },
      {
        id: 'mood_master',
        name: 'ムードマスター',
        description: '100回のチェックインを完了',
        icon: '⭐',
        rarity: 'epic' as const,
        earned: true,
        earnedDate: '2024-02-10',
        xp: 500
      },
      {
        id: 'ai_friend',
        name: 'AIの親友',
        description: 'AIと50回対話',
        icon: '🤖',
        rarity: 'rare' as const,
        earned: true,
        earnedDate: '2024-02-20',
        xp: 150
      },
      {
        id: 'wellness_champion',
        name: 'ウェルネスチャンピオン',
        description: '専門家との面談を5回完了',
        icon: '👑',
        rarity: 'legendary' as const,
        earned: false,
        progress: 3,
        total: 5,
        xp: 1000
      },
      {
        id: 'early_bird',
        name: '早起きの鳥',
        description: '朝8時前に10回チェックイン',
        icon: '🐦',
        rarity: 'uncommon' as const,
        earned: true,
        earnedDate: '2024-01-30',
        xp: 75
      },
      {
        id: 'stress_buster',
        name: 'ストレスバスター',
        description: 'ストレスレベルを30%以下に7日維持',
        icon: '😌',
        rarity: 'rare' as const,
        earned: false,
        progress: 4,
        total: 7,
        xp: 250
      }
    ] as Achievement[]
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400/30'
      case 'uncommon': return 'text-green-400 border-green-400/30'
      case 'rare': return 'text-blue-400 border-blue-400/30'
      case 'epic': return 'text-purple-400 border-purple-400/30'
      case 'legendary': return 'text-yellow-400 border-yellow-400/30'
      default: return 'text-gray-400 border-gray-400/30'
    }
  }

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/10'
      case 'uncommon': return 'bg-green-500/10'
      case 'rare': return 'bg-blue-500/10'
      case 'epic': return 'bg-purple-500/10'
      case 'legendary': return 'bg-yellow-500/10'
      default: return 'bg-gray-500/10'
    }
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'コモン'
      case 'uncommon': return 'アンコモン'
      case 'rare': return 'レア'
      case 'epic': return 'エピック'
      case 'legendary': return 'レジェンダリー'
      default: return 'コモン'
    }
  }

  const filteredAchievements = achievementsData.badges.filter(badge => {
    if (selectedCategory === 'earned') return badge.earned
    if (selectedCategory === 'progress') return !badge.earned
    return true
  })

  const earnedCount = achievementsData.badges.filter(b => b.earned).length
  const totalCount = achievementsData.badges.length
  const currentLevelProgress = ((achievementsData.totalXP % 1000) / 1000) * 100

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="text-white hover:bg-white/10 rounded-xl p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-semibold tracking-wide">実績とバッジ</h1>
            <div className="w-10" />
          </div>

          {/* Level Info */}
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-300" />
                <div>
                  <h2 className="text-xl font-bold">レベル {achievementsData.userLevel}</h2>
                  <p className="text-emerald-100 text-sm">次のレベルまで {achievementsData.nextLevelXP - achievementsData.totalXP} XP</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{achievementsData.totalXP}</div>
                <div className="text-sm text-emerald-100">総XP</div>
              </div>
            </div>
            <Progress value={currentLevelProgress} className="h-3 bg-white/20" />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-xl font-bold">{earnedCount}/{totalCount}</div>
              <div className="text-sm text-emerald-100 font-medium">獲得バッジ</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-xl font-bold">{achievementsData.streakDays}</div>
              <div className="text-sm text-emerald-100 font-medium">連続日数</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-xl font-bold">{Math.round((earnedCount / totalCount) * 100)}%</div>
              <div className="text-sm text-emerald-100 font-medium">達成率</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-24 space-y-6">
        {/* Category Filter */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'すべて' },
            { key: 'earned', label: '獲得済み' },
            { key: 'progress', label: '進行中' }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[48px] touch-manipulation ${
                selectedCategory === category.key
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-gray-700/90 text-gray-300 hover:bg-gray-600/90 border border-gray-600/30'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="space-y-4">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-700/95 rounded-2xl p-5 border transition-all duration-200 ${
                achievement.earned
                  ? `border-emerald-400/30 ${getRarityBg(achievement.rarity)}`
                  : 'border-gray-600/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${
                  achievement.earned 
                    ? `${getRarityBg(achievement.rarity)} border ${getRarityColor(achievement.rarity).split(' ')[1]}` 
                    : 'bg-gray-600/50 border border-gray-500/30'
                }`}>
                  {achievement.earned ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-bold text-lg ${
                      achievement.earned ? 'text-white' : 'text-gray-400'
                    }`}>
                      {achievement.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getRarityColor(achievement.rarity)} bg-transparent text-xs`}>
                        {getRarityLabel(achievement.rarity)}
                      </Badge>
                      {achievement.earned && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          獲得済み
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-3 leading-relaxed ${
                    achievement.earned ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">+{achievement.xp} XP</span>
                      </div>
                      {achievement.earnedDate && (
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs">{achievement.earnedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!achievement.earned && achievement.progress !== undefined && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">進捗</span>
                        <span className="text-white text-sm font-medium">
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.total!) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏆</div>
            <h3 className="text-white font-semibold text-lg mb-2">実績がありません</h3>
            <p className="text-gray-400">
              {selectedCategory === 'earned' 
                ? 'まだ獲得した実績がありません。チェックインを続けて最初の実績を獲得しましょう！'
                : 'すべての実績を獲得しました！素晴らしいですね！'
              }
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}