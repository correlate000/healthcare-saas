'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { CharacterAvatar } from '@/components/characters/CharacterAvatar'
import { ProgressSystem } from '@/components/gamification/ProgressSystem'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  Heart, 
  MessageSquare, 
  BarChart3, 
  Calendar,
  Star,
  Trophy,
  Flame,
  Target,
  Zap,
  Crown,
  Gift,
  Users,
  TrendingUp,
  Clock,
  Sparkles,
  Moon,
  Sun,
  Coffee,
  Award,
  Activity,
  Smile,
  Brain,
  Shield,
  PlayCircle,
  BookOpen,
  Headphones
} from 'lucide-react'

// モックデータ
const userData = {
  name: 'あなた',
  level: 7,
  currentXP: 2450,
  xpToNextLevel: 3000,
  streak: 12,
  totalCheckins: 67,
  achievementsCount: 15,
  currentMood: 'happy',
  todayProgress: {
    checkin: true,
    meditation: false,
    exercise: true,
    journal: false
  }
}

const quickActions = [
  {
    id: 'checkin',
    title: '今日の気分チェックイン',
    description: '5分で完了',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    path: '/checkin',
    xp: '+50 XP',
    completed: userData.todayProgress.checkin
  },
  {
    id: 'chat',
    title: 'AIキャラクターと対話',
    description: 'Luna、Aria、Zenと話そう',
    icon: MessageSquare,
    color: 'from-blue-500 to-purple-500',
    path: '/chat',
    xp: '+30 XP',
    completed: false
  },
  {
    id: 'meditation',
    title: 'マインドフルネス',
    description: '3分瞑想セッション',
    icon: Brain,
    color: 'from-green-500 to-teal-500',
    path: '/meditation',
    xp: '+40 XP',
    completed: userData.todayProgress.meditation
  },
  {
    id: 'journal',
    title: '感情日記',
    description: '今日の振り返り',
    icon: BookOpen,
    color: 'from-orange-500 to-yellow-500',
    path: '/emotion-diary',
    xp: '+35 XP',
    completed: userData.todayProgress.journal
  }
]

const insights = [
  {
    title: '今週の調子',
    value: '85%',
    change: '+12%',
    positive: true,
    description: '先週より気分が向上しています'
  },
  {
    title: 'ストレスレベル',
    value: '低',
    change: '-15%',
    positive: true,
    description: 'リラックスできている状態です'
  },
  {
    title: '睡眠の質',
    value: '良好',
    change: '+8%',
    positive: true,
    description: '深い眠りが取れています'
  }
]

