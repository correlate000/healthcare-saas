'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponsiveLayout } from '@/components/responsive/ResponsiveLayout'
import { ResponsiveCard } from '@/components/responsive/ResponsiveCard'
import { ResponsiveModal } from '@/components/responsive/ResponsiveModal'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { useResponsive } from '@/hooks/useResponsive'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Import health forms
import { SymptomRecordForm } from '@/components/health-record/SymptomRecordForm'
import { VitalSignsForm } from '@/components/health-record/VitalSignsForm'
import { MedicationForm } from '@/components/health-record/MedicationForm'
import { LifestyleForm } from '@/components/health-record/LifestyleForm'
import { MentalHealthForm } from '@/components/health-record/MentalHealthForm'

import {
  AlertCircle,
  Heart,
  Pill,
  Activity,
  Brain,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Info
} from 'lucide-react'

interface CheckInStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  component: React.ComponentType<any>
  optional?: boolean
}

const checkInSteps: CheckInStep[] = [
  {
    id: 'symptoms',
    title: '症状記録',
    description: '現在の症状や体調を記録',
    icon: <AlertCircle className="h-5 w-5" />,
    color: 'bg-red-500',
    component: SymptomRecordForm,
    optional: true
  },
  {
    id: 'vitals',
    title: 'バイタルサイン',
    description: '血圧、体温、体重などを記録',
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-pink-500',
    component: VitalSignsForm
  },
  {
    id: 'medications',
    title: '服薬記録',
    description: '服用した薬を記録',
    icon: <Pill className="h-5 w-5" />,
    color: 'bg-blue-500',
    component: MedicationForm,
    optional: true
  },
  {
    id: 'lifestyle',
    title: 'ライフスタイル',
    description: '運動、食事、睡眠を記録',
    icon: <Activity className="h-5 w-5" />,
    color: 'bg-green-500',
    component: LifestyleForm
  },
  {
    id: 'mental',
    title: 'メンタルヘルス',
    description: '気分やストレスレベルを記録',
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-purple-500',
    component: MentalHealthForm
  }
]

export default function ResponsiveCheckIn() {
  const router = useRouter()
  const { user } = useAuth()
  const { isMobile, isTablet } = useResponsive()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)

  const currentStepData = checkInSteps[currentStep]
  const progress = ((currentStep + 1) / checkInSteps.length) * 100

  const userData = user ? {
    name: user.name || 'ユーザー',
    email: user.email,
    avatar: user.avatar
  } : undefined

  const handleNext = (data?: any) => {
    if (data) {
      setFormData(prev => ({
        ...prev,
        [currentStepData.id]: data
      }))
      setCompletedSteps(prev => new Set(prev).add(currentStep))
    }

    if (currentStep < checkInSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    if (currentStepData.optional) {
      handleNext()
    }
  }

  const handleStepClick = (index: number) => {
    if (index <= currentStep || completedSteps.has(index)) {
      setCurrentStep(index)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Submit all form data
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      toast({
        title: "記録完了",
        description: "健康データが正常に記録されました。",
      })
      
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "エラー",
        description: "データの保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExit = () => {
    if (Object.keys(formData).length > 0) {
      setShowExitModal(true)
    } else {
      router.push('/dashboard')
    }
  }

  const CurrentStepComponent = currentStepData.component

  return (
    <ResponsiveLayout user={userData}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-4 sm:mx-0 sm:rounded-t-lg">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              ヘルスチェックイン
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {currentStep + 1} / {checkInSteps.length} ステップ
            </p>
          </div>
        </div>
      </div>

      {/* Step Indicators - Desktop */}
      {!isMobile && (
        <div className="hidden sm:flex justify-center py-4">
          <div className="flex items-center space-x-2">
            {checkInSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                    index === currentStep
                      ? "bg-indigo-600 text-white"
                      : completedSteps.has(index)
                      ? "bg-green-500 text-white"
                      : index < currentStep
                      ? "bg-gray-300 text-gray-600 cursor-pointer hover:bg-gray-400"
                      : "bg-gray-200 text-gray-400"
                  )}
                  disabled={index > currentStep && !completedSteps.has(index)}
                >
                  {completedSteps.has(index) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>
                {index < checkInSteps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 h-0.5 mx-2",
                      completedSteps.has(index) ? "bg-green-500" : "bg-gray-300"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Step Info - Mobile */}
      {isMobile && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-lg text-white", currentStepData.color)}>
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="font-medium text-gray-900">{currentStepData.title}</h2>
                <p className="text-xs text-gray-500">{currentStepData.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfoModal(true)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="py-4 sm:py-6"
          >
            {!isMobile && (
              <ResponsiveCard className="mb-6">
                <div className="flex items-center space-x-4">
                  <div className={cn("p-3 rounded-lg text-white", currentStepData.color)}>
                    {currentStepData.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {currentStepData.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>
              </ResponsiveCard>
            )}

            <CurrentStepComponent
              onSubmit={handleNext}
              initialData={formData[currentStepData.id]}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 sm:px-6 safe-area-inset-bottom">
        <div className="flex items-center justify-between space-x-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1 sm:flex-none"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            前へ
          </Button>

          {currentStepData.optional && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1 sm:flex-none"
            >
              スキップ
            </Button>
          )}

          <Button
            onClick={() => handleNext()}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            {currentStep === checkInSteps.length - 1 ? (
              isSubmitting ? '送信中...' : '完了'
            ) : (
              <>
                次へ
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <ResponsiveModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="チェックインを終了しますか？"
        size="sm"
      >
        <p className="text-gray-600 mb-4">
          入力したデータは保存されません。本当に終了しますか？
        </p>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowExitModal(false)}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={() => router.push('/dashboard')}
            className="flex-1"
          >
            終了する
          </Button>
        </div>
      </ResponsiveModal>

      {/* Info Modal */}
      <ResponsiveModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={currentStepData.title}
        size="sm"
      >
        <div className="space-y-4">
          <div className={cn("p-3 rounded-lg text-white inline-block", currentStepData.color)}>
            {currentStepData.icon}
          </div>
          <p className="text-gray-600">
            {currentStepData.description}
          </p>
          {currentStepData.optional && (
            <p className="text-sm text-gray-500">
              このステップはオプションです。スキップすることができます。
            </p>
          )}
        </div>
      </ResponsiveModal>
    </ResponsiveLayout>
  )
}