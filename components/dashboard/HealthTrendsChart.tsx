'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Calendar,
  BarChart3,
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface TrendDataPoint {
  date: string
  value: number
  label?: string
}

interface HealthTrend {
  id: string
  name: string
  data: TrendDataPoint[]
  unit: string
  color: string
  target?: number
  targetRange?: { min: number; max: number }
}

interface HealthTrendsChartProps {
  trends: HealthTrend[]
  selectedTrend?: string
  onTrendSelect?: (trendId: string) => void
  timeRange?: '7d' | '30d' | '90d'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d') => void
}

export function HealthTrendsChart({ 
  trends, 
  selectedTrend, 
  onTrendSelect,
  timeRange = '7d',
  onTimeRangeChange 
}: HealthTrendsChartProps) {
  const [activeTab, setActiveTab] = useState(selectedTrend || trends[0]?.id)

  const activeTrend = trends.find(t => t.id === activeTab) || trends[0]

  const getMaxValue = (data: TrendDataPoint[]) => {
    return Math.max(...data.map(d => d.value))
  }

  const getMinValue = (data: TrendDataPoint[]) => {
    return Math.min(...data.map(d => d.value))
  }

  const calculateTrend = (data: TrendDataPoint[]) => {
    if (data.length < 2) return { direction: 'stable', percentage: 0 }
    
    const recent = data.slice(-3).reduce((sum, d) => sum + d.value, 0) / Math.min(3, data.length)
    const earlier = data.slice(0, -3).reduce((sum, d) => sum + d.value, 0) / Math.max(1, data.length - 3)
    
    const change = ((recent - earlier) / earlier) * 100
    
    if (Math.abs(change) < 2) return { direction: 'stable', percentage: 0 }
    return { 
      direction: change > 0 ? 'up' : 'down', 
      percentage: Math.abs(change)
    }
  }

  const renderMiniChart = (data: TrendDataPoint[], color: string) => {
    const maxValue = getMaxValue(data)
    const minValue = getMinValue(data)
    const range = maxValue - minValue || 1

    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((point, index) => {
          const height = ((point.value - minValue) / range) * 32
          return (
            <div
              key={index}
              className={`w-2 ${color} rounded-t-sm transition-all duration-200`}
              style={{ height: `${Math.max(height, 2)}px` }}
            />
          )
        })}
      </div>
    )
  }

  const renderFullChart = (trend: HealthTrend) => {
    const maxValue = getMaxValue(trend.data)
    const minValue = getMinValue(trend.data)
    const range = maxValue - minValue || 1

    return (
      <div className="space-y-4">
        {/* Chart Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold">{trend.name}</h3>
            <span className="text-gray-400 text-sm">({trend.unit})</span>
          </div>
          <div className="flex items-center space-x-2">
            {['7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeRangeChange?.(range as any)}
                className="text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-gray-600/50 rounded-lg p-4">
          <div className="relative h-48">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
              <span>{maxValue.toFixed(1)}</span>
              <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
              <span>{minValue.toFixed(1)}</span>
            </div>

            {/* Chart bars */}
            <div className="ml-8 flex items-end justify-between h-full">
              {trend.data.map((point, index) => {
                const height = ((point.value - minValue) / range) * 180
                const isInTarget = trend.targetRange ? 
                  point.value >= trend.targetRange.min && point.value <= trend.targetRange.max :
                  trend.target ? Math.abs(point.value - trend.target) < (trend.target * 0.1) : true

                return (
                  <div key={index} className="flex flex-col items-center group">
                    <div
                      className={`w-6 rounded-t-sm transition-all duration-200 hover:opacity-80 ${
                        isInTarget ? trend.color : 'bg-gray-500'
                      }`}
                      style={{ height: `${Math.max(height, 4)}px` }}
                    />
                    <span className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-left">
                      {new Date(point.date).toLocaleDateString('ja-JP', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="invisible group-hover:visible absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                      {point.value} {trend.unit}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Target line */}
            {trend.target && (
              <div 
                className="absolute left-8 right-0 border-t-2 border-dashed border-emerald-400"
                style={{ 
                  top: `${((maxValue - trend.target) / range) * 180 + 4}px` 
                }}
              >
                <span className="absolute right-0 -top-4 text-xs text-emerald-400">
                  目標: {trend.target}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-gray-600/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">トレンド分析</span>
            <div className="flex items-center space-x-2">
              {(() => {
                const trendAnalysis = calculateTrend(trend.data)
                const icon = trendAnalysis.direction === 'up' ? 
                  <ArrowUp className="h-4 w-4 text-green-400" /> :
                  trendAnalysis.direction === 'down' ?
                  <ArrowDown className="h-4 w-4 text-red-400" /> :
                  <Minus className="h-4 w-4 text-gray-400" />
                
                return (
                  <>
                    {icon}
                    <span className={`text-sm font-medium ${
                      trendAnalysis.direction === 'up' ? 'text-green-400' :
                      trendAnalysis.direction === 'down' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {trendAnalysis.direction === 'stable' ? '安定' :
                       `${trendAnalysis.percentage.toFixed(1)}%`}
                    </span>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-gray-700/95 border-gray-600/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg font-semibold flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-emerald-400" />
          健康トレンド
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trend Selector */}
        <div className="flex flex-wrap gap-2">
          {trends.map((trend) => {
            const trendAnalysis = calculateTrend(trend.data)
            return (
              <motion.button
                key={trend.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(trend.id)
                  onTrendSelect?.(trend.id)
                }}
                className={`flex-1 min-w-0 p-3 rounded-lg border transition-all duration-200 ${
                  activeTab === trend.id
                    ? 'bg-gray-600/70 border-gray-500'
                    : 'bg-gray-600/30 border-gray-600/50 hover:bg-gray-600/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium truncate">{trend.name}</span>
                  <div className="flex items-center space-x-1">
                    {trendAnalysis.direction === 'up' ? 
                      <ArrowUp className="h-3 w-3 text-green-400" /> :
                      trendAnalysis.direction === 'down' ?
                      <ArrowDown className="h-3 w-3 text-red-400" /> :
                      <Minus className="h-3 w-3 text-gray-400" />
                    }
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-300">
                    最新: {trend.data[trend.data.length - 1]?.value} {trend.unit}
                  </div>
                  <div className="w-16">
                    {renderMiniChart(trend.data, trend.color)}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Main Chart */}
        {activeTrend && (
          <motion.div
            key={activeTrend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderFullChart(activeTrend)}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

// サンプルトレンドデータジェネレーター
export function generateSampleTrends(): HealthTrend[] {
  const generateData = (baseValue: number, days: number, variance: number) => {
    const data: TrendDataPoint[] = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString(),
        value: baseValue + (Math.random() - 0.5) * variance
      })
    }
    return data
  }

  return [
    {
      id: 'heart_rate',
      name: '心拍数',
      data: generateData(72, 14, 10),
      unit: 'bpm',
      color: 'bg-red-400',
      targetRange: { min: 60, max: 80 }
    },
    {
      id: 'blood_pressure_systolic',
      name: '収縮期血圧',
      data: generateData(120, 14, 15),
      unit: 'mmHg',
      color: 'bg-blue-400',
      target: 120
    },
    {
      id: 'weight',
      name: '体重',
      data: generateData(65, 14, 2),
      unit: 'kg',
      color: 'bg-purple-400',
      target: 65
    },
    {
      id: 'steps',
      name: '歩数',
      data: generateData(8000, 14, 3000),
      unit: '歩',
      color: 'bg-green-400',
      target: 10000
    }
  ]
}