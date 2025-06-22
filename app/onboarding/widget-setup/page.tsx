'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { AppLayout } from '@/src/components/layout/AppLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smartphone,
  Plus,
  Home,
  Clock,
  Heart,
  TrendingUp,
  MessageSquare,
  Calendar,
  Bell,
  CheckCircle,
  Settings,
  Download,
  Share,
  QrCode,
  Globe,
  Sparkles,
  Star,
  Target,
  Zap
} from 'lucide-react'
import { 
  RippleButton,
  TaskCompleteAnimation,
  FloatingNotification 
} from '@/src/components/ui/micro-interactions'

interface WidgetOption {
  id: string
  name: string
  description: string
  icon: any
  size: 'small' | 'medium' | 'large'
  color: string
  preview: string
  category: 'essential' | 'analytics' | 'social' | 'advanced'
}

const widgetOptions: WidgetOption[] = [
  {
    id: 'mood-quick',
    name: '気分クイックチェック',
    description: '1タップで気分を記録',
    icon: Heart,
    size: 'small',
    color: 'from-pink-400 to-rose-400',
    preview: '😊 今日の気分',
    category: 'essential'
  },
  {
    id: 'ai-chat-quick',
    name: 'AIクイックチャット',
    description: 'すぐにAIと会話開始',
    icon: MessageSquare,
    size: 'medium',
    color: 'from-blue-400 to-cyan-400',
    preview: '💬 Lunaとお話',
    category: 'essential'
  },
  {
    id: 'daily-stats',
    name: '今日の統計',
    description: 'ストリーク・XP・レベルを表示',
    icon: TrendingUp,
    size: 'medium',
    color: 'from-green-400 to-emerald-400',
    preview: '🔥 7日連続 • Lv.12',
    category: 'analytics'
  },
  {
    id: 'mood-calendar',
    name: '気分カレンダー',
    description: '今月の気分トレンドを一目で',
    icon: Calendar,
    size: 'large',
    color: 'from-purple-400 to-indigo-400',
    preview: '📅 今月の気分パターン',
    category: 'analytics'
  },
  {
    id: 'daily-goal',
    name: '今日の目標',
    description: 'デイリーミッションの進捗',
    icon: Target,
    size: 'medium',
    color: 'from-orange-400 to-yellow-400',
    preview: '🎯 3/4 ミッション完了',
    category: 'essential'
  },
  {
    id: 'team-pulse',
    name: 'チームの様子',
    description: '職場の匿名ムード（匿名）',
    icon: Globe,
    size: 'medium',
    color: 'from-teal-400 to-blue-400',
    preview: '👥 チーム全体 😊',
    category: 'social'
  },
  {
    id: 'breathing-reminder',
    name: '呼吸リマインダー',
    description: '定期的なマインドフルネス',
    icon: Clock,
    size: 'small',
    color: 'from-indigo-400 to-purple-400',
    preview: '🧘‍♂️ 深呼吸タイム',
    category: 'advanced'
  },
  {
    id: 'achievement-showcase',
    name: '実績ショーケース',
    description: '最新のバッジとレベル',
    icon: Star,
    size: 'medium',
    color: 'from-yellow-400 to-orange-400',
    preview: '🏆 新バッジ獲得！',
    category: 'advanced'
  }
]

const installationMethods = [
  {
    id: 'ios-safari',
    name: 'iPhone (Safari)',
    icon: Smartphone,
    steps: [
      'Safariで当サイトを開く',
      '画面下部の共有ボタンをタップ',
      '「ホーム画面に追加」を選択',
      'ウィジェットを長押しして編集'
    ]
  },
  {
    id: 'android-chrome',
    name: 'Android (Chrome)',
    icon: Smartphone,
    steps: [
      'Chromeで当サイトを開く',
      'メニュー（⋮）をタップ',
      '「アプリをインストール」を選択',
      'ホーム画面でウィジェット追加'
    ]
  },
  {
    id: 'web-browser',
    name: 'ブックマーク',
    icon: Globe,
    steps: [
      'このページをブックマーク',
      'ブラウザのホーム画面設定',
      'ショートカットを作成',
      'デスクトップに配置'
    ]
  }
]

