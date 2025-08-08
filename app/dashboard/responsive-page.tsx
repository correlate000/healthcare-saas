'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ResponsiveLayout } from '@/components/responsive/ResponsiveLayout'
import { ResponsiveCard } from '@/components/responsive/ResponsiveCard'
import { ResponsiveGrid } from '@/components/responsive/ResponsiveGrid'
import { HealthMetricsCard } from '@/components/dashboard/HealthMetricsCard'
import { HealthTrendsChart } from '@/components/dashboard/HealthTrendsChart'
import { InsightsCard } from '@/components/dashboard/AIInsightsCard'
import { QuickHealthSummary } from '@/components/dashboard/QuickHealthSummary'
import { useAuth } from '@/contexts/AuthContext'
import { useResponsive } from '@/hooks/useResponsive'
import { toast } from '@/hooks/use-toast'
import { 
  dashboardService, 
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
import { Bell, Loader2, RefreshCw, Plus, Activity, Heart, TrendingUp, Brain } from 'lucide-react'

export default function ResponsiveDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [aiPredictions, setAiPredictions] = useState<AIPrediction[]>([])
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load sample data
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

      // Try to load real data
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
        console.log('Using sample data:', apiError)
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

  const userData = user ? {
    name: user.name || 'ユーザー',
    email: user.email,
    avatar: user.avatar
  } : undefined

  if (isLoading && !healthStatus) {
    return (
      <ResponsiveLayout user={userData}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
            <p className="text-gray-600">健康データを読み込み中...</p>
          </div>
        </div>
      </ResponsiveLayout>
    )
  }

  const quickActions = generateSampleQuickActions(router)

  return (
    <ResponsiveLayout user={userData}>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              ダッシュボード
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {user?.name}さんの健康サマリー
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''} ${!isMobile && 'mr-2'}`} />
              {!isMobile && '更新'}
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => router.push('/notifications')}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              size={isMobile ? "sm" : "default"}
              onClick={() => router.push('/checkin')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className={`h-4 w-4 ${!isMobile && 'mr-2'}`} />
              {!isMobile && 'データ記録'}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Health Summary */}
      {healthStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <QuickHealthSummary
            status={healthStatus}
            quickActions={quickActions}
            userName={user?.name}
            onViewDetails={() => router.push('/analytics')}
          />
        </motion.div>
      )}

      {/* Main Content Grid */}
      <ResponsiveGrid
        cols={{
          mobile: 1,
          lg: 2
        }}
        gap="md"
        className="mb-6"
      >
        {/* Health Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <HealthMetricsCard
            metrics={healthMetrics}
            onMetricClick={(metricId) => router.push(`/analytics?metric=${metricId}`)}
          />
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <InsightsCard
            insights={aiInsights}
            predictions={aiPredictions}
            onInsightClick={(insight) => router.push(`/ai-insights/${insight.id}`)}
            onViewAll={() => router.push('/ai-insights')}
            isLoading={isLoading}
          />
        </motion.div>
      </ResponsiveGrid>

      {/* Health Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mb-6"
      >
        <HealthTrendsChart
          trends={healthTrends}
          timeRange="7d"
        />
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <ResponsiveCard>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            クイックアクション
          </h3>
          <ResponsiveGrid
            cols={{
              mobile: 2,
              sm: 2,
              md: 4
            }}
            gap="sm"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                onClick={action.action}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 min-h-[100px]"
              >
                <div className="mb-2 text-indigo-600">{action.icon}</div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {action.title}
                </span>
              </motion.button>
            ))}
          </ResponsiveGrid>
        </ResponsiveCard>
      </motion.div>

      {/* Mobile-specific stats cards */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-6 space-y-3"
        >
          <ResponsiveCard padding="sm" interactive onClick={() => router.push('/activity')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">今日の活動</p>
                  <p className="text-xs text-gray-500">8,245 歩</p>
                </div>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </ResponsiveCard>

          <ResponsiveCard padding="sm" interactive onClick={() => router.push('/vitals')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">心拍数</p>
                  <p className="text-xs text-gray-500">72 bpm</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">正常</span>
            </div>
          </ResponsiveCard>

          <ResponsiveCard padding="sm" interactive onClick={() => router.push('/mental-health')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">ストレスレベル</p>
                  <p className="text-xs text-gray-500">低い</p>
                </div>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-2 w-2 rounded-full ${
                      level <= 2 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </ResponsiveCard>
        </motion.div>
      )}
    </ResponsiveLayout>
  )
}