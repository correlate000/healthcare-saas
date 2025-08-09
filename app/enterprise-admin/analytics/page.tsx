'use client'

import { useState, useEffect } from 'react'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/layout/AppLayout'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Shield,
  Clock,
  Heart,
  Brain,
  Download,
  Filter,
  Calendar,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock enterprise analytics data
const companyMetrics = {
  totalEmployees: 2847,
  activeUsers: 1923,
  engagementRate: 67.5,
  averageSessions: 3.2,
  riskAlerts: 12,
  improvements: {
    stressReduction: 23,
    sleepQuality: 18,
    teamSatisfaction: 31
  }
}

const departmentBreakdown = [
  { name: 'Engineering', users: 324, engagement: 78, riskLevel: 'medium', avgMood: 7.2 },
  { name: 'Sales', users: 189, engagement: 85, riskLevel: 'low', avgMood: 8.1 },
  { name: 'Marketing', users: 156, engagement: 72, riskLevel: 'medium', avgMood: 7.6 },
  { name: 'HR', users: 45, engagement: 91, riskLevel: 'low', avgMood: 8.4 },
  { name: 'Finance', users: 67, engagement: 64, riskLevel: 'high', avgMood: 6.3 },
  { name: 'Operations', users: 112, engagement: 70, riskLevel: 'medium', avgMood: 7.0 }
]

const timeSeriesData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  engagement: [52, 58, 61, 65, 68, 67],
  wellbeing: [6.1, 6.4, 6.7, 7.0, 7.3, 7.5],
  riskAlerts: [18, 15, 12, 9, 8, 12]
}

const riskAlerts = [
  {
    id: 1,
    department: 'Finance',
    type: 'high_stress',
    severity: 'high',
    affectedUsers: 12,
    description: '財務部門でストレスレベルの増加を検出',
    recommendation: '追加のメンタルヘルスサポートと作業負荷の見直しを推奨',
    createdAt: '2024-06-18T09:30:00Z'
  },
  {
    id: 2,
    department: 'Engineering',
    type: 'burnout_risk',
    severity: 'medium',
    affectedUsers: 8,
    description: 'エンジニアリング部門で燃え尽き症候群のリスクを検出',
    recommendation: 'チーム間の作業分散とリフレッシュ期間の提供を検討',
    createdAt: '2024-06-17T14:15:00Z'
  },
  {
    id: 3,
    department: 'Operations',
    type: 'decreased_engagement',
    severity: 'medium',
    affectedUsers: 15,
    description: 'オペレーション部門でエンゲージメントの低下',
    recommendation: 'チームビルディング活動と従業員フィードバックセッションを実施',
    createdAt: '2024-06-16T11:45:00Z'
  }
]

const complianceMetrics = {
  dataProtection: {
    score: 98,
    items: [
      { name: 'データ暗号化', status: 'compliant', details: '全データAES-256暗号化済み' },
      { name: 'アクセス制御', status: 'compliant', details: 'ロールベースアクセス制御実装済み' },
      { name: 'データ保持', status: 'compliant', details: '自動データ削除ポリシー適用中' },
      { name: 'プライバシー監査', status: 'compliant', details: '週次監査ログ確認実施' }
    ]
  },
  userConsent: {
    score: 95,
    totalUsers: 1923,
    consentGiven: 1827,
    pending: 96
  }
}

