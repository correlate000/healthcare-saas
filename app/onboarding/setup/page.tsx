'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AppLayout } from '@/components/layout/AppLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  Users, 
  Briefcase, 
  Heart, 
  Target,
  Bell,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Globe,
  Home,
  Laptop,
  UserCheck,
  Crown
} from 'lucide-react'
import { 
  RippleButton,
  TaskCompleteAnimation,
  FloatingNotification 
} from '@/components/ui/micro-interactions'

interface SetupData {
  company: {
    industry: string
    size: string
    workStyle: string
    department: string
  }
  personal: {
    ageGroup: string
    jobCategory: string
    concerns: string[]
    character: string
  }
  preferences: {
    goals: string[]
    frequency: string
    notifications: {
      daily: boolean
      weekly: boolean
      emergency: boolean
    }
  }
}

// 業界選択肢
const industries = [
  { id: 'tech', label: 'IT・テクノロジー', icon: Laptop },
  { id: 'finance', label: '金融・保険', icon: Building2 },
  { id: 'manufacturing', label: '製造業', icon: Users },
  { id: 'healthcare', label: '医療・ヘルスケア', icon: Heart },
  { id: 'retail', label: '小売・サービス', icon: Globe },
  { id: 'consulting', label: 'コンサルティング', icon: Briefcase },
  { id: 'education', label: '教育・研究', icon: Crown },
  { id: 'other', label: 'その他', icon: Sparkles }
]

// 企業規模
const companySizes = [
  { id: 'small', label: '50名未満', description: 'スタートアップ・小規模企業' },
  { id: 'medium', label: '50〜300名', description: '中規模企業' },
  { id: 'large', label: '300〜1000名', description: '大企業' },
  { id: 'enterprise', label: '1000名以上', description: '大手企業・グループ会社' }
]

// 働き方
const workStyles = [
  { id: 'office', label: 'オフィス勤務', icon: Building2, description: '主に会社で働いています' },
  { id: 'remote', label: 'リモート勤務', icon: Home, description: '主に自宅で働いています' },
  { id: 'hybrid', label: 'ハイブリッド', icon: Laptop, description: 'オフィスと自宅を使い分けています' }
]

// 年代
const ageGroups = [
  { id: '20s', label: '20代', emoji: '🌱' },
  { id: '30s', label: '30代', emoji: '🌳' },
  { id: '40s', label: '40代', emoji: '🍂' },
  { id: '50s+', label: '50代以上', emoji: '🏔️' }
]

// 職種
const jobCategories = [
  { id: 'management', label: '管理職', icon: Crown },
  { id: 'engineer', label: 'エンジニア・技術職', icon: Laptop },
  { id: 'sales', label: '営業', icon: Users },
  { id: 'marketing', label: 'マーケティング', icon: Target },
  { id: 'design', label: 'デザイン・企画', icon: Sparkles },
  { id: 'admin', label: '事務・バックオフィス', icon: Briefcase },
  { id: 'hr', label: '人事・総務', icon: UserCheck },
  { id: 'other', label: 'その他', icon: Globe }
]

// 悩み・関心事
const concerns = [
  { id: 'stress', label: 'ストレス管理', emoji: '😰' },
  { id: 'worklife', label: 'ワークライフバランス', emoji: '⚖️' },
  { id: 'communication', label: '職場の人間関係', emoji: '👥' },
  { id: 'performance', label: 'パフォーマンス向上', emoji: '📈' },
  { id: 'anxiety', label: '不安・心配事', emoji: '😟' },
  { id: 'sleep', label: '睡眠の質', emoji: '😴' },
  { id: 'motivation', label: 'モチベーション', emoji: '🔥' },
  { id: 'change', label: '変化への適応', emoji: '🔄' }
]

// AIキャラクター
const characters = [
  {
    id: 'luna',
    name: 'Luna',
    avatar: '🌙',
    personality: '優しく共感的',
    description: '静かで思慮深く、あなたの感情に寄り添います',
    color: 'from-purple-400 to-purple-600',
    suitable: '内向的、深く考える方におすすめ'
  },
  {
    id: 'aria',
    name: 'Aria',
    avatar: '⭐',
    personality: '明るく励ましてくれる',
    description: 'エネルギッシュで前向き、やる気を引き出します',
    color: 'from-teal-400 to-teal-600',
    suitable: 'アクティブ、チャレンジ好きな方におすすめ'
  },
  {
    id: 'zen',
    name: 'Zen',
    avatar: '🧘‍♂️',
    personality: '落ち着いていて知的',
    description: '冷静で客観的、論理的なアドバイスをします',
    color: 'from-indigo-400 to-indigo-600',
    suitable: '分析的、効率重視の方におすすめ'
  }
]

