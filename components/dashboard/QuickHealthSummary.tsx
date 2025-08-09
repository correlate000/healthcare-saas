'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Activity, 
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap
} from 'lucide-react'

interface HealthStatus {
  overall: 'excellent' | 'good' | 'fair' | 'poor'
  score: number
  todayEntries: number
  lastEntry?: string
  streakDays: number
  weeklyGoalProgress: number
}

interface QuickAction {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  action: () => void
}

interface QuickHealthSummaryProps {
  status: HealthStatus
  quickActions: QuickAction[]
  userName?: string
  onViewDetails?: () => void
}

export function QuickHealthSummary({ 
  status, 
  quickActions, 
  userName = 'ユーザー',
  onViewDetails 
}: QuickHealthSummaryProps) {
  const getStatusColor = (overall: string) => {
    switch (overall) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusLabel = (overall: string) => {
    switch (overall) {
      case 'excellent': return '優秀'
      case 'good': return '良好'
      case 'fair': return '普通'
      case 'poor': return '要改善'
      default: return '未評価'
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'おはようございます'
    if (hour < 18) return 'こんにちは'
    return 'こんばんは'
  }

  return (
    <Card className="bg-gradient-to-br from-gray-700/95 to-gray-800/95 border-gray-600/30">
      <CardContent className="p-6">
        {/* Header with greeting */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">
              {getGreeting()}、{userName}さん
            </h2>
            <p className="text-gray-300 text-sm">
              今日の健康状況をチェックしましょう
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            className="text-2xl"
          >
            👋
          </motion.div>
        </div>

        {/* Health Score Circle */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-600"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - status.score / 100)}`}
                className={getStatusColor(status.overall)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-white">{status.score}</span>
              <span className="text-xs text-gray-300">健康スコア</span>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="text-center mb-6">
          <div className={`text-lg font-semibold mb-2 ${getStatusColor(status.overall)}`}>
            {getStatusLabel(status.overall)}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-white text-lg font-bold">{status.todayEntries}</div>
              <div className="text-gray-400 text-xs">今日の記録</div>
            </div>
            <div>
              <div className="text-white text-lg font-bold">{status.streakDays}</div>
              <div className="text-gray-400 text-xs">連続記録</div>
            </div>
            <div>
              <div className="text-white text-lg font-bold">{status.weeklyGoalProgress}%</div>
              <div className="text-gray-400 text-xs">週間目標</div>
            </div>
          </div>
        </div>

        {/* Last Entry Info */}
        {status.lastEntry && (
          <div className="bg-gray-600/30 rounded-lg p-3 mb-6">
            <div className="flex items-center text-sm text-gray-300">
              <Clock className="h-4 w-4 mr-2" />
              最後の記録: {new Date(status.lastEntry).toLocaleString('ja-JP')}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-sm">クイックアクション</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.action}
                className={`flex items-center space-x-2 p-3 rounded-lg border border-gray-600/50 hover:border-gray-500 transition-all duration-200 ${action.color}`}
              >
                <div className="text-white">{action.icon}</div>
                <span className="text-white text-sm font-medium">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* View Details Button */}
        <Button
          onClick={onViewDetails}
          variant="outline"
          className="w-full mt-6 border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white"
        >
          詳細な分析を表示
          <TrendingUp className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}

// サンプルデータジェネレーター
export function generateSampleHealthStatus(): HealthStatus {
  return {
    overall: 'good',
    score: 78,
    todayEntries: 3,
    lastEntry: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    streakDays: 7,
    weeklyGoalProgress: 85
  }
}

export function generateSampleQuickActions(router: any): QuickAction[] {
  return [
    {
      id: 'add_symptom',
      title: '症状記録',
      icon: <Plus className="h-4 w-4" />,
      color: 'bg-blue-600/20 hover:bg-blue-600/30',
      action: () => router.push('/checkin')
    },
    {
      id: 'add_vitals',
      title: 'バイタル記録',
      icon: <Heart className="h-4 w-4" />,
      color: 'bg-red-600/20 hover:bg-red-600/30',
      action: () => router.push('/checkin')
    },
    {
      id: 'view_analytics',
      title: '分析表示',
      icon: <Activity className="h-4 w-4" />,
      color: 'bg-green-600/20 hover:bg-green-600/30',
      action: () => router.push('/analytics')
    },
    {
      id: 'set_goal',
      title: '目標設定',
      icon: <Target className="h-4 w-4" />,
      color: 'bg-purple-600/20 hover:bg-purple-600/30',
      action: () => {
        // TODO: goals page needs to be implemented
        alert('目標設定機能は準備中です')
      }
    }
  ]
}