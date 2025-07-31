'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

// Wireframe pages 4-13 exact onboarding data structure
const onboardingSteps = [
  {
    id: 'industry',
    title: 'あなたの業界を教えてください',
    subtitle: 'データは完全に匿名化されます',
    step: 1,
    total: 8,
    progress: 13,
    options: [
      'IT・テクノロジー',
      '金融・保険',
      '製造業',
      '医療・ヘルスケア',
      '小売・サービス',
      'コンサルティング',
      '教育・研究',
      'その他'
    ]
  },
  {
    id: 'workstyle',
    title: '働き方を教えてください',
    subtitle: '主な勤務スタイルはどちらですか？',
    step: 2,
    total: 8,
    progress: 25,
    options: [
      { id: 'office', title: 'オフィス勤務', subtitle: '主に会社で働いています' },
      { id: 'remote', title: 'リモート勤務', subtitle: '主に自宅で働いています' },
      { id: 'hybrid', title: 'ハイブリッド', subtitle: 'オフィスと自宅を使い分けています' }
    ]
  },
  {
    id: 'age',
    title: '年代を教えてください',
    subtitle: '適切なサポートを提供するため',
    step: 3,
    total: 8,
    progress: 37,
    options: ['10代', '20代', '30代', '40代', '50代', '60代以上']
  },
  {
    id: 'occupation',
    title: '職種を教えてください',
    subtitle: 'より関連性の高いサポートを提供します',
    step: 4,
    total: 8,
    progress: 50,
    options: [
      '管理職',
      'エンジニア・技術職',
      '営業',
      'マーケティング',
      'デザイン・企画',
      '事務・バックオフィス',
      '人事・総務',
      'その他'
    ]
  },
  {
    id: 'interests',
    title: '関心のあるテーマは？',
    subtitle: '複数選択可能です',
    step: 5,
    total: 8,
    progress: 63,
    multiSelect: true,
    options: [
      'ストレス管理',
      'ワークライフバランス',
      '職場の人間関係',
      'パフォーマンス向上',
      '不安・心配事',
      '睡眠の質',
      'モチベーション',
      '変化への適応'
    ]
  },
  {
    id: 'aipartner',
    title: 'AIパートナーを選んでください',
    subtitle: 'いつでも変更できます',
    step: 6,
    total: 8,
    progress: 75,
    characters: [
      {
        id: 'luna',
        name: 'Luna - 優しく共感的',
        description: '静かで思慮深く、あなたの感情に寄り添います',
        recommendation: '内向的、深く考える方におすすめ'
      },
      {
        id: 'aria',
        name: 'Aria - 明るく励ましてくれる',
        description: 'エネルギッシュで前向き、やる気を引き出します',
        recommendation: 'アクティブ、チャレンジ好きな方におすすめ'
      },
      {
        id: 'zen',
        name: 'Zen - 落ち着いていて知的',
        description: '冷静で客観的、論理的なアドバイスをします',
        recommendation: '分析的、効率重視の方におすすめ'
      }
    ]
  },
  {
    id: 'goals',
    title: '目標を設定しましょう',
    subtitle: '達成したいことを選んでください（複数選択可）',
    step: 7,
    total: 8,
    progress: 87,
    multiSelect: true,
    options: [
      'ストレス軽減',
      '気分の安定',
      '睡眠改善',
      '仕事効率UP',
      'チーム関係改善',
      '自己理解を深める'
    ]
  },
  {
    id: 'complete',
    title: 'セットアップ完了！',
    subtitle: '+30XP',
    step: 8,
    total: 8,
    progress: 100,
    isComplete: true
  }
]

