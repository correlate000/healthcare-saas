'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  User,
  Edit,
  Settings,
  Award,
  Target,
  TrendingUp,
  Heart,
  Star,
  Trophy,
  Zap,
  Clock,
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  Camera,
  Mail,
  MapPin,
  Calendar,
  Smartphone
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data - in real app this would come from API/context
  const profile = {
    name: '田中 太郎',
    email: 'tanaka.taro@company.com',
    department: '開発部',
    position: 'シニアエンジニア',
    joinDate: '2020年4月',
    level: 12,
    totalXP: 2850,
    nextLevelXP: 3000,
    streakDays: 28,
    totalSessions: 47,
    totalMinutes: 1260,
    monthlyProgress: 78,
    favoriteCharacter: 'Luna',
    achievements: [
      { id: '1', name: '7日継続', icon: '🔥', earned: true },
      { id: '2', name: '気分向上', icon: '📈', earned: true },
      { id: '3', name: 'ストレス管理', icon: '🧘', earned: false },
      { id: '4', name: '早起き', icon: '🌅', earned: false }
    ]
  }

  const currentLevelProgress = ((profile.totalXP % 1000) / 1000) * 100

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white relative">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="text-white hover:bg-white/10 rounded-xl p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-semibold tracking-wide">プロフィール</h1>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/settings')}
              className="text-white hover:bg-white/10 rounded-xl p-2"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <Button 
                size="sm" 
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-emerald-600 hover:bg-gray-100 p-0 shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-wide">{profile.name}</h2>
              <p className="text-emerald-100 font-medium">{profile.position}</p>
              <p className="text-emerald-100/80 text-sm">{profile.department}</p>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">レベル {profile.level}</span>
              </div>
              <span className="text-sm text-emerald-100">
                {profile.totalXP} / {profile.nextLevelXP} XP
              </span>
            </div>
            <Progress value={currentLevelProgress} className="h-2 bg-white/20" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-xl font-bold">{profile.streakDays}</div>
              <div className="text-sm text-emerald-100 font-medium">日連続</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-xl font-bold">{profile.totalSessions}</div>
              <div className="text-sm text-emerald-100 font-medium">セッション</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-xl font-bold">{Math.floor(profile.totalMinutes / 60)}h</div>
              <div className="text-sm text-emerald-100 font-medium">総時間</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* This Month Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold tracking-wide">今月の進捗</h3>
                <p className="text-gray-400 text-sm">ウェルビーイングスコア</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{profile.monthlyProgress}%</div>
              <div className="text-sm text-green-400 font-medium">+12% 先月比</div>
            </div>
          </div>
          <Progress value={profile.monthlyProgress} className="h-3" />
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg tracking-wide">最近の実績</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/achievements')}
              className="text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-xl"
            >
              すべて見る
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {profile.achievements.slice(0, 4).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  achievement.earned 
                    ? 'bg-emerald-500/10 border-emerald-400/30' 
                    : 'bg-gray-700/50 border-gray-600/30'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <h4 className={`font-semibold text-sm ${
                    achievement.earned ? 'text-emerald-400' : 'text-gray-400'
                  }`}>
                    {achievement.name}
                  </h4>
                  {achievement.earned && (
                    <div className="mt-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        獲得済み
                      </Badge>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Favorite Character */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold tracking-wide">お気に入りキャラクター</h3>
                <p className="text-gray-400 text-sm">一緒に過ごした時間: {Math.floor(profile.totalMinutes / 60)}時間</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/characters')}
              className="text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-xl"
            >
              変更
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-purple-500/10 border border-purple-400/30 rounded-xl">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🌙</span>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold">{profile.favoriteCharacter}</h4>
              <p className="text-gray-400 text-sm">優しく包み込むような対話スタイル</p>
            </div>
          </div>
        </motion.div>

        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg tracking-wide">基本情報</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-xl"
            >
              <Edit className="w-4 h-4 mr-2" />
              編集
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">メールアドレス</p>
                <p className="text-white font-medium">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">所属</p>
                <p className="text-white font-medium">{profile.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">入社日</p>
                <p className="text-white font-medium">{profile.joinDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
        >
          <h3 className="text-white font-semibold text-lg tracking-wide mb-4">アプリ情報</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">バージョン</span>
              <span className="text-white font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">最終更新</span>
              <span className="text-white font-medium">2024年7月30日</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">デバイス</span>
              <div className="flex items-center space-x-2 text-white font-medium">
                <Smartphone className="w-4 h-4" />
                <span>iOS</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom spacing for navigation */}
        <div className="h-24"></div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}