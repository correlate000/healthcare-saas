// AI個別最適化デイリーチャレンジシステム

export interface UserProfile {
  preferredCategories: string[]
  completionRates: Map<string, number>
  timeOfDayPreference: string[]
  difficultyLevel: 'easy' | 'medium' | 'hard'
  stressLevel: number
  energyLevel: number
  recentActivities: string[]
  goals: string[]
}

export interface OptimizedChallenge {
  id: string
  category: string
  title: string
  description: string
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  xp: number
  personalizedReason: string
  successProbability: number
  recommendedTime: string
  adaptiveSteps: string[]
}

export class AIChallengeOptimizer {
  private static instance: AIChallengeOptimizer
  private userProfile: UserProfile
  private completionHistory: Map<string, number[]> = new Map()
  
  private constructor() {
    this.loadUserProfile()
    this.analyzeUserBehavior()
  }

  static getInstance(): AIChallengeOptimizer {
    if (!AIChallengeOptimizer.instance) {
      AIChallengeOptimizer.instance = new AIChallengeOptimizer()
    }
    return AIChallengeOptimizer.instance
  }

  private loadUserProfile() {
    const saved = localStorage.getItem('userProfile')
    if (saved) {
      const parsed = JSON.parse(saved)
      this.userProfile = {
        ...parsed,
        completionRates: new Map(parsed.completionRates || [])
      }
    } else {
      this.initializeProfile()
    }
  }

