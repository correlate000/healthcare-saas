'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { AppLayout } from '@/components/layout/AppLayout'
import { 
  Heart, 
  Zap, 
  Star,
  Crown,
  Sparkles, 
  TrendingUp,
  Gift,
  Clock,
  Users,
  Target,
  CheckCircle,
  PlayCircle,
  MessageSquare,
  Flame
} from 'lucide-react'
import {
  TaskCompleteAnimation,
  LevelUpAnimation,
  CharacterReaction,
  CountUpAnimation,
  PulseHighlight,
  FloatingNotification,
  RippleButton
} from '@/components/ui/micro-interactions'
import {
  DailyNarrativeSnippet,
  CharacterRelationshipTracker
} from '@/components/ui/narrative-elements'

// ゲーム化されたユーザーデータ
const userData = {
  name: 'あなた',
  level: 12,
  currentXP: 850,
  nextLevelXP: 1000,
  totalXP: 8750,
  currentStreak: 7, // 連続記録
  longestStreak: 23,
  todayProgress: 60, // 今日の進捗%
  mood: 'good', // today's mood
  selectedCharacter: 'luna',
  weeklyGoal: 5, // 週間目標
  weeklyProgress: 4, // 今週の達成
  unlockedBadges: 8,
  totalBadges: 15,
  energy: 85,
  happiness: 78
}

// AIキャラクターデータ（視覚的に強化）
const characters = {
  luna: {
    name: 'Luna',
    avatar: '🌙',
    mood: 'caring',
    status: 'online',
    relationship: 85,
    message: 'おかえりなさい！今日はどんな一日でしたか？✨',
    color: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-600'
  },
  aria: {
    name: 'Aria', 
    avatar: '🌟',
    mood: 'energetic',
    status: 'online',
    relationship: 72,
    message: 'こんにちは！今日も素晴らしい発見がありそうですね！🎉',
    color: 'from-teal-400 to-teal-600',
    textColor: 'text-teal-600'
  },
  zen: {
    name: 'Zen',
    avatar: '🧘‍♂️',
    mood: 'peaceful',
    status: 'online', 
    relationship: 91,
    message: '心を静めて、今この瞬間に意識を向けてみましょう。🕯️',
    color: 'from-indigo-400 to-indigo-600',
    textColor: 'text-indigo-600'
  }
}

// 今日のタスク（ゲーム化）
const todaysTasks = [
  { id: 1, title: '朝の気分チェック', icon: Heart, completed: true, xp: 10, timeSpent: '2分' },
  { id: 2, title: 'Lunaとお話', icon: MessageSquare, completed: true, xp: 25, timeSpent: '8分' },
  { id: 3, title: '5分間瞑想', icon: Target, completed: false, xp: 15, estimatedTime: '5分' },
  { id: 4, title: '専門記事を読む', icon: Clock, completed: false, xp: 20, estimatedTime: '8分' }
]

// 最近の実績・通知
const recentAchievements = [
  { id: 1, title: '7日連続記録達成！', icon: Flame, color: 'text-orange-500', time: '今日', new: true },
  { id: 2, title: 'Lunaとの絆レベルアップ', icon: Heart, color: 'text-pink-500', time: '昨日', new: true },
  { id: 3, title: '専門家記事を5つ完読', icon: Star, color: 'text-yellow-500', time: '2日前', new: false }
]