export default function WidgetSetupPage() {
  const router = useRouter()
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(['mood-quick', 'ai-chat-quick'])
  const [currentStep, setCurrentStep] = useState(1)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('')

  const totalSteps = 3

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    )
  }

  const handleComplete = () => {
    // ウィジェット設定を保存
    localStorage.setItem('mindcare-widgets', JSON.stringify(selectedWidgets))
    
    setShowCompletion(true)
    setTimeout(() => {
      setShowNotification(true)
    }, 2000)
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 4000)
  }

  const getWidgetsByCategory = (category: string) => {
    return widgetOptions.filter(widget => widget.category === category)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ウィジェットを選択</h2>
              <p className="text-gray-600">ホーム画面で使いたい機能を選んでください</p>
            </div>

            {/* エッセンシャルウィジェット */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>基本機能</span>
              </h3>
              <div className="space-y-3">
                {getWidgetsByCategory('essential').map((widget) => (
                  <RippleButton
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedWidgets.includes(widget.id)
                        ? `bg-gradient-to-r ${widget.color} border-transparent text-white`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        selectedWidgets.includes(widget.id) ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                      }`}>
                        <widget.icon className={`h-6 w-6 ${
                          selectedWidgets.includes(widget.id) ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-semibold ${
                          selectedWidgets.includes(widget.id) ? 'text-white' : 'text-gray-800'
                        }`}>
                          {widget.name}
                        </div>
                        <div className={`text-sm ${
                          selectedWidgets.includes(widget.id) ? 'text-white opacity-90' : 'text-gray-600'
                        }`}>
                          {widget.description}
                        </div>
                        <div className={`text-xs mt-1 ${
                          selectedWidgets.includes(widget.id) ? 'text-white opacity-75' : 'text-gray-500'
                        }`}>
                          プレビュー: {widget.preview}
                        </div>
                      </div>
                      {selectedWidgets.includes(widget.id) && (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </RippleButton>
                ))}
              </div>
            </div>

            {/* 分析ウィジェット */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>分析・統計</span>
              </h3>
              <div className="space-y-3">
                {getWidgetsByCategory('analytics').map((widget) => (
                  <RippleButton
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedWidgets.includes(widget.id)
                        ? `bg-gradient-to-r ${widget.color} border-transparent text-white`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        selectedWidgets.includes(widget.id) ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                      }`}>
                        <widget.icon className={`h-6 w-6 ${
                          selectedWidgets.includes(widget.id) ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-semibold ${
                          selectedWidgets.includes(widget.id) ? 'text-white' : 'text-gray-800'
                        }`}>
                          {widget.name}
                        </div>
                        <div className={`text-sm ${
                          selectedWidgets.includes(widget.id) ? 'text-white opacity-90' : 'text-gray-600'
                        }`}>
                          {widget.description}
                        </div>
                        <div className={`text-xs mt-1 ${
                          selectedWidgets.includes(widget.id) ? 'text-white opacity-75' : 'text-gray-500'
                        }`}>
                          プレビュー: {widget.preview}
                        </div>
                      </div>
                      {selectedWidgets.includes(widget.id) && (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </RippleButton>
                ))}
              </div>
            </div>

            {/* ソーシャル＆アドバンス */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span>その他の機能</span>
              </h3>
              <div className="space-y-3">
                {[...getWidgetsByCategory('social'), ...getWidgetsByCategory('advanced')].map((widget) => (
                  <RippleButton
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedWidgets.includes(widget.id)
                        ? `bg-gradient-to-r ${widget.color} border-transparent text-white`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        selectedWidgets.includes(widget.id) ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                      }`}>
                        <widget.icon className={`h-6 w-6 ${
                          selectedWidgets.includes(widget.id) ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-semibold ${
                          selectedWidgets.includes(widget.id) ? 'text-white' : 'text-gray-800'
                        }`}>
                          {widget.name}
                        </div>
                        <div className={`text-sm ${
                          selectedWidgets.includes(widget.id) ? 'text-white opacity-90' : 'text-gray-600'
                        }`}>
                          {widget.description}
                        </div>
                        <div className={`text-xs mt-1 ${
                          selectedWidgets.includes(widget.id) ? 'text-white opacity-75' : 'text-gray-500'
                        }`}>
                          プレビュー: {widget.preview}
                        </div>
                      </div>
                      {selectedWidgets.includes(widget.id) && (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </RippleButton>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">インストール方法</h2>
              <p className="text-gray-600">お使いのデバイスに合わせて選択してください</p>
            </div>

            <div className="space-y-4">
              {installationMethods.map((method) => (
                <RippleButton
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <method.icon className={`h-8 w-8 ${
                      selectedMethod === method.id ? 'text-white' : 'text-gray-600'
                    }`} />
                    <div className="flex-1 text-left">
                      <div className={`font-semibold text-lg ${
                        selectedMethod === method.id ? 'text-white' : 'text-gray-800'
                      }`}>
                        {method.name}
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                </RippleButton>
              ))}
            </div>

            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">📱 インストール手順</h4>
                    <ol className="space-y-2">
                      {installationMethods.find(m => m.id === selectedMethod)?.steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="text-blue-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ウィジェットプレビュー</h2>
              <p className="text-gray-600">選択したウィジェットの配置例</p>
            </div>

            {/* ウィジェットプレビュー */}
            <div className="bg-gray-900 rounded-2xl p-6 relative">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white rounded-full opacity-60"></div>
              
              <div className="mt-8 space-y-4">
                <div className="text-white text-center text-sm opacity-75 mb-6">ホーム画面プレビュー</div>
                
                <div className="grid grid-cols-2 gap-3">
                  {selectedWidgets.slice(0, 6).map((widgetId) => {
                    const widget = widgetOptions.find(w => w.id === widgetId)!
                    return (
                      <div
                        key={widgetId}
                        className={`bg-gradient-to-br ${widget.color} rounded-2xl p-3 h-20 flex flex-col justify-between ${
                          widget.size === 'large' ? 'col-span-2' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <widget.icon className="h-5 w-5 text-white" />
                          <div className="text-white text-xs opacity-75">{widget.size}</div>
                        </div>
                        <div className="text-white text-xs font-medium">
                          {widget.preview}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {selectedWidgets.length > 6 && (
                  <div className="text-center text-white text-xs opacity-60">
                    +{selectedWidgets.length - 6} その他のウィジェット
                  </div>
                )}
              </div>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">🎉 設定完了</h4>
                    <p className="text-sm text-green-700">
                      選択した{selectedWidgets.length}個のウィジェットがホーム画面で利用できます。
                      後から設定画面で変更することも可能です。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <AppLayout title="ウィジェット設定">
      <div className="px-4 py-6 max-w-md mx-auto">
        
        {/* 完了アニメーション */}
        <TaskCompleteAnimation
          isVisible={showCompletion}
          onComplete={() => setShowCompletion(false)}
          xpGained={50}
          taskTitle="ウィジェット設定完了！"
        />

        <FloatingNotification
          isVisible={showNotification}
          title="すべて完了！"
          message="MindCareをお楽しみください"
          type="achievement"
          onClose={() => setShowNotification(false)}
        />

        <div className="space-y-6">
          {/* プログレス */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  ステップ {currentStep} / {totalSteps}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round((currentStep / totalSteps) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* ステップコンテンツ */}
          <Card>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* ナビゲーションボタン */}
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <RippleButton
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium"
              >
                <span>戻る</span>
              </RippleButton>
            )}
            
            <RippleButton
              onClick={() => {
                if (currentStep < totalSteps) {
                  setCurrentStep(currentStep + 1)
                } else {
                  handleComplete()
                }
              }}
              disabled={currentStep === 2 && !selectedMethod}
              className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                (currentStep !== 2 || selectedMethod)
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === totalSteps ? 'ダッシュボードへ' : '次へ'}</span>
              {currentStep === totalSteps ? <Home className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </RippleButton>
          </div>

          {/* 選択サマリー */}
          {selectedWidgets.length > 0 && (
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800 mb-1">選択中のウィジェット</h4>
                    <div className="text-sm text-purple-700">
                      {selectedWidgets.map(id => {
                        const widget = widgetOptions.find(w => w.id === id)
                        return widget?.name
                      }).join('、')}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      {selectedWidgets.length}個のウィジェットを選択中
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}