'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTypographyStyles, typographyPresets } from '@/styles/typography'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    goals: [] as string[],
    conditions: [] as string[],
    preferredTime: '',
    notifications: true,
    selectedCharacter: 'luna'
  })

  const steps = [
    {
      id: 'welcome',
      type: 'intro'
    },
    {
      id: 'name',
      type: 'input',
      title: 'はじめまして！\nお名前を教えてください',
      subtitle: 'ニックネームでもOKです（スキップ可）',
      field: 'name',
      placeholder: '例: ゆうた'
    },
    {
      id: 'character',
      type: 'character',
      title: 'パートナーを選んでください',
      subtitle: 'あなたをサポートするキャラクターです',
      field: 'selectedCharacter'
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

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  // Scroll to top when showing completion screen  
  useEffect(() => {
    if (currentStepData && currentStepData.type === 'complete') {
      window.scrollTo(0, 0)
    }
  }, [currentStepData])

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
    localStorage.setItem('onboardingComplete', 'true')
    localStorage.setItem('userData', JSON.stringify(formData))
    // Save as userSettings for consistency
    localStorage.setItem('userSettings', JSON.stringify({
      ...formData,
      onboardingCompleted: true,
      completedAt: new Date().toISOString()
    }))
    router.push('/dashboard')
  }

  const handleInputChange = (field: string, value: any, autoAdvance: boolean = false) => {
    setFormData({ ...formData, [field]: value })
    // Save user name to localStorage immediately when entered
    if (field === 'name' && value) {
      localStorage.setItem('userName', value)
    }
    // Save selected character
    if (field === 'selectedCharacter') {
      localStorage.setItem('selectedCharacter', value)
    }
    // Auto advance for select/radio type inputs
    if (autoAdvance && value) {
      setTimeout(() => {
        handleNext()
      }, 300)
    }
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
        background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        {/* Animated welcome icon */}
        <div style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(163, 230, 53, 0.4)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V12C2 16.55 4.84 20.74 9 22.23C10.11 22.57 11.06 22.57 12 22.57C12.94 22.57 13.89 22.57 15 22.23C19.16 20.74 22 16.55 22 12V7L12 2Z" fill="#111827" opacity="0.2"/>
            <path d="M12 2L2 7V12C2 16.55 4.84 20.74 9 22.23V11.5L12 9.5L15 11.5V22.23C19.16 20.74 22 16.55 22 12V7L12 2Z" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" fill="#111827"/>
          </svg>
        </div>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '16px',
          letterSpacing: '-1px'
        }}>
          ようこそ！
        </h1>
        
        <p style={{
          ...getTypographyStyles('h4'),
          color: '#d1d5db',
          marginBottom: '32px',
          lineHeight: '1.6',
          maxWidth: '360px'
        }}>
          メンタルヘルスケアの新しい旅を始めましょう
        </p>
        
        <p style={{
          ...getTypographyStyles('base'),
          color: '#9ca3af',
          marginBottom: '48px',
          maxWidth: '320px',
          lineHeight: '1.6'
        }}>
          あなたに合わせたパーソナライズされた体験を提供するために、いくつか質問させてください
        </p>
        
        <button
          onClick={handleNext}
          style={{
            padding: '16px 48px',
            background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
            color: '#0f172a',
            border: 'none',
            borderRadius: '12px',
            ...getTypographyStyles('h4'),
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(163, 230, 53, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(163, 230, 53, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(163, 230, 53, 0.3)'
          }}
        >
          始める
        </button>
        
        <p style={{
          ...getTypographyStyles('small'),
          color: '#6b7280',
          marginTop: '24px'
        }}>
          3分程度で完了します
        </p>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
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
        background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto'
      }}>
        {/* Celebration animation */}
        <div style={{
          width: '140px',
          height: '140px',
          background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '40px',
          boxShadow: '0 8px 32px rgba(163, 230, 53, 0.4)',
          animation: 'celebrateBounce 1s ease-out'
        }}>
          <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11L12 14L22 4" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1 style={{
          fontSize: '32px', // Keep custom size for completion screen
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '20px',
          letterSpacing: '-0.5px'
        }}>
          準備完了！
        </h1>
        
        <p style={{
          ...getTypographyStyles('h4'),
          color: '#d1d5db',
          marginBottom: '20px',
          maxWidth: '360px',
          lineHeight: '1.7'
        }}>
          {formData.name ? `${formData.name}さん、` : ''}設定が完了しました。
        </p>
        
        <p style={{
          ...getTypographyStyles('large'),
          color: '#9ca3af',
          marginBottom: '40px',
          maxWidth: '360px',
          lineHeight: '1.6'
        }}>
          一緒に健康的な習慣を作っていきましょう！
        </p>
        
        {/* Welcome bonus */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '20px 32px',
          marginBottom: '32px',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12V22H4V12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 7H2V12H22V7Z" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V7" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div style={{ ...getTypographyStyles('base'), color: '#9ca3af', marginBottom: '4px' }}>ウェルカムボーナス</div>
              <div style={{ ...getTypographyStyles('h2'), fontWeight: '700', color: '#fbbf24' }}>+100 XP</div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleComplete}
          style={{
            padding: '16px 48px',
            background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
            color: '#0f172a',
            border: 'none',
            borderRadius: '12px',
            ...getTypographyStyles('h4'),
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(163, 230, 53, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(163, 230, 53, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(163, 230, 53, 0.3)'
          }}
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
        `}</style>
      </div>
    )
  }

  // Form screens
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Progress bar */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(31, 41, 55, 0.4)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{ ...getTypographyStyles('small'), color: '#9ca3af' }}>
            ステップ {currentStep + 1} / {steps.length}
          </span>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9ca3af',
              ...getTypographyStyles('base'),
              cursor: 'pointer'
            }}
          >
            スキップ
          </button>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'rgba(55, 65, 81, 0.6)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #a3e635 0%, #84cc16 100%)',
            borderRadius: '3px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(163, 230, 53, 0.4)'
          }}></div>
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Question */}
        <h2 style={{
          ...getTypographyStyles('h2'),
          fontWeight: '700',
          color: '#f3f4f6',
          marginBottom: '8px',
          textAlign: 'center',
          lineHeight: '1.4',
          whiteSpace: 'pre-wrap'
        }}>
          {currentStepData.title}
        </h2>
        {currentStepData.subtitle && (
          <p style={{
            ...getTypographyStyles('base'),
            color: '#9ca3af',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            {currentStepData.subtitle}
          </p>
        )}

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
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '2px solid rgba(55, 65, 81, 0.3)',
              borderRadius: '12px',
              color: '#f3f4f6',
              ...getTypographyStyles('large'),
              outline: 'none',
              marginBottom: '32px',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(163, 230, 53, 0.4)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(163, 230, 53, 0.2)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.3)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        )}

        {/* Character selection */}
        {currentStepData.type === 'character' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {[
              { id: 'luna', name: 'るな', icon: '🌙', color: '#a3e635', bodyColor: '#a3e635', bellyColor: '#ecfccb', description: '穏やかで優しい' },
              { id: 'aria', name: 'あーりあ', icon: '✨', color: '#60a5fa', bodyColor: '#60a5fa', bellyColor: '#dbeafe', description: '明るく元気' },
              { id: 'zen', name: 'ぜん', icon: '🧘', color: '#f59e0b', bodyColor: '#f59e0b', bellyColor: '#fed7aa', description: '落ち着いた雰囲気' }
            ].map((character) => {
              const isSelected = formData.selectedCharacter === character.id
              return (
                <button
                  key={character.id}
                  onClick={() => handleInputChange('selectedCharacter', character.id, true)}
                  style={{
                    padding: '20px 16px',
                    background: isSelected
                      ? `linear-gradient(135deg, ${character.color}40, ${character.color}20)`
                      : 'rgba(31, 41, 55, 0.6)',
                    backdropFilter: 'blur(12px)',
                    border: isSelected
                      ? `2px solid ${character.color}`
                      : '1px solid rgba(55, 65, 81, 0.3)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected
                      ? `0 4px 20px ${character.color}40`
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  {/* Bird SVG */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: character.color + '20',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="45" height="45" viewBox="0 0 100 100" style={{ display: 'block' }}>
                      <ellipse cx="50" cy="55" rx="35" ry="38" fill={character.bodyColor} />
                      <ellipse cx="50" cy="60" rx="25" ry="28" fill={character.bellyColor} />
                      <ellipse cx="25" cy="50" rx="15" ry="25" fill={character.bodyColor} transform="rotate(-20 25 50)" />
                      <ellipse cx="75" cy="50" rx="15" ry="25" fill={character.bodyColor} transform="rotate(20 75 50)" />
                      <circle cx="40" cy="45" r="6" fill="white" />
                      <circle cx="42" cy="45" r="4" fill="#111827" />
                      <circle cx="43" cy="44" r="2" fill="white" />
                      <circle cx="60" cy="45" r="6" fill="white" />
                      <circle cx="58" cy="45" r="4" fill="#111827" />
                      <circle cx="59" cy="44" r="2" fill="white" />
                      <path d="M50 52 L45 57 L55 57 Z" fill="#fbbf24" />
                    </svg>
                  </div>
                  <div style={{
                    ...getTypographyStyles('base'),
                    fontWeight: '700',
                    color: isSelected ? character.color : '#f3f4f6'
                  }}>
                    {character.name}
                  </div>
                  <div style={{
                    ...getTypographyStyles('caption'),
                    color: '#9ca3af',
                    fontSize: '11px'
                  }}>
                    {character.description}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Select options */}
        {currentStepData.type === 'select' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '32px'
          }}>
            {currentStepData.options?.map((option) => {
              const isSelected = formData[currentStepData.field as keyof typeof formData] === option
              return (
                <button
                  key={option}
                  onClick={() => handleInputChange(currentStepData.field!, option, true)}
                  style={{
                    padding: '16px',
                    background: isSelected
                      ? 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)'
                      : 'rgba(31, 41, 55, 0.6)',
                    backdropFilter: 'blur(12px)',
                    color: isSelected ? '#111827' : '#d1d5db',
                    border: isSelected
                      ? 'none'
                      : '1px solid rgba(55, 65, 81, 0.3)',
                    borderRadius: '12px',
                    ...getTypographyStyles('base'),
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
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
            gap: '12px',
            marginBottom: '32px'
          }}>
            {currentStepData.options?.map((option) => {
              const isSelected = (formData[currentStepData.field as keyof typeof formData] as string[]).includes(option)
              return (
                <button
                  key={option}
                  onClick={() => handleMultiSelect(currentStepData.field!, option)}
                  style={{
                    padding: '14px',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(163, 230, 53, 0.2) 0%, rgba(31, 41, 55, 0.8) 100%)'
                      : 'rgba(31, 41, 55, 0.6)',
                    backdropFilter: 'blur(12px)',
                    color: isSelected ? '#a3e635' : '#d1d5db',
                    border: isSelected
                      ? '2px solid rgba(163, 230, 53, 0.4)'
                      : '1px solid rgba(55, 65, 81, 0.3)',
                    borderRadius: '12px',
                    ...getTypographyStyles('base'),
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {isSelected && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {option}
                </button>
              )
            })}
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: 'rgba(55, 65, 81, 0.6)',
                color: '#d1d5db',
                border: '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '12px',
                ...getTypographyStyles('large'),
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              戻る
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={
              currentStepData.type === 'select' && !formData[currentStepData.field as keyof typeof formData]
            }
            style={{
              flex: 2,
              padding: '14px',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#0f172a',
              border: 'none',
              borderRadius: '12px',
              ...getTypographyStyles('large'),
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: (
                currentStepData.type === 'select' && !formData[currentStepData.field as keyof typeof formData]
              ) ? 0.5 : 1,
              boxShadow: '0 4px 12px rgba(163, 230, 53, 0.3)'
            }}
            onMouseEnter={(e) => { 
              if (!(currentStepData.type === 'select' && !formData[currentStepData.field as keyof typeof formData])) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(163, 230, 53, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(163, 230, 53, 0.3)'
            }}
          >
            {currentStep === steps.length - 2 ? '完了' : '次へ'}
          </button>
        </div>
      </div>
    </div>
  )
}