'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { TrophySimpleIcon, FireIcon, StarIcon } from '@/components/icons/illustrations'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function LeaderboardPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week')
  
  const leaderboardData = {
    week: [
      { rank: 1, name: '田中 太郎', points: 2450, streak: 15, avatar: '🦁' },
      { rank: 2, name: '佐藤 花子', points: 2200, streak: 12, avatar: '🦊' },
      { rank: 3, name: '鈴木 一郎', points: 2100, streak: 10, avatar: '🐼' },
      { rank: 4, name: 'あなた', points: 1850, streak: 7, avatar: '🐨', isCurrentUser: true },
      { rank: 5, name: '山田 美咲', points: 1700, streak: 5, avatar: '🦒' },
    ],
    month: [
      { rank: 1, name: '佐藤 花子', points: 8900, streak: 28, avatar: '🦊' },
      { rank: 2, name: '田中 太郎', points: 8450, streak: 25, avatar: '🦁' },
      { rank: 3, name: '山田 美咲', points: 7200, streak: 20, avatar: '🦒' },
      { rank: 4, name: '鈴木 一郎', points: 6800, streak: 18, avatar: '🐼' },
      { rank: 5, name: 'あなた', points: 6500, streak: 15, avatar: '🐨', isCurrentUser: true },
    ],
    all: [
      { rank: 1, name: '佐藤 花子', points: 45600, streak: 120, avatar: '🦊' },
      { rank: 2, name: '田中 太郎', points: 42300, streak: 100, avatar: '🦁' },
      { rank: 3, name: '山田 美咲', points: 38900, streak: 85, avatar: '🦒' },
      { rank: 4, name: '鈴木 一郎', points: 35400, streak: 70, avatar: '🐼' },
      { rank: 5, name: 'あなた', points: 28900, streak: 45, avatar: '🐨', isCurrentUser: true },
    ]
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#fbbf24'
    if (rank === 2) return '#94a3b8'
    if (rank === 3) return '#fb923c'
    return '#9ca3af'
  }

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return '🏅'
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
          リーダーボード
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Period selector */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {[
            { key: 'week', label: '今週' },
            { key: 'month', label: '今月' },
            { key: 'all', label: '全期間' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              style={{
                flex: 1,
                padding: '12px',
                background: selectedPeriod === period.key
                  ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                  : 'rgba(55, 65, 81, 0.6)',
                color: selectedPeriod === period.key ? '#111827' : '#d1d5db',
                border: 'none',
                borderRadius: '12px',
                ...getTypographyStyles('button'),
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {leaderboardData[selectedPeriod].map((user, index) => (
            <div
              key={user.rank}
              style={{
                background: user.isCurrentUser
                  ? 'linear-gradient(135deg, rgba(163, 230, 53, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)'
                  : 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '16px',
                border: user.isCurrentUser
                  ? '2px solid rgba(163, 230, 53, 0.4)'
                  : '1px solid rgba(55, 65, 81, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Rank */}
              <div style={{
                fontSize: '24px',
                fontWeight: '800',
                color: getRankColor(user.rank),
                minWidth: '40px',
                textAlign: 'center'
              }}>
                {getRankEmoji(user.rank)}
              </div>

              {/* Avatar */}
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(55, 65, 81, 0.6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {user.avatar}
              </div>

              {/* User info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  ...getTypographyStyles('large'),
                  fontWeight: '600',
                  color: user.isCurrentUser ? '#a3e635' : '#f3f4f6',
                  marginBottom: '4px'
                }}>
                  {user.name}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{
                    ...getTypographyStyles('small'),
                    color: '#9ca3af'
                  }}>
                    <FireIcon size={12} primaryColor="#f59e0b" /> {user.streak}日
                  </span>
                </div>
              </div>

              {/* Points */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  ...getTypographyStyles('h3'),
                  fontWeight: '700',
                  color: '#fbbf24'
                }}>
                  {user.points.toLocaleString()}
                </div>
                <div style={{
                  ...getTypographyStyles('caption'),
                  color: '#9ca3af'
                }}>
                  ポイント
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => router.push('/daily-challenge')}
          style={{
            width: '100%',
            padding: '16px',
            marginTop: '24px',
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
          チャレンジに戻る
        </button>
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