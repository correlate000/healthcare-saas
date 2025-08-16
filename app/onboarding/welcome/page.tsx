'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getTypographyStyles } from '@/styles/typography'
import { 
  ArrowRight, 
  Heart, 
  Brain, 
  Target, 
  Users, 
  Sparkles,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Award
} from 'lucide-react'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'ようこそMindCareへ',
    description: 'あなたの心の健康をサポートする旅が始まります',
    icon: <Sparkles className="h-12 w-12" />,
    color: '#a3e635'
  },
  {
    id: 2,
    title: 'パーソナライズされたケア',
    description: 'AIがあなたに最適なサポートを提供します',
    icon: <Brain className="h-12 w-12" />,
    color: '#60a5fa'
  },
  {
    id: 3,
    title: '目標を設定しましょう',
    description: 'あなたが達成したいことを教えてください',
    icon: <Target className="h-12 w-12" />,
    color: '#a78bfa'
  },
  {
    id: 4,
    title: 'チームとつながる',
    description: '仲間と一緒に成長しましょう',
    icon: <Users className="h-12 w-12" />,
    color: '#fbbf24'
  }
]

export default function WelcomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState('')
  const [userName, setUserName] = useState('')
  const [isCompleting, setIsCompleting] = useState(false)

  const goals = [
    { id: 'stress', label: 'ストレス管理', icon: '😌', description: '日々のストレスと上手に付き合う' },
    { id: 'sleep', label: '睡眠改善', icon: '😴', description: '質の良い睡眠を確保する' },
    { id: 'focus', label: '集中力向上', icon: '🎯', description: '仕事の生産性を高める' },
    { id: 'mood', label: '気分改善', icon: '😊', description: 'ポジティブな気持ちを維持' },
    { id: 'exercise', label: '運動習慣', icon: '💪', description: '定期的な運動を続ける' },
    { id: 'mindfulness', label: 'マインドフルネス', icon: '🧘', description: '今この瞬間に集中する' },
    { id: 'relationship', label: '人間関係', icon: '🤝', description: 'より良い関係を築く' },
    { id: 'work-life', label: 'ワークライフバランス', icon: '⚖️', description: '仕事と生活の調和' }
  ]

  const timePreferences = [
    { id: 'morning', label: '朝（6:00-9:00）', icon: '🌅' },
    { id: 'lunch', label: '昼休み（12:00-13:00）', icon: '☀️' },
    { id: 'evening', label: '夕方（18:00-20:00）', icon: '🌆' },
    { id: 'night', label: '夜（20:00-22:00）', icon: '🌙' }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const completeOnboarding = async () => {
    setIsCompleting(true)
    
    // 設定を保存
    const settings = {
      userName,
      goals: selectedGoals,
      preferredTime: selectedTime,
      onboardingCompleted: true,
      completedAt: new Date().toISOString()
    }
    
    localStorage.setItem('userSettings', JSON.stringify(settings))
    
    // アニメーション後にダッシュボードへ
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="mb-8">
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: steps[0].color + '20' }}
              >
                <Sparkles className="h-12 w-12" style={{ color: steps[0].color }} />
              </div>
              <h1 style={{
                ...getTypographyStyles('h1'),
                fontWeight: '800',
                marginBottom: '16px',
                background: `linear-gradient(135deg, ${steps[0].color} 0%, #60a5fa 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ようこそ、MindCareへ！
              </h1>
              <p style={{
                ...getTypographyStyles('large'),
                color: '#6b7280',
                marginBottom: '32px',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                あなたの心の健康をサポートする
                パーソナルアシスタントです
              </p>
            </div>
            
            <div className="mb-8">
              <input
                type="text"
                placeholder="お名前を教えてください"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = steps[0].color
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-green-50 rounded-xl p-4">
                <Shield className="h-8 w-8 text-green-600 mb-2" />
                <div style={getTypographyStyles('small')}>
                  <div className="font-semibold text-gray-800">プライバシー保護</div>
                  <div className="text-gray-600">データは暗号化されます</div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <Award className="h-8 w-8 text-blue-600 mb-2" />
                <div style={getTypographyStyles('small')}>
                  <div className="font-semibold text-gray-800">科学的根拠</div>
                  <div className="text-gray-600">エビデンスベースのケア</div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="mb-8">
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: steps[1].color + '20' }}
              >
                <Brain className="h-12 w-12" style={{ color: steps[1].color }} />
              </div>
              <h2 style={{
                ...getTypographyStyles('h2'),
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                {userName ? `${userName}さんに` : 'あなたに'}最適化
              </h2>
              <p style={{
                ...getTypographyStyles('base'),
                color: '#6b7280',
                maxWidth: '400px',
                margin: '0 auto 32px'
              }}>
                AIがあなたの状態を理解し、
                パーソナライズされたサポートを提供します
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800">AI対話サポート</div>
                  <div className="text-sm text-gray-600">24時間いつでも相談可能</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800">進捗トラッキング</div>
                  <div className="text-sm text-gray-600">あなたの成長を可視化</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800">カスタマイズ</div>
                  <div className="text-sm text-gray-600">目標に合わせた最適化</div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: steps[2].color + '20' }}
              >
                <Target className="h-12 w-12" style={{ color: steps[2].color }} />
              </div>
              <h2 style={{
                ...getTypographyStyles('h2'),
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                目標を選びましょう
              </h2>
              <p style={{
                ...getTypographyStyles('base'),
                color: '#6b7280'
              }}>
                達成したいことを3つまで選んでください
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  disabled={!selectedGoals.includes(goal.id) && selectedGoals.length >= 3}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: selectedGoals.includes(goal.id) 
                      ? `2px solid ${steps[2].color}`
                      : '2px solid #e5e7eb',
                    backgroundColor: selectedGoals.includes(goal.id)
                      ? steps[2].color + '10'
                      : 'white',
                    cursor: !selectedGoals.includes(goal.id) && selectedGoals.length >= 3 
                      ? 'not-allowed' 
                      : 'pointer',
                    opacity: !selectedGoals.includes(goal.id) && selectedGoals.length >= 3 
                      ? 0.5 
                      : 1,
                    transition: 'all 0.3s ease',
                    textAlign: 'left'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span style={{ fontSize: '24px' }}>{goal.icon}</span>
                    <div>
                      <div style={{
                        ...getTypographyStyles('base'),
                        fontWeight: '600',
                        color: selectedGoals.includes(goal.id) ? steps[2].color : '#374151'
                      }}>
                        {goal.label}
                      </div>
                      <div style={{
                        ...getTypographyStyles('small'),
                        color: '#6b7280',
                        marginTop: '2px'
                      }}>
                        {goal.description}
                      </div>
                    </div>
                    {selectedGoals.includes(goal.id) && (
                      <CheckCircle 
                        className="h-5 w-5 flex-shrink-0" 
                        style={{ color: steps[2].color }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {selectedGoals.length > 0 && (
              <div className="text-center">
                <div style={{
                  ...getTypographyStyles('small'),
                  color: steps[2].color,
                  fontWeight: '600'
                }}>
                  {selectedGoals.length}/3 目標を選択中
                </div>
              </div>
            )}
          </motion.div>
        )
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: steps[3].color + '20' }}
              >
                <Clock className="h-12 w-12" style={{ color: steps[3].color }} />
              </div>
              <h2 style={{
                ...getTypographyStyles('h2'),
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                いつ利用しますか？
              </h2>
              <p style={{
                ...getTypographyStyles('base'),
                color: '#6b7280'
              }}>
                リマインダーを送る最適な時間帯を教えてください
              </p>
            </div>
            
            <div className="space-y-3 max-w-md mx-auto mb-8">
              {timePreferences.map((time) => (
                <button
                  key={time.id}
                  onClick={() => setSelectedTime(time.id)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: selectedTime === time.id 
                      ? `2px solid ${steps[3].color}`
                      : '2px solid #e5e7eb',
                    backgroundColor: selectedTime === time.id
                      ? steps[3].color + '10'
                      : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{time.icon}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{
                      ...getTypographyStyles('base'),
                      fontWeight: '600',
                      color: selectedTime === time.id ? steps[3].color : '#374151'
                    }}>
                      {time.label}
                    </div>
                  </div>
                  {selectedTime === time.id && (
                    <CheckCircle 
                      className="h-6 w-6" 
                      style={{ color: steps[3].color }}
                    />
                  )}
                </button>
              ))}
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div style={{
                    ...getTypographyStyles('small'),
                    fontWeight: '600',
                    color: '#1e40af',
                    marginBottom: '4px'
                  }}>
                    スマートリマインダー
                  </div>
                  <div style={{
                    ...getTypographyStyles('small'),
                    color: '#3b82f6'
                  }}>
                    あなたの利用パターンを学習して、最適なタイミングで通知します
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 50%, #fef3c7 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {!isCompleting ? (
        <>
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto w-full mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center"
                  style={{ flex: index < steps.length - 1 ? 1 : 0 }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: index <= currentStep ? step.color : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <span style={{
                        color: index === currentStep ? 'white' : '#9ca3af',
                        fontWeight: '600'
                      }}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: '2px',
                        backgroundColor: index < currentStep ? step.color : '#e5e7eb',
                        margin: '0 8px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-xl p-8">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
            
            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: currentStep === 0 ? '#9ca3af' : '#374151',
                  fontWeight: '600',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === 0 ? 0.5 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                戻る
              </button>
              
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !userName) ||
                  (currentStep === 2 && selectedGoals.length === 0) ||
                  (currentStep === 3 && !selectedTime)
                }
                style={{
                  padding: '12px 32px',
                  borderRadius: '12px',
                  backgroundColor: steps[currentStep].color,
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: 
                    (currentStep === 0 && !userName) ||
                    (currentStep === 2 && selectedGoals.length === 0) ||
                    (currentStep === 3 && !selectedTime) 
                      ? 0.5 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {currentStep === steps.length - 1 ? '始める' : '次へ'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center"
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </motion.div>
            <h2 style={{
              ...getTypographyStyles('h2'),
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              準備完了！
            </h2>
            <p style={{
              ...getTypographyStyles('base'),
              color: '#6b7280'
            }}>
              {userName ? `${userName}さんの` : 'あなたの'}
              パーソナライズされた体験を開始します
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}