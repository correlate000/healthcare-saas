'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function FavoritesPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('all')

  const favorites = [
    {
      id: 1,
      title: 'ストレス管理の基本',
      type: 'article',
      icon: '📄',
      savedDate: '2024年6月8日',
      color: '#60a5fa'
    },
    {
      id: 2,
      title: '5分間のマインドフルネス瞑想',
      type: 'video',
      icon: '🎥',
      savedDate: '2024年6月7日',
      color: '#a78bfa'
    },
    {
      id: 3,
      title: '朝の軽いストレッチ',
      type: 'exercise',
      icon: '🏃',
      savedDate: '2024年6月5日',
      color: '#10b981'
    },
    {
      id: 4,
      title: '良質な睡眠のための10のヒント',
      type: 'article',
      icon: '📄',
      savedDate: '2024年6月3日',
      color: '#60a5fa'
    }
  ]

  const types = [
    { id: 'all', label: 'すべて', icon: '⭐' },
    { id: 'article', label: '記事', icon: '📄' },
    { id: 'video', label: 'ビデオ', icon: '🎥' },
    { id: 'exercise', label: 'エクササイズ', icon: '🏃' }
  ]

  const filteredFavorites = selectedType === 'all'
    ? favorites
    : favorites.filter(f => f.type === selectedType)

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'article': return '記事'
      case 'video': return 'ビデオ'
      case 'exercise': return 'エクササイズ'
      default: return ''
    }
  }

  const handleViewContent = (item: typeof favorites[0]) => {
    switch(item.type) {
      case 'article':
        router.push('/content-library/articles')
        break
      case 'video':
        router.push('/content-library/videos')
        break
      case 'exercise':
        router.push('/content-library/exercises')
        break
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
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
          ...typographyPresets.pageTitle(),
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #fbbf24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          お気に入り
        </h1>
        <p style={{
          ...getTypographyStyles('base'),
          color: '#9ca3af',
          marginTop: '8px',
          margin: '8px 0 0 0'
        }}>
          保存したコンテンツ
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Type Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {types.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                padding: '8px 16px',
                background: selectedType === type.id
                  ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                  : 'rgba(55, 65, 81, 0.6)',
                color: selectedType === type.id ? '#111827' : '#d1d5db',
                border: 'none',
                borderRadius: '20px',
                ...getTypographyStyles('button'),
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {/* Favorites List */}
        {filteredFavorites.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {filteredFavorites.map((item, index) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(31, 41, 55, 0.6)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(55, 65, 81, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                }}
                onClick={() => handleViewContent(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.6)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: `${item.color}20`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    ...getTypographyStyles('base'),
                    fontWeight: '600',
                    color: '#f3f4f6',
                    marginBottom: '4px'
                  }}>
                    {item.title}
                  </h3>
                  <div style={{
                    ...getTypographyStyles('small'),
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{getTypeLabel(item.type)}</span>
                    <span>•</span>
                    <span>{item.savedDate}</span>
                  </div>
                </div>

                {/* Favorite Icon */}
                <div style={{
                  fontSize: '20px',
                  color: '#fbbf24'
                }}>
                  ⭐
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'rgba(31, 41, 55, 0.4)',
            borderRadius: '16px',
            border: '1px solid rgba(55, 65, 81, 0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{
              ...getTypographyStyles('h3'),
              fontWeight: '600',
              color: '#f3f4f6',
              marginBottom: '8px'
            }}>
              お気に入りがありません
            </h3>
            <p style={{
              ...getTypographyStyles('base'),
              color: '#9ca3af'
            }}>
              コンテンツを保存すると、ここに表示されます
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => router.push('/content-library')}
            style={{
              padding: '12px',
              backgroundColor: 'rgba(55, 65, 81, 0.6)',
              color: '#d1d5db',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderRadius: '12px',
              ...getTypographyStyles('button'),
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ライブラリ
          </button>
          <button
            onClick={() => router.push('/content-library/articles')}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              ...getTypographyStyles('button'),
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            新しいコンテンツ
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}