function EnterpriseAnalyticsContent() {
  const router = useRouter()
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [showAnonymizedData, setShowAnonymizedData] = useState(true)
  const [exportFormat, setExportFormat] = useState('pdf')

  const timeframes = [
    { id: '1month', label: '1ヶ月' },
    { id: '3months', label: '3ヶ月' },
    { id: '6months', label: '6ヶ月' },
    { id: '1year', label: '1年' }
  ]

  const departments = [
    { id: 'all', label: 'すべての部門' },
    ...departmentBreakdown.map(dept => ({ id: dept.name.toLowerCase(), label: dept.name }))
  ]

  const handleExportData = () => {
    // In production, this would generate and download reports
    console.log(`Exporting ${exportFormat.toUpperCase()} report for ${selectedTimeframe} timeframe`)
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <AppLayout title="企業分析ダッシュボード" showBackButton>
      <div className="px-4 py-6 space-y-6">
        
        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  {timeframes.map((timeframe) => (
                    <option key={timeframe.id} value={timeframe.id}>
                      {timeframe.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnonymizedData(!showAnonymizedData)}
                className="flex items-center space-x-2"
              >
                {showAnonymizedData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showAnonymizedData ? '匿名化表示' : '詳細表示'}</span>
              </Button>

              <div className="flex items-center space-x-2 ml-auto">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
                <Button onClick={handleExportData} size="sm" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>エクスポート</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {companyMetrics.activeUsers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">アクティブユーザー</div>
              <div className="text-xs text-green-600 mt-1">
                {((companyMetrics.activeUsers / companyMetrics.totalEmployees) * 100).toFixed(1)}% 参加率
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-pink-600">
                {companyMetrics.engagementRate}%
              </div>
              <div className="text-xs text-gray-600">エンゲージメント率</div>
              <div className="text-xs text-green-600 mt-1">+5.2% 前月比</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {companyMetrics.averageSessions}
              </div>
              <div className="text-xs text-gray-600">平均セッション数</div>
              <div className="text-xs text-green-600 mt-1">+0.3 前月比</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {companyMetrics.riskAlerts}
              </div>
              <div className="text-xs text-gray-600">リスクアラート</div>
              <div className="text-xs text-red-600 mt-1">+4 前月比</div>
            </CardContent>
          </Card>
        </div>

        {/* Wellbeing Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>ウェルビーング改善指標</span>
            </CardTitle>
            <CardDescription>
              過去6ヶ月間の従業員のメンタルヘルス改善状況
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">ストレス軽減</span>
                  <span className="text-sm text-green-600">+{companyMetrics.improvements.stressReduction}%</span>
                </div>
                <Progress value={companyMetrics.improvements.stressReduction} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">睡眠の質向上</span>
                  <span className="text-sm text-green-600">+{companyMetrics.improvements.sleepQuality}%</span>
                </div>
                <Progress value={companyMetrics.improvements.sleepQuality} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">チーム満足度</span>
                  <span className="text-sm text-green-600">+{companyMetrics.improvements.teamSatisfaction}%</span>
                </div>
                <Progress value={companyMetrics.improvements.teamSatisfaction} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>部門別分析</CardTitle>
            <CardDescription>
              各部門のエンゲージメントとリスクレベル
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentBreakdown.map((dept) => (
                <div key={dept.name} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{dept.name}</h4>
                      <Badge className={`text-xs ${getRiskColor(dept.riskLevel)}`}>
                        {dept.riskLevel === 'high' ? '高リスク' : 
                         dept.riskLevel === 'medium' ? '中リスク' : '低リスク'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {dept.users}名
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>エンゲージメント</span>
                        <span>{dept.engagement}%</span>
                      </div>
                      <Progress value={dept.engagement} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>平均気分スコア</span>
                        <span>{dept.avgMood}/10</span>
                      </div>
                      <Progress value={dept.avgMood * 10} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>リスクアラート</span>
            </CardTitle>
            <CardDescription>
              AIが検出した潜在的なメンタルヘルスリスク
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskAlerts.map((alert) => (
              <div key={alert.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                    <div>
                      <h4 className="font-medium">{alert.department}</h4>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{alert.affectedUsers}名に影響</div>
                    <div>{new Date(alert.createdAt).toLocaleDateString('ja-JP')}</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded border border-blue-200 mt-3">
                  <h5 className="font-medium text-blue-800 text-sm mb-1">推奨アクション:</h5>
                  <p className="text-sm text-blue-700">{alert.recommendation}</p>
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">
                    詳細を見る
                  </Button>
                  <Button size="sm" variant="outline">
                    アクションプラン作成
                  </Button>
                  <Button size="sm" variant="outline">
                    専門家に相談
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>コンプライアンス状況</span>
            </CardTitle>
            <CardDescription>
              データ保護とプライバシー規制への準拠状況
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">データ保護スコア</span>
                <span className="text-lg font-bold text-green-600">
                  {complianceMetrics.dataProtection.score}/100
                </span>
              </div>
              <Progress value={complianceMetrics.dataProtection.score} className="h-3 mb-3" />
              
              <div className="grid grid-cols-1 gap-2">
                {complianceMetrics.dataProtection.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                      準拠
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">ユーザー同意取得状況</span>
                <span className="text-sm text-gray-600">
                  {complianceMetrics.userConsent.consentGiven}/{complianceMetrics.userConsent.totalUsers}
                </span>
              </div>
              <Progress 
                value={(complianceMetrics.userConsent.consentGiven / complianceMetrics.userConsent.totalUsers) * 100} 
                className="h-3" 
              />
              <div className="text-xs text-gray-600 mt-1">
                {complianceMetrics.userConsent.pending}名が同意待ち
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => alert('レポート機能は準備中です')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">詳細レポート</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => alert('コンプライアンス機能は準備中です')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Shield className="h-5 w-5" />
            <span className="text-xs">コンプライアンス</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

export default function EnterpriseAnalytics() {
  return (
    <AdminRoute requiredRole="enterprise-admin">
      <EnterpriseAnalyticsContent />
    </AdminRoute>
  )
}