'use client'

import { useState, useEffect } from 'react'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Users, 
  Building2, 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  Database,
  Settings,
  Monitor,
  Zap,
  Globe,
  Server,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  ExternalLink
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// システム監視データ
const systemHealth = {
  overall: 98.5,
  api: { status: 'healthy', uptime: 99.9, responseTime: 45 },
  database: { status: 'healthy', uptime: 99.8, queries: 1247 },
  auth: { status: 'healthy', uptime: 100, sessions: 892 },
  analytics: { status: 'warning', uptime: 95.2, processing: 'delayed' }
}

// 組織統計
const organizationStats = {
  totalOrganizations: 47,
  activeUsers: 12847,
  dailyActiveUsers: 8923,
  weeklyGrowth: 12.3,
  topOrganizations: [
    { name: '株式会社テックイノベーション', users: 1247, engagement: 89, risk: 'low' },
    { name: 'グローバルソリューションズ', users: 856, engagement: 76, risk: 'medium' },
    { name: 'ヘルスケア・パートナーズ', users: 634, engagement: 92, risk: 'low' },
    { name: 'クリエイティブ・ワークス', users: 423, engagement: 67, risk: 'high' },
    { name: 'フューチャー・テクノロジー', users: 389, engagement: 84, risk: 'low' }
  ]
}

// プラットフォーム使用状況
const platformUsage = {
  totalSessions: 45623,
  averageSessionTime: '8.5分',
  bounceRate: 12.3,
  topFeatures: [
    { name: 'AIチャット', usage: 89, sessions: 23456 },
    { name: '気分チェック', usage: 87, sessions: 21234 },
    { name: 'ダッシュボード', usage: 95, sessions: 43567 },
    { name: '分析機能', usage: 72, sessions: 15678 },
    { name: '専門家予約', usage: 45, sessions: 8923 }
  ]
}

function SuperAdminDashboardContent() {
  const router = useRouter()
  const [realTimeData, setRealTimeData] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // 30秒ごとに更新

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">スーパー管理者ダッシュボード</h1>
                  <p className="text-gray-600">MindCareプラットフォーム全体の監視・管理</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Eye className="h-3 w-3 mr-1" />
                リアルタイム監視
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                最終更新: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                更新
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                レポート
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="system">システム</TabsTrigger>
            <TabsTrigger value="organizations">組織管理</TabsTrigger>
            <TabsTrigger value="usage">使用状況</TabsTrigger>
            <TabsTrigger value="security">セキュリティ</TabsTrigger>
          </TabsList>

          {/* 概要タブ */}
          <TabsContent value="overview" className="space-y-6">
            {/* システムヘルス概要 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">システム全体健全性</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-green-600">{systemHealth.overall}%</div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <Progress value={systemHealth.overall} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">総組織数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{organizationStats.totalOrganizations}</div>
                    <Building2 className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    +3 今月
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">アクティブユーザー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{organizationStats.activeUsers.toLocaleString()}</div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    +{organizationStats.weeklyGrowth}% 今週
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">総セッション数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{platformUsage.totalSessions.toLocaleString()}</div>
                    <Activity className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    平均 {platformUsage.averageSessionTime}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* リアルタイムアラート */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>リアルタイムアラート</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">分析システム処理遅延</div>
                        <div className="text-sm text-gray-600">データ処理に通常より時間がかかっています</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                      監視中
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">トラフィック急増</div>
                        <div className="text-sm text-gray-600">通常の120%のアクセス数を記録</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      正常
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* トップ組織 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <span>トップ組織</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {organizationStats.topOrganizations.map((org, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-gray-600">{org.users}名 • エンゲージメント {org.engagement}%</div>
                        </div>
                      </div>
                      <Badge className={getRiskColor(org.risk)}>
                        {org.risk === 'high' ? '高リスク' : org.risk === 'medium' ? '中リスク' : '低リスク'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* システム監視タブ */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(systemHealth).filter(([key]) => key !== 'overall').map(([service, data]: [string, any]) => (
                <Card key={service}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Server className="h-5 w-5 text-blue-500" />
                        <span className="capitalize">{service === 'api' ? 'API' : service}</span>
                      </div>
                      <Badge className={getStatusColor(data.status)}>
                        {data.status === 'healthy' ? '正常' : data.status === 'warning' ? '警告' : 'エラー'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">稼働率</span>
                        <span className="font-bold">{data.uptime}%</span>
                      </div>
                      <Progress value={data.uptime} className="h-2" />
                      
                      {data.responseTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">応答時間</span>
                          <span className="font-medium">{data.responseTime}ms</span>
                        </div>
                      )}
                      
                      {data.queries && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">クエリ/分</span>
                          <span className="font-medium">{data.queries}</span>
                        </div>
                      )}

                      {data.sessions && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">アクティブセッション</span>
                          <span className="font-medium">{data.sessions}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 組織管理タブ */}
          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>組織一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">組織名</th>
                        <th className="text-left py-3 px-4">ユーザー数</th>
                        <th className="text-left py-3 px-4">エンゲージメント</th>
                        <th className="text-left py-3 px-4">リスクレベル</th>
                        <th className="text-left py-3 px-4">アクション</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizationStats.topOrganizations.map((org, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{org.name}</td>
                          <td className="py-3 px-4">{org.users}名</td>
                          <td className="py-3 px-4">{org.engagement}%</td>
                          <td className="py-3 px-4">
                            <Badge className={getRiskColor(org.risk)}>
                              {org.risk === 'high' ? '高リスク' : org.risk === 'medium' ? '中リスク' : '低リスク'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              詳細
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使用状況タブ */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>機能別使用状況</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformUsage.topFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{feature.name}</span>
                          <span className="text-sm text-gray-600">{feature.usage}%</span>
                        </div>
                        <Progress value={feature.usage} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">
                          {feature.sessions.toLocaleString()} セッション
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* セキュリティタブ */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>セキュリティ状況</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL証明書</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ファイアウォール</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">DDoS保護</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">データ暗号化</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>最近のセキュリティイベント</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>定期バックアップ完了</span>
                      <span className="text-gray-500 ml-auto">2時間前</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>セキュリティスキャン実行</span>
                      <span className="text-gray-500 ml-auto">6時間前</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>異常なアクセス検知（解決済み）</span>
                      <span className="text-gray-500 ml-auto">1日前</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function SuperAdminDashboard() {
  return (
    <AdminRoute requiredRole="super-admin">
      <SuperAdminDashboardContent />
    </AdminRoute>
  )
}