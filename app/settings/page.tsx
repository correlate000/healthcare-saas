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

interface SettingsGroup {
  title: string
  items: SettingsItem[]
}

interface SettingsItem {
  id: string
  title: string
  description: string
  type: 'toggle' | 'action' | 'info'
  icon: React.ReactNode
  value?: boolean
  action?: () => void
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    sounds: true,
    morningReminder: true,
    eveningReflection: true,
    dataSync: true,
    analytics: true,
    autoBackup: true
  })

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const settingsGroups: SettingsGroup[] = [
    {
      title: '外観とカスタマイズ',
      items: [
        {
          id: 'darkMode',
          title: 'ダークモード',
          description: 'ダークテーマで表示します',
          type: 'toggle',
          icon: settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />,
          value: settings.darkMode
        },
        {
          id: 'sounds',
          title: 'サウンド効果',
          description: 'アプリの操作音を再生します',
          type: 'toggle',
          icon: settings.sounds ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />,
          value: settings.sounds
        }
      ]
    },
    {
      title: '通知設定',
      items: [
        {
          id: 'notifications',
          title: '通知を許可',
          description: 'プッシュ通知を受け取ります',
          type: 'toggle',
          icon: <Bell className="w-5 h-5" />,
          value: settings.notifications
        },
        {
          id: 'morningReminder',
          title: '朝のリマインダー',
          description: '朝のチェックインを促します',
          type: 'toggle',
          icon: <Clock className="w-5 h-5" />,
          value: settings.morningReminder
        },
        {
          id: 'eveningReflection',
          title: '夜の振り返り',
          description: '夜の振り返りを促します',
          type: 'toggle',
          icon: <Calendar className="w-5 h-5" />,
          value: settings.eveningReflection
        }
      ]
    },
    {
      title: 'データとプライバシー',
      items: [
        {
          id: 'dataSync',
          title: 'データ同期',
          description: 'クラウドにデータを同期します',
          type: 'toggle',
          icon: <Database className="w-5 h-5" />,
          value: settings.dataSync
        },
        {
          id: 'analytics',
          title: '使用状況の分析',
          description: 'アプリ改善のため使用データを送信',
          type: 'toggle',
          icon: <TrendingUp className="w-5 h-5" />,
          value: settings.analytics
        },
        {
          id: 'autoBackup',
          title: '自動バックアップ',
          description: 'データを自動的にバックアップ',
          type: 'toggle',
          icon: <Upload className="w-5 h-5" />,
          value: settings.autoBackup
        },
        {
          id: 'privacy',
          title: 'プライバシー設定',
          description: 'データ保護とプライバシー管理',
          type: 'action',
          icon: <Shield className="w-5 h-5" />,
          action: () => router.push('/settings/privacy')
        }
      ]
    },
    {
      title: 'アカウント',
      items: [
        {
          id: 'account',
          title: 'アカウント設定',
          description: 'プロフィール情報の管理',
          type: 'action',
          icon: <User className="w-5 h-5" />,
          action: () => router.push('/settings/account')
        },
        {
          id: 'export',
          title: 'データのエクスポート',
          description: 'あなたのデータをダウンロード',
          type: 'action',
          icon: <Download className="w-5 h-5" />,
          action: () => router.push('/export')
        }
      ]
    },
    {
      title: 'サポート',
      items: [
        {
          id: 'help',
          title: 'ヘルプセンター',
          description: 'よくある質問と使い方ガイド',
          type: 'action',
          icon: <HelpCircle className="w-5 h-5" />,
          action: () => router.push('/help')
        },
        {
          id: 'feedback',
          title: 'フィードバック',
          description: 'ご意見・ご要望をお聞かせください',
          type: 'action',
          icon: <MessageSquare className="w-5 h-5" />,
          action: () => router.push('/feedback')
        },
        {
          id: 'rating',
          title: 'アプリを評価',
          description: 'App Storeで評価をお願いします',
          type: 'action',
          icon: <Star className="w-5 h-5" />,
          action: () => {}
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-white text-xl font-semibold text-center tracking-wide">設定</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-24 space-y-6">
        {/* Profile section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-700/95 rounded-2xl p-6 border border-gray-600/30"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white tracking-wide">あなた</h3>
              <p className="text-sm text-gray-400 font-medium">user@example.com</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                  <Award className="w-3 h-3 mr-1" />
                  レベル 12
                </Badge>
                <Badge className="bg-orange-500/20 text-orange-400 border border-orange-400/30">
                  <Target className="w-3 h-3 mr-1" />
                  7日連続
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-xl"
              onClick={() => router.push('/profile')}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-600/50 rounded-xl">
              <div className="text-2xl font-bold text-white mb-1">47</div>
              <div className="text-xs text-gray-400 font-medium">セッション</div>
            </div>
            <div className="text-center p-3 bg-gray-600/50 rounded-xl">
              <div className="text-2xl font-bold text-white mb-1">7</div>
              <div className="text-xs text-gray-400 font-medium">連続記録</div>
            </div>
            <div className="text-center p-3 bg-gray-600/50 rounded-xl">
              <div className="text-2xl font-bold text-white mb-1">12</div>
              <div className="text-xs text-gray-400 font-medium">レベル</div>
            </div>
          </div>
        </motion.div>

        {/* Settings sections */}
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (groupIndex + 1) * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-white font-semibold text-lg px-2 tracking-wide">{group.title}</h3>
            <div className="bg-gray-700/95 rounded-2xl border border-gray-600/30 overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className={`p-5 ${
                    itemIndex !== group.items.length - 1 ? 'border-b border-gray-600/30' : ''
                  } transition-colors hover:bg-gray-600/50`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-2 bg-gray-600/70 rounded-lg text-gray-300">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-base tracking-wide">{item.title}</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    
                    {item.type === 'toggle' && (
                      <Switch
                        checked={item.value || false}
                        onCheckedChange={() => toggleSetting(item.id)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    )}
                    
                    {item.type === 'action' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-400 hover:text-white hover:bg-gray-600/50 rounded-xl"
                        onClick={item.action}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* App info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-700/95 rounded-2xl p-5 border border-gray-600/30"
        >
          <h3 className="font-semibold text-white mb-4 tracking-wide">アプリ情報</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">バージョン</span>
              <span className="text-white font-semibold">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">最終更新</span>
              <span className="text-white font-semibold">2024年7月30日</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-medium">デバイス</span>
              <div className="flex items-center space-x-2 text-white font-semibold">
                <Smartphone className="w-4 h-4" />
                <span>iOS</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button 
            className="w-full bg-red-500/90 hover:bg-red-500 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 min-h-[52px] touch-manipulation"
            onClick={() => router.push('/auth')}
          >
            <LogOut className="w-5 h-5 mr-2" />
            ログアウト
          </Button>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}