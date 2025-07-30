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

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  earned: boolean
  progress?: number
  total?: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'energy' | 'stress' | 'sleep'>('mood')

  const weeklyData: MoodData[] = [
    { day: '月', mood: 75, energy: 80, stress: 40, sleep: 85 },
    { day: '火', mood: 80, energy: 75, stress: 35, sleep: 80 },
    { day: '水', mood: 85, energy: 90, stress: 30, sleep: 90 },
    { day: '木', mood: 90, energy: 85, stress: 25, sleep: 85 },
    { day: '金', mood: 78, energy: 70, stress: 50, sleep: 75 },
    { day: '土', mood: 82, energy: 85, stress: 20, sleep: 95 },
    { day: '日', mood: 88, energy: 90, stress: 15, sleep: 90 }
  ]

  const achievements: Achievement[] = [
    {
      id: '7-day-streak',
      title: '7日連続記録',
      description: '1週間連続でチェックインを完了',
      icon: <Target className="w-5 h-5" />,
      earned: true
    },
    {
      id: 'mood-improvement',
      title: '気分向上マスター',
      description: '気分スコアが3日連続で向上',
      icon: <TrendingUp className="w-5 h-5" />,
      earned: true
    },
    {
      id: 'stress-management',
      title: 'ストレス管理上手',
      description: 'ストレスレベルを週平均30%以下に維持',
      icon: <Brain className="w-5 h-5" />,
      earned: false,
      progress: 25,
      total: 30
    },
    {
      id: 'early-bird',
      title: '早起きチャンピオン',
      description: '朝6時前にチェックインを5回達成',
      icon: <Clock className="w-5 h-5" />,
      earned: false,
      progress: 3,
      total: 5
    }
  ]

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'mood': return 'from-green-400 to-emerald-500'
      case 'energy': return 'from-yellow-400 to-orange-500'
      case 'stress': return 'from-red-400 to-pink-500'
      case 'sleep': return 'from-blue-400 to-indigo-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'mood': return <Heart className="w-4 h-4" />
      case 'energy': return <Zap className="w-4 h-4" />
      case 'stress': return <Activity className="w-4 h-4" />
      case 'sleep': return <Clock className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  const getCurrentData = () => {
    return weeklyData.map(day => ({
      ...day,
      value: day[selectedMetric]
    }))
  }

  const getAverageScore = () => {
    const values = weeklyData.map(day => day[selectedMetric])
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
  }

  const getTrend = () => {
    const values = weeklyData.map(day => day[selectedMetric])
    const firstHalf = values.slice(0, Math.ceil(values.length / 2))
    const secondHalf = values.slice(Math.ceil(values.length / 2))
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length
    
    if (selectedMetric === 'stress') {
      return secondAvg < firstAvg ? 'up' : secondAvg > firstAvg ? 'down' : 'stable'
    } else {
      return secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable'
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl font-semibold tracking-wide">分析レポート</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-24 space-y-6">
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

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">7</div>
                <div className="text-sm text-gray-400 font-medium">セッション</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">21h</div>
                <div className="text-sm text-gray-400 font-medium">総時間</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Target className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">15</div>
                <div className="text-sm text-gray-400 font-medium">連続日数</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Heart className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">82%</div>
                <div className="text-sm text-gray-400 font-medium">平均スコア</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Metric Selector */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg tracking-wide">詳細トレンド</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'mood', label: '気分', icon: <Heart className="w-4 h-4" /> },
              { key: 'energy', label: 'エネルギー', icon: <Zap className="w-4 h-4" /> },
              { key: 'stress', label: 'ストレス', icon: <Activity className="w-4 h-4" /> },
              { key: 'sleep', label: '睡眠', icon: <Clock className="w-4 h-4" /> }
            ].map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key as any)}
                className={`p-3 rounded-xl border transition-all duration-200 touch-manipulation ${
                  selectedMetric === metric.key
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                    : 'bg-gray-700/90 border-gray-600/30 text-gray-300 hover:border-gray-500/50'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  {getMetricIcon(metric.key)}
                  <span className="text-xs font-medium">{metric.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-600/70 rounded-lg">
                {getMetricIcon(selectedMetric)}
              </div>
              <div>
                <h4 className="text-white font-semibold capitalize">
                  {selectedMetric === 'mood' ? '気分' : 
                   selectedMetric === 'energy' ? 'エネルギー' : 
                   selectedMetric === 'stress' ? 'ストレス' : '睡眠'}スコア
                </h4>
                <p className="text-gray-400 text-sm">平均: {getAverageScore()}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {getTrend() === 'up' && <TrendingUp className="w-5 h-5 text-green-400" />}
              {getTrend() === 'down' && <TrendingDown className="w-5 h-5 text-red-400" />}
              {getTrend() === 'stable' && <Activity className="w-5 h-5 text-gray-400" />}
              <span className={`text-sm font-medium ${
                getTrend() === 'up' ? 'text-green-400' : 
                getTrend() === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {getTrend() === 'up' ? '改善中' : getTrend() === 'down' ? '要注意' : '安定'}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {getCurrentData().map((day, index) => (
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
                    className={`bg-gradient-to-r ${getMetricColor(selectedMetric)} h-3 rounded-full transition-all duration-1000`}
                    style={{ width: `${day.value}%` }}
                  />
                </div>
                <span className="text-white text-sm font-semibold w-10 text-right">{day.value}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg tracking-wide">実績とバッジ</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-700/95 rounded-2xl p-5 border transition-all duration-200 ${
                  achievement.earned 
                    ? 'border-emerald-400/30 bg-emerald-500/5' 
                    : 'border-gray-600/30'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    achievement.earned 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-gray-600/70 text-gray-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-white font-semibold">{achievement.title}</h4>
                      {achievement.earned && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          獲得済み
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">
                      {achievement.description}
                    </p>
                    {!achievement.earned && achievement.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-xs">進捗</span>
                          <span className="text-white text-xs font-medium">
                            {achievement.progress}/{achievement.total}
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress! / achievement.total!) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg tracking-wide">今週の振り返り</h3>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-5"
          >
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <h4 className="text-emerald-400 font-semibold mb-2">素晴らしい成長</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  今週は安定した記録ができています。特に木曜日の気分スコアが高く、週末に向けて良い調子を維持できていますね。
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-5"
          >
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">改善ポイント</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  先週と比べて平均気分スコアが12%向上しています。継続的な記録が良い結果につながっています。
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-orange-500/10 border border-orange-400/30 rounded-2xl p-5"
          >
            <div className="flex items-start space-x-3">
              <Award className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h4 className="text-orange-400 font-semibold mb-2">継続力アップ</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  7日連続でセッションを完了！素晴らしい継続力です。今週の目標時間もクリアしました。
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}