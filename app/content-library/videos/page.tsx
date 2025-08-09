'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function VideosPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const videos = [
    {
      id: 1,
      title: '5分間のマインドフルネス瞑想',
      category: 'meditation',
      duration: '5:00',
      thumbnail: '🧘‍♀️',
      views: 1234,
      color: '#a78bfa'
    },
    {
      id: 2,
      title: 'ストレス解消ストレッチ',
      category: 'exercise',
      duration: '10:00',
      thumbnail: '🤸‍♂️',
      views: 890,
      color: '#60a5fa'
    },
    {
      id: 3,
      title: '深呼吸エクササイズ',
      category: 'breathing',
      duration: '3:00',
      thumbnail: '💨',
      views: 2456,
      color: '#10b981'
    },
    {
      id: 4,
      title: '睡眠導入リラクゼーション',
      category: 'sleep',
      duration: '15:00',
      thumbnail: '😴',
      views: 3567,
      color: '#8b5cf6'
    }
  ]

  const categories = [
    { id: 'all', label: 'すべて', icon: '📺' },
    { id: 'meditation', label: '瞑想', icon: '🧘' },
    { id: 'exercise', label: '運動', icon: '🏃' },
    { id: 'breathing', label: '呼吸法', icon: '💨' },
    { id: 'sleep', label: '睡眠', icon: '😴' }
  ]

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory)

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
          background: 'linear-gradient(135deg, #f3f4f6 0%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          ビデオライブラリ
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '8px 16px',
                background: selectedCategory === category.id
                  ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
                  : 'rgba(55, 65, 81, 0.6)',
                color: selectedCategory === category.id ? '#111827' : '#d1d5db',
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
              {category.icon} {category.label}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {filteredVideos.map(video => (
            <div
              key={video.id}
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(55, 65, 81, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => alert(`ビデオ「${video.title}」を再生します（準備中）`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Thumbnail */}
              <div style={{
                height: '160px',
                background: `linear-gradient(135deg, ${video.color}40 0%, ${video.color}20 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                position: 'relative'
              }}>
                {video.thumbnail}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '4px',
                  ...getTypographyStyles('caption'),
                  color: 'white'
                }}>
                  {video.duration}
                </div>
              </div>

              {/* Video Info */}
              <div style={{ padding: '16px' }}>
                <h3 style={{
                  ...getTypographyStyles('large'),
                  fontWeight: '600',
                  color: '#f3f4f6',
                  marginBottom: '8px'
                }}>
                  {video.title}
                </h3>
                <div style={{
                  ...getTypographyStyles('small'),
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  👁 {video.views.toLocaleString()}回視聴
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
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
            ライブラリに戻る
          </button>
          <button
            onClick={() => router.push('/content-library/articles')}
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
            記事を見る
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}