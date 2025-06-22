'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Shield,
  Lock,
  Eye,
  EyeOff,
  Users,
  Building,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Globe,
  Database,
  FileText,
  Settings,
  User,
  Clock,
  Key,
  Smartphone,
  Mail,
  Bell,
  Share,
  Archive,
  HelpCircle,
  ExternalLink,
  Zap
} from 'lucide-react'

interface PrivacySetting {
  id: string
  title: string
  description: string
  category: 'data' | 'sharing' | 'visibility' | 'communication' | 'security'
  isEnabled: boolean
  isRequired?: boolean
  level: 'basic' | 'standard' | 'advanced'
  impact: 'low' | 'medium' | 'high'
}

const privacySettings: PrivacySetting[] = [
  {
    id: 'data_encryption',
    title: 'データ暗号化',
    description: 'すべての個人データを暗号化して保存します',
    category: 'security',
    isEnabled: true,
    isRequired: true,
    level: 'basic',
    impact: 'high'
  },
  {
    id: 'emotion_analytics',
    title: '感情分析の改善に協力',
    description: '匿名化されたデータでAIの精度向上に貢献します',
    category: 'data',
    isEnabled: true,
    level: 'standard',
    impact: 'medium'
  },
  {
    id: 'team_visibility',
    title: 'チーム内での活動状況表示',
    description: '同じ部署のメンバーにアクティブ状況を表示します',
    category: 'visibility',
    isEnabled: false,
    level: 'standard',
    impact: 'medium'
  },
  {
    id: 'manager_reports',
    title: '管理者への集計レポート',
    description: '個人を特定できない形でチーム全体の傾向を共有します',
    category: 'sharing',
    isEnabled: true,
    level: 'standard',
    impact: 'medium'
  },
  {
    id: 'push_notifications',
    title: 'プッシュ通知',
    description: 'リマインダーや重要な情報の通知を受け取ります',
    category: 'communication',
    isEnabled: true,
    level: 'basic',
    impact: 'low'
  },
  {
    id: 'emergency_sharing',
    title: '緊急時の情報共有',
    description: 'メンタルヘルス上の緊急事態時に指定された連絡先に通知します',
    category: 'sharing',
    isEnabled: true,
    isRequired: true,
    level: 'basic',
    impact: 'high'
  },
  {
    id: 'research_participation',
    title: '学術研究への参加',
    description: '完全匿名化されたデータを学術研究に提供します',
    category: 'data',
    isEnabled: false,
    level: 'advanced',
    impact: 'low'
  },
  {
    id: 'detailed_analytics',
    title: '詳細分析レポート',
    description: '個人の詳細な分析データをHR部門と共有します',
    category: 'sharing',
    isEnabled: false,
    level: 'advanced',
    impact: 'high'
  }
]

const dataCategories = [
  {
    name: '基本情報',
    items: ['名前', '部署', '役職', '入社日'],
    retention: '退職後1年間',
    purpose: 'サービス提供とサポート'
  },
  {
    name: '利用データ',
    items: ['ログイン履歴', 'アプリ使用状況', '機能利用頻度'],
    retention: '6ヶ月間',
    purpose: 'サービス改善と使いやすさ向上'
  },
  {
    name: '感情データ',
    items: ['気分記録', 'ストレスレベル', 'AI対話履歴'],
    retention: '3年間',
    purpose: 'メンタルヘルスサポートとAI精度向上'
  },
  {
    name: '健康データ',
    items: ['チェックイン記録', '自己評価', '目標設定'],
    retention: '5年間',
    purpose: '長期的な健康管理とトレンド分析'
  }
]

