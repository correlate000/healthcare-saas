'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Zap, 
  Gift,
  Crown,
  Sparkles,
  Heart,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProgressSystemProps {
  userLevel: number
  currentXP: number
  xpToNextLevel: number
  streak: number
  totalCheckins: number
  achievementsCount: number
  showRecentBadge?: string
  animated?: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

const recentAchievements: Achievement[] = [
  {
    id: 'first_week',
    name: '初心者',
    description: '7日連続チェックイン達成！',
    icon: Star,
    color: 'from-yellow-400 to-orange-400',
    unlocked: true
  },
  {
    id: 'mood_tracker',
    name: '気分管理マスター',
    description: '30回の気分記録完了',
    icon: Heart,
    color: 'from-pink-400 to-red-400',
    unlocked: true,
    progress: 25,
    maxProgress: 30
  },
  {
    id: 'ai_friend',
    name: 'AIパートナー',
    description: 'AIキャラクターと100回対話',
    icon: Sparkles,
    color: 'from-purple-400 to-blue-400',
    unlocked: false,
    progress: 73,
    maxProgress: 100
  }
]

export function ProgressSystem({
  userLevel,
  currentXP,
  xpToNextLevel,
  streak,
  totalCheckins,
  achievementsCount,
  showRecentBadge,
  animated = true
}: ProgressSystemProps) {
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showNewBadge, setShowNewBadge] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([])

  const xpPercentage = (currentXP / xpToNextLevel) * 100

  // レベルアップアニメーション
  useEffect(() => {
    if (currentXP >= xpToNextLevel) {
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 3000)
      
      // パーティクルエフェクト
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }))
      setParticles(newParticles)
      
      setTimeout(() => setParticles([]), 2000)
    }
  }, [currentXP, xpToNextLevel])

  // 新しいバッジ通知
  useEffect(() => {
    if (showRecentBadge) {
      setShowNewBadge(true)
      setTimeout(() => setShowNewBadge(false), 4000)
    }
  }, [showRecentBadge])

  return (
    <div className="space-y-6">
      {/* レベル・XPカード */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-6">
          {/* パーティクルエフェクト */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  y: [0, -50, -100],
                  opacity: [1, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Crown className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-gray-800">レベル {userLevel}</h3>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  </motion.div>
                </div>
                <p className="text-sm text-gray-600">次のレベルまで {xpToNextLevel - currentXP} XP</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentXP.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">総経験値</div>
            </div>
          </div>

          {/* XPプログレスバー */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">経験値</span>
              <span className="font-medium">{Math.round(xpPercentage)}%</span>
            </div>
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Progress value={xpPercentage} className="h-3" />
              {animated && (
                <motion.div
                  className="absolute inset-0 h-3 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* 統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm border-2 border-orange-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Flame className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">ストリーク</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{streak}</div>
          <div className="text-xs text-gray-500">日連続</div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">チェックイン</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{totalCheckins}</div>
          <div className="text-xs text-gray-500">回完了</div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm border-2 border-purple-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">実績</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{achievementsCount}</div>
          <div className="text-xs text-gray-500">個獲得</div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-4 shadow-sm border-2 border-blue-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">成長率</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">+12%</div>
          <div className="text-xs text-gray-500">今週</div>
        </motion.div>
      </div>

      {/* 最近の実績 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>最近の実績</span>
          </h3>
          
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => {
              const IconComponent = achievement.icon
              return (
                <motion.div
                  key={achievement.id}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border",
                    achievement.unlocked 
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" 
                      : "bg-gray-50 border-gray-200"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br",
                    achievement.color
                  )}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-800">{achievement.name}</h4>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          完了
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    
                    {achievement.progress && achievement.maxProgress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>進捗</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* レベルアップ通知 */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 text-center shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                レベルアップ！
              </h2>
              <p className="text-gray-600 mb-4">レベル {userLevel} に到達しました！</p>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                新しい機能がアンロックされました！
              </Badge>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 新バッジ通知 */}
      <AnimatePresence>
        {showNewBadge && (
          <motion.div
            className="fixed top-4 right-4 z-50"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Gift className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">新しい実績獲得！</h4>
                  <p className="text-sm text-gray-600">{showRecentBadge}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}