'use client'
import '../globals.css'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { Check } from 'lucide-react'
import { HappyFaceIcon, FireIcon, StarIcon, EnergyIcon, MoonIcon, BubbleIcon } from '@/components/icons/illustrations'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { UserDataStorage } from '@/utils/storage'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [friendLevel, setFriendLevel] = useState(85)
  const [todayProgress, setTodayProgress] = useState(75)
  const [weeklyContinuation, setWeeklyContinuation] = useState(5)
  const [totalXP, setTotalXP] = useState(850)
  const [maxXP] = useState(1000)
  const [currentMood, setCurrentMood] = useState('happy')
  const [currentTime] = useState(new Date().getHours())
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([1, 2])
  
  // Load data from localStorage using storage utility
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Load streak data
        const streak = UserDataStorage.getStreak()
        if (streak > 0) {
          setWeeklyContinuation(streak)
        }
        
        // Load XP data
        const xp = UserDataStorage.getXP()
        if (xp > 0) {
          setTotalXP(xp)
        }
        
        // Load last checkin data for mood
        const checkins = UserDataStorage.getCheckinData()
        if (checkins.length > 0) {
          const lastCheckin = checkins[checkins.length - 1]
          if (lastCheckin.mood) {
            const moodMap: { [key: string]: string } = {
              '素晴らしい': 'happy',
              'いい感じ': 'happy',
              '普通': 'neutral',
              '疲れた': 'tired',
              'つらい': 'sad'
            }
            setCurrentMood(moodMap[lastCheckin.mood] || 'neutral')
          }
        }
        
        // Load friend level
        const level = UserDataStorage.getFriendLevel()
        if (level > 0) {
          setFriendLevel(level)
        }
        
        // Load today's progress
        const progressData = UserDataStorage.getTodayProgress()
        if (progressData) {
          const today = new Date().toDateString()
          if (progressData.date === today) {
            setTodayProgress(progressData.value)
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    const timer = setTimeout(() => {
      loadUserData()
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])
  
  // 今日の優しいメッセージをランダム取得
  const getTodaysMessage = () => {
    const messages = [
      {
        message: '今日も一歩ずつで大丈夫。小さな進歩も立派な成長です。',
        subMessage: 'あなたのペースが、一番いいペースです。',
        color: '#60a5fa',
        icon: FireIcon
      },
      {
        message: 'うまくいかない日もありますね。でも、それも大切な経験の一つ。',
        subMessage: '休むことも、前に進むための大切な準備です。',
        color: '#a3e635',
        icon: StarIcon
      },
      {
        message: '昨日より今日、少しでも笑顔になれたらそれで十分です。',
        subMessage: '小さな幸せを見つける力が、あなたにはあります。',
        color: '#fbbf24',
        icon: EnergyIcon
      },
      {
        message: '深呼吸してみましょう。今この瞬間を大切に過ごせばいいんです。',
        subMessage: '焦らなくて大丈夫。あなたのタイミングがきっと来ます。',
        color: '#8b5cf6',
        icon: MoonIcon
      },
      {
        message: '今日の自分を褒めてあげてください。頑張っているあなたは素敵です。',
        subMessage: '完璧じゃなくていい。今のあなたで十分素晴らしいです。',
        color: '#10b981',
        icon: BubbleIcon
      },
      {
        message: '疲れたら休んでいいんです。自分に優しくすることも勇気です。',
        subMessage: '無理をしない選択も、賢い選択です。',
        color: '#ec4899',
        icon: FireIcon
      },
      {
        message: '今日という日は二度と来ません。だから、今を楽しんでくださいね。',
        subMessage: '小さな喜びを積み重ねて、素敵な一日にしましょう。',
        color: '#f97316',
        icon: StarIcon
      }
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  const todaysOracle = getTodaysMessage()

  const todaysChallenges = [
    { id: 1, title: '朝の気分チェック', xp: 20, time: '1分', difficulty: '簡単' },
    { id: 2, title: '感謝の記録', xp: 30, time: '1分', difficulty: '簡単' },
    { id: 3, title: '3分間の深呼吸', xp: 40, time: '3分', difficulty: '簡単' },
    { id: 4, title: '夜の振り返り', xp: 25, time: '2分', difficulty: '簡単' },
  ]
  
  const getGreeting = () => {
    if (currentTime < 5) return '深夜ですね。良い休息を'
    if (currentTime < 11) return 'おはようございます'
    if (currentTime < 17) return 'こんにちは'
    if (currentTime < 21) return 'こんばんは'
    return 'お疲れ様でした'
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case '簡単': return '#65a30d'
      case '普通': return '#fbbf24'
      case '難しい': return '#ef4444'
      default: return '#65a30d'
    }
  }

  const achievements = [
    { id: 1, title: '7日継続達成！', icon: FireIcon, new: true },
    { id: 2, title: 'Lunaとのフレンドレベルアップ', icon: EnergyIcon, new: true },
    { id: 3, title: 'チーム投稿が10いいね！', icon: HappyFaceIcon, new: false },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#111827', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#a3e635',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#111827',
              borderRadius: '50%'
            }}></div>
          </div>
        </div>
        <p style={{ ...getTypographyStyles('base'), color: '#9ca3af' }}>読み込み中...</p>
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* ヘッダー */}
      <div style={{ 
        padding: '24px',
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ ...typographyPresets.pageTitle(), letterSpacing: '-0.5px' }}>
              {getGreeting()}
            </h1>
            <p style={{ ...typographyPresets.subText(), margin: 0 }}>
              今日も一歩ずつ前進しましょう
            </p>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#374151',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HappyFaceIcon size={24} />
          </div>
        </div>
        
        {/* クイックアクションボタン */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => router.push('/checkin')}
            aria-label="今日の気分をチェックイン"
            style={{
              flex: '1 1 calc(50% - 6px)',
              minWidth: '140px',
              padding: '20px 16px',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#111827',
              border: 'none',
              borderRadius: '16px',
              ...getTypographyStyles('base'),
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 8px 24px rgba(163, 230, 53, 0.25)',
              transform: 'translateY(0)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(163, 230, 53, 0.35)'
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(163, 230, 53, 0.25)'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              backdropFilter: 'blur(10px)'
            }}>
              ✓
            </div>
            <span style={{ letterSpacing: '0.5px' }}>チェックイン</span>
            <span style={{ 
              ...getTypographyStyles('caption'), 
              opacity: 0.8,
              fontWeight: '500'
            }}>
              今日の気分を記録
            </span>
          </button>
          <button
            onClick={() => router.push('/chat')}
            aria-label="AIキャラクターとチャット"
            style={{
              flex: '1 1 calc(50% - 6px)',
              minWidth: '140px',
              padding: '20px 16px',
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              ...getTypographyStyles('base'),
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 8px 24px rgba(96, 165, 250, 0.25)',
              transform: 'translateY(0)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(96, 165, 250, 0.35)'
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(96, 165, 250, 0.25)'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              backdropFilter: 'blur(10px)'
            }}>
              💬
            </div>
            <span style={{ letterSpacing: '0.5px' }}>AIキャラと話す</span>
            <span style={{ 
              ...getTypographyStyles('caption'), 
              opacity: 0.9,
              fontWeight: '500'
            }}>
              悩みを相談しよう
            </span>
          </button>
        </div>
      </div>

      {/* ヘッダー部分 - キャラクターとメッセージ */}
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
          {/* キャラクターアイコン - 鳥のSVG */}
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: '#374151', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative'
          }}>
            <svg width="60" height="60" viewBox="0 0 100 100" style={{ display: 'block' }}>
              <ellipse cx="50" cy="55" rx="30" ry="33" fill="#a3e635" />
              <ellipse cx="50" cy="60" rx="22" ry="25" fill="#ecfccb" />
              <ellipse cx="28" cy="50" rx="12" ry="20" fill="#a3e635" transform="rotate(-20 28 50)" />
              <ellipse cx="72" cy="50" rx="12" ry="20" fill="#a3e635" transform="rotate(20 72 50)" />
              <circle cx="40" cy="45" r="6" fill="white" />
              <circle cx="42" cy="45" r="4" fill="#111827" />
              <circle cx="60" cy="45" r="6" fill="white" />
              <circle cx="58" cy="45" r="4" fill="#111827" />
              <path d="M50 50 L45 55 L55 55 Z" fill="#fbbf24" />
            </svg>
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '24px',
              height: '24px',
              backgroundColor: '#a3e635',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...getTypographyStyles('small'),
              border: '2px solid #111827'
            }}>
              💚
            </div>
          </div>
          
          {/* メッセージ吹き出し */}
          <div style={{ 
            flex: 1, 
            backgroundColor: '#374151', 
            borderRadius: '12px', 
            padding: '16px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '-8px',
              top: '20px',
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '8px solid #374151'
            }}></div>
            <p style={{ ...typographyPresets.bodyText(), color: '#e5e7eb', margin: 0 }}>
              今日もよく頑張っていますね！{todayProgress}%の達成率、素晴らしいです。
              {todayProgress < 100 ? 'もう少しで今日の目標達成です。' : '今日の目標を達成しました！'}
              無理せず、自分のペースで進みましょう。
            </p>
          </div>
        </div>

        {/* フレンドレベル */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ ...typographyPresets.subText() }}>フレンドレベル {friendLevel}</span>
          <div style={{ 
            flex: 1, 
            margin: '0 12px', 
            height: '6px', 
            backgroundColor: '#374151', 
            borderRadius: '3px', 
            position: 'relative' 
          }}>
            <div style={{ 
              position: 'absolute', 
              height: '100%', 
              width: `${(totalXP / maxXP) * 100}%`, 
              backgroundColor: '#a3e635', 
              borderRadius: '3px' 
            }}></div>
          </div>
          <span style={{ ...typographyPresets.activeText() }}>Lv.8 {totalXP}/{maxXP} XP</span>
        </div>
      </div>

      {/* 今日の運勢・オラクル */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ 
          background: `linear-gradient(135deg, #1f2937 0%, rgba(${todaysOracle.color === '#ef4444' ? '239, 68, 68' : todaysOracle.color === '#a855f7' ? '168, 85, 247' : todaysOracle.color === '#dc2626' ? '220, 38, 38' : todaysOracle.color === '#0ea5e9' ? '14, 165, 233' : '5, 150, 105'}, 0.1) 100%)`,
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          border: `1px solid ${todaysOracle.color}30`,
          boxShadow: `0 8px 32px ${todaysOracle.color}20`
        }}>
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '24px',
            backgroundColor: todaysOracle.color,
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>
            TODAY'S MESSAGE
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginTop: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <todaysOracle.icon size={48} />
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ 
                ...getTypographyStyles('large'), 
                color: '#f3f4f6', 
                marginBottom: '12px', 
                margin: '0 0 12px 0', 
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                {todaysOracle.message}
              </p>
              
              <p style={{ 
                ...getTypographyStyles('base'), 
                color: todaysOracle.color, 
                margin: '0 0 16px 0',
                fontStyle: 'italic',
                fontWeight: '600'
              }}>
                {todaysOracle.subMessage}
              </p>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '8px 0'
              }}>
                <div style={{
                  width: '4px',
                  height: '20px',
                  backgroundColor: todaysOracle.color,
                  borderRadius: '2px'
                }}></div>
                <span style={{ 
                  ...getTypographyStyles('small'), 
                  color: '#9ca3af',
                  letterSpacing: '0.5px'
                }}>
                  今日のあなたへ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 今週の記録 */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          padding: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={() => router.push('/analytics')}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>今週の記録</h3>
          
          {/* 今日の達成度 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>今日の達成度</span>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>2/4 タスク完了</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#374151', borderRadius: '4px', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                height: '100%', 
                width: `${todayProgress}%`, 
                backgroundColor: '#a3e635', 
                borderRadius: '4px' 
              }}></div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>{todayProgress}%</span>
            </div>
          </div>

          {/* 継続日数 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>継続日数</span>
              <span style={{ fontSize: '16px', color: '#a3e635', fontWeight: '600' }}>12日</span>
            </div>
          </div>

          {/* 今週のチェックイン */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>今週のチェックイン</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['月', '火', '水', '木', '金', '土', '日'].map((day, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>{day}</span>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: index < weeklyContinuation ? '#a3e635' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: index === weeklyContinuation ? '2px solid #a3e635' : 'none'
                    }}
                  >
                    {index < weeklyContinuation && (
                      <Check style={{ width: '14px', height: '14px', color: '#111827' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '12px' }}>
            <span style={{ fontSize: '14px', color: '#a3e635', fontWeight: '600' }}>{weeklyContinuation}/7日達成</span>
          </div>
        </div>
      </div>

      {/* 今日のチャレンジ */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>今日のチャレンジ</h3>
            <span style={{ fontSize: '14px', color: '#a3e635', fontWeight: '600' }}>
              {completedChallenges.length}/{todaysChallenges.length}
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px'
          }}>
            {todaysChallenges.map((challenge, index) => {
              const isCompleted = completedChallenges.includes(challenge.id)
              
              return (
                <div
                  key={challenge.id}
                  id={`challenge-${challenge.id}`}
                  onClick={(e) => {
                    if (!isCompleted) {
                      // Complete challenge with animation
                      setCompletedChallenges([...completedChallenges, challenge.id])
                      
                      // Smooth scroll to next incomplete challenge
                      setTimeout(() => {
                        const nextChallenge = todaysChallenges.find(
                          c => !completedChallenges.includes(c.id) && c.id !== challenge.id && c.id > challenge.id
                        )
                        if (nextChallenge) {
                          const element = document.getElementById(`challenge-${nextChallenge.id}`)
                          element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                      }, 500)
                      
                      // Show XP animation
                      const xpElement = document.createElement('div')
                      xpElement.style.cssText = `
                        position: fixed;
                        top: ${e.clientY}px;
                        left: ${e.clientX}px;
                        color: #a3e635;
                        font-size: 20px;
                        font-weight: 700;
                        pointer-events: none;
                        z-index: 9999;
                        animation: floatUp 1.5s ease-out forwards;
                      `
                      xpElement.textContent = `+${challenge.xp} XP`
                      document.body.appendChild(xpElement)
                      setTimeout(() => xpElement.remove(), 1500)
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: isCompleted ? '#374151' : '#4b5563',
                    cursor: !isCompleted ? 'pointer' : 'default',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCompleted) {
                      e.currentTarget.style.backgroundColor = '#60a5fa20'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCompleted) {
                      e.currentTarget.style.backgroundColor = '#4b5563'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: `2px solid ${isCompleted ? '#a3e635' : '#6b7280'}`,
                        backgroundColor: isCompleted ? '#a3e635' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: isCompleted ? 'scale(1)' : 'scale(0.9)'
                      }}
                    >
                      {isCompleted && (
                        <Check style={{ 
                          width: '14px', 
                          height: '14px', 
                          color: '#111827',
                          animation: 'checkMark 0.4s ease-out'
                        }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '15px',
                          color: isCompleted ? '#9ca3af' : '#e5e7eb',
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}>
                          {challenge.title}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          backgroundColor: getDifficultyColor(challenge.difficulty),
                          color: 'white',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontWeight: '500'
                        }}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          +{challenge.xp} XP
                        </span>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          ⏱ {challenge.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isCompleted && (
                    <span style={{
                      ...getTypographyStyles('small'),
                      backgroundColor: '#a3e635',
                      color: '#111827',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      完了
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 最近の実績 */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          padding: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={() => router.push('/achievements')}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>最近の実績</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#374151'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
                    <achievement.icon size={20} />
                  </div>
                  <span style={{ fontSize: '14px', color: '#d1d5db', fontWeight: '500' }}>{achievement.title}</span>
                </div>
                {achievement.new && (
                  <span style={{
                    ...getTypographyStyles('small'),
                    backgroundColor: '#a3e635',
                    color: '#111827',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 今週の記録サマリー */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>今週の記録</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>85%</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>エネルギー</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>78%</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>幸福度</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>4/5</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>週間目標</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7日継続達成バナー */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          padding: '20px', 
          textAlign: 'center',
          border: '2px solid #a3e635',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* アニメーション背景 */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite'
          }}></div>
          
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '8px',
            animation: 'bounce 1.5s ease-in-out infinite',
            position: 'relative'
          }}>🏆</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#a3e635', margin: '0 0 8px 0', position: 'relative' }}>7日継続達成！</h3>
          <p style={{ fontSize: '14px', color: '#d1d5db', margin: '0 0 16px 0', position: 'relative' }}>新しいバッジと限定スタンプをゲット！</p>
          <button 
            onClick={() => {
              // 報酬アニメーション
              const button = event?.currentTarget as HTMLElement
              if (button) {
                button.style.animation = 'celebrate 0.5s ease-out'
                setTimeout(() => {
                  button.style.animation = ''
                  button.textContent = '受け取り済み ✓'
                  button.style.backgroundColor = '#4b5563'
                  button.style.cursor = 'default'
                }, 500)
              }
            }}
            style={{
              backgroundColor: '#a3e635',
              color: '#111827',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { 
              if (e.currentTarget.textContent !== '受け取り済み ✓') {
                e.currentTarget.style.backgroundColor = '#84cc16'
                e.currentTarget.style.transform = 'scale(1.05)'
              }
            }}
            onMouseLeave={(e) => { 
              if (e.currentTarget.textContent !== '受け取り済み ✓') {
                e.currentTarget.style.backgroundColor = '#a3e635'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
          >
            報酬を受け取る
          </button>
        </div>
        
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes celebrate {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          
          @keyframes mysticalGlow {
            0%, 100% {
              filter: drop-shadow(0 0 5px currentColor);
              transform: scale(1);
            }
            50% {
              filter: drop-shadow(0 0 20px currentColor);
              transform: scale(1.05);
            }
          }
          
          @keyframes completeChallenge {
            0% {
              transform: scale(1);
              backgroundColor: #4b5563;
            }
            50% {
              transform: scale(1.05);
              backgroundColor: #a3e63530;
            }
            100% {
              transform: scale(1);
              backgroundColor: #374151;
            }
          }
          
          @keyframes checkMark {
            0% {
              transform: scale(0) rotate(-45deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.2) rotate(0deg);
            }
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
          }
          
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
          
          @keyframes floatUp {
            0% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateY(-60px) scale(1.2);
              opacity: 0;
            }
          }
        `}</style>
      </div>

      {/* ボトムナビゲーション */}
      <MobileBottomNav />
    </div>
  )
}