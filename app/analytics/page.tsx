'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/src/components/layout/AppLayout'
import { Card, CardContent } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { 
  TrendingUp, 
  Heart, 
  Brain, 
  Zap, 
  Star, 
  Calendar,
  Clock,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react'
import { motion } from 'framer-motion'
import { 
  CountUpAnimation,
  PulseHighlight 
} from '@/src/components/ui/micro-interactions'

// サンプル分析データ
const analyticsData = {
  overview: {
    totalSessions: 47,
    totalMinutes: 1247,
    currentStreak: 7,
    longestStreak: 23,
    averageMood: 7.2,
    improvementRate: 18.5
  },
  weeklyData: [
    { day: '月', mood: 6.5, minutes: 25, sessions: 3 },
    { day: '火', mood: 7.2, minutes: 32, sessions: 4 },
    { day: '水', mood: 6.8, minutes: 28, sessions: 3 },
    { day: '木', mood: 7.8, minutes: 35, sessions: 4 },
    { day: '金', mood: 8.1, minutes: 40, sessions: 5 },
    { day: '土', mood: 7.5, minutes: 30, sessions: 3 },
    { day: '日', mood: 7.9, minutes: 38, sessions: 4 }
  ],
  insights: [
    {
      type: 'positive',
      title: '気分の向上',
      description: '先週と比べて平均気分スコアが12%向上しています',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      type: 'achievement',
      title: '継続力アップ',
      description: '7日連続でセッションを完了！素晴らしい継続力です',
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      type: 'goal',
      title: '週間目標達成',
      description: '今週の目標時間180分を20分オーバーで達成',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ],
  categories: [
    { name: '瞑想', minutes: 420, sessions: 21, color: 'bg-purple-500' },
    { name: '日記', minutes: 315, sessions: 15, color: 'bg-blue-500' },
    { name: 'チャット', minutes: 280, sessions: 18, color: 'bg-green-500' },
    { name: 'エクササイズ', minutes: 232, sessions: 12, color: 'bg-orange-500' }
  ]
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [selectedPeriod])

  const maxMood = Math.max(...analyticsData.weeklyData.map(d => d.mood))
  const maxMinutes = Math.max(...analyticsData.weeklyData.map(d => d.minutes))

  return (
    <AppLayout title="分析・統計" showBackButton>
      <div className="px-4 py-6 space-y-6 max-w-md mx-auto">
        
        {/* 期間選択 */}
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="flex-1"
            >
              {period === 'week' ? '1週間' : period === 'month' ? '1ヶ月' : '1年'}
            </Button>
          ))}
        </div>

        {/* 概要統計 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                <CountUpAnimation 
                  key={animationKey}
                  from={0}
                  to={analyticsData.overview.totalSessions}
                />
              </div>
              <div className="text-sm text-blue-700">総セッション数</div>
              <Activity className="h-4 w-4 text-blue-500 mx-auto mt-1" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                <CountUpAnimation 
                  key={animationKey}
                  from={0}
                  to={Math.round(analyticsData.overview.totalMinutes / 60)}
                />h
              </div>
              <div className="text-sm text-green-700">総時間</div>
              <Clock className="h-4 w-4 text-green-500 mx-auto mt-1" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                <CountUpAnimation 
                  key={animationKey}
                  from={0}
                  to={analyticsData.overview.currentStreak}
                />
              </div>
              <div className="text-sm text-purple-700">現在の連続記録</div>
              <Zap className="h-4 w-4 text-purple-500 mx-auto mt-1" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                <CountUpAnimation 
                  key={animationKey}
                  from={0}
                  to={analyticsData.overview.averageMood * 10}
                  suffix=""
                />/10
              </div>
              <div className="text-sm text-yellow-700">平均気分スコア</div>
              <Heart className="h-4 w-4 text-yellow-500 mx-auto mt-1" />
            </CardContent>
          </Card>
        </div>

        {/* 週間トレンド */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>週間トレンド</span>
            </h3>
            
            {/* 気分グラフ */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-3">気分スコア</div>
              <div className="flex items-end justify-between h-32 bg-gray-50 rounded-lg p-3">
                {analyticsData.weeklyData.map((data, index) => (
                  <div key={data.day} className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.mood / maxMood) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className="bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-sm w-6 mb-2"
                    />
                    <div className="text-xs text-gray-600">{data.day}</div>
                    <div className="text-xs font-medium text-blue-600">{data.mood}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 時間グラフ */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">セッション時間（分）</div>
              <div className="flex items-end justify-between h-24 bg-gray-50 rounded-lg p-3">
                {analyticsData.weeklyData.map((data, index) => (
                  <div key={data.day} className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.minutes / maxMinutes) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                      className="bg-gradient-to-t from-green-400 to-green-500 rounded-t-sm w-4 mb-1"
                    />
                    <div className="text-xs font-medium text-green-600">{data.minutes}m</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* カテゴリー別分析 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              <span>カテゴリー別分析</span>
            </h3>
            
            <div className="space-y-4">
              {analyticsData.categories.map((category, index) => {
                const totalMinutes = analyticsData.categories.reduce((sum, cat) => sum + cat.minutes, 0)
                const percentage = (category.minutes / totalMinutes) * 100
                
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {category.minutes}分 ({category.sessions}回)
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* インサイト */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Brain className="h-5 w-5 text-indigo-500" />
              <span>今週のインサイト</span>
            </h3>
            
            <div className="space-y-4">
              {analyticsData.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={`p-4 rounded-lg border-2 ${insight.bgColor} border-opacity-50`}
                >
                  <div className="flex items-start space-x-3">
                    <insight.icon className={`h-6 w-6 ${insight.color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 改善提案 */}
        <PulseHighlight isActive={true} color="blue">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-blue-800 mb-2">今週の目標</h3>
              <p className="text-sm text-blue-700 mb-4">
                平均セッション時間を35分に延ばして、より深いリラクゼーションを体験してみませんか？
              </p>
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                目標を設定する
              </Button>
            </CardContent>
          </Card>
        </PulseHighlight>

        {/* 詳細レポート */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">詳細レポート</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-3" />
                月次レポートをダウンロード
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-3" />
                進捗の詳細分析を見る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}