'use client'

import React, { useState, useEffect } from 'react'
import { getTypographyStyles } from '@/styles/typography'
import { HapticsManager } from '@/utils/haptics'

export type CharacterId = 'luna' | 'aria' | 'zen'

interface Character {
  id: CharacterId
  name: string
  nameJa: string
  emoji: string
  primaryColor: string
  secondaryColor: string
  personality: string
  voiceStyle: string
  specialSkill: string
  unlockLevel: number
}

const characters: Character[] = [
  {
    id: 'luna',
    name: 'Luna',
    nameJa: 'るな',
    emoji: '🌙',
    primaryColor: '#a3e635',
    secondaryColor: '#ecfccb',
    personality: '優しくて思いやりがある',
    voiceStyle: 'ふんわりとした癒し系',
    specialSkill: '共感力が高く、気持ちに寄り添う',
    unlockLevel: 1
  },
  {
    id: 'aria',
    name: 'Aria',
    nameJa: 'あーりあ',
    emoji: '✨',
    primaryColor: '#60a5fa',
    secondaryColor: '#dbeafe',
    personality: '元気で前向き',
    voiceStyle: 'はつらつとした応援系',
    specialSkill: 'モチベーションを高める応援',
    unlockLevel: 5
  },
  {
    id: 'zen',
    name: 'Zen',
    nameJa: 'ぜん',
    emoji: '🧘',
    primaryColor: '#f59e0b',
    secondaryColor: '#fed7aa',
    personality: '落ち着いていて賢い',
    voiceStyle: '穏やかな導き系',
    specialSkill: 'マインドフルネスと瞑想指導',
    unlockLevel: 10
  }
]

interface CharacterSelectorProps {
  currentCharacterId: CharacterId
  userLevel: number
  onCharacterChange: (characterId: CharacterId) => void
  compact?: boolean
}

export function CharacterSelector({ 
  currentCharacterId, 
  userLevel, 
  onCharacterChange,
  compact = false 
}: CharacterSelectorProps) {
  const [selectedId, setSelectedId] = useState<CharacterId>(currentCharacterId)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleCharacterSelect = (character: Character) => {
    if (character.unlockLevel > userLevel) {
      HapticsManager.error()
      return
    }
    
    if (character.id === selectedId) return
    
    HapticsManager.medium()
    setIsAnimating(true)
    setSelectedId(character.id)
    
    // ローカルストレージに保存
    localStorage.setItem('selectedCharacter', character.id)
    
    setTimeout(() => {
      onCharacterChange(character.id)
      setIsAnimating(false)
    }, 300)
  }

  if (compact) {
    // コンパクト表示（横スクロール）
    return (
      <div style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        padding: '4px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {characters.map((character) => {
          const isSelected = character.id === selectedId
          const isLocked = character.unlockLevel > userLevel
          
          return (
            <div
              key={character.id}
              onClick={() => handleCharacterSelect(character)}
              style={{
                flexShrink: 0,
                width: '70px',
                padding: '10px 6px',
                backgroundColor: isSelected ? character.primaryColor : '#374151',
                borderRadius: '10px',
                border: isSelected ? `2px solid ${character.primaryColor}` : '2px solid transparent',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.5 : 1,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '2px' }}>
                {character.emoji}
              </div>
              <div style={{
                ...getTypographyStyles('caption'),
                color: isSelected ? '#111827' : '#d1d5db',
                fontWeight: '600',
                fontSize: '11px'
              }}>
                {character.nameJa}
              </div>
              {isLocked && (
                <div style={{
                  ...getTypographyStyles('caption'),
                  color: '#ef4444',
                  marginTop: '2px'
                }}>
                  Lv.{character.unlockLevel}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // フル表示
  return (
    <div style={{
      backgroundColor: '#1f2937',
      borderRadius: '16px',
      padding: '20px'
    }}>
      <h3 style={{
        ...getTypographyStyles('h4'),
        color: '#f3f4f6',
        marginBottom: '20px',
        fontWeight: '700'
      }}>
        キャラクター選択
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {characters.map((character) => {
          const isSelected = character.id === selectedId
          const isLocked = character.unlockLevel > userLevel
          
          return (
            <div
              key={character.id}
              onClick={() => handleCharacterSelect(character)}
              style={{
                position: 'relative',
                padding: '20px',
                backgroundColor: isSelected ? `${character.primaryColor}20` : '#374151',
                borderRadius: '16px',
                border: isSelected ? `2px solid ${character.primaryColor}` : '2px solid #4b5563',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.6 : 1,
                transition: 'all 0.3s ease',
                transform: isAnimating && isSelected ? 'scale(1.02)' : 'scale(1)',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isLocked && !isSelected) {
                  e.currentTarget.style.backgroundColor = '#4b5563'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  HapticsManager.light()
                }
              }}
              onMouseLeave={(e) => {
                if (!isLocked && !isSelected) {
                  e.currentTarget.style.backgroundColor = '#374151'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              {/* 選択中インジケーター */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: character.primaryColor,
                  color: '#111827',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  ...getTypographyStyles('caption'),
                  fontWeight: '700'
                }}>
                  選択中
                </div>
              )}

              {/* ロック表示 */}
              {isLocked && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '16px'
                }}>
                  <div style={{
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
                    <div style={{
                      ...getTypographyStyles('base'),
                      color: '#f3f4f6',
                      fontWeight: '600'
                    }}>
                      Lv.{character.unlockLevel}で解放
                    </div>
                  </div>
                </div>
              )}

              {/* キャラクター表示 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: character.primaryColor,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  boxShadow: `0 4px 12px ${character.primaryColor}40`
                }}>
                  {character.emoji}
                </div>
                <div>
                  <div style={{
                    ...getTypographyStyles('h4'),
                    color: isSelected ? character.primaryColor : '#f3f4f6',
                    fontWeight: '700'
                  }}>
                    {character.nameJa}
                  </div>
                  <div style={{
                    ...getTypographyStyles('small'),
                    color: '#9ca3af'
                  }}>
                    {character.name}
                  </div>
                </div>
              </div>

              {/* キャラクター詳細 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div>
                  <div style={{
                    ...getTypographyStyles('caption'),
                    color: '#6b7280',
                    marginBottom: '2px'
                  }}>
                    性格
                  </div>
                  <div style={{
                    ...getTypographyStyles('small'),
                    color: '#d1d5db'
                  }}>
                    {character.personality}
                  </div>
                </div>
                
                <div>
                  <div style={{
                    ...getTypographyStyles('caption'),
                    color: '#6b7280',
                    marginBottom: '2px'
                  }}>
                    話し方
                  </div>
                  <div style={{
                    ...getTypographyStyles('small'),
                    color: '#d1d5db'
                  }}>
                    {character.voiceStyle}
                  </div>
                </div>
                
                <div>
                  <div style={{
                    ...getTypographyStyles('caption'),
                    color: '#6b7280',
                    marginBottom: '2px'
                  }}>
                    得意分野
                  </div>
                  <div style={{
                    ...getTypographyStyles('small'),
                    color: '#d1d5db'
                  }}>
                    {character.specialSkill}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// キャラクター情報を取得するヘルパー関数
export function getCharacterInfo(characterId: CharacterId): Character | undefined {
  return characters.find(c => c.id === characterId)
}