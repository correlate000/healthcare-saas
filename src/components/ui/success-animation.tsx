'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Heart, 
  Star, 
  Trophy, 
  Gift, 
  Sparkles, 
  Zap,
  Award,
  Target,
  TrendingUp
} from 'lucide-react'

interface SuccessAnimationProps {
  type: 'checkin' | 'challenge' | 'milestone' | 'streak' | 'levelup' | 'badge' | 'chat' | 'team'
  title: string
  description: string
  xpGained?: number
  streakCount?: number
  badgeName?: string
  level?: number
  onComplete?: () => void
  character?: 'luna' | 'aria' | 'zen'
}

export function SuccessAnimation({
  type,
  title,
  description,
  xpGained = 0,
  streakCount,
  badgeName,
  level,
  onComplete,
  character = 'luna'
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [stage, setStage] = useState(0) // 0: hidden, 1: appearing, 2: celebrating, 3: disappearing

  useEffect(() => {
    setIsVisible(true)
    setStage(1)

    const timer1 = setTimeout(() => setStage(2), 300)
    const timer2 = setTimeout(() => setStage(3), 2500)
    const timer3 = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 3200)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  const getIcon = () => {
    switch (type) {
      case 'checkin': return <Heart className="w-8 h-8 text-red-500" />
      case 'challenge': return <Target className="w-8 h-8 text-blue-500" />
      case 'milestone': return <Trophy className="w-8 h-8 text-yellow-500" />
      case 'streak': return <Zap className="w-8 h-8 text-orange-500" />
      case 'levelup': return <TrendingUp className="w-8 h-8 text-purple-500" />
      case 'badge': return <Award className="w-8 h-8 text-green-500" />
      case 'chat': return <Sparkles className="w-8 h-8 text-pink-500" />
      case 'team': return <Gift className="w-8 h-8 text-teal-500" />
      default: return <CheckCircle className="w-8 h-8 text-green-500" />
    }
  }

  const getCharacterReaction = () => {
    const reactions = {
      luna: {
        checkin: "今日も気持ちを教えてくれてありがとう ✨",
        challenge: "挑戦する姿、とても素敵です 🌙",
        milestone: "大きな一歩ですね！一緒に喜びたいです 💙",
        streak: "継続は力なり...あなたの頑張りを見ています 🌟",
        levelup: "成長していく姿に心が温かくなります 💜",
        badge: "新しいバッジ、おめでとうございます！ 🏆",
        chat: "お話できて嬉しかったです 💕",
        team: "仲間との繋がり、大切ですね 🤝"
      },
      aria: {
        checkin: "今日も一緒にスタート！やる気アップ！ ⚡",
        challenge: "チャレンジ精神最高です！Keep going! 🚀",
        milestone: "すごいじゃないですか！次も頑張りましょう！ 🎉",
        streak: "連続記録更新！あなたってすごい！ 🔥",
        levelup: "レベルアップ！新しいステージの始まりです！ ⭐",
        badge: "新バッジGET！コレクション増えましたね！ 🌟",
        chat: "楽しい時間でした！また話しましょう！ 😊",
        team: "チームワーク最高！みんなで成長しましょう！ 👥"
      },
      zen: {
        checkin: "自分と向き合う時間を大切にしていますね 🧘",
        challenge: "新しい挑戦は内なる成長に繋がります 🌱",
        milestone: "この達成は深い意味を持っています 🎯",
        streak: "継続という美徳を体現していますね ⚡",
        levelup: "真の成長は内側から始まります 🌸",
        badge: "この実績は努力の証です 🏅",
        chat: "意味のある対話でした。ありがとう 💭",
        team: "共に支え合う...これこそ人の本質ですね 🤲"
      }
    }
    return reactions[character][type] || "素晴らしい成果ですね"
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'checkin': return 'from-red-50 to-pink-50'
      case 'challenge': return 'from-blue-50 to-cyan-50'
      case 'milestone': return 'from-yellow-50 to-amber-50'
      case 'streak': return 'from-orange-50 to-red-50'
      case 'levelup': return 'from-purple-50 to-indigo-50'
      case 'badge': return 'from-green-50 to-emerald-50'
      case 'chat': return 'from-pink-50 to-purple-50'
      case 'team': return 'from-teal-50 to-cyan-50'
      default: return 'from-gray-50 to-gray-100'
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card 
        className={`w-full max-w-sm transform transition-all duration-300 bg-gradient-to-br ${getBackgroundColor()} border-2 ${
          stage === 1 ? 'scale-0 opacity-0' : 
          stage === 2 ? 'scale-100 opacity-100' : 
          'scale-95 opacity-0'
        }`}
      >
        <CardContent className="p-6 text-center space-y-4">
          {/* Icon with pulse animation */}
          <div className={`mx-auto w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center ${
            stage === 2 ? 'animate-pulse' : ''
          }`}>
            {getIcon()}
          </div>

          {/* Floating particles effect */}
          {stage === 2 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 20}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                >
                  <Star className="w-3 h-3 text-yellow-400" />
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          {/* Rewards */}
          <div className="flex flex-wrap justify-center gap-2">
            {xpGained > 0 && (
              <Badge className="bg-blue-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                +{xpGained} XP
              </Badge>
            )}
            {streakCount && (
              <Badge className="bg-orange-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                {streakCount}日連続
              </Badge>
            )}
            {badgeName && (
              <Badge className="bg-green-500 text-white">
                <Award className="w-3 h-3 mr-1" />
                {badgeName}
              </Badge>
            )}
            {level && (
              <Badge className="bg-purple-500 text-white">
                <TrendingUp className="w-3 h-3 mr-1" />
                Lv.{level}
              </Badge>
            )}
          </div>

          {/* Character reaction */}
          <div className="p-3 bg-white/80 rounded-lg border">
            <p className="text-sm text-gray-700 italic">
              "{getCharacterReaction()}"
            </p>
            <p className="text-xs text-gray-500 mt-1">- {character === 'luna' ? 'Luna' : character === 'aria' ? 'Aria' : 'Zen'}</p>
          </div>

          {/* Celebration emoji */}
          <div className="text-2xl">
            {type === 'checkin' && '💖'}
            {type === 'challenge' && '🎯'}
            {type === 'milestone' && '🏆'}
            {type === 'streak' && '🔥'}
            {type === 'levelup' && '⭐'}
            {type === 'badge' && '🏅'}
            {type === 'chat' && '✨'}
            {type === 'team' && '🤝'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Usage hook for triggering success animations
export function useSuccessAnimation() {
  const [currentAnimation, setCurrentAnimation] = useState<SuccessAnimationProps | null>(null)

  const showSuccess = (props: SuccessAnimationProps) => {
    setCurrentAnimation({
      ...props,
      onComplete: () => {
        props.onComplete?.()
        setCurrentAnimation(null)
      }
    })
  }

  const SuccessComponent = currentAnimation ? (
    <SuccessAnimation {...currentAnimation} />
  ) : null

  return { showSuccess, SuccessComponent }
}