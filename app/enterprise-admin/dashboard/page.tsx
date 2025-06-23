'use client'

import { useState, useEffect } from 'react'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AppLayout } from '@/components/layout/AppLayout'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Heart, 
  AlertTriangle,
  Calendar,
  BarChart3,
  Download,
  RefreshCw,
  Building2,
  Shield,
  Clock,
  Target,
  Award,
  Activity,
  Zap,
  Smile,
  BookOpen,
  MessageSquare,
  PieChart
} from 'lucide-react'
import { CountUpAnimation } from '@/components/ui/micro-interactions'

interface CompanyMetrics {
  overview: {
    totalUsers: number
    activeUsers: number
    engagementRate: number
    averageMoodScore: number
  }
  wellbeing: {
    stressLevels: {
      low: number
      medium: number
      high: number
    }
    moodTrends: {
      improving: number
      stable: number
      declining: number
    }
    riskAlerts: number
  }
  usage: {
    dailyCheckins: number
    aiConversations: number
    contentInteractions: number
    peakUsageHours: string[]
  }
  departments: {
    name: string
    participationRate: number
    averageMood: number
    riskLevel: 'low' | 'medium' | 'high'
  }[]
  trends: {
    weeklyEngagement: number[]
    moodProgression: number[]
    stressReduction: number
  }
}

// サンプルデータ（実際の実装では暗号化されたAPIから取得）
const sampleMetrics: CompanyMetrics = {
  overview: {
    totalUsers: 247,
    activeUsers: 189,
    engagementRate: 76.5,
    averageMoodScore: 7.2
  },
  wellbeing: {
    stressLevels: {
      low: 45,
      medium: 38,
      high: 17
    },
    moodTrends: {
      improving: 62,
      stable: 28,
      declining: 10
    },
    riskAlerts: 3
  },
  usage: {
    dailyCheckins: 156,
    aiConversations: 89,
    contentInteractions: 234,
    peakUsageHours: ['09:00', '12:00', '18:00']
  },
  departments: [
    { name: 'エンジニアリング', participationRate: 82, averageMood: 7.1, riskLevel: 'low' },
    { name: '営業', participationRate: 71, averageMood: 6.8, riskLevel: 'medium' },
    { name: 'マーケティング', participationRate: 89, averageMood: 7.5, riskLevel: 'low' },
    { name: '人事・総務', participationRate: 94, averageMood: 7.8, riskLevel: 'low' },
    { name: 'ファイナンス', participationRate: 65, averageMood: 6.5, riskLevel: 'medium' }
  ],
  trends: {
    weeklyEngagement: [68, 72, 71, 75, 77, 76, 79],
    moodProgression: [6.8, 6.9, 7.0, 7.1, 7.2, 7.1, 7.2],
    stressReduction: 23.5
  }
}