export default function Onboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState('luna')

  const currentStepData = onboardingSteps[currentStep]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedOptions([]) // Reset selections for next step
    } else {
      // Complete onboarding
      router.push('/dashboard')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleOptionSelect = (option: string) => {
    if (currentStepData.multiSelect) {
      setSelectedOptions(prev => 
        prev.includes(option)
          ? prev.filter(item => item !== option)
          : [...prev, option]
      )
    } else {
      setSelectedOptions([option])
    }
  }

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId)
    setSelectedOptions([characterId])
  }

  const canProceed = () => {
    if (currentStepData.isComplete) return true
    if (currentStepData.multiSelect) return selectedOptions.length > 0
    return selectedOptions.length > 0
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Character Area - exact wireframe */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="w-32 h-32 bg-lime-400 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-gray-800 text-lg font-medium">キャラクター</span>
        </div>
        
        {currentStepData.step && (
          <div className="bg-gray-700 rounded-xl px-6 py-3 mb-4 max-w-md mx-4">
            <p className="text-white text-sm">まずはあなたのことを教えてください</p>
          </div>
        )}
      </div>

      {/* Progress - exact wireframe */}
      {currentStepData.step && (
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">ステップ {currentStepData.step} / {currentStepData.total}</span>
            <span className="text-white text-sm">{currentStepData.progress}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentStepData.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Regular Steps */}
        {!currentStepData.isComplete && (
          <>
            <div className="mb-8">
              <h1 className="text-white text-xl font-semibold mb-2">{currentStepData.title}</h1>
              <p className="text-gray-300 text-sm">{currentStepData.subtitle}</p>
            </div>

            {/* Options Grid */}
            {currentStepData.options && !currentStepData.characters && (
              <div className="space-y-3 mb-8">
                {currentStepData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(typeof option === 'string' ? option : option.id)}
                    className={`w-full p-4 rounded-xl border transition-all duration-200 text-left min-h-[60px] ${
                      selectedOptions.includes(typeof option === 'string' ? option : option.id)
                        ? 'bg-white text-gray-800 border-gray-300'
                        : 'bg-gray-700 text-white border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOptions.includes(typeof option === 'string' ? option : option.id)
                          ? 'border-gray-800 bg-gray-800'
                          : 'border-gray-400'
                      }`}>
                        {selectedOptions.includes(typeof option === 'string' ? option : option.id) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {typeof option === 'string' ? option : option.title}
                        </div>
                        {typeof option === 'object' && option.subtitle && (
                          <div className="text-sm text-gray-400 mt-1">{option.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Character Selection */}
            {currentStepData.characters && (
              <div className="space-y-4 mb-8">
                {currentStepData.characters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => handleCharacterSelect(character.id)}
                    className={`w-full p-5 rounded-2xl border transition-all duration-200 text-left ${
                      selectedCharacter === character.id
                        ? 'bg-white text-gray-800 border-gray-300'
                        : 'bg-gray-700 text-white border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedCharacter === character.id
                          ? 'border-gray-800 bg-gray-800'
                          : 'border-gray-400'
                      }`}>
                        {selectedCharacter === character.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <h3 className="font-semibold text-lg">{character.name}</h3>
                    </div>
                    <p className="text-sm mb-2 leading-relaxed">{character.description}</p>
                    <p className="text-xs text-gray-400">{character.recommendation}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="flex-1 py-3 rounded-xl bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                >
                  戻る
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  canProceed()
                    ? 'bg-white text-gray-800 hover:bg-gray-100'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                次へ
              </Button>
            </div>
          </>
        )}

        {/* Completion Step */}
        {currentStepData.isComplete && (
          <div className="text-center space-y-8">
            <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-white rounded-full" />
              </div>
              <h2 className="text-gray-800 text-2xl font-bold mb-2">{currentStepData.title}</h2>
              <p className="text-gray-800 text-lg font-semibold">{currentStepData.subtitle}</p>
            </div>

            <Button
              onClick={handleNext}
              className="w-full py-4 rounded-xl bg-white text-gray-800 hover:bg-gray-100 font-semibold text-lg"
            >
              セットアップ完了
            </Button>
          </div>
        )}
      </div>

      {/* Privacy Protection Footer */}
      {currentStepData.step && (
        <div className="px-6 pb-6">
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="text-lg">🔒</div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">プライバシー保護</h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  すべてのデータは完全に匿名化されており、所属先の企業から個人を特定することは一切できません。統計は暗号化された集計処理により生成されています。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}