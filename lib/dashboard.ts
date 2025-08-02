// Dashboard Service
// Centralized service for fetching and managing dashboard data
import { apiClient } from './api'

export interface DashboardData {
  healthMetrics: HealthMetric[]
  healthTrends: HealthTrend[]
  aiInsights: AIInsight[]
  aiPredictions: AIPrediction[]
  healthStatus: HealthStatus
  recentEntries: HealthDataEntry[]
  notifications: DashboardNotification[]
}

export interface HealthMetric {
  id: string
  name: string
  value: number | string
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  status: 'normal' | 'warning' | 'critical'
  lastUpdated: string
  icon: string
  color: string
}

export interface HealthTrend {
  id: string
  name: string
  data: TrendDataPoint[]
  unit: string
  color: string
  target?: number
  targetRange?: { min: number; max: number }
}

export interface TrendDataPoint {
  date: string
  value: number
  label?: string
}

export interface AIInsight {
  id: string
  title: string
  description: string
  category: 'risk_assessment' | 'recommendation' | 'prediction' | 'achievement'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  confidence: number
  actionable: boolean
  actions?: string[]
  relatedMetrics?: string[]
  timestamp: string
}

export interface AIPrediction {
  id: string
  title: string
  prediction: string
  timeframe: string
  confidence: number
  preventiveActions: string[]
}

export interface HealthStatus {
  overall: 'excellent' | 'good' | 'fair' | 'poor'
  score: number
  todayEntries: number
  lastEntry?: string
  streakDays: number
  weeklyGoalProgress: number
}

export interface HealthDataEntry {
  id: string
  type: string
  value: any
  timestamp: string
  category: string
}

export interface DashboardNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  actionUrl?: string
  timestamp: string
  read: boolean
}

class DashboardService {
  // Fetch complete dashboard data
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Fetch data in parallel
      const [
        healthProfileResponse,
        healthEntriesResponse,
        trendsResponse,
        aiInsightsResponse
      ] = await Promise.all([
        apiClient.getHealthProfile(),
        apiClient.getHealthDataEntries({ limit: 50 }),
        this.getHealthTrends(),
        this.getAIAnalysis()
      ])

      // Process health metrics
      const healthMetrics = this.processHealthMetrics(
        healthProfileResponse.data,
        healthEntriesResponse.data
      )

      // Process health trends
      const healthTrends = trendsResponse || []

      // Process health status
      const healthStatus = this.calculateHealthStatus(
        healthMetrics,
        healthEntriesResponse.data
      )

      // Get AI insights and predictions
      const aiInsights = aiInsightsResponse.insights || []
      const aiPredictions = aiInsightsResponse.predictions || []

      // Recent entries
      const recentEntries = healthEntriesResponse.data?.slice(0, 10) || []

      // Generate notifications
      const notifications = this.generateNotifications(
        healthMetrics,
        aiInsights,
        healthStatus
      )

