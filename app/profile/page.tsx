'use client'

import { useState } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  User,
  Edit,
  Save,
  Mail,
  Building,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Award,
  Target,
  TrendingUp,
  Heart,
  Star,
  Trophy,
  Zap,
  Clock,
  Users,
  MessageCircle,
  BookOpen,
  Shield,
  Settings,
  Camera,
  CheckCircle,
  X,
  Plus,
  Trash2
} from 'lucide-react'

interface UserProfile {
  basicInfo: {
    name: string
    email: string
    department: string
    position: string
    joinDate: string
    location: string
    phone: string
    bio: string
  }
  preferences: {
    favoriteCharacter: 'luna' | 'aria' | 'zen'
    notificationTime: string
    reminderFrequency: 'daily' | 'weekly' | 'custom'
    privacyLevel: 'open' | 'team' | 'private'
    language: 'ja' | 'en'
    theme: 'light' | 'dark' | 'auto'
  }
  goals: {
    current: string[]
    completed: string[]
  }
  achievements: {
    badges: Array<{
      id: string
      name: string
      description: string
      unlockedAt: string
      category: string
    }>
    level: number
    totalXP: number
    currentStreaks: {
      checkin: number
      chat: number
      challenges: number
    }
  }
  stats: {
    totalSessions: number
    totalMinutes: number
    favoriteFeatures: string[]
    monthlyProgress: number
  }
}

const defaultProfile: UserProfile = {
  basicInfo: {
    name: '田中 太郎',
    email: 'tanaka.taro@company.com',
    department: '開発部',
    position: 'シニアエンジニア',
    joinDate: '2020-04-01',
    location: '東京オフィス',
    phone: '03-1234-5678',
    bio: 'フルスタック開発者として、チームの技術的な課題解決に取り組んでいます。メンタルヘルスの重要性を理解し、チーム全体のウェルビーイング向上に貢献したいと考えています。'
  },
  preferences: {
    favoriteCharacter: 'luna',
    notificationTime: '09:00',
    reminderFrequency: 'daily',
    privacyLevel: 'team',
    language: 'ja',
    theme: 'auto'
  },
  goals: {
    current: [
      'ストレス管理スキルの向上',
      '毎日のチェックイン習慣化',
      'チームとのコミュニケーション改善'
    ],
    completed: [
      '基本的なマインドフルネス習得',
      '感情日記を1ヶ月継続',
      'AIキャラクターとの信頼関係構築'
    ]
  },
  achievements: {
    badges: [
      {
        id: 'first_checkin',
        name: 'はじめの一歩',
        description: '初回チェックインを完了',
        unlockedAt: '2025-05-15',
        category: 'milestone'
      },
      {
        id: 'streak_7',
        name: '1週間継続',
        description: '7日連続でチェックイン',
        unlockedAt: '2025-05-22',
        category: 'streak'
      },
      {
        id: 'chat_master',
        name: '対話マスター',
        description: 'AIキャラクターと50回対話',
        unlockedAt: '2025-06-01',
        category: 'engagement'
      }
    ],
    level: 8,
    totalXP: 2850,
    currentStreaks: {
      checkin: 12,
      chat: 8,
      challenges: 5
    }
  },
  stats: {
    totalSessions: 67,
    totalMinutes: 423,
    favoriteFeatures: ['感情チェックイン', 'Luna との対話', 'デイリーチャレンジ'],
    monthlyProgress: 78
  }
}

