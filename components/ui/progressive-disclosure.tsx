'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Lock, CheckCircle, Star, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export interface StoryProgress {
  currentChapter: number
  unlockedFeatures: string[]
  completedMilestones: string[]
  userLevel: number
  totalXP: number
}

export interface StoryChapter {
  id: number
  title: string
  description: string
  unlockRequirement: {
    type: 'xp' | 'days' | 'tasks' | 'level'
    value: number
    description: string
  }
  rewards: {
    features: string[]
    xp: number
    badge?: string
  }
  isLocked: boolean
  isCompleted: boolean
}

export interface ProgressiveFeature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlockChapter: number
  category: 'basic' | 'advanced' | 'premium'
  comingSoon?: boolean
}

// Sample story chapters for progressive disclosure
const storyChapters: StoryChapter[] = [
  {
    id: 1,
    title: "Welcome to Your Mental Health Journey",
    description: "Learn the basics of mood tracking and AI conversations",
    unlockRequirement: { type: 'xp', value: 0, description: 'Start your journey' },
    rewards: { features: ['mood-checkin', 'basic-chat'], xp: 50 },
    isLocked: false,
    isCompleted: false
  },
  {
    id: 2,
    title: "Building Healthy Habits",
    description: "Discover daily challenges and streak building",
    unlockRequirement: { type: 'days', value: 3, description: '3 consecutive check-ins' },
    rewards: { features: ['daily-challenges', 'streak-tracking'], xp: 100, badge: 'Habit Builder' },
    isLocked: true,
    isCompleted: false
  },
  {
    id: 3,
    title: "Community Connection",
    description: "Connect with your team while staying anonymous",
    unlockRequirement: { type: 'xp', value: 500, description: '500 total XP' },
    rewards: { features: ['team-posts', 'anonymous-sharing'], xp: 150, badge: 'Community Member' },
    isLocked: true,
    isCompleted: false
  },
  {
    id: 4,
    title: "Advanced Insights",
    description: "Unlock detailed analytics and trend analysis",
    unlockRequirement: { type: 'level', value: 5, description: 'Reach level 5' },
    rewards: { features: ['advanced-analytics', 'mood-patterns'], xp: 200, badge: 'Data Explorer' },
    isLocked: true,
    isCompleted: false
  },
  {
    id: 5,
    title: "Expert Support Access",
    description: "Direct access to mental health professionals",
    unlockRequirement: { type: 'days', value: 14, description: '14 days of consistent use' },
    rewards: { features: ['expert-booking', 'priority-support'], xp: 300, badge: 'Wellness Champion' },
    isLocked: true,
    isCompleted: false
  }
]

const progressiveFeatures: ProgressiveFeature[] = [
  {
    id: 'mood-checkin',
    title: '気分チェック',
    description: '毎日の気分を記録して傾向を把握',
    icon: <CheckCircle className="h-5 w-5" />,
    unlockChapter: 1,
    category: 'basic'
  },
  {
    id: 'basic-chat',
    title: 'AIとの対話',
    description: 'AIキャラクターと気軽にお話',
    icon: <Sparkles className="h-5 w-5" />,
    unlockChapter: 1,
    category: 'basic'
  },
  {
    id: 'daily-challenges',
    title: 'デイリーチャレンジ',
    description: '楽しいミッションで習慣を作る',
    icon: <Star className="h-5 w-5" />,
    unlockChapter: 2,
    category: 'advanced'
  },
  {
    id: 'team-posts',
    title: 'チーム投稿',
    description: '匿名でチームと気持ちを共有',
    icon: <Crown className="h-5 w-5" />,
    unlockChapter: 3,
    category: 'advanced'
  },
  {
    id: 'expert-booking',
    title: '専門家予約',
    description: 'プロのカウンセラーとセッション',
    icon: <Crown className="h-5 w-5" />,
    unlockChapter: 5,
    category: 'premium'
  }
]

