// バッジ・実績システムの型定義

export type AchievementCategory = 'streak' | 'level' | 'challenge' | 'social' | 'special' | 'milestone'
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  id: string
  title: string
  description: string
  category: AchievementCategory
  rarity: AchievementRarity
  icon: string
  unlockedAt?: Date
  progress?: number // 0-100
  maxProgress?: number
  xpReward: number
  hidden?: boolean // 隠し実績
  requirement?: string // 解放条件の説明
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  level: number // バッジのレベル（銅、銀、金、プラチナ）
  category: AchievementCategory
  unlockedAt?: Date
}

// レアリティ設定
export const rarityConfig = {
  common: {
    color: '#9ca3af',
    xpMultiplier: 1,
    vibrationPattern: [50]
  },
  rare: {
    color: '#60a5fa',
    xpMultiplier: 1.5,
    vibrationPattern: [100, 50, 100]
  },
  epic: {
    color: '#a78bfa',
    xpMultiplier: 2,
    vibrationPattern: [150, 50, 150, 50, 150]
  },
  legendary: {
    color: '#fbbf24',
    xpMultiplier: 3,
    vibrationPattern: [200, 100, 200, 100, 200, 100]
  }
}

// 実績定義
export const achievementDefinitions: Achievement[] = [
  // ストリーク実績
  {
    id: 'streak-3',
    title: '3日連続',
    description: '3日連続でチェックイン',
    category: 'streak',
    rarity: 'common',
    icon: '🔥',
    xpReward: 50,
    maxProgress: 3
  },
  {
    id: 'streak-7',
    title: '1週間継続',
    description: '7日連続でチェックイン',
    category: 'streak',
    rarity: 'rare',
    icon: '🔥',
    xpReward: 150,
    maxProgress: 7
  },
  {
    id: 'streak-30',
    title: '月間マスター',
    description: '30日連続でチェックイン',
    category: 'streak',
    rarity: 'epic',
    icon: '🔥',
    xpReward: 500,
    maxProgress: 30
  },
  {
    id: 'streak-100',
    title: '伝説の継続者',
    description: '100日連続でチェックイン',
    category: 'streak',
    rarity: 'legendary',
    icon: '🔥',
    xpReward: 2000,
    maxProgress: 100
  },
  
  // レベル実績
  {
    id: 'level-5',
    title: '初心者卒業',
    description: 'レベル5に到達',
    category: 'level',
    rarity: 'common',
    icon: '⭐',
    xpReward: 100,
    requirement: 'レベル5'
  },
  {
    id: 'level-10',
    title: '中級者',
    description: 'レベル10に到達',
    category: 'level',
    rarity: 'rare',
    icon: '⭐',
    xpReward: 300,
    requirement: 'レベル10'
  },
  {
    id: 'level-20',
    title: '上級者',
    description: 'レベル20に到達',
    category: 'level',
    rarity: 'epic',
    icon: '⭐',
    xpReward: 1000,
    requirement: 'レベル20'
  },
  
  // チャレンジ実績
  {
    id: 'challenge-10',
    title: 'チャレンジャー',
    description: '累計10個のチャレンジを完了',
    category: 'challenge',
    rarity: 'common',
    icon: '🎯',
    xpReward: 75,
    maxProgress: 10
  },
  {
    id: 'challenge-50',
    title: 'チャレンジマスター',
    description: '累計50個のチャレンジを完了',
    category: 'challenge',
    rarity: 'rare',
    icon: '🎯',
    xpReward: 250,
    maxProgress: 50
  },
  {
    id: 'challenge-perfect-week',
    title: '完璧な1週間',
    description: '1週間毎日全てのチャレンジを完了',
    category: 'challenge',
    rarity: 'epic',
    icon: '💯',
    xpReward: 400,
    hidden: true
  },
  
  // ソーシャル実績
  {
    id: 'social-first-share',
    title: '初めての共有',
    description: '初めて成果を共有',
    category: 'social',
    rarity: 'common',
    icon: '📢',
    xpReward: 50
  },
  {
    id: 'social-helper',
    title: 'サポーター',
    description: '他のユーザーを10回応援',
    category: 'social',
    rarity: 'rare',
    icon: '🤝',
    xpReward: 200,
    maxProgress: 10
  },
  
  // マイルストーン実績
  {
    id: 'milestone-1000-xp',
    title: 'XPコレクター',
    description: '累計1000XPを獲得',
    category: 'milestone',
    rarity: 'common',
    icon: '💎',
    xpReward: 100,
    maxProgress: 1000
  },
  {
    id: 'milestone-10000-xp',
    title: 'XPマスター',
    description: '累計10000XPを獲得',
    category: 'milestone',
    rarity: 'epic',
    icon: '💎',
    xpReward: 1000,
    maxProgress: 10000
  },
  
  // 特別実績（隠し）
  {
    id: 'special-early-bird',
    title: '早起き鳥',
    description: '7日連続で朝6時前にチェックイン',
    category: 'special',
    rarity: 'rare',
    icon: '🌅',
    xpReward: 300,
    hidden: true
  },
  {
    id: 'special-night-owl',
    title: '夜型人間',
    description: '7日連続で夜10時以降にチェックイン',
    category: 'special',
    rarity: 'rare',
    icon: '🦉',
    xpReward: 300,
    hidden: true
  },
  {
    id: 'special-comeback',
    title: 'カムバック',
    description: '7日以上の休止後に復帰',
    category: 'special',
    rarity: 'epic',
    icon: '🎊',
    xpReward: 500,
    hidden: true
  }
]

