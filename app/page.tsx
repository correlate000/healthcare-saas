'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { 
  Heart, 
  Sparkles, 
  Shield, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Calendar,
  BookOpen,
  Star,
  Building2,
  Crown,
  Zap,
  Settings,
  HelpCircle,
  Map,
  UserCheck,
  Activity,
  Target,
  Globe
} from 'lucide-react'

// 主要機能のカテゴリ
const mainFeatures = [
  {
    title: 'ダッシュボード',
    description: 'ゲーム化されたメインホーム',
    icon: Heart,
    path: '/dashboard',
    color: 'from-blue-500 to-purple-600',
    priority: 'high'
  },
  {
    title: '気分チェックイン',
    description: '5ステップの対話式記録',
    icon: Heart,
    path: '/checkin',
    color: 'from-pink-500 to-rose-500',
    priority: 'high'
  },
  {
    title: 'AIチャット',
    description: 'Luna/Aria/Zenとの対話',
    icon: MessageSquare,
    path: '/chat',
    color: 'from-indigo-500 to-purple-500',
    priority: 'high'
  },
  {
    title: '分析・インサイト',
    description: '個人のメンタルヘルス分析',
    icon: BarChart3,
    path: '/analytics',
    color: 'from-green-500 to-teal-500',
    priority: 'high'
  }
]

const userFeatures = [
  {
    title: '専門家予約',
    description: 'カウンセラーとの面談予約',
    icon: Calendar,
    path: '/booking',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    title: 'コンテンツライブラリ',
    description: '記事・動画・エクササイズ',
    icon: BookOpen,
    path: '/content-library',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    title: '実績・バッジ',
    description: 'レベル・XP・達成記録',
    icon: Star,
    path: '/achievements',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'デイリーチャレンジ',
    description: 'ゲーム化されたミッション',
    icon: Zap,
    path: '/daily-challenge',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'AIキャラクター',
    description: 'キャラクターとの絆管理',
    icon: Users,
    path: '/characters',
    color: 'from-pink-500 to-purple-500'
  },
  {
    title: 'チーム交流',
    description: '匿名でのチーム投稿・交流',
    icon: Users,
    path: '/team-connect',
    color: 'from-cyan-500 to-blue-500'
  }
]

const adminFeatures = [
  {
    title: '基本管理',
    description: '部門別分析・アラート管理',
    icon: Crown,
    path: '/admin',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    title: '企業管理',
    description: '匿名化統計・コンプライアンス',
    icon: Building2,
    path: '/enterprise-admin',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'スーパー管理',
    description: 'プラットフォーム全体監視',
    icon: Shield,
    path: '/super-admin',
    color: 'from-red-500 to-pink-500'
  }
]

const systemFeatures = [
  {
    title: '設定',
    description: 'アカウント・通知・プライバシー',
    icon: Settings,
    path: '/settings',
    color: 'from-gray-500 to-gray-600'
  },
  {
    title: 'ヘルプ・サポート',
    description: 'FAQ・使い方ガイド',
    icon: HelpCircle,
    path: '/help',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'サイトマップ',
    description: '全機能一覧・検索',
    icon: Map,
    path: '/sitemap',
    color: 'from-indigo-500 to-blue-500'
  }
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('main')
  const router = useRouter()

  const getCategoryFeatures = () => {
    switch (selectedCategory) {
      case 'main': return mainFeatures
      case 'user': return userFeatures  
      case 'admin': return adminFeatures
      case 'system': return systemFeatures
      default: return mainFeatures
    }
  }

  const categoryLabels = {
    main: { label: '🏠 メイン機能', description: '最もよく使われる基本機能' },
    user: { label: '👤 ユーザー機能', description: '個人向けの追加機能' },
    admin: { label: '👑 管理者機能', description: '組織・企業向け管理機能' },
    system: { label: '⚙️ システム', description: '設定・サポート・ヘルプ' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ヘッダー */}
        <div className="text-center space-y-6 py-8">
          {/* ロゴ・ブランド */}
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-bold bg-yellow-400 text-yellow-900">
                <Sparkles className="h-4 w-4 mr-1" />
                AI
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              MindCare
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              あなたの心の健康パートナー<br />
              AIキャラクターと一緒に、楽しく健康管理
            </p>
            
            {/* 主要な特徴 */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge variant="outline" className="px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                AI対話システム
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                プライバシー重視
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                専門家サポート
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                ゲーム化機能
              </Badge>
            </div>
          </div>
        </div>

        {/* カテゴリ選択 */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Map className="h-6 w-6 text-primary" />
              <span>機能カテゴリ</span>
            </CardTitle>
            <p className="text-muted-foreground">
              {categoryLabels[selectedCategory as keyof typeof categoryLabels]?.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {Object.entries(categoryLabels).map(([key, {label}]) => (
                <Button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="lg"
                  className="px-6"
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 機能一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getCategoryFeatures().map((feature, index) => (
            <Card 
              key={feature.path}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-2 hover:border-primary/30"
              onClick={() => router.push(feature.path)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* アイコンとグラデーション背景 */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* タイトルと説明 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      {feature.priority === 'high' && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          <Star className="h-3 w-3 mr-1" />
                          人気
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* アクションボタン */}
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    variant="outline"
                  >
                    開く
                    <Activity className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* クイックアクセス */}
        <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-2 border-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>🚀 はじめに</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push('/onboarding')}
                className="h-16 text-left flex flex-col items-start justify-center space-y-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                size="lg"
              >
                <span className="font-bold">🌟 初回セットアップ</span>
                <span className="text-xs opacity-90">サービスの使い方を学ぶ</span>
              </Button>
              
              <Button
                onClick={() => router.push('/auth')}
                className="h-16 text-left flex flex-col items-start justify-center space-y-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                size="lg"
              >
                <span className="font-bold">🔐 ログイン</span>
                <span className="text-xs opacity-90">アカウントにアクセス</span>
              </Button>
              
              <Button
                onClick={() => router.push('/emergency-support')}
                className="h-16 text-left flex flex-col items-start justify-center space-y-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                size="lg"
              >
                <span className="font-bold">🆘 緊急サポート</span>
                <span className="text-xs opacity-90">即座にヘルプを受ける</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* フッター情報 */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>24時間365日利用可能</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>GDPR準拠・データ暗号化</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>12,000+ ユーザーが利用中</span>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/sitemap')}
                >
                  全機能一覧
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/help')}
                >
                  ヘルプ・サポート
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}