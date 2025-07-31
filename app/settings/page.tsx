'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  User,
  Settings,
  Bell,
  Shield,
  Moon,
  Sun,
  HelpCircle,
  MessageSquare,
  Star,
  LogOut,
  Edit,
  ChevronRight,
  Download,
  Upload,
  Trash2,
  Mail,
  Lock,
  Eye,
  Smartphone,
  Globe,
  Volume2,
  VolumeX,
  Palette,
  Database,
  Calendar,
  Clock,
  Award,
  Target,
  TrendingUp,
  Heart
} from 'lucide-react'

// Wireframe page 28 exact data structure and layout
export default function SettingsPage() {
  const router = useRouter()
  const [notificationSettings, setNotificationSettings] = useState({
    checkinReminder: true,
    morningReminder: true,
    eveningReminder: true,
    weeklyReport: true,
    encouragementMessages: true,
    marketingInfo: false
  })

  const toggleNotification = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-white text-xl font-semibold text-center tracking-wide">設定</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-24 space-y-6">
        {/* Profile section - exact wireframe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700/95 rounded-2xl p-4 border border-gray-600/30"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">ユーザー名</h3>
              <p className="text-sm text-gray-400">xxx@gmail.com</p>
              <p className="text-xs text-gray-400">2025年6月から利用開始</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-white">45</div>
              <div className="text-xs text-gray-400">セッション</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">12</div>
              <div className="text-xs text-gray-400">連続記録</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">lv.8</div>
              <div className="text-xs text-gray-400">レベル</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs text-gray-400 mb-1">次のレベルまで</div>
            <div className="text-sm text-white font-medium">850 / 1000 xp</div>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </motion.div>

        {/* Account section */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold px-2">アカウント</h3>
          <div className="bg-gray-700/95 rounded-2xl border border-gray-600/30">
            <div className="p-4 border-b border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">プロフィール編集</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4 border-b border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">AIキャラクター設定</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">レベル・バッジ</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Settings section */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold px-2">設定</h3>
          <div className="bg-gray-700/95 rounded-2xl border border-gray-600/30">
            <div className="p-4 border-b border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">通知設定</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4 border-b border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">言語設定</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">デバイス設定</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Notification settings - exact wireframe toggles */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold px-2">通知設定</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">チェックインリマインダー</span>
              <Switch
                checked={notificationSettings.checkinReminder}
                onCheckedChange={() => toggleNotification('checkinReminder')}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <div className="text-sm text-gray-400 mb-4">毎日決まった時間にリマインダーを送信</div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">朝のリマインダー</div>
                <div className="bg-gray-700 rounded-lg px-3 py-2 text-white text-sm">9:00</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">夜のリマインダー</div>
                <div className="bg-gray-700 rounded-lg px-3 py-2 text-white text-sm">21:00</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white font-medium">週次レポート</span>
              <Switch
                checked={notificationSettings.weeklyReport}
                onCheckedChange={() => toggleNotification('weeklyReport')}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <div className="text-sm text-gray-400 mb-4">週の振り返りレポート</div>

            <div className="flex items-center justify-between">
              <span className="text-white font-medium">励ましメッセージ</span>
              <Switch
                checked={notificationSettings.encouragementMessages}
                onCheckedChange={() => toggleNotification('encouragementMessages')}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <div className="text-sm text-gray-400 mb-4">AIからの応援メッセージ</div>

            <div className="flex items-center justify-between">
              <span className="text-white font-medium">マーケティング情報</span>
              <Switch
                checked={notificationSettings.marketingInfo}
                onCheckedChange={() => toggleNotification('marketingInfo')}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <div className="text-sm text-gray-400">新しいサービスやお知らせ</div>
          </div>
        </div>

        {/* Data & Account Management */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold px-2">データ・アカウント管理</h3>
          <div className="bg-gray-700/95 rounded-2xl border border-gray-600/30">
            <div className="p-4 border-b border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">データCSVエクスポート</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4 border-b border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">プライバシー設定</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">アカウント削除</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Support & Help */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold px-2">サポート・ヘルプ</h3>
          <div className="bg-gray-700/95 rounded-2xl border border-gray-600/30">
            <div className="p-4 border-b border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">ヘルプ・FAQ</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4 border-b border-gray-600/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <LogOut className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">ログアウト</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-gray-300" />
                  <span className="text-white font-medium">アプリを評価</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* App info - exact wireframe */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold px-2">アプリ情報</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">バージョン</span>
              <span className="text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ビルド</span>
              <span className="text-white">20240619</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">最終更新</span>
              <span className="text-white">2024年6月19日</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 py-4">
          © 2025 Healthcare SaaS. All rights reserved.
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}