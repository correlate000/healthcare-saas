'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Heart,
  Brain,
  Users,
  Briefcase,
  Home,
  Coffee,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Star,
  Clock,
  Search,
  Filter,
  Download,
  BookOpen,
  Lightbulb,
  MessageCircle,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface EmotionEntry {
  id: string
  date: string
  time: string
  emotions: Array<{
    name: string
    intensity: number
    color: string
    emoji: string
  }>
  triggers: string[]
  category: 'work' | 'personal' | 'social' | 'health' | 'family'
  situation: string
  thoughts: string
  physicalSensations: string[]
  copingStrategies: string[]
  reflection: string
  isPrivate: boolean
  aiInsights?: string
  mood: number // 1-10 overall mood
}

const emotionOptions = [
  { name: '喜び', emoji: '😊', color: 'bg-yellow-400' },
  { name: '不安', emoji: '😰', color: 'bg-orange-400' },
  { name: '怒り', emoji: '😠', color: 'bg-red-400' },
  { name: '悲しみ', emoji: '😢', color: 'bg-blue-400' },
  { name: 'ストレス', emoji: '😤', color: 'bg-purple-400' },
  { name: '疲労', emoji: '😴', color: 'bg-gray-400' },
  { name: '興奮', emoji: '🤩', color: 'bg-pink-400' },
  { name: '混乱', emoji: '😵', color: 'bg-indigo-400' },
  { name: '孤独', emoji: '😔', color: 'bg-slate-400' },
  { name: '希望', emoji: '🌟', color: 'bg-green-400' },
  { name: '恐れ', emoji: '😨', color: 'bg-red-500' },
  { name: '満足', emoji: '😌', color: 'bg-teal-400' }
]

const triggerOptions = [
  '上司との会話', '同僚との関係', 'プレゼンテーション', '締切プレッシャー',
  'チームミーティング', '評価面談', '新しいプロジェクト', '残業',
  'クライアント対応', '人事異動', '昇進・昇格', 'ワークライフバランス',
  '通勤', '社内政治', '技術的課題', '予算の問題'
]

const physicalSensationOptions = [
  '頭痛', '肩こり', '胃の不調', '心拍数上昇', '手の震え',
  '息苦しさ', '筋肉の緊張', '食欲不振', '不眠', '疲労感'
]

const copingStrategyOptions = [
  '深呼吸', '散歩', '音楽を聴く', '友人に相談', 'AIキャラクターと対話',
  '運動', '読書', '瞑想', '日記を書く', '休憩を取る', 'お茶を飲む',
  '趣味に時間を使う', '家族と過ごす', '専門家に相談'
]

