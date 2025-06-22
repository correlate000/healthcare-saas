'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertTriangle,
  Phone,
  MessageCircle,
  Heart,
  Shield,
  Clock,
  User,
  MapPin,
  ExternalLink,
  Headphones,
  Mail,
  Calendar,
  Info,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Building,
  Users,
  BookOpen,
  Target,
  Lightbulb,
  Brain,
  Home
} from 'lucide-react'

interface SupportResource {
  id: string
  title: string
  description: string
  type: 'hotline' | 'chat' | 'appointment' | 'emergency' | 'self-help'
  availability: string
  contact: string
  isInternal: boolean
  urgency: 'immediate' | 'urgent' | 'normal'
  category: 'crisis' | 'counseling' | 'medical' | 'legal' | 'financial'
}

interface EmergencyContact {
  name: string
  role: string
  phone: string
  email?: string
  availability: string
  specialties: string[]
}

const emergencyContacts: EmergencyContact[] = [
  {
    name: '産業カウンセラー 田中',
    role: '社内カウンセラー',
    phone: '03-1234-5678',
    email: 'tanaka.counselor@company.com',
    availability: '平日 9:00-18:00',
    specialties: ['ストレス管理', 'ワークライフバランス', '人間関係']
  },
  {
    name: '人事部 緊急対応',
    role: '人事部',
    phone: '03-1234-5679',
    email: 'hr.emergency@company.com',
    availability: '24時間対応',
    specialties: ['ハラスメント', '労働問題', '緊急事態']
  },
  {
    name: '産業医 佐藤',
    role: '産業医',
    phone: '03-1234-5680',
    email: 'sato.doctor@company.com',
    availability: '平日 10:00-16:00',
    specialties: ['メンタルヘルス', '健康相談', '休職相談']
  }
]

const supportResources: SupportResource[] = [
  {
    id: '1',
    title: '警察・救急（緊急時）',
    description: '生命に関わる緊急事態、犯罪被害の場合',
    type: 'emergency',
    availability: '24時間',
    contact: '110/119',
    isInternal: false,
    urgency: 'immediate',
    category: 'crisis'
  },
  {
    id: '2',
    title: 'いのちの電話',
    description: '自殺の危機にある方への24時間対応',
    type: 'hotline',
    availability: '24時間',
    contact: '0570-783-556',
    isInternal: false,
    urgency: 'immediate',
    category: 'crisis'
  },
  {
    id: '3',
    title: '社内カウンセリング',
    description: '会社の産業カウンセラーによる相談',
    type: 'appointment',
    availability: '平日 9:00-18:00',
    contact: '内線1234',
    isInternal: true,
    urgency: 'normal',
    category: 'counseling'
  },
  {
    id: '4',
    title: 'こころの健康相談統一ダイヤル',
    description: '精神保健福祉センターによる相談',
    type: 'hotline',
    availability: '平日 9:00-17:00',
    contact: '0570-064-556',
    isInternal: false,
    urgency: 'urgent',
    category: 'medical'
  },
  {
    id: '5',
    title: 'ハラスメント相談窓口',
    description: '社内のハラスメント専門相談',
    type: 'chat',
    availability: '24時間',
    contact: 'harassment@company.com',
    isInternal: true,
    urgency: 'urgent',
    category: 'legal'
  },
  {
    id: '6',
    title: '経済的困窮相談',
    description: '生活困窮者自立支援制度の相談',
    type: 'appointment',
    availability: '平日 8:30-17:00',
    contact: '市役所福祉課',
    isInternal: false,
    urgency: 'normal',
    category: 'financial'
  }
]

const selfHelpResources = [
  {
    title: '深呼吸エクササイズ',
    description: '4-7-8呼吸法で不安を和らげる',
    duration: '3分',
    icon: <Heart className="w-5 h-5 text-red-500" />
  },
  {
    title: 'グラウンディング法',
    description: '5-4-3-2-1法でパニックを沈める',
    duration: '5分',
    icon: <Target className="w-5 h-5 text-blue-500" />
  },
  {
    title: '緊急時の思考整理',
    description: '状況を客観視するためのガイド',
    duration: '10分',
    icon: <Brain className="w-5 h-5 text-purple-500" />
  },
  {
    title: '安心リソース確認',
    description: 'サポートネットワークの再確認',
    duration: '5分',
    icon: <Shield className="w-5 h-5 text-green-500" />
  }
]

