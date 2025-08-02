'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  MapPin,
  Thermometer,
  Activity,
  Brain,
  Heart,
  Pill,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Save,
  Sparkles
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Symptom {
  id: string
  name: string
  severity: number
  duration: string
  location?: string
  triggers: string[]
  description?: string
  startTime: string
  isOngoing: boolean
}

interface SymptomCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  symptoms: string[]
}

interface SymptomRecordFormProps {
  onSubmit: (symptoms: Symptom[]) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<Symptom>[]
}

const symptomCategories: SymptomCategory[] = [
  {
    id: 'general',
    name: '一般症状',
    icon: <Activity className="h-4 w-4" />,
    color: 'bg-blue-500',
    symptoms: ['疲労', '発熱', '悪寒', '倦怠感', '食欲不振', '体重変化']
  },
  {
    id: 'pain',
    name: '痛み',
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'bg-red-500',
    symptoms: ['頭痛', '腹痛', '胸痛', '背中の痛み', '関節痛', '筋肉痛']
  },
  {
    id: 'respiratory',
    name: '呼吸器',
    icon: <Activity className="h-4 w-4" />,
    color: 'bg-cyan-500',
    symptoms: ['咳', '息切れ', '鼻づまり', '喉の痛み', '喘鳴']
  },
  {
    id: 'digestive',
    name: '消化器',
    icon: <Pill className="h-4 w-4" />,
    color: 'bg-yellow-500',
    symptoms: ['吐き気', '嘔吐', '下痢', '便秘', '胃もたれ', '胸やけ']
  },
  {
    id: 'neurological',
    name: '神経系',
    icon: <Brain className="h-4 w-4" />,
    color: 'bg-purple-500',
    symptoms: ['めまい', 'しびれ', '震え', '記憶障害', '集中力低下']
  },
  {
    id: 'psychological',
    name: '精神的',
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-pink-500',
    symptoms: ['不安', '憂鬱', 'イライラ', '不眠', '気分の変動']
  }
]

const durationOptions = [
  '数分',
  '30分未満',
  '1時間未満',
  '数時間',
  '半日',
  '1日',
  '数日',
  '1週間以上',
  '継続中'
]

const commonTriggers = [
  'ストレス',
  '運動',
  '食事',
  '睡眠不足',
  '天候',
  '姿勢',
  '薬の副作用',
  '特定の食品',
  'アルコール',
  'カフェイン'
]

