'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Pill, 
  Calendar,
  Clock,
  Plus,
  X,
  Save,
  AlertCircle,
  Info,
  Package,
  Timer,
  Repeat,
  CheckCircle,
  Coffee,
  Utensils,
  Moon,
  Sun
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  timing: string[]
  startDate: string
  endDate?: string
  purpose?: string
  sideEffects?: string[]
  notes?: string
  isActive: boolean
}

interface MedicationTiming {
  id: string
  label: string
  icon: React.ReactNode
}

interface MedicationFormProps {
  onSubmit: (medications: Medication[]) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<Medication>[]
  mode?: 'add' | 'edit'
}

const commonMedications = [
  { category: '痛み止め', items: ['ロキソニン', 'カロナール', 'ボルタレン', 'セレコックス'] },
  { category: '胃薬', items: ['ガスター', 'ネキシウム', 'タケプロン', 'ムコスタ'] },
  { category: '降圧薬', items: ['アムロジピン', 'オルメテック', 'ミカルディス', 'ノルバスク'] },
  { category: '糖尿病薬', items: ['メトグルコ', 'ジャヌビア', 'グルファスト', 'アマリール'] },
  { category: 'コレステロール', items: ['リピトール', 'クレストール', 'リバロ', 'ゼチーア'] },
  { category: '抗生物質', items: ['クラビット', 'フロモックス', 'ジスロマック', 'オーグメンチン'] }
]

const medicationTimings: MedicationTiming[] = [
  { id: 'morning', label: '朝', icon: <Sun className="h-4 w-4" /> },
  { id: 'noon', label: '昼', icon: <Utensils className="h-4 w-4" /> },
  { id: 'evening', label: '夕', icon: <Moon className="h-4 w-4" /> },
  { id: 'before_bed', label: '就寝前', icon: <Moon className="h-4 w-4" /> },
  { id: 'before_meal', label: '食前', icon: <Clock className="h-4 w-4" /> },
  { id: 'after_meal', label: '食後', icon: <Coffee className="h-4 w-4" /> },
  { id: 'as_needed', label: '頓服', icon: <AlertCircle className="h-4 w-4" /> }
]

const frequencies = [
  '毎日',
  '1日1回',
  '1日2回',
  '1日3回',
  '週1回',
  '週2回',
  '週3回',
  '隔日',
  '必要時',
  'その他'
]

const commonSideEffects = [
  '眠気',
  'めまい',
  '吐き気',
  '胃痛',
  '便秘',
  '下痢',
  '頭痛',
  '発疹',
  '口渇',
  '動悸'
]