export function StoryProgressTracker({ 
  userProgress,
  onFeatureUnlock 
}: {
  userProgress: StoryProgress
  onFeatureUnlock?: (feature: string) => void
}) {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'from-blue-400 to-blue-600'
      case 'advanced': return 'from-purple-400 to-purple-600'
      case 'premium': return 'from-gold-400 to-gold-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getChapterStatus = (chapter: StoryChapter) => {
    if (chapter.isCompleted) return 'completed'
    if (userProgress.currentChapter >= chapter.id) return 'unlocked'
    return 'locked'
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Journey Progress</h2>
            <div className="text-right">
              <div className="text-2xl font-bold">Chapter {userProgress.currentChapter}</div>
              <div className="text-sm opacity-80">Level {userProgress.userLevel}</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round((userProgress.currentChapter / storyChapters.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-1000"
                style={{ width: `${(userProgress.currentChapter / storyChapters.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span>{userProgress.totalXP} Total XP</span>
            <span>{userProgress.unlockedFeatures.length} Features Unlocked</span>
          </div>
        </CardContent>
      </Card>

      {/* Story Chapters */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Story Chapters</h3>
        {storyChapters.map((chapter) => {
          const status = getChapterStatus(chapter)
          
          return (
            <motion.div
              key={chapter.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chapter.id * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  status === 'completed' 
                    ? 'bg-green-50 border-green-200' 
                    : status === 'unlocked'
                    ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
                onClick={() => status !== 'locked' && setSelectedChapter(
                  selectedChapter === chapter.id ? null : chapter.id
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : status === 'unlocked'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : status === 'locked' ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          chapter.id
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800">{chapter.title}</h4>
                        <p className="text-sm text-gray-600">{chapter.description}</p>
                        {status === 'locked' && (
                          <p className="text-xs text-gray-500 mt-1">
                            Unlock: {chapter.unlockRequirement.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {status !== 'locked' && chapter.rewards.badge && (
                        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {chapter.rewards.badge}
                        </div>
                      )}
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${
                        selectedChapter === chapter.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                  
                  {/* Expanded Chapter Details */}
                  <AnimatePresence>
                    {selectedChapter === chapter.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Unlocks:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {chapter.rewards.features.map((feature) => (
                                <li key={feature} className="flex items-center space-x-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>{progressiveFeatures.find(f => f.id === feature)?.title || feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Rewards:</h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center space-x-2">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span>+{chapter.rewards.xp} XP</span>
                              </div>
                              {chapter.rewards.badge && (
                                <div className="flex items-center space-x-2">
                                  <Crown className="h-3 w-3 text-purple-500" />
                                  <span>{chapter.rewards.badge}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {status === 'unlocked' && !chapter.isCompleted && (
                          <Button 
                            className="mt-4 w-full"
                            onClick={() => {
                              // Mark chapter as completed
                              chapter.isCompleted = true
                              chapter.rewards.features.forEach(feature => {
                                if (onFeatureUnlock) onFeatureUnlock(feature)
                              })
                            }}
                          >
                            Complete Chapter
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Feature Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Available Features</h3>
        <div className="grid grid-cols-2 gap-3">
          {progressiveFeatures.map((feature) => {
            const isUnlocked = userProgress.unlockedFeatures.includes(feature.id)
            
            return (
              <motion.div
                key={feature.id}
                whileHover={isUnlocked ? { scale: 1.02 } : {}}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
              >
                <Card className={`h-24 cursor-pointer transition-all duration-200 ${
                  isUnlocked 
                    ? 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                    : 'bg-gray-50 border-gray-100'
                }`}>
                  <CardContent className="p-3 h-full flex flex-col justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${
                        isUnlocked ? `bg-gradient-to-r ${getCategoryColor(feature.category)} text-white` : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isUnlocked ? feature.icon : <Lock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium truncate ${
                          isUnlocked ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {feature.title}
                        </h4>
                      </div>
                    </div>
                    
                    <p className={`text-xs ${
                      isUnlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {isUnlocked ? feature.description : `Unlock in Chapter ${feature.unlockChapter}`}
                    </p>
                    
                    {feature.comingSoon && (
                      <div className="text-xs text-purple-600 font-medium">
                        Coming Soon
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Guided Tour Component for first-time users
export function GuidedTour({ 
  isVisible, 
  onComplete,
  currentStep = 0
}: {
  isVisible: boolean
  onComplete: () => void
  currentStep?: number
}) {
  const tourSteps = [
    {
      title: "Welcome to MindCare! 🌟",
      description: "Let's take a quick tour to help you get started on your mental health journey.",
      action: "気分チェックから始めましょう"
    },
    {
      title: "Daily Check-ins 📝",
      description: "Record your mood daily to track patterns and receive personalized insights.",
      action: "AIキャラクターと会話してみましょう"
    },
    {
      title: "AI Companions 🤖",
      description: "Chat with Luna, Aria, or Zen for support, guidance, and meaningful conversations.",
      action: "コミュニティと繋がりましょう"
    },
    {
      title: "Anonymous Community 👥",
      description: "Share experiences and support colleagues while maintaining complete privacy.",
      action: "ツアーを完了する"
    }
  ]

  const [step, setStep] = useState(currentStep)

  const nextStep = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">
            {step === 0 ? '🌟' : step === 1 ? '📝' : step === 2 ? '🤖' : '👥'}
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {tourSteps[step].title}
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {tourSteps[step].description}
          </p>
          
          <div className="flex justify-center space-x-1 mb-6">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= step ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {tourSteps[step].action}
            </Button>
            
            {step > 0 && (
              <Button 
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="w-full"
              >
                前に戻る
              </Button>
            )}
            
            <Button 
              variant="ghost"
              onClick={onComplete}
              className="w-full text-gray-500"
            >
              ツアーをスキップ
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}