'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { 
  TrendingUp, TrendingDown, Activity, Heart, Brain, 
  Moon, Sun, Coffee, Users, Target, AlertCircle,
  ChevronRight, Calendar, Clock, BarChart3
} from 'lucide-react'

export default function InsightsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'health' | 'mood' | 'activity'>('all')

  // 総合スコアデータ
  const overallScore = {
    current: 78,
    previous: 72,
    trend: 'up',
    change: 8.3
  }

  // カテゴリ別スコア
  const categoryScores = [
    { category: '身体的健康', score: 82, trend: 'up', change: 5 },
    { category: 'メンタルヘルス', score: 75, trend: 'up', change: 12 },
    { category: '睡眠の質', score: 68, trend: 'down', change: -3 },
    { category: '活動レベル', score: 85, trend: 'up', change: 8 }
  ]

  // 重要なインサイト
  const keyInsights = [
    {
      id: 1,
      type: 'positive',
      icon: <Moon className="h-5 w-5" />,
      title: '睡眠パターンの改善',
      description: '22:00前の就寝により、睡眠の質が15%向上',
      impact: 'high',
      metrics: { before: 65, after: 75 }
    },
    {
      id: 2,
      type: 'warning',
      icon: <Coffee className="h-5 w-5" />,
      title: 'カフェイン摂取のタイミング',
      description: '午後のカフェイン摂取が睡眠に影響',
      impact: 'medium',
      metrics: { quality: -12 }
    },
    {
      id: 3,
      type: 'positive',
      icon: <Users className="h-5 w-5" />,
      title: '社交活動の効果',
      description: '週2回以上の交流で幸福度が20%上昇',
      impact: 'high',
      metrics: { happiness: 20 }
    },
    {
      id: 4,
      type: 'neutral',
      icon: <Activity className="h-5 w-5" />,
      title: '運動習慣の定着',
      description: '週3回の運動が習慣化されています',
      impact: 'medium',
      metrics: { consistency: 85 }
    }
  ]

  // 時間帯別パフォーマンス
  const timePerformance = [
    { time: '朝', energy: 65, focus: 70, mood: 75 },
    { time: '昼', energy: 80, focus: 85, mood: 82 },
    { time: '夕', energy: 70, focus: 65, mood: 78 },
    { time: '夜', energy: 45, focus: 40, mood: 68 }
  ]

  // 相関分析
  const correlations = [
    { factor1: '睡眠時間', factor2: '翌日の生産性', correlation: 0.82, strength: 'strong' },
    { factor1: '運動', factor2: 'ストレスレベル', correlation: -0.65, strength: 'moderate' },
    { factor1: '社交活動', factor2: '幸福度', correlation: 0.78, strength: 'strong' },
    { factor1: 'スクリーン時間', factor2: '睡眠の質', correlation: -0.71, strength: 'moderate' }
  ]

  // 改善提案
  const improvements = [
    {
      priority: 'high',
      area: '睡眠習慣',
      current: '平均6.5時間',
      target: '7-8時間',
      actions: ['就寝1時間前のデジタルデトックス', '寝室の温度を18-20度に調整', '規則的な就寝時間の設定']
    },
    {
      priority: 'medium',
      area: 'ストレス管理',
      current: 'レベル6/10',
      target: 'レベル4/10以下',
      actions: ['毎日10分の瞑想', '深呼吸エクササイズ', '週1回のデジタルデトックス']
    },
    {
      priority: 'low',
      area: '水分補給',
      current: '1.5L/日',
      target: '2L/日',
      actions: ['起床時にコップ1杯の水', '食事前の水分補給', '運動前後の補給']
    }
  ]

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
              ...getTypographyStyles('h3'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <h1 style={{
            ...typographyPresets.pageTitle(),
            margin: 0
          }}>
            分析インサイト
          </h1>
        </div>
        <p style={{
          ...getTypographyStyles('base'),
          color: '#9ca3af',
          marginLeft: '44px'
        }}>
          データから見つかったパターンと改善機会
        </p>
      </div>

      {/* Period Selector */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid rgba(55, 65, 81, 0.3)'
      }}>
        {(['week', 'month', 'year'] as const).map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: selectedPeriod === period 
                ? 'rgba(163, 230, 53, 0.2)' 
                : 'rgba(55, 65, 81, 0.4)',
              color: selectedPeriod === period ? '#a3e635' : '#9ca3af',
              border: selectedPeriod === period 
                ? '1px solid rgba(163, 230, 53, 0.3)' 
                : '1px solid transparent',
              borderRadius: '8px',
              ...getTypographyStyles('button'),
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {period === 'week' ? '週間' : period === 'month' ? '月間' : '年間'}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
        {/* Overall Score Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(163, 230, 53, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div>
              <h2 style={{
                ...getTypographyStyles('large'),
                color: '#9ca3af',
                marginBottom: '8px'
              }}>
                総合ウェルビーイングスコア
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px'
              }}>
                <span style={{
                  fontSize: '48px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {overallScore.current}
                </span>
                <span style={{
                  ...getTypographyStyles('large'),
                  color: '#6b7280'
                }}>
                  / 100
                </span>
              </div>
            </div>
            <div style={{
              textAlign: 'right'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                justifyContent: 'flex-end',
                marginBottom: '8px',
                color: overallScore.trend === 'up' ? '#a3e635' : '#ef4444'
              }}>
                {overallScore.trend === 'up' ? 
                  <TrendingUp className="h-5 w-5" /> : 
                  <TrendingDown className="h-5 w-5" />
                }
                <span style={{
                  ...getTypographyStyles('large'),
                  fontWeight: '600'
                }}>
                  {overallScore.change}%
                </span>
              </div>
              <span style={{
                ...getTypographyStyles('small'),
                color: '#6b7280'
              }}>
                前週比
              </span>
            </div>
          </div>

          {/* Score Progress Bar */}
          <div style={{
            height: '8px',
            backgroundColor: 'rgba(55, 65, 81, 0.6)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <div style={{
              height: '100%',
              width: `${overallScore.current}%`,
              background: 'linear-gradient(90deg, #a3e635 0%, #84cc16 100%)',
              borderRadius: '4px',
              transition: 'width 0.5s ease',
              boxShadow: '0 0 10px rgba(163, 230, 53, 0.4)'
            }}></div>
          </div>

          {/* Category Scores */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {categoryScores.map((cat, index) => (
              <div key={index} style={{
                backgroundColor: 'rgba(31, 41, 55, 0.6)',
                borderRadius: '12px',
                padding: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    ...getTypographyStyles('small'),
                    color: '#9ca3af'
                  }}>
                    {cat.category}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    color: cat.trend === 'up' ? '#a3e635' : '#ef4444'
                  }}>
                    {cat.trend === 'up' ? 
                      <TrendingUp className="h-3 w-3" /> : 
                      <TrendingDown className="h-3 w-3" />
                    }
                    <span style={{
                      ...getTypographyStyles('caption'),
                      fontWeight: '600'
                    }}>
                      {Math.abs(cat.change)}%
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    ...getTypographyStyles('h3'),
                    fontWeight: '700',
                    color: '#f3f4f6'
                  }}>
                    {cat.score}
                  </span>
                  <div style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: 'rgba(55, 65, 81, 0.8)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${cat.score}%`,
                      backgroundColor: cat.score >= 80 ? '#a3e635' : 
                                      cat.score >= 60 ? '#fbbf24' : '#ef4444',
                      borderRadius: '2px'
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            ...typographyPresets.sectionHeader(),
            marginBottom: '16px'
          }}>
            重要な発見
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {keyInsights.map(insight => (
              <div
                key={insight.id}
                style={{
                  backgroundColor: 'rgba(31, 41, 55, 0.6)',
                  borderRadius: '12px',
                  padding: '16px',
                  borderLeft: `3px solid ${
                    insight.type === 'positive' ? '#a3e635' :
                    insight.type === 'warning' ? '#fbbf24' : '#60a5fa'
                  }`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: insight.type === 'positive' ? 'rgba(163, 230, 53, 0.2)' :
                                     insight.type === 'warning' ? 'rgba(251, 191, 36, 0.2)' :
                                     'rgba(96, 165, 250, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: insight.type === 'positive' ? '#a3e635' :
                           insight.type === 'warning' ? '#fbbf24' : '#60a5fa',
                    flexShrink: 0
                  }}>
                    {insight.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      ...getTypographyStyles('base'),
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '4px'
                    }}>
                      {insight.title}
                    </h3>
                    <p style={{
                      ...getTypographyStyles('small'),
                      color: '#9ca3af',
                      marginBottom: '8px'
                    }}>
                      {insight.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {Object.entries(insight.metrics).map(([key, value]) => (
                        <span
                          key={key}
                          style={{
                            ...getTypographyStyles('caption'),
                            backgroundColor: 'rgba(55, 65, 81, 0.6)',
                            color: typeof value === 'number' && value > 0 ? '#a3e635' : 
                                   typeof value === 'number' && value < 0 ? '#ef4444' : '#9ca3af',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {typeof value === 'number' && value > 0 && '+'}
                          {value}
                          {typeof value === 'number' && '%'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Trend Graph */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            ...typographyPresets.sectionHeader(),
            marginBottom: '16px'
          }}>
            気分トレンド
          </h2>
          <div style={{
            backgroundColor: 'rgba(31, 41, 55, 0.6)',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative'
          }}>
            {/* グラフエリア */}
            <div style={{
              position: 'relative',
              height: '200px',
              marginBottom: '20px'
            }}>
              {/* Y軸の目盛り線 */}
              {[100, 75, 50, 25, 0].map((value) => (
                <div key={value} style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: `${value}%`,
                  borderBottom: '1px dashed rgba(55, 65, 81, 0.5)',
                  height: '1px'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '-30px',
                    bottom: '-8px',
                    ...getTypographyStyles('caption'),
                    color: '#6b7280'
                  }}>
                    {value}
                  </span>
                </div>
              ))}
              
              {/* 7日間の気分データ */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                height: '100%',
                paddingLeft: '10px',
                paddingRight: '10px',
                gap: '8px'
              }}>
                {[
                  { day: '月', date: '12/2', mood: 65, emoji: '😐', color: '#60a5fa' },
                  { day: '火', date: '12/3', mood: 72, emoji: '🙂', color: '#60a5fa' },
                  { day: '水', date: '12/4', mood: 68, emoji: '😐', color: '#60a5fa' },
                  { day: '木', date: '12/5', mood: 78, emoji: '😊', color: '#84cc16' },
                  { day: '金', date: '12/6', mood: 82, emoji: '😄', color: '#a3e635' },
                  { day: '土', date: '12/7', mood: 88, emoji: '😄', color: '#a3e635' },
                  { day: '日', date: '12/8', mood: 75, emoji: '🙂', color: '#60a5fa', isToday: true }
                ].map((data, index, array) => (
                  <div key={index} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    position: 'relative'
                  }}>
                    {/* 折れ線グラフの線 */}
                    {index > 0 && (
                      <svg style={{
                        position: 'absolute',
                        left: '-50%',
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        overflow: 'visible'
                      }}>
                        <line
                          x1="0"
                          y1={`${100 - array[index - 1].mood}%`}
                          x2="100%"
                          y2={`${100 - data.mood}%`}
                          stroke="rgba(163, 230, 53, 0.5)"
                          strokeWidth="2"
                          strokeDasharray={data.isToday ? "5,5" : "0"}
                        />
                      </svg>
                    )}
                    
                    {/* バーグラフ */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      maxWidth: '30px',
                      height: `${data.mood}%`,
                      background: `linear-gradient(180deg, ${data.color} 0%, ${data.color}88 100%)`,
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.3s ease',
                      opacity: data.isToday ? 0.8 : 1,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scaleY(1.05)'
                      e.currentTarget.style.opacity = '1'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scaleY(1)'
                      e.currentTarget.style.opacity = data.isToday ? '0.8' : '1'
                    }}>
                      {/* 数値表示 */}
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        ...getTypographyStyles('caption'),
                        color: data.color,
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {data.mood}%
                      </div>
                    </div>
                    
                    {/* ポイントマーカー */}
                    <div style={{
                      position: 'absolute',
                      bottom: `${data.mood}%`,
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#a3e635',
                      borderRadius: '50%',
                      border: '2px solid #111827',
                      transform: 'translate(-50%, 50%)',
                      left: '50%',
                      zIndex: 2
                    }}></div>
                    
                    {/* 絵文字 */}
                    <div style={{
                      position: 'absolute',
                      bottom: `${data.mood + 8}%`,
                      fontSize: '20px',
                      filter: data.isToday ? 'none' : 'grayscale(0.2)'
                    }}>
                      {data.emoji}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* X軸ラベル */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingLeft: '10px',
              paddingRight: '10px',
              marginBottom: '16px'
            }}>
              {[
                { day: '月', date: '12/2' },
                { day: '火', date: '12/3' },
                { day: '水', date: '12/4' },
                { day: '木', date: '12/5' },
                { day: '金', date: '12/6' },
                { day: '土', date: '12/7' },
                { day: '日', date: '12/8', isToday: true }
              ].map((data, index) => (
                <div key={index} style={{
                  flex: 1,
                  textAlign: 'center'
                }}>
                  <div style={{
                    ...getTypographyStyles('small'),
                    color: data.isToday ? '#a3e635' : '#f3f4f6',
                    fontWeight: data.isToday ? '600' : '500',
                    marginBottom: '2px'
                  }}>
                    {data.day}
                  </div>
                  <div style={{
                    ...getTypographyStyles('caption'),
                    color: '#6b7280'
                  }}>
                    {data.date}
                  </div>
                  {data.isToday && (
                    <div style={{
                      ...getTypographyStyles('caption'),
                      color: '#a3e635',
                      fontWeight: '500',
                      marginTop: '2px'
                    }}>
                      今日
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* 統計情報 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'rgba(31, 41, 55, 0.4)',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...getTypographyStyles('h4'),
                  color: '#a3e635',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  75%
                </div>
                <div style={{
                  ...getTypographyStyles('caption'),
                  color: '#9ca3af'
                }}>
                  週間平均
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...getTypographyStyles('h4'),
                  color: '#60a5fa',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  88%
                </div>
                <div style={{
                  ...getTypographyStyles('caption'),
                  color: '#9ca3af'
                }}>
                  最高値
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...getTypographyStyles('h4'),
                  color: '#a3e635',
                  fontWeight: '700',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '12px' }}>↑</span>
                  8%
                </div>
                <div style={{
                  ...getTypographyStyles('caption'),
                  color: '#9ca3af'
                }}>
                  先週比
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Performance */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            ...typographyPresets.sectionHeader(),
            marginBottom: '16px'
          }}>
            時間帯別パフォーマンス
          </h2>
          <div style={{
            backgroundColor: 'rgba(31, 41, 55, 0.6)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            {timePerformance.map((time, index) => (
              <div key={index} style={{
                marginBottom: index < timePerformance.length - 1 ? '16px' : 0
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    ...getTypographyStyles('label'),
                    color: '#f3f4f6',
                    fontWeight: '600'
                  }}>
                    {time.time}
                  </span>
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <span style={{
                      ...getTypographyStyles('caption'),
                      color: '#9ca3af'
                    }}>
                      E: {time.energy}
                    </span>
                    <span style={{
                      ...getTypographyStyles('caption'),
                      color: '#9ca3af'
                    }}>
                      F: {time.focus}
                    </span>
                    <span style={{
                      ...getTypographyStyles('caption'),
                      color: '#9ca3af'
                    }}>
                      M: {time.mood}
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  height: '6px'
                }}>
                  <div style={{
                    flex: time.energy,
                    backgroundColor: '#60a5fa',
                    borderRadius: '3px'
                  }}></div>
                  <div style={{
                    flex: time.focus,
                    backgroundColor: '#a3e635',
                    borderRadius: '3px'
                  }}></div>
                  <div style={{
                    flex: time.mood,
                    backgroundColor: '#fbbf24',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            ))}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(55, 65, 81, 0.5)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#60a5fa',
                  borderRadius: '2px'
                }}></div>
                <span style={{
                  ...getTypographyStyles('caption'),
                  color: '#9ca3af'
                }}>
                  エネルギー
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#a3e635',
                  borderRadius: '2px'
                }}></div>
                <span style={{
                  ...getTypographyStyles('caption'),
                  color: '#9ca3af'
                }}>
                  集中力
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#fbbf24',
                  borderRadius: '2px'
                }}></div>
                <span style={{
                  ...getTypographyStyles('caption'),
                  color: '#9ca3af'
                }}>
                  気分
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Correlations */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            ...typographyPresets.sectionHeader(),
            marginBottom: '16px'
          }}>
            相関分析
          </h2>
          <div style={{
            backgroundColor: 'rgba(31, 41, 55, 0.6)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            {correlations.map((corr, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: index < correlations.length - 1 ? '12px' : 0
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      ...getTypographyStyles('small'),
                      color: '#f3f4f6'
                    }}>
                      {corr.factor1} × {corr.factor2}
                    </span>
                    <span style={{
                      ...getTypographyStyles('caption'),
                      color: Math.abs(corr.correlation) > 0.7 ? '#a3e635' : '#fbbf24',
                      fontWeight: '600'
                    }}>
                      {corr.correlation > 0 ? '+' : ''}{(corr.correlation * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{
                    height: '4px',
                    backgroundColor: 'rgba(55, 65, 81, 0.8)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.abs(corr.correlation) * 100}%`,
                      backgroundColor: corr.correlation > 0 ? '#a3e635' : '#ef4444',
                      borderRadius: '2px'
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            ...typographyPresets.sectionHeader(),
            marginBottom: '16px'
          }}>
            改善提案
          </h2>
          {improvements.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'rgba(31, 41, 55, 0.6)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                borderTop: `2px solid ${
                  item.priority === 'high' ? '#ef4444' :
                  item.priority === 'medium' ? '#fbbf24' : '#60a5fa'
                }`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div>
                  <h3 style={{
                    ...getTypographyStyles('base'),
                    fontWeight: '600',
                    color: '#f3f4f6',
                    marginBottom: '4px'
                  }}>
                    {item.area}
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    ...getTypographyStyles('small'),
                    color: '#9ca3af'
                  }}>
                    <span>現在: {item.current}</span>
                    <span>→</span>
                    <span style={{ color: '#a3e635' }}>目標: {item.target}</span>
                  </div>
                </div>
                <span style={{
                  ...getTypographyStyles('caption'),
                  backgroundColor: item.priority === 'high' ? '#ef4444' :
                                 item.priority === 'medium' ? '#fbbf24' : '#60a5fa',
                  color: item.priority === 'high' ? 'white' : '#111827',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}>
                  {item.priority === 'high' ? '優先' :
                   item.priority === 'medium' ? '推奨' : '任意'}
                </span>
              </div>
              <div>
                <p style={{
                  ...getTypographyStyles('small'),
                  color: '#9ca3af',
                  marginBottom: '8px'
                }}>
                  アクションアイテム:
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {item.actions.map((action, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <ChevronRight className="h-3 w-3" style={{ color: '#6b7280' }} />
                      <span style={{
                        ...getTypographyStyles('small'),
                        color: '#d1d5db'
                      }}>
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={() => router.push('/daily-challenge')}
            style={{
              flex: 1,
              padding: '16px',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#111827',
              border: 'none',
              borderRadius: '12px',
              ...getTypographyStyles('button'),
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            改善を始める
          </button>
          <button
            onClick={() => router.push('/export')}
            style={{
              padding: '16px',
              backgroundColor: 'rgba(55, 65, 81, 0.6)',
              color: '#9ca3af',
              border: '1px solid rgba(55, 65, 81, 0.5)',
              borderRadius: '12px',
              ...getTypographyStyles('button'),
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            PDF出力
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}