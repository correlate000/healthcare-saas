'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'


export default function SettingsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-white text-xl font-medium text-center">設定</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Profile section */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xl font-bold">XX</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">あなた</h3>
              <p className="text-sm text-gray-600">user@example.com</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">レベル 12</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">7日連続</span>
              </div>
            </div>
            <button className="p-2 bg-gray-100 rounded-full">
              <span className="text-gray-600">編集</span>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">47</div>
              <div className="text-xs text-gray-600">セッション</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">7</div>
              <div className="text-xs text-gray-600">連続記録</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">12</div>
              <div className="text-xs text-gray-600">レベル</div>
            </div>
          </div>
        </div>

        {/* Settings options */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-800">ダークモード</div>
                <div className="text-sm text-gray-600">ダークテーマで表示</div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <div className="font-medium text-gray-800">通知</div>
                <div className="text-sm text-gray-600">プッシュ通知を受け取る</div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <div className="font-medium text-gray-800">プライバシー</div>
                <div className="text-sm text-gray-600">データ保護設定</div>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <div className="font-medium text-gray-800">アカウント</div>
                <div className="text-sm text-gray-600">アカウント情報の管理</div>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
          </div>
        </div>

        {/* Support section */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="font-medium text-gray-800">ヘルプセンター</span>
                <span className="text-gray-400">&gt;</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="font-medium text-gray-800">フィードバック送信</span>
                <span className="text-gray-400">&gt;</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="font-medium text-gray-800">アプリを評価</span>
                <span className="text-gray-400">&gt;</span>
              </div>
            </div>
          </div>
        </div>

        {/* App info */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-medium text-gray-800 mb-3">アプリ情報</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">バージョン</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最終更新</span>
              <span className="font-medium">2024年6月19日</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full bg-red-500 text-white py-3 rounded-2xl font-medium">
          ログアウト
        </button>
        
        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}