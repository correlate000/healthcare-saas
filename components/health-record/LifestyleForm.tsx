'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { 
  Activity,
  Utensils,
  Moon,
  Coffee,
  Cigarette,
  Wine,
  Timer,
  Footprints,
  Bike,
  Dumbbell,
  Heart,
  Calendar,
  Info,
  Save,
  Plus,
  X,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface LifestyleData {
  id: string
  category: string
  type: string
  value: number | string
  unit?: string
  duration?: string
  intensity?: string
  timestamp: string
  notes?: string
}

interface LifestyleCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  fields: LifestyleField[]
}

interface LifestyleField {
  id: string
  label: string
  type: 'number' | 'text' | 'slider' | 'select' | 'multiselect'
  unit?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  options?: string[]
  description?: string
  recommendedValue?: number | string
}

interface LifestyleFormProps {
  onSubmit: (data: LifestyleData[]) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<LifestyleData>[]
}

const lifestyleCategories: LifestyleCategory[] = [
  {
    id: 'exercise',
    name: '運動・身体活動',
    icon: <Activity className="h-4 w-4" />,
    color: 'bg-green-500',
    fields: [
      {
        id: 'exercise_type',
        label: '運動の種類',
        type: 'multiselect',
        options: ['ウォーキング', 'ジョギング', 'サイクリング', '水泳', 'ヨガ', '筋トレ', 'ストレッチ', 'スポーツ', 'その他']
      },
      {
        id: 'exercise_duration',
        label: '運動時間',
        type: 'number',
        unit: '分',
        placeholder: '30',
        min: 5,
        max: 300,
        step: 5,
        recommendedValue: 30,
        description: '推奨: 1日30分以上'
      },
      {
        id: 'exercise_intensity',
        label: '運動強度',
        type: 'select',
        options: ['軽度（会話可能）', '中度（少し息切れ）', '高度（会話困難）']
      },
      {
        id: 'steps',
        label: '歩数',
        type: 'number',
        unit: '歩',
        placeholder: '10000',
        min: 0,
        max: 50000,
        step: 100,
        recommendedValue: 10000,
        description: '推奨: 1日10,000歩'
      }
    ]
  },
  {
    id: 'diet',
    name: '食事・栄養',
    icon: <Utensils className="h-4 w-4" />,
    color: 'bg-orange-500',
    fields: [
      {
        id: 'meals_count',
        label: '食事回数',
        type: 'number',
        unit: '回',
        placeholder: '3',
        min: 1,
        max: 6,
        recommendedValue: 3
      },
      {
        id: 'vegetable_servings',
        label: '野菜摂取量',
        type: 'slider',
        unit: '皿分',
        min: 0,
        max: 10,
        step: 0.5,
        recommendedValue: 5,
        description: '推奨: 1日5皿分以上'
      },
      {
        id: 'water_intake',
        label: '水分摂取量',
        type: 'number',
        unit: 'ml',
        placeholder: '2000',
        min: 0,
        max: 5000,
        step: 100,
        recommendedValue: 2000,
        description: '推奨: 1日2000ml以上'
      },
      {
        id: 'diet_quality',
        label: '食事の質',
        type: 'slider',
        min: 1,
        max: 10,
        step: 1,
        description: '1=ジャンクフード中心, 10=バランスの良い食事'
      }
    ]
  },
  {
    id: 'sleep',
    name: '睡眠',
    icon: <Moon className="h-4 w-4" />,
    color: 'bg-purple-500',
    fields: [
      {
        id: 'sleep_hours',
        label: '睡眠時間',
        type: 'number',
        unit: '時間',
        placeholder: '7',
        min: 0,
        max: 24,
        step: 0.5,
        recommendedValue: 7,
        description: '推奨: 7-9時間'
      },
      {
        id: 'sleep_quality',
        label: '睡眠の質',
        type: 'slider',
        min: 1,
        max: 10,
        step: 1,
        description: '1=非常に悪い, 10=非常に良い'
      },
      {
        id: 'sleep_interruptions',
        label: '夜間の覚醒回数',
        type: 'number',
        unit: '回',
        placeholder: '0',
        min: 0,
        max: 20
      },
      {
        id: 'bedtime',
        label: '就寝時刻',
        type: 'text',
        placeholder: '23:00'
      }
    ]
  },
  {
    id: 'habits',
    name: '嗜好品・習慣',
    icon: <Coffee className="h-4 w-4" />,
    color: 'bg-brown-500',
    fields: [
      {
        id: 'caffeine_intake',
        label: 'カフェイン摂取量',
        type: 'number',
        unit: '杯',
        placeholder: '2',
        min: 0,
        max: 10,
        description: 'コーヒー・紅茶・エナジードリンクなど'
      },
      {
        id: 'alcohol_intake',
        label: 'アルコール摂取量',
        type: 'number',
        unit: 'ドリンク',
        placeholder: '0',
        min: 0,
        max: 10,
        description: '1ドリンク = ビール350ml、ワイン125ml、ウイスキー40ml相当'
      },
      {
        id: 'smoking',
        label: '喫煙',
        type: 'select',
        options: ['吸わない', '禁煙中', '1日1-5本', '1日6-10本', '1日11-20本', '1日21本以上']
      }
    ]
  }
]

