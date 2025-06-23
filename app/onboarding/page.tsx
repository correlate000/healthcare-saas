'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  MessageCircle, 
  BarChart3, 
  Shield,
  Bell,
  Sparkles,
  CheckCircle,
  Star
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Onboarding steps data
const onboardingSteps = [
  {
    id: 'welcome',
    title: 'ようこそ MindCare へ',
    subtitle: 'あなたの心の健康パートナー',
    description: 'AIキャラクターとの温かい対話を通して、毎日の心の状態をケアします。',
    icon: <Heart className="h-16 w-16 text-pink-500" />,
    features: [
      '30秒で完了する簡単チェックイン',
      'AIキャラクターとの癒しの対話',
      '専門家による個別サポート'
    ]
  },
  {
    id: 'characters',
    title: 'AIキャラクターを選択',
    subtitle: 'あなたの相談相手を選んでください',
    description: '3人のAIキャラクターから、あなたに最も合う相手を選択できます。',
    icon: <MessageCircle className="h-16 w-16 text-purple-500" />,
    characters: [
      {
        id: 'luna',
        name: 'Luna',
        personality: '優しく包み込むような',
        description: '穏やかで思いやりのある対話を心がけます。困ったときはいつでも寄り添います。',
        color: 'bg-purple-500'
      },
      {
        id: 'aria',
        name: 'Aria', 
        personality: '明るく前向きな',
        description: '元気で楽観的な視点を提供します。一緒に前向きに歩んでいきましょう。',
        color: 'bg-teal-500'
      },
      {
        id: 'zen',
        name: 'Zen',
        personality: '落ち着いた',
        description: '冷静で深い洞察を共有します。静かに、でも確実にサポートします。',
        color: 'bg-indigo-500'
      }
    ]
  },
  {
    id: 'notifications',
    title: '通知設定',
    subtitle: 'あなたに合ったタイミングで',
    description: 'チェックインのリマインダーや励ましメッセージの配信タイミングを設定します。',
    icon: <Bell className="h-16 w-16 text-blue-500" />,
    notificationOptions: [
      { id: 'morning', label: '朝のチェックイン', time: '09:00', enabled: true },
      { id: 'lunch', label: 'お昼の振り返り', time: '12:30', enabled: false },
      { id: 'evening', label: '夕方のケア', time: '18:00', enabled: true },
      { id: 'encouragement', label: '励ましメッセージ', time: '随時', enabled: true }
    ]
  },
  {
    id: 'privacy',
    title: 'プライバシーとセキュリティ',
    subtitle: 'あなたのデータを安全に保護',
    description: 'すべてのデータは暗号化され、あなたの同意なしに第三者と共有されることはありません。',
    icon: <Shield className="h-16 w-16 text-green-500" />,
    privacyPoints: [
      'エンドツーエンド暗号化でデータを保護',
      '匿名化された分析データのみを使用', 
      'いつでもデータの削除・エクスポートが可能',
      'GDPR・個人情報保護法に完全準拠'
    ]
  },
  {
    id: 'complete',
    title: '準備完了！',
    subtitle: 'あなたの心のケアを始めましょう',
    description: 'セットアップが完了しました。今すぐ最初のチェックインを始めて、AIキャラクターと出会いましょう。',
    icon: <Sparkles className="h-16 w-16 text-yellow-500" />,
    benefits: [
      '毎日の継続でストリークを獲得',
      'バッジとレベルアップで達成感',
      '専門家による個別サポート',
      '詳細な分析で成長を実感'
    ]
  }
]

export default function Onboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCharacter, setSelectedCharacter] = useState('luna')
  const [notifications, setNotifications] = useState({
    morning: true,
    lunch: false,
    evening: true,
    encouragement: true
  })

  const currentStepData = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      router.push('/onboarding/setup')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    router.push('/onboarding/setup')
  }

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {currentStep > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePrevious}
                  className="mr-3"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h1 className="font-medium text-gray-900">セットアップ</h1>
                <p className="text-xs text-gray-500">ステップ {currentStep + 1} / {onboardingSteps.length}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              スキップ
            </Button>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Welcome Step */}
        {currentStepData.id === 'welcome' && (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="mx-auto">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{currentStepData.subtitle}</p>
                <p className="text-gray-700 leading-relaxed">{currentStepData.description}</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">主な機能</h3>
                <div className="space-y-3">
                  {currentStepData.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Character Selection Step */}
        {currentStepData.id === 'characters' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
                <p className="text-gray-600">{currentStepData.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {currentStepData.characters?.map((character) => (
                <Card 
                  key={character.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedCharacter === character.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCharacter(character.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className={`${character.color} text-white text-xl`}>
                          {character.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{character.name}</h3>
                          {selectedCharacter === character.id && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{character.personality}</p>
                        <p className="text-sm text-gray-700">{character.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Step */}
        {currentStepData.id === 'notifications' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
                <p className="text-gray-600">{currentStepData.description}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
                <CardDescription>後から設定で変更できます</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStepData.notificationOptions?.map((option) => (
                  <div key={option.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.time}</div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(option.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[option.id as keyof typeof notifications]
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications[option.id as keyof typeof notifications]
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Step */}
        {currentStepData.id === 'privacy' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
                <p className="text-gray-600">{currentStepData.description}</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {currentStepData.privacyPoints?.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Complete Step */}
        {currentStepData.id === 'complete' && (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="mx-auto">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{currentStepData.subtitle}</p>
                <p className="text-gray-700">{currentStepData.description}</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>これから始まること</span>
                </h3>
                <div className="space-y-3">
                  {currentStepData.benefits?.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex space-x-3">
          {currentStep < onboardingSteps.length - 1 ? (
            <Button onClick={handleNext} className="flex-1" size="lg">
              <span>次へ</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1 bg-green-500 hover:bg-green-600" size="lg">
              <span>始める</span>
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}