export function SymptomRecordForm({ onSubmit, onCancel, initialData = [] }: SymptomRecordFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('general')
  const [symptoms, setSymptoms] = useState<Symptom[]>(
    initialData.length > 0 
      ? initialData.map((data, index) => ({
          id: `symptom_${Date.now()}_${index}`,
          name: data.name || '',
          severity: data.severity || 5,
          duration: data.duration || '',
          location: data.location || '',
          triggers: data.triggers || [],
          description: data.description || '',
          startTime: data.startTime || new Date().toISOString(),
          isOngoing: data.isOngoing || false
        }))
      : []
  )
  const [currentSymptom, setCurrentSymptom] = useState<Partial<Symptom>>({
    severity: 5,
    triggers: [],
    startTime: new Date().toISOString(),
    isOngoing: false
  })
  const [customSymptomName, setCustomSymptomName] = useState('')
  const [customTrigger, setCustomTrigger] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>('general')

  const handleAddSymptom = (symptomName: string) => {
    const newSymptom: Symptom = {
      id: `symptom_${Date.now()}`,
      name: symptomName,
      severity: currentSymptom.severity || 5,
      duration: currentSymptom.duration || '',
      location: currentSymptom.location || '',
      triggers: currentSymptom.triggers || [],
      description: currentSymptom.description || '',
      startTime: currentSymptom.startTime || new Date().toISOString(),
      isOngoing: currentSymptom.isOngoing || false
    }

    setSymptoms([...symptoms, newSymptom])
    
    // Reset current symptom
    setCurrentSymptom({
      severity: 5,
      triggers: [],
      startTime: new Date().toISOString(),
      isOngoing: false
    })
    setCustomSymptomName('')

    toast({
      title: "症状を追加しました",
      description: `${symptomName}を記録リストに追加しました。`,
    })
  }

  const handleRemoveSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id))
  }

  const handleUpdateSymptom = (id: string, updates: Partial<Symptom>) => {
    setSymptoms(symptoms.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ))
  }

  const handleAddTrigger = (trigger: string) => {
    if (trigger && !currentSymptom.triggers?.includes(trigger)) {
      setCurrentSymptom({
        ...currentSymptom,
        triggers: [...(currentSymptom.triggers || []), trigger]
      })
    }
    setCustomTrigger('')
  }

  const handleRemoveTrigger = (trigger: string) => {
    setCurrentSymptom({
      ...currentSymptom,
      triggers: currentSymptom.triggers?.filter(t => t !== trigger) || []
    })
  }

  const handleSubmit = async () => {
    if (symptoms.length === 0) {
      toast({
        title: "症状を追加してください",
        description: "少なくとも1つの症状を記録してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(symptoms)
      
      toast({
        title: "症状を記録しました",
        description: `${symptoms.length}個の症状を正常に記録しました。`,
      })
      
      // Reset form
      setSymptoms([])
      setCurrentSymptom({
        severity: 5,
        triggers: [],
        startTime: new Date().toISOString(),
        isOngoing: false
      })
    } catch (error) {
      toast({
        title: "記録に失敗しました",
        description: "症状の記録中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityLabel = (severity: number) => {
    if (severity <= 2) return '軽度'
    if (severity <= 4) return '軽中度'
    if (severity <= 6) return '中度'
    if (severity <= 8) return '重度'
    return '非常に重度'
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return 'text-green-400'
    if (severity <= 4) return 'text-yellow-400'
    if (severity <= 6) return 'text-orange-400'
    if (severity <= 8) return 'text-red-400'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Current Symptom Input */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
            症状を記録
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Symptom Categories */}
          <div className="space-y-3">
            <Label className="text-white">症状カテゴリー</Label>
            <div className="space-y-2">
              {symptomCategories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-600/50 rounded-lg border border-gray-600/50"
                >
                  <button
                    onClick={() => setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    )}
                    className="w-full p-3 flex items-center justify-between hover:bg-gray-600/70 transition-colors rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${category.color} text-white`}>
                        {category.icon}
                      </div>
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                    {expandedCategory === category.id ? 
                      <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  
                  <AnimatePresence>
                    {expandedCategory === category.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 pt-0 grid grid-cols-2 gap-2">
                          {category.symptoms.map((symptom) => (
                            <Button
                              key={symptom}
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddSymptom(symptom)}
                              className="justify-start text-gray-300 border-gray-500 hover:bg-gray-600"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {symptom}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Custom Symptom */}
          <div className="space-y-2">
            <Label className="text-white">カスタム症状</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="その他の症状を入力"
                value={customSymptomName}
                onChange={(e) => setCustomSymptomName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && customSymptomName) {
                    handleAddSymptom(customSymptomName)
                  }
                }}
                className="bg-gray-600/50 border-gray-500 text-white"
              />
              <Button
                onClick={() => customSymptomName && handleAddSymptom(customSymptomName)}
                disabled={!customSymptomName}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Symptom Details */}
          <div className="space-y-4 bg-gray-600/30 rounded-lg p-4">
            <h4 className="text-white font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
              症状の詳細設定
            </h4>

            {/* Severity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white">重症度</Label>
                <span className={`text-sm font-medium ${getSeverityColor(currentSymptom.severity || 5)}`}>
                  {currentSymptom.severity || 5}/10 - {getSeverityLabel(currentSymptom.severity || 5)}
                </span>
              </div>
              <Slider
                value={[currentSymptom.severity || 5]}
                onValueChange={(value) => setCurrentSymptom({ ...currentSymptom, severity: value[0] })}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-white">継続時間</Label>
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map((duration) => (
                  <Button
                    key={duration}
                    variant={currentSymptom.duration === duration ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentSymptom({ ...currentSymptom, duration })}
                    className={currentSymptom.duration === duration 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'text-gray-300 border-gray-500 hover:bg-gray-600'
                    }
                  >
                    {duration}
                  </Button>
                ))}
              </div>
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label className="text-white">発生時刻</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="datetime-local"
                    value={currentSymptom.startTime?.slice(0, 16) || ''}
                    onChange={(e) => setCurrentSymptom({ 
                      ...currentSymptom, 
                      startTime: new Date(e.target.value).toISOString() 
                    })}
                    className="pl-10 bg-gray-600/50 border-gray-500 text-white"
                  />
                </div>
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={currentSymptom.isOngoing}
                    onChange={(e) => setCurrentSymptom({ 
                      ...currentSymptom, 
                      isOngoing: e.target.checked 
                    })}
                    className="rounded border-gray-500"
                  />
                  <span className="text-sm">継続中</span>
                </label>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-white">発生部位（任意）</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="例：頭部、胸部、腹部など"
                  value={currentSymptom.location || ''}
                  onChange={(e) => setCurrentSymptom({ ...currentSymptom, location: e.target.value })}
                  className="pl-10 bg-gray-600/50 border-gray-500 text-white"
                />
              </div>
            </div>

            {/* Triggers */}
            <div className="space-y-2">
              <Label className="text-white">誘因・トリガー</Label>
              <div className="space-y-2">
                {currentSymptom.triggers && currentSymptom.triggers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentSymptom.triggers.map((trigger) => (
                      <Badge
                        key={trigger}
                        variant="secondary"
                        className="bg-gray-600 text-white"
                      >
                        {trigger}
                        <button
                          onClick={() => handleRemoveTrigger(trigger)}
                          className="ml-2 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {commonTriggers.map((trigger) => (
                    <Button
                      key={trigger}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTrigger(trigger)}
                      disabled={currentSymptom.triggers?.includes(trigger)}
                      className="text-gray-300 border-gray-500 hover:bg-gray-600 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {trigger}
                    </Button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="その他のトリガーを入力"
                    value={customTrigger}
                    onChange={(e) => setCustomTrigger(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && customTrigger) {
                        handleAddTrigger(customTrigger)
                      }
                    }}
                    className="bg-gray-600/50 border-gray-500 text-white"
                  />
                  <Button
                    onClick={() => customTrigger && handleAddTrigger(customTrigger)}
                    disabled={!customTrigger}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    追加
                  </Button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-white">詳細な説明（任意）</Label>
              <Textarea
                placeholder="症状の詳細、感じ方、その他の情報を入力"
                value={currentSymptom.description || ''}
                onChange={(e) => setCurrentSymptom({ ...currentSymptom, description: e.target.value })}
                className="bg-gray-600/50 border-gray-500 text-white min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Added Symptoms List */}
      {symptoms.length > 0 && (
        <Card className="bg-gray-700/95 border-gray-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-emerald-400" />
                記録する症状 ({symptoms.length})
              </span>
              <Badge variant="secondary" className="bg-emerald-600 text-white">
                {symptoms.length}個の症状
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {symptoms.map((symptom, index) => (
              <motion.div
                key={symptom.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-600/50 rounded-lg p-4 border border-gray-600/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold text-lg">{symptom.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                      <span className={getSeverityColor(symptom.severity)}>
                        重症度: {symptom.severity}/10
                      </span>
                      <span>継続時間: {symptom.duration || '未設定'}</span>
                      {symptom.location && <span>部位: {symptom.location}</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSymptom(symptom.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {symptom.triggers.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-400">トリガー: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {symptom.triggers.map((trigger) => (
                        <Badge
                          key={trigger}
                          variant="outline"
                          className="text-xs border-gray-500 text-gray-300"
                        >
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {symptom.description && (
                  <p className="text-sm text-gray-300 mt-2">{symptom.description}</p>
                )}

                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(symptom.startTime).toLocaleString('ja-JP')}
                  </span>
                  {symptom.isOngoing && (
                    <Badge variant="secondary" className="bg-orange-600 text-white text-xs">
                      継続中
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

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
          disabled={isLoading || symptoms.length === 0}
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
              症状を記録
            </>
          )}
        </Button>
      </div>
    </div>
  )
}