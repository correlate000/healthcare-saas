'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function CheckIn() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false)

  const steps = [
    {
      id: 'mood',
      title: '今日のこころの調子は？',
      options: ['素晴らしい', 'いい感じ', '普通', '疲れた', 'つらい']
    },
    {
      id: 'physical',
      title: '今日のからだの調子は？',
      options: ['素晴らしい', 'いい感じ', '普通', '疲れた', 'つらい']
    },
    {
      id: 'stress',
      title: 'ストレスレベルは？',
      options: ['高い', '普通', '低い']
    },
    {
      id: 'activities',
      title: '今日何をしましたか',
      subtitle: '（複数選択可）',
      options: ['仕事', '運動', '人との交流', '趣味', '家族時間', '休息', '学習', '瞑想'],
      multiple: true
    },
    {
      id: 'notes',
      title: '何か記録したいことは？',
      type: 'textarea',
      placeholder: '今日の特別な出来事や感想（任意）'
    }
  ]

  const handleResponse = (value: string | string[]) => {
    setResponses({
      ...responses,
      [steps[currentStep].id]: value
    })

    // Auto-advance for single-choice questions (not for multiple choice or textarea)
    if (!steps[currentStep].multiple && steps[currentStep].type !== 'textarea') {
      setIsAutoAdvancing(true)
    }
  }

  // Auto-advance effect
  useEffect(() => {
    if (isAutoAdvancing) {
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
          setIsAutoAdvancing(false)
        }
      }, 300) // Short delay for visual feedback

      return () => clearTimeout(timer)
    }
  }, [isAutoAdvancing, currentStep])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setCurrentStep(-1) // Show completion screen
    // Redirect to analytics after showing completion screen
    setTimeout(() => {
      router.push('/analytics')
    }, 3000)
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  if (currentStep === -1) {
    // Completion screen
    return (
      <div style={{ 
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#111827', 
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          flex: 1,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Success animation */}
          <div style={{ 
            width: '100px', 
            height: '100px', 
            backgroundColor: '#a3e635', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '24px',
            animation: 'pulse 1s ease-in-out'
          }}>
            <span style={{ color: '#111827', fontSize: '48px' }}>✓</span>
          </div>

          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#f3f4f6', 
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            今日もお疲れ様でした
          </h1>
          
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#a3e635', 
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            記録完了 - 15日連続ログイン達成！
          </h2>

          <p style={{ 
            fontSize: '14px', 
            color: '#9ca3af',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            分析ページへ移動します...
          </p>

          <button
            onClick={() => router.push('/analytics')}
            style={{
              padding: '16px 32px',
              backgroundColor: '#a3e635',
              color: '#111827',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635' }}
          >
            今すぐ分析を見る
          </button>
        </div>

        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div style={{ 
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#111827', 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        flex: 1,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 80px)' // Account for bottom nav
      }}>
        {/* Character */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: '#a3e635', 
          borderRadius: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 16px',
          flexShrink: 0
        }}>
          <span style={{ color: '#111827', fontSize: '12px', fontWeight: '600' }}>Luna</span>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>ステップ {currentStep + 1} / {steps.length}</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            backgroundColor: '#374151', 
            borderRadius: '3px',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              height: '100%', 
              width: `${progress}%`, 
              backgroundColor: '#a3e635', 
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* Question */}
        <div style={{ textAlign: 'center', marginBottom: '20px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#f3f4f6', marginBottom: '4px' }}>
            {currentStepData.title}
          </h1>
          {currentStepData.subtitle && (
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>{currentStepData.subtitle}</p>
          )}
        </div>

        {/* Answer options - scrollable area */}
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          marginBottom: '16px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {currentStepData.type === 'textarea' ? (
            <textarea
              placeholder={currentStepData.placeholder}
              value={responses[currentStepData.id] || ''}
              onChange={(e) => handleResponse(e.target.value)}
              style={{
                width: '100%',
                minHeight: '120px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '16px',
                color: '#d1d5db',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#a3e635' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#374151' }}
            />
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: currentStepData.multiple ? 'repeat(2, 1fr)' : '1fr',
              gap: '12px'
            }}>
              {currentStepData.options?.map((option, index) => {
                const isSelected = currentStepData.multiple 
                  ? (responses[currentStepData.id] || []).includes(option)
                  : responses[currentStepData.id] === option
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (currentStepData.multiple) {
                        const current = responses[currentStepData.id] || []
                        const updated = isSelected 
                          ? current.filter((item: string) => item !== option)
                          : [...current, option]
                        handleResponse(updated)
                      } else {
                        handleResponse(option)
                      }
                    }}
                    style={{
                      padding: currentStepData.multiple ? '14px' : '16px',
                      backgroundColor: isSelected ? '#a3e635' : '#1f2937',
                      color: isSelected ? '#111827' : '#d1d5db',
                      border: isSelected ? '2px solid #a3e635' : '1px solid #374151',
                      borderRadius: '12px',
                      fontSize: currentStepData.multiple ? '14px' : '16px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: isSelected && !currentStepData.multiple ? 'scale(1.05)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#374151'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#1f2937'
                      }
                    }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Navigation buttons - fixed at bottom */}
        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#374151',
                color: '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
            >
              戻る
            </button>
          )}
          
          {currentStep === 0 && (
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '14px 20px',
                backgroundColor: '#374151',
                color: '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
            >
              あとで
            </button>
          )}

          {/* Show Next button for multiple choice and textarea (textarea is optional) */}
          {(currentStepData.multiple || currentStepData.type === 'textarea') && (
            <button
              onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
              disabled={currentStepData.multiple ? 
                !(responses[currentStepData.id] && responses[currentStepData.id].length > 0) :
                false} // textarea is always optional
              style={{
                flex: currentStep === 0 ? 2 : 1,
                padding: '14px',
                backgroundColor: currentStepData.multiple ? 
                  ((responses[currentStepData.id] && responses[currentStepData.id].length > 0) ? '#a3e635' : '#374151') :
                  '#a3e635', // Always enabled for textarea
                color: currentStepData.multiple ? 
                  ((responses[currentStepData.id] && responses[currentStepData.id].length > 0) ? '#111827' : '#9ca3af') :
                  '#111827', // Always enabled for textarea
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: currentStepData.multiple ? 
                  ((responses[currentStepData.id] && responses[currentStepData.id].length > 0) ? 'pointer' : 'not-allowed') :
                  'pointer', // Always enabled for textarea
                transition: 'all 0.2s ease'
              }}
            >
              {currentStep === steps.length - 1 ? '完了' : currentStepData.type === 'textarea' ? 'スキップ / 次へ' : '次へ'}
            </button>
          )}
        </div>
      </div>

      <MobileBottomNav />

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}