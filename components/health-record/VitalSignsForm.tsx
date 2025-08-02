'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Activity,
  Thermometer,
  Weight,
  Ruler,
  Wind,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
  Save,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface VitalSign {
  type: string
  value: number | string
  unit: string
  timestamp: string
  notes?: string
}

interface VitalSignField {
  id: string
  label: string
  icon: React.ReactNode
  unit: string
  placeholder: string
  min?: number
  max?: number
  step?: number
  normalRange?: { min: number; max: number }
  description?: string
  inputType?: 'number' | 'text'
  multiValue?: boolean
}

interface VitalSignsFormProps {
  onSubmit: (vitalSigns: VitalSign[]) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<VitalSign>[]
  showHistory?: boolean
}

const vitalSignFields: VitalSignField[] = [
  {
    id: 'blood_pressure',
    label: '血圧',
    icon: <Activity className="h-4 w-4" />,
    unit: 'mmHg',
    placeholder: '120/80',
    normalRange: { min: 90, max: 140 },
    description: '収縮期/拡張期',
    inputType: 'text',
    multiValue: true
  },
  {
    id: 'heart_rate',
    label: '心拍数',
    icon: <Heart className="h-4 w-4" />,
    unit: 'bpm',
    placeholder: '70',
    min: 30,
    max: 200,
    step: 1,
    normalRange: { min: 60, max: 100 },
    description: '安静時の心拍数'
  },
  {
    id: 'temperature',
    label: '体温',
    icon: <Thermometer className="h-4 w-4" />,
    unit: '°C',
    placeholder: '36.5',
    min: 35,
    max: 42,
    step: 0.1,
    normalRange: { min: 36.0, max: 37.5 },
    description: '腋下または口腔内'
  },
  {
    id: 'respiratory_rate',
    label: '呼吸数',
    icon: <Wind className="h-4 w-4" />,
    unit: '回/分',
    placeholder: '16',
    min: 5,
    max: 50,
    step: 1,
    normalRange: { min: 12, max: 20 },
    description: '1分間の呼吸回数'
  },
  {
    id: 'oxygen_saturation',
    label: '酸素飽和度',
    icon: <Droplets className="h-4 w-4" />,
    unit: '%',
    placeholder: '98',
    min: 50,
    max: 100,
    step: 1,
    normalRange: { min: 95, max: 100 },
    description: 'SpO2値'
  },
  {
    id: 'weight',
    label: '体重',
    icon: <Weight className="h-4 w-4" />,
    unit: 'kg',
    placeholder: '65.5',
    min: 20,
    max: 300,
    step: 0.1,
    description: '同じ条件で測定'
  },
  {
    id: 'height',
    label: '身長',
    icon: <Ruler className="h-4 w-4" />,
    unit: 'cm',
    placeholder: '170',
    min: 50,
    max: 250,
    step: 0.1,
    description: '最新の身長'
  }
]

