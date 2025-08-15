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
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { CharacterMood } from '@/components/CharacterMood'
import { StreakWarningBanner } from '@/components/StreakWarningBanner'
import { DailyChallenges } from '@/components/DailyChallenges'
import { CharacterSelector, type CharacterId } from '@/components/CharacterSelector'
import { NotificationManager, NotificationScheduler } from '@/utils/notifications'
import { calculateLevel } from '@/types/daily-challenge'

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [friendLevel, setFriendLevel] = useState(85)
  const [todayProgress, setTodayProgress] = useState(75)
  const [weeklyContinuation, setWeeklyContinuation] = useState(5)
  const [totalXP, setTotalXP] = useState(850)
  const [maxXP] = useState(1000)
  const [currentMood, setCurrentMood] = useState('happy')
  const [currentTime] = useState(new Date().getHours())
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([1, 2])
  const [lastCheckinDate, setLastCheckinDate] = useState<Date | null>(null)
  const [streakDays, setStreakDays] = useState(7)
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('luna')
  const [calculatedLevel, setCalculatedLevel] = useState(1)
  const [showXPAnimation, setShowXPAnimation] = useState(false)
  const [xpAnimationAmount, setXpAnimationAmount] = useState(0)
  const [rewardClaimed, setRewardClaimed] = useState(false)
  
  // Load data from localStorage using storage utility
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Load user name
        const savedName = localStorage.getItem('userName') || ''
        setUserName(savedName)
        
        // Load streak data
        const streak = UserDataStorage.getStreak()
        if (streak > 0) {
          setWeeklyContinuation(streak)
          setStreakDays(streak)
        }
        
        // Load XP data and calculate level
        const xp = UserDataStorage.getXP()
        if (xp > 0) {
          setTotalXP(xp)
          const levelData = calculateLevel(xp)
          setCalculatedLevel(levelData.level)
        }
        
        // Load selected character
        const savedCharacter = localStorage.getItem('selectedCharacter') as CharacterId
        if (savedCharacter) {
          setSelectedCharacter(savedCharacter)
        }
        
        // Load last checkin data for mood and date
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
          if (lastCheckin.date) {
            setLastCheckinDate(new Date(lastCheckin.date))
          }
        }
        
        // Check last checkin from storage as well
        const lastCheckinStr = UserDataStorage.getLastCheckin()
        if (lastCheckinStr) {
          const lastDate = new Date(lastCheckinStr)
          if (!isNaN(lastDate.getTime())) {
            setLastCheckinDate(lastDate)
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
        
        // Load reward claimed status - テスト用に常にfalseに設定
        // const claimed = localStorage.getItem('7dayRewardClaimed')
        // if (claimed === 'true') {
        //   setRewardClaimed(true)
        // }
        setRewardClaimed(false) // テスト用に常にリセット
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
  
  // 通知の初期化
  useEffect(() => {
    if (!isLoading) {
      // 通知許可をリクエスト
      NotificationManager.requestPermission().then(granted => {
        if (granted) {
          // 通知スケジューラーを開始
          NotificationScheduler.start(lastCheckinDate, streakDays)
        }
      })
    }
    
    return () => {
      NotificationScheduler.stop()
    }
  }, [isLoading, lastCheckinDate, streakDays])
  
  const todaysChallenges = [
    { id: 1, title: '朝の気分チェック', xp: 20, time: '1分', difficulty: '簡単' },
    { id: 2, title: '感謝の記録', xp: 30, time: '1分', difficulty: '簡単' },
    { id: 3, title: '3分間の深呼吸', xp: 40, time: '3分', difficulty: '簡単' },
    { id: 4, title: '夜の振り返り', xp: 25, time: '2分', difficulty: '簡単' },
  ]
  
  const getGreeting = () => {
    const namePrefix = userName ? `${userName}さん、` : ''
    if (currentTime < 5) return `${namePrefix}深夜ですね。良い休息を`
    if (currentTime < 11) return `${namePrefix}おはようございます`
    if (currentTime < 17) return `${namePrefix}こんにちは`
    if (currentTime < 21) return `${namePrefix}こんばんは`
    return `${namePrefix}お疲れ様でした`
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
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <LoadingSpinner size="large" message="ダッシュボードを読み込んでいます..." />
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
              color: '#0f172a',
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
              backgroundColor: 'rgba(15, 23, 42, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(15, 23, 42, 0.15)'
            }}>
              ✓
            </div>
            <span style={{ letterSpacing: '0.5px' }}>チェックイン</span>
            <span style={{ 
              ...getTypographyStyles('caption'), 
              color: 'rgba(15, 23, 42, 0.8)',
              fontWeight: '500'
            }}>
              今日の気分を記録
            </span>
          </button>
          <button
            onClick={() => router.push('/chat')}
            aria-label="キャラクターとチャット"
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
              backdropFilter: 'blur(10px)'
            }}>
              <BubbleIcon size={18} />
            </div>
            <span style={{ letterSpacing: '0.3px', fontSize: '14px', fontWeight: '600' }}>キャラクターと話す</span>
            <span style={{ 
              ...getTypographyStyles('caption'), 
              opacity: 0.9,
              fontWeight: '500',
              fontSize: '11px'
            }}>
              悩みを相談
            </span>
          </button>
        </div>
      </div>

      {/* ストリーク警告バナー */}
      <div style={{ padding: '24px 24px 0' }}>
        <StreakWarningBanner 
          lastCheckin={lastCheckinDate}
          onCheckinClick={() => router.push('/checkin')}
        />
      </div>

      {/* キャラクター感情表示 */}
      <div style={{ padding: '24px' }}>
        <CharacterMood 
          characterId={selectedCharacter}
          lastCheckin={lastCheckinDate}
          streakDays={streakDays}
          compact={true}
        />
        
        {/* キャラクター切り替え */}
        <div style={{ marginTop: '12px' }}>
          <CharacterSelector
            currentCharacterId={selectedCharacter}
            userLevel={calculatedLevel}
            onCharacterChange={setSelectedCharacter}
            compact={true}
          />
        </div>

        {/* フレンドレベル */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', marginBottom: '20px' }}>
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
          <span style={{ ...typographyPresets.activeText() }}>Lv.{calculatedLevel} {totalXP} XP</span>
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
                      <Check style={{ width: '14px', height: '14px', color: '#0f172a' }} />
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
        <DailyChallenges 
          onChallengeComplete={(challenge, xpEarned) => {
            // XPを更新
            const newXp = totalXP + xpEarned
            setTotalXP(newXp)
            UserDataStorage.setXP(newXp)
            
            // レベルを再計算
            const levelData = calculateLevel(newXp)
            setCalculatedLevel(levelData.level)
          }}
        />
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
                    color: '#0f172a',
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

      {/* 7日継続達成バナー - 常に表示 */}
      {true && (
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
              onClick={(e) => {
                if (rewardClaimed) return
                
                // バイブレーション（可能であれば）
                if ('vibrate' in navigator) {
                  navigator.vibrate([50, 30, 100])
                }
                
                // 報酬アニメーション
                const button = e.currentTarget as HTMLButtonElement
                
                // XPアニメーションを表示
                setXpAnimationAmount(200) // 7日継続報酬のXP
                setShowXPAnimation(true)
                
                // XPを実際に追加
                const newXp = totalXP + 200
                setTotalXP(newXp)
                UserDataStorage.setXP(newXp)
                
                // レベルを再計算
                const levelData = calculateLevel(newXp)
                setCalculatedLevel(levelData.level)
                
                // ボタンアニメーション
                button.style.animation = 'celebrate 0.5s ease-out'
                
                setTimeout(() => {
                  button.style.animation = ''
                  // テスト用にコメントアウト - 何度でもテストできるように
                  // setRewardClaimed(true)
                  // localStorage.setItem('7dayRewardClaimed', 'true')
                }, 500)
                
                // XPアニメーションを隠す
                setTimeout(() => {
                  setShowXPAnimation(false)
                }, 2000)
              }}
              style={{
                backgroundColor: rewardClaimed ? '#4b5563' : '#a3e635',
                color: rewardClaimed ? '#9ca3af' : '#0f172a',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: rewardClaimed ? 'default' : 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { 
                if (!rewardClaimed) {
                  e.currentTarget.style.backgroundColor = '#84cc16'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => { 
                if (!rewardClaimed) {
                  e.currentTarget.style.backgroundColor = rewardClaimed ? '#4b5563' : '#a3e635'
                  e.currentTarget.style.transform = 'scale(1)'
                }
              }}
            >
              {rewardClaimed ? '受け取り済み ✓' : '報酬を受け取る'}
            </button>
            
            {/* XP獲得アニメーション - シンプル美しいバージョン */}
            {showXPAnimation && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                animation: 'simpleXpFloat 2s ease-out forwards',
                zIndex: 100
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  color: '#0f172a',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '20px',
                  fontWeight: '700',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  boxShadow: '0 8px 32px rgba(163, 230, 53, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  animation: 'gentlePulse 0.4s ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <span style={{ fontSize: '22px' }}>⭐</span>
                  <span>+{xpAnimationAmount} XP</span>
                </div>
                
                {/* シンプルなパーティクル */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#a3e635',
                        borderRadius: '50%',
                        animation: `simpleParticle${i % 3} 1.5s ease-out forwards`,
                        animationDelay: `${i * 0.1}s`,
                        opacity: 0.7
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
        
        @keyframes simpleXpFloat {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(10px) scale(0.8);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0) scale(1.05);
          }
          85% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(-30px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-50px) scale(0.9);
          }
        }
        
        @keyframes gentlePulse {
          0% {
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes particle0 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(60px, 0px) scale(0); opacity: 0; }
        }
        @keyframes particle1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(42px, 42px) scale(0); opacity: 0; }
        }
        @keyframes particle2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0px, 60px) scale(0); opacity: 0; }
        }
        @keyframes particle3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-42px, 42px) scale(0); opacity: 0; }
        }
        @keyframes particle4 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-60px, 0px) scale(0); opacity: 0; }
        }
        @keyframes particle5 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-42px, -42px) scale(0); opacity: 0; }
        }
        @keyframes particle6 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0px, -60px) scale(0); opacity: 0; }
        }
        @keyframes particle7 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(42px, -42px) scale(0); opacity: 0; }
        }
        
        @keyframes enhancedParticle0 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          50% { transform: translate(80px, -20px) scale(1.2) rotate(180deg); opacity: 0.8; }
          100% { transform: translate(120px, -60px) scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes enhancedParticle1 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          50% { transform: translate(60px, 60px) scale(1.1) rotate(180deg); opacity: 0.8; }
          100% { transform: translate(100px, 100px) scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes enhancedParticle2 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          50% { transform: translate(-20px, 80px) scale(1.3) rotate(180deg); opacity: 0.8; }
          100% { transform: translate(-40px, 120px) scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes enhancedParticle3 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          50% { transform: translate(-60px, 40px) scale(1.0) rotate(180deg); opacity: 0.8; }
          100% { transform: translate(-100px, 80px) scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes enhancedParticle4 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          50% { transform: translate(-80px, -30px) scale(1.4) rotate(180deg); opacity: 0.8; }
          100% { transform: translate(-120px, -80px) scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes enhancedParticle5 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          50% { transform: translate(-40px, -70px) scale(1.1) rotate(180deg); opacity: 0.8; }
          100% { transform: translate(-80px, -120px) scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes enhancedParticle6 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          50% { transform: translate(30px, -80px) scale(1.2) rotate(180deg); opacity: 0.8; }
          100% { transform: translate(60px, -140px) scale(0) rotate(360deg); opacity: 0; }
        }
        @keyframes enhancedParticle7 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          50% { transform: translate(70px, -50px) scale(1.3) rotate(180deg); opacity: 0.8; }
          100% { transform: translate(110px, -100px) scale(0) rotate(360deg); opacity: 0; }
        }
        
        @keyframes simpleParticle0 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          100% { transform: translate(40px, -20px) scale(0); opacity: 0; }
        }
        @keyframes simpleParticle1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          100% { transform: translate(-30px, -30px) scale(0); opacity: 0; }
        }
        @keyframes simpleParticle2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          100% { transform: translate(20px, -40px) scale(0); opacity: 0; }
        }
      `}</style>

      {/* ボトムナビゲーション */}
      <MobileBottomNav />
    </div>
  )
}