'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SymptomRecordForm } from '@/components/health-record/SymptomRecordForm'
import { VitalSignsForm } from '@/components/health-record/VitalSignsForm'
import { MedicationForm } from '@/components/health-record/MedicationForm'
import { LifestyleForm } from '@/components/health-record/LifestyleForm'
import { MentalHealthForm } from '@/components/health-record/MentalHealthForm'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { healthDataService } from '@/lib/healthData'
import { 
  AlertCircle,
  Activity,
  Pill,
  Heart,
  Brain,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  ArrowLeft
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
    description: '血圧、心拍数、体温など',
    icon: <Activity className="h-5 w-5" />,
    color: 'bg-blue-500',
    component: VitalSignsForm
  },
  {
    id: 'medications',
    title: '服薬管理',
    description: '服用中の薬を記録',
    icon: <Pill className="h-5 w-5" />,
    color: 'bg-purple-500',
    component: MedicationForm,
    optional: true
  },
  {
    id: 'lifestyle',
    title: 'ライフスタイル',
    description: '運動、食事、睡眠など',
    icon: <Heart className="h-5 w-5" />,
    color: 'bg-green-500',
    component: LifestyleForm
  },
  {
    id: 'mental',
    title: 'メンタルヘルス',
    description: '気分や心の健康状態',
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-pink-500',
    component: MentalHealthForm
  }
]

function CheckIn() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkInData, setCheckInData] = useState<Record<string, any>>({})

  const currentStepData = checkInSteps[currentStep]
  const StepComponent = currentStepData.component

  const handleStepSubmit = async (data: any) => {
    try {
      // Save data for this step
      setCheckInData(prev => ({
        ...prev,
        [currentStepData.id]: data
      }))

      // Mark step as completed
      setCompletedSteps(prev => [...prev, currentStepData.id])

      // Show success message
      toast({
        title: `${currentStepData.title}を記録しました`,
        description: "データが正常に保存されました。",
      })

      // Move to next step or complete check-in
      if (currentStep < checkInSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        await completeCheckIn()
      }
    } catch (error) {
      console.error('Error submitting step data:', error)
      toast({
        title: "エラーが発生しました",
        description: "データの保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    }
  }

  const handleSkipStep = () => {
    if (currentStepData.optional) {
      if (currentStep < checkInSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        completeCheckIn()
      }
    }
  }

  const completeCheckIn = async () => {
    setIsSubmitting(true)
    try {
      // Submit all collected data to the backend
      const promises = []
      
      if (checkInData.symptoms) {
        promises.push(healthDataService.recordSymptoms(checkInData.symptoms))
      }
      if (checkInData.vitals) {
        promises.push(healthDataService.recordVitalSigns(checkInData.vitals))
      }
      if (checkInData.medications) {
        promises.push(healthDataService.recordMedications(checkInData.medications))
      }
      if (checkInData.lifestyle) {
        promises.push(healthDataService.recordLifestyle(checkInData.lifestyle))
      }
      if (checkInData.mental) {
        promises.push(healthDataService.recordMentalHealth(checkInData.mental))
      }

      await Promise.all(promises)

      toast({
        title: "チェックイン完了！",
        description: `${completedSteps.length}項目のデータを記録しました。`,
      })

      // Redirect to dashboard with success state
      router.push('/dashboard?checkin=success')
    } catch (error) {
      console.error('Error completing check-in:', error)
      toast({
        title: "チェックインに失敗しました",
        description: "一部のデータの保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateProgress = () => {
    return Math.round(((currentStep + 1) / checkInSteps.length) * 100)
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-800 text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">健康チェックイン</h1>
                <p className="text-sm text-gray-400">
                  {new Date().toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-600 text-white">
              {currentStep + 1}/{checkInSteps.length}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">進捗</span>
              <span className="text-sm font-medium text-emerald-400">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {checkInSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center ${index < checkInSteps.length - 1 ? 'mr-2' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    completedSteps.includes(step.id)
                      ? 'bg-emerald-600 text-white'
                      : index === currentStep
                      ? `${step.color} text-white`
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {completedSteps.includes(step.id) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < checkInSteps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ${
                      completedSteps.includes(step.id) ? 'bg-emerald-600' : 'bg-gray-700'
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Current Step Header */}
          <Card className="bg-gray-700/95 border-gray-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${currentStepData.color} text-white mr-3`}>
                    {currentStepData.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{currentStepData.description}</p>
                  </div>
                </div>
                {currentStepData.optional && (
                  <Badge variant="outline" className="text-gray-400 border-gray-600">
                    任意
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Step Component */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepComponent
                onSubmit={handleStepSubmit}
                onCancel={goToPreviousStep}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 0 || isSubmitting}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              前へ
            </Button>

            {currentStepData.optional && currentStep < checkInSteps.length - 1 && (
              <Button
                variant="ghost"
                onClick={handleSkipStep}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-white"
              >
                スキップ
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Tips Card */}
          <Card className="bg-blue-500/10 border border-blue-400/30">
            <CardContent className="p-4">
              <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                健康記録のヒント
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 毎日同じ時間に記録すると、より正確な健康トレンドが把握できます</li>
                <li>• 症状は軽微なものでも記録しておくと、パターンの発見に役立ちます</li>
                <li>• 正直に記録することが、効果的な健康管理の第一歩です</li>
              </ul>
            </CardContent>
          </Card>

          {/* Bottom spacing for navigation */}
          <div className="h-24"></div>
        </div>

        {/* Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </ProtectedRoute>
  )
}

export default CheckIn