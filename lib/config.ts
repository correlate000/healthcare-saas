// 環境別設定
export const getEnvironmentConfig = () => {
  const branch = process.env.VERCEL_GIT_COMMIT_REF || 'main'
  
  const configs = {
    main: {
      environment: 'production',
      siteUrl: 'https://healthcare-saas.com',
      enableSEO: true,
      enableAnalytics: true,
      useRealData: true,
      showDemoBanner: false
    },
    staging: {
      environment: 'staging',
      siteUrl: 'https://healthcare-saas-staging.vercel.app',
      enableSEO: false,
      enableAnalytics: false,
      useRealData: true,
      showDemoUser: true
    },
    demo: {
      environment: 'demo',
      siteUrl: 'https://healthcare-saas-demo.vercel.app',
      enableSEO: false,
      enableAnalytics: false,
      useRealData: false,
      showDemoUser: true,
      demoMode: true
    }
  }
  
  return configs[branch as keyof typeof configs] || configs.main
}

export const config = getEnvironmentConfig()

// デモ用モックデータ
export const demoData = {
  users: [
    {
      id: 'demo-user-1',
      name: '田中太郎',
      email: 'demo@example.com',
      role: 'patient'
    }
  ],
  conversations: [
    {
      id: 'demo-conv-1',
      content: 'こんにちは、今日は調子はいかがですか？',
      emotion: 'neutral',
      timestamp: new Date().toISOString()
    }
  ],
  healthData: [
    {
      date: '2024-01-15',
      mood: 7,
      energy: 8,
      sleep: 6.5
    }
  ]
}