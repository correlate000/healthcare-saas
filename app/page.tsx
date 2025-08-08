'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTypographyStyles } from '@/styles/typography'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // スプラッシュ画面を2秒表示
    const timer = setTimeout(() => {
      // オンボーディング完了チェック
      const onboardingComplete = localStorage.getItem('onboardingComplete')
      
      if (onboardingComplete === 'true') {
        // 既存ユーザーはダッシュボードへ
        router.push('/dashboard')
      } else {
        // 新規ユーザーはオンボーディングへ
        router.push('/onboarding')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* メインコンテンツ */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}>
        {/* キャラクターエリア - 鳥のSVG */}
        <div style={{
          width: '200px',
          height: '200px',
          backgroundColor: '#374151',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          animation: 'fadeInScale 0.8s ease-out'
        }}>
          <svg width="140" height="140" viewBox="0 0 100 100" style={{ display: 'block' }}>
            <ellipse cx="50" cy="55" rx="35" ry="38" fill="#a3e635" />
            <ellipse cx="50" cy="60" rx="25" ry="28" fill="#ecfccb" />
            <ellipse cx="25" cy="50" rx="15" ry="25" fill="#a3e635" transform="rotate(-20 25 50)" />
            <ellipse cx="75" cy="50" rx="15" ry="25" fill="#a3e635" transform="rotate(20 75 50)" />
            <circle cx="40" cy="45" r="8" fill="white" />
            <circle cx="42" cy="45" r="5" fill="#111827" />
            <circle cx="43" cy="44" r="2" fill="white" />
            <circle cx="60" cy="45" r="8" fill="white" />
            <circle cx="58" cy="45" r="5" fill="#111827" />
            <circle cx="59" cy="44" r="2" fill="white" />
            <path d="M50 52 L45 57 L55 57 Z" fill="#fbbf24" />
          </svg>
        </div>

        {/* サービスロゴテキスト */}
        <div style={{
          textAlign: 'center',
          animation: 'fadeInUp 0.8s ease-out 0.3s both'
        }}>
          <h1 style={{
            ...getTypographyStyles('h1'),
            color: '#f3f4f6',
            letterSpacing: '-0.5px',
            marginBottom: '8px',
            fontSize: '32px', // Override for splash screen emphasis
            fontWeight: '800'  // Override for brand emphasis
          }}>
            MindCare
          </h1>
          <p style={{
            ...getTypographyStyles('large'),
            color: '#9ca3af',
            fontWeight: '500'
          }}>
            あなたの心の健康をサポート
          </p>
        </div>
      </div>

      {/* ローディングアニメーション */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        animation: 'fadeIn 0.5s ease-out 1s both'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#a3e635',
                borderRadius: '50%',
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}