export function VitalSignsForm({ 
  onSubmit, 
  onCancel, 
  initialData = [],
  showHistory = false 
}: VitalSignsFormProps) {
  const [vitalSigns, setVitalSigns] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    vitalSignFields.forEach(field => {
      const existingData = initialData.find(d => d.type === field.id)
      initial[field.id] = existingData?.value?.toString() || ''
    })
    return initial
  })
  
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [measurementTime, setMeasurementTime] = useState(new Date().toISOString().slice(0, 16))
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateField = (fieldId: string, value: string): string | null => {
    const field = vitalSignFields.find(f => f.id === fieldId)
    if (!field || !value) return null

    if (field.multiValue && fieldId === 'blood_pressure') {
      const parts = value.split('/')
      if (parts.length !== 2) {
        return '収縮期/拡張期の形式で入力してください（例: 120/80）'
      }
      const systolic = parseFloat(parts[0])
      const diastolic = parseFloat(parts[1])
      
      if (isNaN(systolic) || isNaN(diastolic)) {
        return '有効な数値を入力してください'
      }
      
      if (systolic < 70 || systolic > 250) {
        return '収縮期血圧は70-250の範囲で入力してください'
      }
      
      if (diastolic < 40 || diastolic > 150) {
        return '拡張期血圧は40-150の範囲で入力してください'
      }
      
      if (systolic <= diastolic) {
        return '収縮期血圧は拡張期血圧より高い必要があります'
      }
    } else {
      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        return '有効な数値を入力してください'
      }
      
      if (field.min !== undefined && numValue < field.min) {
        return `${field.min}以上の値を入力してください`
      }
      
      if (field.max !== undefined && numValue > field.max) {
        return `${field.max}以下の値を入力してください`
      }
    }

    return null
  }

  const handleValueChange = (fieldId: string, value: string) => {
    setVitalSigns({ ...vitalSigns, [fieldId]: value })
    
    // Clear validation error when user types
    if (validationErrors[fieldId]) {
      setValidationErrors({ ...validationErrors, [fieldId]: '' })
    }
  }

  const getFieldStatus = (fieldId: string, value: string) => {
    const field = vitalSignFields.find(f => f.id === fieldId)
    if (!field || !value || !field.normalRange) return null

    if (fieldId === 'blood_pressure') {
      const parts = value.split('/')
      if (parts.length !== 2) return null
      
      const systolic = parseFloat(parts[0])
      const diastolic = parseFloat(parts[1])
      
      if (isNaN(systolic) || isNaN(diastolic)) return null
      
      if (systolic >= 180 || diastolic >= 120) return 'critical'
      if (systolic >= 140 || diastolic >= 90) return 'warning'
      if (systolic < 90 || diastolic < 60) return 'warning'
      
      return 'normal'
    } else {
      const numValue = parseFloat(value)
      if (isNaN(numValue)) return null

      if (numValue < field.normalRange.min || numValue > field.normalRange.max) {
        return 'warning'
      }
      
      return 'normal'
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'normal':
        return 'border-green-400'
      case 'warning':
        return 'border-yellow-400'
      case 'critical':
        return 'border-red-400'
      default:
        return 'border-gray-500'
    }
  }

  const handleSubmit = async () => {
    // Validate all fields
    const errors: Record<string, string> = {}
    let hasValues = false

    vitalSignFields.forEach(field => {
      const value = vitalSigns[field.id]
      if (value) {
        hasValues = true
        const error = validateField(field.id, value)
        if (error) {
          errors[field.id] = error
        }
      }
    })

    if (!hasValues) {
      toast({
        title: "データを入力してください",
        description: "少なくとも1つのバイタルサインを記録してください。",
        variant: "destructive",
      })
      return
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast({
        title: "入力エラー",
        description: "入力内容を確認してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const vitalSignsData: VitalSign[] = []
      
      vitalSignFields.forEach(field => {
        const value = vitalSigns[field.id]
        if (value) {
          vitalSignsData.push({
            type: field.id,
            value,
            unit: field.unit,
            timestamp: new Date(measurementTime).toISOString(),
            notes: notes[field.id]
          })
        }
      })

      await onSubmit(vitalSignsData)
      
      toast({
        title: "バイタルサインを記録しました",
        description: `${vitalSignsData.length}項目のデータを正常に記録しました。`,
      })
      
      // Reset form
      setVitalSigns({})
      setNotes({})
      setMeasurementTime(new Date().toISOString().slice(0, 16))
    } catch (error) {
      toast({
        title: "記録に失敗しました",
        description: "バイタルサインの記録中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateBMI = () => {
    const weight = parseFloat(vitalSigns.weight)
    const height = parseFloat(vitalSigns.height)
    
    if (!isNaN(weight) && !isNaN(height) && height > 0) {
      const heightInMeters = height / 100
      const bmi = weight / (heightInMeters * heightInMeters)
      return bmi.toFixed(1)
    }
    
    return null
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: '低体重', color: 'text-yellow-400' }
    if (bmi < 25) return { label: '標準体重', color: 'text-green-400' }
    if (bmi < 30) return { label: '肥満（1度）', color: 'text-yellow-400' }
    if (bmi < 35) return { label: '肥満（2度）', color: 'text-orange-400' }
    return { label: '肥満（3度）', color: 'text-red-400' }
  }

  const bmi = calculateBMI()

  return (
    <div className="space-y-6">
      {/* Measurement Time */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-400" />
            測定日時
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="datetime-local"
            value={measurementTime}
            onChange={(e) => setMeasurementTime(e.target.value)}
            className="bg-gray-600/50 border-gray-500 text-white"
          />
        </CardContent>
      </Card>

      {/* Vital Signs Input */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-emerald-400" />
            バイタルサイン
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vitalSignFields.map((field) => {
              const value = vitalSigns[field.id]
              const status = getFieldStatus(field.id, value)
              const error = validationErrors[field.id]
              
              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-white flex items-center">
                      <div className="p-1.5 rounded-lg bg-gray-600 mr-2">
                        {field.icon}
                      </div>
                      {field.label}
                    </Label>
                    {status && getStatusIcon(status)}
                  </div>
                  
                  <div className="relative">
                    <Input
                      type={field.inputType || 'number'}
                      placeholder={field.placeholder}
                      value={value}
                      onChange={(e) => handleValueChange(field.id, e.target.value)}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className={`bg-gray-600/50 border-gray-500 text-white pr-16 ${
                        error ? 'border-red-500' : getStatusColor(status)
                      }`}
                    />
                    <span className="absolute right-3 top-3 text-gray-400 text-sm">
                      {field.unit}
                    </span>
                  </div>

                  {field.description && !error && (
                    <p className="text-xs text-gray-400 flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      {field.description}
                    </p>
                  )}

                  {error && (
                    <p className="text-xs text-red-400 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {error}
                    </p>
                  )}

                  {field.normalRange && value && !error && (
                    <p className="text-xs text-gray-400">
                      正常範囲: {field.normalRange.min}-{field.normalRange.max} {field.unit}
                    </p>
                  )}

                  {/* Notes for this vital sign */}
                  <Input
                    placeholder="メモ（任意）"
                    value={notes[field.id] || ''}
                    onChange={(e) => setNotes({ ...notes, [field.id]: e.target.value })}
                    className="bg-gray-600/30 border-gray-600 text-white text-sm"
                  />
                </motion.div>
              )
            })}
          </div>

          {/* BMI Calculation */}
          {bmi && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-600/30 rounded-lg p-4 border border-gray-600/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium mb-1">BMI（体格指数）</h4>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-white">{bmi}</span>
                    <Badge 
                      variant="secondary" 
                      className={`${getBMICategory(parseFloat(bmi)).color} bg-gray-700`}
                    >
                      {getBMICategory(parseFloat(bmi)).label}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <p>体重 ÷ (身長m)²</p>
                  <p>標準: 18.5-24.9</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Tips */}
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              測定のポイント
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 血圧は安静時に測定してください</li>
              <li>• 体温は同じ部位・同じ時間帯で測定すると比較しやすくなります</li>
              <li>• 体重は同じ条件（起床後など）で測定しましょう</li>
            </ul>
          </div>
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
          disabled={isLoading || Object.values(vitalSigns).every(v => !v)}
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
              バイタルサインを記録
            </>
          )}
        </Button>
      </div>
    </div>
  )
}