export default function EmergencySupport() {
  const [activeTab, setActiveTab] = useState('immediate')
  const [selectedResource, setSelectedResource] = useState<SupportResource | null>(null)

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'border-l-red-500 bg-red-50'
      case 'urgent': return 'border-l-orange-500 bg-orange-50'
      case 'normal': return 'border-l-blue-500 bg-blue-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return <Badge className="bg-red-500 text-white">緊急</Badge>
      case 'urgent': return <Badge className="bg-orange-500 text-white">至急</Badge>
      case 'normal': return <Badge className="bg-blue-500 text-white">通常</Badge>
      default: return null
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crisis': return <AlertTriangle className="w-4 h-4" />
      case 'counseling': return <MessageCircle className="w-4 h-4" />
      case 'medical': return <Heart className="w-4 h-4" />
      case 'legal': return <Shield className="w-4 h-4" />
      case 'financial': return <Building className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                緊急時サポート
              </h1>
              <p className="text-red-100">困った時は一人で抱え込まず、すぐにサポートを求めましょう</p>
            </div>
            <Badge className="bg-white/20 text-white border border-white/30">
              24時間対応
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <Phone className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm">緊急ダイヤル</div>
              <div className="font-bold">110/119</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <MessageCircle className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm">社内相談</div>
              <div className="font-bold">内線1234</div>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Alert */}
      <div className="px-4 py-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-red-900 mb-2">緊急事態の場合</h4>
                <p className="text-sm text-red-800 mb-3">
                  自分や他人の生命に危険がある場合は、迷わず110番（警察）または119番（救急・消防）に連絡してください。
                </p>
                <div className="flex space-x-2">
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                    onClick={() => window.open('tel:110')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    110番通報
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                    onClick={() => window.open('tel:119')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    119番通報
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="immediate">今すぐ</TabsTrigger>
            <TabsTrigger value="contacts">連絡先</TabsTrigger>
            <TabsTrigger value="self-help">セルフケア</TabsTrigger>
            <TabsTrigger value="resources">リソース</TabsTrigger>
          </TabsList>

          {/* Immediate Help Tab */}
          <TabsContent value="immediate" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">今すぐ必要なサポート</CardTitle>
                <CardDescription>
                  状況に応じて最適なサポートを選択してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportResources
                  .filter(resource => resource.urgency === 'immediate')
                  .map((resource) => (
                    <Card key={resource.id} className={`border-l-4 ${getUrgencyColor(resource.urgency)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(resource.category)}
                            <h4 className="font-medium text-gray-900">{resource.title}</h4>
                            {getUrgencyBadge(resource.urgency)}
                          </div>
                          {resource.isInternal && (
                            <Badge variant="outline" className="text-xs">社内</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {resource.availability}
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => window.open(`tel:${resource.contact}`)}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            連絡する
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>今すぐできること</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-1 border-blue-200 hover:bg-blue-50"
                    onClick={() => setActiveTab('self-help')}
                  >
                    <Heart className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-600">深呼吸</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-1 border-green-200 hover:bg-green-50"
                    onClick={() => window.open('/chat?emergency=true')}
                  >
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600">AI相談</span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-1 border-purple-200 hover:bg-purple-50"
                  >
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-purple-600">近くの病院</span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-1 border-orange-200 hover:bg-orange-50"
                    onClick={() => setActiveTab('contacts')}
                  >
                    <Users className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-600">信頼できる人</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>社内緊急連絡先</CardTitle>
                <CardDescription>会社の専門スタッフに相談できます</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.role}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">社内</Badge>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                        {contact.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{contact.email}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{contact.availability}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {contact.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => window.open(`tel:${contact.phone}`)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          電話
                        </Button>
                        {contact.email && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`mailto:${contact.email}`)}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            メール
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>外部専門機関</CardTitle>
                <CardDescription>24時間対応の専門相談窓口</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportResources
                  .filter(resource => !resource.isInternal)
                  .map((resource) => (
                    <Card key={resource.id} className={`border-l-4 ${getUrgencyColor(resource.urgency)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{resource.title}</h4>
                          {getUrgencyBadge(resource.urgency)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {resource.availability}
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => window.open(`tel:${resource.contact}`)}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            {resource.contact}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Self-Help Tab */}
          <TabsContent value="self-help" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>今すぐできるセルフケア</CardTitle>
                <CardDescription>
                  一人でも実践できる緊急時の対処法
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selfHelpResources.map((resource, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {resource.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{resource.title}</h4>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                        <div className="text-center">
                          <Badge variant="outline" className="text-xs">
                            {resource.duration}
                          </Badge>
                        </div>
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
                    <h4 className="font-medium text-blue-900 mb-1">覚えておくこと</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 深刻な状況では一人で対処しようとせず、すぐに専門家に相談</li>
                      <li>• 感情が高ぶっている時は、まず安全な場所に移動</li>
                      <li>• 信頼できる人に連絡を取り、状況を共有</li>
                      <li>• 必要に応じて医療機関を受診</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>全サポートリソース</CardTitle>
                <CardDescription>
                  緊急度別に整理されたサポート一覧
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportResources.map((resource) => (
                  <Card key={resource.id} className={`border-l-4 ${getUrgencyColor(resource.urgency)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(resource.category)}
                          <h4 className="font-medium text-gray-900">{resource.title}</h4>
                          {getUrgencyBadge(resource.urgency)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {resource.isInternal && (
                            <Badge variant="outline" className="text-xs">社内</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {resource.availability}
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          variant={resource.urgency === 'immediate' ? 'default' : 'outline'}
                          onClick={() => window.open(`tel:${resource.contact}`)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          連絡する
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}