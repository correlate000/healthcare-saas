'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  Calendar, 
  Clock, 
  User, 
  Star, 
  ArrowLeft,
  Check,
  MapPin,
  Phone,
  Video,
  MessageSquare,
  Award,
  BookOpen,
  Heart
} from 'lucide-react'

interface Specialist {
  id: number
  name: string
  title: string
  specialty: string
  rating: number
  experience: string
  avatar: string
  availableSlots: string[]
  consultationType: ('video' | 'phone' | 'chat')[]
  description: string
  languages: string[]
}

interface BookingStep {
  id: number
  title: string
  description: string
}

const specialists: Specialist[] = [
  {
    id: 1,
    name: '田中 美咲',
    title: '臨床心理士',
    specialty: 'ストレス管理・不安対処',
    rating: 4.9,
    experience: '8年',
    avatar: '👩‍⚕️',
    availableSlots: ['14:00', '15:30', '17:00'],
    consultationType: ['video', 'phone', 'chat'],
    description: 'ストレス管理と不安対処法を専門としています。認知行動療法を中心としたアプローチで多くの患者様をサポートしています。',
    languages: ['日本語', '英語']
  },
  {
    id: 2,
    name: '佐藤 健太郎',
    title: '精神科医',
    specialty: 'うつ病・適応障害',
    rating: 4.8,
    experience: '12年',
    avatar: '👨‍⚕️',
    availableSlots: ['10:30', '13:00', '16:00'],
    consultationType: ['video', 'phone'],
    description: 'うつ病・適応障害の治療に特化しています。薬物療法と心理療法を組み合わせた包括的な治療を提供します。',
    languages: ['日本語']
  },
  {
    id: 3,
    name: '山田 智子',
    title: 'カウンセラー',
    specialty: '職場ストレス・人間関係',
    rating: 4.7,
    experience: '6年',
    avatar: '👩‍💼',
    availableSlots: ['09:00', '11:30', '14:30'],
    consultationType: ['video', 'chat'],
    description: '職場でのストレスや人間関係の悩みを専門としています。解決志向のカウンセリングで実践的なサポートを提供します。',
    languages: ['日本語']
  }
]

const bookingSteps: BookingStep[] = [
  { id: 1, title: '専門家選択', description: 'あなたに合った専門家を選びましょう' },
  { id: 2, title: '日時選択', description: 'ご都合の良い日時を選択してください' },
  { id: 3, title: '相談方法', description: '相談方法を選択してください' },
  { id: 4, title: '確認', description: '予約内容を確認してください' }
]