export function LifestyleForm({ onSubmit, onCancel, initialData = [] }: LifestyleFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('exercise')
  const [lifestyleData, setLifestyleData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    lifestyleCategories.forEach(category => {
      category.fields.forEach(field => {
        const existing = initialData.find(d => d.type === field.id)
        initial[field.id] = existing?.value || (field.type === 'slider' ? field.min || 1 : '')
      })
    })
    return initial
  })
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [completedCategories, setCompletedCategories] = useState<string[]>([])

  const handleFieldChange = (fieldId: string, value: any) => {
    setLifestyleData({ ...lifestyleData, [fieldId]: value })
  }

  const handleExerciseToggle = (exercise: string) => {
    setSelectedExercises(prev => 
      prev.includes(exercise) 
        ? prev.filter(e => e !== exercise)
        : [...prev, exercise]
    )
  }

  const handleCategoryComplete = () => {
    if (!completedCategories.includes(selectedCategory)) {
      setCompletedCategories([...completedCategories, selectedCategory])
      
      toast({
        title: "カテゴリーを記録しました",
        description: `${lifestyleCategories.find(c => c.id === selectedCategory)?.name}の情報を保存しました。`,
      })
    }

    // Move to next category
    const currentIndex = lifestyleCategories.findIndex(c => c.id === selectedCategory)
    if (currentIndex < lifestyleCategories.length - 1) {
      setSelectedCategory(lifestyleCategories[currentIndex + 1].id)
    }
  }

  const getFieldValue = (field: LifestyleField) => {
    const value = lifestyleData[field.id]
    if (field.type === 'slider' && value === undefined) {
      return field.min || 1
    }
    return value || ''
  }

  const getValueStatus = (field: LifestyleField, value: any) => {
    if (!field.recommendedValue || !value) return null
    
    const numValue = parseFloat(value)
    const recommended = parseFloat(field.recommendedValue.toString())
    
    if (isNaN(numValue) || isNaN(recommended)) return null
    
    const percentage = (numValue / recommended) * 100
    
    if (percentage >= 90) return 'excellent'
    if (percentage >= 70) return 'good'
    if (percentage >= 50) return 'fair'
    return 'poor'
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const handleSubmit = async () => {
    const data: LifestyleData[] = []
    const timestamp = new Date().toISOString()

    lifestyleCategories.forEach(category => {
      category.fields.forEach(field => {
        const value = lifestyleData[field.id]
        if (value !== undefined && value !== '' && value !== field.min) {
          data.push({
            id: `lifestyle_${Date.now()}_${field.id}`,
            category: category.id,
            type: field.id,
            value: field.id === 'exercise_type' ? selectedExercises.join(', ') : value,
            unit: field.unit,
            timestamp,
            notes: notes[field.id]
          })
        }
      })
    })

    if (data.length === 0) {
      toast({
        title: "データを入力してください",
        description: "少なくとも1つの項目を記録してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(data)
      
      toast({
        title: "ライフスタイルデータを記録しました",
        description: `${data.length}項目のデータを正常に記録しました。`,
      })
      
      // Reset form
      setLifestyleData({})
      setSelectedExercises([])
      setNotes({})
      setCompletedCategories([])
    } catch (error) {
      toast({
        title: "記録に失敗しました",
        description: "データの記録中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateCompletionRate = () => {
    let totalFields = 0
    let completedFields = 0

    lifestyleCategories.forEach(category => {
      category.fields.forEach(field => {
        totalFields++
        const value = lifestyleData[field.id]
        if (value !== undefined && value !== '' && value !== field.min) {
          completedFields++
        }
      })
    })

    return Math.round((completedFields / totalFields) * 100)
  }

  const completionRate = calculateCompletionRate()

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">記録の進捗</span>
            <span className="text-emerald-400 font-semibold">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <motion.div 
              className="bg-emerald-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {lifestyleCategories.map((category) => (
              <Badge
                key={category.id}
                variant={completedCategories.includes(category.id) ? 'default' : 'outline'}
                className={completedCategories.includes(category.id) 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-gray-400 border-gray-600'
                }
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {lifestyleCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={selectedCategory === category.id
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'text-gray-300 border-gray-600 hover:bg-gray-700'
            }
          >
            <div className={`p-1 rounded mr-2 ${category.color} text-white`}>
              {category.icon}
            </div>
            {category.name}
            {completedCategories.includes(category.id) && (
              <Check className="h-3 w-3 ml-2" />
            )}
          </Button>
        ))}
      </div>

      {/* Current Category Form */}
      {lifestyleCategories.map((category) => {
        if (category.id !== selectedCategory) return null

        return (
          <Card key={category.id} className="bg-gray-700/95 border-gray-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <div className={`p-2 rounded-lg ${category.color} text-white mr-3`}>
                  {category.icon}
                </div>
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {category.fields.map((field) => {
                const value = getFieldValue(field)
                const status = getValueStatus(field, value)

                return (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-white">{field.label}</Label>
                      {field.recommendedValue && value && (
                        <span className={`text-sm ${getStatusColor(status)}`}>
                          {status === 'excellent' ? '素晴らしい！' :
                           status === 'good' ? '良好' :
                           status === 'fair' ? '改善の余地あり' :
                           '要改善'}
                        </span>
                      )}
                    </div>

                    {/* Different input types */}
                    {field.type === 'number' && (
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder={field.placeholder}
                          value={value}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          className="bg-gray-600/50 border-gray-500 text-white pr-16"
                        />
                        {field.unit && (
                          <span className="absolute right-3 top-3 text-gray-400 text-sm">
                            {field.unit}
                          </span>
                        )}
                      </div>
                    )}

                    {field.type === 'text' && (
                      <Input
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="bg-gray-600/50 border-gray-500 text-white"
                      />
                    )}

                    {field.type === 'slider' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>{field.min}</span>
                          <span className="text-white font-medium">
                            {value} {field.unit}
                          </span>
                          <span>{field.max}</span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={(v) => handleFieldChange(field.id, v[0])}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          className="w-full"
                        />
                      </div>
                    )}

                    {field.type === 'select' && (
                      <div className="grid grid-cols-1 gap-2">
                        {field.options?.map((option) => (
                          <Button
                            key={option}
                            variant={value === option ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFieldChange(field.id, option)}
                            className={value === option
                              ? 'bg-emerald-600 hover:bg-emerald-700 justify-start'
                              : 'text-gray-300 border-gray-600 hover:bg-gray-700 justify-start'
                            }
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}

                    {field.type === 'multiselect' && field.id === 'exercise_type' && (
                      <div className="grid grid-cols-2 gap-2">
                        {field.options?.map((option) => (
                          <Button
                            key={option}
                            variant={selectedExercises.includes(option) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleExerciseToggle(option)}
                            className={selectedExercises.includes(option)
                              ? 'bg-emerald-600 hover:bg-emerald-700'
                              : 'text-gray-300 border-gray-600 hover:bg-gray-700'
                            }
                          >
                            {selectedExercises.includes(option) ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <Plus className="h-3 w-3 mr-1" />
                            )}
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}

                    {field.description && (
                      <p className="text-xs text-gray-400 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        {field.description}
                      </p>
                    )}

                    {/* Notes for this field */}
                    <Input
                      placeholder="メモ（任意）"
                      value={notes[field.id] || ''}
                      onChange={(e) => setNotes({ ...notes, [field.id]: e.target.value })}
                      className="bg-gray-600/30 border-gray-600 text-white text-sm"
                    />
                  </motion.div>
                )
              })}

              {/* Category Complete Button */}
              <Button
                onClick={handleCategoryComplete}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Check className="h-4 w-4 mr-2" />
                このカテゴリーを記録
              </Button>
            </CardContent>
          </Card>
        )
      })}

      {/* Health Tips */}
      <Card className="bg-blue-500/10 border border-blue-400/30">
        <CardContent className="p-4">
          <h4 className="text-blue-400 font-medium mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            健康的なライフスタイルのヒント
          </h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• 運動は週150分以上の中強度活動が推奨されています</li>
            <li>• バランスの良い食事と十分な水分補給を心がけましょう</li>
            <li>• 質の良い睡眠は健康の基盤です（7-9時間推奨）</li>
            <li>• アルコールは適量を守り、禁煙を心がけましょう</li>
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
          disabled={isLoading || completionRate === 0}
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
              ライフスタイルデータを記録
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Add missing import
import { Check } from 'lucide-react'