// デモ環境専用サービス
import { config, demoData } from './config'

export class DemoService {
  static isDemo() {
    return config.environment === 'demo'
  }

  // デモ用API応答を模擬
  static async mockApiResponse(endpoint: string, data?: any) {
    // 実際のAPI呼び出しのような遅延を追加
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    
    switch (endpoint) {
      case '/api/personalized-response':
        return {
          response: this.getDemoResponse(data?.message || ''),
          emotion: this.getRandomEmotion()
        }
      
      case '/api/health':
        return {
          data: demoData.healthData[0],
          message: 'デモデータを取得しました'
        }
      
      case '/api/auth/login':
        return {
          user: demoData.users[0],
          token: 'demo-token-12345'
        }
      
      default:
        return { message: 'デモ環境での模擬応答です' }
    }
  }

  private static getDemoResponse(message: string): string {
    const responses = [
      'デモ環境でのAI応答です。実際の環境では、より高度な分析に基づいた応答を提供します。',
      'こちらはデモ用の応答です。本番環境では、あなたの感情や状況に合わせたパーソナライズされた返答をします。',
      'デモをご覧いただき、ありがとうございます。実際のサービスでは、継続的な学習により、より適切なサポートを提供できます。'
    ]
    
    if (message.includes('こんにちは') || message.includes('はじめまして')) {
      return 'はじめまして！デモ環境へようこそ。実際のサービスでは、あなたの心の健康をサポートするために、24時間いつでもお話しできます。'
    }
    
    if (message.includes('疲れ') || message.includes('ストレス')) {
      return 'お疲れ様です。デモ環境ですが、本番では深い感情分析により、あなたに最適なリラクゼーション方法をご提案します。'
    }
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private static getRandomEmotion() {
    const emotions = ['happy', 'neutral', 'calm', 'thoughtful']
    return emotions[Math.floor(Math.random() * emotions.length)]
  }

  // デモ用ダッシュボードデータ
  static getDashboardData() {
    return {
      recentSessions: [
        {
          id: 'demo-session-1',
          date: '2024-01-15',
          duration: '12分',
          mood: '良好',
          character: 'ルナ'
        },
        {
          id: 'demo-session-2', 
          date: '2024-01-14',
          duration: '8分',
          mood: '普通',
          character: 'ソル'
        }
      ],
      weeklyMood: [
        { day: '月', value: 7 },
        { day: '火', value: 6 },
        { day: '水', value: 8 },
        { day: '木', value: 7 },
        { day: '金', value: 9 },
        { day: '土', value: 8 },
        { day: '日', value: 7 }
      ],
      achievements: [
        {
          id: 'demo-achievement-1',
          title: '7日連続チェックイン',
          description: '1週間毎日心の状態をチェックインしました',
          icon: '🏆',
          earned: true
        }
      ]
    }
  }
}