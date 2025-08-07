'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    goals: [] as string[],
    conditions: [] as string[],
    preferredTime: '',
    notifications: true
  })

  const steps = [
    {
      id: 'welcome',
      type: 'intro'
    },
    {
      id: 'name',
      type: 'input',
      title: 'はじめまして！お名前を教えてください',
      field: 'name',
      placeholder: 'ニックネームでもOKです'
    },
    {
      id: 'age',
      type: 'select',
      title: '年齢層を教えてください',
      field: 'age',
      options: ['10代', '20代', '30代', '40代', '50代', '60代以上']
    },
    {
      id: 'goals',
      type: 'multiselect',
      title: 'あなたの目標を選んでください',
      subtitle: '（複数選択可）',
      field: 'goals',
      options: [
        'ストレス軽減',
        '睡眠改善',
        '気分の安定',
        'マインドフルネス',
        '不安の管理',
        '自己成長',
        '人間関係改善',
        'ワークライフバランス'
      ]
    },
    {
      id: 'conditions',
      type: 'multiselect',
      title: '現在の悩みを教えてください',
      subtitle: '（複数選択可・スキップ可）',
      field: 'conditions',
      options: [
        '不安感',
        '憂鬱',
        '不眠',
        '疲労感',
        '集中力低下',
        'イライラ',
        '孤独感',
        '自信喪失'
      ]
    },
    {
      id: 'time',
      type: 'select',
      title: 'いつチェックインしたいですか？',
      field: 'preferredTime',
      options: ['朝（6-9時）', '昼（12-14時）', '夕方（17-19時）', '夜（20-22時）', '決めていない']
    },
    {
      id: 'complete',
      type: 'complete'
    }
  ]

  // Animated bird mascot component
  const BirdMascot = ({ emotion = 'happy', size = 120 }: { emotion?: string, size?: number }) => (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      position: 'relative',
      animation: emotion === 'happy' ? 'bounce 2s infinite' : 'float 3s ease-in-out infinite'
    }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${size * 0.6}px`,
        height: '10px',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: '50%',
        filter: 'blur(4px)'
      }}></div>
      
      {/* Body */}
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.2}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${size * 0.7}px`,
        height: `${size * 0.65}px`,
        backgroundColor: '#a3e635',
        borderRadius: '50% 50% 45% 45%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {/* Belly */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '40%',
          backgroundColor: '#bef264',
          borderRadius: '50%'
        }}></div>
      </div>
      
      {/* Wings */}
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.35}px`,
        left: `${size * 0.1}px`,
        width: `${size * 0.25}px`,
        height: `${size * 0.35}px`,
        backgroundColor: '#84cc16',
        borderRadius: '50% 0 50% 50%',
        transform: 'rotate(-15deg)',
        animation: 'wingFlap 1s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.35}px`,
        right: `${size * 0.1}px`,
        width: `${size * 0.25}px`,
        height: `${size * 0.35}px`,
        backgroundColor: '#84cc16',
        borderRadius: '0 50% 50% 50%',
        transform: 'rotate(15deg)',
        animation: 'wingFlap 1s ease-in-out infinite 0.5s'
      }}></div>
      
      {/* Eyes */}
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.55}px`,
        left: `${size * 0.3}px`,
        width: `${size * 0.12}px`,
        height: `${size * 0.15}px`,
        backgroundColor: '#111827',
        borderRadius: '50%'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: '40%',
          height: '40%',
          backgroundColor: 'white',
          borderRadius: '50%'
        }}></div>
      </div>
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.55}px`,
        right: `${size * 0.3}px`,
        width: `${size * 0.12}px`,
        height: `${size * 0.15}px`,
        backgroundColor: '#111827',
        borderRadius: '50%'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '30%',
          width: '40%',
          height: '40%',
          backgroundColor: 'white',
          borderRadius: '50%'
        }}></div>
      </div>
      
      {/* Beak */}
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.45}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${size * 0.15}px`,
        height: `${size * 0.1}px`,
        backgroundColor: '#f59e0b',
        borderRadius: '0 0 50% 50%'
      }}></div>
      
      {/* Sparkles for happy emotion */}
      {emotion === 'happy' && (
        <>
          <div style={{
            position: 'absolute',
            top: '0',
            right: '-10px',
            fontSize: '20px',
            animation: 'sparkle 1.5s ease-in-out infinite'
          }}>✨</div>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '-10px',
            fontSize: '16px',
            animation: 'sparkle 1.5s ease-in-out infinite 0.5s'
          }}>✨</div>
        </>
      )}
    </div>
  )

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

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
    // Save onboarding data and redirect to dashboard
    localStorage.setItem('onboardingComplete', 'true')
    localStorage.setItem('userData', JSON.stringify(formData))
    router.push('/dashboard')
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleMultiSelect = (field: string, value: string) => {
    const current = formData[field as keyof typeof formData] as string[]
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]
    setFormData({ ...formData, [field]: updated })
  }

  // Welcome screen
  if (currentStepData.type === 'intro') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#111827',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <BirdMascot emotion="happy" size={150} />
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#f3f4f6',
          marginTop: '32px',
          marginBottom: '16px',
          letterSpacing: '-1px'
        }}>
          ようこそ！
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#d1d5db',
          marginBottom: '8px',
          lineHeight: '1.5'
        }}>
          メンタルヘルスケアの
        </p>
        <p style={{
          fontSize: '18px',
          color: '#d1d5db',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          新しい旅を始めましょう
        </p>
        
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          marginBottom: '48px',
          maxWidth: '300px',
          lineHeight: '1.6'
        }}>
          あなたに合わせたパーソナライズされた体験を提供するために、いくつか質問させてください
        </p>
        
        <button
          onClick={handleNext}
          style={{
            padding: '16px 48px',
            backgroundColor: '#a3e635',
            color: '#111827',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(163, 230, 53, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#84cc16'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(163, 230, 53, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#a3e635'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(163, 230, 53, 0.3)'
          }}
        >
          始める
        </button>
        
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '24px'
        }}>
          3分程度で完了します
        </p>

        <style jsx>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes wingFlap {
            0%, 100% { transform: rotate(-15deg) translateY(0); }
            50% { transform: rotate(-25deg) translateY(-2px); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    )
  }

  // Completion screen
  if (currentStepData.type === 'complete') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#111827',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        {/* Celebration animation */}
        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <div style={{
            width: '140px',
            height: '140px',
            backgroundColor: '#a3e635',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'celebrateBounce 1s ease-out',
            boxShadow: '0 8px 32px rgba(163, 230, 53, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
              animation: 'rippleOut 1.5s ease-out'
            }}></div>
            <span style={{ fontSize: '70px', color: '#111827', animation: 'rotateParty 1.5s ease-in-out', position: 'relative' }}>🎉</span>
          </div>
          
          {/* Confetti particles */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  backgroundColor: ['#a3e635', '#fbbf24', '#60a5fa', '#f87171'][i % 4],
                  borderRadius: '50%',
                  animation: `confetti${i} 1.5s ease-out forwards`
                }}
              />
            ))}
          </div>
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#f3f4f6',
          marginBottom: '20px',
          letterSpacing: '-0.5px',
          animation: 'fadeInScale 0.6s ease-out 0.3s both'
        }}>
          準備完了！
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#d1d5db',
          marginBottom: '20px',
          maxWidth: '360px',
          lineHeight: '1.7',
          animation: 'fadeInScale 0.6s ease-out 0.5s both'
        }}>
          {formData.name}さん、設定が完了しました。
        </p>
        
        <p style={{
          fontSize: '16px',
          color: '#9ca3af',
          marginBottom: '40px',
          maxWidth: '360px',
          lineHeight: '1.6',
          animation: 'fadeInScale 0.6s ease-out 0.6s both'
        }}>
          一緒に健康的な習慣を作っていきましょう！
        </p>
        
        {/* Welcome bonus */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '32px',
          border: '2px solid #374151',
          animation: 'slideUp 0.6s ease-out 0.8s both',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <span style={{ fontSize: '32px', animation: 'bounce 1.5s ease-in-out infinite' }}>🎁</span>
            <div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>ウェルカムボーナス</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#fbbf24' }}>+100 XP</div>
            </div>
          </div>
        </div>
        
        <BirdMascot emotion="happy" size={100} />
        
        <button
          onClick={handleComplete}
          style={{
            padding: '16px 48px',
            backgroundColor: '#a3e635',
            color: '#111827',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '32px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635' }}
        >
          ダッシュボードへ
        </button>

        <style jsx>{`
          @keyframes celebrateBounce {
            0% { transform: scale(0) rotate(0); opacity: 0; }
            50% { transform: scale(1.2) rotate(180deg); }
            70% { transform: scale(0.9) rotate(270deg); }
            100% { transform: scale(1) rotate(360deg); opacity: 1; }
          }
          
          @keyframes rotateParty {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(-10deg) scale(1.1); }
            75% { transform: rotate(10deg) scale(1.1); }
          }
          
          @keyframes rippleOut {
            0% { transform: scale(0.5); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.9) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          
          @keyframes slideUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes wingFlap {
            0%, 100% { transform: rotate(-15deg) translateY(0); }
            50% { transform: rotate(-25deg) translateY(-2px); }
          }
          
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
          
          ${[...Array(8)].map((_, i) => `
            @keyframes confetti${i} {
              0% { transform: translate(0, 0) scale(1); opacity: 1; }
              100% { 
                transform: translate(${Math.cos(i * Math.PI / 4) * 80}px, ${Math.sin(i * Math.PI / 4) * 80}px) scale(0); 
                opacity: 0;
              }
            }
          `).join('')}
        `}</style>
      </div>
    )
  }

  // Form screens
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Progress bar */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
            ステップ {currentStep + 1} / {steps.length}
          </span>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            スキップ
          </button>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#374151',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#a3e635',
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%',
        minHeight: 0,
        overflow: 'auto'
      }}>
        {/* Top Section with Bird and Question */}
        <div style={{ marginBottom: '20px' }}>
          {/* Bird mascot */}
          <div style={{ margin: '0 auto 24px', display: 'flex', justifyContent: 'center' }}>
            <BirdMascot size={60} />
          </div>

          {/* Question */}
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#f3f4f6',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            {currentStepData.title}
          </h2>
          {currentStepData.subtitle && (
            <p style={{
              fontSize: '13px',
              color: '#9ca3af',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {currentStepData.subtitle}
            </p>
          )}
        </div>

        {/* Input field */}
        {currentStepData.type === 'input' && (
          <input
            type="text"
            value={formData[currentStepData.field as keyof typeof formData] as string}
            onChange={(e) => handleInputChange(currentStepData.field!, e.target.value)}
            placeholder={currentStepData.placeholder}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#1f2937',
              border: '2px solid #374151',
              borderRadius: '12px',
              color: '#f3f4f6',
              fontSize: '16px',
              outline: 'none',
              marginBottom: '32px',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#a3e635' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#374151' }}
          />
        )}

        {/* Select options */}
        {currentStepData.type === 'select' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '24px'
          }}>
            {currentStepData.options?.map((option) => {
              const isSelected = formData[currentStepData.field as keyof typeof formData] === option
              return (
                <button
                  key={option}
                  onClick={() => handleInputChange(currentStepData.field!, option)}
                  style={{
                    padding: '16px',
                    backgroundColor: isSelected ? '#a3e635' : '#1f2937',
                    color: isSelected ? '#111827' : '#d1d5db',
                    border: isSelected ? '2px solid #a3e635' : '2px solid #374151',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
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

        {/* Multi-select options */}
        {currentStepData.type === 'multiselect' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '24px',
            maxHeight: '240px',
            overflowY: 'auto',
            padding: '4px'
          }}>
            {currentStepData.options?.map((option) => {
              const isSelected = (formData[currentStepData.field as keyof typeof formData] as string[]).includes(option)
              return (
                <button
                  key={option}
                  onClick={() => handleMultiSelect(currentStepData.field!, option)}
                  style={{
                    padding: '12px 8px',
                    backgroundColor: isSelected ? '#a3e635' : '#1f2937',
                    color: isSelected ? '#111827' : '#d1d5db',
                    border: isSelected ? '2px solid #a3e635' : '2px solid #374151',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '44px'
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
                  {isSelected && <span style={{ marginRight: '6px' }}>✓</span>}
                  {option}
                </button>
              )
            })}
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', paddingBottom: '20px' }}>
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
          
          <button
            onClick={handleNext}
            disabled={
              currentStepData.type === 'input' && !formData[currentStepData.field as keyof typeof formData] ||
              currentStepData.type === 'select' && !formData[currentStepData.field as keyof typeof formData]
            }
            style={{
              flex: 2,
              padding: '14px',
              backgroundColor: '#a3e635',
              color: '#111827',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: (
                currentStepData.type === 'input' && !formData[currentStepData.field as keyof typeof formData] ||
                currentStepData.type === 'select' && !formData[currentStepData.field as keyof typeof formData]
              ) ? 0.5 : 1
            }}
            onMouseEnter={(e) => { 
              if (!(currentStepData.type === 'input' && !formData[currentStepData.field as keyof typeof formData]) &&
                  !(currentStepData.type === 'select' && !formData[currentStepData.field as keyof typeof formData])) {
                e.currentTarget.style.backgroundColor = '#84cc16' 
              }
            }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635' }}
          >
            次へ
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes wingFlap {
          0%, 100% { transform: rotate(-15deg) translateY(0); }
          50% { transform: rotate(-25deg) translateY(-2px); }
        }
      `}</style>
    </div>
  )
}