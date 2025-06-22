'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Download,
  ArrowUp,
  ArrowDown,
  Activity,
  Calendar,
  BarChart3,
  Settings,
  Filter
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock organization data
const orgData = {
  totalEmployees: 1247,
  activeUsers: 892,
  checkinRate: 71.5,
  riskAlerts: 8,
  averageMood: 3.6,
  wellnessScore: 78,
  monthlyGrowth: 12.3,
  departments: [
    { name: '営業部', employees: 156, checkinRate: 78, riskLevel: 'low', avgMood: 3.8 },
    { name: '開発部', employees: 203, checkinRate: 85, riskLevel: 'low', avgMood: 3.9 },
    { name: '人事部', employees: 45, checkinRate: 92, riskLevel: 'low', avgMood: 4.1 },
    { name: 'マーケティング部', employees: 89, checkinRate: 65, riskLevel: 'medium', avgMood: 3.2 },
    { name: 'サポート部', employees: 67, checkinRate: 58, riskLevel: 'high', avgMood: 2.9 },
  ],
  recentAlerts: [
    { id: 1, department: 'サポート部', type: 'low_mood', severity: 'high', time: '2時間前' },
    { id: 2, department: 'マーケティング部', type: 'stress_spike', severity: 'medium', time: '4時間前' },
    { id: 3, department: '営業部', type: 'engagement_drop', severity: 'medium', time: '6時間前' },
  ]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('7days')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_mood': return '😔'
      case 'stress_spike': return '⚡'
      case 'engagement_drop': return '📉'
      default: return '⚠️'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
              <p className="text-gray-600">組織全体のメンタルヘルス状況</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="7days">過去7日</option>
                <option value="30days">過去30日</option>
                <option value="90days">過去90日</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                レポート出力
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総従業員数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{orgData.totalEmployees.toLocaleString()}</div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+{orgData.monthlyGrowth}%</span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">アクティブユーザー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{orgData.activeUsers.toLocaleString()}</div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-600">{((orgData.activeUsers / orgData.totalEmployees) * 100).toFixed(1)}% 利用率</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">チェックイン率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{orgData.checkinRate}%</div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <Progress value={orgData.checkinRate} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">リスクアラート</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-red-600">{orgData.riskAlerts}</div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">-2</span>
                <span className="text-gray-500 ml-1">from yesterday</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wellness Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>組織ウェルネススコア</span>
              </CardTitle>
              <CardDescription>全体的なメンタルヘルス指標</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">総合スコア</span>
                  <span className="text-2xl font-bold text-green-600">{orgData.wellnessScore}/100</span>
                </div>
                <Progress value={orgData.wellnessScore} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{orgData.averageMood}</div>
                    <div className="text-sm text-gray-600">平均気分</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-sm text-gray-600">満足度</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>最近のアラート</span>
              </CardTitle>
              <CardDescription>要注意状況の早期発見</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orgData.recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{alert.department}</div>
                      <div className="text-sm text-gray-600">
                        {alert.type === 'low_mood' && '気分の低下を検知'}
                        {alert.type === 'stress_spike' && 'ストレス値の急上昇'}
                        {alert.type === 'engagement_drop' && 'エンゲージメント低下'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{alert.time}</div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                すべてのアラートを表示
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-500" />
                <span>部門別分析</span>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                フィルター
              </Button>
            </CardTitle>
            <CardDescription>各部門のメンタルヘルス状況</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">部門名</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">従業員数</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">チェックイン率</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">平均気分</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">リスクレベル</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {orgData.departments.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{dept.name}</td>
                      <td className="py-3 px-4">{dept.employees}名</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{width: `${dept.checkinRate}%`}}
                            />
                          </div>
                          <span className="text-sm">{dept.checkinRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{dept.avgMood}</span>
                          <span className="text-gray-500">/5</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(dept.riskLevel)}`}>
                          {dept.riskLevel === 'high' && '高リスク'}
                          {dept.riskLevel === 'medium' && '中リスク'}
                          {dept.riskLevel === 'low' && '低リスク'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-lg">月次レポート生成</CardTitle>
              <CardDescription>組織全体の詳細分析レポート</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-lg">プライバシー設定</CardTitle>
              <CardDescription>データ保護とアクセス権限管理</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <CardTitle className="text-lg">ユーザー管理</CardTitle>
              <CardDescription>従業員アカウントと権限設定</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}