// デイリーチャレンジシステムの型定義

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert'
export type ChallengeCategory = 'mindfulness' | 'gratitude' | 'exercise' | 'social' | 'reflection' | 'breathing' | 'creativity'

export interface DailyChallenge {
  id: string
  title: string
  description: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  xpReward: number
  bonusXp?: number // 初回完了ボーナス
  timeEstimate: string // "1分", "3分", "5分" など
  icon: string // emoji
  requiredStreak?: number // このチャレンジが表示される最小ストリーク日数
  unlockLevel?: number // このチャレンジが解放されるレベル
  completedToday?: boolean
  completedCount?: number // 過去に完了した回数
}

// 難易度別の設定
export const difficultyConfig = {
  easy: {
    color: '#65a30d',
    xpBase: 20,
    xpRange: [15, 30],
    timeRange: ['30秒', '1分', '2分'],
    vibrationPattern: [100], // 軽い振動
  },
  medium: {
    color: '#fbbf24',
    xpBase: 40,
    xpRange: [30, 50],
    timeRange: ['2分', '3分', '5分'],
    vibrationPattern: [100, 50, 100], // 中程度の振動
  },
  hard: {
    color: '#f97316',
    xpBase: 60,
    xpRange: [50, 80],
    timeRange: ['5分', '10分', '15分'],
    vibrationPattern: [200, 100, 200], // 強い振動
  },
  expert: {
    color: '#ef4444',
    xpBase: 100,
    xpRange: [80, 150],
    timeRange: ['10分', '15分', '20分'],
    vibrationPattern: [300, 100, 200, 100, 300], // 特別な振動パターン
  }
}

// カテゴリー別のチャレンジテンプレート
export const challengeTemplates: Record<ChallengeCategory, Partial<DailyChallenge>[]> = {
  mindfulness: [
    { title: '1分間の深呼吸', description: '静かな場所で1分間、ゆっくりと深呼吸をしましょう', icon: '🧘' },
    { title: '今この瞬間に集中', description: '5分間、今の感覚に意識を向けてみましょう', icon: '🎯' },
    { title: 'ボディスキャン瞑想', description: '体の各部分に順番に意識を向けていきます', icon: '🔍' },
    { title: '歩行瞑想', description: 'ゆっくりと歩きながら、一歩一歩に意識を向けます', icon: '🚶' },
  ],
  gratitude: [
    { title: '感謝の3つ', description: '今日感謝できることを3つ書き出しましょう', icon: '🙏' },
    { title: '誰かにありがとう', description: '大切な人に感謝のメッセージを送りましょう', icon: '💌' },
    { title: '小さな幸せ探し', description: '今日の小さな幸せを5つ見つけてみましょう', icon: '🌟' },
    { title: '自分への感謝', description: '自分自身の良いところを3つ挙げてみましょう', icon: '💝' },
  ],
  exercise: [
    { title: '軽いストレッチ', description: '2分間、体をゆっくりとストレッチしましょう', icon: '🤸' },
    { title: 'デスクヨガ', description: '座ったままできる簡単なヨガポーズを試しましょう', icon: '🪑' },
    { title: '階段を使う', description: '今日はエレベーターの代わりに階段を使いましょう', icon: '🏃' },
    { title: '5分間の散歩', description: '外に出て5分間散歩してみましょう', icon: '🚶‍♀️' },
  ],
  social: [
    { title: '誰かと話そう', description: '同僚や友人と短い会話を楽しみましょう', icon: '💬' },
    { title: '笑顔で挨拶', description: '出会う人に笑顔で挨拶してみましょう', icon: '😊' },
    { title: '褒め言葉を贈る', description: '誰かの良いところを見つけて褒めてみましょう', icon: '👏' },
    { title: 'ランチを一緒に', description: '誰かと一緒にランチを楽しみましょう', icon: '🍱' },
  ],
  reflection: [
    { title: '今日の振り返り', description: '今日一日を振り返って、良かったことを記録しましょう', icon: '📝' },
    { title: '明日の目標', description: '明日達成したい小さな目標を1つ決めましょう', icon: '🎯' },
    { title: '気持ちの整理', description: '今の気持ちを紙に書き出してみましょう', icon: '📋' },
    { title: '週の振り返り', description: '今週の成長を3つ挙げてみましょう', icon: '📊' },
  ],
  breathing: [
    { title: '4-7-8呼吸法', description: '4秒吸って、7秒止めて、8秒吐く呼吸法', icon: '💨' },
    { title: '腹式呼吸', description: 'お腹を使った深い呼吸を3分間行いましょう', icon: '🫁' },
    { title: '箱呼吸', description: '4-4-4-4のリズムで呼吸してみましょう', icon: '📦' },
    { title: 'リラックス呼吸', description: 'ゆっくりとした呼吸で心を落ち着けましょう', icon: '😌' },
  ],
  creativity: [
    { title: '1分間お絵かき', description: '何でもいいので1分間絵を描いてみましょう', icon: '🎨' },
    { title: '3行日記', description: '今日の出来事を3行で表現してみましょう', icon: '✍️' },
    { title: '写真を1枚', description: '今日の気分を表す写真を1枚撮りましょう', icon: '📸' },
    { title: 'アイデアメモ', description: '思いついたアイデアを3つメモしてみましょう', icon: '💡' },
  ]
}

