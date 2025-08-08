'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function CharactersPage() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [unlockedCharacters, setUnlockedCharacters] = useState(['luna', 'aria'])
  const [activeTab, setActiveTab] = useState<'stats' | 'skills' | 'dialogue' | 'memories'>('stats')
  const [favoriteCharacters, setFavoriteCharacters] = useState<string[]>(['luna'])
  const [characterMoods, setCharacterMoods] = useState<{ [key: string]: string }>({
    luna: 'happy',
    aria: 'excited',
    zen: 'calm',
    spark: 'energetic',
    nova: 'curious',
    sage: 'thoughtful'
  })

  // Enhanced Bird character SVG component with mood animations
  const BirdCharacter = ({ 
    bodyColor, 
    bellyColor, 
    size = 60,
    mood = 'happy',
    isAnimated = false 
  }: { 
    bodyColor: string, 
    bellyColor: string, 
    size?: number,
    mood?: string,
    isAnimated?: boolean 
  }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      style={{ 
        display: 'block',
        animation: isAnimated ? 'bounce 2s ease-in-out infinite' : 'none'
      }}
    >
      <ellipse cx="50" cy="55" rx="35" ry="38" fill={bodyColor} />
      <ellipse cx="50" cy="60" rx="25" ry="28" fill={bellyColor} />
      <ellipse cx="25" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(-20 25 50)" />
      <ellipse cx="75" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(20 75 50)" />
      
      {/* Dynamic eyes based on mood */}
      {mood === 'sleeping' ? (
        <>
          <path d="M35 45 Q40 42 45 45" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
          <path d="M55 45 Q60 42 65 45" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : mood === 'winking' ? (
        <>
          <circle cx="40" cy="45" r="6" fill="white" />
          <circle cx="42" cy="45" r="4" fill="#111827" />
          <circle cx="43" cy="44" r="2" fill="white" />
          <path d="M55 45 Q60 42 65 45" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="40" cy="45" r="6" fill="white" />
          <circle cx="42" cy="45" r="4" fill="#111827" />
          <circle cx="43" cy="44" r="2" fill="white" />
          <circle cx="60" cy="45" r="6" fill="white" />
          <circle cx="58" cy="45" r="4" fill="#111827" />
          <circle cx="59" cy="44" r="2" fill="white" />
        </>
      )}
      
      <path d="M50 52 L45 57 L55 57 Z" fill="#fbbf24" />
      
      {/* Mood indicators */}
      {mood === 'happy' && (
        <g>
          <circle cx="25" cy="45" r="2" fill="#fecaca" opacity="0.6" />
          <circle cx="75" cy="45" r="2" fill="#fecaca" opacity="0.6" />
        </g>
      )}
      {mood === 'excited' && (
        <g>
          <text x="15" y="25" fontSize="12" fill="#fbbf24">✨</text>
          <text x="75" y="25" fontSize="12" fill="#fbbf24">✨</text>
        </g>
      )}
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
      relationshipLevel: 85,
      description: '静かな夜に寄り添い、安らかな眠りへと導きます',
      stats: {
        empathy: 95,
        wisdom: 88,
        energy: 65,
        humor: 70
      },
      skills: [
        { name: '深呼吸ガイド', level: 'MAX', description: '完璧な呼吸法で深いリラックス状態へ' },
        { name: '睡眠導入', level: '8', description: '心地よい眠りへの優しい誘導' },
        { name: '夢分析', level: '5', description: '夢の意味を読み解き、心の声を聴く' }
      ],
      dialogue: [
        { date: '2025/08/07', message: '今夜も良い夢を見られますように' },
        { date: '2025/08/06', message: 'ゆっくり深呼吸して、心を落ち着けましょう' },
        { date: '2025/08/05', message: 'あなたの頑張りを見守っています' }
      ],
      memories: [
        { title: '初めての深呼吸セッション', date: '2025/07/01', icon: '🫁' },
        { title: '7日連続睡眠改善', date: '2025/07/15', icon: '🌙' },
        { title: '悪夢を乗り越えた夜', date: '2025/07/28', icon: '💫' }
      ],
      unlocked: true,
      badge: '🌙'
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
      relationshipLevel: 72,
      description: 'あなたの目標達成を全力でサポートします！',
      stats: {
        empathy: 82,
        wisdom: 75,
        energy: 98,
        humor: 85
      },
      skills: [
        { name: '目標設定', level: '7', description: 'SMART目標で確実な成功へ' },
        { name: 'ポジティブ思考', level: 'MAX', description: '前向きなエネルギーで満たす' },
        { name: 'チアリング', level: '6', description: '応援の言葉でやる気UP' }
      ],
      dialogue: [
        { date: '2025/08/07', message: '今日も素晴らしい一日になりますよ！' },
        { date: '2025/08/06', message: '昨日より1%でも成長できれば大成功！' },
        { date: '2025/08/05', message: '一緒に目標に向かって頑張りましょう！' }
      ],
      memories: [
        { title: '初めての目標達成', date: '2025/07/05', icon: '🎯' },
        { title: '習慣化成功記念日', date: '2025/07/20', icon: '✨' },
        { title: 'モチベーション最高潮の日', date: '2025/08/01', icon: '🚀' }
      ],
      unlocked: true,
      badge: '⭐'
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
      xp: 4200,
      nextLevelXp: 5000,
      relationshipLevel: 45,
      description: '内なる平和への道を示します',
      stats: {
        empathy: 90,
        wisdom: 100,
        energy: 50,
        humor: 60
      },
      skills: [
        { name: '瞑想指導', level: 'MAX', description: '深い瞑想状態への完璧な導き' },
        { name: 'ストレス軽減', level: 'MAX', description: '心の重荷を解き放つ' },
        { name: '哲学的対話', level: '9', description: '人生の深い意味を探求' }
      ],
      dialogue: [],
      memories: [],
      unlocked: false,
      unlockRequirement: 'レベル10到達',
      badge: '🧘'
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
      relationshipLevel: 0,
      description: 'エネルギーに満ちた毎日をサポート！',
      stats: {
        empathy: 70,
        wisdom: 65,
        energy: 100,
        humor: 90
      },
      skills: [
        { name: 'エクササイズ', level: '3', description: '楽しく効果的な運動指導' },
        { name: 'エナジーチャージ', level: '2', description: '瞬時に元気を注入' },
        { name: 'モーニングルーティン', level: '1', description: '最高の一日のスタート' }
      ],
      dialogue: [],
      memories: [],
      unlocked: false,
      unlockRequirement: '7日連続ログイン',
      badge: '🔥'
    },
    {
      id: 'nova',
      name: 'Nova',
      bodyColor: '#a78bfa',
      bellyColor: '#e9d5ff',
      role: '創造性の妖精',
      personality: '好奇心旺盛で創造的',
      specialty: 'クリエイティビティ・問題解決',
      level: 5,
      xp: 950,
      nextLevelXp: 1200,
      relationshipLevel: 30,
      description: '新しいアイデアと可能性を一緒に探求しましょう',
      stats: {
        empathy: 78,
        wisdom: 72,
        energy: 85,
        humor: 92
      },
      skills: [
        { name: 'ブレインストーミング', level: '5', description: 'アイデアの泉を解き放つ' },
        { name: 'クリエイティブ思考', level: '4', description: '枠を超えた発想力' },
        { name: 'インスピレーション', level: '3', description: 'ひらめきの瞬間を創造' }
      ],
      dialogue: [],
      memories: [],
      unlocked: false,
      unlockRequirement: '30日間使用',
      badge: '💡'
    },
    {
      id: 'sage',
      name: 'Sage',
      bodyColor: '#10b981',
      bellyColor: '#d1fae5',
      role: '知恵の守護者',
      personality: '博識で思慮深い',
      specialty: '学習サポート・成長促進',
      level: 20,
      xp: 8500,
      nextLevelXp: 10000,
      relationshipLevel: 10,
      description: '人生の教訓と深い洞察を共有します',
      stats: {
        empathy: 88,
        wisdom: 95,
        energy: 60,
        humor: 75
      },
      skills: [
        { name: '知識の伝授', level: 'MAX', description: '深い理解への道を示す' },
        { name: '成長コーチング', level: '10', description: '継続的な自己改善をサポート' },
        { name: '人生相談', level: '8', description: '人生の岐路での賢明な助言' }
      ],
      dialogue: [],
      memories: [],
      unlocked: false,
      unlockRequirement: '100セッション完了',
      badge: '📚'
    }
  ]

  const getRelationshipColor = (level: number) => {
    if (level >= 80) return '#a3e635'
    if (level >= 60) return '#60a5fa'
    if (level >= 40) return '#fbbf24'
    if (level >= 20) return '#f59e0b'
    return '#9ca3af'
  }

  const getRelationshipTitle = (level: number) => {
    if (level >= 90) return '親友'
    if (level >= 70) return '仲良し'
    if (level >= 50) return '友達'
    if (level >= 30) return '知り合い'
    if (level >= 10) return '初対面'
    return '未知'
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
          margin: 0,
          marginBottom: '8px'
        }}>
          AIキャラクター
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#9ca3af'
        }}>
          あなたをサポートする仲間たち
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        gap: '12px',
        overflowX: 'auto'
      }}>
        {['すべて', 'お気に入り', 'アンロック済み', 'ロック中'].map((filter) => (
          <button
            key={filter}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === 'すべて' ? 'rgba(163, 230, 53, 0.2)' : 'rgba(55, 65, 81, 0.6)',
              color: filter === 'すべて' ? '#a3e635' : '#d1d5db',
              border: filter === 'すべて' ? '1px solid rgba(163, 230, 53, 0.3)' : '1px solid transparent',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Characters Grid */}
      <div style={{
        padding: '0 20px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {characters.map(character => {
          const isUnlocked = character.unlocked || unlockedCharacters.includes(character.id)
          const progressPercent = character.nextLevelXp > 0 ? (character.xp / character.nextLevelXp) * 100 : 0
          const isFavorite = favoriteCharacters.includes(character.id)

          return (
            <div
              key={character.id}
              onClick={() => isUnlocked && setSelectedCharacter(character.id)}
              style={{
                background: isUnlocked 
                  ? `linear-gradient(135deg, ${character.bodyColor}10 0%, rgba(31, 41, 55, 0.8) 100%)`
                  : 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                padding: '20px',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.6,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                border: isUnlocked ? `1px solid ${character.bodyColor}30` : '1px solid rgba(55, 65, 81, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (isUnlocked) {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                  e.currentTarget.style.boxShadow = `0 12px 32px ${character.bodyColor}20`
                }
              }}
              onMouseLeave={(e) => {
                if (isUnlocked) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {/* Favorite Star */}
              {isUnlocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isFavorite) {
                      setFavoriteCharacters(favoriteCharacters.filter(id => id !== character.id))
                    } else {
                      setFavoriteCharacters([...favoriteCharacters, character.id])
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    zIndex: 20,
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {isFavorite ? '⭐' : '☆'}
                </button>
              )}

              {!isUnlocked && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  backdropFilter: 'blur(4px)'
                }}>
                  <span style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</span>
                  <span style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    textAlign: 'center',
                    padding: '0 16px',
                    lineHeight: '1.5'
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
                {/* Avatar with mood */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: `linear-gradient(135deg, ${character.bodyColor}20 0%, rgba(55, 65, 81, 0.6) 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  padding: '8px',
                  border: `2px solid ${character.bodyColor}40`,
                  position: 'relative'
                }}>
                  <BirdCharacter 
                    bodyColor={character.bodyColor} 
                    bellyColor={character.bellyColor}
                    size={64}
                    mood={characterMoods[character.id]}
                    isAnimated={isUnlocked}
                  />
                  {/* Badge */}
                  {character.badge && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      width: '28px',
                      height: '28px',
                      backgroundColor: character.bodyColor,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      border: '2px solid #111827'
                    }}>
                      {character.badge}
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, #f3f4f6 0%, ${character.bodyColor} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
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

                {/* Relationship Level */}
                {isUnlocked && (
                  <div style={{
                    width: '100%',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        color: '#9ca3af'
                      }}>
                        関係性
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: getRelationshipColor(character.relationshipLevel),
                        fontWeight: '600'
                      }}>
                        {getRelationshipTitle(character.relationshipLevel)}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: 'rgba(55, 65, 81, 0.6)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${character.relationshipLevel}%`,
                        background: `linear-gradient(90deg, ${getRelationshipColor(character.relationshipLevel)} 0%, ${getRelationshipColor(character.relationshipLevel)}80 100%)`,
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
                        boxShadow: `0 0 8px ${getRelationshipColor(character.relationshipLevel)}40`
                      }}></div>
                    </div>
                  </div>
                )}

                {/* Level & Progress */}
                {isUnlocked && (
                  <div style={{
                    width: '100%',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: '#a3e635',
                        fontWeight: '700'
                      }}>
                        Lv.{character.level}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        color: '#6b7280'
                      }}>
                        {character.xp}/{character.nextLevelXp} XP
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'rgba(55, 65, 81, 0.6)',
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

                {/* Specialty Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  justifyContent: 'center'
                }}>
                  {character.specialty.split('・').map((spec, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '10px',
                        backgroundColor: 'rgba(55, 65, 81, 0.6)',
                        color: '#d1d5db',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontWeight: '500'
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
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
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            borderRadius: '24px 24px 0 0',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '24px',
            animation: 'slideUp 0.3s ease'
          }}>
            {(() => {
              const char = characters.find(c => c.id === selectedCharacter)!
              const progressPercent = char.nextLevelXp > 0 ? (char.xp / char.nextLevelXp) * 100 : 0
              const isFavorite = favoriteCharacters.includes(char.id)

              return (
                <>
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedCharacter(null)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'rgba(55, 65, 81, 0.6)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#9ca3af',
                      fontSize: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.8)'
                      e.currentTarget.style.color = '#f3f4f6'
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)'
                      e.currentTarget.style.color = '#9ca3af'
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
                      width: '120px',
                      height: '120px',
                      background: `linear-gradient(135deg, ${char.bodyColor}20 0%, rgba(55, 65, 81, 0.6) 100%)`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                      padding: '10px',
                      border: `3px solid ${char.bodyColor}40`,
                      position: 'relative',
                      boxShadow: `0 8px 32px ${char.bodyColor}20`
                    }}>
                      <BirdCharacter 
                        bodyColor={char.bodyColor} 
                        bellyColor={char.bellyColor}
                        size={90}
                        mood={characterMoods[char.id]}
                        isAnimated={true}
                      />
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isFavorite) {
                            setFavoriteCharacters(favoriteCharacters.filter(id => id !== char.id))
                          } else {
                            setFavoriteCharacters([...favoriteCharacters, char.id])
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '32px',
                          height: '32px',
                          backgroundColor: char.bodyColor,
                          border: '2px solid #111827',
                          borderRadius: '50%',
                          fontSize: '18px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)' }}
                      >
                        {isFavorite ? '⭐' : '☆'}
                      </button>
                    </div>
                    <h2 style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      background: `linear-gradient(135deg, #f3f4f6 0%, ${char.bodyColor} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '8px'
                    }}>
                      {char.name}
                    </h2>
                    <span style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      marginBottom: '8px'
                    }}>
                      {char.role} • {char.personality}
                    </span>
                    <p style={{
                      fontSize: '14px',
                      color: '#d1d5db',
                      textAlign: 'center',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      maxWidth: '300px'
                    }}>
                      {char.description}
                    </p>

                    {/* Relationship Status */}
                    <div style={{
                      width: '100%',
                      maxWidth: '300px',
                      backgroundColor: 'rgba(31, 41, 55, 0.6)',
                      borderRadius: '16px',
                      padding: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          fontSize: '13px',
                          color: '#9ca3af'
                        }}>
                          関係性レベル
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: getRelationshipColor(char.relationshipLevel),
                          fontWeight: '700'
                        }}>
                          {getRelationshipTitle(char.relationshipLevel)} ({char.relationshipLevel}%)
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: 'rgba(55, 65, 81, 0.6)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${char.relationshipLevel}%`,
                          background: `linear-gradient(90deg, ${getRelationshipColor(char.relationshipLevel)} 0%, ${getRelationshipColor(char.relationshipLevel)}80 100%)`,
                          borderRadius: '4px',
                          transition: 'width 0.5s ease',
                          boxShadow: `0 0 12px ${getRelationshipColor(char.relationshipLevel)}40`
                        }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px',
                    borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
                    paddingBottom: '12px'
                  }}>
                    {(['stats', 'skills', 'dialogue', 'memories'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: activeTab === tab ? char.bodyColor : 'transparent',
                          color: activeTab === tab ? '#111827' : '#9ca3af',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {tab === 'stats' ? 'ステータス' :
                         tab === 'skills' ? 'スキル' :
                         tab === 'dialogue' ? '会話履歴' : '思い出'}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'stats' && (
                    <div style={{
                      backgroundColor: 'rgba(31, 41, 55, 0.6)',
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#f3f4f6',
                        marginBottom: '16px'
                      }}>
                        キャラクターステータス
                      </h3>
                      {Object.entries(char.stats).map(([stat, value]) => (
                        <div key={stat} style={{
                          marginBottom: '16px'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '6px'
                          }}>
                            <span style={{
                              fontSize: '13px',
                              color: '#9ca3af',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              {stat === 'empathy' ? '💝 共感力' :
                               stat === 'wisdom' ? '🧠 知恵' :
                               stat === 'energy' ? '⚡ エネルギー' :
                               stat === 'humor' ? '😄 ユーモア' : stat}
                            </span>
                            <span style={{
                              fontSize: '14px',
                              color: value >= 90 ? '#a3e635' : value >= 70 ? '#60a5fa' : '#9ca3af',
                              fontWeight: '700'
                            }}>
                              {value}
                            </span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: 'rgba(55, 65, 81, 0.8)',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${value}%`,
                              background: `linear-gradient(90deg, ${value >= 90 ? '#a3e635' : value >= 70 ? '#60a5fa' : '#9ca3af'} 0%, ${value >= 90 ? '#84cc16' : value >= 70 ? '#3b82f6' : '#6b7280'} 100%)`,
                              borderRadius: '3px',
                              transition: 'width 0.5s ease',
                              boxShadow: value >= 90 ? '0 0 8px rgba(163, 230, 53, 0.4)' : 'none'
                            }}></div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Level Progress */}
                      <div style={{
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(55, 65, 81, 0.5)'
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
                            fontWeight: '700'
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
                          height: '10px',
                          backgroundColor: 'rgba(55, 65, 81, 0.8)',
                          borderRadius: '5px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${progressPercent}%`,
                            background: 'linear-gradient(90deg, #a3e635 0%, #84cc16 100%)',
                            borderRadius: '5px',
                            transition: 'width 0.5s ease',
                            boxShadow: '0 0 10px rgba(163, 230, 53, 0.3)'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'skills' && (
                    <div style={{
                      backgroundColor: 'rgba(31, 41, 55, 0.6)',
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#f3f4f6',
                        marginBottom: '16px'
                      }}>
                        習得スキル
                      </h3>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        {char.skills.map((skill, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '14px',
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                            borderRadius: '12px',
                            border: skill.level === 'MAX' ? `1px solid ${char.bodyColor}40` : '1px solid rgba(55, 65, 81, 0.5)'
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '8px'
                            }}>
                              <span style={{
                                fontSize: '14px',
                                color: '#f3f4f6',
                                fontWeight: '600'
                              }}>
                                {skill.name}
                              </span>
                              <span style={{
                                fontSize: '12px',
                                background: skill.level === 'MAX' 
                                  ? `linear-gradient(135deg, ${char.bodyColor} 0%, ${char.bodyColor}80 100%)`
                                  : 'rgba(55, 65, 81, 0.8)',
                                color: skill.level === 'MAX' ? '#111827' : '#9ca3af',
                                padding: '4px 10px',
                                borderRadius: '14px',
                                fontWeight: '700'
                              }}>
                                {skill.level === 'MAX' ? 'マスター' : `Lv.${skill.level}`}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '12px',
                              color: '#9ca3af',
                              lineHeight: '1.4'
                            }}>
                              {skill.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'dialogue' && (
                    <div style={{
                      backgroundColor: 'rgba(31, 41, 55, 0.6)',
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#f3f4f6',
                        marginBottom: '16px'
                      }}>
                        最近の会話
                      </h3>
                      {char.dialogue.length > 0 ? (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}>
                          {char.dialogue.map((dialog, index) => (
                            <div key={index} style={{
                              display: 'flex',
                              gap: '12px',
                              padding: '12px',
                              backgroundColor: 'rgba(31, 41, 55, 0.8)',
                              borderRadius: '12px'
                            }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                backgroundColor: 'rgba(55, 65, 81, 0.6)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <BirdCharacter 
                                  bodyColor={char.bodyColor} 
                                  bellyColor={char.bellyColor}
                                  size={28}
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  fontSize: '10px',
                                  color: '#6b7280',
                                  marginBottom: '4px'
                                }}>
                                  {dialog.date}
                                </div>
                                <div style={{
                                  fontSize: '13px',
                                  color: '#d1d5db',
                                  lineHeight: '1.5'
                                }}>
                                  "{dialog.message}"
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{
                          textAlign: 'center',
                          padding: '32px',
                          color: '#6b7280'
                        }}>
                          <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}>💬</span>
                          まだ会話をしていません
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'memories' && (
                    <div style={{
                      backgroundColor: 'rgba(31, 41, 55, 0.6)',
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#f3f4f6',
                        marginBottom: '16px'
                      }}>
                        思い出のアルバム
                      </h3>
                      {char.memories.length > 0 ? (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '12px'
                        }}>
                          {char.memories.map((memory, index) => (
                            <div key={index} style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              padding: '16px',
                              backgroundColor: 'rgba(31, 41, 55, 0.8)',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)'
                              e.currentTarget.style.backgroundColor = 'rgba(41, 51, 65, 0.9)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)'
                              e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.8)'
                            }}>
                              <span style={{
                                fontSize: '28px',
                                marginBottom: '8px'
                              }}>
                                {memory.icon}
                              </span>
                              <span style={{
                                fontSize: '12px',
                                color: '#f3f4f6',
                                textAlign: 'center',
                                marginBottom: '4px',
                                fontWeight: '600'
                              }}>
                                {memory.title}
                              </span>
                              <span style={{
                                fontSize: '10px',
                                color: '#6b7280'
                              }}>
                                {memory.date}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{
                          textAlign: 'center',
                          padding: '32px',
                          color: '#6b7280'
                        }}>
                          <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}>📸</span>
                          まだ思い出がありません
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <button
                      onClick={() => {
                        router.push('/chat')
                        setSelectedCharacter(null)
                      }}
                      style={{
                        flex: 1,
                        padding: '16px',
                        background: `linear-gradient(135deg, ${char.bodyColor} 0%, ${char.bodyColor}80 100%)`,
                        color: '#111827',
                        border: 'none',
                        borderRadius: '14px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 4px 16px ${char.bodyColor}30`
                      }}
                      onMouseEnter={(e) => { 
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = `0 6px 24px ${char.bodyColor}40`
                      }}
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = `0 4px 16px ${char.bodyColor}30`
                      }}
                    >
                      {char.name}と話す
                    </button>
                    <button
                      onClick={() => setSelectedCharacter(null)}
                      style={{
                        padding: '16px 24px',
                        backgroundColor: 'rgba(55, 65, 81, 0.6)',
                        color: '#9ca3af',
                        border: '1px solid rgba(55, 65, 81, 0.5)',
                        borderRadius: '14px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => { 
                        e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.6)'
                        e.currentTarget.style.color = '#d1d5db'
                      }}
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)'
                        e.currentTarget.style.color = '#9ca3af'
                      }}
                    >
                      閉じる
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}