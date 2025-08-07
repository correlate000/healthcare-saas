'use client'

import { useState } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

// チェックインフォーム

export default function CheckIn() {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})

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
      title: '今日何をしましたか（複数選択可）',
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
  }

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
    // チェックイン完了の処理
    setCurrentStep(-1) // 完了画面を表示
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  if (currentStep === -1) {
    // 完了画面
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#111827', 
        color: 'white',
        paddingBottom: '80px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ padding: '16px' }}>
          {/* キャラクター */}
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: '#a3e635', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>キャラクター</span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f3f4f6', margin: '0 0 12px 0' }}>
              今日もお疲れ様でした
            </h1>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#a3e635', margin: '0 0 20px 0' }}>
              記録完了 - 15日連続ログイン達成！
            </h2>
          </div>

          <button
            style={{
              width: '100%',
              backgroundColor: '#1f2937',
              color: '#d1d5db',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            今週の記録を見る
          </button>

          <div style={{ 
            backgroundColor: '#1f2937', 
            borderRadius: '12px', 
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#374151', 
                borderRadius: '50%' 
              }}></div>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>XX :キャラクター名からのコメント</span>
            </div>
            
            <div style={{ 
              backgroundColor: '#374151', 
              borderRadius: '8px', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0, lineHeight: '1.5' }}>
                XXさん、今日も一日お疲れ様でした。継続して記録していることが素晴らしいですね。明日も良い一日になりますように。
              </p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '12px 0 0 0', lineHeight: '1.5' }}>
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>
                xxxxxx
              </p>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '16px',
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <input
              type="text"
              placeholder="メッセージを入力..."
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#d1d5db',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#a3e635',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <span style={{ color: '#111827', fontSize: '18px' }}>➤</span>
            </button>
          </div>
        </div>

        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ padding: '16px' }}>
        {/* キャラクター */}
        <div style={{ 
          width: '120px', 
          height: '120px', 
          backgroundColor: '#a3e635', 
          borderRadius: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <span style={{ color: '#111827', fontSize: '16px', fontWeight: '600' }}>キャラクター</span>
        </div>

        {/* プログレスバー */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>ステップ {currentStep + 1} / {steps.length}</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#374151', 
            borderRadius: '4px',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute',
              height: '100%', 
              width: `${progress}%`, 
              backgroundColor: '#a3e635', 
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>

        {/* 質問 */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#f3f4f6', margin: '0 0 8px 0' }}>
            {currentStepData.title}
          </h1>
          {currentStepData.id === 'activities' && (
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>複数選択可能です</p>
          )}
        </div>

        {/* 回答オプション */}
        {currentStepData.type === 'textarea' ? (
          <div style={{ marginBottom: '30px' }}>
            <textarea
              placeholder={currentStepData.placeholder}
              value={responses[currentStepData.id] || ''}
              onChange={(e) => handleResponse(e.target.value)}
              style={{
                width: '100%',
                minHeight: '120px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '16px',
                color: '#d1d5db',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: (currentStepData.options?.length || 0) <= 3 ? '16px' : '12px',
            marginBottom: '30px' 
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
                    padding: '16px',
                    backgroundColor: isSelected ? '#a3e635' : '#1f2937',
                    color: isSelected ? '#111827' : '#d1d5db',
                    border: isSelected ? '2px solid #a3e635' : '1px solid #374151',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {option}
                </button>
              )
            })}
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: '#374151',
                color: '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              戻る
            </button>
          )}
          
          {currentStep === 0 && (
            <button
              style={{
                padding: '16px 24px',
                backgroundColor: '#374151',
                color: '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              あとで
            </button>
          )}

          <button
            onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
            disabled={!responses[currentStepData.id]}
            style={{
              flex: currentStep === 0 ? 2 : 1,
              padding: '16px',
              backgroundColor: responses[currentStepData.id] ? '#a3e635' : '#374151',
              color: responses[currentStepData.id] ? '#111827' : '#9ca3af',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: responses[currentStepData.id] ? 'pointer' : 'not-allowed'
            }}
          >
            {currentStep === steps.length - 1 ? '完了' : '次へ'}
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}