export function MedicationForm({ 
  onSubmit, 
  onCancel, 
  initialData = [],
  mode = 'add' 
}: MedicationFormProps) {
  const [medications, setMedications] = useState<Medication[]>(
    initialData.length > 0 
      ? initialData.map((data, index) => ({
          id: data.id || `med_${Date.now()}_${index}`,
          name: data.name || '',
          dosage: data.dosage || '',
          frequency: data.frequency || '毎日',
          timing: data.timing || [],
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          endDate: data.endDate,
          purpose: data.purpose || '',
          sideEffects: data.sideEffects || [],
          notes: data.notes || '',
          isActive: data.isActive !== false
        }))
      : []
  )
  
  const [currentMedication, setCurrentMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: '毎日',
    timing: [],
    startDate: new Date().toISOString().split('T')[0],
    isActive: true,
    sideEffects: []
  })
  
  const [showMedicationList, setShowMedicationList] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [customSideEffect, setCustomSideEffect] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddMedication = () => {
    if (!currentMedication.name || !currentMedication.dosage) {
      toast({
        title: "入力エラー",
        description: "薬剤名と用量を入力してください。",
        variant: "destructive",
      })
      return
    }

    const newMedication: Medication = {
      id: `med_${Date.now()}`,
      name: currentMedication.name,
      dosage: currentMedication.dosage,
      frequency: currentMedication.frequency || '毎日',
      timing: currentMedication.timing || [],
      startDate: currentMedication.startDate || new Date().toISOString().split('T')[0],
      endDate: currentMedication.endDate,
      purpose: currentMedication.purpose,
      sideEffects: currentMedication.sideEffects || [],
      notes: currentMedication.notes,
      isActive: currentMedication.isActive !== false
    }

    setMedications([...medications, newMedication])
    
    // Reset form
    setCurrentMedication({
      name: '',
      dosage: '',
      frequency: '毎日',
      timing: [],
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
      sideEffects: []
    })

    toast({
      title: "薬剤を追加しました",
      description: `${newMedication.name}を服薬リストに追加しました。`,
    })
  }

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id))
  }

  const handleUpdateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(medications.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ))
  }

  const handleToggleTiming = (timingId: string) => {
    const currentTimings = currentMedication.timing || []
    const newTimings = currentTimings.includes(timingId)
      ? currentTimings.filter(t => t !== timingId)
      : [...currentTimings, timingId]
    
    setCurrentMedication({ ...currentMedication, timing: newTimings })
  }

  const handleAddSideEffect = (effect: string) => {
    if (effect && !currentMedication.sideEffects?.includes(effect)) {
      setCurrentMedication({
        ...currentMedication,
        sideEffects: [...(currentMedication.sideEffects || []), effect]
      })
    }
    setCustomSideEffect('')
  }

  const handleRemoveSideEffect = (effect: string) => {
    setCurrentMedication({
      ...currentMedication,
      sideEffects: currentMedication.sideEffects?.filter(e => e !== effect) || []
    })
  }

  const handleSubmit = async () => {
    if (medications.length === 0) {
      toast({
        title: "薬剤を追加してください",
        description: "少なくとも1つの薬剤を記録してください。",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(medications)
      
      toast({
        title: "服薬情報を記録しました",
        description: `${medications.length}個の薬剤情報を正常に記録しました。`,
      })
      
      // Reset form
      setMedications([])
      setCurrentMedication({
        name: '',
        dosage: '',
        frequency: '毎日',
        timing: [],
        startDate: new Date().toISOString().split('T')[0],
        isActive: true,
        sideEffects: []
      })
    } catch (error) {
      toast({
        title: "記録に失敗しました",
        description: "服薬情報の記録中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Medication */}
      <Card className="bg-gray-700/95 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Pill className="h-5 w-5 mr-2 text-purple-400" />
            服薬情報を記録
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Medication Name */}
          <div className="space-y-2">
            <Label className="text-white">薬剤名</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="薬剤名を入力"
                value={currentMedication.name || ''}
                onChange={(e) => setCurrentMedication({ ...currentMedication, name: e.target.value })}
                className="bg-gray-600/50 border-gray-500 text-white"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMedicationList(!showMedicationList)}
                className="border-gray-500 text-gray-300 hover:bg-gray-600"
              >
                <Package className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Common Medications List */}
          <AnimatePresence>
            {showMedicationList && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gray-600/30 rounded-lg p-4 space-y-3"
              >
                {commonMedications.map((category) => (
                  <div key={category.category}>
                    <button
                      onClick={() => setSelectedCategory(
                        selectedCategory === category.category ? null : category.category
                      )}
                      className="text-sm font-medium text-gray-300 mb-2 hover:text-white"
                    >
                      {category.category} {selectedCategory === category.category ? '▼' : '▶'}
                    </button>
                    {selectedCategory === category.category && (
                      <div className="grid grid-cols-2 gap-2">
                        {category.items.map((med) => (
                          <Button
                            key={med}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentMedication({ ...currentMedication, name: med })
                              setShowMedicationList(false)
                            }}
                            className="text-xs border-gray-500 text-gray-300 hover:bg-gray-600"
                          >
                            {med}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dosage */}
          <div className="space-y-2">
            <Label className="text-white">用量・用法</Label>
            <Input
              placeholder="例: 1錠、10mg、2包など"
              value={currentMedication.dosage || ''}
              onChange={(e) => setCurrentMedication({ ...currentMedication, dosage: e.target.value })}
              className="bg-gray-600/50 border-gray-500 text-white"
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label className="text-white">服用頻度</Label>
            <div className="grid grid-cols-3 gap-2">
              {frequencies.map((freq) => (
                <Button
                  key={freq}
                  variant={currentMedication.frequency === freq ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentMedication({ ...currentMedication, frequency: freq })}
                  className={currentMedication.frequency === freq 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'text-gray-300 border-gray-500 hover:bg-gray-600'
                  }
                >
                  {freq}
                </Button>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div className="space-y-2">
            <Label className="text-white">服用タイミング</Label>
            <div className="grid grid-cols-4 gap-2">
              {medicationTimings.map((timing) => (
                <Button
                  key={timing.id}
                  variant={currentMedication.timing?.includes(timing.id) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToggleTiming(timing.id)}
                  className={currentMedication.timing?.includes(timing.id) 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'text-gray-300 border-gray-500 hover:bg-gray-600'
                  }
                >
                  {timing.icon}
                  <span className="ml-1">{timing.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">開始日</Label>
              <Input
                type="date"
                value={currentMedication.startDate || ''}
                onChange={(e) => setCurrentMedication({ ...currentMedication, startDate: e.target.value })}
                className="bg-gray-600/50 border-gray-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">終了日（任意）</Label>
              <Input
                type="date"
                value={currentMedication.endDate || ''}
                onChange={(e) => setCurrentMedication({ ...currentMedication, endDate: e.target.value })}
                className="bg-gray-600/50 border-gray-500 text-white"
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label className="text-white">服用目的（任意）</Label>
            <Input
              placeholder="例: 頭痛、高血圧、胃炎など"
              value={currentMedication.purpose || ''}
              onChange={(e) => setCurrentMedication({ ...currentMedication, purpose: e.target.value })}
              className="bg-gray-600/50 border-gray-500 text-white"
            />
          </div>

          {/* Side Effects */}
          <div className="space-y-2">
            <Label className="text-white">副作用（任意）</Label>
            <div className="space-y-2">
              {currentMedication.sideEffects && currentMedication.sideEffects.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentMedication.sideEffects.map((effect) => (
                    <Badge
                      key={effect}
                      variant="secondary"
                      className="bg-orange-600/20 text-orange-300 border-orange-600/30"
                    >
                      {effect}
                      <button
                        onClick={() => handleRemoveSideEffect(effect)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                {commonSideEffects.map((effect) => (
                  <Button
                    key={effect}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSideEffect(effect)}
                    disabled={currentMedication.sideEffects?.includes(effect)}
                    className="text-xs text-gray-300 border-gray-500 hover:bg-gray-600"
                  >
                    {effect}
                  </Button>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="その他の副作用"
                  value={customSideEffect}
                  onChange={(e) => setCustomSideEffect(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && customSideEffect) {
                      handleAddSideEffect(customSideEffect)
                    }
                  }}
                  className="bg-gray-600/50 border-gray-500 text-white"
                />
                <Button
                  onClick={() => customSideEffect && handleAddSideEffect(customSideEffect)}
                  disabled={!customSideEffect}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  追加
                </Button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white">メモ（任意）</Label>
            <Textarea
              placeholder="服用に関する注意事項やメモ"
              value={currentMedication.notes || ''}
              onChange={(e) => setCurrentMedication({ ...currentMedication, notes: e.target.value })}
              className="bg-gray-600/50 border-gray-500 text-white"
            />
          </div>

          {/* Add Button */}
          <Button
            onClick={handleAddMedication}
            disabled={!currentMedication.name || !currentMedication.dosage}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            薬剤を追加
          </Button>
        </CardContent>
      </Card>

      {/* Medications List */}
      {medications.length > 0 && (
        <Card className="bg-gray-700/95 border-gray-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-purple-400" />
                服薬リスト ({medications.length})
              </span>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                {medications.filter(m => m.isActive).length}個の有効な薬剤
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((medication, index) => (
              <motion.div
                key={medication.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-600/50 rounded-lg p-4 border border-gray-600/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold text-lg flex items-center">
                      {medication.name}
                      {medication.isActive ? (
                        <CheckCircle className="h-4 w-4 ml-2 text-green-400" />
                      ) : (
                        <X className="h-4 w-4 ml-2 text-red-400" />
                      )}
                    </h4>
                    <p className="text-gray-300">{medication.dosage} - {medication.frequency}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMedication(medication.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {medication.timing.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {medication.timing.map((timingId) => {
                      const timing = medicationTimings.find(t => t.id === timingId)
                      return timing ? (
                        <Badge
                          key={timingId}
                          variant="secondary"
                          className="bg-gray-600 text-white"
                        >
                          {timing.icon}
                          <span className="ml-1">{timing.label}</span>
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-2">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    開始: {new Date(medication.startDate).toLocaleDateString('ja-JP')}
                  </div>
                  {medication.endDate && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      終了: {new Date(medication.endDate).toLocaleDateString('ja-JP')}
                    </div>
                  )}
                </div>

                {medication.purpose && (
                  <p className="text-sm text-gray-300 mb-2">
                    <span className="text-gray-400">目的:</span> {medication.purpose}
                  </p>
                )}

                {medication.sideEffects && medication.sideEffects.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-400">副作用: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {medication.sideEffects.map((effect) => (
                        <Badge
                          key={effect}
                          variant="outline"
                          className="text-xs border-orange-600/50 text-orange-300"
                        >
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {medication.notes && (
                  <p className="text-sm text-gray-400 italic">
                    <Info className="h-3 w-3 inline mr-1" />
                    {medication.notes}
                  </p>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Information Alert */}
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          服薬管理のポイント
        </h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• 薬剤名と用量は正確に記録しましょう</li>
          <li>• 副作用が現れた場合は医師に相談してください</li>
          <li>• 薬の飲み忘れを防ぐため、アラーム設定をおすすめします</li>
          <li>• 他の薬との相互作用に注意してください</li>
        </ul>
      </div>

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
          disabled={isLoading || medications.length === 0}
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
              服薬情報を記録
            </>
          )}
        </Button>
      </div>
    </div>
  )
}