export default function BookingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('今日')
  const [consultationType, setConsultationType] = useState<'video' | 'phone' | 'chat' | null>(null)

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete booking
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push('/dashboard')
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedSpecialist !== null
      case 2: return selectedTime !== null
      case 3: return consultationType !== null
      case 4: return true
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
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="text-white text-xl font-bold mb-2">専門家を選択</h2>
              <p className="text-gray-300 text-sm">あなたに最適な専門家を選びましょう</p>
            </div>

            <div className="space-y-4">
              {specialists.map((specialist) => (
                <motion.div
                  key={specialist.id}
                  className={`bg-gray-700/95 rounded-2xl p-5 border transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    selectedSpecialist?.id === specialist.id
                      ? 'border-emerald-400 shadow-lg bg-gray-600/95'
                      : 'border-gray-600/30 hover:border-gray-500/50'
                  }`}
                  onClick={() => setSelectedSpecialist(specialist)}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{specialist.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold text-lg">{specialist.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 text-sm font-medium">{specialist.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                          {specialist.title}
                        </Badge>
                        <span className="text-gray-400 text-sm">{specialist.experience}の経験</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed">{specialist.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {specialist.consultationType.map((type) => (
                          <div key={type} className="flex items-center space-x-1 text-xs text-gray-400">
                            {type === 'video' && <Video className="w-3 h-3" />}
                            {type === 'phone' && <Phone className="w-3 h-3" />}
                            {type === 'chat' && <MessageSquare className="w-3 h-3" />}
                            <span>
                              {type === 'video' ? 'ビデオ通話' : 
                               type === 'phone' ? '音声通話' : 'チャット'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
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
            <div className="text-center mb-6">
              <h2 className="text-white text-xl font-bold mb-2">日時を選択</h2>
              <p className="text-gray-300 text-sm">ご都合の良い時間を選んでください</p>
            </div>

            <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{selectedSpecialist?.avatar}</div>
                <div>
                  <h3 className="text-white font-semibold">{selectedSpecialist?.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedSpecialist?.title}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-medium">利用可能な時間</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedSpecialist?.availableSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 rounded-xl border transition-all duration-200 min-h-[60px] touch-manipulation ${
                      selectedTime === time
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg'
                        : 'bg-gray-700/90 text-white border-gray-600/30 hover:border-gray-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{time}</span>
                    </div>
                  </button>
                ))}
              </div>
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
            <div className="text-center mb-6">
              <h2 className="text-white text-xl font-bold mb-2">相談方法を選択</h2>
              <p className="text-gray-300 text-sm">お好みの相談方法を選んでください</p>
            </div>

            <div className="space-y-4">
              {selectedSpecialist?.consultationType.map((type) => (
                <button
                  key={type}
                  onClick={() => setConsultationType(type)}
                  className={`w-full p-5 rounded-2xl border transition-all duration-200 text-left touch-manipulation ${
                    consultationType === type
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                      : 'bg-gray-700/90 border-gray-600/30 text-white hover:border-gray-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      consultationType === type ? 'bg-emerald-500' : 'bg-gray-600'
                    }`}>
                      {type === 'video' && <Video className="w-5 h-5 text-white" />}
                      {type === 'phone' && <Phone className="w-5 h-5 text-white" />}
                      {type === 'chat' && <MessageSquare className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {type === 'video' ? 'ビデオ通話' : 
                         type === 'phone' ? '音声通話' : 'チャット相談'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {type === 'video' ? '顔を見ながら安心して相談' : 
                         type === 'phone' ? '声だけでリラックスして相談' : '文字でじっくり相談'}
                      </p>
                    </div>
                  </div>
                </button>
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
            <div className="text-center mb-6">
              <h2 className="text-white text-xl font-bold mb-2">予約内容の確認</h2>
              <p className="text-gray-300 text-sm">内容をご確認ください</p>
            </div>

            <div className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30 space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-600/30">
                <div className="text-3xl">{selectedSpecialist?.avatar}</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{selectedSpecialist?.name}</h3>
                  <p className="text-gray-400">{selectedSpecialist?.title}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm">{selectedSpecialist?.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">日時</span>
                  <span className="text-white font-medium">{selectedDate} {selectedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">相談方法</span>
                  <div className="flex items-center space-x-2">
                    {consultationType === 'video' && <Video className="w-4 h-4 text-emerald-400" />}
                    {consultationType === 'phone' && <Phone className="w-4 h-4 text-emerald-400" />}
                    {consultationType === 'chat' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
                    <span className="text-white font-medium">
                      {consultationType === 'video' ? 'ビデオ通話' : 
                       consultationType === 'phone' ? '音声通話' : 'チャット相談'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">料金</span>
                  <span className="text-white font-medium">¥3,000</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-emerald-400 font-medium mb-1">予約確定後</p>
                  <p className="text-gray-300 text-sm">
                    予約確認のメールが送信されます。相談開始時間の5分前にアクセス情報をお送りします。
                  </p>
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
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header with progress */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-lg font-semibold">専門家予約</h1>
          <div className="w-6" />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm">ステップ {currentStep} / 4</span>
          <span className="text-emerald-400 text-sm font-medium">{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="p-4 pb-24 space-y-3">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 min-h-[52px] touch-manipulation ${
            canProceed()
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-lg hover:shadow-xl'
              : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentStep === 4 ? '予約を確定する' : '次へ'}
        </Button>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}