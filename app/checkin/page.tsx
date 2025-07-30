'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

// Mood options based on wireframe
const moodOptions = [
  { id: 'great', label: '素晴らしい' },
  { id: 'good', label: 'いい感じ' },
  { id: 'normal', label: '普通' },
  { id: 'tired', label: '疲れた' },
  { id: 'bad', label: 'つらい' }
]

// Body feeling options
const bodyFeelingOptions = [
  { id: 'great', label: '素晴らしい' },
  { id: 'good', label: 'いい感じ' },
  { id: 'normal', label: '普通' },
  { id: 'tired', label: '疲れた' },
  { id: 'bad', label: 'つらい' }
]

export default function CheckinPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedBodyFeeling, setSelectedBodyFeeling] = useState<string | null>(null)

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
      bodyFeeling: selectedBodyFeeling
    }
    
    // Store checkin for today
    const today = new Date().toDateString()
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindcare-last-checkin', today)
      
      // Store checkin data
      const existingCheckins = JSON.parse(localStorage.getItem('mindcare-checkins') || '[]')
      existingCheckins.push(checkinData)
      localStorage.setItem('mindcare-checkins', JSON.stringify(existingCheckins))
    }
    
    router.push('/dashboard')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedMood !== null
      case 2: return selectedBodyFeeling !== null
      default: return true
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
            <div className="text-center mb-8">
              <h2 className="text-white text-xl font-bold mb-2 tracking-wide">今日のこころの調子は？</h2>
              <p className="text-gray-300 text-sm font-medium">正直な気持ちを教えてください</p>
            </div>
            
            <div className="space-y-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`w-full p-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md min-h-[64px] touch-manipulation ${
                    selectedMood === mood.id
                      ? 'bg-white text-gray-800 shadow-lg scale-105'
                      : 'bg-gray-600/90 text-white hover:bg-gray-500 border border-gray-500/30'
                  }`}
                >
                  <div className="text-center font-semibold tracking-wide">
                    {mood.label}
                  </div>
                </button>
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
            <div className="text-center mb-8">
              <h2 className="text-white text-xl font-bold mb-2 tracking-wide">今日のからだの調子は？</h2>
              <p className="text-gray-300 text-sm font-medium">体調も大切な健康の指標です</p>
            </div>
            
            <div className="space-y-3">
              {bodyFeelingOptions.map((feeling) => (
                <button
                  key={feeling.id}
                  onClick={() => setSelectedBodyFeeling(feeling.id)}
                  className={`w-full p-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md min-h-[64px] touch-manipulation ${
                    selectedBodyFeeling === feeling.id
                      ? 'bg-white text-gray-800 shadow-lg scale-105'
                      : 'bg-gray-600/90 text-white hover:bg-gray-500 border border-gray-500/30'
                  }`}
                >
                  <div className="text-center font-semibold tracking-wide">
                    {feeling.label}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )

      default:
        return (
          <div className="text-center text-white">
            <p>準備中...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Character area */}
      <div className="p-6 flex flex-col items-center">
        <div className="w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <span className="text-white text-xl font-bold tracking-wide">キャラクター</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-white text-sm font-semibold">ステップ {currentStep} / {totalSteps}</span>
          <span className="text-emerald-400 text-sm font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-600/70 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 px-4">
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="p-4 space-y-4 pb-24">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="w-full py-4 bg-gray-600/90 text-white rounded-xl font-semibold hover:bg-gray-500 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-500/30 min-h-[52px] touch-manipulation"
          >
            戻る
          </button>
        )}
        
        <button
          onClick={currentStep < 2 ? handleNext : handleComplete}
          disabled={!canProceed()}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
            canProceed()
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-lg hover:shadow-xl hover:scale-105'
              : 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/30'
          }`}
        >
          {currentStep >= 2 ? 'あとで' : 'あとで'}
        </button>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}