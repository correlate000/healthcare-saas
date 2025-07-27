'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface SetupData {
  industry: string
  workStyle: string
  ageGroup: string
}

// 業界選択肢（ワイヤーフレーム通り）
const industries = [
  { id: 'tech', label: 'IT・テクノロジー' },
  { id: 'finance', label: '金融・保険' },
  { id: 'manufacturing', label: '製造業' },
  { id: 'healthcare', label: '医療・ヘルスケア' },
  { id: 'retail', label: '小売・サービス' },
  { id: 'consulting', label: 'コンサルティング' },
  { id: 'education', label: '教育・研究' },
  { id: 'other', label: 'その他' }
]

// 企業規模（削除）

// 働き方（ワイヤーフレーム通り）
const workStyles = [
  { id: 'office', label: 'オフィス勤務', description: '主に会社で働いています' },
  { id: 'remote', label: 'リモート勤務', description: '主に自宅で働いています' },
  { id: 'hybrid', label: 'ハイブリッド', description: 'オフィスと自宅を使い分けています' }
]

// 年代（ワイヤーフレーム通り）
const ageGroups = [
  { id: '10s', label: '10代' },
  { id: '20s', label: '20代' },
  { id: '30s', label: '30代' },
  { id: '40s', label: '40代' },
  { id: '50s', label: '50代' },
  { id: '60s+', label: '60代以上' }
]

// 職種（削除）

// 悩み・関心事（削除）

// AIキャラクター（削除）

// メンタルヘルス目標（削除）

export default function SetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [setupData, setSetupData] = useState<SetupData>({
    industry: '',
    workStyle: '',
    ageGroup: ''
  })
  

  const totalSteps = 3
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
    router.push('/dashboard')
  }

  const updateSetupData = (field: keyof SetupData, value: string) => {
    setSetupData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return setupData.industry !== ''
      case 2: return setupData.workStyle !== ''
      case 3: return setupData.ageGroup !== ''
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
              <h2 className="text-xl font-medium text-white mb-2">あなたの業界を教えてください</h2>
              <p className="text-gray-400 text-sm">データは完全に匿名化されます</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => updateSetupData('industry', industry.id)}
                  className={`p-4 rounded-2xl transition-all flex items-center justify-center ${
                    setupData.industry === industry.id
                      ? 'bg-white text-gray-800'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      setupData.industry === industry.id
                        ? 'border-gray-800 bg-gray-800'
                        : 'border-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {industry.label}
                    </span>
                  </div>
                </button>
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
              <h2 className="text-xl font-medium text-white mb-2">働き方を教えてください</h2>
              <p className="text-gray-400 text-sm">主な勤務スタイルはどちらですか？</p>
            </div>
            
            <div className="space-y-3">
              {workStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => updateSetupData('workStyle', style.id)}
                  className={`w-full p-4 rounded-2xl transition-all text-left ${
                    setupData.workStyle === style.id
                      ? 'bg-white text-gray-800'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      setupData.workStyle === style.id
                        ? 'border-gray-800 bg-gray-800'
                        : 'border-gray-400'
                    }`}></div>
                    <div>
                      <div className="font-medium">
                        {style.label}
                      </div>
                      <div className={`text-sm ${
                        setupData.workStyle === style.id ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {style.description}
                      </div>
                    </div>
                  </div>
                </button>
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
              <h2 className="text-xl font-medium text-white mb-2">年代を教えてください</h2>
              <p className="text-gray-400 text-sm">適切なサポートを提供するため</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {ageGroups.map((age) => (
                <button
                  key={age.id}
                  onClick={() => updateSetupData('ageGroup', age.id)}
                  className={`p-4 rounded-2xl transition-all ${
                    setupData.ageGroup === age.id
                      ? 'bg-white text-gray-800'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      setupData.ageGroup === age.id
                        ? 'border-gray-800 bg-gray-800'
                        : 'border-gray-400'
                    }`}></div>
                    <span className="font-medium">
                      {age.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )






      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* キャラクターエリア - ワイヤーフレーム通り */}
      <div className="p-6 flex items-center justify-between">
        <div className="w-24 h-24 bg-lime-400 rounded-3xl flex items-center justify-center">
          <span className="text-gray-800 text-sm font-medium">キャラクター</span>
        </div>
        
        <div className="text-right">
          <p className="text-white text-lg font-medium">まずはあなたのことを教えてください</p>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm">ステップ {currentStep} / {totalSteps}</span>
          <span className="text-white text-sm">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div 
            className="bg-gray-200 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 px-6">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* ナビゲーションボタン */}
      <div className="p-6 flex space-x-3">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-500 transition-colors"
          >
            戻る
          </button>
        )}
        
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            canProceed()
              ? 'bg-white text-gray-800 hover:bg-gray-100'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentStep === totalSteps ? 'セットアップ完了' : '次へ'}
        </button>
      </div>

      {/* プライバシー保護 */}
      <div className="p-6 pt-0">
        <div className="bg-gray-700 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-500 text-lg">🔒</div>
            <div>
              <h4 className="text-white font-medium mb-1">プライバシー保護</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                すべてのデータは完全に匿名化されており、個人を特定することは一切できません。統計は暗号化された集計処理により生成されています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}