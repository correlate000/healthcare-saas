'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { AppLayout } from '@/src/components/layout/AppLayout'
import { Badge } from '@/src/components/ui/badge'
import { Progress } from '@/src/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Heart, 
  Brain, 
  Zap, 
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock insights data
const insights = {
  moodTrends: {
    current: 7.2,
    previous: 6.8,
    change: 0.4,
    trend: 'up' as const
  },
  stressLevels: {
    current: 3.1,
    previous: 3.8,
    change: -0.7,
    trend: 'down' as const
  },
  sleepQuality: {
    current: 8.1,
    previous: 7.9,
    change: 0.2,
    trend: 'up' as const
  },
  socialConnections: {
    current: 6.5,
    previous: 6.2,
    change: 0.3,
    trend: 'up' as const
  }
}

const personalizedInsights = [
  {
    id: 1,
    type: 'positive',
    icon: CheckCircle,
    title: 'ストレス管理が改善',
    description: '先週と比べて、ストレスレベルが22%改善しています。深呼吸の練習が効果的だったようです。',
    action: '引き続き呼吸法を実践',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 2,
    type: 'warning',
    icon: AlertCircle,
    title: '睡眠パターンの変化',
    description: '過去3日間、就寝時間が1時間遅くなっています。睡眠の質に影響する可能性があります。',
    action: '睡眠スケジュールを見直す',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  {
    id: 3,
    type: 'info',
    icon: Info,
    title: 'チーム交流の増加',
    description: 'チーム内での交流が増え、社会的つながりが向上しています。',
    action: 'この調子で継続',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  }
]

const weeklyGoals = [
  { id: 1, title: 'ストレス軽減', progress: 78, target: 100 },
  { id: 2, title: '睡眠改善', progress: 65, target: 100 },
  { id: 3, title: '運動習慣', progress: 45, target: 100 },
  { id: 4, title: 'マインドフルネス', progress: 89, target: 100 }
]

export default function AnalyticsInsights() {
  const router = useRouter()
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  const timeframes = [
    { id: 'week', label: '1週間' },
    { id: 'month', label: '1ヶ月' },
    { id: 'quarter', label: '3ヶ月' }
  ]

  return (
    <AppLayout title="インサイト" showBackButton>
      <div className="px-4 py-6 space-y-6">
        
        {/* Time period selector */}
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe.id}
              variant={selectedTimeframe === timeframe.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe.id)}
              className="flex-1"
            >
              {timeframe.label}
            </Button>
          ))}
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-medium">気分</span>
              </div>
              <div className="flex items-center space-x-1">
                {insights.moodTrends.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs text-gray-500">
                  {insights.moodTrends.change > 0 ? '+' : ''}{insights.moodTrends.change}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {insights.moodTrends.current}/10
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">ストレス</span>
              </div>
              <div className="flex items-center space-x-1">
                {insights.stressLevels.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs text-gray-500">
                  {insights.stressLevels.change > 0 ? '+' : ''}{insights.stressLevels.change}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {insights.stressLevels.current}/10
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium">睡眠</span>
              </div>
              <div className="flex items-center space-x-1">
                {insights.sleepQuality.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs text-gray-500">
                  {insights.sleepQuality.change > 0 ? '+' : ''}{insights.sleepQuality.change}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {insights.sleepQuality.current}/10
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-teal-500" />
                <span className="text-sm font-medium">社会性</span>
              </div>
              <div className="flex items-center space-x-1">
                {insights.socialConnections.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs text-gray-500">
                  {insights.socialConnections.change > 0 ? '+' : ''}{insights.socialConnections.change}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {insights.socialConnections.current}/10
            </div>
          </Card>
        </div>

        {/* Personalized Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>パーソナライズされたインサイト</span>
            </CardTitle>
            <CardDescription>
              あなたのデータから見つかった重要な傾向とアドバイス
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalizedInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border-2 ${insight.bgColor} ${insight.borderColor}`}
              >
                <div className="flex items-start space-x-3">
                  <insight.icon className={`h-5 w-5 ${insight.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {insight.action}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => router.push('/analytics/trends')}
                      >
                        詳細を見る
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>今週の目標進捗</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/analytics/trends')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">トレンド分析</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/analytics/reports')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">週間レポート</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}