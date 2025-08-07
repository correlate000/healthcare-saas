'use client'

import { useState } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')

  const weeklyData = [
    { day: '月', mood: 75, energy: 80, stress: 40, sleep: 85 },
    { day: '火', mood: 80, energy: 75, stress: 35, sleep: 80 },
    { day: '水', mood: 85, energy: 90, stress: 30, sleep: 90 },
    { day: '木', mood: 90, energy: 85, stress: 25, sleep: 85 },
    { day: '金', mood: 78, energy: 70, stress: 50, sleep: 75 },
    { day: '土', mood: 82, energy: 85, stress: 20, sleep: 95 },
    { day: '日', mood: 88, energy: 90, stress: 15, sleep: 90 }
  ]

  const periods = [
    { key: 'week', label: '1週間' },
    { key: 'month', label: '1ヶ月' },
    { key: 'year', label: '1年' }
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #374151' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
          分析・統計
        </h1>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Period selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              style={{
                flex: 1,
                padding: '12px 16px',
                backgroundColor: selectedPeriod === period.key ? '#a3e635' : '#374151',
                color: selectedPeriod === period.key ? '#111827' : '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Summary stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px', 
          marginBottom: '24px' 
        }}>
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '16px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635', marginBottom: '4px' }}>
              15
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>連続記録日数</div>
          </div>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '16px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635', marginBottom: '4px' }}>
              82%
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>平均気分スコア</div>
          </div>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '16px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635', marginBottom: '4px' }}>
              7
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>総セッション数</div>
          </div>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '16px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635', marginBottom: '4px' }}>
              21h
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>総利用時間</div>
          </div>
        </div>

        {/* Weekly trend section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            週間トレンド
          </h3>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
              気分スコア
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {weeklyData.map((day) => (
                <div
                  key={day.day}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#d1d5db', width: '20px', fontWeight: '500' }}>
                    {day.day}
                  </span>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    backgroundColor: '#374151',
                    borderRadius: '4px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      height: '100%',
                      width: `${day.mood}%`,
                      backgroundColor: '#a3e635',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '14px', color: '#d1d5db', width: '36px', textAlign: 'right', fontWeight: '500' }}>
                    {day.mood}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly reflection */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            今週の振り返り
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '12px', 
              padding: '16px' 
            }}>
              <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>
                今週は安定した気持ちで過ごせていますね。特に木曜日の満足度が高く、週末に向けて良い流れができています。
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '12px', 
              padding: '16px' 
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#f3f4f6', marginBottom: '8px', margin: '0 0 8px 0' }}>
                気分の向上
              </h4>
              <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>
                先週と比べて平均気分スコアが12%向上しています
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '12px', 
              padding: '16px' 
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#f3f4f6', marginBottom: '8px', margin: '0 0 8px 0' }}>
                継続力アップ
              </h4>
              <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>
                7日連続でセッションを完了！素晴らしい継続力です！
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '12px', 
              padding: '16px' 
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#f3f4f6', marginBottom: '8px', margin: '0 0 8px 0' }}>
                週間目標達成
              </h4>
              <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>
                今週の目標時間180分を20分オーバーで達成！
              </p>
            </div>
          </div>
        </div>

        {/* Character insights */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            AIからのインサイト
          </h3>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '20px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#a3e635', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#111827', fontSize: '12px', fontWeight: '600' }}>AI</span>
              </div>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>Lunaからのアドバイス</span>
            </div>
            
            <div style={{ 
              backgroundColor: '#374151', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>
                あなたの記録を見ていると、規則正しい生活リズムが気分の安定に繋がっているようですね。特に睡眠時間と気分スコアに良い相関が見られます。この調子で続けていけば、さらに良い結果が期待できそうです。
              </p>
            </div>
          </div>
        </div>

        {/* Monthly progress comparison */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            月間比較
          </h3>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '20px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#a3e635' }}>78%</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>今月平均</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#6b7280' }}>72%</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>前月平均</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#a3e635' }}>+6%</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>改善度</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}