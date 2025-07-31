'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Clock,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react'

// Wireframe data matching page 1
const dashboardData = {
  totalUsers: 247,
  activeUsers: 189,
  avgMoodScore: 72,
  riskAlerts: 3,
  totalSatisfaction: 8.0,
  weeklyGrowth: 0.3,
  monthlyGrowth: 12,
  participationRate: 76.5,
  departments: [
    { name: 'エンジニア', participation: 82, avgMood: '7.1/10', riskLevel: '良好', riskColor: 'green' },
    { name: '営業', participation: 71, avgMood: '6.8/10', riskLevel: '注意', riskColor: 'yellow' },
    { name: 'マーケティング', participation: 89, avgMood: '7.5/10', riskLevel: '良好', riskColor: 'green' },
    { name: '人事・総務', participation: 94, avgMood: '7.8/10', riskLevel: '良好', riskColor: 'green' },
    { name: 'ファイナンス', participation: 85, avgMood: '6.5/10', riskLevel: '注意', riskColor: 'yellow' }
  ],
  todayUsage: [
    { type: '気分チェック', count: 156, percentage: 45 },
    { type: 'AI会話', count: 89, percentage: 38 },
    { type: 'コンテンツ閲覧', count: 234, percentage: 17 }
  ],
  stressDistribution: [
    { level: '低ストレス', percentage: 45, color: 'bg-green-500' },
    { level: '中程度', percentage: 38, color: 'bg-yellow-500' },
    { level: '高ストレス', percentage: 17, color: 'bg-red-500' }
  ],
  impactMetrics: {
    stressReduction: 24,
    moodImprovement: 62,
    continuationRate: 76.5
  },
  peakUsageHours: '09:00 / 12:00 / 18:00'
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('過去7日')

  const getRiskBadgeClass = (riskColor: string) => {
    switch (riskColor) {
      case 'green': return 'bg-green-100 text-green-800'
      case 'yellow': return 'bg-yellow-100 text-yellow-800'
      case 'red': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ウェルビーイング統計</h1>
          <p className="text-sm text-gray-600">匿名化された従業員のメンタルヘルス指標</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option>過去7日</option>
            <option>過去30日</option>
            <option>過去3ヶ月</option>
          </select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            更新
          </Button>
          <Button size="sm" className="bg-gray-900 text-white">
            <Download className="w-4 h-4 mr-2" />
            レポート出力
          </Button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">🔒 プライバシー保護</h3>
          <p className="text-sm text-gray-700">
            すべてのデータは完全に匿名化されており、個人を特定することは一切できません。統計は暗号化された集計処理により生成されています。
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総利用者数</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.totalUsers}</p>
              <p className="text-sm text-green-600">+{dashboardData.monthlyGrowth}% 前月比</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">アクティブユーザー</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.activeUsers}</p>
              <p className="text-sm text-gray-500">参加率: {dashboardData.participationRate}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均気分スコア</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.avgMoodScore}</p>
              <p className="text-sm text-green-600">+{dashboardData.weeklyGrowth} 前週比</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">要注意アラート</p>
              <p className="text-2xl font-bold text-red-600">{dashboardData.riskAlerts}</p>
              <p className="text-sm text-gray-500">匿名化済み</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Analysis */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">部門別ウェルビーイング指標</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 pb-2">
                <div>部門</div>
                <div>参加率</div>
                <div>平均気分</div>
                <div>リスクレベル</div>
              </div>
              {dashboardData.departments.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="grid grid-cols-4 gap-4 items-center py-3 border-t border-gray-100"
                >
                  <div className="font-medium text-gray-900">{dept.name}</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gray-800"
                        style={{ width: `${dept.participation}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{dept.participation}%</span>
                  </div>
                  <div className="text-sm text-gray-700">{dept.avgMood}</div>
                  <div>
                    <Badge className={getRiskBadgeClass(dept.riskColor)}>
                      {dept.riskLevel}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Impact Results */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                🔒 導入効果
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{dashboardData.totalSatisfaction}/10</p>
                    <p className="text-sm text-gray-600">総合満足度</p>
                    <p className="text-xs text-green-600">+{dashboardData.weeklyGrowth} 前週比</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ストレス軽減:</span>
                    <span className="text-sm font-medium">{dashboardData.impactMetrics.stressReduction}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">気分改善者:</span>
                    <span className="text-sm font-medium">{dashboardData.impactMetrics.moodImprovement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">継続利用率:</span>
                    <span className="text-sm font-medium">{dashboardData.impactMetrics.continuationRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Usage */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">本日の利用状況</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.todayUsage.map((usage, index) => (
                  <div key={usage.type} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-800 rounded-full" />
                      <span className="text-sm text-gray-700">{usage.type}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{usage.count}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ピーク利用時間</span>
                    <span className="font-medium">{dashboardData.peakUsageHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stress Level Distribution */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">ストレスレベル分布</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.stressDistribution.map((level, index) => (
                  <div key={level.level} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${level.color} rounded-full`} />
                      <span className="text-sm text-gray-700">{level.level}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{level.percentage}%</span>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
                    <div className="bg-green-500 h-2" style={{ width: '45%' }} />
                    <div className="bg-yellow-500 h-2" style={{ width: '38%' }} />
                    <div className="bg-red-500 h-2" style={{ width: '17%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}