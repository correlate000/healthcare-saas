'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Textarea } from '@/src/components/ui/textarea'
import { Input } from '@/src/components/ui/input'
import { 
  Users,
  MessageCircle,
  Heart,
  ThumbsUp,
  Shield,
  Lock,
  AlertTriangle,
  Eye,
  EyeOff,
  Send,
  Plus,
  Search,
  Filter,
  Clock,
  UserX,
  Flag,
  Star,
  TrendingUp,
  Award,
  Building,
  Briefcase,
  Coffee,
  Home,
  Brain,
  Target,
  Lightbulb,
  HelpCircle,
  CheckCircle,
  MessageSquare,
  ArrowUp,
  MoreHorizontal
} from 'lucide-react'

interface Post {
  id: string
  author: {
    id: string
    nickname: string
    department: 'unknown' | 'tech' | 'sales' | 'hr' | 'marketing' | 'finance'
    yearRange: '1-3年' | '4-7年' | '8-15年' | '15年以上'
    role: 'member' | 'leader' | 'manager'
    badge?: string
  }
  content: string
  category: 'relationship' | 'stress' | 'career' | 'worklife' | 'evaluation' | 'harassment' | 'newbie'
  tags: string[]
  timestamp: string
  likes: number
  hearts: number
  replies: number
  isLiked: boolean
  isHearted: boolean
  isAnonymous: boolean
  supportLevel: 'low' | 'medium' | 'high'
  replies_preview?: Reply[]
}

interface Reply {
  id: string
  author: {
    nickname: string
    badge?: string
  }
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
}

const categories = [
  { id: 'relationship', name: '人間関係', icon: <Users className="w-4 h-4" />, color: 'bg-blue-500' },
  { id: 'stress', name: 'ストレス', icon: <Brain className="w-4 h-4" />, color: 'bg-red-500' },
  { id: 'career', name: 'キャリア', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-green-500' },
  { id: 'worklife', name: 'ワークライフ', icon: <Coffee className="w-4 h-4" />, color: 'bg-orange-500' },
  { id: 'evaluation', name: '評価・昇進', icon: <Award className="w-4 h-4" />, color: 'bg-purple-500' },
  { id: 'harassment', name: 'ハラスメント', icon: <Shield className="w-4 h-4" />, color: 'bg-pink-500' },
  { id: 'newbie', name: '新人・適応', icon: <Star className="w-4 h-4" />, color: 'bg-teal-500' },
]

const samplePosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      nickname: '頑張る中堅',
      department: 'tech',
      yearRange: '4-7年',
      role: 'leader',
      badge: '相談上手'
    },
    content: '最近、後輩の指導で悩んでいます。技術力はあるのですが、コミュニケーションが苦手で、チームの雰囲気が微妙になることがあります。どう指導したら良いでしょうか？同じような経験をされた方はいませんか？',
    category: 'relationship',
    tags: ['チームリーダー', '後輩指導', 'コミュニケーション'],
    timestamp: '2時間前',
    likes: 12,
    hearts: 8,
    replies: 5,
    isLiked: false,
    isHearted: false,
    isAnonymous: false,
    supportLevel: 'medium',
    replies_preview: [
      {
        id: 'r1',
        author: { nickname: '経験豊富', badge: 'メンター' },
        content: '私も同じ経験があります。まずは1on1で本人の考えを聞いて、一緒に改善策を考えるのが良いかもしれません。',
        timestamp: '1時間前',
        likes: 6,
        isLiked: false
      }
    ]
  },
  {
    id: '2',
    author: {
      id: 'user2',
      nickname: '匿名希望',
      department: 'unknown',
      yearRange: '1-3年',
      role: 'member'
    },
    content: '入社して1年経ちますが、まだ周りについていけている気がしません。同期は皆優秀に見えて、自分だけ取り残されているような気持ちになります。このまま続けていけるか不安です...',
    category: 'newbie',
    tags: ['新人', '不安', '同期'],
    timestamp: '4時間前',
    likes: 18,
    hearts: 24,
    replies: 12,
    isLiked: true,
    isHearted: true,
    isAnonymous: true,
    supportLevel: 'high',
    replies_preview: [
      {
        id: 'r2',
        author: { nickname: '先輩', badge: 'サポーター' },
        content: '大丈夫です！1年目は誰でもそう感じるものです。私も同じでした。焦らず自分のペースで成長していけば必ず追いつけます。',
        timestamp: '3時間前',
        likes: 15,
        isLiked: true
      }
    ]
  },
  {
    id: '3',
    author: {
      id: 'user3',
      nickname: '板挟み管理職',
      department: 'unknown',
      yearRange: '8-15年',
      role: 'manager',
      badge: '問題解決者'
    },
    content: '管理職になって2年目ですが、上からの圧力と部下への配慮の板挟みで精神的にきついです。特に最近の業績目標が厳しく、部下に無理を強いることになってしまい罪悪感があります。',
    category: 'stress',
    tags: ['管理職', '板挟み', '業績プレッシャー'],
    timestamp: '6時間前',
    likes: 23,
    hearts: 19,
    replies: 8,
    isLiked: false,
    isHearted: false,
    isAnonymous: false,
    supportLevel: 'high'
  }
]