function EnterpriseDashboardContent() {
  const [metrics, setMetrics] = useState<CompanyMetrics>(sampleMetrics)
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(false)

  const refreshData = async () => {
    setLoading(true)
    // 実際の実装では暗号化されたAPIからデータを取得
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const exportReport = () => {
    // CSV/PDF形式での統計レポート出力
    const data = {
      generated: new Date().toISOString(),
      timeRange,
      metrics: {
        ...metrics,
        // 個人情報は一切含まない集計データのみ
      }
    }
    
    console.log('Exporting report:', data)
    // 実際の実装では暗号化されたレポートを生成
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'high': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-50 border-green-200'
      case 'medium': return 'bg-yellow-50 border-yellow-200'
      case 'high': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <AppLayout title="企業統計ダッシュボード">
      <div className="px-4 py-6 max-w-6xl mx-auto">
        
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ウェルビーイング統計</h1>
            <p className="text-gray-600">匿名化された従業員のメンタルヘルス指標</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">過去7日</option>
              <option value="30d">過去30日</option>
              <option value="90d">過去90日</option>
            </select>
            
            <Button
              onClick={refreshData}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              更新
            </Button>
            
            <Button onClick={exportReport} size="sm">
              <Download className="h-4 w-4 mr-2" />
              レポート出力
            </Button>
          </div>
        </div>

        {/* プライバシー保護通知 */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">🔒 プライバシー保護</h4>
                <p className="text-sm text-blue-700">
                  すべてのデータは完全に匿名化されており、個人を特定することは一切できません。
                  統計は暗号化された集計処理により生成されています。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 総利用者数 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">総利用者数</p>
                    <CountUpAnimation
                      from={0}
                      to={metrics.overview.totalUsers}
                      className="text-2xl font-bold text-gray-900"
                    />
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12% 前月比</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* アクティブユーザー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">アクティブユーザー</p>
                    <CountUpAnimation
                      from={0}
                      to={metrics.overview.activeUsers}
                      className="text-2xl font-bold text-gray-900"
                    />
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">
                    参加率: {((metrics.overview.activeUsers / metrics.overview.totalUsers) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 平均気分スコア */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">平均気分スコア</p>
                    <CountUpAnimation
                      from={0}
                      to={metrics.overview.averageMoodScore * 10}
                      suffix="/10"
                      className="text-2xl font-bold text-gray-900"
                    />
                  </div>
                  <Heart className="h-8 w-8 text-pink-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+0.3 前週比</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* リスクアラート */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">要注意アラート</p>
                    <CountUpAnimation
                      from={0}
                      to={metrics.wellbeing.riskAlerts}
                      className="text-2xl font-bold text-gray-900"
                    />
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">匿名化済み</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* ストレスレベル分布 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>ストレスレベル分布</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm">低ストレス</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CountUpAnimation
                        from={0}
                        to={metrics.wellbeing.stressLevels.low}
                        suffix="%"
                        className="font-semibold"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm">中程度</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CountUpAnimation
                        from={0}
                        to={metrics.wellbeing.stressLevels.medium}
                        suffix="%"
                        className="font-semibold"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm">高ストレス</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CountUpAnimation
                        from={0}
                        to={metrics.wellbeing.stressLevels.high}
                        suffix="%"
                        className="font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500"
                        style={{ width: `${metrics.wellbeing.stressLevels.low}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-500"
                        style={{ width: `${metrics.wellbeing.stressLevels.medium}%` }}
                      ></div>
                      <div 
                        className="bg-red-500"
                        style={{ width: `${metrics.wellbeing.stressLevels.high}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 利用状況サマリー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>本日の利用状況</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-pink-500" />
                      <span className="text-sm">気分チェック</span>
                    </div>
                    <CountUpAnimation
                      from={0}
                      to={metrics.usage.dailyCheckins}
                      className="font-semibold"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">AI会話</span>
                    </div>
                    <CountUpAnimation
                      from={0}
                      to={metrics.usage.aiConversations}
                      className="font-semibold"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-green-500" />
                      <span className="text-sm">コンテンツ閲覧</span>
                    </div>
                    <CountUpAnimation
                      from={0}
                      to={metrics.usage.contentInteractions}
                      className="font-semibold"
                    />
                  </div>
                </div>

                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">ピーク利用時間</div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {metrics.usage.peakUsageHours.join(', ')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 部門別統計 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>部門別ウェルビーイング指標</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium text-gray-700">部門</th>
                      <th className="text-center py-3 font-medium text-gray-700">参加率</th>
                      <th className="text-center py-3 font-medium text-gray-700">平均気分</th>
                      <th className="text-center py-3 font-medium text-gray-700">リスクレベル</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.departments.map((dept, index) => (
                      <motion.tr
                        key={dept.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-4 font-medium">{dept.name}</td>
                        <td className="text-center py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${dept.participationRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{dept.participationRate}%</span>
                          </div>
                        </td>
                        <td className="text-center py-4">
                          <span className="font-semibold">{dept.averageMood}/10</span>
                        </td>
                        <td className="text-center py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            dept.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                            dept.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {dept.riskLevel === 'low' ? '良好' :
                             dept.riskLevel === 'medium' ? '注意' : '要ケア'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 改善効果 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    📈 MindCare導入効果
                  </h3>
                  <div className="space-y-2 text-sm text-green-700">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>ストレス軽減: </span>
                      <CountUpAnimation
                        from={0}
                        to={metrics.trends.stressReduction}
                        suffix="%"
                        className="font-semibold"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smile className="h-4 w-4" />
                      <span>気分改善者: {metrics.wellbeing.moodTrends.improving}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>継続利用率: {metrics.overview.engagementRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl text-green-600 font-bold">
                    <CountUpAnimation
                      from={0}
                      to={8.2}
                      className="text-3xl text-green-600 font-bold"
                    />
                  </div>
                  <div className="text-sm text-green-600">総合満足度/10</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}

export default function EnterpriseDashboard() {
  return (
    <AdminRoute requiredRole="enterprise-admin">
      <EnterpriseDashboardContent />
    </AdminRoute>
  )
}