// バッジ定義
export const badgeDefinitions: Badge[] = [
  // ストリークバッジ
  {
    id: 'badge-streak-bronze',
    name: '継続の銅バッジ',
    description: '7日ストリーク達成',
    icon: '🥉',
    color: '#cd7f32',
    level: 1,
    category: 'streak'
  },
  {
    id: 'badge-streak-silver',
    name: '継続の銀バッジ',
    description: '30日ストリーク達成',
    icon: '🥈',
    color: '#c0c0c0',
    level: 2,
    category: 'streak'
  },
  {
    id: 'badge-streak-gold',
    name: '継続の金バッジ',
    description: '100日ストリーク達成',
    icon: '🥇',
    color: '#ffd700',
    level: 3,
    category: 'streak'
  },
  {
    id: 'badge-streak-platinum',
    name: '継続のプラチナバッジ',
    description: '365日ストリーク達成',
    icon: '💎',
    color: '#e5e4e2',
    level: 4,
    category: 'streak'
  }
]

// 実績の進捗を計算
export function calculateAchievementProgress(
  achievementId: string,
  userData: {
    streakDays?: number
    level?: number
    totalXp?: number
    completedChallenges?: number
    [key: string]: any
  }
): number {
  const achievement = achievementDefinitions.find(a => a.id === achievementId)
  if (!achievement || !achievement.maxProgress) return 0
  
  switch (achievement.category) {
    case 'streak':
      return Math.min((userData.streakDays || 0) / achievement.maxProgress * 100, 100)
    case 'level':
      return userData.level >= parseInt(achievement.requirement?.replace('レベル', '') || '0') ? 100 : 0
    case 'challenge':
      return Math.min((userData.completedChallenges || 0) / achievement.maxProgress * 100, 100)
    case 'milestone':
      if (achievement.id.includes('xp')) {
        return Math.min((userData.totalXp || 0) / achievement.maxProgress * 100, 100)
      }
      return 0
    default:
      return 0
  }
}

// 新しい実績を確認
export function checkForNewAchievements(
  userData: any,
  unlockedAchievements: string[]
): Achievement[] {
  const newAchievements: Achievement[] = []
  
  achievementDefinitions.forEach(achievement => {
    if (unlockedAchievements.includes(achievement.id)) return
    
    const progress = calculateAchievementProgress(achievement.id, userData)
    if (progress >= 100) {
      newAchievements.push({
        ...achievement,
        unlockedAt: new Date(),
        progress: 100
      })
    }
  })
  
  return newAchievements
}