export default function EmotionDiary() {
  const [activeTab, setActiveTab] = useState('today')
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [selectedEmotions, setSelectedEmotions] = useState<Array<{name: string, intensity: number, color: string, emoji: string}>>([])
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [selectedPhysical, setSelectedPhysical] = useState<string[]>([])
  const [selectedCoping, setSelectedCoping] = useState<string[]>([])
  const [currentMood, setCurrentMood] = useState(5)
  const [category, setCategory] = useState<'work' | 'personal' | 'social' | 'health' | 'family'>('work')
  const [isPrivate, setIsPrivate] = useState(true)

  // Sample data
  const recentEntries: EmotionEntry[] = [
    {
      id: '1',
      date: '2025-06-18',
      time: '14:30',
      emotions: [
        { name: 'ストレス', intensity: 8, color: 'bg-purple-400', emoji: '😤' },
        { name: '不安', intensity: 6, color: 'bg-orange-400', emoji: '😰' }
      ],
      triggers: ['プレゼンテーション', '締切プレッシャー'],
      category: 'work',
      situation: '明日の重要なプレゼンの準備で一日中緊張していた',
      thoughts: 'うまくいくかな... 質問されたらどうしよう',
      physicalSensations: ['肩こり', '心拍数上昇'],
      copingStrategies: ['深呼吸', 'AIキャラクターと対話'],
      reflection: 'Lunaと話して少し気持ちが楽になった。準備はできているから大丈夫だと思えるようになった。',
      isPrivate: true,
      aiInsights: '最近プレゼン前のストレスパターンが見られますね。事前準備と深呼吸の組み合わせがあなたには効果的のようです。',
      mood: 4
    },
    {
      id: '2',
      date: '2025-06-17',
      time: '18:45',
      emotions: [
        { name: '疲労', intensity: 7, color: 'bg-gray-400', emoji: '😴' },
        { name: '満足', intensity: 6, color: 'bg-teal-400', emoji: '😌' }
      ],
      triggers: ['残業', 'プロジェクト完了'],
      category: 'work',
      situation: '大きなプロジェクトが一段落。疲れたけど達成感もある。',
      thoughts: 'やっと終わった。チームのみんなもお疲れさま。',
      physicalSensations: ['疲労感'],
      copingStrategies: ['お茶を飲む', '家族と過ごす'],
      reflection: '忙しかったけど、みんなで協力して良いものができた。',
      isPrivate: false,
      mood: 7
    }
  ]

  const addEmotion = (emotion: typeof emotionOptions[0]) => {
    if (!selectedEmotions.find(e => e.name === emotion.name)) {
      setSelectedEmotions([...selectedEmotions, { ...emotion, intensity: 5 }])
    }
  }

  const updateEmotionIntensity = (emotionName: string, intensity: number) => {
    setSelectedEmotions(selectedEmotions.map(e => 
      e.name === emotionName ? { ...e, intensity } : e
    ))
  }

  const toggleSelection = (item: string, selectedList: string[], setSelectedList: (list: string[]) => void) => {
    if (selectedList.includes(item)) {
      setSelectedList(selectedList.filter(i => i !== item))
    } else {
      setSelectedList([...selectedList, item])
    }
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'work': return <Briefcase className="w-4 h-4" />
      case 'personal': return <Heart className="w-4 h-4" />
      case 'social': return <Users className="w-4 h-4" />
      case 'health': return <Target className="w-4 h-4" />
      case 'family': return <Home className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'work': return 'text-blue-600 bg-blue-50'
      case 'personal': return 'text-purple-600 bg-purple-50'
      case 'social': return 'text-green-600 bg-green-50'
      case 'health': return 'text-red-600 bg-red-50'
      case 'family': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (isAddingEntry) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => setIsAddingEntry(false)}>
                ← 戻る
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">感情記録</h1>
                <p className="text-sm text-gray-600">あなたの感情を安全に記録</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsPrivate(!isPrivate)}>
                {isPrivate ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-6">
          {/* Privacy Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">完全プライベート記録</h4>
                  <p className="text-sm text-blue-700">
                    この記録は暗号化され、あなただけがアクセスできます。企業や第三者に共有されることは一切ありません。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Mood */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">全体的な気分</CardTitle>
              <CardDescription>今の気分を1-10で表現してください</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">とても悪い</span>
                  <span className="text-lg font-bold text-gray-900">{currentMood}</span>
                  <span className="text-sm text-gray-600">とても良い</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center">
                  <span className="text-2xl">
                    {currentMood <= 3 ? '😢' : currentMood <= 5 ? '😐' : currentMood <= 7 ? '🙂' : '😊'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">カテゴリ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {['work', 'personal', 'social', 'health', 'family'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat as any)}
                    className={`p-3 rounded-lg border-2 flex items-center space-x-2 ${
                      category === cat 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    <span className="text-sm font-medium">
                      {cat === 'work' ? '仕事' : 
                       cat === 'personal' ? '個人' :
                       cat === 'social' ? '社交' :
                       cat === 'health' ? '健康' : '家族'}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emotion Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">感じている感情</CardTitle>
              <CardDescription>複数選択可能です</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {emotionOptions.map((emotion) => (
                  <button
                    key={emotion.name}
                    onClick={() => addEmotion(emotion)}
                    className={`p-2 rounded-lg border text-center ${
                      selectedEmotions.find(e => e.name === emotion.name)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{emotion.emoji}</div>
                    <div className="text-xs">{emotion.name}</div>
                  </button>
                ))}
              </div>

              {/* Selected Emotions Intensity */}
              {selectedEmotions.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-gray-900">感情の強さを設定</h4>
                  {selectedEmotions.map((emotion) => (
                    <div key={emotion.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm flex items-center">
                          <span className="mr-2">{emotion.emoji}</span>
                          {emotion.name}
                        </span>
                        <span className="text-sm font-medium">{emotion.intensity}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={emotion.intensity}
                        onChange={(e) => updateEmotionIntensity(emotion.name, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Triggers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">きっかけ・トリガー</CardTitle>
              <CardDescription>何がこの感情を引き起こしましたか？</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {triggerOptions.map((trigger) => (
                  <button
                    key={trigger}
                    onClick={() => toggleSelection(trigger, selectedTriggers, setSelectedTriggers)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      selectedTriggers.includes(trigger)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {trigger}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Situation Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">状況の説明</CardTitle>
              <CardDescription>どのような状況でしたか？</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="例：上司との面談で来年の目標について話した。期待が高く、プレッシャーを感じた..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Thoughts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">その時の考え・思い</CardTitle>
              <CardDescription>頭の中にどのような考えが浮かびましたか？</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="例：本当にできるのかな、失敗したらどうしよう、みんなの期待に応えられるかな..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Physical Sensations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">身体の感覚</CardTitle>
              <CardDescription>身体にどのような変化がありましたか？</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {physicalSensationOptions.map((sensation) => (
                  <button
                    key={sensation}
                    onClick={() => toggleSelection(sensation, selectedPhysical, setSelectedPhysical)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      selectedPhysical.includes(sensation)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {sensation}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coping Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">対処法・取った行動</CardTitle>
              <CardDescription>どのように対処しましたか？</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {copingStrategyOptions.map((strategy) => (
                  <button
                    key={strategy}
                    onClick={() => toggleSelection(strategy, selectedCoping, setSelectedCoping)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      selectedCoping.includes(strategy)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {strategy}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reflection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">振り返り</CardTitle>
              <CardDescription>今回の経験から何か学んだことはありますか？</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="例：不安に感じても、実際にはそれほど悪くなかった。事前準備の大切さを改めて実感した..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="sticky bottom-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              size="lg"
              onClick={() => setIsAddingEntry(false)}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              記録を保存
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">感情日記</h1>
              <p className="text-sm text-gray-600">あなたの感情パターンを理解しましょう</p>
            </div>
            <Button 
              onClick={() => setIsAddingEntry(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              記録
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">今日</TabsTrigger>
            <TabsTrigger value="entries">記録一覧</TabsTrigger>
            <TabsTrigger value="insights">洞察</TabsTrigger>
            <TabsTrigger value="patterns">パターン</TabsTrigger>
          </TabsList>

          {/* Today Tab */}
          <TabsContent value="today" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date().toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-blue-600">今日の記録</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">7.2</div>
                    <div className="text-sm text-green-600">平均気分</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {recentEntries.slice(0, 3).map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(entry.category)}>
                        {getCategoryIcon(entry.category)}
                        <span className="ml-1">
                          {entry.category === 'work' ? '仕事' : 
                           entry.category === 'personal' ? '個人' :
                           entry.category === 'social' ? '社交' :
                           entry.category === 'health' ? '健康' : '家族'}
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {entry.time}
                      </Badge>
                    </div>
                    <Badge variant="secondary">
                      気分 {entry.mood}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {entry.emotions.map((emotion, index) => (
                      <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
                        <span>{emotion.emoji}</span>
                        <span className="text-sm">{emotion.name}</span>
                        <span className="text-xs text-gray-500">({emotion.intensity})</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">{entry.situation}</p>
                  {entry.aiInsights && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-purple-700">{entry.aiInsights}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Entries Tab */}
          <TabsContent value="entries" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input placeholder="記録を検索..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {recentEntries.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(entry.category)}>
                        {getCategoryIcon(entry.category)}
                        <span className="ml-1">
                          {entry.category === 'work' ? '仕事' : 
                           entry.category === 'personal' ? '個人' :
                           entry.category === 'social' ? '社交' :
                           entry.category === 'health' ? '健康' : '家族'}
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        {new Date(entry.date).toLocaleDateString('ja-JP')} {entry.time}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {entry.isPrivate && <Lock className="w-4 h-4 text-gray-400" />}
                      <Badge variant="secondary">
                        気分 {entry.mood}/10
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {entry.emotions.map((emotion, index) => (
                      <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
                        <span>{emotion.emoji}</span>
                        <span className="text-sm">{emotion.name}</span>
                        <span className="text-xs text-gray-500">({emotion.intensity})</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">{entry.situation}</p>
                  {entry.reflection && (
                    <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-300">
                      <p className="text-sm text-blue-700">💭 {entry.reflection}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  AIによる洞察
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">感情パターンの発見</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    最近のデータを分析すると、火曜日と木曜日にストレスレベルが高くなる傾向があります。
                    これは定期的なミーティングと関連している可能性があります。
                  </p>
                  <Button size="sm" variant="outline" className="text-purple-600 border-purple-300">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Zenと相談する
                  </Button>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">効果的な対処法</h4>
                  <p className="text-sm text-green-700 mb-3">
                    深呼吸とAIキャラクターとの対話があなたにとって最も効果的な対処法のようです。
                    継続することをお勧めします。
                  </p>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-300">
                    <Heart className="w-4 h-4 mr-2" />
                    Lunaと話す
                  </Button>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">成長の兆し</h4>
                  <p className="text-sm text-yellow-700">
                    この2週間で、困難な状況に対する対処能力が向上しています。
                    自己認識力も高まっており、素晴らしい進歩です。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  感情の傾向
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">ストレス</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">満足</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">不安</span>
                      <span className="text-sm font-medium">38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">喜び</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>よくあるトリガー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['プレゼンテーション', '締切プレッシャー', '上司との会話', 'チームミーティング'].map((trigger, index) => (
                    <div key={trigger} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{trigger}</span>
                      <Badge variant="secondary">{4 - index}回</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}