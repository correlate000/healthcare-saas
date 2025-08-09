'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function TrendsPage() {
  const router = useRouter()
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'energy' | 'stress' | 'sleep'>('mood')
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  const trendData = {
    mood: {
      current: 78,
      previous: 72,
      change: 8.3,
      trend: 'up',
      data: [65, 68, 70, 72, 75, 78, 78],
      prediction: 82,
      factors: ['睡眠改善', '運動習慣', '瞑想']
    },
    energy: {
      current: 82,
      previous: 75,
      change: 9.3,
      trend: 'up',
      data: [70, 72, 75, 78, 80, 82, 82],
      prediction: 85,
      factors: ['朝活', '栄養バランス', '休息']
    },
    stress: {
      current: 35,
      previous: 48,
      change: -27.1,
      trend: 'down',
      data: [55, 52, 48, 45, 40, 38, 35],
      prediction: 30,
      factors: ['深呼吸', 'タスク管理', '休憩']
    },
    sleep: {
      current: 85,
      previous: 78,
      change: 9.0,
      trend: 'up',
      data: [72, 75, 78, 80, 82, 85, 85],
      prediction: 88,
      factors: ['就寝時間固定', 'スクリーン制限', '室温調整']
    }
  }

  const currentData = trendData[selectedMetric]

  const getMetricLabel = (metric: string) => {
    switch(metric) {
      case 'mood': return '気分'
      case 'energy': return 'エネルギー'
      case 'stress': return 'ストレス'
      case 'sleep': return '睡眠'
      default: return metric
    }
  }

  const getPeriodLabel = (period: string) => {
    switch(period) {
      case 'week': return '1週間'
      case 'month': return '1ヶ月'
      case 'quarter': return '3ヶ月'
      case 'year': return '1年'
      default: return period
    }
  }

  // Simple chart component
  const MiniChart = ({ data, color }: { data: number[], color: string }) => {
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue || 1

    return (
      <div style={{
        width: '100%',
        height: '120px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        padding: '10px 0'
      }}>
        {data.map((value, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${((value - minValue) / range) * 100}%`,
              minHeight: '4px',
              backgroundColor: color,
              borderRadius: '4px 4px 0 0',
              opacity: 0.6 + (index / data.length) * 0.4,
              transition: 'all 0.3s ease'
            }}
          />
        ))}
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
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <button
            onClick={() => router.push('/analytics')}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#f3f4f6',
            margin: 0
          }}>
            トレンド分析
          </h1>
        </div>
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          marginLeft: '44px'
        }}>
          長期的な傾向と予測
        </p>
      </div>

      {/* Period selector */}
      <div style={{
        padding: '16px',
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #374151'
      }}>
        {(['week', 'month', 'quarter', 'year'] as const).map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: selectedPeriod === period ? '#a3e635' : '#374151',
              color: selectedPeriod === period ? '#111827' : '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {getPeriodLabel(period)}
          </button>
        ))}
      </div>

      {/* Metrics selector */}
      <div style={{
        padding: '16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px'
      }}>
        {(['mood', 'energy', 'stress', 'sleep'] as const).map(metric => {
          const data = trendData[metric]
          const isSelected = selectedMetric === metric
          
          return (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              style={{
                backgroundColor: isSelected ? '#1f2937' : '#1f2937',
                border: isSelected ? '2px solid #a3e635' : '2px solid transparent',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#4b5563'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'transparent'
                }
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}>
                  {getMetricLabel(metric)}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: data.trend === 'up' ? '#a3e635' : '#ef4444',
                  fontWeight: '600'
                }}>
                  {data.trend === 'up' ? '↑' : '↓'} {Math.abs(data.change)}%
                </span>
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: isSelected ? '#a3e635' : '#f3f4f6'
              }}>
                {data.current}%
              </div>
            </button>
          )
        })}
      </div>

      {/* Main content */}
      <div style={{ padding: '16px' }}>
        {/* Current trend card */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '16px'
          }}>
            {getMetricLabel(selectedMetric)}の推移
          </h3>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#a3e635',
                marginBottom: '4px'
              }}>
                {currentData.current}%
              </div>
              <div style={{
                fontSize: '14px',
                color: currentData.trend === 'up' ? '#a3e635' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>{currentData.trend === 'up' ? '↑' : '↓'}</span>
                <span>{Math.abs(currentData.change)}%</span>
                <span style={{ color: '#9ca3af' }}>前期比</span>
              </div>
            </div>

            <div style={{
              textAlign: 'right'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#9ca3af',
                marginBottom: '4px'
              }}>
                予測値
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#60a5fa'
              }}>
                {currentData.prediction}%
              </div>
            </div>
          </div>

          <MiniChart 
            data={currentData.data} 
            color={selectedMetric === 'stress' ? '#ef4444' : '#a3e635'}
          />
        </div>

        {/* Contributing factors */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '16px'
          }}>
            改善要因
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {currentData.factors.map((factor, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#111827',
                  borderRadius: '8px'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#a3e635',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {index + 1}
                </div>
                <span style={{
                  fontSize: '14px',
                  color: '#f3f4f6',
                  fontWeight: '500'
                }}>
                  {factor}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison with others */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '16px'
          }}>
            他のユーザーとの比較
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div style={{
              backgroundColor: '#111827',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#a3e635',
                marginBottom: '4px'
              }}>
                上位 15%
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                同年代の中で
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#111827',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#60a5fa',
                marginBottom: '4px'
              }}>
                +12%
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                平均より高い
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={() => router.push('/analytics/insights')}
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
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635' }}
        >
          詳細なインサイトを見る
        </button>
      </div>

      <MobileBottomNav />
    </div>
  )
}