export default function Dashboard() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<keyof typeof characters>('luna')
  const [showTaskComplete, setShowTaskComplete] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showCharacterReaction, setShowCharacterReaction] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [completedTaskId, setCompletedTaskId] = useState<number | null>(null)
  
  const character = characters[selectedCharacter]
  const completedTasks = todaysTasks.filter(task => task.completed).length
  const progressPercentage = (completedTasks / todaysTasks.length) * 100

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    
    if (hour < 12) setCurrentTime('おはようございます')
    else if (hour < 17) setCurrentTime('こんにちは')
    else setCurrentTime('こんばんは')

    // 新しい実績があれば祝福アニメーション
    if (recentAchievements.some(a => a.new)) {
      setTimeout(() => setShowCelebration(true), 1000)
    }
  }, [])

  const handleTaskComplete = (taskId: number) => {
    const task = todaysTasks.find(t => t.id === taskId)
    if (!task) return

    // タスク完了アニメーション開始
    setCompletedTaskId(taskId)
    setShowTaskComplete(true)
    
    // キャラクター反応表示
    setTimeout(() => {
      setShowCharacterReaction(true)
      setTimeout(() => setShowCharacterReaction(false), 3000)
    }, 1000)

    // 通知表示
    setTimeout(() => {
      setShowNotification(true)
    }, 2000)

    // レベルアップチェック（例：5つごと）
    if ((completedTasks + 1) % 5 === 0) {
      setTimeout(() => {
        setShowLevelUp(true)
      }, 2500)
    }
  }

  const handleTaskCompleteFinish = () => {
    setShowTaskComplete(false)
    setCompletedTaskId(null)
  }

  const handleLevelUpFinish = () => {
    setShowLevelUp(false)
  }

  const handleNotificationClose = () => {
    setShowNotification(false)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'checkin':
        router.push('/checkin')
        break
      case 'chat':
        router.push('/chat')
        break
      case 'meditation':
        router.push('/content-library/exercises')
        break
      case 'content':
        router.push('/content-library')
        break
      case 'booking':
        router.push('/booking')
        break
    }
  }

  return (
    <AppLayout>
      <div className="px-4 py-6 space-y-6 max-w-md mx-auto">
        
        {/* 🎊 祝福アニメーション */}
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}

        {/* マイクロインタラクション */}
        <TaskCompleteAnimation
          isVisible={showTaskComplete}
          onComplete={handleTaskCompleteFinish}
          xpGained={completedTaskId ? todaysTasks.find(t => t.id === completedTaskId)?.xp || 10 : 10}
          taskTitle={completedTaskId ? todaysTasks.find(t => t.id === completedTaskId)?.title || 'タスク完了！' : 'タスク完了！'}
        />

        <LevelUpAnimation
          isVisible={showLevelUp}
          onComplete={handleLevelUpFinish}
          newLevel={userData.level + 1}
        />

        <CharacterReaction
          isVisible={showCharacterReaction}
          character={{
            name: character.name,
            avatar: character.avatar,
            color: character.color
          }}
          reaction="proud"
        />

        <FloatingNotification
          isVisible={showNotification}
          title="タスク完了！"
          message="素晴らしい進歩です！続けていきましょう。"
          type="achievement"
          onClose={handleNotificationClose}
        />

        {/* 📜 デイリーナラティブ */}
        <DailyNarrativeSnippet 
          userMood={userData.mood}
          timeOfDay={currentTime.includes('おはよう') ? 'morning' : 
                    currentTime.includes('こんにちは') ? 'afternoon' : 'evening'}
          characterPreference={selectedCharacter}
        />

        {/* 👤 ユーザープロファイル & レベル */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                    <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                      {userData.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                    {userData.level}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentTime}</h2>
                  <p className="text-blue-100">{userData.name}さん</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Crown className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm">レベル {userData.level}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{userData.currentStreak}</div>
                <div className="text-xs text-blue-100">連続記録</div>
                <Flame className="h-6 w-6 text-orange-300 mx-auto mt-1" />
              </div>
            </div>
            
            {/* XP プログレスバー */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>次のレベルまで</span>
                <span>{userData.nextLevelXP - userData.currentXP} XP</span>
              </div>
              <Progress 
                value={(userData.currentXP / userData.nextLevelXP) * 100} 
                className="h-3 bg-blue-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* 🎯 今日の進捗（大きく目立つ） */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <CountUpAnimation 
                from={Math.max(0, Math.round(progressPercentage) - 10)}
                to={Math.round(progressPercentage)}
                suffix="%"
                className="text-4xl font-bold text-green-600"
              />
              <div className="text-green-700 font-medium">今日の達成度</div>
            </div>
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-green-200"/>
                <circle 
                  cx="48" cy="48" r="40" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                  className="text-green-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <p className="text-sm text-green-700">
              {completedTasks}/{todaysTasks.length} タスク完了
            </p>
          </CardContent>
        </Card>

        {/* 🤖 AIキャラクター選択 & メッセージ */}
        <Card className={`bg-gradient-to-br ${character.color} text-white`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              {Object.entries(characters).map(([id, char]) => (
                <button
                  key={id}
                  onClick={() => setSelectedCharacter(id as keyof typeof characters)}
                  className={`text-3xl p-2 rounded-full transition-all ${
                    selectedCharacter === id ? 'bg-white bg-opacity-20 scale-110' : 'hover:scale-105'
                  }`}
                >
                  {char.avatar}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{character.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-sm">オンライン</span>
                </div>
              </div>
              
              <p className="text-white text-opacity-90 leading-relaxed">
                {character.message}
              </p>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-pink-200" />
                  <span className="text-sm">絆レベル {character.relationship}</span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => router.push('/chat')}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
                >
                  お話しする
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ⚡ 今日のタスク（ゲーム風） */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span>今日のミッション</span>
              </h3>
              <div className="text-sm text-gray-500">
                {completedTasks}/{todaysTasks.length}
              </div>
            </div>
            
            <div className="space-y-3">
              {todaysTasks.map((task) => (
                <div 
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    task.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      task.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      <task.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.completed ? `完了 • ${task.timeSpent}` : `予想時間: ${task.estimatedTime}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-bold text-yellow-600">+{task.xp} XP</div>
                    </div>
                    {!task.completed && (
                      <RippleButton 
                        onClick={() => handleTaskComplete(task.id)}
                        className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center"
                      >
                        <PlayCircle className="h-4 w-4" />
                      </RippleButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 💖 キャラクターとの絆 */}
        <CharacterRelationshipTracker 
          character={selectedCharacter}
          relationshipLevel={character.relationship}
          interactionCount={42} 
        />

        {/* 🎉 最近の実績 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold flex items-center space-x-2 mb-4">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>最近の実績</span>
            </h3>
            
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.new ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.time}</p>
                  </div>
                  {achievement.new && (
                    <div className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                      NEW!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 🚀 クイックアクション（大きめボタン） */}
        <div className="grid grid-cols-2 gap-4">
          <PulseHighlight isActive={userData.currentStreak === 0} color="yellow">
            <RippleButton 
              onClick={() => handleQuickAction('checkin')}
              className="h-20 w-full flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg"
            >
              <Heart className="h-6 w-6" />
              <span className="text-sm font-medium">気分チェック</span>
            </RippleButton>
          </PulseHighlight>
          
          <RippleButton 
            onClick={() => handleQuickAction('content')}
            className="h-20 w-full flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg"
          >
            <Clock className="h-6 w-6" />
            <span className="text-sm font-medium">コンテンツ</span>
          </RippleButton>

          <RippleButton 
            onClick={() => handleQuickAction('booking')}
            className="h-20 w-full flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg"
          >
            <Users className="h-6 w-6" />
            <span className="text-sm font-medium">専門家予約</span>
          </RippleButton>
          
          <RippleButton 
            onClick={() => router.push('/daily-challenge')}
            className="h-20 w-full flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg"
          >
            <Zap className="h-6 w-6" />
            <span className="text-sm font-medium">チャレンジ</span>
          </RippleButton>
        </div>

        {/* 📈 今週の統計（簡潔に） */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>今週の記録</span>
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <CountUpAnimation 
                  from={Math.max(0, userData.energy - 10)}
                  to={userData.energy}
                  suffix="%"
                  className="text-2xl font-bold text-blue-600"
                />
                <div className="text-xs text-gray-600">エネルギー</div>
              </div>
              <div>
                <CountUpAnimation 
                  from={Math.max(0, userData.happiness - 10)}
                  to={userData.happiness}
                  suffix="%"
                  className="text-2xl font-bold text-green-600"
                />
                <div className="text-xs text-gray-600">幸福度</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{userData.weeklyProgress}/{userData.weeklyGoal}</div>
                <div className="text-xs text-gray-600">週間目標</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🎁 特別オファー・サプライズ */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-6 text-center">
            <Gift className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-bold mb-2">🎊 7日連続記録達成！</h3>
            <p className="text-sm text-yellow-100 mb-3">
              新しいバッジと限定スタンプをゲット！
            </p>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => router.push('/achievements')}
              className="bg-white text-orange-500 hover:bg-yellow-50"
            >
              報酬を受け取る
            </Button>
          </CardContent>
        </Card>

        {/* 🗺️ ページ探索 */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <h3 className="font-bold mb-3 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              他の機能も探してみませんか？
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => router.push('/analytics')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs"
              >
                📊 詳細分析
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => router.push('/characters')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs"
              >
                🤖 キャラクター
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => router.push('/sitemap')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs"
              >
                🗺️ 全機能一覧
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => router.push('/help')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-xs"
              >
                ❓ ヘルプ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}