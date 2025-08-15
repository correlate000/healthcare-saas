'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { HappyFaceIcon, SadFaceIcon, CalmIcon, StressedIcon, EnergeticIcon, ThinkingIcon, MeditationIcon, SleepingIcon } from '@/components/icons/illustrations'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { UserDataStorage } from '@/utils/storage'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function CheckIn() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false)
  const [streakDays] = useState(15) // TODO: Get from user data
  const [isMobile, setIsMobile] = useState(false)
  
  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Bird character SVG component
  const BirdCharacter = ({ bodyColor, bellyColor, size = 100 }: { bodyColor: string, bellyColor: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <ellipse cx="50" cy="55" rx="35" ry="38" fill={bodyColor} />
      <ellipse cx="50" cy="60" rx="25" ry="28" fill={bellyColor} />
      <ellipse cx="25" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(-20 25 50)" />
      <ellipse cx="75" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(20 75 50)" />
      <circle cx="40" cy="45" r="6" fill="white" />
      <circle cx="42" cy="45" r="4" fill="#111827" />
      <circle cx="43" cy="44" r="2" fill="white" />
      <circle cx="60" cy="45" r="6" fill="white" />
      <circle cx="58" cy="45" r="4" fill="#111827" />
      <circle cx="59" cy="44" r="2" fill="white" />
      <path d="M50 52 L45 57 L55 57 Z" fill="#fbbf24" />
    </svg>
  )

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
    // Validate required fields
    if (steps[currentStep].type !== 'textarea' && !responses[steps[currentStep].id]) {
      return // Don't complete if current step has no response
    }
    
    // Save checkin data
    const checkinData = {
      ...responses,
      date: new Date().toISOString(),
      timestamp: Date.now()
    }
    
    // Save to localStorage using storage utility
    try {
      UserDataStorage.setCheckinData(checkinData)
      UserDataStorage.setLastCheckin(new Date().toDateString())
      
      // Update streak
      const currentStreak = UserDataStorage.getStreak()
      UserDataStorage.setStreak(currentStreak + 1)
      
      // Add XP for checkin
      const currentXP = UserDataStorage.getXP()
      UserDataStorage.setXP(currentXP + 50)
    } catch (error) {
      console.error('Failed to save checkin data:', error)
    }
    
    setCurrentStep(-1) // Show completion screen
    // Redirect to analytics after showing completion screen
    setTimeout(() => {
      router.push('/analytics')
    }, 3000)
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  // Get step-by-step guidance messages
  const getStepGuidanceMessage = (stepIndex: number) => {
    const guidanceMessages = [
      "今日の気分を教えてくださいね。正直な気持ちが一番大切です✨",
      "からだの調子はいかがですか？心とからだは繋がっています💫",
      "ストレスは誰にでもあるもの。感じたままを選んでください🌱",
      "今日何をしたか、楽しくお話しましょう！複数選択もOKです🎈",
      "最後に、今日の特別な思い出があれば教えてください。なくても大丈夫！💝"
    ]
    return guidanceMessages[stepIndex] || "一緒にがんばりましょう！"
  }

  // Get personalized message based on mood
  const getPersonalizedMessage = () => {
    const mood = responses.mood
    const physical = responses.physical
    
    // Select character based on mood
    let character = { name: 'るな', bodyColor: '#a3e635', bellyColor: '#ecfccb' }
    let message = ''
    
    if (mood === '素晴らしい' || mood === 'いい感じ') {
      character = { name: 'あーりあ', bodyColor: '#60a5fa', bellyColor: '#dbeafe' }
      const messages = [
        'すごい！今日も絶好調ですね！この調子を維持していきましょう！',
        'キラキラ輝いていますね！あなたのポジティブなエネルギーが周りも明るくします！',
        'やったー！今日も素敵な一日になりそうですね！',
        '最高の調子ですね！今日の良い気分を大切にしてください。'
      ]
      message = messages[Math.floor(Math.random() * messages.length)]
    } else if (mood === '普通') {
      character = { name: 'るな', bodyColor: '#a3e635', bellyColor: '#ecfccb' }
      const messages = [
        'お疲れ様です。普通の日こそ、実は大切な一日なんですよ。',
        '今日も一歩ずつ前進していますね。それで十分素晴らしいです。',
        '穏やかな一日も良いものです。自分のペースを大切に。',
        'バランスが取れている証拠です。無理せず進んでいきましょう。'
      ]
      message = messages[Math.floor(Math.random() * messages.length)]
    } else {
      character = { name: 'ぜん', bodyColor: '#f59e0b', bellyColor: '#fed7aa' }
      const messages = [
        '今日は休息が必要かもしれません。自分を大切にする時間を作りましょう。',
        'お疲れ様です。しっかり記録することが、明日への第一歩です。',
        '辛い時こそ、自分に優しくしてあげてください。私たちがついています。',
        '今日を乗り越えたあなたは強い。ゆっくり休んでくださいね。'
      ]
      message = messages[Math.floor(Math.random() * messages.length)]
    }
    
    return { character, message }
  }

  if (currentStep === -1) {
    const { character, message } = getPersonalizedMessage()
    
    // Completion screen with character message
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#111827', 
        color: 'white',
        paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ 
          padding: '20px',
          paddingTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: `calc(100vh - ${MOBILE_PAGE_PADDING_BOTTOM}px)`
        }}>
          {/* Character with animation */}
          <div style={{
            marginBottom: '24px',
            animation: 'bounceIn 0.6s ease-out'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#374151',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}>
              <BirdCharacter 
                bodyColor={character.bodyColor} 
                bellyColor={character.bellyColor}
                size={100}
              />
            </div>
          </div>

          {/* Character name */}
          <div style={{
            backgroundColor: character.bodyColor,
            color: '#0f172a',
            padding: '4px 12px',
            borderRadius: '12px',
            ...getTypographyStyles('small'),
            fontWeight: '600',
            marginBottom: '16px'
          }}>
            {character.name}
          </div>

          {/* Personalized message */}
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            maxWidth: '400px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid #1f2937'
            }}></div>
            <p style={{
              ...getTypographyStyles('large'),
              color: '#f3f4f6',
              textAlign: 'center',
              margin: 0
            }}>
              {message}
            </p>
          </div>

          {/* Streak achievement */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '32px' }}>🔥</span>
              <span style={{
                ...getTypographyStyles('h1'),
                color: '#a3e635'
              }}>
                {streakDays}日
              </span>
            </div>
            <p style={{
              ...getTypographyStyles('base'),
              color: '#9ca3af'
            }}>
              連続チェックイン達成中！
            </p>
          </div>

          {/* Rewards earned today with animation */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '40px',
            animation: 'slideUp 0.8s ease-out 0.4s both'
          }}>
            <div style={{
              backgroundColor: '#374151',
              borderRadius: '16px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              animation: 'pulse 2s ease-in-out 3',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
                animation: 'ripple 3s ease-out 2'
              }}></div>
              <span style={{ fontSize: '24px', animation: 'bounce 1.5s ease-in-out 3', position: 'relative' }}>⭐</span>
              <div style={{ position: 'relative' }}>
                <div style={{ ...getTypographyStyles('h4'), fontWeight: '700', color: '#fbbf24', animation: 'countUp 1s ease-out 0.5s both' }}>+50 XP</div>
                <div style={{ ...getTypographyStyles('small'), color: '#9ca3af', marginTop: '2px' }}>獲得しました</div>
              </div>
            </div>
            <div style={{
              backgroundColor: '#374151',
              borderRadius: '16px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(163, 230, 53, 0.2)',
              border: '1px solid rgba(163, 230, 53, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '4px',
                backgroundColor: '#a3e635',
                animation: 'progressBar 1.5s ease-out 0.6s both'
              }}></div>
              <span style={{ fontSize: '24px', animation: 'rotate 2s ease-in-out 2' }}>🏆</span>
              <div>
                <div style={{ ...getTypographyStyles('h4'), fontWeight: '700', color: '#a3e635' }}>Lv.8</div>
                <div style={{ ...getTypographyStyles('small'), color: '#9ca3af', marginTop: '2px' }}>あと150XP</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            maxWidth: '300px'
          }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '14px',
                backgroundColor: '#a3e635',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                ...getTypographyStyles('button'),
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635' }}
            >
              ダッシュボードへ
            </button>
            <button
              onClick={() => router.push('/analytics')}
              style={{
                padding: '14px',
                backgroundColor: '#374151',
                color: '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                ...getTypographyStyles('button'),
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
            >
              今日の分析を見る
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-10deg);
            }
            75% {
              transform: rotate(10deg);
            }
            100% {
              transform: rotate(0deg);
            }
          }
          
          @keyframes countUp {
            0% {
              opacity: 0;
              transform: scale(0.5) translateY(-20px);
            }
            50% {
              transform: scale(1.2) translateY(0);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          
          @keyframes progressBar {
            0% {
              width: 0;
            }
            100% {
              width: 100%;
            }
          }
        `}</style>

        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        padding: '16px',
        paddingBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100vh - ${MOBILE_PAGE_PADDING_BOTTOM}px)`,
        maxHeight: `calc(100vh - ${MOBILE_PAGE_PADDING_BOTTOM}px)`
      }}>
        {/* Character with guidance message */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
          {/* Character Avatar */}
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: '#374151',
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            animation: 'characterBounce 2s ease-in-out infinite'
          }}>
            <BirdCharacter 
              bodyColor="#a3e635" 
              bellyColor="#ecfccb"
              size={60}
            />
          </div>
          
          {/* Character guidance message */}
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            padding: '12px 16px',
            position: 'relative',
            maxWidth: '280px',
            textAlign: 'center'
          }}>
            {/* Speech bubble arrow */}
            <div style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid #1f2937'
            }}></div>
            <p style={{
              ...getTypographyStyles('small'),
              color: '#f3f4f6',
              margin: 0,
              fontWeight: '500'
            }}>
              {getStepGuidanceMessage(currentStep)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ ...getTypographyStyles('small'), color: '#9ca3af' }}>ステップ {currentStep + 1} / {steps.length}</span>
            <span style={{ ...getTypographyStyles('small'), color: '#9ca3af' }}>{Math.round(progress)}%</span>
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
          <h1 style={{ ...getTypographyStyles('h3'), color: '#f3f4f6', marginBottom: '4px' }}>
            {currentStepData.title}
          </h1>
          {currentStepData.subtitle && (
            <p style={{ ...getTypographyStyles('base'), color: '#9ca3af' }}>{currentStepData.subtitle}</p>
          )}
        </div>

        {/* Answer options - optimized for mobile */}
        <div style={{ 
          flex: 1,
          overflowY: currentStepData.multiple ? 'hidden' : 'auto',
          marginBottom: '16px',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: currentStepData.multiple ? 'center' : 'flex-start'
        }}>
          {currentStepData.type === 'textarea' ? (
            <textarea
              placeholder={currentStepData.placeholder}
              value={responses[currentStepData.id] || ''}
              onChange={(e) => handleResponse(e.target.value)}
              style={{
                width: '100%',
                minHeight: '150px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '16px',
                color: '#d1d5db',
                ...getTypographyStyles('base'),
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#a3e635' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#374151' }}
            />
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: currentStepData.multiple ? 'repeat(2, 1fr)' : '1fr',
              gap: '8px',
              maxHeight: currentStepData.multiple ? '280px' : 'auto'
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
                      padding: currentStepData.multiple ? '12px 8px' : '16px',
                      backgroundColor: isSelected ? '#a3e635' : '#1f2937',
                      color: isSelected ? '#0f172a' : '#d1d5db',
                      border: isSelected ? '2px solid #a3e635' : '1px solid #374151',
                      borderRadius: '12px',
                      ...(currentStepData.multiple ? getTypographyStyles('base') : getTypographyStyles('large')),
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
                ...getTypographyStyles('button'),
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
                ...getTypographyStyles('base'),
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
                  ((responses[currentStepData.id] && responses[currentStepData.id].length > 0) ? '#0f172a' : '#9ca3af') :
                  '#0f172a', // Always enabled for textarea
                border: 'none',
                borderRadius: '12px',
                ...getTypographyStyles('button'),
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
        
        @keyframes characterBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  )
}