export default function Dashboard() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCharacter, setSelectedCharacter] = useState<'luna' | 'aria' | 'zen'>('luna')
  const [showWelcome, setShowWelcome] = useState(true)
  const [completedActions, setCompletedActions] = useState<string[]>([])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return { text: 'おはようございます', icon: Sun, color: 'text-yellow-500' }
    if (hour < 18) return { text: 'こんにちは', icon: Sun, color: 'text-orange-500' }
    return { text: 'こんばんは', icon: Moon, color: 'text-purple-500' }
  }

  const greeting = getGreeting()

  const handleActionComplete = (actionId: string) => {
    setCompletedActions(prev => [...prev, actionId])
    // XP獲得アニメーション等をここで実装
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 touch-manipulation">
      {/* ウェルカムスプラッシュ */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <CharacterAvatar
                  character={selectedCharacter}
                  emotion="celebrating"
                  size="xl"
                  animated={true}
                  use3D={true}
                />
              </motion.div>
              <motion.h1
                className="text-4xl font-bold mt-6 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                お帰りなさい！
              </motion.h1>
              <motion.p
                className="text-xl opacity-90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                今日も一緒に頑張りましょう
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="container max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6 pb-24 md:pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* モバイル最適化ヘッダー */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 md:p-6">
              {/* モバイル: 縦レイアウト、デスクトップ: 横レイアウト */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                {/* キャラクターと挨拶 */}
                <div className="flex items-center space-x-4">
                  <CharacterAvatar
                    character={selectedCharacter}
                    emotion={userData.currentMood as any}
                    size="md"
                    animated={true}
                    showVoiceWave={false}
                    use3D={true}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <greeting.icon className={`h-5 w-5 ${greeting.color}`} />
                      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                        {greeting.text}！
                      </h1>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">
                      今日も一緒に頑張りましょう ✨
                    </p>
                  </div>
                </div>

                {/* ステータスバッジ */}
                <div className="flex items-center justify-between md:flex-col md:items-end space-x-3 md:space-x-0 md:space-y-2">
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentTime.toLocaleTimeString('ja-JP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      <Flame className="h-3 w-3 mr-1" />
                      {userData.streak}日
                    </Badge>
                  </div>

                  {/* キャラクター選択ボタン（タッチフレンドリー） */}
                  <div className="flex space-x-2">
                    {[
                      { char: 'luna', emoji: '🌙' },
                      { char: 'aria', emoji: '✨' },
                      { char: 'zen', emoji: '🧘' }
                    ].map(({ char, emoji }) => (
                      <motion.button
                        key={char}
                        className={`w-12 h-12 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all touch-manipulation select-none ${
                          selectedCharacter === char 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300'
                        }`}
                        onClick={() => setSelectedCharacter(char as any)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-base">{emoji}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* プログレスシステム */}
        <motion.div variants={itemVariants}>
          <ProgressSystem
            userLevel={userData.level}
            currentXP={userData.currentXP}
            xpToNextLevel={userData.xpToNextLevel}
            streak={userData.streak}
            totalCheckins={userData.totalCheckins}
            achievementsCount={userData.achievementsCount}
            animated={true}
          />
        </motion.div>

        {/* モバイル最適化クイックアクション */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>今日のアクション</span>
              </CardTitle>
              <CardDescription className="text-sm">
                毎日の習慣で心の健康を育てよう
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* モバイル: 縦並び1列、タブレット: 2列、デスクトップ: 4列 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon
                  const isCompleted = action.completed || completedActions.includes(action.id)
                  
                  return (
                    <motion.div
                      key={action.id}
                      variants={itemVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`relative overflow-hidden transition-all duration-300 touch-manipulation ${
                        isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-lg cursor-pointer active:scale-95'
                      }`}>
                        <CardContent className="p-4 md:p-4">
                          <div className="space-y-3">
                            {/* アイコンとXPバッジ */}
                            <div className="flex items-center justify-between">
                              <div className={`w-12 h-12 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                                <IconComponent className="h-5 w-5 md:h-6 md:w-6 text-white" />
                              </div>
                              {isCompleted ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center"
                                >
                                  <Star className="h-3 w-3 text-white" />
                                </motion.div>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                                  {action.xp}
                                </Badge>
                              )}
                            </div>
                            
                            {/* タイトルと説明 */}
                            <div>
                              <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1">
                                {action.title}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-600">
                                {action.description}
                              </p>
                            </div>

                            {/* アクションボタン（モバイルで大きめ、タッチフレンドリー） */}
                            <EnhancedButton
                              variant={isCompleted ? "outline" : "gradient"}
                              size="sm"
                              effect={isCompleted ? "none" : "sparkle"}
                              className="w-full h-12 md:h-10 text-sm font-medium touch-manipulation select-none"
                              success={isCompleted}
                              celebration={!isCompleted}
                              onClick={() => {
                                if (!isCompleted) {
                                  handleActionComplete(action.id)
                                  router.push(action.path)
                                }
                              }}
                              disabled={isCompleted}
                            >
                              {isCompleted ? '完了済み' : '開始'}
                            </EnhancedButton>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* インサイト・分析 */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-700">{insight.title}</h3>
                      <TrendingUp className={`h-5 w-5 ${insight.positive ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-gray-800">
                        {insight.value}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className={`${insight.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {insight.change}
                        </Badge>
                        <span className="text-sm text-gray-600">先週比</span>
                      </div>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* フローティングアクションボタン（モバイルでは隠す） */}
        <motion.div
          className="fixed bottom-6 right-6 z-40 hidden md:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 300 }}
        >
          <EnhancedButton
            variant="magical"
            size="lg"
            effect="glow"
            className="rounded-full w-16 h-16 shadow-2xl"
            onClick={() => router.push('/chat')}
          >
            <MessageSquare className="h-6 w-6" />
          </EnhancedButton>
        </motion.div>
      </motion.div>

      {/* モバイルボトムナビゲーション */}
      <MobileBottomNav />
    </div>
  )
}