      return {
        healthMetrics,
        healthTrends,
        aiInsights,
        aiPredictions,
        healthStatus,
        recentEntries,
        notifications
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      throw error
    }
  }

  // Get health trends for specific metrics
  async getHealthTrends(metrics?: string[], days: number = 30): Promise<HealthTrend[]> {
    try {
      const defaultMetrics = metrics || ['heart_rate', 'blood_pressure', 'weight', 'steps']
      const trends: HealthTrend[] = []

      for (const metric of defaultMetrics) {
        const response = await apiClient.getHealthDataEntries({
          type: metric,
          limit: days,
          // Add date filtering for the specified days
        })

        if (response.success && response.data) {
          const trendData = this.processTrendData(response.data, metric)
          trends.push(trendData)
        }
      }

      return trends
    } catch (error) {
      console.error('Failed to fetch health trends:', error)
      return []
    }
  }

  // Get AI analysis results
  async getAIAnalysis(): Promise<{ insights: AIInsight[], predictions: AIPrediction[] }> {
    try {
      // This would typically call the AI analysis endpoints
      // For now, return sample data
      return {
        insights: this.generateSampleInsights(),
        predictions: this.generateSamplePredictions()
      }
    } catch (error) {
      console.error('Failed to fetch AI analysis:', error)
      return { insights: [], predictions: [] }
    }
  }

  // Process raw health data into metrics
  private processHealthMetrics(healthProfile: any, healthEntries: any[]): HealthMetric[] {
    const metrics: HealthMetric[] = []

    if (!healthEntries || healthEntries.length === 0) {
      return this.getDefaultMetrics()
    }

    // Group entries by type
    const groupedEntries = healthEntries.reduce((acc, entry) => {
      if (!acc[entry.dataType]) {
        acc[entry.dataType] = []
      }
      acc[entry.dataType].push(entry)
      return acc
    }, {} as Record<string, any[]>)

    // Process each metric type
    Object.keys(groupedEntries).forEach(type => {
      const entries = groupedEntries[type].sort((a, b) => 
        new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      )
      
      const latestEntry = entries[0]
      const previousEntry = entries[1]

      const metric = this.createMetricFromEntry(latestEntry, previousEntry, type)
      if (metric) {
        metrics.push(metric)
      }
    })

    return metrics
  }

  // Create a metric object from health data entry
  private createMetricFromEntry(
    latestEntry: any, 
    previousEntry: any, 
    type: string
  ): HealthMetric | null {
    const metricConfig = this.getMetricConfig(type)
    if (!metricConfig) return null

    let trend: 'up' | 'down' | 'stable' = 'stable'
    let trendValue = 0

    if (previousEntry) {
      const currentValue = parseFloat(latestEntry.valueNumeric || latestEntry.value)
      const previousValue = parseFloat(previousEntry.valueNumeric || previousEntry.value)
      
      if (currentValue > previousValue) {
        trend = 'up'
        trendValue = ((currentValue - previousValue) / previousValue) * 100
      } else if (currentValue < previousValue) {
        trend = 'down'
        trendValue = ((previousValue - currentValue) / previousValue) * 100
      }
    }

    const value = latestEntry.valueNumeric || latestEntry.value
    const status = this.determineMetricStatus(type, value)

    return {
      id: type,
      name: metricConfig.name,
      value: value,
      unit: metricConfig.unit,
      trend,
      trendValue: Math.round(trendValue * 10) / 10,
      status,
      lastUpdated: latestEntry.recordedAt,
      icon: metricConfig.icon,
      color: metricConfig.color
    }
  }

  // Get metric configuration
  private getMetricConfig(type: string) {
    const configs: Record<string, any> = {
      heart_rate: {
        name: '心拍数',
        unit: 'bpm',
        icon: 'heart',
        color: 'text-red-400',
        normalRange: { min: 60, max: 100 }
      },
      blood_pressure_systolic: {
        name: '収縮期血圧',
        unit: 'mmHg',
        icon: 'activity',
        color: 'text-blue-400',
        normalRange: { min: 90, max: 140 }
      },
      blood_pressure_diastolic: {
        name: '拡張期血圧',
        unit: 'mmHg',
        icon: 'activity',
        color: 'text-blue-400',
        normalRange: { min: 60, max: 90 }
      },
      temperature: {
        name: '体温',
        unit: '°C',
        icon: 'thermometer',
        color: 'text-orange-400',
        normalRange: { min: 36.0, max: 37.5 }
      },
      weight: {
        name: '体重',
        unit: 'kg',
        icon: 'weight',
        color: 'text-purple-400'
      },
      steps: {
        name: '歩数',
        unit: '歩',
        icon: 'footprints',
        color: 'text-green-400',
        target: 10000
      }
    }

    return configs[type]
  }

  // Determine metric status based on value and normal ranges
  private determineMetricStatus(type: string, value: number): 'normal' | 'warning' | 'critical' {
    const config = this.getMetricConfig(type)
    if (!config?.normalRange) return 'normal'

    const { min, max } = config.normalRange

    if (value < min * 0.8 || value > max * 1.2) {
      return 'critical'
    } else if (value < min || value > max) {
      return 'warning'
    }

    return 'normal'
  }

  // Process trend data from health entries
  private processTrendData(entries: any[], metricType: string): HealthTrend {
    const config = this.getMetricConfig(metricType)
    
    const data: TrendDataPoint[] = entries
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
      .map(entry => ({
        date: entry.recordedAt,
        value: parseFloat(entry.valueNumeric || entry.value),
        label: entry.label
      }))

    return {
      id: metricType,
      name: config?.name || metricType,
      data,
      unit: config?.unit || '',
      color: config?.color?.replace('text-', 'bg-') || 'bg-gray-400',
      target: config?.target,
      targetRange: config?.normalRange
    }
  }

  // Calculate overall health status
  private calculateHealthStatus(
    metrics: HealthMetric[], 
    entries: any[]
  ): HealthStatus {
    // Calculate health score based on metrics
    let totalScore = 0
    let scoredMetrics = 0

    metrics.forEach(metric => {
      let metricScore = 100

      if (metric.status === 'warning') {
        metricScore = 70
      } else if (metric.status === 'critical') {
        metricScore = 40
      }

      totalScore += metricScore
      scoredMetrics++
    })

    const averageScore = scoredMetrics > 0 ? Math.round(totalScore / scoredMetrics) : 75

    // Determine overall status
    let overall: 'excellent' | 'good' | 'fair' | 'poor' = 'good'
    if (averageScore >= 90) overall = 'excellent'
    else if (averageScore >= 70) overall = 'good'
    else if (averageScore >= 50) overall = 'fair'
    else overall = 'poor'

    // Calculate today's entries
    const today = new Date().toDateString()
    const todayEntries = entries.filter(entry => 
      new Date(entry.recordedAt).toDateString() === today
    ).length

    // Calculate streak days (simplified)
    const streakDays = this.calculateStreakDays(entries)

    // Calculate weekly goal progress (simplified)
    const weeklyGoalProgress = Math.min(100, (todayEntries / 5) * 100)

    return {
      overall,
      score: averageScore,
      todayEntries,
      lastEntry: entries[0]?.recordedAt,
      streakDays,
      weeklyGoalProgress: Math.round(weeklyGoalProgress)
    }
  }

  // Calculate consecutive days with health data entries
  private calculateStreakDays(entries: any[]): number {
    if (!entries.length) return 0

    const dates = [...new Set(
      entries.map(entry => new Date(entry.recordedAt).toDateString())
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let streak = 0
    let currentDate = new Date()

    for (const dateStr of dates) {
      const entryDate = new Date(dateStr)
      const diffDays = Math.floor(
        (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === streak) {
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    return streak
  }

  // Generate notifications based on health data
  private generateNotifications(
    metrics: HealthMetric[],
    insights: AIInsight[],
    status: HealthStatus
  ): DashboardNotification[] {
    const notifications: DashboardNotification[] = []

    // Critical metrics notifications
    const criticalMetrics = metrics.filter(m => m.status === 'critical')
    if (criticalMetrics.length > 0) {
      notifications.push({
        id: 'critical_metrics',
        title: '要注意な健康指標',
        message: `${criticalMetrics.length}つの指標が正常範囲を大きく外れています。`,
        type: 'error',
        actionUrl: '/analytics',
        timestamp: new Date().toISOString(),
        read: false
      })
    }

    // High priority AI insights
    const urgentInsights = insights.filter(i => i.priority === 'urgent' || i.priority === 'high')
    if (urgentInsights.length > 0) {
      notifications.push({
        id: 'urgent_insights',
        title: 'AI分析からの重要な洞察',
        message: `健康に関する重要な推奨事項があります。`,
        type: 'warning',
        actionUrl: '/ai-insights',
        timestamp: new Date().toISOString(),
        read: false
      })
    }

    // Positive achievements
    if (status.streakDays >= 7) {
      notifications.push({
        id: 'streak_achievement',
        title: '連続記録達成！',
        message: `${status.streakDays}日連続で健康データを記録しています。`,
        type: 'success',
        actionUrl: '/achievements',
        timestamp: new Date().toISOString(),
        read: false
      })
    }

    return notifications
  }

  // Default metrics when no data is available
  private getDefaultMetrics(): HealthMetric[] {
    return [
      {
        id: 'heart_rate',
        name: '心拍数',
        value: '未記録',
        unit: 'bpm',
        trend: 'stable',
        trendValue: 0,
        status: 'normal',
        lastUpdated: new Date().toISOString(),
        icon: 'heart',
        color: 'text-red-400'
      },
      {
        id: 'blood_pressure',
        name: '血圧',
        value: '未記録',
        unit: 'mmHg',
        trend: 'stable',
        trendValue: 0,
        status: 'normal',
        lastUpdated: new Date().toISOString(),
        icon: 'activity',
        color: 'text-blue-400'
      },
      {
        id: 'weight',
        name: '体重',
        value: '未記録',
        unit: 'kg',
        trend: 'stable',
        trendValue: 0,
        status: 'normal',
        lastUpdated: new Date().toISOString(),
        icon: 'weight',
        color: 'text-purple-400'
      }
    ]
  }

  // Sample data generators for development/testing
  private generateSampleInsights(): AIInsight[] {
    return [
      {
        id: 'insight_1',
        title: '血圧の改善傾向を検出',
        description: '過去2週間で血圧の数値が安定し、目標範囲内に収まる頻度が向上しています。',
        category: 'achievement',
        priority: 'medium',
        confidence: 87,
        actionable: true,
        actions: ['現在の生活習慣を継続', '定期的な測定を続ける'],
        relatedMetrics: ['blood_pressure'],
        timestamp: new Date().toISOString()
      },
      {
        id: 'insight_2',
        title: '心拍数の変動パターンに注意',
        description: 'ストレス期間中の心拍数上昇が頻繁になっています。リラクゼーション技法の実践をお勧めします。',
        category: 'recommendation',
        priority: 'high',
        confidence: 92,
        actionable: true,
        actions: ['深呼吸練習を1日3回実施', '瞑想アプリの使用', '十分な睡眠時間の確保'],
        relatedMetrics: ['heart_rate'],
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  }

  private generateSamplePredictions(): AIPrediction[] {
    return [
      {
        id: 'prediction_1',
        title: '心血管健康リスク予測',
        prediction: '現在のライフスタイルを続けると、3ヶ月後の心血管健康スコアは15%向上する見込みです。',
        timeframe: '3ヶ月',
        confidence: 84,
        preventiveActions: ['週3回の有酸素運動', '塩分摂取量の削減', 'ストレス管理の改善']
      }
    ]
  }
}

export const dashboardService = new DashboardService()