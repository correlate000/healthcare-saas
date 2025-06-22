'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/layout/AppLayout'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Flame, 
  Calendar, 
  Trophy, 
  Target,
  TrendingUp,
  Award,
  Star,
  Zap,
  Clock,
  CheckCircle,
  Gift
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock streak data
const streakData = {
  current: 12,
  longest: 28,
  total: 147,
  weekStreak: 5,
  monthStreak: 2,
  streakHistory: [
    { week: '6/10-6/16', streak: 7, completed: true },
    { week: '6/3-6/9', streak: 6, completed: true },
    { week: '5/27-6/2', streak: 4, completed: false },
    { week: '5/20-5/26', streak: 7, completed: true },
    { week: '5/13-5/19', streak: 5, completed: false }
  ]
}

const streakMilestones = [
  { days: 7, title: '1週間チャレンジ', reward: 'ブロンズバッジ', unlocked: true },
  { days: 14, title: '2週間継続', reward: 'シルバーバッジ', unlocked: false, progress: 86 },
  { days: 30, title: '1ヶ月マスター', reward: 'ゴールドバッジ', unlocked: false, progress: 40 },
  { days: 60, title: '2ヶ月の達人', reward: 'プラチナバッジ', unlocked: false, progress: 20 },
  { days: 100, title: '100日の伝説', reward: 'ダイヤモンドバッジ', unlocked: false, progress: 12 }
]

const dailyProgress = [
  { day: '月', completed: true, type: 'checkin' },
  { day: '火', completed: true, type: 'exercise' },
  { day: '水', completed: true, type: 'mindfulness' },
  { day: '木', completed: true, type: 'checkin' },
  { day: '金', completed: true, type: 'gratitude' },
  { day: '土', completed: false, type: 'exercise' },
  { day: '日', completed: false, type: 'mindfulness' }
]

const streakBenefits = [
  {
    icon: Trophy,
    title: 'XPボーナス',
    description: 'ストリーク中は獲得XPが25%アップ',
    active: true
  },
  {
    icon: Gift,
    title: '限定報酬',
    description: '継続日数に応じて特別なアイテムを獲得',
    active: true
  },
  {
    icon: Star,
    title: 'プレミアム機能',
    description: '長期継続でプレミアム機能の一部が無料で利用可能',
    active: false
  }
]

export default function DailyChallengeStreak() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('current')

  const periods = [
    { id: 'current', label: '現在' },
    { id: 'history', label: '履歴' },
    { id: 'milestones', label: 'マイルストーン' }
  ]

  return (
    <AppLayout title="ストリーク記録" showBackButton>
      <div className="px-4 py-6 space-y-6">
        
        {/* Current Streak Display */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <h2 className="text-3xl font-bold text-orange-600">
                  {streakData.current}日
                </h2>
                <p className="text-sm text-orange-700">現在のストリーク</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {streakData.longest}
                </div>
                <div className="text-xs text-gray-600">最長記録</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {streakData.total}
                </div>
                <div className="text-xs text-gray-600">総完了日数</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {streakData.weekStreak}
                </div>
                <div className="text-xs text-gray-600">今週の記録</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Period Selector */}
        <div className="flex space-x-2">
          {periods.map((period) => (
            <Button
              key={period.id}
              variant={selectedPeriod === period.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.id)}
              className="flex-1"
            >
              {period.label}
            </Button>
          ))}
        </div>

        {/* Current Week Progress */}
        {selectedPeriod === 'current' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>今週の進捗</span>
                </CardTitle>
                <CardDescription>
                  今週は{dailyProgress.filter(d => d.completed).length}/7日完了
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {dailyProgress.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        day.completed 
                          ? 'bg-green-100 border-green-500' 
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        {day.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="text-xs mt-1 text-gray-600">
                        {day.type === 'checkin' ? 'チェック' :
                         day.type === 'exercise' ? '運動' :
                         day.type === 'mindfulness' ? '瞑想' : '感謝'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Streak Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>ストリーク特典</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {streakBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      benefit.active ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <benefit.icon className={`h-5 w-5 ${
                        benefit.active ? 'text-green-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                    <Badge variant={benefit.active ? "default" : "secondary"}>
                      {benefit.active ? '有効' : '未達成'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Streak History */}
        {selectedPeriod === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span>ストリーク履歴</span>
              </CardTitle>
              <CardDescription>
                過去の週別ストリーク記録
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {streakData.streakHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      record.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {record.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Target className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{record.week}</h4>
                      <p className="text-sm text-gray-600">
                        {record.streak}日連続 {record.completed ? '完走' : '未完'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={record.completed ? "default" : "secondary"}>
                    {record.streak}日
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Milestone Progress */}
        {selectedPeriod === 'milestones' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>マイルストーン</span>
              </CardTitle>
              <CardDescription>
                ストリーク継続で獲得できる報酬
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {streakMilestones.map((milestone, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        milestone.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {milestone.unlocked ? (
                          <Trophy className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <Target className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">{milestone.days}日達成</p>
                      </div>
                    </div>
                    <Badge variant={milestone.unlocked ? "default" : "outline"}>
                      {milestone.reward}
                    </Badge>
                  </div>
                  
                  {!milestone.unlocked && milestone.progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">進捗</span>
                        <span className="text-sm text-gray-600">{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push('/daily-challenge')}
            className="h-16 flex flex-col items-center justify-center space-y-1 bg-orange-500 hover:bg-orange-600"
          >
            <Flame className="h-5 w-5" />
            <span className="text-xs">今日のチャレンジ</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/daily-challenge/leaderboard')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs">リーダーボード</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}