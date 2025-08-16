'use client'

import { useState, useEffect } from 'react'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AppLayout } from '@/components/layout/AppLayout'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  Activity,
  Calendar,
  Award,
  Target,
  ChevronUp,
  ChevronDown,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { CountUpAnimation } from '@/components/ui/micro-interactions'

interface ROIMetrics {
  financial: {
    monthlyCost: number
    estimatedSavings: number
    sickLeaveDaysReduced: number
    productivityGain: number
    turnoverRateChange: number
    roi: number
  }
  productivity: {
    focusTimeIncrease: number
    taskCompletionRate: number
    meetingEfficiency: number
    collaborationScore: number
    engagementIndex: number
  }
  health: {
    stressReduction: number
    burnoutRiskDecrease: number
    wellbeingScore: number
    sleepQualityImprovement: number
    physicalActivityIncrease: number
  }
  comparison: {
    industry: {
      stressLevel: number
      productivity: number
      turnover: number
    }
    beforeAfter: {
      stress: { before: number, after: number }
      productivity: { before: number, after: number }
      sickDays: { before: number, after: number }
    }
  }
}

const sampleROIData: ROIMetrics = {
  financial: {
    monthlyCost: 12500,
    estimatedSavings: 45000,
    sickLeaveDaysReduced: 124,
    productivityGain: 18.5,
    turnoverRateChange: -3.2,
    roi: 260
  },
  productivity: {
    focusTimeIncrease: 23,
    taskCompletionRate: 87,
    meetingEfficiency: 15,
    collaborationScore: 8.2,
    engagementIndex: 76
  },
  health: {
    stressReduction: 31,
    burnoutRiskDecrease: 42,
    wellbeingScore: 7.8,
    sleepQualityImprovement: 28,
    physicalActivityIncrease: 35
  },
  comparison: {
    industry: {
      stressLevel: -22,
      productivity: 15,
      turnover: -18
    },
    beforeAfter: {
      stress: { before: 6.8, after: 4.7 },
      productivity: { before: 68, after: 81 },
      sickDays: { before: 8.2, after: 5.1 }
    }
  }
}

