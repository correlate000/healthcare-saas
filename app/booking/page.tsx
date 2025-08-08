'use client'

import { useState, useEffect } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { DoctorFemaleIcon, DoctorMaleIcon, PsychiatristIcon, ClockIcon, StarIcon } from '@/components/icons/illustrations'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSpecialist, setSelectedSpecialist] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [consultationType, setConsultationType] = useState<'video' | 'phone'>('video')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const specialists = [
    {
      id: 1,
      name: '田中 美咲',
      title: '臨床心理士',
      specialty: ['ストレス管理', 'うつ病', '不安障害'],
      rating: 4.9,
      reviews: 127,
      experience: '8年',
      description: '職場でのストレスや人間関係の悩みを専門としています。認知行動療法を中心とした治療を行っています。',
      nextAvailable: '今日 14:00',
      image: <DoctorFemaleIcon size={30} primaryColor="#60a5fa" />
    },
    {
      id: 2,
      name: '佐藤 健一',
      title: '臨床心理士',
      specialty: ['ストレス管理', 'パニック障害', 'PTSD'],
      rating: 4.8,
      reviews: 98,
      experience: '6年',
      description: 'トラウマやパニック障害の治療を専門としています。EMDRなどの専門的な治療法も提供しています。',
      nextAvailable: '明日 10:00',
      image: <DoctorMaleIcon size={30} primaryColor="#60a5fa" />
    },
    {
      id: 3,
      name: '鈴木 理恵',
      title: '精神科医',
      specialty: ['うつ病', '双極性障害', '統合失調症'],
      rating: 4.9,
      reviews: 156,
      experience: '12年',
      description: '薬物療法と心理療法を組み合わせた包括的な治療を行っています。重篤な精神疾患の治療経験が豊富です。',
      nextAvailable: '明後日 9:00',
      image: <PsychiatristIcon size={30} primaryColor="#a78bfa" />
    }
  ]

  const dates = ['6/1', '6/2', '6/3', '6/4', '6/5']
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return selectedSpecialist !== null
    if (currentStep === 2) return selectedDate !== null && selectedTime !== null
    return true
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: '140px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(31, 41, 55, 0.4)'
      }}>
        <h1 style={{
          ...typographyPresets.pageTitle(),
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          専門家予約
        </h1>
        <p style={{ ...getTypographyStyles('base'), color: '#9ca3af', marginTop: '8px', margin: '8px 0 0 0' }}>
          最近のチェックイン内容から、ストレス管理が得意な専門家をおすすめします。
        </p>
      </div>

      {/* Progress Bar with Labels */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '32px',
          position: 'relative'
        }}>
          {[
            { step: 1, label: '専門家選択' },
            { step: 2, label: '日時選択' },
            { step: 3, label: '確認・決済' }
          ].map((item, index) => (
            <div
              key={item.step}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {/* Step circle and line */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= item.step ? '#a3e635' : 'rgba(55, 65, 81, 0.6)',
                  color: currentStep >= item.step ? '#111827' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  zIndex: 2,
                  border: currentStep === item.step ? '2px solid rgba(163, 230, 53, 0.3)' : 'none',
                  flexShrink: 0
                }}>
                  {currentStep > item.step ? '✓' : item.step}
                </div>
                {index < 2 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: currentStep > item.step ? '#a3e635' : 'rgba(55, 65, 81, 0.6)',
                    marginLeft: '4px',
                    marginRight: '4px',
                    transition: 'all 0.3s ease'
                  }}></div>
                )}
              </div>
              
              {/* Step label */}
              <span style={{
                fontSize: isMobile ? '11px' : '12px',
                color: currentStep === item.step ? '#a3e635' : currentStep > item.step ? '#d1d5db' : '#9ca3af',
                fontWeight: currentStep === item.step ? '600' : '400',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                marginTop: '8px'
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {/* Step 1: Specialist Selection */}
        {currentStep === 1 && (
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f3f4f6',
              marginBottom: '20px'
            }}>
              専門家を選択してください
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {specialists.map((specialist) => (
                <button
                  key={specialist.id}
                  onClick={() => setSelectedSpecialist(specialist.id)}
                  style={{
                    width: '100%',
                    padding: '20px',
                    background: selectedSpecialist === specialist.id
                      ? 'linear-gradient(135deg, rgba(163, 230, 53, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)'
                      : 'rgba(31, 41, 55, 0.6)',
                    backdropFilter: 'blur(12px)',
                    border: selectedSpecialist === specialist.id
                      ? '2px solid rgba(163, 230, 53, 0.4)'
                      : '1px solid rgba(55, 65, 81, 0.3)',
                    borderRadius: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '16px' }}>
                    <div style={{
                      width: isMobile ? '50px' : '60px',
                      height: isMobile ? '50px' : '60px',
                      background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '24px' : '30px',
                      flexShrink: 0
                    }}>
                      {specialist.image}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
                          {specialist.name}
                        </h3>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: 'rgba(163, 230, 53, 0.2)',
                          color: '#a3e635',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          おすすめ
                        </span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        alignItems: 'center', 
                        gap: isMobile ? '8px' : '12px', 
                        marginBottom: '8px' 
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: 'rgba(96, 165, 250, 0.2)',
                          color: '#60a5fa',
                          borderRadius: '8px',
                          fontSize: isMobile ? '11px' : '12px',
                          fontWeight: '500',
                          whiteSpace: 'nowrap'
                        }}>
                          {specialist.title}
                        </span>
                        <span style={{ fontSize: isMobile ? '11px' : '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                          {specialist.experience}の経験
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <StarIcon size={14} color="#fbbf24" filled />
                          <span style={{ fontSize: isMobile ? '11px' : '12px', color: '#fbbf24', fontWeight: '500', whiteSpace: 'nowrap' }}>
                            {specialist.rating} ({specialist.reviews}件)
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                        {specialist.specialty.map((spec) => (
                          <span
                            key={spec}
                            style={{
                              padding: '2px 8px',
                              backgroundColor: 'rgba(55, 65, 81, 0.6)',
                              color: '#d1d5db',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      
                      <p style={{ fontSize: '13px', color: '#d1d5db', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                        {specialist.description}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ClockIcon size={12} primaryColor="#9ca3af" />
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>{specialist.nextAvailable}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 2 && (
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f3f4f6',
              marginBottom: '20px'
            }}>
              日時を選択してください
            </h2>

            {/* Consultation Type */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '12px' }}>
                面談方法
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <button
                  onClick={() => setConsultationType('video')}
                  style={{
                    padding: '16px',
                    background: consultationType === 'video'
                      ? 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)'
                      : 'rgba(31, 41, 55, 0.6)',
                    color: consultationType === 'video' ? '#111827' : '#d1d5db',
                    border: consultationType === 'video'
                      ? 'none'
                      : '1px solid rgba(55, 65, 81, 0.3)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>ビデオ通話</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>推奨</div>
                </button>
                <button
                  onClick={() => setConsultationType('phone')}
                  style={{
                    padding: '16px',
                    background: consultationType === 'phone'
                      ? 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)'
                      : 'rgba(31, 41, 55, 0.6)',
                    color: consultationType === 'phone' ? '#111827' : '#d1d5db',
                    border: consultationType === 'phone'
                      ? 'none'
                      : '1px solid rgba(55, 65, 81, 0.3)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>電話</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>音声のみ</div>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '12px' }}>
                日付選択
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    style={{
                      padding: '12px 8px',
                      backgroundColor: selectedDate === date
                        ? '#a3e635'
                        : 'rgba(31, 41, 55, 0.6)',
                      color: selectedDate === date ? '#111827' : '#d1d5db',
                      border: selectedDate === date
                        ? 'none'
                        : '1px solid rgba(55, 65, 81, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '12px' }}>
                時間選択
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {times.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '12px',
                      backgroundColor: selectedTime === time
                        ? '#a3e635'
                        : 'rgba(31, 41, 55, 0.6)',
                      color: selectedTime === time ? '#111827' : '#d1d5db',
                      border: selectedTime === time
                        ? 'none'
                        : '1px solid rgba(55, 65, 81, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#f3f4f6',
              marginBottom: '20px'
            }}>
              予約内容の確認
            </h2>

            <div style={{
              background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(163, 230, 53, 0.2)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {specialists.find(s => s.id === selectedSpecialist)?.image}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6' }}>
                    {specialists.find(s => s.id === selectedSpecialist)?.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                    {specialists.find(s => s.id === selectedSpecialist)?.title}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(55, 65, 81, 0.3)'
                }}>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>日時</span>
                  <span style={{ color: '#f3f4f6', fontWeight: '500', fontSize: '14px' }}>
                    {selectedDate} {selectedTime}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(55, 65, 81, 0.3)'
                }}>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>方法</span>
                  <span style={{ color: '#f3f4f6', fontWeight: '500', fontSize: '14px' }}>
                    {consultationType === 'video' ? 'ビデオ通話' : '電話'} (50分)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>料金</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#f3f4f6', fontWeight: '600', fontSize: '18px' }}>¥8,000</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>企業保険により一部負担軽減適用</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(96, 165, 250, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid rgba(96, 165, 250, 0.2)'
            }}>
              <div style={{ fontSize: '12px', color: '#60a5fa', lineHeight: '1.6' }}>
                ※ キャンセルは24時間前まで無料です<br/>
                ※ 相談内容は厳重に秘匿管理されます<br/>
                ※ 予約確定後、面談リンクをメールで送付します
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '32px'
        }}>
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: 'rgba(55, 65, 81, 0.6)',
                color: '#d1d5db',
                border: '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              戻る
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={!canProceed()}
              style={{
                flex: currentStep === 1 ? 1 : 2,
                padding: '16px',
                background: canProceed()
                  ? 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)'
                  : 'rgba(55, 65, 81, 0.6)',
                color: canProceed() ? '#111827' : '#6b7280',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: canProceed() ? 1 : 0.5
              }}
            >
              次へ
            </button>
          ) : (
            <button
              style={{
                flex: 2,
                padding: '16px',
                background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                color: '#111827',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
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
              予約を確定する
            </button>
          )}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}