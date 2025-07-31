'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Battery, 
  Moon, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  MessageCircle,
  ArrowRight
} from 'lucide-react'

interface CheckinData {
  date: string
  mood: string
  bodyFeeling: string
  sleep: string
  energy: string
  stress: string
}

const moodLabels: { [key: string]: string } = {
  'great': '素晴らしい',
  'good': 'いい感じ',
  'normal': '普通',
  'tired': '疲れた',
  'bad': 'つらい'
}

const sleepLabels: { [key: string]: string } = {
  'excellent': 'とてもよく眠れた',
  'good': 'よく眠れた',
  'normal': '普通',
  'poor': 'あまり眠れなかった',
  'very-poor': '全然眠れなかった'
}

const energyLabels: { [key: string]: string } = {
  'very-high': 'エネルギッシュ',
  'high': '元気',
  'normal': '普通',
  'low': '少し疲れている',
  'very-low': 'とても疲れている'
}

const stressLabels: { [key: string]: string } = {
  'none': '全くない',
  'low': '少し',
  'medium': '普通',
  'high': '多い',
  'very-high': 'とても多い'
}

export default function CheckinResults() {
  const router = useRouter()
  const [checkinData, setCheckinData] = useState<CheckinData | null>(null)

  useEffect(() => {
    // Get the latest checkin data
    if (typeof window !== 'undefined') {
      const checkins = JSON.parse(localStorage.getItem('mindcare-checkins') || '[]')
      if (checkins.length > 0) {
        setCheckinData(checkins[checkins.length - 1])
      }
    }
  }, [])

  const getScoreFromOption = (option: string, type: string): number => {
    const scoreMap: { [key: string]: { [key: string]: number } } = {
      mood: { 'great': 100, 'good': 80, 'normal': 60, 'tired': 40, 'bad': 20 },
      bodyFeeling: { 'great': 100, 'good': 80, 'normal': 60, 'tired': 40, 'bad': 20 },
      sleep: { 'excellent': 100, 'good': 80, 'normal': 60, 'poor': 40, 'very-poor': 20 },
      energy: { 'very-high': 100, 'high': 80, 'normal': 60, 'low': 40, 'very-low': 20 },
      stress: { 'none': 100, 'low': 80, 'medium': 60, 'high': 40, 'very-high': 20 }
    }
    return scoreMap[type]?.[option] || 60
  }

  const getOverallScore = (): number => {
    if (!checkinData) return 0
    const moodScore = getScoreFromOption(checkinData.mood, 'mood')
    const bodyScore = getScoreFromOption(checkinData.bodyFeeling, 'bodyFeeling')
    const sleepScore = getScoreFromOption(checkinData.sleep, 'sleep')
    const energyScore = getScoreFromOption(checkinData.energy, 'energy')
    const stressScore = getScoreFromOption(checkinData.stress, 'stress')
    
    return Math.round((moodScore + bodyScore + sleepScore + energyScore + stressScore) / 5)
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreMessage = (score: number): string => {
    if (score >= 80) return '今日は調子が良いようですね！'
    if (score >= 60) return '普通の調子です。バランスを保ちましょう。'
    return '少し心配な状態です。セルフケアを心がけましょう。'
  }

  if (!checkinData) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p>チェックインデータが見つかりません</p>
          <Button 
            onClick={() => router.push('/checkin')}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600"
          >
            チェックインを開始
          </Button>
        </div>
      </div>
    )
  }

  const overallScore = getOverallScore()

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-xl font-semibold text-center mb-2">チェックイン結果</h1>
        <p className="text-gray-400 text-sm text-center">今日のあなたの状態を分析しました</p>
      </div>

      {/* Character Response */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start space-x-4 bg-gray-700/50 rounded-2xl p-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">キャラ</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium mb-2">
              {getScoreMessage(overallScore)}
            </p>
            <p className="text-gray-300 text-xs">
              チェックインお疲れさまでした。毎日続けることで、より詳しい分析ができるようになります。
            </p>
          </div>
        </div>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-gray-700/50 rounded-2xl p-6 text-center">
          <h3 className="text-white font-semibold mb-4">総合スコア</h3>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
            {overallScore}
          </div>
          <Progress value={overallScore} className="w-full mb-3" />
          <p className="text-gray-300 text-sm">
            {overallScore >= 80 ? '素晴らしい状態です' : 
             overallScore >= 60 ? '良好な状態です' : 
             '改善の余地があります'}
          </p>
        </div>
      </motion.div>

      {/* Detailed Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 space-y-3"
      >
        <h3 className="text-white font-semibold mb-4">詳細分析</h3>
        
        {/* Mood */}
        <div className="bg-gray-700/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-white font-medium text-sm">こころの調子</p>
              <p className="text-gray-400 text-xs">{moodLabels[checkinData.mood]}</p>
            </div>
          </div>
          <div className={`text-sm font-bold ${getScoreColor(getScoreFromOption(checkinData.mood, 'mood'))}`}>
            {getScoreFromOption(checkinData.mood, 'mood')}
          </div>
        </div>

        {/* Sleep */}
        <div className="bg-gray-700/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Moon className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium text-sm">睡眠の質</p>
              <p className="text-gray-400 text-xs">{sleepLabels[checkinData.sleep]}</p>
            </div>
          </div>
          <div className={`text-sm font-bold ${getScoreColor(getScoreFromOption(checkinData.sleep, 'sleep'))}`}>
            {getScoreFromOption(checkinData.sleep, 'sleep')}
          </div>
        </div>

        {/* Energy */}
        <div className="bg-gray-700/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Battery className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium text-sm">エネルギー</p>
              <p className="text-gray-400 text-xs">{energyLabels[checkinData.energy]}</p>
            </div>
          </div>
          <div className={`text-sm font-bold ${getScoreColor(getScoreFromOption(checkinData.energy, 'energy'))}`}>
            {getScoreFromOption(checkinData.energy, 'energy')}
          </div>
        </div>

        {/* Stress */}
        <div className="bg-gray-700/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-white font-medium text-sm">ストレス</p>
              <p className="text-gray-400 text-xs">{stressLabels[checkinData.stress]}</p>
            </div>
          </div>
          <div className={`text-sm font-bold ${getScoreColor(getScoreFromOption(checkinData.stress, 'stress'))}`}>
            {getScoreFromOption(checkinData.stress, 'stress')}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <Button
          onClick={() => router.push('/chat')}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>キャラクターと話す</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white py-4 rounded-xl font-semibold"
        >
          ダッシュボードに戻る
        </Button>
      </motion.div>
    </div>
  )
}