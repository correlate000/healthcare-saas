'use client'

import React from 'react'

type CharacterId = 'luna' | 'aria' | 'zen'
type CharacterMood = 'happy' | 'normal' | 'worried' | 'sad' | 'angry' | 'disappointed' | 'sleeping'

interface CharacterAvatarProps {
  characterId: CharacterId
  mood?: CharacterMood
  size?: number
  animate?: boolean
}

export function CharacterAvatar({ 
  characterId, 
  mood = 'normal', 
  size = 100,
  animate = true 
}: CharacterAvatarProps) {
  
  // キャラクターごとの色設定
  const characterColors = {
    luna: {
      primary: '#a3e635',
      secondary: '#ecfccb',
      accent: '#65a30d'
    },
    aria: {
      primary: '#60a5fa',
      secondary: '#dbeafe',
      accent: '#3b82f6'
    },
    zen: {
      primary: '#f59e0b',
      secondary: '#fed7aa',
      accent: '#d97706'
    }
  }
  
  const colors = characterColors[characterId]
  
  // 感情に応じた目の表現
  const getEyes = () => {
    const eyeY = size * 0.45
    const eyeSize = size * 0.06
    const pupilSize = size * 0.04
    
    switch (mood) {
      case 'happy':
        // 笑い目（弧を描く）
        return (
          <>
            <path 
              d={`M ${size * 0.35} ${eyeY} Q ${size * 0.4} ${eyeY + size * 0.05} ${size * 0.45} ${eyeY}`}
              stroke="#111827" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d={`M ${size * 0.55} ${eyeY} Q ${size * 0.6} ${eyeY + size * 0.05} ${size * 0.65} ${eyeY}`}
              stroke="#111827" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
            />
          </>
        )
      case 'sleeping':
        // 閉じた目（横線）
        return (
          <>
            <line 
              x1={size * 0.35} y1={eyeY} 
              x2={size * 0.45} y2={eyeY}
              stroke="#111827" 
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line 
              x1={size * 0.55} y1={eyeY} 
              x2={size * 0.65} y2={eyeY}
              stroke="#111827" 
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Zzz... */}
            <text x={size * 0.7} y={size * 0.3} fontSize={size * 0.1} fill="#9ca3af">Z</text>
            <text x={size * 0.75} y={size * 0.25} fontSize={size * 0.08} fill="#9ca3af">z</text>
            <text x={size * 0.78} y={size * 0.22} fontSize={size * 0.06} fill="#9ca3af">z</text>
          </>
        )
      case 'sad':
      case 'worried':
        // 困った目（下がり眉）
        return (
          <>
            <circle cx={size * 0.4} cy={eyeY} r={eyeSize} fill="white" />
            <circle cx={size * 0.42} cy={eyeY + 2} r={pupilSize} fill="#111827" />
            <circle cx={size * 0.43} cy={eyeY + 1} r={pupilSize * 0.5} fill="white" />
            
            <circle cx={size * 0.6} cy={eyeY} r={eyeSize} fill="white" />
            <circle cx={size * 0.58} cy={eyeY + 2} r={pupilSize} fill="#111827" />
            <circle cx={size * 0.59} cy={eyeY + 1} r={pupilSize * 0.5} fill="white" />
            
            {/* 下がり眉 */}
            <path 
              d={`M ${size * 0.35} ${eyeY - size * 0.08} L ${size * 0.45} ${eyeY - size * 0.05}`}
              stroke="#111827" 
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path 
              d={`M ${size * 0.65} ${eyeY - size * 0.08} L ${size * 0.55} ${eyeY - size * 0.05}`}
              stroke="#111827" 
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        )
      case 'angry':
        // 怒った目（吊り眉）
        return (
          <>
            <circle cx={size * 0.4} cy={eyeY} r={eyeSize} fill="white" />
            <circle cx={size * 0.4} cy={eyeY} r={pupilSize} fill="#111827" />
            
            <circle cx={size * 0.6} cy={eyeY} r={eyeSize} fill="white" />
            <circle cx={size * 0.6} cy={eyeY} r={pupilSize} fill="#111827" />
            
            {/* 吊り眉 */}
            <path 
              d={`M ${size * 0.35} ${eyeY - size * 0.05} L ${size * 0.45} ${eyeY - size * 0.08}`}
              stroke="#111827" 
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path 
              d={`M ${size * 0.65} ${eyeY - size * 0.05} L ${size * 0.55} ${eyeY - size * 0.08}`}
              stroke="#111827" 
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        )
      default:
        // 通常の目
        return (
          <>
            <circle cx={size * 0.4} cy={eyeY} r={eyeSize} fill="white" />
            <circle cx={size * 0.42} cy={eyeY} r={pupilSize} fill="#111827" />
            <circle cx={size * 0.43} cy={eyeY - 1} r={pupilSize * 0.5} fill="white" />
            
            <circle cx={size * 0.6} cy={eyeY} r={eyeSize} fill="white" />
            <circle cx={size * 0.58} cy={eyeY} r={pupilSize} fill="#111827" />
            <circle cx={size * 0.59} cy={eyeY - 1} r={pupilSize * 0.5} fill="white" />
          </>
        )
    }
  }
  
  // 感情に応じた口の表現
  const getMouth = () => {
    const mouthY = size * 0.6
    
    switch (mood) {
      case 'happy':
        // 笑顔
        return (
          <path 
            d={`M ${size * 0.35} ${mouthY} Q ${size * 0.5} ${mouthY + size * 0.08} ${size * 0.65} ${mouthY}`}
            stroke="#111827" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
        )
      case 'sad':
      case 'disappointed':
        // 悲しい口
        return (
          <path 
            d={`M ${size * 0.35} ${mouthY + size * 0.05} Q ${size * 0.5} ${mouthY} ${size * 0.65} ${mouthY + size * 0.05}`}
            stroke="#111827" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
        )
      case 'angry':
        // 怒った口（波線）
        return (
          <path 
            d={`M ${size * 0.35} ${mouthY} L ${size * 0.4} ${mouthY - size * 0.02} L ${size * 0.45} ${mouthY + size * 0.02} L ${size * 0.5} ${mouthY - size * 0.02} L ${size * 0.55} ${mouthY + size * 0.02} L ${size * 0.6} ${mouthY - size * 0.02} L ${size * 0.65} ${mouthY}`}
            stroke="#111827" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      case 'worried':
        // 心配そうな口（波線）
        return (
          <path 
            d={`M ${size * 0.4} ${mouthY} Q ${size * 0.45} ${mouthY - size * 0.02} ${size * 0.5} ${mouthY} Q ${size * 0.55} ${mouthY + size * 0.02} ${size * 0.6} ${mouthY}`}
            stroke="#111827" 
            strokeWidth="1.5" 
            fill="none"
            strokeLinecap="round"
          />
        )
      case 'sleeping':
        // 寝ている口（小さい丸）
        return (
          <circle 
            cx={size * 0.5} 
            cy={mouthY} 
            r={size * 0.02} 
            fill="#111827"
          />
        )
      default:
        // 通常の口
        return (
          <path 
            d={`M ${size * 0.4} ${mouthY} L ${size * 0.6} ${mouthY}`}
            stroke="#111827" 
            strokeWidth="1.5" 
            fill="none"
            strokeLinecap="round"
          />
        )
    }
  }
  
  // キャラクターごとの装飾
  const getDecoration = () => {
    switch (characterId) {
      case 'luna':
        // 月の装飾
        return (
          <path 
            d={`M ${size * 0.15} ${size * 0.2} Q ${size * 0.1} ${size * 0.25} ${size * 0.15} ${size * 0.3} Q ${size * 0.18} ${size * 0.25} ${size * 0.15} ${size * 0.2}`}
            fill={colors.accent}
            opacity="0.6"
          />
        )
      case 'aria':
        // 星の装飾
        return (
          <>
            <path 
              d={`M ${size * 0.85} ${size * 0.2} L ${size * 0.87} ${size * 0.24} L ${size * 0.91} ${size * 0.24} L ${size * 0.88} ${size * 0.27} L ${size * 0.89} ${size * 0.31} L ${size * 0.85} ${size * 0.28} L ${size * 0.81} ${size * 0.31} L ${size * 0.82} ${size * 0.27} L ${size * 0.79} ${size * 0.24} L ${size * 0.83} ${size * 0.24} Z`}
              fill={colors.accent}
              opacity="0.6"
            />
            <circle cx={size * 0.15} cy={size * 0.75} r={size * 0.015} fill={colors.accent} opacity="0.4" />
            <circle cx={size * 0.8} cy={size * 0.8} r={size * 0.01} fill={colors.accent} opacity="0.4" />
          </>
        )
      case 'zen':
        // 瞑想の輪
        return (
          <circle 
            cx={size * 0.5} 
            cy={size * 0.5} 
            r={size * 0.48} 
            fill="none"
            stroke={colors.accent}
            strokeWidth="1"
            opacity="0.2"
            strokeDasharray="4 4"
          />
        )
      default:
        return null
    }
  }
  
  // アニメーションの設定
  const getAnimation = () => {
    if (!animate) return ''
    
    switch (mood) {
      case 'happy': return 'bounce'
      case 'worried': return 'shake'
      case 'sad': return 'droop'
      case 'angry': return 'tremble'
      case 'disappointed': return 'sway'
      case 'sleeping': return 'breathe'
      default: return 'idle'
    }
  }
  
  return (
    <div style={{
      width: size,
      height: size,
      animation: animate ? `${getAnimation()} 2s ease-in-out infinite` : 'none'
    }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block' }}
      >
        {/* 装飾 */}
        {getDecoration()}
        
        {/* 体 */}
        <ellipse 
          cx={size * 0.5} 
          cy={size * 0.55} 
          rx={size * 0.35} 
          ry={size * 0.38} 
          fill={colors.primary} 
        />
        
        {/* お腹 */}
        <ellipse 
          cx={size * 0.5} 
          cy={size * 0.6} 
          rx={size * 0.25} 
          ry={size * 0.28} 
          fill={colors.secondary} 
        />
        
        {/* 左翼 */}
        <ellipse 
          cx={size * 0.25} 
          cy={size * 0.5} 
          rx={size * 0.15} 
          ry={size * 0.25} 
          fill={colors.primary} 
          transform={`rotate(-20 ${size * 0.25} ${size * 0.5})`}
        />
        
        {/* 右翼 */}
        <ellipse 
          cx={size * 0.75} 
          cy={size * 0.5} 
          rx={size * 0.15} 
          ry={size * 0.25} 
          fill={colors.primary} 
          transform={`rotate(20 ${size * 0.75} ${size * 0.5})`}
        />
        
        {/* 目 */}
        {getEyes()}
        
        {/* くちばし */}
        <path 
          d={`M ${size * 0.5} ${size * 0.52} L ${size * 0.45} ${size * 0.55} L ${size * 0.55} ${size * 0.55} Z`}
          fill="#fbbf24" 
        />
        
        {/* 口 */}
        {getMouth()}
        
        {/* 頬の赤み（感情による） */}
        {mood === 'happy' && (
          <>
            <circle 
              cx={size * 0.3} 
              cy={size * 0.52} 
              r={size * 0.04} 
              fill="#fca5a5" 
              opacity="0.4"
            />
            <circle 
              cx={size * 0.7} 
              cy={size * 0.52} 
              r={size * 0.04} 
              fill="#fca5a5" 
              opacity="0.4"
            />
          </>
        )}
        
        {/* 汗（心配や困った時） */}
        {mood === 'worried' && (
          <ellipse 
            cx={size * 0.75} 
            cy={size * 0.35} 
            rx={size * 0.015} 
            ry={size * 0.025} 
            fill="#60a5fa" 
            opacity="0.7"
          />
        )}
        
        {/* 涙（悲しい時） */}
        {mood === 'sad' && (
          <>
            <ellipse 
              cx={size * 0.38} 
              cy={size * 0.5} 
              rx={size * 0.01} 
              ry={size * 0.02} 
              fill="#60a5fa" 
              opacity="0.8"
            />
            <ellipse 
              cx={size * 0.62} 
              cy={size * 0.5} 
              rx={size * 0.01} 
              ry={size * 0.02} 
              fill="#60a5fa" 
              opacity="0.8"
            />
          </>
        )}
      </svg>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        @keyframes droop {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(5px) scale(0.95); }
        }
        
        @keyframes tremble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-1deg); }
          75% { transform: rotate(1deg); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        
        @keyframes idle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
      `}</style>
    </div>
  )
}