export default function TeamConnect() {
  const [activeTab, setActiveTab] = useState('feed')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostCategory, setNewPostCategory] = useState<string>('relationship')
  const [isAnonymous, setIsAnonymous] = useState(true)

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0]
  }

  const getDepartmentBadge = (dept: string) => {
    switch (dept) {
      case 'tech': return { name: '技術', color: 'bg-blue-100 text-blue-700' }
      case 'sales': return { name: '営業', color: 'bg-green-100 text-green-700' }
      case 'hr': return { name: '人事', color: 'bg-purple-100 text-purple-700' }
      case 'marketing': return { name: 'マーケ', color: 'bg-orange-100 text-orange-700' }
      case 'finance': return { name: '財務', color: 'bg-gray-100 text-gray-700' }
      default: return { name: '匿名', color: 'bg-gray-100 text-gray-500' }
    }
  }

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  const filteredPosts = selectedCategory 
    ? samplePosts.filter(post => post.category === selectedCategory)
    : samplePosts

  if (isCreatingPost) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => setIsCreatingPost(false)}>
                ← 戻る
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">新しい投稿</h1>
                <p className="text-sm text-gray-600">チームの仲間と安全に共有</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsAnonymous(!isAnonymous)}>
              {isAnonymous ? <UserX className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-6">
          {/* Privacy Notice */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 mb-1">安全なコミュニティ</h4>
                  <p className="text-sm text-green-700">
                    この投稿は同じ会社の社員のみが閲覧できます。すべての投稿は暗号化され、
                    不適切な内容は自動的にモデレーションされます。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anonymity Setting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                匿名設定
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {isAnonymous ? <UserX className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-blue-600" />}
                  <div>
                    <div className="font-medium text-sm">
                      {isAnonymous ? '匿名で投稿' : '名前を表示'}
                    </div>
                    <div className="text-xs text-gray-600">
                      {isAnonymous ? 'ニックネームのみ表示されます' : 'プロフィール情報が表示されます'}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                >
                  変更
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">カテゴリ選択</CardTitle>
              <CardDescription>相談内容に最も近いカテゴリを選んでください</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setNewPostCategory(category.id)}
                    className={`p-3 rounded-lg border-2 flex items-center space-x-2 ${
                      newPostCategory === category.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-1 rounded ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">内容</CardTitle>
              <CardDescription>
                あなたの悩みや体験を自由に書いてください。同じような経験をした仲間がサポートしてくれます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="例：最近、上司との関係で悩んでいます。仕事に対する考え方が合わず、どう接したら良いかわかりません。同じような経験をされた方がいれば、アドバイスをいただけると嬉しいです..."
                rows={6}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {newPostContent.length}/1000文字
                </span>
                <Badge variant="secondary" className="text-xs">
                  {getCategoryInfo(newPostCategory).name}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Post Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">投稿ガイドライン</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 他のメンバーを尊重し、建設的な内容を心がけましょう</li>
                <li>• 個人を特定できる情報は含めないでください</li>
                <li>• 誹謗中傷や攻撃的な内容は禁止されています</li>
                <li>• 深刻な問題の場合は専門のカウンセラーにご相談ください</li>
              </ul>
            </CardContent>
          </Card>

          {/* Post Button */}
          <div className="sticky bottom-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              size="lg"
              disabled={newPostContent.length < 10}
              onClick={() => setIsCreatingPost(false)}
            >
              <Send className="w-5 h-5 mr-2" />
              投稿する
            </Button>
          </div>
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
                <Users className="w-6 h-6 mr-2" />
                チームつながり
              </h1>
              <p className="text-blue-100">同じ会社の仲間と匿名で支え合う安全な場所</p>
            </div>
            <Button 
              onClick={() => setIsCreatingPost(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              投稿
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">847</div>
              <div className="text-sm text-blue-100">アクティブメンバー</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">2.1k</div>
              <div className="text-sm text-blue-100">今月の投稿</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">95%</div>
              <div className="text-sm text-blue-100">解決率</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">フィード</TabsTrigger>
            <TabsTrigger value="categories">カテゴリ</TabsTrigger>
            <TabsTrigger value="trending">人気</TabsTrigger>
            <TabsTrigger value="my-posts">自分の投稿</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input placeholder="投稿を検索..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {filteredPosts.map((post) => {
              const categoryInfo = getCategoryInfo(post.category)
              const deptInfo = getDepartmentBadge(post.author.department)
              
              return (
                <Card key={post.id} className={`border-l-4 ${getSupportLevelColor(post.supportLevel)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {post.isAnonymous ? '匿名' : post.author.nickname}
                          </span>
                          <Badge variant="secondary" className={`text-xs ${deptInfo.color}`}>
                            {deptInfo.name}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {post.author.yearRange}
                          </Badge>
                        </div>
                        {post.author.badge && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-800">
                            {post.author.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${categoryInfo.color} text-white text-xs`}>
                          {categoryInfo.icon}
                          <span className="ml-1">{categoryInfo.name}</span>
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-4">
                        <button 
                          className={`flex items-center space-x-1 text-sm ${
                            post.isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        
                        <button 
                          className={`flex items-center space-x-1 text-sm ${
                            post.isHearted ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isHearted ? 'fill-current' : ''}`} />
                          <span>{post.hearts}</span>
                        </button>
                        
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.replies}</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.timestamp}</span>
                      </div>
                    </div>

                    {/* Reply Preview */}
                    {post.replies_preview && post.replies_preview.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium">{post.replies_preview[0].author.nickname}</span>
                              {post.replies_preview[0].author.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {post.replies_preview[0].author.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{post.replies_preview[0].content}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <button className="flex items-center space-x-1 text-xs text-gray-500">
                                <ThumbsUp className="w-3 h-3" />
                                <span>{post.replies_preview[0].likes}</span>
                              </button>
                              <span className="text-xs text-gray-400">{post.replies_preview[0].timestamp}</span>
                            </div>
                          </div>
                        </div>
                        {post.replies > 1 && (
                          <button className="text-xs text-blue-600 mt-2 flex items-center">
                            他の{post.replies - 1}件のコメントを見る
                            <ArrowUp className="w-3 h-3 ml-1 rotate-90" />
                          </button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-3">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setActiveTab('feed')
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
                          {category.id === 'relationship' && '職場での人間関係やコミュニケーションの悩み'}
                          {category.id === 'stress' && '仕事のプレッシャーやストレスに関する相談'}
                          {category.id === 'career' && 'キャリアプランや転職についての話し合い'}
                          {category.id === 'worklife' && 'ワークライフバランスや時間管理'}
                          {category.id === 'evaluation' && '評価制度や昇進に関する悩み'}
                          {category.id === 'harassment' && 'ハラスメントや不当な扱いについて'}
                          {category.id === 'newbie' && '新入社員や異動時の適応に関する相談'}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {category.id === 'relationship' ? '156' :
                           category.id === 'stress' ? '98' :
                           category.id === 'career' ? '87' :
                           category.id === 'worklife' ? '134' :
                           category.id === 'evaluation' ? '45' :
                           category.id === 'harassment' ? '23' : '67'}
                        </div>
                        <div className="text-xs text-gray-500">今月の投稿</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                  今週の人気トピック
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: 'リモートワークでのコミュニケーション', posts: 45, engagement: '94%' },
                    { title: '新人研修での適応について', posts: 38, engagement: '91%' },
                    { title: '評価面談での自己アピール方法', posts: 32, engagement: '88%' },
                    { title: '上司との価値観の違い', posts: 29, engagement: '87%' },
                  ].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{topic.title}</h4>
                        <p className="text-sm text-gray-600">{topic.posts}件の投稿 • エンゲージメント率 {topic.engagement}</p>
                      </div>
                      <Badge className="bg-orange-500 text-white">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Posts Tab */}
          <TabsContent value="my-posts" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>あなたの活動</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-blue-600">投稿数</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <div className="text-sm text-green-600">コメント数</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample My Posts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-500 text-white">人間関係</Badge>
                  <span className="text-sm text-gray-500">3日前</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">チームでの立ち位置に悩んでいます...</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>👍 12</span>
                  <span>💝 8</span>
                  <span>💬 5</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}