export default function PrivacySettings() {
  const [settings, setSettings] = useState(privacySettings)
  const [activeTab, setActiveTab] = useState('settings')
  const [showDataRequest, setShowDataRequest] = useState(false)

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, isEnabled: !setting.isEnabled } : setting
    ))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data': return <Database className="w-4 h-4" />
      case 'sharing': return <Share className="w-4 h-4" />
      case 'visibility': return <Eye className="w-4 h-4" />
      case 'communication': return <Bell className="w-4 h-4" />
      case 'security': return <Lock className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data': return 'text-blue-600 bg-blue-50'
      case 'sharing': return 'text-green-600 bg-green-50'
      case 'visibility': return 'text-orange-600 bg-orange-50'
      case 'communication': return 'text-purple-600 bg-purple-50'
      case 'security': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return <Badge className="bg-red-100 text-red-700">高影響</Badge>
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-700">中影響</Badge>
      case 'low': return <Badge className="bg-green-100 text-green-700">低影響</Badge>
      default: return null
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'basic': return <Badge variant="outline" className="text-green-600">基本</Badge>
      case 'standard': return <Badge variant="outline" className="text-blue-600">標準</Badge>
      case 'advanced': return <Badge variant="outline" className="text-purple-600">詳細</Badge>
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
                <Shield className="w-6 h-6 mr-2" />
                プライバシー設定
              </h1>
              <p className="text-blue-100">あなたのデータの取り扱いを細かく制御できます</p>
            </div>
            <Badge className="bg-white/20 text-white border border-white/30">
              <Lock className="w-3 h-3 mr-1" />
              安全
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">暗号化</div>
              <div className="text-sm text-blue-100">データ保護</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">GDPR</div>
              <div className="text-sm text-blue-100">準拠</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">ISO27001</div>
              <div className="text-sm text-blue-100">認証取得</div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee */}
      <div className="px-4 py-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-green-900 mb-2">プライバシー保護の約束</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• あなたの個人データは暗号化され、安全に保管されます</li>
                  <li>• 同意なしに第三者にデータを提供することはありません</li>
                  <li>• いつでもデータの削除を請求できます</li>
                  <li>• すべての設定はあなたがコントロールできます</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings">設定</TabsTrigger>
            <TabsTrigger value="data">データ管理</TabsTrigger>
            <TabsTrigger value="rights">権利</TabsTrigger>
            <TabsTrigger value="security">セキュリティ</TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            {['basic', 'standard', 'advanced'].map((level) => (
              <Card key={level}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {level === 'basic' ? '基本設定' : 
                       level === 'standard' ? '標準設定' : '詳細設定'}
                    </span>
                    {getLevelBadge(level)}
                  </CardTitle>
                  <CardDescription>
                    {level === 'basic' ? '必須項目と基本的なプライバシー設定' : 
                     level === 'standard' ? 'サービス向上のための標準的な設定' : 
                     '高度なカスタマイズと詳細制御'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings
                    .filter(setting => setting.level === level)
                    .map((setting) => (
                      <div key={setting.id} className="flex items-start space-x-4 p-4 bg-white border rounded-lg">
                        <div className={`p-2 rounded ${getCategoryColor(setting.category)}`}>
                          {getCategoryIcon(setting.category)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                                <span>{setting.title}</span>
                                {setting.isRequired && (
                                  <Badge className="bg-red-100 text-red-700 text-xs">必須</Badge>
                                )}
                              </h4>
                              <p className="text-sm text-gray-600">{setting.description}</p>
                            </div>
                            <Switch
                              checked={setting.isEnabled}
                              onCheckedChange={() => toggleSetting(setting.id)}
                              disabled={setting.isRequired}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            {getImpactBadge(setting.impact)}
                            <Badge variant="outline" className="text-xs">
                              {setting.category === 'data' ? 'データ' :
                               setting.category === 'sharing' ? '共有' :
                               setting.category === 'visibility' ? '表示' :
                               setting.category === 'communication' ? '通知' : 'セキュリティ'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>収集・保存されるデータ</CardTitle>
                <CardDescription>
                  どのようなデータが、どの期間保存されるかを確認できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataCategories.map((category, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {category.retention}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">収集項目:</p>
                            <ul className="text-sm text-gray-700">
                              {category.items.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">利用目的:</p>
                            <p className="text-sm text-gray-700">{category.purpose}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>データのエクスポート</CardTitle>
                <CardDescription>
                  あなたのデータをダウンロードできます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                    onClick={() => setShowDataRequest(true)}
                  >
                    <Download className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-600">全データダウンロード</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600">レポート生成</span>
                  </Button>
                </div>

                {showDataRequest && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900 mb-2">データリクエスト処理中</h4>
                          <p className="text-sm text-blue-800 mb-3">
                            あなたのデータをセキュアな形式で準備しています。完了まで最大48時間かかる場合があります。
                          </p>
                          <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                            リクエスト状況を確認
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rights Tab */}
          <TabsContent value="rights" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>あなたの権利</CardTitle>
                <CardDescription>
                  プライバシーに関するあなたの権利を行使できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">アクセス権</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            あなたについて保存されているデータを確認する権利
                          </p>
                          <Button size="sm" variant="outline">データを確認</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Settings className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">修正権</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            不正確または不完全なデータの修正を求める権利
                          </p>
                          <Button size="sm" variant="outline">修正を依頼</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <EyeOff className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">処理停止権</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            特定の目的でのデータ処理停止を求める権利
                          </p>
                          <Button size="sm" variant="outline">処理停止を依頼</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Trash2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">削除権（忘れられる権利）</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            あなたのデータの削除を求める権利
                          </p>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                            データ削除を依頼
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900 mb-1">重要な注意事項</h4>
                    <p className="text-sm text-yellow-800">
                      データの削除や処理停止により、一部のサービス機能が利用できなくなる場合があります。
                      詳細については、プライバシーポリシーをご確認ください。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>セキュリティ状況</CardTitle>
                <CardDescription>
                  あなたのアカウントの安全性を確認できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-900">暗号化</div>
                    <div className="text-xs text-green-600">有効</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <Key className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-900">認証</div>
                    <div className="text-xs text-green-600">強力</div>
                  </div>
                </div>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-3">ログイン履歴</h4>
                    <div className="space-y-3">
                      {[
                        { device: 'iPhone 15', location: '東京', time: '2時間前', status: 'active' },
                        { device: 'PC Chrome', location: '東京', time: '昨日 18:30', status: 'normal' },
                        { device: 'iPad Safari', location: '東京', time: '3日前', status: 'normal' },
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-4 h-4 text-gray-600" />
                            <div>
                              <div className="text-sm font-medium">{session.device}</div>
                              <div className="text-xs text-gray-600">{session.location} • {session.time}</div>
                            </div>
                          </div>
                          <Badge 
                            variant={session.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {session.status === 'active' ? 'アクティブ' : '通常'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>セキュリティ設定</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">二段階認証</h4>
                        <p className="text-sm text-gray-600">SMS認証でアカウントを保護</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">自動ログアウト</h4>
                        <p className="text-sm text-gray-600">30分間非アクティブで自動ログアウト</p>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">異常ログイン通知</h4>
                        <p className="text-sm text-gray-600">不審なアクセスを検知して通知</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}