// メンタルヘルス目標
const goals = [
  { id: 'reduce_stress', label: 'ストレス軽減', emoji: '😌' },
  { id: 'improve_mood', label: '気分の安定', emoji: '😊' },
  { id: 'better_sleep', label: '睡眠改善', emoji: '😴' },
  { id: 'work_efficiency', label: '仕事効率UP', emoji: '⚡' },
  { id: 'team_harmony', label: 'チーム関係改善', emoji: '🤝' },
  { id: 'self_awareness', label: '自己理解を深める', emoji: '🪞' }
]

export default function SetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [setupData, setSetupData] = useState<SetupData>({
    company: { industry: '', size: '', workStyle: '', department: '' },
    personal: { ageGroup: '', jobCategory: '', concerns: [], character: '' },
    preferences: { 
      goals: [], 
      frequency: '', 
      notifications: { daily: true, weekly: true, emergency: true } 
    }
  })
  
  const [showCompletion, setShowCompletion] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const totalSteps = 8
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // セットアップデータを保存
    localStorage.setItem('mindcare-setup', JSON.stringify(setupData))
    
    setShowCompletion(true)
    setTimeout(() => {
      setShowNotification(true)
    }, 2000)
    
    setTimeout(() => {
      router.push('/onboarding/widget-setup')
    }, 4000)
  }

  const updateSetupData = (category: keyof SetupData, field: string, value: any) => {
    setSetupData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const toggleArrayItem = (category: keyof SetupData, field: string, item: string) => {
    setSetupData(prev => {
      const currentArray = (prev[category] as any)[field] || []
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i: string) => i !== item)
        : [...currentArray, item]
      
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: newArray
        }
      }
    })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return setupData.company.industry !== ''
      case 2: return setupData.company.size !== ''
      case 3: return setupData.company.workStyle !== ''
      case 4: return setupData.personal.ageGroup !== ''
      case 5: return setupData.personal.jobCategory !== ''
      case 6: return setupData.personal.concerns.length > 0
      case 7: return setupData.personal.character !== ''
      case 8: return setupData.preferences.goals.length > 0
      default: return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">あなたの業界を教えてください</h2>
              <p className="text-gray-600">データは完全に匿名化されます</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {industries.map((industry) => (
                <RippleButton
                  key={industry.id}
                  onClick={() => updateSetupData('company', 'industry', industry.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    setupData.company.industry === industry.id
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <industry.icon className={`h-6 w-6 ${
                      setupData.company.industry === industry.id ? 'text-white' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      setupData.company.industry === industry.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {industry.label}
                    </span>
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">企業規模はどちらですか？</h2>
              <p className="text-gray-600">おおよその従業員数を教えてください</p>
            </div>
            
            <div className="space-y-3">
              {companySizes.map((size) => (
                <RippleButton
                  key={size.id}
                  onClick={() => updateSetupData('company', 'size', size.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    setupData.company.size === size.id
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div className={`font-semibold ${
                      setupData.company.size === size.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {size.label}
                    </div>
                    <div className={`text-sm ${
                      setupData.company.size === size.id ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      {size.description}
                    </div>
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">働き方を教えてください</h2>
              <p className="text-gray-600">主な勤務スタイルはどちらですか？</p>
            </div>
            
            <div className="space-y-3">
              {workStyles.map((style) => (
                <RippleButton
                  key={style.id}
                  onClick={() => updateSetupData('company', 'workStyle', style.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    setupData.company.workStyle === style.id
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <style.icon className={`h-8 w-8 ${
                      setupData.company.workStyle === style.id ? 'text-white' : 'text-gray-600'
                    }`} />
                    <div className="text-left">
                      <div className={`font-semibold ${
                        setupData.company.workStyle === style.id ? 'text-white' : 'text-gray-800'
                      }`}>
                        {style.label}
                      </div>
                      <div className={`text-sm ${
                        setupData.company.workStyle === style.id ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        {style.description}
                      </div>
                    </div>
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">年代を教えてください</h2>
              <p className="text-gray-600">適切なサポートを提供するため</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {ageGroups.map((age) => (
                <RippleButton
                  key={age.id}
                  onClick={() => updateSetupData('personal', 'ageGroup', age.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    setupData.personal.ageGroup === age.id
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <span className="text-3xl">{age.emoji}</span>
                    <span className={`font-semibold ${
                      setupData.personal.ageGroup === age.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {age.label}
                    </span>
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">職種を教えてください</h2>
              <p className="text-gray-600">より関連性の高いサポートを提供します</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {jobCategories.map((job) => (
                <RippleButton
                  key={job.id}
                  onClick={() => updateSetupData('personal', 'jobCategory', job.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    setupData.personal.jobCategory === job.id
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <job.icon className={`h-6 w-6 ${
                      setupData.personal.jobCategory === job.id ? 'text-white' : 'text-gray-600'
                    }`} />
                    <span className={`text-xs font-medium text-center ${
                      setupData.personal.jobCategory === job.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {job.label}
                    </span>
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">関心のあるテーマは？</h2>
              <p className="text-gray-600">複数選択可能です</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {concerns.map((concern) => (
                <RippleButton
                  key={concern.id}
                  onClick={() => toggleArrayItem('personal', 'concerns', concern.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    setupData.personal.concerns.includes(concern.id)
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">{concern.emoji}</span>
                    <span className={`text-xs font-medium text-center ${
                      setupData.personal.concerns.includes(concern.id) ? 'text-white' : 'text-gray-800'
                    }`}>
                      {concern.label}
                    </span>
                    {setupData.personal.concerns.includes(concern.id) && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 7:
        return (
          <motion.div
            key="step7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">AIパートナーを選んでください</h2>
              <p className="text-gray-600">いつでも変更できます</p>
            </div>
            
            <div className="space-y-4">
              {characters.map((character) => (
                <RippleButton
                  key={character.id}
                  onClick={() => updateSetupData('personal', 'character', character.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    setupData.personal.character === character.id
                      ? `bg-gradient-to-r ${character.color} border-transparent text-white`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{character.avatar}</div>
                    <div className="flex-1 text-left">
                      <div className={`font-semibold ${
                        setupData.personal.character === character.id ? 'text-white' : 'text-gray-800'
                      }`}>
                        {character.name} - {character.personality}
                      </div>
                      <div className={`text-sm ${
                        setupData.personal.character === character.id ? 'text-white opacity-90' : 'text-gray-600'
                      }`}>
                        {character.description}
                      </div>
                      <div className={`text-xs mt-1 ${
                        setupData.personal.character === character.id ? 'text-white opacity-75' : 'text-gray-500'
                      }`}>
                        {character.suitable}
                      </div>
                    </div>
                    {setupData.personal.character === character.id && (
                      <CheckCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 8:
        return (
          <motion.div
            key="step8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">目標を設定しましょう</h2>
              <p className="text-gray-600">達成したいことを選んでください（複数選択可）</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <RippleButton
                  key={goal.id}
                  onClick={() => toggleArrayItem('preferences', 'goals', goal.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    setupData.preferences.goals.includes(goal.id)
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">{goal.emoji}</span>
                    <span className={`text-xs font-medium text-center ${
                      setupData.preferences.goals.includes(goal.id) ? 'text-white' : 'text-gray-800'
                    }`}>
                      {goal.label}
                    </span>
                    {setupData.preferences.goals.includes(goal.id) && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <AppLayout title="初回セットアップ">
      <div className="px-4 py-6 max-w-md mx-auto">
        
        {/* 完了アニメーション */}
        <TaskCompleteAnimation
          isVisible={showCompletion}
          onComplete={() => setShowCompletion(false)}
          xpGained={100}
          taskTitle="セットアップ完了！"
        />

        <FloatingNotification
          isVisible={showNotification}
          title="セットアップ完了"
          message="ウィジェット設定に進みます"
          type="achievement"
          onClose={() => setShowNotification(false)}
        />

        <div className="space-y-6">
          {/* プログレス */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  ステップ {currentStep} / {totalSteps}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="mt-3 text-xs text-gray-500">
                すべてのデータは匿名化され、個人を特定することはできません
              </div>
            </CardContent>
          </Card>

          {/* ステップコンテンツ */}
          <Card>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* ナビゲーションボタン */}
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <RippleButton
                onClick={handleBack}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>戻る</span>
              </RippleButton>
            )}
            
            <RippleButton
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                canProceed()
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === totalSteps ? 'セットアップ完了' : '次へ'}</span>
              {currentStep < totalSteps && <ArrowRight className="h-4 w-4" />}
              {currentStep === totalSteps && <CheckCircle className="h-4 w-4" />}
            </RippleButton>
          </div>

          {/* ヒント */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">💡 プライバシー保護</h4>
                  <p className="text-sm text-blue-700">
                    入力された情報は暗号化され、個人を特定できない形で統計処理されます。
                    企業には集計データのみが提供され、個人の回答内容は一切共有されません。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}