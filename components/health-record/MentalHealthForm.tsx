'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { 
  Brain,
  Heart,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  CheckCircle,
  Sun,
  Moon,
  CloudRain,
  Zap,
  Battery,
  Shield,
  Target,
  Sparkles,
  Save,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface MentalHealthData {
  mood: number
  stress: number
  anxiety: number
  energy: number
  motivation: number
  socialConnection: number
  copingStrategies: string[]
  dailyGratitude: string
  thoughts: string
  timestamp: string
}

interface MoodOption {
  value: number
  label: string
  icon: React.ReactNode
  color: string
}

interface CopingStrategy {
  id: string
  label: string
  icon: React.ReactNode
  description?: string
}

interface MentalHealthFormProps {
  onSubmit: (data: MentalHealthData) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<MentalHealthData>
}

const moodOptions: MoodOption[] = [
  { value: 1, label: 'とても悪い', icon: <Frown className="h-6 w-6" />, color: 'text-red-500' },
  { value: 2, label: '悪い', icon: <Frown className="h-6 w-6" />, color: 'text-orange-500' },
  { value: 3, label: 'やや悪い', icon: <Meh className="h-6 w-6" />, color: 'text-yellow-500' },
  { value: 4, label: '普通', icon: <Meh className="h-6 w-6" />, color: 'text-gray-400' },
  { value: 5, label: 'まあまあ', icon: <Smile className="h-6 w-6" />, color: 'text-blue-400' },
  { value: 6, label: '良い', icon: <Smile className="h-6 w-6" />, color: 'text-green-400' },
  { value: 7, label: 'とても良い', icon: <Smile className="h-6 w-6" />, color: 'text-emerald-500' }
]

const copingStrategies: CopingStrategy[] = [
  { id: 'exercise', label: '運動', icon: <Zap className="h-4 w-4" />, description: 'ウォーキング、ヨガなど' },
  { id: 'meditation', label: '瞑想', icon: <Brain className="h-4 w-4" />, description: 'マインドフルネス' },
  { id: 'breathing', label: '深呼吸', icon: <CloudRain className="h-4 w-4" />, description: '呼吸法の実践' },
  { id: 'social', label: '社交', icon: <Heart className="h-4 w-4" />, description: '友人との会話' },
  { id: 'creative', label: '創作活動', icon: <Sparkles className="h-4 w-4" />, description: '絵画、音楽など' },
  { id: 'nature', label: '自然', icon: <Sun className="h-4 w-4" />, description: '散歩、ガーデニング' },
  { id: 'rest', label: '休息', icon: <Moon className="h-4 w-4" />, description: '十分な睡眠' },
  { id: 'hobby', label: '趣味', icon: <Target className="h-4 w-4" />, description: '好きな活動' }
]

