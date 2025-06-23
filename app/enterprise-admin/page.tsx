'use client'

import { useState } from 'react'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { 
  Building,
  Users,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Upload,
  Mail,
  Phone,
  Globe,
  Database,
  Key,
  Lock,
  Eye,
  UserPlus,
  UserMinus,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Target,
  Heart,
  Brain,
  Zap,
  Bell,
  FileText,
  Briefcase
} from 'lucide-react'

interface CompanySettings {
  basic: {
    name: string
    industry: string
    size: string
    location: string
    timezone: string
  }
  policies: {
    dataRetention: string
    anonymization: boolean
    externalSharing: boolean
    emergencyProtocols: boolean
    complianceLevel: 'basic' | 'standard' | 'enterprise'
  }
  features: {
    teamConnect: boolean
    aiCoaching: boolean
    analytics: boolean
    emergencyAlerts: boolean
    customBranding: boolean
    ssoIntegration: boolean
  }
  notifications: {
    managerAlerts: boolean
    riskNotifications: boolean
    weeklyReports: boolean
    usageAlerts: boolean
  }
}

interface Department {
  id: string
  name: string
  headCount: number
  activeUsers: number
  avgWellnessScore: number
  riskLevel: 'low' | 'medium' | 'high'
  trend: 'up' | 'down' | 'stable'
}

interface Manager {
  id: string
  name: string
  email: string
  department: string
  teamSize: number
  accessLevel: 'view' | 'manage' | 'admin'
  lastLogin: string
}

const defaultSettings: CompanySettings = {
  basic: {
    name: '株式会社テクノロジー',
    industry: 'IT・ソフトウェア',
    size: '500-1000名',
    location: '東京',
    timezone: 'Asia/Tokyo'
  },
  policies: {
    dataRetention: '5年間',
    anonymization: true,
    externalSharing: false,
    emergencyProtocols: true,
    complianceLevel: 'enterprise'
  },
  features: {
    teamConnect: true,
    aiCoaching: true,
    analytics: true,
    emergencyAlerts: true,
    customBranding: true,
    ssoIntegration: true
  },
  notifications: {
    managerAlerts: true,
    riskNotifications: true,
    weeklyReports: true,
    usageAlerts: false
  }
}

const departments: Department[] = [
  {
    id: '1',
    name: '開発部',
    headCount: 120,
    activeUsers: 89,
    avgWellnessScore: 72,
    riskLevel: 'medium',
    trend: 'up'
  },
  {
    id: '2',
    name: '営業部',
    headCount: 85,
    activeUsers: 67,
    avgWellnessScore: 68,
    riskLevel: 'medium',
    trend: 'down'
  },
  {
    id: '3',
    name: 'マーケティング部',
    headCount: 45,
    activeUsers: 42,
    avgWellnessScore: 81,
    riskLevel: 'low',
    trend: 'stable'
  },
  {
    id: '4',
    name: '人事部',
    headCount: 25,
    activeUsers: 23,
    avgWellnessScore: 79,
    riskLevel: 'low',
    trend: 'up'
  },
  {
    id: '5',
    name: 'カスタマーサポート',
    headCount: 35,
    activeUsers: 28,
    avgWellnessScore: 65,
    riskLevel: 'high',
    trend: 'down'
  }
]

const managers: Manager[] = [
  {
    id: '1',
    name: '田中 太郎',
    email: 'tanaka@company.com',
    department: '開発部',
    teamSize: 15,
    accessLevel: 'manage',
    lastLogin: '2時間前'
  },
  {
    id: '2',
    name: '佐藤 花子',
    email: 'sato@company.com',
    department: '営業部',
    teamSize: 12,
    accessLevel: 'view',
    lastLogin: '1日前'
  },
  {
    id: '3',
    name: '山田 次郎',
    email: 'yamada@company.com',
    department: 'マーケティング部',
    teamSize: 8,
    accessLevel: 'admin',
    lastLogin: '30分前'
  }
]

