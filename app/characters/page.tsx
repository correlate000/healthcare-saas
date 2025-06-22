'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Trophy, 
  Clock, 
  Users, 
  Brain,
  Sparkles,
  Moon,
  Sun,
  Zap,
  ChevronRight,
  Gift
} from 'lucide-react'

const characters = [
  {
    id: 'luna',
    name: 'Luna',
    displayName: 'ルナ',
    role: '包容力のあるメンター',
    avatar: '🌙',
    color: 'blue',
    bgGradient: 'from-blue-400 to-purple-500',
    specialty: ['人間関係', 'ストレス管理', '感情サポート'],
    personality: '優しく包容力があり、どんな悩みも受け止めてくれる姉のような存在。深い共感力で心の支えになります。',
    relationshipLevel: 85,
    conversationCount: 47,
    favoriteTopics: ['仕事の悩み', '人間関係', '将来への不安'],
    achievements: ['初回対話', '7日連続', '深い信頼関係'],
    recentMessage: '今日もお疲れさまでした。何か気になることがあれば、いつでも話しかけてくださいね。',
    lastActive: '2時間前',
    stats: {
      helpfulRating: 4.9,
      responseTime: '平均30秒',
      satisfaction: 96
    }
  },
  {
    id: 'aria',
    name: 'Aria', 
    displayName: 'アリア',
    role: 'ポジティブコーチ',
    avatar: '✨',
    color: 'yellow',
    bgGradient: 'from-yellow-400 to-orange-500',
    specialty: ['モチベーション', 'キャリア', '目標達成'],
    personality: '明るくエネルギッシュで、いつも前向きな視点を提供してくれます。やる気を引き出すのが得意。',
    relationshipLevel: 72,
    conversationCount: 34,
    favoriteTopics: ['キャリア相談', 'スキルアップ', 'チャレンジ'],
    achievements: ['モチベーターバッジ', '目標達成サポート', '成長パートナー'],
    recentMessage: '新しいチャレンジ、とても素晴らしいですね！一緒に頑張りましょう！',
    lastActive: '1時間前',
    stats: {
      helpfulRating: 4.7,
      responseTime: '平均25秒',
      satisfaction: 94
    }
  },
  {
    id: 'zen',
    name: 'Zen',
    displayName: 'ゼン',
    role: '知的アドバイザー',
    avatar: '🧘',
    color: 'green',
    bgGradient: 'from-green-400 to-teal-500',
    specialty: ['深い思考', '哲学的相談', 'ライフプランニング'],
    personality: '落ち着いて知的で、物事を深く考えるのが得意。人生の大きな問題について一緒に考えてくれます。',
    relationshipLevel: 91,
    conversationCount: 52,
    favoriteTopics: ['人生の意味', '価値観', '長期的視点'],
    achievements: ['深い対話マスター', '哲学的思考', '人生のメンター'],
    recentMessage: 'あなたの考え方の変化を見ていて、とても成長を感じます。',
    lastActive: '30分前',
    stats: {
      helpfulRating: 4.8,
      responseTime: '平均45秒',
      satisfaction: 98
    }
  }
]

export default function Characters() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0])

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'green': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">AIキャラクター</h1>
          <p className="text-sm text-gray-600">あなたの心の支えになる仲間たち</p>
        </div>
      </div>

      {/* Character Selection */}
      <div className="px-4 py-4">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedCharacter(char)}
              className={`flex-shrink-0 p-4 rounded-2xl border-2 transition-all ${
                selectedCharacter.id === char.id
                  ? `bg-gradient-to-br ${char.bgGradient} text-white border-transparent shadow-lg`
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{char.avatar}</div>
                <div className="font-medium text-sm">{char.displayName}</div>
                <div className="text-xs opacity-80">{char.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Character Details */}
      <div className="px-4">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">プロフィール</TabsTrigger>
            <TabsTrigger value="relationship">関係性</TabsTrigger>
            <TabsTrigger value="conversations">対話履歴</TabsTrigger>
            <TabsTrigger value="achievements">実績</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedCharacter.bgGradient} flex items-center justify-center text-2xl`}>
                    {selectedCharacter.avatar}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{selectedCharacter.displayName}</CardTitle>
                    <CardDescription>{selectedCharacter.role}</CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {selectedCharacter.lastActive}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {selectedCharacter.conversationCount}回の対話
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">性格・特徴</h4>
                  <p className="text-sm text-gray-600">{selectedCharacter.personality}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">得意分野</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.specialty.map((skill, index) => (
                      <Badge key={index} className={getColorClasses(selectedCharacter.color)}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">よく話すトピック</h4>
                  <div className="space-y-2">
                    {selectedCharacter.favoriteTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{topic}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    className={`w-full bg-gradient-to-r ${selectedCharacter.bgGradient} hover:opacity-90`}
                    onClick={() => window.location.href = `/chat?character=${selectedCharacter.id}`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {selectedCharacter.displayName}と話す
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relationship Tab */}
          <TabsContent value="relationship" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  信頼関係レベル
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {selectedCharacter.relationshipLevel}%
                  </div>
                  <Progress value={selectedCharacter.relationshipLevel} className="w-full mb-2" />
                  <p className="text-sm text-gray-600">
                    {selectedCharacter.relationshipLevel >= 90 ? '最高の信頼関係' :
                     selectedCharacter.relationshipLevel >= 70 ? '深い信頼関係' :
                     selectedCharacter.relationshipLevel >= 50 ? '良い関係' : '関係構築中'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Star className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">{selectedCharacter.stats.helpfulRating}</div>
                    <div className="text-xs text-gray-600">満足度</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Zap className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="text-sm font-bold text-green-600">{selectedCharacter.stats.responseTime}</div>
                    <div className="text-xs text-gray-600">返答時間</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-600">{selectedCharacter.stats.satisfaction}%</div>
                    <div className="text-xs text-gray-600">推奨度</div>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">最近のメッセージ</h4>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-700 italic">"{selectedCharacter.recentMessage}"</p>
                    <p className="text-xs text-gray-500 mt-2">- {selectedCharacter.displayName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations Tab */}
          <TabsContent value="conversations" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>対話履歴</CardTitle>
                <CardDescription>
                  これまでの対話 {selectedCharacter.conversationCount} 回
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '今日', topic: '仕事のストレスについて', mood: '😟', duration: '15分' },
                    { date: '昨日', topic: 'チームでの人間関係', mood: '😊', duration: '23分' },
                    { date: '3日前', topic: '今後のキャリアプラン', mood: '🤔', duration: '31分' },
                    { date: '1週間前', topic: '新しいプロジェクトの不安', mood: '😰', duration: '18分' },
                    { date: '2週間前', topic: 'ワークライフバランス', mood: '😌', duration: '27分' },
                  ].map((conv, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">{conv.mood}</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{conv.topic}</div>
                          <div className="text-xs text-gray-500">{conv.date} • {conv.duration}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  獲得した実績
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {selectedCharacter.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{achievement}</div>
                        <div className="text-sm text-gray-600">
                          {selectedCharacter.displayName}との特別な関係で獲得
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        獲得済み
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Gift className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-900">次の実績まで</h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    あと3回の対話で「毎日のパートナー」バッジを獲得できます
                  </p>
                  <Progress value={75} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}