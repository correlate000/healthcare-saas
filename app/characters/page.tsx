'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function CharactersPage() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState('luna')

  const characters = [
    {
      id: 'luna',
      name: 'Luna',
      title: '優しい相談相手',
      color: '#a3e635',
      level: 15,
      description: '穏やかで思いやりのあるAIキャラクター。いつもあなたに寄り添い、優しく話を聞いてくれます。',
      personality: ['優しい', '思いやり', '共感的'],
      specialSkills: ['共感的な会話', 'ストレス緩和', '安心感の提供'],
      relationship: 85,
      conversations: 234,
      favoriteTopics: ['日常会話', '感情の整理', 'リラックス']
    },
    {
      id: 'aria',
      name: 'Aria',
      title: '元気な応援団',
      color: '#60a5fa',
      level: 12,
      description: '明るくポジティブなAIキャラクター。どんな時も前向きな言葉で元気づけてくれます。',
      personality: ['明るい', 'ポジティブ', 'エネルギッシュ'],
      specialSkills: ['モチベーション向上', '目標達成支援', 'ポジティブ思考'],
      relationship: 72,
      conversations: 156,
      favoriteTopics: ['目標設定', 'チャレンジ', '成長']
    },
    {
      id: 'zen',
      name: 'Zen',
      title: '瞑想マスター',
      color: '#f59e0b',
      level: 18,
      description: '落ち着いた雰囲気のAIキャラクター。マインドフルネスと瞑想のエキスパートです。',
      personality: ['穏やか', '深い洞察力', '冷静'],
      specialSkills: ['瞑想指導', 'マインドフルネス', '深い内省'],
      relationship: 68,
      conversations: 189,
      favoriteTopics: ['瞑想', 'マインドフルネス', '自己認識']
    }
  ]

  const currentCharacter = characters.find(c => c.id === selectedCharacter) || characters[0]

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #374151' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push('/settings')}
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
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
            AIキャラクター
          </h1>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Character tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => setSelectedCharacter(character.id)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: selectedCharacter === character.id ? character.color : '#374151',
                color: selectedCharacter === character.id ? '#111827' : '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {character.name}
            </button>
          ))}
        </div>

        {/* Character card */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '16px', 
          padding: '24px',
          marginBottom: '24px',
          border: `2px solid ${currentCharacter.color}`
        }}>
          {/* Character avatar and basic info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: currentCharacter.color,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                {currentCharacter.name}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f3f4f6', margin: '0 0 4px 0' }}>
                {currentCharacter.name}
              </h2>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 8px 0' }}>
                {currentCharacter.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  padding: '4px 12px', 
                  backgroundColor: currentCharacter.color,
                  color: '#111827',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Lv.{currentCharacter.level}
                </span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  関係性レベル: {currentCharacter.relationship}%
                </span>
              </div>
            </div>
          </div>

          {/* Relationship bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>関係性</span>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>{currentCharacter.relationship}%</span>
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
                width: `${currentCharacter.relationship}%`,
                backgroundColor: currentCharacter.color,
                borderRadius: '4px'
              }}></div>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.6', marginBottom: '20px', margin: '0 0 20px 0' }}>
            {currentCharacter.description}
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ 
              backgroundColor: '#374151', 
              borderRadius: '8px', 
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: currentCharacter.color }}>
                {currentCharacter.conversations}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>会話回数</div>
            </div>
            <div style={{ 
              backgroundColor: '#374151', 
              borderRadius: '8px', 
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: currentCharacter.color }}>
                {Math.floor(currentCharacter.conversations * 4.5)}分
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>総会話時間</div>
            </div>
          </div>

          {/* Personality traits */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f3f4f6', marginBottom: '12px', margin: '0 0 12px 0' }}>
              性格特性
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentCharacter.personality.map((trait) => (
                <span
                  key={trait}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#374151',
                    color: '#d1d5db',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Special skills */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f3f4f6', marginBottom: '12px', margin: '0 0 12px 0' }}>
              特別なスキル
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentCharacter.specialSkills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ color: currentCharacter.color }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#d1d5db' }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite topics */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f3f4f6', marginBottom: '12px', margin: '0 0 12px 0' }}>
              得意な話題
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentCharacter.favoriteTopics.map((topic) => (
                <span
                  key={topic}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: currentCharacter.color + '20',
                    color: currentCharacter.color,
                    border: `1px solid ${currentCharacter.color}`,
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => router.push('/chat')}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: currentCharacter.color,
              color: '#111827',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {currentCharacter.name}と話す
          </button>
          <button
            onClick={() => router.push(`/characters/${currentCharacter.id}`)}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: '#374151',
              color: '#d1d5db',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
          >
            詳細を見る
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}