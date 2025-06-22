'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Star, 
  Trophy, 
  Target, 
  Flame, 
  Heart, 
  MessageCircle,
  Calendar,
  Sparkles,
  Award,
  Crown,
  Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Achievements data
const achievementsData = {
  userLevel: 12,
  totalXP: 2850,
  nextLevelXP: 3000,
  streakDays: 28,
  badges: [
    {
      id: 'first_checkin',
      name: '最初の一歩',
      description: '初回チェックインを完了',
      icon: '🌱',
      rarity: 'common',
      earned: true,
      earnedDate: '2024-01-15',
      xp: 10
    },
    {
      id: 'week_streak',
      name: '一週間の継続',
      description: '7日連続でチェックイン',
      icon: '🔥',
      rarity: 'common',
      earned: true,
      earnedDate: '2024-01-22',
      xp: 50
    },
    {
      id: 'month_warrior',
      name: '月の戦士',
      description: '30日連続でチェックイン',
      icon: '🏆',
      rarity: 'rare',
      earned: false,
      progress: 28,
      total: 30,
      xp: 200
    },
    {
      id: 'mood_master',
      name: 'ムードマスター',
      description: '100回のチェックインを完了',
      icon: '⭐',
      rarity: 'epic',
      earned: true,
      earnedDate: '2024-02-10',
      xp: 500
    },
    {
      id: 'ai_friend',
      name: 'AIの親友',
      description: 'AIと50回対話',
      icon: '🤖',
      rarity: 'rare',
      earned: true,
      earnedDate: '2024-02-20',
      xp: 150
    },
    {
      id: 'wellness_champion',
      name: 'ウェルネスチャンピオン',
      description: '専門家との面談を5回完了',
      icon: '👑',
      rarity: 'legendary',
      earned: false,
      progress: 3,
      total: 5,
      xp: 1000
    },
    {
      id: 'early_bird',
      name: '早起きの鳥',
      description: '朝8時前に10回チェックイン',
      icon: '🐦',
      rarity: 'uncommon',
      earned: true,
      earnedDate: '2024-01-30',
      xp: 75
    },
    {
      id: 'reflection_guru',
      name: '振り返りの達人',
      description: '詳細な振り返りを25回記録',
      icon: '🧘',
      rarity: 'rare',
      earned: false,
      progress: 18,
      total: 25,
      xp: 200
    },
    {
      id: 'positive_vibes',
      name: 'ポジティブエナジー',
      description: '連続10日間ポジティブな気分を記録',
      icon: '☀️',
      rarity: 'epic',
      earned: false,
      progress: 7,
      total: 10,
      xp: 300
    }
  ],
  levels: {
    current: 12,
    title: 'ウェルネスエキスパート',
    perks: [
      'プレミアムAIアドバイス',
      '優先的な専門家予約',
      '詳細分析レポート'
    ]
  },
  milestones: [
    { level: 5, title: 'ウェルネス初心者', unlocked: true },
    { level: 10, title: 'セルフケア実践者', unlocked: true },
    { level: 15, title: 'ウェルネスエキスパート', unlocked: false },
    { level: 20, title: 'メンタルヘルスマスター', unlocked: false },
    { level: 25, title: 'ウェルネスリーダー', unlocked: false },
  ]
}

export default function Achievements() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('badges')

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-amber-500'
      case 'epic': return 'from-purple-400 to-pink-500'
      case 'rare': return 'from-blue-400 to-cyan-500'
      case 'uncommon': return 'from-green-400 to-emerald-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-300'
      case 'epic': return 'border-purple-300'
      case 'rare': return 'border-blue-300'
      case 'uncommon': return 'border-green-300'
      default: return 'border-gray-300'
    }
  }

  const earnedBadges = achievementsData.badges.filter(badge => badge.earned)
  const inProgressBadges = achievementsData.badges.filter(badge => !badge.earned && badge.progress)
  const lockedBadges = achievementsData.badges.filter(badge => !badge.earned && !badge.progress)

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-medium text-gray-900">達成度・バッジ</h1>
            <p className="text-xs text-gray-500">あなたの成長を祝いましょう</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Level Progress */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {achievementsData.userLevel}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900">{achievementsData.levels.title}</h2>
                <p className="text-sm text-gray-600">レベル {achievementsData.userLevel}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>次のレベルまで</span>
                  <span>{achievementsData.nextLevelXP - achievementsData.totalXP} XP</span>
                </div>
                <Progress 
                  value={(achievementsData.totalXP / achievementsData.nextLevelXP) * 100} 
                  className="h-3"
                />
                <div className="text-xs text-gray-500">
                  {achievementsData.totalXP} / {achievementsData.nextLevelXP} XP
                </div>
              </div>

              <div className="pt-4 border-t border-blue-200">
                <h3 className="font-medium text-gray-900 mb-2">現在の特典</h3>
                <div className="space-y-1">
                  {achievementsData.levels.perks.map((perk, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                      <Sparkles className="h-3 w-3 text-yellow-500" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">現在のストリーク</div>
                  <div className="text-sm text-gray-500">継続は力なり</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{achievementsData.streakDays}</div>
                <div className="text-sm text-gray-500">日間</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'badges'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            バッジ
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'milestones'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            マイルストーン
          </button>
        </div>

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* In Progress Badges */}
            {inProgressBadges.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span>進行中</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {inProgressBadges.map((badge) => (
                    <Card key={badge.id} className={`border-2 ${getRarityBorder(badge.rarity)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-white text-xl`}>
                            {badge.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{badge.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>進捗</span>
                                <span>{badge.progress}/{badge.total}</span>
                              </div>
                              <Progress value={(badge.progress! / badge.total!) * 100} className="h-2" />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 capitalize">{badge.rarity}</span>
                              <span className="text-xs font-medium text-blue-600">+{badge.xp} XP</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Earned Badges */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>獲得済み ({earnedBadges.length})</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {earnedBadges.map((badge) => (
                  <Card key={badge.id} className={`border-2 ${getRarityBorder(badge.rarity)} relative`}>
                    <CardContent className="p-3">
                      <div className="text-center space-y-2">
                        <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-white text-xl`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{badge.name}</h4>
                          <p className="text-xs text-gray-600">{badge.description}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 capitalize">{badge.rarity}</span>
                          <span className="font-medium text-green-600">+{badge.xp} XP</span>
                        </div>
                      </div>
                      <div className="absolute top-1 right-1">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Locked Badges */}
            {lockedBadges.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <span className="text-gray-400">🔒</span>
                  <span>未獲得</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {lockedBadges.map((badge) => (
                    <Card key={badge.id} className="border-2 border-gray-200 opacity-60">
                      <CardContent className="p-3">
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl">
                            🔒
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-600 text-sm">{badge.name}</h4>
                            <p className="text-xs text-gray-500">{badge.description}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 capitalize">{badge.rarity}</span>
                            <span className="font-medium text-gray-500">+{badge.xp} XP</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            {achievementsData.milestones.map((milestone, index) => (
              <Card key={index} className={`${milestone.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      milestone.unlocked 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-500'
                    }`}>
                      {milestone.unlocked ? (
                        <Crown className="h-6 w-6" />
                      ) : (
                        <span className="font-bold">{milestone.level}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${milestone.unlocked ? 'text-green-900' : 'text-gray-600'}`}>
                        レベル {milestone.level}
                      </h4>
                      <p className={`text-sm ${milestone.unlocked ? 'text-green-700' : 'text-gray-500'}`}>
                        {milestone.title}
                      </p>
                    </div>
                    {milestone.unlocked && (
                      <div className="text-green-600">
                        <Award className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}