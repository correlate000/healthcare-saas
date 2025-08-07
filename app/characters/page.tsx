'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function CharactersPage() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [unlockedCharacters, setUnlockedCharacters] = useState(['luna', 'aria'])

  // Bird character SVG component
  const BirdCharacter = ({ bodyColor, bellyColor, size = 60 }: { bodyColor: string, bellyColor: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <ellipse cx="50" cy="55" rx="35" ry="38" fill={bodyColor} />
      <ellipse cx="50" cy="60" rx="25" ry="28" fill={bellyColor} />
      <ellipse cx="25" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(-20 25 50)" />
      <ellipse cx="75" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(20 75 50)" />
      <circle cx="40" cy="45" r="6" fill="white" />
      <circle cx="42" cy="45" r="4" fill="#111827" />
      <circle cx="43" cy="44" r="2" fill="white" />
      <circle cx="60" cy="45" r="6" fill="white" />
      <circle cx="58" cy="45" r="4" fill="#111827" />
      <circle cx="59" cy="44" r="2" fill="white" />
      <path d="M50 52 L45 57 L55 57 Z" fill="#fbbf24" />
    </svg>
  )

  const characters = [
    {
      id: 'luna',
      name: 'Luna',
      bodyColor: '#a3e635',
      bellyColor: '#ecfccb',
      role: '睡眠の守護者',
      personality: '優しく穏やか',
      specialty: '睡眠改善・リラックス',
      level: 12,
      xp: 2450,
      nextLevelXp: 3000,
      description: '静かな夜に寄り添い、安らかな眠りへと導きます',
      stats: {
        empathy: 95,
        wisdom: 88,
        energy: 65,
        humor: 70
      },
      skills: [
        { name: '深呼吸ガイド', level: 'MAX' },
        { name: '睡眠導入', level: '8' },
        { name: '夢分析', level: '5' }
      ],
      unlocked: true
    },
    {
      id: 'aria',
      name: 'Aria',
      bodyColor: '#60a5fa',
      bellyColor: '#dbeafe',
      role: 'モチベーションコーチ',
      personality: '明るく元気',
      specialty: '目標達成・習慣形成',
      level: 8,
      xp: 1800,
      nextLevelXp: 2000,
      description: 'あなたの目標達成を全力でサポートします！',
      stats: {
        empathy: 82,
        wisdom: 75,
        energy: 98,
        humor: 85
      },
      skills: [
        { name: '目標設定', level: '7' },
        { name: 'ポジティブ思考', level: 'MAX' },
        { name: 'チアリング', level: '6' }
      ],
      unlocked: true
    },
    {
      id: 'zen',
      name: 'Zen',
      bodyColor: '#f59e0b',
      bellyColor: '#fed7aa',
      role: '瞑想マスター',
      personality: '落ち着きと知恵',
      specialty: 'マインドフルネス・ストレス管理',
      level: 15,
      xp: 0,
      nextLevelXp: 5000,
      description: '内なる平和への道を示します',
      stats: {
        empathy: 90,
        wisdom: 100,
        energy: 50,
        humor: 60
      },
      skills: [
        { name: '瞑想指導', level: 'MAX' },
        { name: 'ストレス軽減', level: 'MAX' },
        { name: '哲学的対話', level: '9' }
      ],
      unlocked: false,
      unlockRequirement: 'レベル10到達'
    },
    {
      id: 'spark',
      name: 'Spark',
      bodyColor: '#ef4444',
      bellyColor: '#fecaca',
      role: 'エナジーブースター',
      personality: 'ダイナミックで情熱的',
      specialty: '運動・活力向上',
      level: 1,
      xp: 0,
      nextLevelXp: 500,
      description: 'エネルギーに満ちた毎日をサポート！',
      stats: {
        empathy: 70,
        wisdom: 65,
        energy: 100,
        humor: 90
      },
      skills: [
        { name: 'エクササイズ', level: '3' },
        { name: 'エナジーチャージ', level: '2' },
        { name: 'モーニングルーティン', level: '1' }
      ],
      unlocked: false,
      unlockRequirement: '7日連続ログイン'
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
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#f3f4f6',
          margin: 0,
          marginBottom: '8px'
        }}>
          キャラクター
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#9ca3af'
        }}>
          あなたをサポートする仲間たち
        </p>
      </div>

      {/* Characters Grid */}
      <div style={{
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {characters.map(character => {
          const isUnlocked = character.unlocked || unlockedCharacters.includes(character.id)
          const progressPercent = character.nextLevelXp > 0 ? (character.xp / character.nextLevelXp) * 100 : 0

          return (
            <div
              key={character.id}
              onClick={() => isUnlocked && setSelectedCharacter(character.id)}
              style={{
                backgroundColor: '#1f2937',
                borderRadius: '16px',
                padding: '16px',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.5,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (isUnlocked) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (isUnlocked) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {!isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}>
                  <span style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</span>
                  <span style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    textAlign: 'center',
                    padding: '0 8px'
                  }}>
                    {character.unlockRequirement}
                  </span>
                </div>
              )}

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#374151',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  padding: '5px'
                }}>
                  <BirdCharacter 
                    bodyColor={character.bodyColor} 
                    bellyColor={character.bellyColor}
                    size={50}
                  />
                </div>

                {/* Name & Role */}
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#f3f4f6',
                  marginBottom: '4px'
                }}>
                  {character.name}
                </h3>
                <span style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginBottom: '12px'
                }}>
                  {character.role}
                </span>

                {/* Level & Progress */}
                {isUnlocked && (
                  <div style={{
                    width: '100%',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#a3e635',
                        fontWeight: '600'
                      }}>
                        Lv.{character.level}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        color: '#9ca3af'
                      }}>
                        {character.xp}/{character.nextLevelXp}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: '#374151',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progressPercent}%`,
                        backgroundColor: '#a3e635',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                )}

                {/* Specialty */}
                <span style={{
                  fontSize: '11px',
                  backgroundColor: '#374151',
                  color: '#d1d5db',
                  padding: '4px 8px',
                  borderRadius: '12px'
                }}>
                  {character.specialty}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Character Detail Modal */}
      {selectedCharacter && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '24px 24px 0 0',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '24px'
          }}>
            {(() => {
              const char = characters.find(c => c.id === selectedCharacter)!
              const progressPercent = char.nextLevelXp > 0 ? (char.xp / char.nextLevelXp) * 100 : 0

              return (
                <>
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedCharacter(null)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#374151',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#9ca3af',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>

                  {/* Character Header */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '24px'
                  }}>
                    <div style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: '#374151',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      marginBottom: '16px'
                    }}>
                      {char.id === 'luna' ? (
                        <BirdCharacter size={80} mood="happy" />
                      ) : (
                        char.avatar
                      )}
                    </div>
                    <h2 style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#f3f4f6',
                      marginBottom: '4px'
                    }}>
                      {char.name}
                    </h2>
                    <span style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '8px'
                    }}>
                      {char.role}
                    </span>
                    <p style={{
                      fontSize: '13px',
                      color: '#d1d5db',
                      textAlign: 'center',
                      lineHeight: '1.5',
                      marginBottom: '16px'
                    }}>
                      {char.description}
                    </p>
                  </div>

                  {/* Level Progress */}
                  <div style={{
                    backgroundColor: '#111827',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '16px',
                        color: '#a3e635',
                        fontWeight: '600'
                      }}>
                        レベル {char.level}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        {char.xp} / {char.nextLevelXp} XP
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#374151',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progressPercent}%`,
                        backgroundColor: '#a3e635',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{
                    backgroundColor: '#111827',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '12px'
                    }}>
                      ステータス
                    </h3>
                    {Object.entries(char.stats).map(([stat, value]) => (
                      <div key={stat} style={{
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            textTransform: 'capitalize'
                          }}>
                            {stat === 'empathy' ? '共感力' :
                             stat === 'wisdom' ? '知恵' :
                             stat === 'energy' ? 'エネルギー' :
                             stat === 'humor' ? 'ユーモア' : stat}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: '#a3e635',
                            fontWeight: '600'
                          }}>
                            {value}
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#374151',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${value}%`,
                            backgroundColor: value >= 90 ? '#a3e635' : value >= 70 ? '#60a5fa' : '#9ca3af',
                            borderRadius: '2px'
                          }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div style={{
                    backgroundColor: '#111827',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#f3f4f6',
                      marginBottom: '12px'
                    }}>
                      スキル
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {char.skills.map((skill, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: '#1f2937',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            fontSize: '13px',
                            color: '#d1d5db'
                          }}>
                            {skill.name}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            backgroundColor: skill.level === 'MAX' ? '#a3e635' : '#374151',
                            color: skill.level === 'MAX' ? '#111827' : '#9ca3af',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontWeight: '600'
                          }}>
                            Lv.{skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      router.push('/chat')
                      setSelectedCharacter(null)
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
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
                    {char.name}と話す
                  </button>
                </>
              )
            })()}
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  )
}