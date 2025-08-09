'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function ContentLibraryPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'meditation' | 'sleep' | 'stress' | 'exercise'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedContent, setSavedContent] = useState<number[]>([1, 3, 5])
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const categories = [
    { key: 'all', label: 'すべて', icon: '📚' },
    { key: 'meditation', label: '瞑想', icon: '🧘' },
    { key: 'sleep', label: '睡眠', icon: '😴' },
    { key: 'stress', label: 'ストレス', icon: '💆' },
    { key: 'exercise', label: '運動', icon: '🏃' }
  ]

  const content = [
    {
      id: 1,
      title: '5分間の朝瞑想',
      category: 'meditation',
      type: 'audio',
      duration: '5分',
      thumbnail: '🎵',
      instructor: 'Luna',
      rating: 4.8,
      views: 1234,
      description: '一日を穏やかに始めるための短い瞑想ガイド',
      saved: true,
      featured: true
    },
    {
      id: 2,
      title: '深い眠りへの誘導',
      category: 'sleep',
      type: 'audio',
      duration: '15分',
      thumbnail: '🎵',
      instructor: 'Zen',
      rating: 4.9,
      views: 3456,
      description: '質の高い睡眠を得るためのリラクゼーション音声',
      saved: false,
      featured: true
    },
    {
      id: 3,
      title: 'ストレス解消ヨガ',
      category: 'exercise',
      type: 'video',
      duration: '20分',
      thumbnail: '📹',
      instructor: 'Aria',
      rating: 4.7,
      views: 2345,
      description: '緊張をほぐし、心身をリラックスさせるヨガセッション',
      saved: true,
      featured: false
    },
    {
      id: 4,
      title: '呼吸法入門',
      category: 'stress',
      type: 'article',
      duration: '読了5分',
      thumbnail: '📖',
      instructor: 'Dr. Smith',
      rating: 4.6,
      views: 1567,
      description: '基本的な呼吸法とその効果について学ぶ',
      saved: false,
      featured: false
    },
    {
      id: 5,
      title: '夜のリラックス瞑想',
      category: 'meditation',
      type: 'audio',
      duration: '10分',
      thumbnail: '🎵',
      instructor: 'Luna',
      rating: 4.8,
      views: 2890,
      description: '一日の疲れを癒し、心を落ち着ける瞑想',
      saved: true,
      featured: false
    },
    {
      id: 6,
      title: '朝のエナジーワークアウト',
      category: 'exercise',
      type: 'video',
      duration: '15分',
      thumbnail: '📹',
      instructor: 'Spark',
      rating: 4.7,
      views: 1998,
      description: '朝の活力を高める軽い運動プログラム',
      saved: false,
      featured: true
    }
  ]

  const filteredContent = content.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSaveContent = (contentId: number) => {
    if (savedContent.includes(contentId)) {
      setSavedContent(savedContent.filter(id => id !== contentId))
    } else {
      setSavedContent([...savedContent, contentId])
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'audio': return '🎧'
      case 'video': return '📹'
      case 'article': return '📖'
      default: return '📁'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #374151'
      }}>
        <h1 style={{
          ...typographyPresets.pageTitle(),
          margin: 0
        }}>
          コンテンツライブラリ
        </h1>
        <p style={typographyPresets.subText()}>
          瞑想、睡眠、リラクゼーションコンテンツ
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="コンテンツを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#f3f4f6',
              ...getTypographyStyles('base'),
              outline: 'none'
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#a3e635' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#374151' }}
          />
          <span style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            ...getTypographyStyles('h4')
          }}>
            🔍
          </span>
        </div>
      </div>

      {/* Categories */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none'
      }}>
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key as any)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedCategory === category.key ? '#a3e635' : '#374151',
              color: selectedCategory === category.key ? '#111827' : '#d1d5db',
              border: 'none',
              borderRadius: '20px',
              ...getTypographyStyles('label'),
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Featured Section */}
      {selectedCategory === 'all' && (
        <div style={{
          padding: '0 16px 16px'
        }}>
          <h2 style={{
            ...typographyPresets.sectionHeader(),
            marginBottom: '12px'
          }}>
            おすすめコンテンツ
          </h2>
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}>
            {content.filter(item => item.featured).map(item => (
              <div
                key={item.id}
                style={{
                  minWidth: isMobile ? '160px' : '200px',
                  backgroundColor: '#1f2937',
                  borderRadius: '12px',
                  padding: isMobile ? '10px' : '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {/* Play content */}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100px',
                  backgroundColor: '#374151',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  marginBottom: '12px'
                }}>
                  {item.thumbnail}
                </div>
                <h3 style={{
                  ...getTypographyStyles('base'),
                  fontWeight: '600',
                  color: '#f3f4f6',
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.title}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  ...getTypographyStyles('small'),
                  color: '#9ca3af'
                }}>
                  <span>{getTypeIcon(item.type)}</span>
                  <span>{item.duration}</span>
                  <span>⭐ {item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content List */}
      <div style={{
        padding: '0 16px 16px'
      }}>
        <h2 style={{
          ...typographyPresets.sectionHeader(),
          marginBottom: '16px'
        }}>
          {selectedCategory === 'all' ? 'すべてのコンテンツ' : 
           categories.find(c => c.key === selectedCategory)?.label + 'コンテンツ'}
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {filteredContent.map(item => {
            const isSaved = savedContent.includes(item.id)
            
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {/* Play content */}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: isMobile ? '50px' : '60px',
                    height: isMobile ? '50px' : '60px',
                    backgroundColor: '#374151',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '20px' : '24px',
                    flexShrink: 0
                  }}>
                    {item.thumbnail}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <h3 style={{
                          ...getTypographyStyles('large'),
                          fontWeight: '600',
                          color: '#f3f4f6',
                          marginBottom: '4px'
                        }}>
                          {item.title}
                        </h3>
                        <p style={{
                          ...getTypographyStyles('label'),
                          color: '#9ca3af',
                          marginBottom: '8px',
                          fontWeight: '400'
                        }}>
                          {item.description}
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaveContent(item.id)
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isSaved ? '❤️' : '🤍'}
                      </button>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        ...getTypographyStyles('small'),
                        backgroundColor: '#374151',
                        color: '#d1d5db',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getTypeIcon(item.type)}
                        {item.type === 'audio' ? '音声' : 
                         item.type === 'video' ? '動画' : '記事'}
                      </span>
                      <span style={{
                        ...getTypographyStyles('small'),
                        color: '#9ca3af'
                      }}>
                        ⏱ {item.duration}
                      </span>
                      <span style={{
                        ...getTypographyStyles('small'),
                        color: '#9ca3af'
                      }}>
                        👤 {item.instructor}
                      </span>
                      <span style={{
                        ...getTypographyStyles('small'),
                        color: '#fbbf24'
                      }}>
                        ⭐ {item.rating}
                      </span>
                      <span style={{
                        ...getTypographyStyles('small'),
                        color: '#9ca3af'
                      }}>
                        👁 {item.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredContent.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <span style={{
              fontSize: '48px',
              marginBottom: '16px',
              display: 'block'
            }}>
              🔍
            </span>
            <p style={{
              ...getTypographyStyles('large'),
              color: '#9ca3af'
            }}>
              コンテンツが見つかりませんでした
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {/* Show saved content */}}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '56px',
          height: '56px',
          backgroundColor: '#a3e635',
          borderRadius: '50%',
          border: 'none',
          boxShadow: '0 4px 12px rgba(163, 230, 53, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          zIndex: 40,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        ❤️
      </button>

      <MobileBottomNav />
    </div>
  )
}