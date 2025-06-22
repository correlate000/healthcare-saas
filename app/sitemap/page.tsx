'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { AppLayout } from '@/src/components/layout/AppLayout'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Home,
  MessageSquare,
  BarChart3,
  Zap,
  Settings,
  Heart,
  Users,
  BookOpen,
  Calendar,
  Star,
  Shield,
  Building2,
  HelpCircle,
  User,
  Bell,
  Download,
  Globe,
  Smartphone,
  ChevronRight,
  Search,
  ExternalLink
} from 'lucide-react'

interface SitePage {
  id: string
  title: string
  description: string
  url: string
  icon: any
  category: 'core' | 'user' | 'admin' | 'onboarding' | 'content' | 'system'
  status: 'active' | 'demo' | 'coming-soon'
  importance: 'high' | 'medium' | 'low'
}

const sitePages: SitePage[] = [
  // Core Features
  {
    id: 'dashboard',
    title: 'ダッシュボード',
    description: 'ゲーム化されたメインホーム画面',
    url: '/dashboard',
    icon: Home,
    category: 'core',
    status: 'active',
    importance: 'high'
  },
  {
    id: 'checkin',
    title: '気分チェックイン',
    description: '5ステップの対話式気分記録',
    url: '/checkin',
    icon: Heart,
    category: 'core',
    status: 'active',
    importance: 'high'
  },
  {
    id: 'chat',
    title: 'AIチャット',
    description: 'Luna/Aria/Zenとの対話',
    url: '/chat',
    icon: MessageSquare,
    category: 'core',
    status: 'active',
    importance: 'high'
  },
  {
    id: 'analytics',
    title: '分析・インサイト',
    description: '個人のメンタルヘルス分析',
    url: '/analytics',
    icon: BarChart3,
    category: 'core',
    status: 'active',
    importance: 'high'
  },
  {
    id: 'daily-challenge',
    title: 'デイリーチャレンジ',
    description: 'ゲーム化されたミッション',
    url: '/daily-challenge',
    icon: Zap,
    category: 'core',
    status: 'active',
    importance: 'high'
  },

  // Onboarding
  {
    id: 'onboarding',
    title: '初回オンボーディング',
    description: 'サービス紹介とキャラクター選択',
    url: '/onboarding',
    icon: Star,
    category: 'onboarding',
    status: 'active',
    importance: 'high'
  },
  {
    id: 'setup',
    title: '企業向けセットアップ',
    description: '法人情報の匿名登録（8ステップ）',
    url: '/onboarding/setup',
    icon: Building2,
    category: 'onboarding',
    status: 'active',
    importance: 'high'
  },
  {
    id: 'widget-setup',
    title: 'ウィジェット設定',
    description: 'ホーム画面ウィジェットの選択・設定',
    url: '/onboarding/widget-setup',
    icon: Smartphone,
    category: 'onboarding',
    status: 'active',
    importance: 'high'
  },

  // User Features
  {
    id: 'team-connect',
    title: 'チーム交流',
    description: '匿名でのチーム投稿・交流',
    url: '/team-connect',
    icon: Users,
    category: 'user',
    status: 'active',
    importance: 'medium'
  },
  {
    id: 'content-library',
    title: 'コンテンツライブラリ',
    description: 'メンタルヘルス記事・動画・エクササイズ',
    url: '/content-library',
    icon: BookOpen,
    category: 'user',
    status: 'active',
    importance: 'medium'
  },
  {
    id: 'booking',
    title: '専門家予約',
    description: 'カウンセラー・専門家との予約',
    url: '/booking',
    icon: Calendar,
    category: 'user',
    status: 'active',
    importance: 'medium'
  },
  {
    id: 'achievements',
    title: '実績・バッジ',
    description: 'レベル・XP・バッジの管理',
    url: '/achievements',
    icon: Star,
    category: 'user',
    status: 'active',
    importance: 'medium'
  },
  {
    id: 'characters',
    title: 'AIキャラクター',
    description: 'Luna/Aria/Zenとの絆管理',
    url: '/characters',
    icon: Heart,
    category: 'user',
    status: 'active',
    importance: 'medium'
  },

  // Settings & Profile
  {
    id: 'settings',
    title: '設定',
    description: 'アカウント・通知・プライバシー設定',
    url: '/settings',
    icon: Settings,
    category: 'user',
    status: 'active',
    importance: 'medium'
  },
  {
    id: 'profile',
    title: 'プロフィール',
    description: '個人設定とプライバシー管理',
    url: '/profile',
    icon: User,
    category: 'user',
    status: 'active',
    importance: 'medium'
  },
  {
    id: 'notifications',
    title: '通知センター',
    description: 'お知らせと通知の管理',
    url: '/notifications',
    icon: Bell,
    category: 'user',
    status: 'active',
    importance: 'low'
  },

  // Enterprise Admin
  {
    id: 'enterprise-admin',
    title: '企業管理ダッシュボード',
    description: '匿名化された従業員統計（企業向け）',
    url: '/enterprise-admin/dashboard',
    icon: Building2,
    category: 'admin',
    status: 'active',
    importance: 'high'
  },
  {
    id: 'enterprise-analytics',
    title: '企業分析',
    description: '部門別・トレンド分析',
    url: '/enterprise-admin/analytics',
    icon: BarChart3,
    category: 'admin',
    status: 'active',
    importance: 'medium'
  },
  {
    id: 'admin-staging',
    title: '管理者ステージング環境',
    description: '全機能の監視・テスト・管理（管理者専用）',
    url: '/admin-staging',
    icon: Settings,
    category: 'admin',
    status: 'active',
    importance: 'high'
  },

  // System Pages
  {
    id: 'help',
    title: 'ヘルプ・サポート',
    description: 'FAQ・使い方ガイド・お問い合わせ',
    url: '/help',
    icon: HelpCircle,
    category: 'system',
    status: 'active',
    importance: 'medium'
  },
  {
    id: 'export',
    title: 'データエクスポート',
    description: '個人データのダウンロード',
    url: '/export',
    icon: Download,
    category: 'system',
    status: 'active',
    importance: 'low'
  },
  {
    id: 'offline',
    title: 'オフラインページ',
    description: 'PWA対応・オフライン利用',
    url: '/offline',
    icon: Globe,
    category: 'system',
    status: 'active',
    importance: 'low'
  },
  {
    id: 'test-logout',
    title: 'テスト・デバッグ',
    description: 'ログアウト・データクリア（開発者用）',
    url: '/test-logout',
    icon: Settings,
    category: 'system',
    status: 'active',
    importance: 'low'
  }
]