function EnterpriseAdminContent() {
  const [settings, setSettings] = useState(defaultSettings)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'stable': return <Activity className="w-4 h-4 text-gray-600" />
      default: return null
    }
  }

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'admin': return <Badge className="bg-red-100 text-red-700">管理者</Badge>
      case 'manage': return <Badge className="bg-blue-100 text-blue-700">マネージャー</Badge>
      case 'view': return <Badge className="bg-gray-100 text-gray-700">閲覧者</Badge>
      default: return null
    }
  }

  const getComplianceBadge = (level: string) => {
    switch (level) {
      case 'enterprise': return <Badge className="bg-purple-100 text-purple-700">エンタープライズ</Badge>
      case 'standard': return <Badge className="bg-blue-100 text-blue-700">スタンダード</Badge>
      case 'basic': return <Badge className="bg-gray-100 text-gray-700">ベーシック</Badge>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Building className="w-6 h-6 mr-2" />
                企業管理コンソール
              </h1>
              <p className="text-purple-100">組織全体のメンタルヘルス状況を管理・監視</p>
            </div>
            <div className="flex items-center space-x-2">
              {getComplianceBadge(settings.policies.complianceLevel)}
              <Badge className="bg-white/20 text-white border border-white/30">
                <Shield className="w-3 h-3 mr-1" />
                セキュア
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">73%</div>
              <div className="text-sm text-purple-100">アクティブ率</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">72</div>
              <div className="text-sm text-purple-100">平均スコア</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">249</div>
              <div className="text-sm text-purple-100">ユーザー数</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">5</div>
              <div className="text-sm text-purple-100">リスクアラート</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="departments">部署</TabsTrigger>
            <TabsTrigger value="managers">管理者</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
            <TabsTrigger value="compliance">コンプライアンス</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">月間利用状況</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">+12%</div>
                  <p className="text-xs text-green-600">先月比</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">平均ウェルネススコア</span>
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">72</div>
                  <p className="text-xs text-gray-500">100点満点</p>
                </CardContent>
              </Card>
            </div>

            {/* Risk Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  リスクアラート
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    department: 'カスタマーサポート',
                    issue: '平均ストレスレベルが基準値を上回っています',
                    severity: 'high',
                    time: '2時間前'
                  },
                  {
                    department: '営業部',
                    issue: 'チェックイン率が低下しています',
                    severity: 'medium',
                    time: '5時間前'
                  },
                  {
                    department: '開発部',
                    issue: '残業時間の増加に伴うストレス上昇',
                    severity: 'medium',
                    time: '1日前'
                  }
                ].map((alert, index) => (
                  <Card key={index} className={`border-l-4 ${
                    alert.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                    alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                    'border-l-green-500 bg-green-50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{alert.department}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.issue}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {alert.severity === 'high' ? '高' :
                             alert.severity === 'medium' ? '中' : '低'}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>クイックアクション</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
                    <Download className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-600">レポート出力</span>
                  </Button>
                  
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
                    <UserPlus className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600">管理者追加</span>
                  </Button>

                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
                    <Bell className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-600">アラート設定</span>
                  </Button>

                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
                    <Settings className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-purple-600">ポリシー管理</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>部署別分析</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      フィルター
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      エクスポート
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept) => (
                  <Card key={dept.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                            <span>{dept.name}</span>
                            {getTrendIcon(dept.trend)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {dept.activeUsers}/{dept.headCount} 名がアクティブ
                          </p>
                        </div>
                        <Badge className={getRiskColor(dept.riskLevel)}>
                          {dept.riskLevel === 'high' ? '要注意' :
                           dept.riskLevel === 'medium' ? '注意' : '良好'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-gray-900">{dept.avgWellnessScore}</div>
                          <div className="text-xs text-gray-600">ウェルネススコア</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-gray-900">
                            {Math.round((dept.activeUsers / dept.headCount) * 100)}%
                          </div>
                          <div className="text-xs text-gray-600">利用率</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-gray-900">{dept.headCount}</div>
                          <div className="text-xs text-gray-600">在籍数</div>
                        </div>
                      </div>

                      <Progress value={dept.avgWellnessScore} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Managers Tab */}
          <TabsContent value="managers" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>管理者一覧</span>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    管理者追加
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {managers.map((manager) => (
                  <Card key={manager.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {manager.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{manager.name}</h4>
                            <p className="text-sm text-gray-600">{manager.email}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{manager.department}</span>
                              <span>チーム: {manager.teamSize}名</span>
                              <span>最終ログイン: {manager.lastLogin}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getAccessLevelBadge(manager.accessLevel)}
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>権限管理</CardTitle>
                <CardDescription>
                  管理者の権限レベルと許可される操作
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { level: 'admin', name: '管理者', permissions: ['全データアクセス', 'ユーザー管理', '設定変更', 'レポート作成'] },
                    { level: 'manage', name: 'マネージャー', permissions: ['チームデータ閲覧', '基本レポート', 'アラート受信'] },
                    { level: 'view', name: '閲覧者', permissions: ['基本統計閲覧', 'サマリーレポート'] }
                  ].map((role, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{role.name}</h4>
                        {getAccessLevelBadge(role.level)}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>基本設定</span>
                  {isEditing ? (
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-1" />
                        キャンセル
                      </Button>
                      <Button size="sm" onClick={() => setIsEditing(false)}>
                        <Save className="w-4 h-4 mr-1" />
                        保存
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      編集
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">企業名</label>
                    <Input 
                      value={settings.basic.name}
                      disabled={!isEditing}
                      onChange={(e) => setSettings({
                        ...settings,
                        basic: { ...settings.basic, name: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">業界</label>
                    <Input 
                      value={settings.basic.industry}
                      disabled={!isEditing}
                      onChange={(e) => setSettings({
                        ...settings,
                        basic: { ...settings.basic, industry: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">規模</label>
                    <Input 
                      value={settings.basic.size}
                      disabled={!isEditing}
                      onChange={(e) => setSettings({
                        ...settings,
                        basic: { ...settings.basic, size: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">所在地</label>
                    <Input 
                      value={settings.basic.location}
                      disabled={!isEditing}
                      onChange={(e) => setSettings({
                        ...settings,
                        basic: { ...settings.basic, location: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>機能設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key === 'teamConnect' ? 'チームつながり機能' :
                         key === 'aiCoaching' ? 'AIコーチング' :
                         key === 'analytics' ? '分析機能' :
                         key === 'emergencyAlerts' ? '緊急アラート' :
                         key === 'customBranding' ? 'カスタムブランディング' :
                         key === 'ssoIntegration' ? 'SSO統合' : key}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === 'teamConnect' ? '匿名での社内コミュニティ機能' :
                         key === 'aiCoaching' ? 'AI による個別コーチング' :
                         key === 'analytics' ? '詳細な分析レポート機能' :
                         key === 'emergencyAlerts' ? '緊急時の自動通知システム' :
                         key === 'customBranding' ? '企業ロゴとカラーの適用' :
                         key === 'ssoIntegration' ? 'シングルサインオン連携' : '機能の説明'}
                      </p>
                    </div>
                    <Switch 
                      checked={value}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        features: { ...settings.features, [key]: checked }
                      })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>通知設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key === 'managerAlerts' ? '管理者アラート' :
                         key === 'riskNotifications' ? 'リスク通知' :
                         key === 'weeklyReports' ? '週次レポート' :
                         key === 'usageAlerts' ? '利用状況アラート' : key}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === 'managerAlerts' ? 'チームの状況を管理者に通知' :
                         key === 'riskNotifications' ? '高リスク状況の即座な通知' :
                         key === 'weeklyReports' ? '週次の集計レポートを送信' :
                         key === 'usageAlerts' ? '利用率低下時の通知' : '通知の説明'}
                      </p>
                    </div>
                    <Switch 
                      checked={value}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, [key]: checked }
                      })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  コンプライアンス状況
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-900">GDPR準拠</div>
                    <div className="text-xs text-green-600">適合</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-900">ISO27001</div>
                    <div className="text-xs text-green-600">認証取得</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { item: 'データ暗号化', status: 'compliant', description: 'AES-256による暗号化実装済み' },
                    { item: 'アクセス制御', status: 'compliant', description: 'ロールベースアクセス制御実装' },
                    { item: 'データ保存期間', status: 'compliant', description: '法定期間での自動削除設定' },
                    { item: '監査ログ', status: 'compliant', description: '全アクティビティの記録と保持' },
                    { item: 'データ処理同意', status: 'compliant', description: '明示的同意の取得と管理' }
                  ].map((compliance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{compliance.item}</h4>
                          <p className="text-sm text-gray-600">{compliance.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">適合</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>データポリシー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">データ匿名化</h4>
                      <p className="text-sm text-gray-600">個人識別情報の自動匿名化</p>
                    </div>
                    <Switch 
                      checked={settings.policies.anonymization}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        policies: { ...settings.policies, anonymization: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">外部データ共有</h4>
                      <p className="text-sm text-gray-600">第三者との匿名データ共有</p>
                    </div>
                    <Switch 
                      checked={settings.policies.externalSharing}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        policies: { ...settings.policies, externalSharing: checked }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">緊急時プロトコル</h4>
                      <p className="text-sm text-gray-600">緊急事態時の情報共有プロトコル</p>
                    </div>
                    <Switch 
                      checked={settings.policies.emergencyProtocols}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        policies: { ...settings.policies, emergencyProtocols: checked }
                      })}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">データ保存期間</span>
                    <Badge variant="outline">{settings.policies.dataRetention}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>監査とレポート</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  コンプライアンス監査レポート
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  データ処理記録
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  アクセスログ詳細
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function EnterpriseAdmin() {
  return (
    <AdminRoute requiredRole="enterprise-admin">
      <EnterpriseAdminContent />
    </AdminRoute>
  )
}