// デイリーチャレンジを生成する関数
export function generateDailyChallenges(
  userLevel: number = 1,
  streakDays: number = 0,
  previousChallenges: string[] = []
): DailyChallenge[] {
  const challenges: DailyChallenge[] = []
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  
  // シード値を使った疑似ランダム生成（同じ日は同じチャレンジ）
  const random = (max: number) => {
    const x = Math.sin(seed) * 10000
    return Math.floor((x - Math.floor(x)) * max)
  }
  
  // カテゴリーをシャッフル
  const categories = Object.keys(challengeTemplates) as ChallengeCategory[]
  const shuffledCategories = [...categories].sort(() => random(2) - 1)
  
  // 難易度の分布を決定（レベルとストリークに基づく）
  const difficulties: ChallengeDifficulty[] = []
  if (userLevel < 5) {
    difficulties.push('easy', 'easy', 'medium')
  } else if (userLevel < 10) {
    difficulties.push('easy', 'medium', 'medium', 'hard')
  } else if (userLevel < 20) {
    difficulties.push('medium', 'medium', 'hard', 'hard')
  } else {
    difficulties.push('medium', 'hard', 'hard', 'expert')
  }
  
  // ストリークボーナス
  if (streakDays >= 7) {
    difficulties.push('expert')
  }
  
  // チャレンジを生成
  shuffledCategories.slice(0, 5).forEach((category, index) => {
    const templates = challengeTemplates[category]
    const template = templates[random(templates.length)]
    const difficulty = difficulties[Math.min(index, difficulties.length - 1)]
    const config = difficultyConfig[difficulty]
    
    const challenge: DailyChallenge = {
      id: `daily-${today.toISOString().split('T')[0]}-${index}`,
      title: template.title || '',
      description: template.description || '',
      category,
      difficulty,
      xpReward: config.xpBase + random(config.xpRange[1] - config.xpRange[0]),
      bonusXp: index === 0 ? 10 : undefined, // 最初のチャレンジにボーナス
      timeEstimate: config.timeRange[random(config.timeRange.length)],
      icon: template.icon || '🎯',
      completedToday: false,
      completedCount: 0
    }
    
    // レベル制限
    if (difficulty === 'expert' && userLevel < 15) {
      challenge.unlockLevel = 15
    } else if (difficulty === 'hard' && userLevel < 8) {
      challenge.unlockLevel = 8
    }
    
    challenges.push(challenge)
  })
  
  // ストリーク継続チャレンジ（特別）
  if (streakDays > 0 && streakDays % 7 === 6) {
    challenges.push({
      id: `streak-${today.toISOString().split('T')[0]}`,
      title: '🔥 ストリークを維持しよう！',
      description: '明日で7日連続達成！今日も忘れずにチェックイン',
      category: 'mindfulness',
      difficulty: 'medium',
      xpReward: 100,
      bonusXp: 50,
      timeEstimate: '1分',
      icon: '🔥',
      completedToday: false
    })
  }
  
  return challenges
}

// XP獲得時のアニメーション設定
export const xpAnimationConfig = {
  duration: 1500,
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  colors: {
    easy: '#65a30d',
    medium: '#fbbf24',
    hard: '#f97316',
    expert: '#ef4444'
  },
  particles: {
    count: 8,
    spread: 60,
    velocity: 15
  }
}

// レベルアップ閾値
export const levelThresholds = [
  0,     // Lv.1
  100,   // Lv.2
  250,   // Lv.3
  450,   // Lv.4
  700,   // Lv.5
  1000,  // Lv.6
  1400,  // Lv.7
  1900,  // Lv.8
  2500,  // Lv.9
  3200,  // Lv.10
  4000,  // Lv.11
  5000,  // Lv.12
  6200,  // Lv.13
  7600,  // Lv.14
  9200,  // Lv.15
  11000, // Lv.16
  13000, // Lv.17
  15500, // Lv.18
  18500, // Lv.19
  22000, // Lv.20
]

export function calculateLevel(totalXp: number): { level: number; currentXp: number; nextLevelXp: number; progress: number } {
  let level = 1
  let currentXp = totalXp
  
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (totalXp >= levelThresholds[i]) {
      level = i + 1
      currentXp = totalXp - levelThresholds[i]
      break
    }
  }
  
  const nextLevelXp = level < levelThresholds.length ? levelThresholds[level] - levelThresholds[level - 1] : 9999
  const progress = Math.min((currentXp / nextLevelXp) * 100, 100)
  
  return { level, currentXp, nextLevelXp, progress }
}