'use client'

import { useState, useEffect } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function VoiceChatPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const moods = [
    { emoji: '😊', label: '良い', color: '#a3e635' },
    { emoji: '😐', label: '普通', color: '#60a5fa' },
    { emoji: '😔', label: '憂鬱', color: '#fbbf24' },
    { emoji: '😰', label: '不安', color: '#fb923c' },
    { emoji: '😤', label: 'イライラ', color: '#ef4444' }
  ]

  const topics = [
    '仕事', '人間関係', '健康', '家族', 
    '将来', '金銭', '恋愛', '自己成長'
  ]

  const quickPrompts = [
    '今日の出来事を話してください',
    '何か心配事はありますか？',
    '最近嬉しかったことは？',
    '今の気分を詳しく教えてください'
  ]

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    setShowAnalysis(false)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setTimeout(() => setShowAnalysis(true), 1000)
  }

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic))
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topic])
    }
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
          fontSize: '24px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          ボイスチャット
        </h1>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px', margin: '8px 0 0 0' }}>
          音声で今の気持ちを記録しましょう
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {!isRecording && !showAnalysis && (
          <>
            {/* Mood Selection */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(55, 65, 81, 0.3)'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '16px'
              }}>
                今の気分は？
              </h3>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                {moods.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedMood(mood.label)}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      background: selectedMood === mood.label
                        ? `linear-gradient(135deg, ${mood.color}40 0%, rgba(31, 41, 55, 0.8) 100%)`
                        : 'rgba(55, 65, 81, 0.4)',
                      border: selectedMood === mood.label
                        ? `2px solid ${mood.color}80`
                        : '1px solid rgba(55, 65, 81, 0.3)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{mood.emoji}</span>
                    <span style={{
                      fontSize: '11px',
                      color: selectedMood === mood.label ? mood.color : '#9ca3af',
                      fontWeight: '500'
                    }}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(55, 65, 81, 0.3)'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '12px'
              }}>
                話したいトピック（最大3つ）
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px'
              }}>
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    style={{
                      padding: '10px',
                      backgroundColor: selectedTopics.includes(topic)
                        ? 'rgba(163, 230, 53, 0.2)'
                        : 'rgba(55, 65, 81, 0.4)',
                      color: selectedTopics.includes(topic) ? '#a3e635' : '#9ca3af',
                      border: selectedTopics.includes(topic)
                        ? '1px solid rgba(163, 230, 53, 0.3)'
                        : '1px solid transparent',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Prompts */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid rgba(55, 65, 81, 0.3)'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '12px'
              }}>
                話すきっかけ
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {quickPrompts.map((prompt) => (
                  <div
                    key={prompt}
                    style={{
                      padding: '12px',
                      backgroundColor: 'rgba(55, 65, 81, 0.3)',
                      borderRadius: '10px',
                      fontSize: '13px',
                      color: '#d1d5db',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ color: '#60a5fa' }}>💭</span>
                    {prompt}
                  </div>
                ))}
              </div>
            </div>

            {/* Start Recording Button */}
            <button
              onClick={handleStartRecording}
              style={{
                width: '100%',
                padding: '20px',
                background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                color: '#111827',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(163, 230, 53, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(163, 230, 53, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(163, 230, 53, 0.3)'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="3" width="6" height="11" rx="3" stroke="#111827" strokeWidth="2"/>
                <path d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 19V22" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 22H16" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              録音を開始
            </button>
          </>
        )}

        {/* Recording Screen */}
        {isRecording && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
          }}>
            {/* Recording Animation */}
            <div style={{
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              position: 'relative',
              animation: isPaused ? 'none' : 'pulse 2s ease-in-out infinite'
            }}>
              <div style={{
                position: 'absolute',
                width: '240px',
                height: '240px',
                border: '2px solid rgba(163, 230, 53, 0.3)',
                borderRadius: '50%',
                animation: isPaused ? 'none' : 'ripple 2s ease-out infinite'
              }}></div>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="3" width="6" height="11" rx="3" fill="#111827"/>
                <path d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Timer */}
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#f3f4f6',
              marginBottom: '16px',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {formatTime(recordingTime)}
            </div>

            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '40px'
            }}>
              {isPaused ? '一時停止中...' : '録音中...'}
            </p>

            {/* Control Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px'
            }}>
              <button
                onClick={handlePauseResume}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'rgba(96, 165, 250, 0.2)',
                  color: '#60a5fa',
                  border: '2px solid rgba(96, 165, 250, 0.3)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                {isPaused ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="5 3 19 12 5 21 5 3" fill="#60a5fa"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="#60a5fa"/>
                    <rect x="14" y="4" width="4" height="16" fill="#60a5fa"/>
                  </svg>
                )}
              </button>

              <button
                onClick={handleStopRecording}
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="12" height="12" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {showAnalysis && (
          <div>
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
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#f3f4f6',
                    marginBottom: '4px'
                  }}>
                    記録完了！
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#9ca3af'
                  }}>
                    録音時間: {formatTime(recordingTime)}
                  </p>
                </div>
              </div>

              {/* AI Analysis */}
              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(31, 41, 55, 0.4)',
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#60a5fa',
                  marginBottom: '8px'
                }}>
                  AI分析結果
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#d1d5db',
                  lineHeight: '1.6'
                }}>
                  お話の内容から、仕事に関するストレスを感じていることが分かりました。
                  深呼吸をして、今日は早めに休息を取ることをおすすめします。
                </p>
              </div>

              {/* Detected Emotions */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '16px'
              }}>
                {['ストレス: 65%', '疲労: 45%', '希望: 30%'].map((emotion) => (
                  <div
                    key={emotion}
                    style={{
                      padding: '8px',
                      backgroundColor: 'rgba(55, 65, 81, 0.4)',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}
                  >
                    {emotion}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                borderRadius: '10px',
                borderLeft: '3px solid #60a5fa'
              }}>
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#60a5fa',
                  marginBottom: '6px'
                }}>
                  おすすめのアクション
                </h4>
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: '12px',
                  color: '#d1d5db',
                  lineHeight: '1.8'
                }}>
                  <li>5分間の瞑想セッション</li>
                  <li>軽い運動やストレッチ</li>
                  <li>専門家との相談を検討</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowAnalysis(false)
                  setSelectedMood(null)
                  setSelectedTopics([])
                  setRecordingTime(0)
                }}
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(163, 230, 53, 0.2)',
                  color: '#a3e635',
                  border: '1px solid rgba(163, 230, 53, 0.3)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                新しい録音
              </button>
              <button
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(55, 65, 81, 0.6)',
                  color: '#d1d5db',
                  border: '1px solid rgba(55, 65, 81, 0.5)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                履歴を見る
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        
        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}