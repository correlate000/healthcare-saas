'use client'

import { useState } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function BookingPage() {
  const [selectedSpecialist, setSelectedSpecialist] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [consultationType, setConsultationType] = useState<'video' | 'phone'>('video')

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
      image: '👩‍⚕️'
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
      image: '👨‍⚕️'
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
      image: '👩‍💼'
    }
  ]

  const dates = ['6/1', '6/2', '6/3', '6/4', '6/5']
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '140px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #374151' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
          専門家予約
        </h1>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px', margin: '8px 0 0 0' }}>
          最近のチェックイン内容から、ストレス管理が得意な専門家をおすすめします。
        </p>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Specialist selection */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            専門家を選択
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {specialists.map((specialist) => (
              <button
                key={specialist.id}
                onClick={() => setSelectedSpecialist(specialist.id)}
                style={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor: selectedSpecialist === specialist.id ? '#1f2937' : '#374151',
                  border: selectedSpecialist === specialist.id ? '2px solid #a3e635' : '1px solid #4b5563',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ fontSize: '40px' }}>{specialist.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
                        {specialist.name}
                      </h3>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#a3e635',
                        color: '#111827',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        おすすめ
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#065f46',
                        color: '#a3e635',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {specialist.title}
                      </span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {specialist.experience}の経験
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#fbbf24' }}>⭐</span>
                        <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '500' }}>
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
                            backgroundColor: '#4b5563',
                            color: '#d1d5db',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                    
                    <p style={{ fontSize: '14px', color: '#d1d5db', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                      {specialist.description}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>⏰</span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{specialist.nextAvailable}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Consultation method */}
        {selectedSpecialist && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
              面談方法
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <button
                onClick={() => setConsultationType('video')}
                style={{
                  padding: '16px',
                  backgroundColor: consultationType === 'video' ? '#a3e635' : '#374151',
                  color: consultationType === 'video' ? '#111827' : '#d1d5db',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>ビデオ通話</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>推奨</div>
              </button>
              <button
                onClick={() => setConsultationType('phone')}
                style={{
                  padding: '16px',
                  backgroundColor: consultationType === 'phone' ? '#a3e635' : '#374151',
                  color: consultationType === 'phone' ? '#111827' : '#d1d5db',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>電話</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>音声のみ</div>
              </button>
            </div>
          </div>
        )}

        {/* Date selection */}
        {selectedSpecialist && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
              日付選択
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    padding: '12px 8px',
                    backgroundColor: selectedDate === date ? '#a3e635' : '#374151',
                    color: selectedDate === date ? '#111827' : '#d1d5db',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time selection */}
        {selectedDate && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
              時間選択
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '12px',
                    backgroundColor: selectedTime === time ? '#a3e635' : '#374151',
                    color: selectedTime === time ? '#111827' : '#d1d5db',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Booking confirmation */}
        {selectedSpecialist && selectedDate && selectedTime && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '12px', 
              padding: '20px',
              border: '1px solid #374151'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
                予約内容の確認
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '32px' }}>
                  {specialists.find(s => s.id === selectedSpecialist)?.image}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#f3f4f6' }}>
                    {specialists.find(s => s.id === selectedSpecialist)?.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                    {specialists.find(s => s.id === selectedSpecialist)?.title}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>日時</span>
                  <span style={{ color: '#f3f4f6', fontWeight: '500' }}>{selectedDate} {selectedTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>方法</span>
                  <span style={{ color: '#f3f4f6', fontWeight: '500' }}>
                    {consultationType === 'video' ? 'ビデオ通話' : '電話'} (50分)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>料金</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#f3f4f6', fontWeight: '600', fontSize: '16px' }}>¥8,000</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>企業保険により一部負担軽減適用</div>
                  </div>
                </div>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#a3e635',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#84cc16'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#a3e635'
                }}
              >
                予約を確定する
              </button>

              <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.5' }}>
                ※ キャンセルは24時間前まで無料です<br/>
                ※ 相談内容は厳重に秘匿管理されます
              </div>
            </div>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}