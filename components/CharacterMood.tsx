'use client'

import React, { useEffect, useState } from 'react'
import { CharacterMood as MoodType, emotionRules, streakWarnings } from '@/types/character-emotion'
import { getTypographyStyles } from '@/styles/typography'

interface CharacterMoodProps {
  characterId: 'luna' | 'aria' | 'zen'
  lastCheckin: Date | null
  streakDays: number
  compact?: boolean
}

export function CharacterMood({ characterId, lastCheckin, streakDays, compact = false }: CharacterMoodProps) {
  const [currentMood, setCurrentMood] = useState<MoodType>('normal')
  const [message, setMessage] = useState<string>('')
  const [missedDays, setMissedDays] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  // キャラクターごとの設定
  const characterConfigs = {
    luna: {
      name: 'るな',
      primaryColor: '#a3e635',
      secondaryColor: '#ecfccb',
      emoji: '🌙'
    },
    aria: {
      name: 'あーりあ',
      primaryColor: '#60a5fa',
      secondaryColor: '#dbeafe',
      emoji: '✨'
    },
    zen: {
      name: 'ぜん',
      primaryColor: '#f59e0b',
      secondaryColor: '#fed7aa',
      emoji: '🧘'
    }
  }

  const config = characterConfigs[characterId]

  // 時間を更新（1分ごと）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // 感情状態を計算
  useEffect(() => {
    const now = currentTime
    const hour = now.getHours()
    
    // 深夜は寝ている
    if (hour >= 23 || hour < 5) {
      setCurrentMood('sleeping')
      const rule = emotionRules.find(r => r.mood === 'sleeping')
      if (rule) {
        const messages = rule.messages[characterId]
        setMessage(messages[Math.floor(Math.random() * messages.length)])
      }
      return
    }

    if (!lastCheckin) {
      setCurrentMood('normal')
      setMessage('初めまして！今日から一緒に頑張りましょう！')
      return
    }

    const timeSinceCheckin = now.getTime() - lastCheckin.getTime()
    const hoursSinceCheckin = timeSinceCheckin / (1000 * 60 * 60)
    const daysSinceCheckin = Math.floor(hoursSinceCheckin / (1000 * 60 * 60 * 24))
    
    setMissedDays(daysSinceCheckin)

    // ストリークが途切れた
    if (streakDays === 0 && daysSinceCheckin === 1) {
      setCurrentMood('disappointed')
      const rule = emotionRules.find(r => r.mood === 'disappointed')
      if (rule) {
        const messages = rule.messages[characterId]
        setMessage(messages[Math.floor(Math.random() * messages.length)])
      }
    }
    // 3日以上チェックインなし
    else if (daysSinceCheckin >= 3) {
      setCurrentMood('angry')
      const rule = emotionRules.find(r => r.mood === 'angry')
      if (rule) {
        const messages = rule.messages[characterId]
        setMessage(messages[Math.floor(Math.random() * messages.length)])
      }
    }
    // 2日連続スキップ
    else if (daysSinceCheckin === 2) {
      setCurrentMood('sad')
      const rule = emotionRules.find(r => r.mood === 'sad')
      if (rule) {
        const messages = rule.messages[characterId]
        setMessage(messages[Math.floor(Math.random() * messages.length)])
      }
    }
    // 24時間チェックインなし
    else if (hoursSinceCheckin >= 24) {
      setCurrentMood('worried')
      const rule = emotionRules.find(r => r.mood === 'worried')
      if (rule) {
        const messages = rule.messages[characterId]
        setMessage(messages[Math.floor(Math.random() * messages.length)])
      }
    }
    // ストリーク継続中
    else if (streakDays >= 3) {
      setCurrentMood('happy')
      const rule = emotionRules.find(r => r.mood === 'happy')
      if (rule) {
        const messages = rule.messages[characterId]
        setMessage(messages[Math.floor(Math.random() * messages.length)])
      }
    }
    // 通常状態
    else {
      setCurrentMood('normal')
      setMessage('今日もチェックイン待ってるよ！')
    }
  }, [lastCheckin, streakDays, characterId, currentTime])

  // 感情に応じた表情を取得
  const getExpression = () => {
    switch (currentMood) {
      case 'happy': return '😊'
      case 'worried': return '😟'
      case 'sad': return '😢'
      case 'angry': return '😠'
      case 'disappointed': return '😔'
      case 'sleeping': return '😴'
      default: return '😐'
    }
  }

  // アニメーションクラスを取得
  const getAnimation = () => {
    switch (currentMood) {
      case 'happy': return 'bounce'
      case 'worried': return 'shake'
      case 'sad': return 'droop'
      case 'angry': return 'tremble'
      case 'disappointed': return 'sway'
      case 'sleeping': return 'breathe'
      default: return 'idle'
    }
  }

  if (compact) {
    // コンパクト表示（ダッシュボード用）
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        backgroundColor: 'rgba(31, 41, 55, 0.6)',
        borderRadius: '10px',
        border: currentMood === 'angry' || currentMood === 'sad' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(55, 65, 81, 0.3)'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          backgroundColor: config.primaryColor,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          animation: `${getAnimation()} 2s ease-in-out infinite`,
          position: 'relative',
          flexShrink: 0
        }}>
          {getExpression()}
          {missedDays > 0 && (
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              {missedDays}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            ...getTypographyStyles('caption'),
            color: config.primaryColor,
            marginBottom: '1px',
            fontWeight: '600',
            fontSize: '12px'
          }}>
            {config.name}
          </div>
          <div style={{
            ...getTypographyStyles('caption'),
            color: '#d1d5db',
            fontSize: '11px',
            lineHeight: '1.3',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {message}
          </div>
        </div>
      </div>
    )
  }

  // フル表示
  return (
    <div style={{
      backgroundColor: 'rgba(31, 41, 55, 0.8)',
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center',
      border: currentMood === 'angry' || currentMood === 'sad' ? '2px solid rgba(239, 68, 68, 0.3)' : 'none'
    }}>
      <div style={{
        width: '100px',
        height: '100px',
        backgroundColor: config.primaryColor,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        fontSize: '48px',
        animation: `${getAnimation()} 2s ease-in-out infinite`,
        position: 'relative',
        boxShadow: `0 8px 24px ${config.primaryColor}33`
      }}>
        {getExpression()}
        {missedDays > 0 && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...getTypographyStyles('base'),
            fontWeight: 'bold'
          }}>
            {missedDays}
          </div>
        )}
      </div>
      
      <div style={{
        ...getTypographyStyles('h4'),
        color: config.primaryColor,
        marginBottom: '8px',
        fontWeight: '700'
      }}>
        {config.name}
      </div>
      
      <div style={{
        ...getTypographyStyles('base'),
        color: '#f3f4f6',
        marginBottom: '16px',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {message}
      </div>

      {streakDays > 0 && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          borderRadius: '20px',
          border: '1px solid rgba(251, 191, 36, 0.3)'
        }}>
          <span>🔥</span>
          <span style={{
            ...getTypographyStyles('small'),
            color: '#fbbf24',
            fontWeight: '600'
          }}>
            {streakDays}日連続
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes droop {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(5px) scale(0.95); }
        }
        
        @keyframes tremble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes idle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  )
}