const categoryLabels = {
  core: '🏠 コア機能',
  onboarding: '🚀 初回セットアップ',
  user: '👤 ユーザー機能',
  admin: '👑 企業管理',
  content: '📚 コンテンツ',
  system: '⚙️ システム'
}

const statusLabels = {
  active: '✅ 利用可能',
  demo: '🔧 デモ版',
  'coming-soon': '🚧 準備中'
}

export default function SitemapPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPages = sitePages.filter(page => {
    const matchesCategory = selectedCategory === 'all' || page.category === selectedCategory
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'demo': return 'text-blue-600 bg-blue-50'
      case 'coming-soon': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  const handlePageVisit = (url: string) => {
    router.push(url)
  }

  return (
    <AppLayout title="サイトマップ" showBackButton>
      <div className="px-4 py-6 max-w-4xl mx-auto">
        
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">🗺️ サイトマップ</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            MindCareの全機能とページを一覧でご確認いただけます。
            カテゴリ別の絞り込みや検索も可能です。
          </p>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{sitePages.length}</div>
              <div className="text-sm text-gray-600">総ページ数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {sitePages.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">利用可能</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {sitePages.filter(p => p.importance === 'high').length}
              </div>
              <div className="text-sm text-gray-600">重要機能</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">カテゴリ</div>
            </CardContent>
          </Card>
        </div>

        {/* 検索・フィルター */}
        <div className="mb-6 space-y-4">
          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ページを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* カテゴリフィルター */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
            >
              すべて
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
              >
                {categoryLabels[category]}
              </Button>
            ))}
          </div>
        </div>

        {/* ページ一覧 */}
        <div className="space-y-4">
          {filteredPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 ${getImportanceColor(page.importance)}`}
                onClick={() => handlePageVisit(page.url)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <page.icon className="h-6 w-6 text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-gray-800">{page.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(page.status)}`}>
                            {statusLabels[page.status]}
                          </span>
                          <span className="text-xs text-gray-500">
                            {categoryLabels[page.category]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{page.description}</p>
                        <p className="text-xs text-blue-600 mt-1 font-mono">{page.url}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {page.importance === 'high' && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* フィルター結果が空の場合 */}
        {filteredPages.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-8 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                該当するページが見つかりません
              </h3>
              <p className="text-gray-500 mb-4">
                検索条件やカテゴリを変更してお試しください
              </p>
              <Button onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}>
                フィルターをリセット
              </Button>
            </CardContent>
          </Card>
        )}

        {/* クイックアクセス */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>🚀 クイックアクセス</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sitePages.filter(p => p.importance === 'high').slice(0, 8).map((page) => (
                <Button
                  key={page.id}
                  onClick={() => handlePageVisit(page.url)}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-3"
                >
                  <page.icon className="h-5 w-5" />
                  <span className="text-xs">{page.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 利用ガイド */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-2">💡 利用ガイド</h4>
                <div className="text-sm text-green-700 space-y-2">
                  <div>
                    <strong>🏠 まずはここから:</strong> 
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-green-700 p-0 ml-1"
                      onClick={() => handlePageVisit('/onboarding')}
                    >
                      オンボーディング
                    </Button>
                    →
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-green-700 p-0 ml-1"
                      onClick={() => handlePageVisit('/onboarding/setup')}
                    >
                      セットアップ
                    </Button>
                    →
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-green-700 p-0 ml-1"
                      onClick={() => handlePageVisit('/dashboard')}
                    >
                      ダッシュボード
                    </Button>
                  </div>
                  <div>
                    <strong>📊 企業管理者:</strong> 
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-green-700 p-0 ml-1"
                      onClick={() => handlePageVisit('/enterprise-admin/dashboard')}
                    >
                      企業統計ダッシュボード
                    </Button>
                    で匿名化された従業員データを確認
                  </div>
                  <div>
                    <strong>🔧 問題がある場合:</strong> 
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-green-700 p-0 ml-1"
                      onClick={() => handlePageVisit('/help')}
                    >
                      ヘルプページ
                    </Button>
                    をご確認ください
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}