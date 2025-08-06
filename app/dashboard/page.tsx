'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute' // 一時的に無効化
import { HealthMetricsCard } from '@/components/dashboard/HealthMetricsCard'
import { HealthTrendsChart } from '@/components/dashboard/HealthTrendsChart'
import { AIInsightsCard } from '@/components/dashboard/AIInsightsCard'
import { QuickHealthSummary } from '@/components/dashboard/QuickHealthSummary'
// import { useAuth } from '@/contexts/AuthContext' // 一時的に無効化
import { toast } from '@/hooks/use-toast'
import { 
  dashboardService, 
  type DashboardData,
  type HealthMetric,
  type HealthTrend,
  type AIInsight,
  type AIPrediction,
  type HealthStatus
} from '@/lib/dashboard'
import { generateSampleMetrics } from '@/components/dashboard/HealthMetricsCard'
import { generateSampleTrends } from '@/components/dashboard/HealthTrendsChart'
import { generateSampleInsights, generateSamplePredictions } from '@/components/dashboard/AIInsightsCard'
import { generateSampleHealthStatus, generateSampleQuickActions } from '@/components/dashboard/QuickHealthSummary'
import { Bell, Loader2, RefreshCw, Plus } from 'lucide-react'

function Dashboard() {
  const router = useRouter()
  // const { user } = useAuth() // 一時的に無効化
  const user = { name: 'テストユーザー' } // モックユーザー
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [aiPredictions, setAiPredictions] = useState<AIPrediction[]>([])
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // For now, use sample data until backend is fully connected
      // In production, this would call: const data = await dashboardService.getDashboardData()
      
      const sampleMetrics = generateSampleMetrics()
      const sampleTrends = generateSampleTrends()
      const sampleInsights = generateSampleInsights()
      const samplePredictions = generateSamplePredictions()
      const sampleStatus = generateSampleHealthStatus()

      setHealthMetrics(sampleMetrics)
      setHealthTrends(sampleTrends)
      setAiInsights(sampleInsights)
      setAiPredictions(samplePredictions)
      setHealthStatus(sampleStatus)

      // Try to load real data from API (gracefully handle failures)
      try {
        const realData = await dashboardService.getDashboardData()
        if (realData.healthMetrics.length > 0) {
          setHealthMetrics(realData.healthMetrics)
        }
        if (realData.healthTrends.length > 0) {
          setHealthTrends(realData.healthTrends)
        }
        if (realData.aiInsights.length > 0) {
          setAiInsights(realData.aiInsights)
        }
        if (realData.aiPredictions.length > 0) {
          setAiPredictions(realData.aiPredictions)
        }
        setHealthStatus(realData.healthStatus || sampleStatus)
      } catch (apiError) {
        console.log('Using sample data as API is not yet available:', apiError)
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast({
        title: "データ読み込みエラー",
        description: "ダッシュボードデータの読み込みに失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadDashboardData()
    setIsRefreshing(false)
    
    toast({
      title: "更新完了",
      description: "ダッシュボードデータを更新しました。",
    })
  }

  const handleMetricClick = (metricId: string) => {
    router.push(`/analytics?metric=${metricId}`)
  }

  const handleInsightClick = (insight: AIInsight) => {
    router.push(`/ai-insights/${insight.id}`)
  }

  const handleViewAllInsights = () => {
    router.push('/ai-insights')
  }

  const handleViewDetails = () => {
    router.push('/analytics')
  }

  if (isLoading && !healthStatus) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>健康データを読み込み中...</p>
        </div>
      </div>
    )
  }

  const quickActions = generateSampleQuickActions(router)

  return (
    // <ProtectedRoute requireAuth={true}> // 一時的に無効化
      <div className="min-h-screen bg-gray-800 text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-bold text-white">ダッシュボード</h1>
              <p className="text-sm text-gray-400">
                {user?.name}さんの健康サマリー
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-gray-300 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/notifications')}
                className="text-gray-300 hover:text-white relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Quick Health Summary */}
          {healthStatus && (
            <QuickHealthSummary
              status={healthStatus}
              quickActions={quickActions}
              userName={user?.name}
              onViewDetails={handleViewDetails}
            />
          )}

          {/* Health Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Metrics */}
            <HealthMetricsCard
              metrics={healthMetrics}
              onMetricClick={handleMetricClick}
            />

            {/* AI Insights */}
            <AIInsightsCard
              insights={aiInsights}
              predictions={aiPredictions}
              onInsightClick={handleInsightClick}
              onViewAll={handleViewAllInsights}
              isLoading={isLoading}
            />
          </div>

          {/* Health Trends Chart */}
          <HealthTrendsChart
            trends={healthTrends}
            timeRange="7d"
          />

          {/* Quick Actions */}
          <Card className="bg-gray-700/95 border-gray-600/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">クイックアクション</h3>
                <Button
                  size="sm"
                  onClick={() => router.push('/checkin')}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  データ記録
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={action.action}
                    className={`flex flex-col items-center p-4 rounded-lg border border-gray-600/50 hover:border-gray-500 transition-all duration-200 ${action.color}`}
                  >
                    <div className="text-white mb-2">{action.icon}</div>
                    <span className="text-white text-sm font-medium text-center">{action.title}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom spacing for navigation */}
          <div className="h-24"></div>
        </div>

        {/* Bottom Navigation */}
        <MobileBottomNav />
      </div>
    // </ProtectedRoute> // 一時的に無効化
  )
}

export default Dashboard