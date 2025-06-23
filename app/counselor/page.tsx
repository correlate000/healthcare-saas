'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  Users, 
  MessageCircle, 
  FileText, 
  TrendingUp,
  AlertCircle,
  Video,
  Phone,
  Star,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock counselor data
const counselorData = {
  profile: {
    name: '田中 美佳',
    title: '臨床心理士',
    license: '第12345号',
    experience: '8年',
    rating: 4.9,
    totalSessions: 1247,
    thisMonth: 89
  },
  todaySchedule: [
    { 
      id: 1, 
      time: '09:00', 
      duration: 50, 
      client: 'A-001', 
      type: 'video', 
      status: 'scheduled',
      topic: '職場でのストレス管理'
    },
    { 
      id: 2, 
      time: '10:30', 
      duration: 50, 
      client: 'B-002', 
      type: 'phone', 
      status: 'completed',
      topic: '人間関係の悩み'
    },
    { 
      id: 3, 
      time: '13:00', 
      duration: 50, 
      client: 'C-003', 
      type: 'video', 
      status: 'in_progress',
      topic: '不安障害について'
    },
    { 
      id: 4, 
      time: '14:30', 
      duration: 50, 
      client: 'D-004', 
      type: 'video', 
      status: 'scheduled',
      topic: '初回相談'
    },
  ],
  priorityClients: [
    {
      id: 'A-001',
      riskLevel: 'high',
      lastSession: '3日前',
      trend: 'declining',
      notes: '連続で気分の低下が報告されています'
    },
    {
      id: 'E-005',
      riskLevel: 'medium',
      lastSession: '1週間前',
      trend: 'stable',
      notes: 'ストレス値の変動が大きい状況'
    },
    {
      id: 'F-006',
      riskLevel: 'medium',
      lastSession: '5日前',
      trend: 'improving',
      notes: '徐々に改善傾向が見られます'
    },
  ],
  insights: {
    weeklyStats: {
      totalSessions: 32,
      avgRating: 4.8,
      cancelRate: 5.2,
      followUpNeeded: 7
    },
    commonTopics: [
      { topic: '職場ストレス', count: 12, percentage: 38 },
      { topic: '人間関係', count: 8, percentage: 25 },
      { topic: '不安・うつ', count: 7, percentage: 22 },
      { topic: 'ライフバランス', count: 5, percentage: 15 },
    ]
  }
}

export default function CounselorDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('schedule')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈'
      case 'declining': return '📉'
      default: return '➖'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                  田
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{counselorData.profile.name}</h1>
                <p className="text-gray-600">{counselorData.profile.title} • {counselorData.profile.license}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">今月のセッション</div>
                <div className="font-semibold">{counselorData.profile.thisMonth}回</div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-medium">{counselorData.profile.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'schedule', label: 'スケジュール', icon: Calendar },
            { id: 'clients', label: '要注意クライアント', icon: AlertCircle },
            { id: 'insights', label: '分析・洞察', icon: TrendingUp },
            { id: 'resources', label: 'リソース', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span>今日のスケジュール</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      フィルター
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {counselorData.todaySchedule.map((session) => (
                      <div key={session.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="text-center">
                          <div className="font-semibold">{session.time}</div>
                          <div className="text-sm text-gray-500">{session.duration}分</div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">クライアント {session.client}</div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status === 'completed' && '完了'}
                              {session.status === 'in_progress' && '進行中'}
                              {session.status === 'scheduled' && '予定'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">{session.topic}</div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {session.type === 'video' ? (
                            <Video className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Phone className="h-5 w-5 text-green-500" />
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">次のセッション</span>
                    </div>
                    <div className="text-sm text-blue-800">14:30 - クライアント D-004 (初回相談)</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">今週の統計</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">総セッション数</span>
                    <span className="font-semibold">{counselorData.insights.weeklyStats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">平均評価</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{counselorData.insights.weeklyStats.avgRating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">キャンセル率</span>
                    <span className="font-semibold">{counselorData.insights.weeklyStats.cancelRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">フォローアップ必要</span>
                    <span className="font-semibold text-orange-600">{counselorData.insights.weeklyStats.followUpNeeded}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">今日の概要</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-600">4</div>
                    <div className="text-sm text-gray-600">予定セッション</div>
                    <div className="text-xs text-gray-500">1完了 • 1進行中 • 2予定</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Priority Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span>要注意クライアント</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      検索
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      フィルター
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  継続的な注意が必要なクライアントの一覧
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {counselorData.priorityClients.map((client) => (
                    <div key={client.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gray-200">
                              {client.id.split('-')[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">クライアント {client.id}</div>
                            <div className="text-sm text-gray-500">最終セッション: {client.lastSession}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getTrendIcon(client.trend)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(client.riskLevel)}`}>
                            {client.riskLevel === 'high' && '高リスク'}
                            {client.riskLevel === 'medium' && '中リスク'}
                            {client.riskLevel === 'low' && '低リスク'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-3">
                        {client.notes}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          メッセージ
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          予約
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          記録
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>相談内容の傾向</span>
                </CardTitle>
                <CardDescription>今月の主要な相談トピック</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {counselorData.insights.commonTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{topic.topic}</span>
                          <span className="text-sm text-gray-600">{topic.count}件</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${topic.percentage}%`}}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>今月のパフォーマンス</CardTitle>
                <CardDescription>セッション品質と効果測定</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-gray-600">クライアント満足度</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">改善報告率</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">継続率</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">推奨率</span>
                      <span className="font-semibold">94%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-lg">治療ガイドライン</CardTitle>
                <CardDescription>症状別の標準的な治療方針</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-lg">同僚との相談</CardTitle>
                <CardDescription>他のカウンセラーとの事例共有</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                <CardTitle className="text-lg">研修・学習</CardTitle>
                <CardDescription>最新の治療法と研究情報</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}