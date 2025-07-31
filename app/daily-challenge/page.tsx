'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { motion } from 'framer-motion'
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
  Award,
  ArrowLeft
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

// Wireframe page 23 daily challenges data
const wireframeChallengeData = {
  todayMessage: '今日も自分らしく、一歩ずつ前に進んでいきましょう',
  currentStreak: 12,
  completedToday: 2,
  totalToday: 4,
  todayXP: 85,
  dailyChallenges: [
    { id: 1, title: '朝の気分チェック', category: '基本', completed: true, xp: 20, timeEstimate: '1分' },
    { id: 2, title: '今日の感謝', category: '基本', completed: true, xp: 30, timeEstimate: '2分' },
    { id: 3, title: '感情の記録', category: '基本', completed: false, xp: 40, timeEstimate: '3分' },
    { id: 4, title: '30分のマインドフルネス', category: 'チャレンジ', completed: false, xp: 50, timeEstimate: '30分' }
  ]
}

export default function DailyChallenge() {
  const router = useRouter()
  const [currentStreak, setCurrentStreak] = useState(wireframeChallengeData.currentStreak)
  const [todayXP, setTodayXP] = useState(wireframeChallengeData.todayXP)
  const [totalXP, setTotalXP] = useState(2840)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(['morning-check', 'gratitude-note'])

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
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Header - wireframe style */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-lg font-semibold">デイリーチャレンジ</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Character greeting and today's message */}
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white text-sm font-semibold tracking-wide">キャラクター</span>
          </div>
          <div className="flex-1 bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30 shadow-sm">
            <p className="text-gray-100 text-sm leading-relaxed font-medium">
              {wireframeChallengeData.todayMessage}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Today's progress */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold tracking-wide">今日の進捗</h3>
            <span className="text-emerald-400 text-sm font-bold">{wireframeChallengeData.completedToday}/{wireframeChallengeData.totalToday}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{wireframeChallengeData.todayXP}</div>
              <div className="text-xs text-gray-300 font-medium">今日のXP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{currentStreak}</div>
              <div className="text-xs text-gray-300 font-medium">連続日数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{Math.round((wireframeChallengeData.completedToday / wireframeChallengeData.totalToday) * 100)}%</div>
              <div className="text-xs text-gray-300 font-medium">達成率</div>
            </div>
          </div>

          <div className="w-full bg-gray-600/70 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(wireframeChallengeData.completedToday / wireframeChallengeData.totalToday) * 100}%` }}
            />
          </div>
        </div>

        {/* Today's challenges list */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wide">今日のチャレンジ</h3>
          
          <div className="space-y-3">
            {wireframeChallengeData.dailyChallenges.map((challenge) => (
              <motion.button 
                key={challenge.id} 
                className="w-full bg-gray-700/95 rounded-xl p-4 border border-gray-600/30 shadow-sm hover:border-gray-500/50 transition-all duration-200 text-left touch-manipulation"
                onClick={() => challenge.completed ? null : router.push('/checkin')}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white tracking-wide">{challenge.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      challenge.category === 'チャレンジ' 
                        ? 'bg-orange-600/90 text-orange-100' 
                        : 'bg-gray-600/90 text-gray-200'
                    }`}>
                      {challenge.category}
                    </span>
                    {challenge.completed && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium ${
                      challenge.completed ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {challenge.completed ? '完了' : '未完了'}
                    </span>
                    <span className="text-gray-400">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {challenge.timeEstimate}
                    </span>
                  </div>
                  <span className="text-yellow-400 font-semibold">+{challenge.xp} XP</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Achievement celebration */}
        {wireframeChallengeData.completedToday >= 2 && (
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-5">
            <div className="flex items-start space-x-3">
              <Trophy className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <h4 className="text-emerald-400 font-semibold mb-2">順調なスタート！</h4>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  今日は{wireframeChallengeData.completedToday}個のチャレンジを達成しました。この調子で残りも頒張りましょう！
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Weekly streak info */}
        <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold tracking-wide">週間継続ストリーク</h4>
            <span className="text-orange-400 text-sm font-bold">{currentStreak}日</span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 rounded-full ${
                  i < 5 ? 'bg-emerald-400' : 'bg-gray-600'
                } flex items-center justify-center`}
              >
                {i < 5 && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
            ))}
          </div>
          <p className="text-gray-300 text-xs">今週は5日間チャレンジを達成しました！</p>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-24"></div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}