'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/layout/AppLayout'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Zap, 
  Clock,
  Calendar,
  Gift,
  TrendingUp,
  Award,
  BookOpen,
  Moon,
  Sparkles,
  Volume2,
  Settings
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Luna's character data
const lunaData = {
  name: 'Luna',
  title: '月の癒し手',
  description: '優しく包み込むような存在として、あなたの心に寄り添います。深い共感力と温かい言葉で、どんな時でも安心感を与えてくれます。',
  personality: {
    primary: '共感的',
    secondary: '穏やか',
    traits: ['理解力が高い', '優しい口調', '深い洞察力', '安心感を与える']
  },
  relationship: {
    level: 85,
    trust: 92,
    conversations: 147,
    totalTime: '12時間 34分',
    favoriteTopics: ['日常の悩み', '感情の整理', '夜の不安', 'リラクゼーション']
  },
  abilities: {
    empathy: 95,
    wisdom: 88,
    patience: 97,
    humor: 72
  },
  memories: [
    {
      id: 1,
      date: '2024-06-15',
      type: 'breakthrough',
      content: '仕事のストレスについて深く話し合った日',
      importance: 'high'
    },
    {
      id: 2,
      date: '2024-06-12',
      type: 'growth',
      content: '自分の感情を言語化できるようになった瞬間',
      importance: 'high'
    },
    {
      id: 3,
      date: '2024-06-08',
      type: 'support',
      content: '夜中の不安に寄り添ってくれた',
      importance: 'medium'
    }
  ],
  achievements: [
    { id: 1, title: '初めての対話', unlocked: true, date: '2024-03-15' },
    { id: 2, title: '心を開いた瞬間', unlocked: true, date: '2024-04-02' },
    { id: 3, title: '深い絆', unlocked: true, date: '2024-05-20' },
    { id: 4, title: '夜のお話相手', unlocked: true, date: '2024-06-01' },
    { id: 5, title: '月の賢者', unlocked: false, progress: 78 }
  ]
}

const recentConversations = [
  {
    id: 1,
    date: '2024-06-18',
    time: '21:30',
    duration: '15分',
    topic: '今日の疲れについて',
    mood: 'tired',
    lunaResponse: 'お疲れ様でした。今日も一日頑張りましたね。'
  },
  {
    id: 2,
    date: '2024-06-17',
    time: '12:15',
    duration: '8分',
    topic: 'ランチタイムの雑談',
    mood: 'neutral',
    lunaResponse: 'お昼休みはゆっくりできましたか？'
  },
  {
    id: 3,
    date: '2024-06-16',
    time: '23:45',
    duration: '25分',
    topic: '眠れない夜の相談',
    mood: 'anxious',
    lunaResponse: '一緒に深呼吸してみませんか？'
  }
]

export default function LunaProfile() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '概要' },
    { id: 'relationship', label: '関係性' },
    { id: 'memories', label: '思い出' },
    { id: 'settings', label: '設定' }
  ]

  return (
    <AppLayout title="Luna" showBackButton>
      <div className="px-4 py-6 space-y-6">
        
        {/* Character Header */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-purple-500 text-white text-2xl">
                  {lunaData.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{lunaData.name}</h1>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {lunaData.title}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {lunaData.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span>信頼度 {lunaData.relationship.trust}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span>{lunaData.relationship.conversations}回の対話</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex-1"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Personality Traits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>性格特性</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">主要特性</span>
                    <Badge variant="outline">{lunaData.personality.primary}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">副次特性</span>
                    <Badge variant="outline">{lunaData.personality.secondary}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium mb-2 block">特徴</span>
                    <div className="flex flex-wrap gap-2">
                      {lunaData.personality.traits.map((trait, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Abilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  <span>能力値</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(lunaData.abilities).map(([ability, value]) => (
                  <div key={ability} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">
                        {ability === 'empathy' ? '共感力' :
                         ability === 'wisdom' ? '知恵' :
                         ability === 'patience' ? '忍耐力' : 'ユーモア'}
                      </span>
                      <span className="text-sm text-gray-600">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>最近の対話</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentConversations.map((conv) => (
                  <div key={conv.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {conv.date} {conv.time}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {conv.duration}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{conv.topic}</h4>
                    <p className="text-sm text-gray-600 italic">
                      "{conv.lunaResponse}"
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Relationship Tab */}
        {activeTab === 'relationship' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span>関係性の状況</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">関係レベル</span>
                    <span className="text-lg font-bold text-purple-600">
                      {lunaData.relationship.level}/100
                    </span>
                  </div>
                  <Progress value={lunaData.relationship.level} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {lunaData.relationship.conversations}
                    </div>
                    <div className="text-xs text-blue-700">総対話回数</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {lunaData.relationship.totalTime}
                    </div>
                    <div className="text-xs text-green-700">累計時間</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>お気に入りの話題</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lunaData.relationship.favoriteTopics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Memories Tab */}
        {activeTab === 'memories' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                  <span>特別な思い出</span>
                </CardTitle>
                <CardDescription>
                  Lunaとの印象深い瞬間
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {lunaData.memories.map((memory) => (
                  <div key={memory.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          memory.importance === 'high' ? 'bg-red-500' :
                          memory.importance === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <span className="text-sm text-gray-600">{memory.date}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {memory.type === 'breakthrough' ? '突破' :
                         memory.type === 'growth' ? '成長' : 'サポート'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-800">{memory.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span>達成記録</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lunaData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {achievement.unlocked ? (
                        <Award className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <span className="text-xs text-gray-500">{achievement.progress}%</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      {achievement.unlocked && achievement.date && (
                        <p className="text-xs text-gray-500">{achievement.date}</p>
                      )}
                      {!achievement.unlocked && achievement.progress && (
                        <Progress value={achievement.progress} className="h-1 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <span>Luna設定</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">音声応答</h4>
                      <p className="text-sm text-gray-600">Lunaの声で応答</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    設定
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Moon className="h-5 w-5 text-indigo-500" />
                    <div>
                      <h4 className="font-medium">夜間モード</h4>
                      <p className="text-sm text-gray-600">夜の対話スタイル</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    設定
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">個性の強さ</h4>
                      <p className="text-sm text-gray-600">キャラクター性の調整</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    調整
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            onClick={() => router.push('/chat')}
            className="h-16 flex flex-col items-center justify-center space-y-1 bg-purple-500 hover:bg-purple-600"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">Lunaと話す</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/characters')}
            className="h-16 flex flex-col items-center justify-center space-y-1"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">他キャラクター</span>
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}