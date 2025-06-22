'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { AppLayout } from '@/src/components/layout/AppLayout'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Eye,
  Play,
  Pause,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Activity,
  ChevronRight,
  Download,
  Upload
} from 'lucide-react'

interface AdminSection {
  id: string
  title: string
  description: string
  icon: any
  status: 'active' | 'staging' | 'maintenance'
  path: string
  category: 'user' | 'enterprise' | 'system' | 'content'
  lastUpdated: string
  users?: number
}

const adminSections: AdminSection[] = [
  // ユーザー向け機能
  {
    id: 'user-dashboard',
    title: 'ユーザーダッシュボード',
    description: 'ゲーム化されたメインダッシュボード',
    icon: Users,
    status: 'active',
    path: '/dashboard',
    category: 'user',
    lastUpdated: '2分前',
    users: 189
  },
  {
    id: 'checkin-flow',
    title: '気分チェックイン',
    description: '5ステップの対話式気分記録',
    icon: Activity,
    status: 'active',
    path: '/checkin',
    category: 'user',
    lastUpdated: '5分前',
    users: 156
  },
  {
    id: 'ai-chat',
    title: 'AIチャット',
    description: 'Luna/Aria/Zenとの対話システム',
    icon: Zap,
    status: 'active',
    path: '/chat',
    category: 'user',
    lastUpdated: '1分前',
    users: 89
  },
  {
    id: 'content-library',
    title: 'コンテンツライブラリ',
    description: '専門家による学習コンテンツ',
    icon: Database,
    status: 'active',
    path: '/content-library',
    category: 'content',
    lastUpdated: '10分前',
    users: 234
  },

  // 企業向け機能
  {
    id: 'enterprise-onboarding',
    title: '企業オンボーディング',
    description: '法人向け初回セットアップ',
    icon: Building2,
    status: 'active',
    path: '/onboarding/setup',
    category: 'enterprise',
    lastUpdated: '15分前',
    users: 12
  },
  {
    id: 'widget-setup',
    title: 'ウィジェット設定',
    description: 'ホーム画面ウィジェット配置',
    icon: Smartphone,
    status: 'active',
    path: '/onboarding/widget-setup',
    category: 'enterprise',
    lastUpdated: '20分前',
    users: 8
  },
  {
    id: 'enterprise-dashboard',
    title: '企業統計ダッシュボード',
    description: '匿名化された従業員データ分析',
    icon: BarChart3,
    status: 'active',
    path: '/enterprise-admin/dashboard',
    category: 'enterprise',
    lastUpdated: '3分前',
    users: 5
  },

  // システム機能
  {
    id: 'sitemap',
    title: 'サイトマップ',
    description: '全ページ一覧とナビゲーション',
    icon: Globe,
    status: 'active',
    path: '/sitemap',
    category: 'system',
    lastUpdated: '30分前',
    users: 25
  },
  {
    id: 'analytics-system',
    title: '分析システム',
    description: '個人メンタルヘルス分析',
    icon: BarChart3,
    status: 'staging',
    path: '/analytics',
    category: 'system',
    lastUpdated: '1時間前',
    users: 67
  },
  {
    id: 'booking-system',
    title: '専門家予約システム',
    description: 'カウンセラー・専門家予約',
    icon: Clock,
    status: 'active',
    path: '/booking',
    category: 'user',
    lastUpdated: '45分前',
    users: 23
  }
]

const categoryLabels = {
  user: '👤 ユーザー機能',
  enterprise: '🏢 企業機能',
  content: '📚 コンテンツ',
  system: '⚙️ システム'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'staging': return 'bg-yellow-100 text-yellow-800'
    case 'maintenance': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircle className="h-4 w-4" />
    case 'staging': return <AlertTriangle className="h-4 w-4" />
    case 'maintenance': return <RefreshCw className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export default function AdminStagingPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredSections = adminSections.filter(section => 
    selectedCategory === 'all' || section.category === selectedCategory
  )

  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>

  const totalUsers = adminSections.reduce((sum, section) => sum + (section.users || 0), 0)
  const activeSections = adminSections.filter(s => s.status === 'active').length
  const stagingSections = adminSections.filter(s => s.status === 'staging').length

  const handleSectionVisit = (path: string) => {
    window.open(path, '_blank')
  }

  return (
    <AppLayout title="管理者ステージング環境" showBackButton>
      <div className="px-4 py-6 max-w-6xl mx-auto">
        
        {/* ヘッダー統計 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{adminSections.length}</div>
              <div className="text-sm text-gray-600">総機能数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{activeSections}</div>
              <div className="text-sm text-gray-600">稼働中</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stagingSections}</div>
              <div className="text-sm text-gray-600">ステージング</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{totalUsers}</div>
              <div className="text-sm text-gray-600">アクティブユーザー</div>
            </CardContent>
          </Card>
        </div>

        {/* フィルターとコントロール */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
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

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              variant="outline"
              size="sm"
            >
              {viewMode === 'grid' ? <Monitor className="h-4 w-4" /> : <Users className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              更新
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              ログ出力
            </Button>
          </div>
        </div>

        {/* 機能一覧 */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  section.status === 'active' ? 'border-l-4 border-l-green-500' :
                  section.status === 'staging' ? 'border-l-4 border-l-yellow-500' :
                  'border-l-4 border-l-red-500'
                }`}
                onClick={() => handleSectionVisit(section.path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <section.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">{section.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{section.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`text-xs ${getStatusColor(section.status)}`}>
                      {getStatusIcon(section.status)}
                      <span className="ml-1">
                        {section.status === 'active' ? '稼働中' :
                         section.status === 'staging' ? 'ステージング' : 'メンテナンス'}
                      </span>
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {categoryLabels[section.category]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      {section.users && (
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {section.users}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {section.lastUpdated}
                      </div>
                    </div>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {section.path}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* クイックアクション */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>🚀 クイックアクション</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="flex flex-col items-center space-y-2 h-auto py-3"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">ユーザービュー</span>
              </Button>
              <Button
                onClick={() => router.push('/enterprise-admin/dashboard')}
                variant="outline"
                className="flex flex-col items-center space-y-2 h-auto py-3"
              >
                <Building2 className="h-5 w-5" />
                <span className="text-xs">企業ダッシュボード</span>
              </Button>
              <Button
                onClick={() => router.push('/sitemap')}
                variant="outline"
                className="flex flex-col items-center space-y-2 h-auto py-3"
              >
                <Globe className="h-5 w-5" />
                <span className="text-xs">サイトマップ</span>
              </Button>
              <Button
                onClick={() => router.push('/onboarding')}
                variant="outline"
                className="flex flex-col items-center space-y-2 h-auto py-3"
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs">オンボーディング</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* システム情報 */}
        <Card className="mt-6 bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-gray-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-800 mb-2">🔒 管理者環境について</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <strong>目的:</strong> 全機能のテスト・監視・管理を一元化
                  </div>
                  <div>
                    <strong>アクセス権限:</strong> システム管理者・企業管理者のみ
                  </div>
                  <div>
                    <strong>データ保護:</strong> すべてのユーザーデータは匿名化済み
                  </div>
                  <div>
                    <strong>更新頻度:</strong> リアルタイム監視・5分間隔でデータ更新
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