export function MentalHealthForm({ onSubmit, onCancel, initialData }: MentalHealthFormProps) {
  const [mentalHealthData, setMentalHealthData] = useState<MentalHealthData>({
    mood: initialData?.mood || 4,
    stress: initialData?.stress || 5,
    anxiety: initialData?.anxiety || 5,
    energy: initialData?.energy || 5,
    motivation: initialData?.motivation || 5,
    socialConnection: initialData?.socialConnection || 5,
    copingStrategies: initialData?.copingStrategies || [],
    dailyGratitude: initialData?.dailyGratitude || '',
    thoughts: initialData?.thoughts || '',
    timestamp: new Date().toISOString()
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSliderChange = (key: keyof MentalHealthData, value: number[]) => {
    setMentalHealthData({ ...mentalHealthData, [key]: value[0] })
  }

  const handleCopingStrategyToggle = (strategyId: string) => {
    const updatedStrategies = mentalHealthData.copingStrategies.includes(strategyId)
      ? mentalHealthData.copingStrategies.filter(id => id !== strategyId)
      : [...mentalHealthData.copingStrategies, strategyId]
    
    setMentalHealthData({ ...mentalHealthData, copingStrategies: updatedStrategies })
  }

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-400'
    if (score <= 5) return 'text-yellow-400'
    if (score <= 7) return 'text-green-400'
    return 'text-emerald-400'
  }

  const getScoreLabel = (score: number, type: string) => {
    if (type === 'stress' || type === 'anxiety') {
      // For stress and anxiety, lower is better
      if (score <= 3) return '低い（良好）'
      if (score <= 5) return '中程度'
      if (score <= 7) return '高い'
      return '非常に高い'
    } else {
      // For other metrics, higher is better
      if (score <= 3) return '低い'
      if (score <= 5) return '中程度'
      if (score <= 7) return '高い'
      return '非常に高い'
    }
  }

  const calculateWellbeingScore = () => {
    const positiveFactors = (mentalHealthData.mood + mentalHealthData.energy + 
                           mentalHealthData.motivation + mentalHealthData.socialConnection) / 4
    const negativeFactors = (11 - mentalHealthData.stress + 11 - mentalHealthData.anxiety) / 2
    return Math.round((positiveFactors + negativeFactors) / 2 * 10)
  }

  const handleSubmit = async () => {
    if (!mentalHealthData.dailyGratitude.trim()) {
      toast({
        title: "感謝の気持ちを記入してください",
        description: "今日感謝していることを少なくとも1つ記入してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(mentalHealthData)
      
      toast({
        title: "メンタルヘルスチェックを記録しました",
        description: `総合的なウェルビーイングスコア: ${calculateWellbeingScore()}/100`,
      })
      
      // Reset form
      setMentalHealthData({
        mood: 4,
        stress: 5,
        anxiety: 5,
        energy: 5,
        motivation: 5,
        socialConnection: 5,
        copingStrategies: [],
        dailyGratitude: '',
        thoughts: '',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      toast({
        title: "記録に失敗しました",
        description: "メンタルヘルスデータの記録中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const wellbeingScore = calculateWellbeingScore()
  const selectedMood = moodOptions.find(option => option.value === mentalHealthData.mood)

  return (
    <div className="space-y-6">
      {/* Wellbeing Score Summary */}
      <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-600/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">今日のウェルビーイングスコア</h3>
              <p className="text-gray-300 text-sm">総合的な心の健康状態</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{wellbeingScore}</div>
              <div className="text-sm text-gray-300">/100</div>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${wellbeingScore}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mood Selection */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Heart className="h-5 w-5 mr-2 text-pink-400" />
            今日の気分
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {moodOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMentalHealthData({ ...mentalHealthData, mood: option.value })}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                  mentalHealthData.mood === option.value
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className={option.color}>{option.icon}</div>
                <span className="text-xs text-gray-300 mt-1">{option.label}</span>
              </motion.button>
            ))}
          </div>
          {selectedMood && (
            <div className="mt-4 text-center">
              <Badge variant="secondary" className={`${selectedMood.color} bg-gray-600`}>
                現在の気分: {selectedMood.label}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mental Health Metrics */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-400" />
            心の健康指標
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stress Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white flex items-center">
                <Shield className="h-4 w-4 mr-2 text-orange-400" />
                ストレスレベル
              </Label>
              <span className={`text-sm font-medium ${getScoreColor(11 - mentalHealthData.stress)}`}>
                {getScoreLabel(mentalHealthData.stress, 'stress')}
              </span>
            </div>
            <Slider
              value={[mentalHealthData.stress]}
              onValueChange={(value) => handleSliderChange('stress', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>低い</span>
              <span>高い</span>
            </div>
          </div>

          {/* Anxiety Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-400" />
                不安レベル
              </Label>
              <span className={`text-sm font-medium ${getScoreColor(11 - mentalHealthData.anxiety)}`}>
                {getScoreLabel(mentalHealthData.anxiety, 'anxiety')}
              </span>
            </div>
            <Slider
              value={[mentalHealthData.anxiety]}
              onValueChange={(value) => handleSliderChange('anxiety', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>低い</span>
              <span>高い</span>
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white flex items-center">
                <Battery className="h-4 w-4 mr-2 text-green-400" />
                エネルギーレベル
              </Label>
              <span className={`text-sm font-medium ${getScoreColor(mentalHealthData.energy)}`}>
                {getScoreLabel(mentalHealthData.energy, 'energy')}
              </span>
            </div>
            <Slider
              value={[mentalHealthData.energy]}
              onValueChange={(value) => handleSliderChange('energy', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>低い</span>
              <span>高い</span>
            </div>
          </div>

          {/* Motivation Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-400" />
                モチベーション
              </Label>
              <span className={`text-sm font-medium ${getScoreColor(mentalHealthData.motivation)}`}>
                {getScoreLabel(mentalHealthData.motivation, 'motivation')}
              </span>
            </div>
            <Slider
              value={[mentalHealthData.motivation]}
              onValueChange={(value) => handleSliderChange('motivation', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>低い</span>
              <span>高い</span>
            </div>
          </div>

          {/* Social Connection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white flex items-center">
                <Heart className="h-4 w-4 mr-2 text-pink-400" />
                社会的つながり
              </Label>
              <span className={`text-sm font-medium ${getScoreColor(mentalHealthData.socialConnection)}`}>
                {getScoreLabel(mentalHealthData.socialConnection, 'social')}
              </span>
            </div>
            <Slider
              value={[mentalHealthData.socialConnection]}
              onValueChange={(value) => handleSliderChange('socialConnection', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>孤独</span>
              <span>充実</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coping Strategies */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
            今日実践したコーピング戦略
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {copingStrategies.map((strategy) => (
              <Button
                key={strategy.id}
                variant={mentalHealthData.copingStrategies.includes(strategy.id) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCopingStrategyToggle(strategy.id)}
                className={mentalHealthData.copingStrategies.includes(strategy.id)
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'text-gray-300 border-gray-600 hover:bg-gray-700'
                }
              >
                <div className="flex flex-col items-center py-1">
                  {strategy.icon}
                  <span className="text-xs mt-1">{strategy.label}</span>
                  {strategy.description && (
                    <span className="text-xs text-gray-400 mt-0.5">{strategy.description}</span>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Gratitude */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sun className="h-5 w-5 mr-2 text-yellow-400" />
            今日の感謝
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="今日感謝していることを3つ書いてみましょう..."
            value={mentalHealthData.dailyGratitude}
            onChange={(e) => setMentalHealthData({ ...mentalHealthData, dailyGratitude: e.target.value })}
            className="bg-gray-600/50 border-gray-500 text-white min-h-[100px]"
          />
          <p className="text-xs text-gray-400 mt-2 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            感謝の気持ちを書くことで、ポジティブな思考パターンが強化されます
          </p>
        </CardContent>
      </Card>

      {/* Additional Thoughts */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-400" />
            今日の振り返り（任意）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="今日の出来事や感じたことを自由に記録してください..."
            value={mentalHealthData.thoughts}
            onChange={(e) => setMentalHealthData({ ...mentalHealthData, thoughts: e.target.value })}
            className="bg-gray-600/50 border-gray-500 text-white min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Mental Health Tips */}
      <Card className="bg-blue-500/10 border border-blue-400/30">
        <CardContent className="p-4">
          <h4 className="text-blue-400 font-medium mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            メンタルヘルスケアのヒント
          </h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• 定期的な運動は気分を向上させ、ストレスを軽減します</li>
            <li>• 十分な睡眠（7-9時間）は精神的な回復に不可欠です</li>
            <li>• 信頼できる人との会話は心の健康を支えます</li>
            <li>• マインドフルネスや瞑想で心を落ち着かせましょう</li>
            <li>• 小さな成功体験を積み重ねて自信を育てましょう</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-gray-500 text-gray-300 hover:bg-gray-600"
          >
            キャンセル
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              記録中...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              メンタルヘルスチェックを記録
            </>
          )}
        </Button>
      </div>
    </div>
  )
}