function ROIDashboardContent() {
  const [metrics, setMetrics] = useState<ROIMetrics>(sampleROIData)
  const [timeframe, setTimeframe] = useState('quarter')
  const [showDetails, setShowDetails] = useState(false)

  const calculateAnnualSavings = () => {
    const sickDaySavings = metrics.financial.sickLeaveDaysReduced * 450 // 1日あたり45,000円の損失と仮定
    const turnoverSavings = Math.abs(metrics.financial.turnoverRateChange) * 10 * 1500000 // 離職1人あたり150万円のコスト
    const productivitySavings = (metrics.financial.productivityGain / 100) * 250 * 45000 * 12 // 従業員250人の給与ベース
    return sickDaySavings + turnoverSavings + productivitySavings
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <AppLayout title="ROI分析ダッシュボード">
      <div className="px-4 py-6 max-w-7xl mx-auto">
        
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">投資対効果（ROI）分析</h1>
          <p className="text-gray-600">MindCare導入による定量的な効果測定</p>
        </div>

        {/* 期間選択 */}
        <div className="flex items-center gap-4 mb-6">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="month">月次</option>
            <option value="quarter">四半期</option>
            <option value="year">年次</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            レポート出力
          </Button>
        </div>

        {/* メインROI指標 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    <CountUpAnimation
                      from={0}
                      to={metrics.financial.roi}
                      suffix="%"
                      className="text-4xl font-bold text-green-600"
                    />
                  </div>
                  <div className="text-lg font-semibold text-gray-700">投資収益率</div>
                  <div className="text-sm text-gray-600 mt-1">3.6倍の投資効果</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatCurrency(calculateAnnualSavings())}
                  </div>
                  <div className="text-lg font-semibold text-gray-700">年間削減コスト</div>
                  <div className="text-sm text-gray-600 mt-1">推定値</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    <CountUpAnimation
                      from={0}
                      to={metrics.financial.productivityGain}
                      suffix="%"
                      className="text-3xl font-bold text-purple-600"
                    />
                  </div>
                  <div className="text-lg font-semibold text-gray-700">生産性向上</div>
                  <div className="text-sm text-gray-600 mt-1">前年同期比</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 詳細メトリクス */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* 財務インパクト */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    財務インパクト
                  </span>
                  <span className="text-sm font-normal text-green-600">
                    +{formatCurrency(metrics.financial.estimatedSavings)}/月
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">病欠日数削減</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{metrics.financial.sickLeaveDaysReduced}日</span>
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">離職率改善</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{Math.abs(metrics.financial.turnoverRateChange)}%</span>
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">採用コスト削減</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{formatCurrency(4500000)}</span>
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">投資回収期間</span>
                      <span className="text-lg font-bold text-green-600">3.8ヶ月</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 生産性指標 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  生産性指標
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">集中時間の増加</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">+{metrics.productivity.focusTimeIncrease}%</span>
                      <ArrowUpRight className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">タスク完了率</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{metrics.productivity.taskCompletionRate}%</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${metrics.productivity.taskCompletionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">会議効率化</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">+{metrics.productivity.meetingEfficiency}%</span>
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">エンゲージメント指数</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{metrics.productivity.engagementIndex}%</span>
                      <Target className="h-4 w-4 text-purple-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Before/After比較 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>導入前後の比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-3">ストレスレベル</div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">
                        {metrics.comparison.beforeAfter.stress.before}
                      </div>
                      <div className="text-xs text-gray-500">導入前</div>
                    </div>
                    <ArrowDownRight className="h-6 w-6 text-green-500" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {metrics.comparison.beforeAfter.stress.after}
                      </div>
                      <div className="text-xs text-gray-500">導入後</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-green-600 font-semibold">
                    31%改善
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-3">生産性スコア</div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-500">
                        {metrics.comparison.beforeAfter.productivity.before}
                      </div>
                      <div className="text-xs text-gray-500">導入前</div>
                    </div>
                    <ArrowUpRight className="h-6 w-6 text-blue-500" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {metrics.comparison.beforeAfter.productivity.after}
                      </div>
                      <div className="text-xs text-gray-500">導入後</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-blue-600 font-semibold">
                    19%向上
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-3">病欠日数（月平均）</div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {metrics.comparison.beforeAfter.sickDays.before}
                      </div>
                      <div className="text-xs text-gray-500">導入前</div>
                    </div>
                    <ArrowDownRight className="h-6 w-6 text-green-500" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {metrics.comparison.beforeAfter.sickDays.after}
                      </div>
                      <div className="text-xs text-gray-500">導入後</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-green-600 font-semibold">
                    38%削減
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 業界比較 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>業界平均との比較</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">ストレスレベル</span>
                    <span className="text-sm text-green-600 font-semibold">
                      業界平均より{Math.abs(metrics.comparison.industry.stressLevel)}%低い
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                      style={{ width: `${100 - Math.abs(metrics.comparison.industry.stressLevel)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">生産性</span>
                    <span className="text-sm text-blue-600 font-semibold">
                      業界平均より{metrics.comparison.industry.productivity}%高い
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                      style={{ width: `${Math.min(100, 50 + metrics.comparison.industry.productivity)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">離職率</span>
                    <span className="text-sm text-purple-600 font-semibold">
                      業界平均より{Math.abs(metrics.comparison.industry.turnover)}%低い
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full"
                      style={{ width: `${100 - Math.abs(metrics.comparison.industry.turnover)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-900">業界トップクラスの成果</div>
                    <div className="text-sm text-blue-700 mt-1">
                      貴社のメンタルヘルス指標は業界上位15%に位置しています
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}

export default function EnterpriseROIDashboard() {
  return (
    <AdminRoute requiredRole="enterprise-admin">
      <ROIDashboardContent />
    </AdminRoute>
  )
}