  private initializeProfile() {
    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}')
    this.userProfile = {
      preferredCategories: ['mindfulness', 'exercise'],
      completionRates: new Map(),
      timeOfDayPreference: [userSettings.preferredTime || 'morning'],
      difficultyLevel: 'easy',
      stressLevel: 5,
      energyLevel: 5,
      recentActivities: [],
      goals: userSettings.goals || []
    }
  }

  private analyzeUserBehavior() {
    const logs = JSON.parse(localStorage.getItem('challengeLogs') || '[]')
    
    // カテゴリ別の完了率を計算
    const categoryStats = new Map<string, { completed: number, total: number }>()
    
    logs.forEach((log: any) => {
      const stat = categoryStats.get(log.category) || { completed: 0, total: 0 }
      stat.total++
      if (log.completed) stat.completed++
      categoryStats.set(log.category, stat)
    })
    
    // 完了率を更新
    categoryStats.forEach((stat, category) => {
      this.userProfile.completionRates.set(category, stat.completed / stat.total)
    })
    
    // 最近のアクティビティを更新
    this.userProfile.recentActivities = logs
      .slice(-10)
      .map((log: any) => log.challengeId)
    
    this.saveUserProfile()
  }

  private saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify({
      ...this.userProfile,
      completionRates: Array.from(this.userProfile.completionRates.entries())
    }))
  }

  // ユーザーの現在の状態を評価
  assessCurrentState(): { stress: number, energy: number, mood: string } {
    const now = new Date()
    const hour = now.getHours()
    const lastCheckin = JSON.parse(localStorage.getItem('lastCheckin') || '{}')
    
    // 時間帯による基本的なエネルギーレベル
    let energy = 5
    if (hour >= 6 && hour < 10) energy = 7 // 朝
    else if (hour >= 10 && hour < 14) energy = 8 // 午前中
    else if (hour >= 14 && hour < 17) energy = 6 // 午後
    else if (hour >= 17 && hour < 20) energy = 5 // 夕方
    else if (hour >= 20 && hour < 23) energy = 4 // 夜
    else energy = 3 // 深夜
    
    // 最近のチェックインデータから調整
    if (lastCheckin.moodScore) {
      const moodAdjustment = (lastCheckin.moodScore - 5) / 10
      energy += moodAdjustment
    }
    
    // ストレスレベルの推定
    const recentCompletions = this.getRecentCompletionRate()
    const stress = recentCompletions < 0.5 ? 7 : recentCompletions < 0.7 ? 5 : 3
    
    // 気分の判定
    let mood = 'neutral'
    if (energy >= 7 && stress <= 4) mood = 'positive'
    else if (energy <= 4 || stress >= 7) mood = 'low'
    
    return { stress, energy: Math.max(1, Math.min(10, energy)), mood }
  }

  private getRecentCompletionRate(): number {
    const logs = JSON.parse(localStorage.getItem('challengeLogs') || '[]')
    const recent = logs.slice(-7)
    if (recent.length === 0) return 0.5
    
    const completed = recent.filter((log: any) => log.completed).length
    return completed / recent.length
  }

  // 最適なチャレンジを生成
  generateOptimizedChallenges(count: number = 3): OptimizedChallenge[] {
    const state = this.assessCurrentState()
    const challenges: OptimizedChallenge[] = []
    
    // 状態に基づいてカテゴリを選択
    const recommendedCategories = this.selectCategories(state)
    
    recommendedCategories.forEach((category, index) => {
      const difficulty = this.selectDifficulty(state, category)
      const challenge = this.createChallenge(category, difficulty, state)
      challenges.push(challenge)
    })
    
    return challenges.slice(0, count)
  }

  private selectCategories(state: { stress: number, energy: number, mood: string }): string[] {
    const categories: string[] = []
    
    // ストレスが高い場合
    if (state.stress >= 7) {
      categories.push('mindfulness', 'breathing', 'meditation')
    }
    // エネルギーが高い場合
    else if (state.energy >= 7) {
      categories.push('exercise', 'social', 'creative')
    }
    // エネルギーが低い場合
    else if (state.energy <= 4) {
      categories.push('gratitude', 'reflection', 'light-stretch')
    }
    // 通常の状態
    else {
      categories.push(...this.userProfile.preferredCategories)
    }
    
    // 最近行っていないカテゴリを優先
    const recentCategories = new Set(
      JSON.parse(localStorage.getItem('challengeLogs') || '[]')
        .slice(-5)
        .map((log: any) => log.category)
    )
    
    return categories.filter(cat => !recentCategories.has(cat))
  }

  private selectDifficulty(
    state: { stress: number, energy: number },
    category: string
  ): 'easy' | 'medium' | 'hard' {
    const completionRate = this.userProfile.completionRates.get(category) || 0.5
    
    // ストレスが高い、またはエネルギーが低い場合は簡単に
    if (state.stress >= 7 || state.energy <= 3) {
      return 'easy'
    }
    
    // 完了率が高い場合は難易度を上げる
    if (completionRate >= 0.8) {
      return state.energy >= 6 ? 'hard' : 'medium'
    } else if (completionRate >= 0.6) {
      return 'medium'
    }
    
    return 'easy'
  }

  private createChallenge(
    category: string,
    difficulty: 'easy' | 'medium' | 'hard',
    state: { stress: number, energy: number, mood: string }
  ): OptimizedChallenge {
    const templates = this.getChallengeTemplates(category, difficulty)
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    // パーソナライズ
    const personalized = this.personalizeChallenge(template, state)
    
    return personalized
  }

  private getChallengeTemplates(category: string, difficulty: string): any[] {
    const templates = {
      mindfulness: {
        easy: [
          {
            title: '1分間の呼吸観察',
            description: '静かに座って呼吸を観察しましょう',
            duration: '1分',
            xp: 10,
            steps: ['楽な姿勢で座る', '目を閉じる', '自然な呼吸を観察']
          },
          {
            title: '感謝の瞬間',
            description: '今この瞬間に感謝できることを3つ思い浮かべる',
            duration: '2分',
            xp: 15,
            steps: ['静かな場所を見つける', '3つの感謝を思い浮かべる', '心で味わう']
          }
        ],
        medium: [
          {
            title: '5分間の瞑想',
            description: 'ガイド付き瞑想で心を落ち着ける',
            duration: '5分',
            xp: 25,
            steps: ['快適に座る', '呼吸に意識を向ける', '思考を観察して手放す']
          }
        ],
        hard: [
          {
            title: '10分間のボディスキャン',
            description: '全身の感覚に意識を向ける',
            duration: '10分',
            xp: 40,
            steps: ['仰向けになる', '足先から頭まで順番に意識', '緊張を解放']
          }
        ]
      },
      exercise: {
        easy: [
          {
            title: '軽いストレッチ',
            description: '体をゆっくりほぐしましょう',
            duration: '3分',
            xp: 15,
            steps: ['首を回す', '肩を回す', '前屈する']
          }
        ],
        medium: [
          {
            title: '5分間のヨガ',
            description: '基本的なヨガポーズ',
            duration: '5分',
            xp: 30,
            steps: ['太陽礼拝', '戦士のポーズ', '子供のポーズ']
          }
        ],
        hard: [
          {
            title: '10分間の有酸素運動',
            description: '心拍数を上げる運動',
            duration: '10分',
            xp: 45,
            steps: ['ジャンピングジャック', 'バーピー', 'マウンテンクライマー']
          }
        ]
      }
    }
    
    const categoryTemplates = templates[category as keyof typeof templates]
    if (!categoryTemplates) return []
    
    const difficultyTemplates = categoryTemplates[difficulty as keyof typeof categoryTemplates]
    return difficultyTemplates || []
  }

  private personalizeChallenge(template: any, state: any): OptimizedChallenge {
    const now = new Date()
    const hour = now.getHours()
    
    // 推奨時間の設定
    let recommendedTime = '今すぐ'
    if (state.energy < 5) {
      recommendedTime = '休憩後に'
    } else if (hour < 12) {
      recommendedTime = '午前中に'
    } else if (hour < 17) {
      recommendedTime = '午後の休憩時に'
    } else {
      recommendedTime = '夕方のリラックスタイムに'
    }
    
    // 成功確率の計算
    const categoryRate = this.userProfile.completionRates.get(template.category) || 0.5
    const difficultyModifier = template.difficulty === 'easy' ? 1.2 : template.difficulty === 'hard' ? 0.8 : 1
    const stateModifier = state.energy >= 6 ? 1.1 : state.stress >= 7 ? 0.9 : 1
    const successProbability = Math.min(0.95, categoryRate * difficultyModifier * stateModifier)
    
    // パーソナライズされた理由
    let reason = ''
    if (state.stress >= 7) {
      reason = 'ストレス軽減に効果的です'
    } else if (state.energy >= 7) {
      reason = 'エネルギーを有効活用できます'
    } else if (state.mood === 'low') {
      reason = '気分を改善するのに最適です'
    } else {
      reason = 'あなたの目標達成をサポートします'
    }
    
    return {
      id: `${template.category}_${Date.now()}`,
      category: template.category,
      title: template.title,
      description: template.description,
      duration: template.duration,
      difficulty: template.difficulty,
      xp: template.xp,
      personalizedReason: reason,
      successProbability,
      recommendedTime,
      adaptiveSteps: this.adaptSteps(template.steps, state)
    }
  }

  private adaptSteps(steps: string[], state: any): string[] {
    if (state.energy < 4) {
      // エネルギーが低い場合は簡略化
      return steps.map(step => `ゆっくりと${step}`)
    } else if (state.stress >= 7) {
      // ストレスが高い場合は詳細に
      return steps.map(step => `深呼吸しながら${step}`)
    }
    return steps
  }

  // チャレンジ完了を記録
  recordCompletion(challengeId: string, completed: boolean, feedback?: string) {
    const logs = JSON.parse(localStorage.getItem('challengeLogs') || '[]')
    logs.push({
      challengeId,
      completed,
      feedback,
      timestamp: new Date().toISOString(),
      category: challengeId.split('_')[0]
    })
    
    // 最新100件のみ保持
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100)
    }
    
    localStorage.setItem('challengeLogs', JSON.stringify(logs))
    
    // プロファイルを更新
    this.analyzeUserBehavior()
  }

  // 難易度の自動調整
  adjustDifficulty() {
    const recentRate = this.getRecentCompletionRate()
    
    if (recentRate >= 0.9 && this.userProfile.difficultyLevel !== 'hard') {
      // 難易度を上げる
      this.userProfile.difficultyLevel = 
        this.userProfile.difficultyLevel === 'easy' ? 'medium' : 'hard'
    } else if (recentRate <= 0.3 && this.userProfile.difficultyLevel !== 'easy') {
      // 難易度を下げる
      this.userProfile.difficultyLevel = 
        this.userProfile.difficultyLevel === 'hard' ? 'medium' : 'easy'
    }
    
    this.saveUserProfile()
  }
}

export const aiChallengeOptimizer = AIChallengeOptimizer.getInstance()