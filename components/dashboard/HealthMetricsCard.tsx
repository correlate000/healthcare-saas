'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Weight, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface HealthMetric {
  id: string
  name: string
  value: number | string
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  status: 'normal' | 'warning' | 'critical'
  lastUpdated: string
  icon: React.ReactNode
  color: string
}

interface HealthMetricsCardProps {
  metrics: HealthMetric[]
  onMetricClick?: (metricId: string) => void
}

export function HealthMetricsCard({ metrics, onMetricClick }: HealthMetricsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />
      default: return null
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />
      default: return <ArrowRight className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Card className="bg-gray-700/95 border-gray-600/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg font-semibold flex items-center">
          <Activity className="h-5 w-5 mr-2 text-emerald-400" />
          健康メトリクス
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-600/50 rounded-lg p-4 cursor-pointer hover:bg-gray-600/70 transition-colors duration-200"
              onClick={() => onMetricClick?.(metric.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`${metric.color}`}>
                    {metric.icon}
                  </div>
                  <span className="text-white text-sm font-medium">{metric.name}</span>
                </div>
                {getStatusIcon(metric.status)}
              </div>
              
              <div className="flex items-end justify-between mb-2">
                <div>
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  <span className="text-gray-300 text-sm ml-1">{metric.unit}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-xs font-medium ${
                    metric.trend === 'up' ? 'text-green-400' : 
                    metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {metric.trendValue > 0 ? '+' : ''}{metric.trendValue}%
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400">
                更新: {new Date(metric.lastUpdated).toLocaleDateString('ja-JP')}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// サンプルメトリクスデータジェネレーター
export function generateSampleMetrics(): HealthMetric[] {
  return [
    {
      id: 'heart_rate',
      name: '心拍数',
      value: 72,
      unit: 'bpm',
      trend: 'stable',
      trendValue: 0,
      status: 'normal',
      lastUpdated: new Date().toISOString(),
      icon: <Heart className="h-4 w-4" />,
      color: 'text-red-400'
    },
    {
      id: 'blood_pressure',
      name: '血圧',
      value: '120/80',
      unit: 'mmHg',
      trend: 'down',
      trendValue: -2,
      status: 'normal',
      lastUpdated: new Date().toISOString(),
      icon: <Activity className="h-4 w-4" />,
      color: 'text-blue-400'
    },
    {
      id: 'temperature',
      name: '体温',
      value: 36.5,
      unit: '°C',
      trend: 'stable',
      trendValue: 0,
      status: 'normal',
      lastUpdated: new Date().toISOString(),
      icon: <Thermometer className="h-4 w-4" />,
      color: 'text-orange-400'
    },
    {
      id: 'weight',
      name: '体重',
      value: 65.2,
      unit: 'kg',
      trend: 'down',
      trendValue: -1.2,
      status: 'normal',
      lastUpdated: new Date().toISOString(),
      icon: <Weight className="h-4 w-4" />,
      color: 'text-purple-400'
    }
  ]
}