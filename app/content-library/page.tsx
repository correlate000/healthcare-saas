'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen,
  Search,
  Filter,
  Clock,
  Users,
  Brain,
  Heart,
  Target,
  Lightbulb,
  Play,
  Headphones,
  FileText,
  Video,
  Mic,
  Star,
  Bookmark,
  Share,
  Download,
  CheckCircle,
  TrendingUp,
  Award,
  Coffee,
  Briefcase,
  Home,
  Shield,
  Zap,
  MessageCircle,
  ThumbsUp,
  Eye,
  ChevronRight
} from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  description: string
  type: 'article' | 'audio' | 'video' | 'exercise' | 'assessment'
  category: 'stress' | 'relationship' | 'leadership' | 'wellness' | 'productivity' | 'communication'
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  rating: number
  views: number
  isBookmarked: boolean
  isCompleted: boolean
  tags: string[]
  expert?: string
  thumbnail?: string
}

const categories = [
  { id: 'stress', name: 'ストレス管理', icon: <Brain className="w-4 h-4" />, color: 'bg-red-500' },
  { id: 'relationship', name: '人間関係', icon: <Users className="w-4 h-4" />, color: 'bg-blue-500' },
  { id: 'leadership', name: 'リーダーシップ', icon: <Target className="w-4 h-4" />, color: 'bg-purple-500' },
  { id: 'wellness', name: 'ウェルネス', icon: <Heart className="w-4 h-4" />, color: 'bg-green-500' },
  { id: 'productivity', name: '生産性向上', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-500' },
  { id: 'communication', name: 'コミュニケーション', icon: <MessageCircle className="w-4 h-4" />, color: 'bg-teal-500' },
]

const sampleContent: ContentItem[] = [
  {
    id: '1',
    title: '職場でのストレス対処法：5つの実践的テクニック',
    description: '忙しい職場環境でも実践できる、科学的根拠に基づいたストレス軽減方法を学びます。',
    type: 'article',
    category: 'stress',
    duration: '15分',
    difficulty: 'beginner',
    rating: 4.8,
    views: 1247,
    isBookmarked: false,
    isCompleted: false,
    tags: ['職場', 'ストレス', '実践的', '初心者向け'],
    expert: '田中心理士'
  },
  {
    id: '2',
    title: '3分間マインドフルネス瞑想',
    description: 'デスクでもできる短時間の瞑想で心をリセット。ガイド音声付きで初心者でも安心。',
    type: 'audio',
    category: 'wellness',
    duration: '3分',
    difficulty: 'beginner',
    rating: 4.9,
    views: 2156,
    isBookmarked: true,
    isCompleted: true,
    tags: ['瞑想', 'マインドフルネス', '短時間', 'オフィス'],
    expert: '山田瞑想インストラクター'
  },
  {
    id: '3',
    title: '困難な同僚との関係改善：実践ワークショップ',
    description: 'ロールプレイング形式で学ぶ、職場の人間関係を改善するコミュニケーション術。',
    type: 'video',
    category: 'relationship',
    duration: '25分',
    difficulty: 'intermediate',
    rating: 4.7,
    views: 934,
    isBookmarked: false,
    isCompleted: false,
    tags: ['人間関係', 'コミュニケーション', 'ワークショップ', '中級者'],
    expert: '佐藤コーチ'
  },
  {
    id: '4',
    title: 'ワークライフバランス診断テスト',
    description: '現在のワークライフバランスを科学的に測定し、改善ポイントを明確にします。',
    type: 'assessment',
    category: 'wellness',
    duration: '10分',
    difficulty: 'beginner',
    rating: 4.6,
    views: 1823,
    isBookmarked: true,
    isCompleted: false,
    tags: ['診断', 'ワークライフバランス', 'セルフチェック'],
    expert: '鈴木産業医'
  },
  {
    id: '5',
    title: '効果的なフィードバック方法',
    description: 'チームメンバーへの建設的なフィードバックの与え方と受け取り方を学びます。',
    type: 'article',
    category: 'leadership',
    duration: '20分',
    difficulty: 'intermediate',
    rating: 4.8,
    views: 756,
    isBookmarked: false,
    isCompleted: false,
    tags: ['リーダーシップ', 'フィードバック', 'チーム管理'],
    expert: '高橋マネージャー'
  },
  {
    id: '6',
    title: '深呼吸エクササイズ',
    description: '緊張や不安を和らげる4-7-8呼吸法をガイド付きで実践します。',
    type: 'exercise',
    category: 'stress',
    duration: '5分',
    difficulty: 'beginner',
    rating: 4.9,
    views: 3421,
    isBookmarked: true,
    isCompleted: true,
    tags: ['呼吸法', 'リラクゼーション', '簡単', '即効性'],
    expert: '木村呼吸療法士'
  }
]

export default function ContentLibrary() {
  const [activeTab, setActiveTab] = useState('featured')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />
      case 'audio': return <Headphones className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'exercise': return <Target className="w-4 h-4" />
      case 'assessment': return <CheckCircle className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'text-blue-600 bg-blue-50'
      case 'audio': return 'text-green-600 bg-green-50'
      case 'video': return 'text-red-600 bg-red-50'
      case 'exercise': return 'text-purple-600 bg-purple-50'
      case 'assessment': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Badge variant="secondary" className="text-green-600 bg-green-50">初心者</Badge>
      case 'intermediate': return <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">中級者</Badge>
      case 'advanced': return <Badge variant="secondary" className="text-red-600 bg-red-50">上級者</Badge>
      default: return null
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0]
  }

  const filteredContent = sampleContent.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  if (selectedContent) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedContent(null)}>
                ← 戻る
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 truncate">{selectedContent.title}</h1>
                <p className="text-sm text-gray-600">{selectedContent.expert}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Content Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${getTypeColor(selectedContent.type)}`}>
                  {getTypeIcon(selectedContent.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getDifficultyBadge(selectedContent.difficulty)}
                    <Badge className={getCategoryInfo(selectedContent.category).color + ' text-white'}>
                      {getCategoryInfo(selectedContent.category).name}
                    </Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedContent.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-sm font-medium">{selectedContent.duration}</div>
                  <div className="text-xs text-gray-600">所要時間</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">{selectedContent.rating}</div>
                  <div className="text-xs text-gray-600">評価</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">{selectedContent.views}</div>
                  <div className="text-xs text-gray-600">閲覧数</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedContent.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                開始する
              </Button>
            </CardContent>
          </Card>

          {/* Progress Section */}
          {selectedContent.isCompleted ? (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">完了済み</h4>
                    <p className="text-sm text-green-700">このコンテンツを学習済みです</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>学習の進め方</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">1</div>
                    <span className="text-sm">コンテンツを最後まで閲覧</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">2</div>
                    <span className="text-sm text-gray-600">理解度チェック（任意）</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">3</div>
                    <span className="text-sm text-gray-600">AIキャラクターとの振り返り</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Content */}
          <Card>
            <CardHeader>
              <CardTitle>関連コンテンツ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleContent
                  .filter(item => item.id !== selectedContent.id && item.category === selectedContent.category)
                  .slice(0, 3)
                  .map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedContent(item)}
                    >
                      <div className={`p-2 rounded ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.duration} • {item.expert}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                専門コンテンツ
              </h1>
              <p className="text-blue-100">専門家による実践的な学習コンテンツ</p>
            </div>
            <Badge className="bg-white/20 text-white">
              {filteredContent.length}件
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">47</div>
              <div className="text-sm text-blue-100">学習時間（今月）</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">12</div>
              <div className="text-sm text-blue-100">完了コンテンツ</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">8</div>
              <div className="text-sm text-blue-100">ブックマーク</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="featured">おすすめ</TabsTrigger>
            <TabsTrigger value="categories">カテゴリ</TabsTrigger>
            <TabsTrigger value="bookmarked">ブックマーク</TabsTrigger>
            <TabsTrigger value="completed">完了済み</TabsTrigger>
          </TabsList>

          {/* Featured Tab */}
          <TabsContent value="featured" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input 
                  placeholder="コンテンツを検索..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {filteredContent.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedContent(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(item.type)} flex-shrink-0`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900 leading-tight">{item.title}</h3>
                        {item.isBookmarked && <Bookmark className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                      
                      <div className="flex items-center space-x-2">
                        {getDifficultyBadge(item.difficulty)}
                        <Badge variant="outline" className="text-xs">
                          {getCategoryInfo(item.category).name}
                        </Badge>
                        {item.isCompleted && (
                          <Badge className="text-xs bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            完了
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.duration}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {item.rating}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {item.views}
                          </div>
                        </div>
                        <span>{item.expert}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-3">
              {categories.map((category) => {
                const categoryContent = sampleContent.filter(item => item.category === category.id)
                return (
                  <Card 
                    key={category.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setActiveTab('featured')
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${category.color} text-white`}>
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">
                            {categoryContent.length}個のコンテンツ • 
                            平均学習時間 {Math.round(categoryContent.reduce((acc, item) => acc + parseInt(item.duration), 0) / categoryContent.length)}分
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{categoryContent.length}</div>
                          <div className="text-xs text-gray-500">コンテンツ</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Bookmarked Tab */}
          <TabsContent value="bookmarked" className="space-y-4 mt-4">
            {sampleContent.filter(item => item.isBookmarked).map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedContent(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.expert} • {item.duration}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-4 mt-4">
            {sampleContent.filter(item => item.isCompleted).map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500"
                onClick={() => setSelectedContent(item)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.expert} • {item.duration}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        完了
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}