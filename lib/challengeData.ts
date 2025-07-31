// Shared daily challenge data structure - connects dashboard and daily challenge pages
export interface DailyChallenge {
  id: string
  title: string
  category: '簡単' | '普通' | '難しい'
  description: string
  timeEstimate: string
  xp: number
  completed: boolean
}

export interface ChallengeData {
  todayMessage: string
  currentStreak: number
  completedToday: number
  totalToday: number
  todayXP: number
  totalXP: number
  todayProgress: number
  date: string
  dailyChallenges: DailyChallenge[]
  completedChallenges: Array<{
    id: string
    title: string
    xp: number
  }>
  streakBonus: {
    message: string
    xp: number
  }
}

// Exact wireframe page 23 challenge data
export const wireframeChallengeData: ChallengeData = {
  todayMessage: '毎日の積み重ねで心の健康を',
  currentStreak: 7,
  completedToday: 1,
  totalToday: 4,
  todayXP: 32,
  totalXP: 2840,
  todayProgress: 25, // 1/4 completed = 25%
  date: '2025年6月19日',
  dailyChallenges: [
    { 
      id: 'mood-check', 
      title: '朝の気分チェック', 
      category: '簡単', 
      completed: true, 
      xp: 20, 
      timeEstimate: '1分', 
      description: '今日の気分を3つの絵文字で表現してみましょう' 
    },
    { 
      id: 'gratitude-1', 
      title: '感謝の記録', 
      category: '簡単', 
      completed: false, 
      xp: 30, 
      timeEstimate: '1分', 
      description: '今日感謝したい小さなことを3つ見つけてみましょう' 
    },
    { 
      id: 'gratitude-2', 
      title: '感謝の記録', 
      category: '簡単', 
      completed: false, 
      xp: 30, 
      timeEstimate: '1分', 
      description: '今日感謝したい小さなことを3つ見つけてみましょう' 
    },
    { 
      id: 'breathing', 
      title: '3分間の深呼吸', 
      category: '簡単', 
      completed: false, 
      xp: 40, 
      timeEstimate: '3分', 
      description: 'ガイド付きで3分間のマインドフルネスを体験しましょう' 
    }
  ],
  completedChallenges: [
    { id: 'work-reflection', title: '仕事の振り返り', xp: 30 }
  ],
  streakBonus: {
    message: '7日連続でチャレンジを達成中！素晴らしい！',
    xp: 2
  }
}

// Calculate dashboard metrics from challenge data
export const getDashboardMetrics = (challengeData: ChallengeData) => {
  return {
    completedTasks: challengeData.completedToday,
    totalTasks: challengeData.totalToday,
    progressPercentage: challengeData.todayProgress,
    challenges: challengeData.dailyChallenges.slice(0, 3), // Show first 3 on dashboard
    todayXP: challengeData.todayXP,
    currentStreak: challengeData.currentStreak
  }
}