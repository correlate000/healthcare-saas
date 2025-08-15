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
  const [streakDays, setStreakDays] = useState(0)
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('luna')
  const [calculatedLevel, setCalculatedLevel] = useState(1)
  const [showXPAnimation, setShowXPAnimation] = useState(false)
  const [xpAnimationAmount, setXpAnimationAmount] = useState(0)
  const [rewardClaimed, setRewardClaimed] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedName = localStorage.getItem('userName') || ''
        setUserName(savedName)
        
        const streak = UserDataStorage.getStreak()
        if (streak > 0) {
          setWeeklyContinuation(streak)
          setStreakDays(streak)
        }
        
        const xp = UserDataStorage.getXP()
        if (xp > 0) {
          setTotalXP(xp)
          const levelData = calculateLevel(xp)
          setCalculatedLevel(levelData.level)
        }
        
        const savedCharacter = localStorage.getItem('selectedCharacter') as CharacterId
        if (savedCharacter) {
          setSelectedCharacter(savedCharacter)
        }
        
        const claimed = localStorage.getItem('7dayRewardClaimed')
        if (claimed === 'true') {
          setRewardClaimed(true)
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

  // Loading state
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
      paddingBottom: '80px'
    }}>
      <h1>Dashboard</h1>
      <MobileBottomNav />
    </div>
  )
}