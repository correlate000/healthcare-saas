'use client'

import { useState } from 'react'
import { AppLayout } from '@/src/components/layout/AppLayout'
import { Card, CardContent } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Switch } from '@/src/components/ui/switch'
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  HelpCircle,
  LogOut,
  Edit,
  ChevronRight,
  Lock,
  Smartphone,
  Volume2,
  Vibrate,
  Eye,
  Download,
  Trash2,
  Heart,
  Star,
  Settings as SettingsIcon
} from 'lucide-react'
import { motion } from 'framer-motion'
import { 
  FloatingNotification,
  RippleButton 
} from '@/src/components/ui/micro-interactions'

// ユーザー設定データ
const userSettings = {
  profile: {
    name: 'あなた',
    email: 'user@example.com',
    joinDate: '2024年3月15日',
    level: 12,
    totalSessions: 47,
    streak: 7
  },
  notifications: {
    dailyReminder: true,
    sessionComplete: true,
    weeklyReport: true,
    emergency: true,
    marketing: false
  },
  privacy: {
    dataCollection: true,
    analytics: false,
    shareProgress: true,
    publicProfile: false
  },
  appearance: {
    darkMode: false,
    language: 'ja',
    soundEffects: true,
    hapticFeedback: true,
    animations: true
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(userSettings)
  const [showSaveNotification, setShowSaveNotification] = useState(false)

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
    setShowSaveNotification(true)
  }

  return (
    <AppLayout title="設定" showBackButton>
      <div className="px-4 py-6 space-y-6 max-w-md mx-auto">
        
        {/* 保存通知 */}
        <FloatingNotification
          isVisible={showSaveNotification}
          title="設定を保存しました"
          message="変更が正常に反映されました"
          type="success"
          onClose={() => setShowSaveNotification(false)}
        />

        {/* プロフィール */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-blue-500 text-white text-xl font-bold">
                  {settings.profile.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{settings.profile.name}</h3>
                <p className="text-sm text-gray-600">{settings.profile.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">レベル {settings.profile.level}</Badge>
                  <Badge variant="outline">{settings.profile.streak}日連続</Badge>
                </div>
              </div>
              <RippleButton className="p-2 bg-white bg-opacity-70 rounded-full">
                <Edit className="h-4 w-4 text-gray-600" />
              </RippleButton>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{settings.profile.totalSessions}</div>
                <div className="text-xs text-gray-600">セッション</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{settings.profile.streak}</div>
                <div className="text-xs text-gray-600">連続記録</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{settings.profile.level}</div>
                <div className="text-xs text-gray-600">レベル</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 通知設定 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <span>通知設定</span>
            </h3>
            
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => {
                const labels = {
                  dailyReminder: '毎日のリマインダー',
                  sessionComplete: 'セッション完了通知',
                  weeklyReport: '週間レポート',
                  emergency: '緊急時アラート',
                  marketing: 'マーケティング情報'
                }
                
                const descriptions = {
                  dailyReminder: '毎日決まった時間にリマインダーを送信',
                  sessionComplete: 'セッション完了時に通知',
                  weeklyReport: '週次の進捗レポートを受信',
                  emergency: '緊急時サポートの通知',
                  marketing: '新機能やキャンペーンのお知らせ'
                }

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {labels[key as keyof typeof labels]}
                      </div>
                      <div className="text-sm text-gray-600">
                        {descriptions[key as keyof typeof descriptions]}
                      </div>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updateSetting('notifications', key, checked)}
                    />
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* プライバシー設定 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>プライバシー・セキュリティ</span>
            </h3>
            
            <div className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => {
                const labels = {
                  dataCollection: 'データ収集',
                  analytics: '分析データ共有',
                  shareProgress: '進捗共有',
                  publicProfile: '公開プロフィール'
                }
                
                const descriptions = {
                  dataCollection: 'サービス改善のためのデータ収集を許可',
                  analytics: '匿名化された分析データの共有',
                  shareProgress: 'チームメンバーとの進捗共有',
                  publicProfile: 'プロフィールの公開設定'
                }

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {labels[key as keyof typeof labels]}
                      </div>
                      <div className="text-sm text-gray-600">
                        {descriptions[key as keyof typeof descriptions]}
                      </div>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updateSetting('privacy', key, checked)}
                    />
                  </motion.div>
                )
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <RippleButton className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">パスワード変更</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </RippleButton>
            </div>
          </CardContent>
        </Card>

        {/* 外観・操作設定 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-purple-500" />
              <span>外観・操作</span>
            </h3>
            
            <div className="space-y-4">
              {Object.entries(settings.appearance).map(([key, value]) => {
                if (key === 'language') {
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between py-3 border-b border-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">言語</span>
                      </div>
                      <Button variant="outline" size="sm">
                        日本語
                      </Button>
                    </motion.div>
                  )
                }

                const labels = {
                  darkMode: 'ダークモード',
                  soundEffects: '効果音',
                  hapticFeedback: '触覚フィードバック',
                  animations: 'アニメーション'
                }
                
                const icons = {
                  darkMode: Moon,
                  soundEffects: Volume2,
                  hapticFeedback: Vibrate,
                  animations: Star
                }

                const Icon = icons[key as keyof typeof icons]

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">{labels[key as keyof typeof labels]}</span>
                    </div>
                    <Switch
                      checked={value as boolean}
                      onCheckedChange={(checked) => updateSetting('appearance', key, checked)}
                    />
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* データ・アカウント管理 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5 text-gray-500" />
              <span>データ・アカウント管理</span>
            </h3>
            
            <div className="space-y-3">
              <RippleButton className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">データをエクスポート</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </RippleButton>
              
              <RippleButton className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">プライバシーポリシー</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </RippleButton>
              
              <RippleButton className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg text-red-600">
                <div className="flex items-center space-x-3">
                  <Trash2 className="h-5 w-5" />
                  <span className="font-medium">アカウント削除</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </RippleButton>
            </div>
          </CardContent>
        </Card>

        {/* サポート・ヘルプ */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-indigo-500" />
              <span>サポート・ヘルプ</span>
            </h3>
            
            <div className="space-y-3">
              <RippleButton className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">ヘルプセンター</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </RippleButton>
              
              <RippleButton className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">フィードバック送信</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </RippleButton>
              
              <RippleButton className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">アプリを評価</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </RippleButton>
            </div>
          </CardContent>
        </Card>

        {/* アプリ情報 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">アプリ情報</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">バージョン</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ビルド</span>
                <span className="font-medium">20240619</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最終更新</span>
                <span className="font-medium">2024年6月19日</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ログアウト */}
        <RippleButton className="w-full flex items-center justify-center space-x-3 p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium">
          <LogOut className="h-5 w-5" />
          <span>ログアウト</span>
        </RippleButton>

        {/* 開発者情報 */}
        <div className="text-center text-xs text-gray-500 pb-4">
          <p>Made with ❤️ for your mental wellness</p>
          <p className="mt-1">© 2024 Healthcare SaaS. All rights reserved.</p>
        </div>
      </div>
    </AppLayout>
  )
}