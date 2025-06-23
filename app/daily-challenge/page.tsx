'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle, 
  Clock, 
  Star, 
  Zap, 
  Heart, 
  Brain,
  Trophy,
  Target,
  Gift,
  Sparkles,
  Calendar,
  TrendingUp,
  Users,
  Coffee,
  Smile,
  BookOpen,
  MessageSquare,
  Award
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'checkin' | 'reflection' | 'gratitude' | 'goal' | 'mindfulness' | 'social'
  xp: number
  icon: React.ReactNode
  estimatedTime: string
  completed: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  characterSuggestion?: string
}

export default function DailyChallenge() {
  const [currentStreak, setCurrentStreak] = useState(7)
  const [todayXP, setTodayXP] = useState(150)
  const [totalXP, setTotalXP] = useState(2840)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])

  const challenges: Challenge[] = [
    {
      id: 'morning-check',
      title: '朝の気分チェック',
      description: '今日の気分を3つの絵文字で表現してみましょう',
      type: 'checkin',
      xp: 20,
      icon: <Smile className="w-5 h-5" />,
      estimatedTime: '1分',
      completed: false,
      difficulty: 'easy',
      characterSuggestion: 'Luna が一緒に気分を整理してくれます'
    },
    {
      id: 'work-reflection',
      title: '仕事の振り返り',
      description: '今日の仕事で感じたことを素直に書いてみましょう',
      type: 'reflection',
      xp: 30,
      icon: <Brain className="w-5 h-5" />,
      estimatedTime: '3分',
      completed: false,
      difficulty: 'medium',
      characterSuggestion: 'Zen と一緒に深く考えてみませんか'
    },
    {
      id: 'gratitude-note',
      title: '感謝の記録',
      description: '今日感謝したい小さなことを3つ見つけてみましょう',
      type: 'gratitude',
      xp: 25,
      icon: <Heart className="w-5 h-5" />,
      estimatedTime: '2分',
      completed: false,
      difficulty: 'easy',
      characterSuggestion: 'Aria と一緒にポジティブな発見をしましょう'
    },
    {
      id: 'stress-check',
      title: 'ストレスレベル確認',
      description: '今感じているストレスを数値で表現してみましょう',
      type: 'checkin',
      xp: 20,
      icon: <Target className="w-5 h-5" />,
      estimatedTime: '1分',
      completed: false,
      difficulty: 'easy'
    },
    {
      id: 'team-feeling',
      title: 'チームとの関係性',
      description: '今日のチームワークについて振り返ってみましょう',
      type: 'social',
      xp: 35,
      icon: <Users className="w-5 h-5" />,
      estimatedTime: '4分',
      completed: false,
      difficulty: 'medium'
    },
    {
      id: 'mindful-moment',
      title: '3分間の深呼吸',
      description: 'ガイド付きで3分間のマインドフルネスを体験しましょう',
      type: 'mindfulness',
      xp: 40,
      icon: <Sparkles className="w-5 h-5" />,
      estimatedTime: '3分',
      completed: false,
      difficulty: 'easy'
    },
    {
      id: 'tomorrow-goal',
      title: '明日の小さな目標',
      description: '明日達成したい小さな目標を1つ設定しましょう',
      type: 'goal',
      xp: 30,
      icon: <TrendingUp className="w-5 h-5" />,
      estimatedTime: '2分',
      completed: false,
      difficulty: 'medium'
    }
  ]

  const getChallengeTypeColor = (type: Challenge['type']) => {
    switch (type) {
      case 'checkin': return 'bg-blue-500'
      case 'reflection': return 'bg-purple-500'
      case 'gratitude': return 'bg-pink-500'
      case 'goal': return 'bg-green-500'
      case 'mindfulness': return 'bg-indigo-500'
      case 'social': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getDifficultyBadge = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return <Badge variant="secondary" className="text-green-600 bg-green-50">簡単</Badge>
      case 'medium': return <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">普通</Badge>
      case 'hard': return <Badge variant="secondary" className="text-red-600 bg-red-50">難しい</Badge>
    }
  }

  const completeChallenge = (challengeId: string) => {
    setCompletedChallenges([...completedChallenges, challengeId])
    const challenge = challenges.find(c => c.id === challengeId)
    if (challenge) {
      setTodayXP(todayXP + challenge.xp)
      setTotalXP(totalXP + challenge.xp)
    }
    setSelectedChallenge(null)
  }

  const availableChallenges = challenges.filter(c => !completedChallenges.includes(c.id))
  const completedToday = completedChallenges.length
  const totalChallenges = challenges.length

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">デイリーチャレンジ</h1>
              <p className="text-blue-100">毎日の小さな積み重ねで心の健康を</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{currentStreak}</div>
              <div className="text-sm text-blue-100">日連続</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold">{todayXP}</div>
              <div className="text-sm text-blue-100">今日のXP</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{totalXP}</div>
              <div className="text-sm text-blue-100">総XP</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{completedToday}/{totalChallenges}</div>
              <div className="text-sm text-blue-100">完了</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">今日の進捗</span>
              <span className="text-sm">{Math.round((completedToday / totalChallenges) * 100)}%</span>
            </div>
            <Progress 
              value={(completedToday / totalChallenges) * 100} 
              className="h-2 bg-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Today's Challenges */}
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">今日のチャレンジ</h2>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
          </Badge>
        </div>

        {availableChallenges.length === 0 ? (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-lg font-bold text-green-700 mb-2">
                今日のチャレンジ完了！
              </h3>
              <p className="text-green-600 mb-4">
                素晴らしいですね！明日も新しいチャレンジが待っています。
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-700">+{todayXP}</div>
                  <div className="text-sm text-green-600">XP獲得</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-700">{currentStreak}</div>
                  <div className="text-sm text-green-600">日連続</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {availableChallenges.map((challenge) => (
              <Card 
                key={challenge.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
                style={{ borderLeftColor: getChallengeTypeColor(challenge.type).replace('bg-', '') }}
                onClick={() => setSelectedChallenge(challenge)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${getChallengeTypeColor(challenge.type)} text-white flex-shrink-0`}>
                        {challenge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{challenge.title}</h3>
                          {getDifficultyBadge(challenge.difficulty)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {challenge.estimatedTime}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {challenge.xp} XP
                          </div>
                        </div>
                        {challenge.characterSuggestion && (
                          <p className="text-xs text-blue-600 mt-2">
                            💡 {challenge.characterSuggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <div className="mt-8">
            <h3 className="text-md font-bold text-gray-700 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              完了したチャレンジ
            </h3>
            <div className="space-y-2">
              {challenges
                .filter(c => completedChallenges.includes(c.id))
                .map((challenge) => (
                  <div key={challenge.id} className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm text-green-700 flex-1">{challenge.title}</span>
                    <Badge variant="secondary" className="text-green-600 bg-green-100">
                      +{challenge.xp} XP
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Streak Bonus */}
        {currentStreak >= 3 && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🔥</div>
                <div className="flex-1">
                  <h4 className="font-bold text-yellow-800">連続ログインボーナス！</h4>
                  <p className="text-sm text-yellow-700">
                    {currentStreak}日連続でチャレンジを達成中！素晴らしいですね！
                  </p>
                </div>
                <Badge className="bg-yellow-500 text-white">
                  ×{Math.floor(currentStreak / 7) + 1} XP
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Challenge Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${getChallengeTypeColor(selectedChallenge.type)} text-white`}>
                  {selectedChallenge.icon}
                </div>
                <div>
                  <CardTitle>{selectedChallenge.title}</CardTitle>
                  <CardDescription>
                    {selectedChallenge.estimatedTime} • {selectedChallenge.xp} XP
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{selectedChallenge.description}</p>
              
              {selectedChallenge.characterSuggestion && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 {selectedChallenge.characterSuggestion}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedChallenge(null)}
                >
                  後で
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                  onClick={() => completeChallenge(selectedChallenge.id)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  開始
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}