export default function Profile() {
  const [profile, setProfile] = useState(defaultProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [editForm, setEditForm] = useState(defaultProfile.basicInfo)
  const [newGoal, setNewGoal] = useState('')

  const handleSave = () => {
    setProfile({
      ...profile,
      basicInfo: editForm
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(profile.basicInfo)
    setIsEditing(false)
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      setProfile({
        ...profile,
        goals: {
          ...profile.goals,
          current: [...profile.goals.current, newGoal.trim()]
        }
      })
      setNewGoal('')
    }
  }

  const removeGoal = (index: number) => {
    setProfile({
      ...profile,
      goals: {
        ...profile.goals,
        current: profile.goals.current.filter((_, i) => i !== index)
      }
    })
  }

  const completeGoal = (index: number) => {
    const goal = profile.goals.current[index]
    setProfile({
      ...profile,
      goals: {
        current: profile.goals.current.filter((_, i) => i !== index),
        completed: [...profile.goals.completed, goal]
      }
    })
  }

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'milestone': return <Target className="w-4 h-4" />
      case 'streak': return <Zap className="w-4 h-4" />
      case 'engagement': return <MessageCircle className="w-4 h-4" />
      default: return <Award className="w-4 h-4" />
    }
  }

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'bg-blue-500'
      case 'streak': return 'bg-orange-500'
      case 'engagement': return 'bg-green-500'
      default: return 'bg-purple-500'
    }
  }

  const getCharacterInfo = (character: string) => {
    switch (character) {
      case 'luna': return { name: 'Luna', color: 'bg-purple-500', emoji: '🌙' }
      case 'aria': return { name: 'Aria', color: 'bg-teal-500', emoji: '✨' }
      case 'zen': return { name: 'Zen', color: 'bg-indigo-500', emoji: '🧘' }
      default: return { name: 'Luna', color: 'bg-purple-500', emoji: '🌙' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                  {profile.basicInfo.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white text-blue-600 hover:bg-gray-100 p-0"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{profile.basicInfo.name}</h1>
              <p className="text-blue-100">{profile.basicInfo.position}</p>
              <p className="text-blue-200 text-sm">{profile.basicInfo.department}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              編集
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">Lv.{profile.achievements.level}</div>
              <div className="text-sm text-blue-100">レベル</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{profile.achievements.totalXP}</div>
              <div className="text-sm text-blue-100">総XP</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{profile.stats.totalSessions}</div>
              <div className="text-sm text-blue-100">セッション数</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="goals">目標</TabsTrigger>
            <TabsTrigger value="achievements">実績</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  今月の進捗
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ウェルビーイングスコア</span>
                    <span className="text-sm font-medium">{profile.stats.monthlyProgress}%</span>
                  </div>
                  <Progress value={profile.stats.monthlyProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-orange-600">{profile.achievements.currentStreaks.checkin}</div>
                    <div className="text-xs text-orange-600">チェックイン連続</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">{profile.achievements.currentStreaks.chat}</div>
                    <div className="text-xs text-green-600">対話連続</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">{profile.achievements.currentStreaks.challenges}</div>
                    <div className="text-xs text-blue-600">チャレンジ連続</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Favorite Character */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  お気に入りキャラクター
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className={`w-12 h-12 rounded-full ${getCharacterInfo(profile.preferences.favoriteCharacter).color} flex items-center justify-center text-white text-xl`}>
                    {getCharacterInfo(profile.preferences.favoriteCharacter).emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{getCharacterInfo(profile.preferences.favoriteCharacter).name}</h4>
                    <p className="text-sm text-gray-600">一緒に過ごした時間: {Math.floor(profile.stats.totalMinutes / 60)}時間</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/characters'}>
                    詳細を見る
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-600" />
                    基本情報
                  </span>
                  {isEditing && (
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-1" />
                        キャンセル
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-1" />
                        保存
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">名前</label>
                        <Input 
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">役職</label>
                        <Input 
                          value={editForm.position}
                          onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">部署</label>
                        <Input 
                          value={editForm.department}
                          onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">所在地</label>
                        <Input 
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">自己紹介</label>
                      <Textarea 
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{profile.basicInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{profile.basicInfo.department}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">入社日: {new Date(profile.basicInfo.joinDate).toLocaleDateString('ja-JP')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{profile.basicInfo.location}</span>
                    </div>
                    {profile.basicInfo.bio && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-700 leading-relaxed">{profile.basicInfo.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorite Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  よく使う機能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.stats.favoriteFeatures.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="bg-yellow-50 text-yellow-700">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  現在の目標
                </CardTitle>
                <CardDescription>
                  メンタルヘルス向上のための個人目標を設定・管理できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="新しい目標を入力..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  />
                  <Button onClick={addGoal} disabled={!newGoal.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {profile.goals.current.map((goal, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{goal}</span>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => completeGoal(index)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              完了
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => removeGoal(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  達成した目標
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.goals.completed.map((goal, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                      <span className="text-sm text-green-800">{goal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  獲得バッジ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {profile.achievements.badges.map((badge) => (
                    <Card key={badge.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${getBadgeColor(badge.category)} rounded-full flex items-center justify-center text-white`}>
                            {getBadgeIcon(badge.category)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{badge.name}</h4>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              獲得日: {new Date(badge.unlockedAt).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            獲得済み
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>レベル進行</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">レベル {profile.achievements.level}</span>
                    <span className="text-sm text-gray-600">{profile.achievements.totalXP}/3000 XP</span>
                  </div>
                  <Progress value={(profile.achievements.totalXP % 1000) / 10} className="h-3" />
                  <p className="text-xs text-gray-500">次のレベルまで {3000 - profile.achievements.totalXP} XP</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-600">{profile.achievements.badges.length}</div>
                    <div className="text-xs text-purple-600">バッジ数</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">{profile.achievements.level}</div>
                    <div className="text-xs text-blue-600">現在レベル</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Star className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">{profile.achievements.totalXP}</div>
                    <div className="text-xs text-green-600">総獲得XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  個人設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">通知時間</label>
                    <Input 
                      type="time" 
                      value={profile.preferences.notificationTime}
                      onChange={(e) => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          notificationTime: e.target.value
                        }
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">プライバシーレベル</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['open', 'team', 'private'].map((level) => (
                        <Button
                          key={level}
                          variant={profile.preferences.privacyLevel === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              privacyLevel: level as any
                            }
                          })}
                        >
                          {level === 'open' ? 'オープン' : 
                           level === 'team' ? 'チーム内' : 'プライベート'}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">テーマ</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <Button
                          key={theme}
                          variant={profile.preferences.theme === theme ? "default" : "outline"}
                          size="sm"
                          onClick={() => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              theme: theme as any
                            }
                          })}
                        >
                          {theme === 'light' ? 'ライト' : 
                           theme === 'dark' ? 'ダーク' : '自動'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>アカウント管理</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  プライバシー設定
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  データのエクスポート
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  アカウント削除
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* モバイルボトムナビゲーション */}
      <MobileBottomNav />
    </div>
  )
}