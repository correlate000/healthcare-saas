'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Input } from '@/src/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/components/ui/accordion'
import { 
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  Settings,
  Shield,
  Zap,
  Heart,
  Users,
  Target,
  Download,
  Smartphone,
  Globe,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Play
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'basic' | 'features' | 'technical' | 'privacy' | 'billing'
  popularity: number
  isHelpful?: boolean
}

interface Tutorial {
  id: string
  title: string
  description: string
  duration: string
  type: 'video' | 'interactive' | 'article'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'MindCareを始めるにはどうすればよいですか？',
    answer: 'アプリを開いて簡単なオンボーディングを完了するだけです。お気に入りのAIキャラクターを選択し、初回チェックインを行うことで、すぐにメンタルヘルスサポートを開始できます。',
    category: 'basic',
    popularity: 95
  },
  {
    id: '2',
    question: '個人データはどのように保護されていますか？',
    answer: 'すべてのデータは暗号化され、GDPR準拠のセキュアなサーバーで保管されています。同意なしに第三者と共有されることはなく、いつでもデータの削除を請求できます。',
    category: 'privacy',
    popularity: 89
  },
  {
    id: '3',
    question: 'AIキャラクターとの対話は本当に効果がありますか？',
    answer: '科学的研究に基づいて設計されたAIキャラクターは、認知行動療法とマインドフルネス手法を組み合わせて、ユーザーの感情的な健康をサポートします。多くのユーザーがストレス軽減を実感しています。',
    category: 'features',
    popularity: 87
  },
  {
    id: '4',
    question: 'チームつながり機能で同僚に身元がバレませんか？',
    answer: '完全匿名システムを採用しており、投稿内容から個人を特定することはできません。ニックネームと大まかな部署情報のみが表示され、詳細な個人情報は一切共有されません。',
    category: 'privacy',
    popularity: 83
  },
  {
    id: '5',
    question: 'デイリーチャレンジを忘れてしまった場合はどうなりますか？',
    answer: '連続記録は途切れますが、すぐに再開できます。過去のチャレンジも後から実行可能で、XPも獲得できます。継続することが重要なので、無理をせず自分のペースで進めてください。',
    category: 'features',
    popularity: 76
  },
  {
    id: '6',
    question: 'アプリが正常に動作しない場合の対処法は？',
    answer: 'まずアプリを再起動し、最新バージョンに更新してください。問題が続く場合は、デバイスの再起動を試してください。それでも解決しない場合は、サポートチームにお問い合わせください。',
    category: 'technical',
    popularity: 72
  },
  {
    id: '7',
    question: '管理者は従業員の詳細な記録を見ることができますか？',
    answer: '管理者が閲覧できるのは、個人を特定できない集計データのみです。具体的な感情記録や対話内容、個人の詳細データにアクセスすることはできません。',
    category: 'privacy',
    popularity: 81
  },
  {
    id: '8',
    question: '緊急時の支援はどのように利用しますか？',
    answer: 'アプリ内の緊急サポートページから24時間対応の相談窓口にアクセスできます。深刻な状況では、遠慮なく110番や119番に連絡してください。',
    category: 'basic',
    popularity: 68
  }
]

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'MindCare基本操作ガイド',
    description: 'アプリの基本的な使い方を5分で学習',
    duration: '5分',
    type: 'video',
    difficulty: 'beginner',
    category: '基本操作'
  },
  {
    id: '2',
    title: '効果的なチェックインの方法',
    description: '感情記録を最大限活用するテクニック',
    duration: '8分',
    type: 'interactive',
    difficulty: 'beginner',
    category: 'チェックイン'
  },
  {
    id: '3',
    title: 'AIキャラクターとの上手な付き合い方',
    description: 'より深い対話と支援を得るための方法',
    duration: '12分',
    type: 'article',
    difficulty: 'intermediate',
    category: 'AI対話'
  },
  {
    id: '4',
    title: 'プライバシー設定の詳細カスタマイズ',
    description: 'あなたのデータを完全にコントロール',
    duration: '6分',
    type: 'interactive',
    difficulty: 'advanced',
    category: 'プライバシー'
  }
]

