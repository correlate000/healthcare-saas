'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTypographyStyles } from '@/styles/typography'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function WelcomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState('')
  const [userName, setUserName] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState('luna')

  const characters = [
    { id: 'luna', name: 'るな', icon: '🌙', color: '#a3e635', bodyColor: '#a3e635', bellyColor: '#ecfccb' },
    { id: 'aria', name: 'あーりあ', icon: '✨', color: '#60a5fa', bodyColor: '#60a5fa', bellyColor: '#dbeafe' },
    { id: 'zen', name: 'ぜん', icon: '🧘', color: '#f59e0b', bodyColor: '#f59e0b', bellyColor: '#fed7aa' }
  ]

  const goals = [
    { id: 'stress', label: 'ストレス管理', icon: '😌' },
    { id: 'sleep', label: '睡眠改善', icon: '😴' },
    { id: 'focus', label: '集中力向上', icon: '🎯' },
    { id: 'mood', label: '気分改善', icon: '😊' },
    { id: 'exercise', label: '運動習慣', icon: '💪' },
    { id: 'mindfulness', label: 'マインドフルネス', icon: '🧘' }
  ]

  const timePreferences = [
    { id: 'morning', label: '朝 (6:00-9:00)', icon: '🌅' },
    { id: 'lunch', label: '昼 (12:00-13:00)', icon: '☀️' },
    { id: 'evening', label: '夕方 (18:00-20:00)', icon: '🌆' },
    { id: 'night', label: '夜 (20:00-22:00)', icon: '🌙' }
  ]

  const currentCharacter = characters.find(c => c.id === selectedCharacter) || characters[0]

  const handleComplete = () => {
    const settings = {
      userName,
      goals: selectedGoals,
      preferredTime: selectedTime,
      selectedCharacter,
      onboardingCompleted: true,
      completedAt: new Date().toISOString()
    }
    
    localStorage.setItem('userSettings', JSON.stringify(settings))
    localStorage.setItem('selectedCharacter', selectedCharacter)
    router.push('/dashboard')
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return userName.length > 0
      case 1: return true
      case 2: return selectedGoals.length > 0
      case 3: return selectedTime !== ''
      default: return false
    }
  }

  // Bird character SVG component
  const BirdCharacter = ({ bodyColor, bellyColor, size = 60 }: { bodyColor: string, bellyColor: string, size?: number }) => (
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        background: 'rgba(31, 41, 55, 0.4)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          ...getTypographyStyles('h3'),
          fontWeight: '700',
          color: '#f3f4f6',
          margin: 0
        }}>
          はじめに設定
        </h1>
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px'
        }}>
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '3px',
                backgroundColor: step <= currentStep ? '#a3e635' : 'rgba(55, 65, 81, 0.6)',
                borderRadius: '2px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Step 0: 名前入力 */}
        {currentStep === 0 && (
          <div>
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                ...getTypographyStyles('h2'),
                fontWeight: '700',
                color: '#a3e635',
                marginBottom: '12px'
              }}>
                ようこそ MindCare へ
              </div>
              <p style={{
                ...getTypographyStyles('base'),
                color: '#9ca3af',
                marginBottom: '24px'
              }}>
                あなたのお名前を教えてください
              </p>
              <input
                type="text"
                placeholder="お名前"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  backgroundColor: 'rgba(55, 65, 81, 0.6)',
                  border: '1px solid rgba(55, 65, 81, 0.5)',
                  borderRadius: '12px',
                  color: '#f3f4f6',
                  fontSize: '16px',
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
            </div>
          </div>
        )}

        {/* Step 1: キャラクター選択 */}
        {currentStep === 1 && (
          <div>
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                ...getTypographyStyles('h3'),
                fontWeight: '700',
                color: '#f3f4f6',
                marginBottom: '20px'
              }}>
                パートナーを選ぶ
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                {characters.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedCharacter(char.id)}
                    style={{
                      backgroundColor: selectedCharacter === char.id 
                        ? char.color + '20' 
                        : 'rgba(55, 65, 81, 0.4)',
                      border: selectedCharacter === char.id 
                        ? `2px solid ${char.color}` 
                        : '2px solid rgba(55, 65, 81, 0.3)',
                      borderRadius: '16px',
                      padding: '16px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      margin: '0 auto 8px',
                      backgroundColor: char.color + '20',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <BirdCharacter 
                        bodyColor={char.bodyColor} 
                        bellyColor={char.bellyColor}
                        size={45}
                      />
                    </div>
                    <div style={{
                      ...getTypographyStyles('base'),
                      fontWeight: '600',
                      color: selectedCharacter === char.id ? char.color : '#f3f4f6'
                    }}>
                      {char.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 目標選択 */}
        {currentStep === 2 && (
          <div>
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '20px'
            }}>
              <div style={{
                ...getTypographyStyles('h3'),
                fontWeight: '700',
                color: '#f3f4f6',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                目標を選ぶ
              </div>
              <p style={{
                ...getTypographyStyles('small'),
                color: '#9ca3af',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                3つまで選択できます
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px'
              }}>
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => {
                      if (selectedGoals.includes(goal.id)) {
                        setSelectedGoals(selectedGoals.filter(g => g !== goal.id))
                      } else if (selectedGoals.length < 3) {
                        setSelectedGoals([...selectedGoals, goal.id])
                      }
                    }}
                    disabled={!selectedGoals.includes(goal.id) && selectedGoals.length >= 3}
                    style={{
                      padding: '12px',
                      backgroundColor: selectedGoals.includes(goal.id)
                        ? currentCharacter.color + '20'
                        : 'rgba(55, 65, 81, 0.4)',
                      border: selectedGoals.includes(goal.id)
                        ? `2px solid ${currentCharacter.color}`
                        : '2px solid rgba(55, 65, 81, 0.3)',
                      borderRadius: '12px',
                      cursor: !selectedGoals.includes(goal.id) && selectedGoals.length >= 3
                        ? 'not-allowed'
                        : 'pointer',
                      opacity: !selectedGoals.includes(goal.id) && selectedGoals.length >= 3
                        ? 0.5
                        : 1,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{goal.icon}</span>
                    <span style={{
                      ...getTypographyStyles('small'),
                      fontWeight: '600',
                      color: selectedGoals.includes(goal.id) ? currentCharacter.color : '#f3f4f6'
                    }}>
                      {goal.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 時間設定 */}
        {currentStep === 3 && (
          <div>
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '20px'
            }}>
              <div style={{
                ...getTypographyStyles('h3'),
                fontWeight: '700',
                color: '#f3f4f6',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                通知時間
              </div>
              <p style={{
                ...getTypographyStyles('small'),
                color: '#9ca3af',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                リマインダーの時間帯
              </p>
              <div style={{
                display: 'grid',
                gap: '10px'
              }}>
                {timePreferences.map((time) => (
                  <button
                    key={time.id}
                    onClick={() => setSelectedTime(time.id)}
                    style={{
                      padding: '14px',
                      backgroundColor: selectedTime === time.id
                        ? currentCharacter.color + '20'
                        : 'rgba(55, 65, 81, 0.4)',
                      border: selectedTime === time.id
                        ? `2px solid ${currentCharacter.color}`
                        : '2px solid rgba(55, 65, 81, 0.3)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{time.icon}</span>
                    <span style={{
                      ...getTypographyStyles('base'),
                      fontWeight: '600',
                      color: selectedTime === time.id ? currentCharacter.color : '#f3f4f6'
                    }}>
                      {time.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px'
        }}>
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: 'rgba(55, 65, 81, 0.6)',
                border: '1px solid rgba(55, 65, 81, 0.5)',
                borderRadius: '12px',
                color: '#f3f4f6',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              戻る
            </button>
          )}
          <button
            onClick={() => {
              if (currentStep < 3) {
                setCurrentStep(currentStep + 1)
              } else {
                handleComplete()
              }
            }}
            disabled={!canProceed()}
            style={{
              flex: 2,
              padding: '14px',
              backgroundColor: canProceed() ? currentCharacter.color : 'rgba(55, 65, 81, 0.4)',
              border: 'none',
              borderRadius: '12px',
              color: canProceed() ? '#0f172a' : '#6b7280',
              fontWeight: '700',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              opacity: canProceed() ? 1 : 0.5
            }}
          >
            {currentStep === 3 ? '始める' : '次へ'}
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}