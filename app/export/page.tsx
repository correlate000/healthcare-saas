'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar, 
  BarChart3, 
  Shield,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  FileImage,
  Archive
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock export data
const exportOptions = [
  {
    id: 'checkin_data',
    name: 'チェックインデータ',
    description: '気分・エネルギー・メモの記録',
    format: ['CSV', 'JSON'],
    size: '2.4 MB',
    records: 156,
    icon: <BarChart3 className="h-6 w-6 text-blue-500" />
  },
  {
    id: 'chat_history',
    name: 'AI対話履歴',
    description: 'AIキャラクターとの会話記録',
    format: ['TXT', 'JSON'],
    size: '8.7 MB',
    records: 89,
    icon: <FileText className="h-6 w-6 text-purple-500" />
  },
  {
    id: 'analytics_reports',
    name: '分析レポート',
    description: '週次・月次の詳細分析結果',
    format: ['PDF', 'CSV'],
    size: '5.1 MB',
    records: 12,
    icon: <FileImage className="h-6 w-6 text-green-500" />
  },
  {
    id: 'expert_sessions',
    name: '専門家面談記録',
    description: '面談の概要と記録（匿名化済み）',
    format: ['PDF'],
    size: '1.8 MB',
    records: 5,
    icon: <Calendar className="h-6 w-6 text-orange-500" />
  },
  {
    id: 'achievements',
    name: '達成・バッジデータ',
    description: '獲得したバッジと達成記録',
    format: ['JSON', 'CSV'],
    size: '0.3 MB',
    records: 28,
    icon: <CheckCircle className="h-6 w-6 text-yellow-500" />
  }
]

export default function DataExport() {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedFormat, setSelectedFormat] = useState('JSON')
  const [dateRange, setDateRange] = useState('all')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === exportOptions.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(exportOptions.map(item => item.id))
    }
  }

  const handleExport = async () => {
    if (selectedItems.length === 0) return

    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          // Simulate download
          setTimeout(() => {
            const blob = new Blob([JSON.stringify({
              export_date: new Date().toISOString(),
              data_types: selectedItems,
              format: selectedFormat,
              note: 'これはデモ用のエクスポートファイルです'
            }, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `mindcare-export-${new Date().toISOString().split('T')[0]}.${selectedFormat.toLowerCase()}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const getTotalSize = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = exportOptions.find(opt => opt.id === itemId)
      if (item) {
        const size = parseFloat(item.size.split(' ')[0])
        return total + size
      }
      return total
    }, 0).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-medium text-gray-900">データエクスポート</h1>
            <p className="text-xs text-gray-500">あなたのデータをダウンロード</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Privacy Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">プライバシー保護</h3>
                <p className="text-sm text-blue-800">
                  エクスポートされるデータは完全に匿名化され、個人を特定できる情報は含まれません。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>エクスポートするデータ</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedItems.length === exportOptions.length ? '全て解除' : '全て選択'}
              </Button>
            </CardTitle>
            <CardDescription>
              ダウンロードしたいデータを選択してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {exportOptions.map((option) => (
              <div 
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedItems.includes(option.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleItemToggle(option.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{option.name}</h3>
                      <div className="flex items-center space-x-2">
                        {selectedItems.includes(option.id) && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{option.records} 件の記録</span>
                      <span>{option.size}</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      {option.format.map((format) => (
                        <span 
                          key={format}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>エクスポート設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ファイル形式
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['JSON', 'CSV', 'PDF'].map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                      selectedFormat === format
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {format === 'JSON' && <FileText className="h-4 w-4 mx-auto mb-1" />}
                    {format === 'CSV' && <FileSpreadsheet className="h-4 w-4 mx-auto mb-1" />}
                    {format === 'PDF' && <FileImage className="h-4 w-4 mx-auto mb-1" />}
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                期間
              </label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">全期間</option>
                <option value="last_month">過去1ヶ月</option>
                <option value="last_3months">過去3ヶ月</option>
                <option value="last_6months">過去6ヶ月</option>
                <option value="custom">カスタム期間</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Export Summary */}
        {selectedItems.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>エクスポート概要</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">選択した項目</span>
                  <span className="font-medium">{selectedItems.length} 種類</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">推定ファイルサイズ</span>
                  <span className="font-medium">{getTotalSize()} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">形式</span>
                  <span className="font-medium">{selectedFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">期間</span>
                  <span className="font-medium">
                    {dateRange === 'all' && '全期間'}
                    {dateRange === 'last_month' && '過去1ヶ月'}
                    {dateRange === 'last_3months' && '過去3ヶ月'}
                    {dateRange === 'last_6months' && '過去6ヶ月'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export Progress */}
        {isExporting && (
          <Card>
            <CardContent className="p-6 text-center">
              <Archive className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">データを準備中...</h3>
              <Progress value={exportProgress} className="h-3 mb-2" />
              <p className="text-sm text-gray-600">{exportProgress}% 完了</p>
            </CardContent>
          </Card>
        )}

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={selectedItems.length === 0 || isExporting}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 animate-spin" />
              <span>エクスポート中...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>データをエクスポート</span>
            </div>
          )}
        </Button>

        {/* Terms */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-2">エクスポートに関する注意事項</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• エクスポートされたデータは30日後に自動削除されます</li>
              <li>• データは暗号化されて保存されます</li>
              <li>• 大容量のエクスポートには時間がかかる場合があります</li>
              <li>• エクスポート完了時にメール通知が送信されます</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}