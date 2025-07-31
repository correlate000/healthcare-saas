'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Heart,
  Brain,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  Star,
  ChevronRight,
  Download,
  Share,
  Filter,
  Info,
  CheckCircle,
  AlertCircle,
  Smile,
  Frown,
  Meh
} from 'lucide-react'

interface MoodData {
  day: string
  mood: number
  energy: number
  stress: number
  sleep: number
}


export default function AnalyticsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'energy' | 'stress' | 'sleep'>('mood')

  // Wireframe pages 21-22 exact data structure
  const weeklyData: MoodData[] = [
    { day: '月', mood: 75, energy: 80, stress: 40, sleep: 85 },
    { day: '火', mood: 80, energy: 75, stress: 35, sleep: 80 },
    { day: '水', mood: 85, energy: 90, stress: 30, sleep: 90 },
    { day: '木', mood: 90, energy: 85, stress: 25, sleep: 85 },
    { day: '金', mood: 78, energy: 70, stress: 50, sleep: 75 },
    { day: '土', mood: 82, energy: 85, stress: 20, sleep: 95 },
    { day: '日', mood: 88, energy: 90, stress: 15, sleep: 90 }
  ]

  // Monthly emotion progress data from wireframe page 22
  const monthlyProgressData = [
    { week: '第1週', percentage: 65 },
    { week: '第2週', percentage: 70 },
    { week: '第3週', percentage: 72 },
    { week: '第4週', percentage: 75 },
    { week: '第5週', percentage: 78 }
  ]



  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header - exact wireframe */}
      <div className="p-4">
        <h1 className="text-white text-xl font-semibold tracking-wide mb-4">分析・統計レポート</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Period selector */}
        <div className="flex space-x-2">
          {[
            {key: 'week', label: '1週間'}, 
            {key: 'month', label: '1ヶ月'}, 
            {key: 'year', label: '1年'}
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[48px] touch-manipulation ${
                selectedPeriod === period.key
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-gray-700/90 text-gray-300 hover:bg-gray-600/90 border border-gray-600/30'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Summary Stats - exact wireframe matching */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">7日</div>
              <div className="text-sm text-gray-400 font-medium">総セッション数</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">21h</div>
              <div className="text-sm text-gray-400 font-medium">総利用時間</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">15日</div>
              <div className="text-sm text-gray-400 font-medium">継続日数記録</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">82%</div>
              <div className="text-sm text-gray-400 font-medium">平均気分スコア</div>
            </div>
          </motion.div>
        </div>

        {/* Weekly Trend - exact wireframe */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">週間トレンド</h3>
          <h4 className="text-white font-medium">気分スコア</h4>
        </div>

        {/* Chart - exact wireframe layout */}
        <div className="space-y-3">
          {weeklyData.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <span className="text-white text-sm font-medium w-6">{day.day}</span>
              <div className="flex-1 bg-gray-600/70 rounded-full h-3">
                <div 
                  className="bg-gray-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${day.mood}%` }}
                />
              </div>
              <span className="text-white text-sm font-semibold w-10 text-right">{day.mood}%</span>
            </motion.div>
          ))}
        </div>


        {/* Weekly reflection - exact wireframe */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">今週の振り返り</h3>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30"
          >
            <p className="text-gray-300 text-sm leading-relaxed">
              今週は安定した気持ちで過ごせていますね。特に金曜日の満足度が高く、週末に向けて良い流れができています。
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30"
          >
            <h4 className="text-white font-semibold mb-2">気分の向上</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              先週と比べて平均気分スコアが12%向上しています
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30"
          >
            <h4 className="text-white font-semibold mb-2">継続力アップ</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              7日連続でセッションを完了！素晴らしい継続力です！
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30"
          >
            <h4 className="text-white font-semibold mb-2">週間目標達成</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              今週の目標時間180分を20分オーバーで達成！
            </p>
          </motion.div>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-24"></div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}