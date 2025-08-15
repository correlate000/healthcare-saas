'use client'

import React, { useEffect, useState } from 'react'
import { streakWarnings } from '@/types/character-emotion'
import { getTypographyStyles } from '@/styles/typography'

interface StreakWarningBannerProps {
  lastCheckin: Date | null
  onCheckinClick: () => void
}

export function StreakWarningBanner({ lastCheckin, onCheckinClick }: StreakWarningBannerProps) {
  const [warning, setWarning] = useState<typeof streakWarnings[0] | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (!lastCheckin) return

    const checkStreakStatus = () => {
      const now = new Date()
      const timeSinceCheckin = now.getTime() - lastCheckin.getTime()
      const hoursSinceCheckin = timeSinceCheckin / (1000 * 60 * 60)
      
      // 24時間の期限まで残り時間を計算
      const hoursRemaining = 24 - hoursSinceCheckin
      
      if (hoursRemaining <= 0) {
        setWarning(null)
        return
      }

      // 適切な警告レベルを見つける
      const activeWarning = streakWarnings.find(w => hoursRemaining <= w.hoursRemaining)
      setWarning(activeWarning || null)

      // 残り時間の表示を更新
      if (hoursRemaining < 1) {
        const minutesRemaining = Math.floor(hoursRemaining * 60)
        setTimeRemaining(`${minutesRemaining}分`)
      } else {
        const hours = Math.floor(hoursRemaining)
        const minutes = Math.floor((hoursRemaining - hours) * 60)
        if (minutes > 0) {
          setTimeRemaining(`${hours}時間${minutes}分`)
        } else {
          setTimeRemaining(`${hours}時間`)
        }
      }
    }

    checkStreakStatus()
    const interval = setInterval(checkStreakStatus, 60000) // 1分ごとに更新

    return () => clearInterval(interval)
  }, [lastCheckin])

  if (!warning) return null

  const getBackgroundColor = () => {
    switch (warning.level) {
      case 'critical': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      case 'danger': return 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
      case 'warning': return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
      default: return 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
    }
  }

  const getBorderColor = () => {
    switch (warning.level) {
      case 'critical': return 'rgba(239, 68, 68, 0.5)'
      case 'danger': return 'rgba(249, 115, 22, 0.5)'
      case 'warning': return 'rgba(251, 191, 36, 0.5)'
      default: return 'rgba(96, 165, 250, 0.5)'
    }
  }

  return (
    <div 
      onClick={onCheckinClick}
      style={{
        background: getBackgroundColor(),
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '10px',
        padding: '10px 12px',
        marginBottom: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        animation: warning.level === 'critical' ? 'pulse 1s ease-in-out infinite' : 
                   warning.level === 'danger' ? 'pulse 2s ease-in-out infinite' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
        animation: 'shimmer 3s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <span style={{ 
            fontSize: '20px',
            animation: warning.level === 'critical' ? 'shake 0.5s ease-in-out infinite' : 'none',
            flexShrink: 0
          }}>
            {warning.icon}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              ...getTypographyStyles('small'),
              color: 'white',
              fontWeight: '600',
              marginBottom: '1px',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {warning.message}
            </div>
            <div style={{
              ...getTypographyStyles('caption'),
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '11px'
            }}>
              残り: {timeRemaining}
            </div>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          padding: '4px 8px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          flexShrink: 0
        }}>
          <span style={{
            ...getTypographyStyles('caption'),
            color: 'white',
            fontWeight: '600',
            fontSize: '11px',
            whiteSpace: 'nowrap'
          }}>
            CHECK IN
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  )
}