const supportChannels = [
  {
    name: 'ライブチャット',
    description: 'リアルタイムでサポートチームに相談',
    availability: '平日 9:00-18:00',
    responseTime: '平均2分',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'bg-green-500'
  },
  {
    name: 'メールサポート',
    description: '詳細な質問や要望をメールで送信',
    availability: '24時間受付',
    responseTime: '24時間以内',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-blue-500'
  },
  {
    name: '電話サポート',
    description: '緊急時や複雑な問題の電話相談',
    availability: '平日 10:00-17:00',
    responseTime: '即座',
    icon: <Phone className="w-5 h-5" />,
    color: 'bg-orange-500'
  },
  {
    name: 'コミュニティフォーラム',
    description: '他のユーザーとの情報交換',
    availability: '24時間',
    responseTime: 'コミュニティ依存',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-purple-500'
  }
]

export default function Help() {
  const [activeTab, setActiveTab] = useState('faq')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: 'basic', name: '基本', icon: <BookOpen className="w-4 h-4" />, count: 2 },
    { id: 'features', name: '機能', icon: <Zap className="w-4 h-4" />, count: 2 },
    { id: 'technical', name: '技術', icon: <Settings className="w-4 h-4" />, count: 1 },
    { id: 'privacy', name: 'プライバシー', icon: <Shield className="w-4 h-4" />, count: 3 },
    { id: 'billing', name: '料金', icon: <Target className="w-4 h-4" />, count: 0 }
  ]

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const markHelpful = (id: string, helpful: boolean) => {
    // Implementation for marking FAQ as helpful
    console.log(`FAQ ${id} marked as ${helpful ? 'helpful' : 'not helpful'}`)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'interactive': return <Target className="w-4 h-4" />
      case 'article': return <FileText className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-red-600 bg-red-50'
      case 'interactive': return 'text-blue-600 bg-blue-50'
      case 'article': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Badge className="bg-green-100 text-green-700">初心者</Badge>
      case 'intermediate': return <Badge className="bg-yellow-100 text-yellow-700">中級者</Badge>
      case 'advanced': return <Badge className="bg-red-100 text-red-700">上級者</Badge>
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <HelpCircle className="w-6 h-6 mr-2" />
                ヘルプ・サポート
              </h1>
              <p className="text-blue-100">困ったときはここで解決策を見つけましょう</p>
            </div>
            <Badge className="bg-white/20 text-white border border-white/30">
              <Clock className="w-3 h-3 mr-1" />
              24時間対応
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">98%</div>
              <div className="text-sm text-blue-100">問題解決率</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">2分</div>
              <div className="text-sm text-blue-100">平均応答時間</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">24/7</div>
              <div className="text-sm text-blue-100">サポート体制</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-4 py-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">よくある質問</CardTitle>
            <CardDescription>最も多く寄せられる質問の回答</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center space-y-1"
                onClick={() => setActiveTab('faq')}
              >
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-600">FAQ</span>
              </Button>
              
              <Button 
                variant="outline"
                className="h-16 flex flex-col items-center justify-center space-y-1"
                onClick={() => setActiveTab('tutorials')}
              >
                <Play className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600">チュートリアル</span>
              </Button>

              <Button 
                variant="outline"
                className="h-16 flex flex-col items-center justify-center space-y-1"
                onClick={() => setActiveTab('contact')}
              >
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-purple-600">お問い合わせ</span>
              </Button>

              <Button 
                variant="outline"
                className="h-16 flex flex-col items-center justify-center space-y-1"
                onClick={() => window.open('/emergency-support')}
              >
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-600">緊急時サポート</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tutorials">ガイド</TabsTrigger>
            <TabsTrigger value="contact">お問い合わせ</TabsTrigger>
            <TabsTrigger value="resources">リソース</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input 
                    placeholder="質問を検索..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  すべて
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-1 flex-shrink-0"
                  >
                    {category.icon}
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {filteredFAQ
                .sort((a, b) => b.popularity - a.popularity)
                .map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-start space-x-3 text-left">
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.id === faq.category)?.name}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-gray-500">{faq.popularity}%</span>
                          </div>
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <span className="text-sm text-gray-500">この回答は役に立ちましたか？</span>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markHelpful(faq.id, true)}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              はい
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markHelpful(faq.id, false)}
                            >
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              いいえ
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>

            {filteredFAQ.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">該当する質問が見つかりません</h3>
                  <p className="text-gray-600 mb-4">
                    お探しの情報が見つからない場合は、サポートチームにお問い合わせください。
                  </p>
                  <Button onClick={() => setActiveTab('contact')}>
                    お問い合わせ
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>学習ガイド</CardTitle>
                <CardDescription>
                  MindCareを効果的に活用するためのチュートリアル
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${getTypeColor(tutorial.type)}`}>
                          {getTypeIcon(tutorial.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-900">{tutorial.title}</h4>
                            {getDifficultyBadge(tutorial.difficulty)}
                          </div>
                          <p className="text-sm text-gray-600">{tutorial.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {tutorial.duration}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {tutorial.category}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1">お役立ちヒント</h4>
                    <p className="text-sm text-blue-800">
                      初めてお使いの方は「基本操作ガイド」から始めることをお勧めします。
                      各機能を段階的に学習することで、より効果的にMindCareを活用できます。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>サポートチャンネル</CardTitle>
                <CardDescription>
                  お困りの内容に応じて最適なサポート方法を選択してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportChannels.map((channel, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${channel.color} text-white`}>
                          {channel.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{channel.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">対応時間:</span> {channel.availability}
                            </div>
                            <div>
                              <span className="font-medium">応答時間:</span> {channel.responseTime}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>お問い合わせフォーム</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">件名</label>
                    <Input placeholder="お問い合わせの件名を入力してください" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">カテゴリ</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>技術的な問題</option>
                      <option>機能の使い方</option>
                      <option>プライバシーについて</option>
                      <option>料金について</option>
                      <option>その他</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">詳細</label>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md h-24"
                      placeholder="問題の詳細や質問内容を具体的にお書きください"
                    />
                  </div>
                  <Button className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    送信する
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>ダウンロード資料</CardTitle>
                <CardDescription>
                  オフラインでも参照できる資料をダウンロードできます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'MindCare ユーザーガイド', type: 'PDF', size: '2.3MB', description: '全機能の詳細な使い方' },
                  { title: 'プライバシーポリシー', type: 'PDF', size: '856KB', description: 'データ取り扱いに関する詳細' },
                  { title: 'メンタルヘルス基礎資料', type: 'PDF', size: '1.7MB', description: '職場でのメンタルケア基礎知識' },
                  { title: 'トラブルシューティングガイド', type: 'PDF', size: '1.2MB', description: 'よくある問題の解決方法' }
                ].map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-red-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{resource.title}</h4>
                        <p className="text-sm text-gray-600">{resource.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {resource.type} • {resource.size}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      ダウンロード
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>外部リンク</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: '公式ウェブサイト', url: 'https://mindcare.com', description: '最新情報とアップデート' },
                  { title: 'コミュニティフォーラム', url: 'https://community.mindcare.com', description: 'ユーザー同士の情報交換' },
                  { title: 'サポートセンター', url: 'https://support.mindcare.com', description: '詳細なヘルプドキュメント' },
                  { title: 'ブログ', url: 'https://blog.mindcare.com', description: 'メンタルヘルスに関する記事' }
                ].map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{link.title}</h4>
                        <p className="text-sm text-gray-600">{link.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      開く
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}