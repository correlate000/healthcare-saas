'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { AppLayout } from '@/src/components/layout/AppLayout'
import { Badge } from '@/src/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock,
  Heart,
  Brain,
  Moon,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  Activity
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock trend data
const trendData = {
  mood: {
    data: [6.5, 7.2, 6.8, 7.5, 7.8, 8.1, 7.9],
    labels: ['月', '火', '水', '木', '金', '土', '日'],
    average: 7.4,
    trend: 'up' as const,
    change: 12
  },
  stress: {
    data: [4.2, 3.8, 4.1, 3.5, 3.2, 2.9, 3.1],
    labels: ['月', '火', '水', '木', '金', '土', '日'],
    average: 3.5,
    trend: 'down' as const,
    change: -26
  },
  sleep: {
    data: [7.5, 8.0, 7.8, 8.2, 8.5, 8.1, 8.3],
    labels: ['月', '火', '水', '木', '金', '土', '日'],
    average: 8.1,
    trend: 'up' as const,
    change: 11
  }
}

const patterns = [
  {
    id: 1,
    title: '平日のストレス傾向',
    description: '火曜日と木曜日にストレスレベルが高くなる傾向があります',
    insights: ['会議が多い日', 'タスクの期限が重なる'],
    recommendation: '火曜・木曜は余裕のあるスケジュールを組む',
    strength: 'strong'
  },
  {
    id: 2,
    title: '週末の回復パターン',
    description: '土日にかけて気分と睡眠の質が改善しています',
    insights: ['週末のリラックス効果', '十分な休息時間'],
    recommendation: '平日にも同じようなリラックス時間を設ける',
    strength: 'medium'
  },
  {
    id: 3,
    title: '睡眠の質向上',
    description: '今週は全体的に睡眠の質が向上しています',
    insights: ['就寝時間の規則化', '夜のスクリーンタイム削減'],
    recommendation: '現在の睡眠習慣を継続する',
    strength: 'strong'
  }
]

const correlations = [
  {
    id: 1,
    factor1: 'ストレス',
    factor2: '睡眠の質',
    correlation: -0.73,
    description: 'ストレスが高い日は睡眠の質が低下する傾向'
  },
  {
    id: 2,
    factor1: '運動',
    factor2: '気分',
    correlation: 0.68,
    description: '運動をした日は気分が向上する傾向'
  },
  {
    id: 3,
    factor1: 'チーム交流',
    factor2: '仕事満足度',
    correlation: 0.55,
    description: 'チーム内コミュニケーションが多い日は満足度が高い'
  }
]

export default function AnalyticsTrends() {
  const router = useRouter()
  const [selectedMetric, setSelectedMetric] = useState('mood')
  const [viewType, setViewType] = useState('week')

  const metrics = [
    { id: 'mood', label: '気分', icon: Heart, color: 'text-pink-500' },
    { id: 'stress', label: 'ストレス', icon: Brain, color: 'text-purple-500' },
    { id: 'sleep', label: '睡眠', icon: Moon, color: 'text-indigo-500' }
  ]

  const viewTypes = [
    { id: 'week', label: '週間' },
    { id: 'month', label: '月間' },
    { id: 'quarter', label: '四半期' }
  ]

  const currentData = trendData[selectedMetric as keyof typeof trendData]

  return (
    <AppLayout title="トレンド分析" showBackButton>
      <div className="px-4 py-6 space-y-6">
        
        {/* Metric Selector */}
        <div className="flex space-x-2">
          {metrics.map((metric) => (
            <Button
              key={metric.id}
              variant={selectedMetric === metric.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(metric.id)}
              className="flex-1"
            >
              <metric.icon className={`h-4 w-4 mr-2 ${metric.color}`} />
              {metric.label}
            </Button>
          ))}
        </div>

        {/* Time Period Selector */}
        <div className="flex space-x-2">
          {viewTypes.map((type) => (
            <Button
              key={type.id}
              variant={viewType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType(type.id)}
              className="flex-1"
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Trend Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{metrics.find(m => m.id === selectedMetric)?.label}のトレンド</span>
              <div className="flex items-center space-x-2">
                {currentData.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={currentData.trend === 'up' ? 'default' : 'destructive'}>
                  {currentData.change > 0 ? '+' : ''}{currentData.change}%
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Simulated chart area */}
            <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center space-y-2">
                <LineChart className="h-12 w-12 text-blue-400 mx-auto" />
                <p className="text-sm text-gray-600">
                  {currentData.labels.join(' → ')}
                </p>
                <p className="text-xs text-gray-500">
                  平均値: {currentData.average}
                </p>
              </div>
            </div>
            
            {/* Data Points */}
            <div className="grid grid-cols-7 gap-2">
              {currentData.data.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {currentData.labels[index]}
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pattern Recognition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <span>パターン分析</span>
            </CardTitle>
            <CardDescription>
              データから発見されたパターンと傾向
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {patterns.map((pattern) => (
              <div
                key={pattern.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{pattern.title}</h4>
                  <Badge variant={pattern.strength === 'strong' ? 'default' : 'secondary'}>
                    {pattern.strength === 'strong' ? '強い' : '中程度'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{pattern.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">関連要因:</p>
                    <div className="flex flex-wrap gap-1">
                      {pattern.insights.map((insight, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <p className="text-xs font-medium text-blue-800 mb-1">推奨アクション:</p>
                    <p className="text-xs text-blue-700">{pattern.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Correlations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <span>相関分析</span>
            </CardTitle>
            <CardDescription>
              異なる要因間の関係性
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {correlations.map((corr) => (
              <div key={corr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">{corr.factor1}</span>
                    <span className="text-xs text-gray-500">↔</span>
                    <span className="text-sm font-medium">{corr.factor2}</span>
                  </div>
                  <p className="text-xs text-gray-600">{corr.description}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    Math.abs(corr.correlation) > 0.6 
                      ? corr.correlation > 0 ? 'text-green-600' : 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.abs(corr.correlation) > 0.6 ? '強い' : '中程度'}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/analytics/insights')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <PieChart className="h-5 w-5" />
            <span className="text-xs">インサイト</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/analytics/reports')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">レポート</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}