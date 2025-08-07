'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function AnalyticsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')

  // Different data for different periods
  const dataByPeriod = {
    week: {
      streak: 15,
      avgMood: 82,
      sessions: 7,
      totalTime: '21h',
      data: [
        { day: '月', mood: 75, energy: 80, stress: 40, sleep: 85 },
        { day: '火', mood: 80, energy: 75, stress: 35, sleep: 80 },
        { day: '水', mood: 85, energy: 90, stress: 30, sleep: 90 },
        { day: '木', mood: 90, energy: 85, stress: 25, sleep: 85 },
        { day: '金', mood: 78, energy: 70, stress: 50, sleep: 75 },
        { day: '土', mood: 82, energy: 85, stress: 20, sleep: 95 },
        { day: '日', mood: 88, energy: 90, stress: 15, sleep: 90 }
      ],
      insights: [
        { title: '気分の向上', content: '先週と比べて平均気分スコアが12%向上しています' },
        { title: '継続力アップ', content: '7日連続でセッションを完了！素晴らしい継続力です！' },
        { title: '週間目標達成', content: '今週の目標時間180分を20分オーバーで達成！' },
        { title: 'ストレス軽減', content: '先週より平均ストレスレベルが15%減少しました' }
      ]
    },
    month: {
      streak: 28,
      avgMood: 78,
      sessions: 28,
      totalTime: '84h',
      data: [
        { day: '第1週', mood: 72, energy: 75, stress: 45, sleep: 80 },
        { day: '第2週', mood: 75, energy: 78, stress: 40, sleep: 82 },
        { day: '第3週', mood: 82, energy: 85, stress: 30, sleep: 88 },
        { day: '第4週', mood: 83, energy: 82, stress: 28, sleep: 86 }
      ],
      insights: [
        { title: '月間達成', content: '28日間連続記録を達成！新記録です！' },
        { title: '成長トレンド', content: '月初から11%の気分スコア改善を記録' },
        { title: '睡眠改善', content: '平均睡眠の質が月初より8%向上しています' },
        { title: '活動量増加', content: '先月より身体活動時間が25%増加しました' }
      ]
    },
    year: {
      streak: 234,
      avgMood: 75,
      sessions: 312,
      totalTime: '936h',
      data: [
        { day: '1月', mood: 68, energy: 70, stress: 50, sleep: 75 },
        { day: '2月', mood: 70, energy: 72, stress: 48, sleep: 76 },
        { day: '3月', mood: 72, energy: 74, stress: 45, sleep: 78 },
        { day: '4月', mood: 74, energy: 76, stress: 42, sleep: 80 },
        { day: '5月', mood: 76, energy: 78, stress: 40, sleep: 82 },
        { day: '6月', mood: 78, energy: 80, stress: 38, sleep: 84 },
        { day: '7月', mood: 80, energy: 82, stress: 35, sleep: 85 },
        { day: '8月', mood: 82, energy: 84, stress: 32, sleep: 86 }
      ],
      insights: [
        { title: '年間成長', content: '年初から気分スコアが20%向上しました' },
        { title: 'マイルストーン', content: '300セッション達成！素晴らしい継続です' },
        { title: '健康改善', content: 'ストレスレベルが年初から36%減少' },
        { title: '習慣化成功', content: '85%の日でチェックインを完了しています' }
      ]
    }
  }

  const currentData = dataByPeriod[selectedPeriod]

  const periods = [
    { key: 'week', label: '1週間' },
    { key: 'month', label: '1ヶ月' },
    { key: 'year', label: '1年' }
  ]

  // Calculate comparison data
  const getComparison = () => {
    if (selectedPeriod === 'week') {
      return { current: 78, previous: 72, change: 6 }
    } else if (selectedPeriod === 'month') {
      return { current: 78, previous: 75, change: 3 }
    } else {
      return { current: 75, previous: 65, change: 10 }
    }
  }

  const comparison = getComparison()

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
            分析・統計
          </h1>
          <button
            onClick={() => router.push('/export')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#374151',
              color: '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
          >
            📊 エクスポート
          </button>
        </div>
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
              {currentData.streak}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              {selectedPeriod === 'week' ? '連続記録日数' : 
               selectedPeriod === 'month' ? '月間記録日数' : '年間記録日数'}
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '16px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635', marginBottom: '4px' }}>
              {currentData.avgMood}%
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
              {currentData.sessions}
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
              {currentData.totalTime}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>総利用時間</div>
          </div>
        </div>

        {/* Trend section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            {selectedPeriod === 'week' ? '週間トレンド' : 
             selectedPeriod === 'month' ? '月間トレンド' : '年間トレンド'}
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
              {currentData.data.map((day) => (
                <div
                  key={day.day}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#d1d5db', 
                    width: selectedPeriod === 'year' ? '30px' : '40px', 
                    fontWeight: '500' 
                  }}>
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

        {/* Insights */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            {selectedPeriod === 'week' ? '今週の振り返り' : 
             selectedPeriod === 'month' ? '今月の振り返り' : '今年の振り返り'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '12px', 
              padding: '16px' 
            }}>
              <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>
                {selectedPeriod === 'week' ? '今週は安定した気持ちで過ごせていますね。特に木曜日の満足度が高く、週末に向けて良い流れができています。' :
                 selectedPeriod === 'month' ? '今月は着実に成長しています。第3週から特に改善が見られ、素晴らしい進歩です。' :
                 '今年は大きな成長の年になっています。継続的な改善が見られ、健康的な習慣が身についています。'}
              </p>
            </div>
            
            {currentData.insights.map((insight, index) => (
              <div key={index} style={{ 
                backgroundColor: '#1f2937', 
                borderRadius: '12px', 
                padding: '16px' 
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#f3f4f6', marginBottom: '8px', margin: '0 0 8px 0' }}>
                  {insight.title}
                </h4>
                <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>
                  {insight.content}
                </p>
              </div>
            ))}
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
                {selectedPeriod === 'week' ? 
                  'あなたの記録を見ていると、規則正しい生活リズムが気分の安定に繋がっているようですね。特に睡眠時間と気分スコアに良い相関が見られます。この調子で続けていけば、さらに良い結果が期待できそうです。' :
                 selectedPeriod === 'month' ? 
                  '素晴らしい1ヶ月でした！特に第3週からの改善が顕著で、あなたの努力が実を結んでいます。ストレス管理も上手くいっているようで、とても良い傾向です。来月も この調子で頑張りましょう。' :
                  '今年のあなたの成長は本当に素晴らしいです。年初から比べると、まるで別人のような改善が見られます。特に継続力が際立っていて、それが全体的な健康改善につながっています。自信を持って続けてください。'}
              </p>
            </div>
          </div>
        </div>

        {/* Period comparison */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            {selectedPeriod === 'week' ? '週間比較' : 
             selectedPeriod === 'month' ? '月間比較' : '年間比較'}
          </h3>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => router.push('/analytics/trends')}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#a3e635' }}>{comparison.current}%</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {selectedPeriod === 'week' ? '今週平均' : 
                   selectedPeriod === 'month' ? '今月平均' : '今年平均'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#6b7280' }}>{comparison.previous}%</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {selectedPeriod === 'week' ? '前週平均' : 
                   selectedPeriod === 'month' ? '前月平均' : '前年平均'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#a3e635' }}>+{comparison.change}%</div>
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