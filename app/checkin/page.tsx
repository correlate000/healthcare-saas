'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle,
  Star,
  Zap,
  Moon,
  Sun,
  Cloud,
  Droplets,
  Plus,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TaskCompleteAnimation,
  CharacterReaction,
  FloatingNotification,
  RippleButton 
} from '@/components/ui/micro-interactions'

// 気分選択肢
const moodOptions = [
  { id: 1, label: 'とても良い', emoji: '😄', value: 5, color: 'bg-green-500', textColor: 'text-green-600' },
  { id: 2, label: '良い', emoji: '😊', value: 4, color: 'bg-lime-500', textColor: 'text-lime-600' },
  { id: 3, label: '普通', emoji: '😐', value: 3, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  { id: 4, label: '少し悪い', emoji: '😕', value: 2, color: 'bg-orange-500', textColor: 'text-orange-600' },
  { id: 5, label: '悪い', emoji: '😢', value: 1, color: 'bg-red-500', textColor: 'text-red-600' }
]

// エネルギーレベル
const energyLevels = [
  { label: '高い', icon: Zap, color: 'text-yellow-500' },
  { label: '普通', icon: Sun, color: 'text-orange-500' },
  { label: '低い', icon: Moon, color: 'text-blue-500' }
]

// ストレスレベル
const stressLevels = [
  { label: '低い', icon: Sun, color: 'text-green-500' },
  { label: '普通', icon: Cloud, color: 'text-yellow-500' },
  { label: '高い', icon: Droplets, color: 'text-red-500' }
]

// 今日の活動
const activities = [
  { id: 'work', label: '仕事', selected: false },
  { id: 'exercise', label: '運動', selected: false },
  { id: 'social', label: '人との交流', selected: false },
  { id: 'hobby', label: '趣味', selected: false },
  { id: 'family', label: '家族時間', selected: false },
  { id: 'rest', label: '休息', selected: false },
  { id: 'study', label: '学習', selected: false },
  { id: 'meditation', label: '瞑想', selected: false }
]

export default function CheckinPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null)
  const [selectedStress, setSelectedStress] = useState<number | null>(null)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [customNote, setCustomNote] = useState('')
  const [showCompletion, setShowCompletion] = useState(false)
  const [showCharacterReaction, setShowCharacterReaction] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const totalSteps = 5
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
    // Save checkin data
    const checkinData = {
      date: new Date().toISOString(),
      mood: selectedMood,
      energy: selectedEnergy,
      stress: selectedStress,
      activities: selectedActivities,
      note: customNote
    }
    
    // Store checkin for today
    const today = new Date().toDateString()
    localStorage.setItem('mindcare-last-checkin', today)
    
    // Store checkin data
    const existingCheckins = JSON.parse(localStorage.getItem('mindcare-checkins') || '[]')
    existingCheckins.push(checkinData)
    localStorage.setItem('mindcare-checkins', JSON.stringify(existingCheckins))
    
    setShowCompletion(true)
    
    setTimeout(() => {
      setShowCharacterReaction(true)
      setTimeout(() => setShowCharacterReaction(false), 3000)
    }, 1000)
    
    setTimeout(() => {
      setShowNotification(true)
    }, 2000)
    
    // Redirect to dashboard after animations
    setTimeout(() => {
      router.push('/dashboard')
    }, 4000)
  }

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    )
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedMood !== null
      case 2: return selectedEnergy !== null
      case 3: return selectedStress !== null
      case 4: return true // 活動選択は任意
      case 5: return true // メモは任意
      default: return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">今日の気分はいかがですか？</h2>
              <p className="text-gray-600">正直な気持ちを教えてください</p>
            </div>
            
            <div className="space-y-3">
              {moodOptions.map((mood) => (
                <RippleButton
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedMood === mood.value
                      ? `${mood.color} border-transparent text-white`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{mood.emoji}</span>
                    <div className="flex-1 text-left">
                      <div className={`font-semibold ${selectedMood === mood.value ? 'text-white' : 'text-gray-800'}`}>
                        {mood.label}
                      </div>
                    </div>
                    {selectedMood === mood.value && (
                      <CheckCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">エネルギーレベルは？</h2>
              <p className="text-gray-600">今日の活力を教えてください</p>
            </div>
            
            <div className="space-y-3">
              {energyLevels.map((level, index) => (
                <RippleButton
                  key={index}
                  onClick={() => setSelectedEnergy(index)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedEnergy === index
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <level.icon className={`h-8 w-8 ${selectedEnergy === index ? 'text-white' : level.color}`} />
                    <div className="flex-1 text-left">
                      <div className={`font-semibold ${selectedEnergy === index ? 'text-white' : 'text-gray-800'}`}>
                        {level.label}
                      </div>
                    </div>
                    {selectedEnergy === index && (
                      <CheckCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ストレスレベルは？</h2>
              <p className="text-gray-600">今感じているストレスを教えてください</p>
            </div>
            
            <div className="space-y-3">
              {stressLevels.map((level, index) => (
                <RippleButton
                  key={index}
                  onClick={() => setSelectedStress(index)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedStress === index
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <level.icon className={`h-8 w-8 ${selectedStress === index ? 'text-white' : level.color}`} />
                    <div className="flex-1 text-left">
                      <div className={`font-semibold ${selectedStress === index ? 'text-white' : 'text-gray-800'}`}>
                        {level.label}
                      </div>
                    </div>
                    {selectedStress === index && (
                      <CheckCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">今日何をしましたか？</h2>
              <p className="text-gray-600">活動を選択してください（複数選択可）</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {activities.map((activity) => (
                <RippleButton
                  key={activity.id}
                  onClick={() => handleActivityToggle(activity.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedActivities.includes(activity.id)
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`font-medium ${
                      selectedActivities.includes(activity.id) ? 'text-white' : 'text-gray-800'
                    }`}>
                      {activity.label}
                    </div>
                    {selectedActivities.includes(activity.id) && (
                      <CheckCircle className="h-5 w-5 text-white mx-auto mt-2" />
                    )}
                  </div>
                </RippleButton>
              ))}
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">何か記録したいことは？</h2>
              <p className="text-gray-600">今日の特別な出来事や感想（任意）</p>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="今日感じたこと、特別な出来事、明日への想いなど、自由にお書きください..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </CardContent>
            </Card>
            
            <div className="text-center text-sm text-gray-500">
              記録は暗号化されて安全に保存されます
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <AppLayout title="今日のチェックイン" showBackButton>
      <div className="px-4 py-6 max-w-md mx-auto">
        
        {/* 完了アニメーション */}
        <TaskCompleteAnimation
          isVisible={showCompletion}
          onComplete={() => {
            setShowCompletion(false)
            router.push('/dashboard')
          }}
          xpGained={25}
          taskTitle="チェックイン完了！"
        />

        <CharacterReaction
          isVisible={showCharacterReaction}
          character={{
            name: 'Luna',
            avatar: '🌙',
            color: 'from-purple-400 to-purple-600'
          }}
          reaction="caring"
        />

        <FloatingNotification
          isVisible={showNotification}
          title="チェックイン完了"
          message="今日の記録が保存されました。お疲れ様でした！"
          type="success"
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
            </CardContent>
          </Card>

          {/* ステップコンテンツ */}
          <Card>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>

          {/* ナビゲーションボタン */}
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                戻る
              </Button>
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
              <span>{currentStep === totalSteps ? '完了' : '次へ'}</span>
              {currentStep < totalSteps && <ArrowRight className="h-4 w-4" />}
              {currentStep === totalSteps && <CheckCircle className="h-4 w-4" />}
            </RippleButton>
          </div>

          {/* ヒント */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Heart className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">💡 ヒント</h4>
                  <p className="text-sm text-blue-700">
                    {currentStep === 1 && '正直な気持ちを記録することで、気分のパターンを把握できます。'}
                    {currentStep === 2 && 'エネルギーレベルは活動計画の参考になります。'}
                    {currentStep === 3 && 'ストレスを認識することが対処の第一歩です。'}
                    {currentStep === 4 && '活動記録により、気分との関連性が見えてきます。'}
                    {currentStep === 5 && '感情を言葉にすることで心の整理ができます。'}
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