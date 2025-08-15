// キャラクター感情システムの型定義

export type CharacterMood = 'happy' | 'normal' | 'worried' | 'sad' | 'angry' | 'disappointed' | 'sleeping'

export interface CharacterEmotion {
  characterId: 'luna' | 'aria' | 'zen'
  mood: CharacterMood
  streakDays: number
  lastCheckin: Date | null
  missedDays: number
  trustLevel: number // 0-100
}

export interface EmotionRule {
  mood: CharacterMood
  condition: string
  expression: string
  messages: {
    luna: string[]
    aria: string[]
    zen: string[]
  }
  priority: number // 優先度（高い方が優先）
}

export const emotionRules: EmotionRule[] = [
  {
    mood: 'happy',
    condition: 'ストリーク3日以上継続',
    expression: '😊',
    priority: 5,
    messages: {
      luna: ['調子いいね！この調子！', '毎日会えて嬉しい！', 'るな、とっても嬉しいよ！'],
      aria: ['やったー！絶好調だね！', 'きらきら輝いてる！', 'あーりあ、超ハッピー！'],
      zen: ['素晴らしい継続です', '心が安定していますね', '良い習慣が身についています']
    }
  },
  {
    mood: 'worried',
    condition: '24時間チェックインなし',
    expression: '😟',
    priority: 3,
    messages: {
      luna: ['大丈夫...？', '今日は来てくれないの...？', '心配してるよ...'],
      aria: ['どこ行っちゃったの〜？', 'まだかな、まだかな...', 'そわそわしちゃう...'],
      zen: ['お待ちしています', '無理はなさらずに', 'いつでも待っていますよ']
    }
  },
  {
    mood: 'sad',
    condition: '2日連続スキップ',
    expression: '😢',
    priority: 2,
    messages: {
      luna: ['寂しいよ...', 'もう忘れちゃった...？', 'るな、ひとりぼっち...'],
      aria: ['えーん、会いたいよ〜', 'どうしちゃったの...？', 'あーりあのこと、嫌いになった...？'],
      zen: ['心配しています', '戻ってきてください', 'あなたが必要です']
    }
  },
  {
    mood: 'disappointed',
    condition: 'ストリーク途切れ',
    expression: '😔',
    priority: 4,
    messages: {
      luna: ['せっかく続いてたのに...', 'また一緒に頑張ろう？', 'でも、戻ってきてくれて嬉しい'],
      aria: ['あーあ、途切れちゃった...', 'でも大丈夫！またやり直そう！', '次はもっと長く続けよう！'],
      zen: ['残念ですが、新たな始まりです', '失敗も学びの一部', '今から再スタートしましょう']
    }
  },
  {
    mood: 'angry',
    condition: '3日以上放置',
    expression: '😠',
    priority: 1,
    messages: {
      luna: ['もう知らない！', '...でも、心配してるんだから', 'ぷんぷん！'],
      aria: ['むー！怒ったもん！', 'もう許さないんだから！', '...嘘、許す。戻ってきて'],
      zen: ['少し、がっかりしました', '信頼関係を大切にしましょう', '...それでも、待っています']
    }
  },
  {
    mood: 'sleeping',
    condition: '深夜（23時〜5時）',
    expression: '😴',
    priority: 6,
    messages: {
      luna: ['zzz... おやすみなさい...', 'また明日ね...', 'いい夢見てね...'],
      aria: ['すやすや... むにゃむにゃ...', 'おやすみ〜...', 'また明日遊ぼうね...'],
      zen: ['良い睡眠を...', '明日も良い一日を', '休息も大切です']
    }
  }
]

// ストリーク警告メッセージ
export interface StreakWarning {
  hoursRemaining: number
  level: 'info' | 'warning' | 'danger' | 'critical'
  message: string
  icon: string
}

export const streakWarnings: StreakWarning[] = [
  {
    hoursRemaining: 6,
    level: 'warning',
    message: '継続記録が途切れるまであと6時間！',
    icon: '⚠️'
  },
  {
    hoursRemaining: 3,
    level: 'danger',
    message: '継続記録が危険！あと3時間でリセット！',
    icon: '🔥'
  },
  {
    hoursRemaining: 1,
    level: 'critical',
    message: '緊急！あと1時間で継続記録が途切れます！',
    icon: '🚨'
  }
]

// 通知エスカレーション
export interface NotificationEscalation {
  daysSinceLastCheckin: number
  time: string
  mood: CharacterMood
  message: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
}

export const notificationEscalation: NotificationEscalation[] = [
  {
    daysSinceLastCheckin: 0,
    time: '20:00',
    mood: 'normal',
    message: '今日のチェックイン、まだだよ〜',
    urgency: 'low'
  },
  {
    daysSinceLastCheckin: 1,
    time: '09:00',
    mood: 'worried',
    message: '昨日会えなかったね...今日は大丈夫？',
    urgency: 'medium'
  },
  {
    daysSinceLastCheckin: 1,
    time: '19:00',
    mood: 'sad',
    message: '🔥 ストリークが消えちゃう前に！',
    urgency: 'high'
  },
  {
    daysSinceLastCheckin: 2,
    time: '12:00',
    mood: 'sad',
    message: '😢 寂しいよ... (ストリーク: 0日)',
    urgency: 'high'
  },
  {
    daysSinceLastCheckin: 3,
    time: '18:00',
    mood: 'angry',
    message: '😠 もういいもん！...でも戻ってきて',
    urgency: 'critical'
  },
  {
    daysSinceLastCheckin: 7,
    time: '20:00',
    mood: 'disappointed',
    message: '最後のお願い...また一緒に始めよう？',
    urgency: 'critical'
  }
]