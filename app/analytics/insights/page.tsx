'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function InsightsPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'personal' | 'ai' | 'recommendations'>('personal')

  const personalInsights = [
    {
      id: 1,
      title: '睡眠と気分の相関',
      type: 'positive',
      icon: '😴',
      description: '良質な睡眠を取った日は、気分スコアが平均25%高くなっています',
      recommendation: '22:00までに就寝準備を始めることをおすすめします',
      data: { sleep: 85, mood: 78 }
    },
    {
      id: 2,
      title: '週末のストレスレベル',
      type: 'warning',
      icon: '📈',
      description: '日曜日の夕方にストレスレベルが上昇する傾向があります',
      recommendation: '日曜日の午後にリラックス時間を設けてみましょう',
      data: { weekday: 45, weekend: 62 }
    },
    {
      id: 3,
      title: '運動習慣の効果',
      type: 'positive',
      icon: '🏃',
      description: '運動した日は翌日のエネルギーレベルが15%向上しています',
      recommendation: '週3回、20分以上の軽い運動を継続しましょう',
      data: { withExercise: 82, without: 67 }
    },
    {
      id: 4,
      title: '社交活動の影響',
      type: 'positive',
      icon: '👥',
      description: '友人と交流した週は幸福度が20%高い傾向があります',
      recommendation: '週に1回は友人との時間を作ってみてください',
      data: { social: 85, alone: 65 }
    }
  ]

  const aiInsights = [
    {
      id: 1,
      character: 'Luna',
      avatar: '🌙',
      message: 'あなたの記録を分析したところ、朝の時間帯に瞑想を行うと、その日の集中力が格段に向上することがわかりました。明日の朝、5分だけでも試してみませんか？',
      confidence: 92
    },
    {
      id: 2,
      character: 'Aria',
      avatar: '⭐',
      message: '最近の頑張りは素晴らしいです！特に継続日数が伸びていることは、あなたの意志の強さを示しています。この調子で一緒に頑張りましょう！',
      confidence: 88
    },
    {
      id: 3,
      character: 'Zen',
      avatar: '🧘',
      message: '内なる声に耳を傾けることで、本当の自分と向き合えます。毎日の記録から、あなたは既に答えを持っていることがわかります。',
      confidence: 85
    }
  ]

  const recommendations = [
    {
      id: 1,
      priority: 'high',
      title: '睡眠習慣の改善',
      actions: [
        '就寝1時間前のスマートフォン使用を控える',
        '寝室の温度を18-20度に保つ',
        'カフェインは14時以降摂取しない'
      ],
      expectedImpact: 30
    },
    {
      id: 2,
      priority: 'medium',
      title: 'ストレス管理テクニック',
      actions: [
        '毎日10分の深呼吸エクササイズ',
        'ストレス日記をつける',
        '週1回のデジタルデトックス'
      ],
      expectedImpact: 25
    },
    {
      id: 3,
      priority: 'low',
      title: '社会的つながりの強化',
      actions: [
        '月2回の友人との食事',
        'オンラインコミュニティへの参加',
        '家族との定期的な連絡'
      ],
      expectedImpact: 20
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      paddingBottom: '140px',
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
            インサイト
          </h1>
        </div>
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          marginLeft: '44px'
        }}>
          あなたのパターンと改善ポイント
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        padding: '16px',
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid #374151'
      }}>
        {[
          { key: 'personal', label: 'パーソナル' },
          { key: 'ai', label: 'AIアドバイス' },
          { key: 'recommendations', label: '推奨アクション' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: selectedTab === tab.key ? '#a3e635' : '#374151',
              color: selectedTab === tab.key ? '#111827' : '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {/* Personal Insights */}
        {selectedTab === 'personal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {personalInsights.map(insight => (
              <div
                key={insight.id}
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '12px',
                  padding: '20px',
                  borderLeft: `4px solid ${insight.type === 'positive' ? '#a3e635' : '#fbbf24'}`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>{insight.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '8px'
                    }}>
                      {insight.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#d1d5db',
                      lineHeight: '1.5',
                      marginBottom: '12px'
                    }}>
                      {insight.description}
                    </p>
                    
                    <div style={{
                      backgroundColor: '#111827',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        textAlign: 'center'
                      }}>
                        {Object.entries(insight.data).map(([key, value]) => (
                          <div key={key}>
                            <div style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              color: '#a3e635',
                              marginBottom: '4px'
                            }}>
                              {value}%
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#9ca3af',
                              textTransform: 'capitalize'
                            }}>
                              {key === 'sleep' ? '睡眠' :
                               key === 'mood' ? '気分' :
                               key === 'weekday' ? '平日' :
                               key === 'weekend' ? '週末' :
                               key === 'withExercise' ? '運動あり' :
                               key === 'without' ? '運動なし' :
                               key === 'social' ? '交流あり' :
                               key === 'alone' ? '交流なし' : key}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: insight.type === 'positive' ? 'rgba(163,230,53,0.1)' : 'rgba(251,191,36,0.1)',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '14px' }}>💡</span>
                      <p style={{
                        fontSize: '13px',
                        color: insight.type === 'positive' ? '#a3e635' : '#fbbf24',
                        margin: 0
                      }}>
                        {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Insights */}
        {selectedTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {aiInsights.map(insight => (
              <div
                key={insight.id}
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#374151',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    {insight.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#f3f4f6'
                      }}>
                        {insight.character}からのアドバイス
                      </h3>
                      <span style={{
                        fontSize: '12px',
                        backgroundColor: '#374151',
                        color: '#a3e635',
                        padding: '4px 8px',
                        borderRadius: '12px'
                      }}>
                        確信度 {insight.confidence}%
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#d1d5db',
                      lineHeight: '1.6'
                    }}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => router.push('/chat')}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#374151',
                color: '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
            >
              <span>💬</span>
              AIと詳しく話す
            </button>
          </div>
        )}

        {/* Recommendations */}
        {selectedTab === 'recommendations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendations.map(rec => (
              <div
                key={rec.id}
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '12px',
                  padding: '20px',
                  borderTop: `3px solid ${
                    rec.priority === 'high' ? '#ef4444' :
                    rec.priority === 'medium' ? '#fbbf24' : '#60a5fa'
                  }`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#f3f4f6'
                  }}>
                    {rec.title}
                  </h3>
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: rec.priority === 'high' ? '#ef4444' :
                                   rec.priority === 'medium' ? '#fbbf24' : '#60a5fa',
                    color: rec.priority === 'high' ? 'white' : '#111827',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    {rec.priority === 'high' ? '優先度高' :
                     rec.priority === 'medium' ? '優先度中' : '優先度低'}
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#9ca3af',
                    marginBottom: '12px'
                  }}>
                    推奨アクション:
                  </p>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '20px'
                  }}>
                    {rec.actions.map((action, index) => (
                      <li
                        key={index}
                        style={{
                          fontSize: '14px',
                          color: '#d1d5db',
                          marginBottom: '6px',
                          lineHeight: '1.4'
                        }}
                      >
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  backgroundColor: '#111827',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    fontSize: '13px',
                    color: '#9ca3af'
                  }}>
                    期待される改善度
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '100px',
                      height: '6px',
                      backgroundColor: '#374151',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${rec.expectedImpact}%`,
                        backgroundColor: '#a3e635',
                        borderRadius: '3px'
                      }}></div>
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#a3e635'
                    }}>
                      {rec.expectedImpact}%
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => router.push('/daily-challenge')}
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
              今日のチャレンジを始める
            </button>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}