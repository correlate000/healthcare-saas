'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { AppLayout } from '@/src/components/layout/AppLayout'
import { Badge } from '@/src/components/ui/badge'
import { 
  BookOpen, 
  Search, 
  Filter,
  Clock,
  User,
  Star,
  Bookmark,
  TrendingUp,
  Heart,
  Brain,
  Moon,
  Coffee,
  Users,
  Target
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock articles data
const articles = [
  {
    id: 1,
    title: 'ストレス管理の基本：深呼吸テクニック',
    author: '田中 恵子博士',
    category: 'ストレス管理',
    readTime: '5分',
    difficulty: 'beginner',
    rating: 4.8,
    reads: 1234,
    excerpt: '日常的に実践できる効果的な深呼吸法を専門家が解説。即座にストレスを軽減する方法を学びましょう。',
    tags: ['呼吸法', 'リラクゼーション', '初心者向け'],
    publishDate: '2024-06-15',
    featured: true,
    bookmarked: false
  },
  {
    id: 2,
    title: 'リモートワークでの孤独感対策',
    author: '山田 太郎先生',
    category: '職場メンタルヘルス',
    readTime: '8分',
    difficulty: 'intermediate',
    rating: 4.6,
    reads: 892,
    excerpt: 'テレワーク環境での孤独感や不安を軽減するための実践的なアプローチを紹介します。',
    tags: ['リモートワーク', '孤独感', 'コミュニケーション'],
    publishDate: '2024-06-12',
    featured: false,
    bookmarked: true
  },
  {
    id: 3,
    title: '良質な睡眠のための夜間ルーティン',
    author: '佐藤 美智子先生',
    category: '睡眠改善',
    readTime: '6分',
    difficulty: 'beginner',
    rating: 4.9,
    reads: 2156,
    excerpt: '睡眠の質を向上させるための科学的に裏付けられた夜間の習慣とルーティンを解説。',
    tags: ['睡眠', 'ルーティン', 'リラクゼーション'],
    publishDate: '2024-06-10',
    featured: true,
    bookmarked: false
  },
  {
    id: 4,
    title: 'マインドフルネス瞑想入門',
    author: '鈴木 禅師',
    category: 'マインドフルネス',
    readTime: '10分',
    difficulty: 'beginner',
    rating: 4.7,
    reads: 1567,
    excerpt: '初心者でも始められるマインドフルネス瞑想の基本的な方法と効果について詳しく説明します。',
    tags: ['瞑想', 'マインドフルネス', '集中力'],
    publishDate: '2024-06-08',
    featured: false,
    bookmarked: false
  },
  {
    id: 5,
    title: 'チームワークを向上させるコミュニケーション術',
    author: '高橋 リーダー',
    category: 'チームビルディング',
    readTime: '12分',
    difficulty: 'intermediate',
    rating: 4.5,
    reads: 743,
    excerpt: '職場でのより良い人間関係を築き、チーム全体のメンタルヘルスを向上させる方法。',
    tags: ['チームワーク', 'コミュニケーション', 'リーダーシップ'],
    publishDate: '2024-06-05',
    featured: false,
    bookmarked: true
  }
]

const categories = [
  { id: 'all', label: 'すべて', icon: BookOpen, count: 45 },
  { id: 'stress', label: 'ストレス管理', icon: Brain, count: 12 },
  { id: 'sleep', label: '睡眠改善', icon: Moon, count: 8 },
  { id: 'mindfulness', label: 'マインドフルネス', icon: Heart, count: 10 },
  { id: 'workplace', label: '職場メンタルヘルス', icon: Coffee, count: 9 },
  { id: 'team', label: 'チームビルディング', icon: Users, count: 6 }
]

const sortOptions = [
  { id: 'featured', label: '注目記事' },
  { id: 'popular', label: '人気順' },
  { id: 'recent', label: '新着順' },
  { id: 'rating', label: '評価順' }
]

export default function ContentLibraryArticles() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初級'
      case 'intermediate': return '中級'
      case 'advanced': return '上級'
      default: return ''
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           article.category.includes(categories.find(c => c.id === selectedCategory)?.label || '')
    
    return matchesSearch && matchesCategory
  })

  return (
    <AppLayout title="記事・コラム" showBackButton>
      <div className="px-4 py-6 space-y-6">
        
        {/* Search Bar */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>フィルター</span>
            </Button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">カテゴリー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="justify-start"
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    <span className="text-xs">
                      {category.label} ({category.count})
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Articles */}
        {sortBy === 'featured' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span>注目記事</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredArticles.filter(article => article.featured).slice(0, 2).map((article) => (
                <div
                  key={article.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/content-library/articles/${article.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                      注目
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Toggle bookmark logic here
                      }}
                    >
                      <Bookmark className={`h-4 w-4 ${
                        article.bookmarked ? 'fill-current text-blue-500' : 'text-gray-400'
                      }`} />
                    </Button>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span>{article.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Articles List */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">
            {selectedCategory === 'all' ? 'すべての記事' : 
             categories.find(c => c.id === selectedCategory)?.label} 
            ({filteredArticles.length}件)
          </h3>
          
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/content-library/articles/${article.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(article.difficulty)}`}>
                      {getDifficultyLabel(article.difficulty)}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Toggle bookmark logic here
                    }}
                  >
                    <Bookmark className={`h-4 w-4 ${
                      article.bookmarked ? 'fill-current text-blue-500' : 'text-gray-400'
                    }`} />
                  </Button>
                </div>
                
                <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span>{article.rating}</span>
                    </span>
                    <span>{article.reads.toLocaleString()}回読まれました</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/content-library/videos')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Target className="h-5 w-5" />
            <span className="text-xs">動画</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/content-library/exercises')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">エクササイズ</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/content-library/favorites')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <Bookmark className="h-5 w-5" />
            <span className="text-xs">お気に入り</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}