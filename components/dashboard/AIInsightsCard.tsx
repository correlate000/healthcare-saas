'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Target,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Heart,
  Activity
} from 'lucide-react'

interface Insight {
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

interface Prediction {
  id: string
  title: string
  prediction: string
  timeframe: string
  confidence: number
  preventiveActions: string[]
}

interface InsightsCardProps {
  insights: Insight[]
  predictions?: Prediction[]
  onInsightClick?: (insight: Insight) => void
  onViewAll?: () => void
  isLoading?: boolean
}

export function InsightsCard({ 
  insights, 
  predictions = [], 
  onInsightClick, 
  onViewAll,
  isLoading = false 
}: InsightsCardProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions'>('insights')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-black'
      case 'low': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'risk_assessment': return <AlertTriangle className="h-4 w-4" />
      case 'recommendation': return <Lightbulb className="h-4 w-4" />
      case 'prediction': return <TrendingUp className="h-4 w-4" />
      case 'achievement': return <Star className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'risk_assessment': return 'リスク評価'
      case 'recommendation': return '推奨事項'
      case 'prediction': return '予測'
      case 'achievement': return '達成事項'
      default: return 'キャラクター分析'
    }
  }

  const renderInsight = (insight: Insight, index: number) => (
    <motion.div
      key={insight.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-600/50 rounded-lg p-4 cursor-pointer hover:bg-gray-600/70 transition-all duration-200 border border-gray-600/30"
      onClick={() => onInsightClick?.(insight)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-emerald-400">
            {getCategoryIcon(insight.category)}
          </div>
          <Badge variant="secondary" className={`text-xs ${getPriorityColor(insight.priority)}`}>
            {insight.priority.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
            {getCategoryLabel(insight.category)}
          </Badge>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <span>{insight.confidence}%</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(insight.confidence / 20) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <h4 className="text-white font-semibold mb-2 text-sm">{insight.title}</h4>
      <p className="text-gray-300 text-xs leading-relaxed mb-3">{insight.description}</p>

      {insight.actionable && insight.actions && (
        <div className="space-y-2">
          <h5 className="text-emerald-400 text-xs font-medium">推奨アクション:</h5>
          <ul className="space-y-1">
            {insight.actions.map((action, actionIndex) => (
              <li key={actionIndex} className="text-gray-300 text-xs flex items-start">
                <CheckCircle className="h-3 w-3 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600/30">
        <div className="text-xs text-gray-400 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(insight.timestamp).toLocaleDateString('ja-JP')}
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </motion.div>
  )

  const renderPrediction = (prediction: Prediction, index: number) => (
    <motion.div
      key={prediction.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 border border-purple-500/30"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-purple-400" />
          <Badge variant="outline" className="text-xs text-purple-300 border-purple-400">
            予測分析
          </Badge>
        </div>
        <div className="text-xs text-purple-300">
          信頼度: {prediction.confidence}%
        </div>
      </div>

      <h4 className="text-white font-semibold mb-2 text-sm">{prediction.title}</h4>
      <p className="text-gray-300 text-xs leading-relaxed mb-2">{prediction.prediction}</p>
      <p className="text-purple-300 text-xs mb-3">期間: {prediction.timeframe}</p>

      {prediction.preventiveActions.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-purple-400 text-xs font-medium">予防的アクション:</h5>
          <ul className="space-y-1">
            {prediction.preventiveActions.map((action, actionIndex) => (
              <li key={actionIndex} className="text-gray-300 text-xs flex items-start">
                <Target className="h-3 w-3 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )

  if (isLoading) {
    return (
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg font-semibold flex items-center">
            <Brain className="h-5 w-5 mr-2 text-emerald-400" />
            キャラクター健康分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-600/50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-500 rounded mb-2"></div>
                <div className="h-3 bg-gray-500 rounded mb-1"></div>
                <div className="h-3 bg-gray-500 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-700/95 border-gray-600/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg font-semibold flex items-center">
            <Brain className="h-5 w-5 mr-2 text-emerald-400" />
            キャラクター健康分析
            <Sparkles className="h-4 w-4 ml-2 text-yellow-400" />
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAll}
            className="text-xs border-gray-500 text-gray-300 hover:bg-gray-600"
          >
            すべて表示
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Selector */}
        <div className="flex space-x-1 bg-gray-600/30 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === 'insights'
                ? 'bg-gray-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            洞察 ({insights.length})
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === 'predictions'
                ? 'bg-gray-600 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            予測 ({predictions.length})
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'insights' ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {insights.length > 0 ? (
                insights.slice(0, 3).map((insight, index) => renderInsight(insight, index))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">分析結果はありません</p>
                  <p className="text-xs">健康データを記録すると、キャラクター分析が表示されます</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="predictions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {predictions.length > 0 ? (
                predictions.slice(0, 2).map((prediction, index) => renderPrediction(prediction, index))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">予測データはありません</p>
                  <p className="text-xs">継続的なデータ記録により、予測分析が利用可能になります</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// サンプル洞察データジェネレーター
export function generateSampleInsights(): Insight[] {
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
    },
    {
      id: 'insight_3',
      title: '活動量の増加が健康に好影響',
      description: '歩数の増加に伴い、全体的な健康指標が改善されています。',
      category: 'achievement',
      priority: 'low',
      confidence: 78,
      actionable: false,
      relatedMetrics: ['steps', 'heart_rate'],
      timestamp: new Date(Date.now() - 172800000).toISOString()
    }
  ]
}

export function generateSamplePredictions(): Prediction[] {
  return [
    {
      id: 'prediction_1',
      title: '心血管健康リスク予測',
      prediction: '現在のライフスタイルを続けると、3ヶ月後の心血管健康スコアは15%向上する見込みです。',
      timeframe: '3ヶ月',
      confidence: 84,
      preventiveActions: ['週3回の有酸素運動', '塩分摂取量の削減', 'ストレス管理の改善']
    },
    {
      id: 'prediction_2',
      title: '体重管理の予測',
      prediction: '現在の活動レベルと食事パターンでは、目標体重到達まで6週間程度要する見込みです。',
      timeframe: '6週間',
      confidence: 76,
      preventiveActions: ['カロリー摂取量の微調整', '筋力トレーニングの追加']
    }
  ]
}