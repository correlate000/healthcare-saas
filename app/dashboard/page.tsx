'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function SimpleDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  
  // モックユーザーデータ（認証をバイパス）
  const mockUser = {
    name: 'テストユーザー',
    email: 'test@example.com'
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 p-4">
        <h1 className="text-xl font-bold">ダッシュボード</h1>
        <p className="text-sm text-gray-400">{mockUser.name}さんの健康サマリー</p>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 pb-24">
        {/* タブメニュー */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'overview' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            概要
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'health' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            健康データ
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'ai' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            AI分析
          </button>
        </div>

        {/* タブコンテンツ */}
        <div className="bg-gray-700 rounded-lg p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">今日の健康状態</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-600 p-4 rounded">
                  <p className="text-sm text-gray-300">心拍数</p>
                  <p className="text-2xl font-bold">72 bpm</p>
                </div>
                <div className="bg-gray-600 p-4 rounded">
                  <p className="text-sm text-gray-300">歩数</p>
                  <p className="text-2xl font-bold">8,234</p>
                </div>
                <div className="bg-gray-600 p-4 rounded">
                  <p className="text-sm text-gray-300">睡眠時間</p>
                  <p className="text-2xl font-bold">7h 30m</p>
                </div>
                <div className="bg-gray-600 p-4 rounded">
                  <p className="text-sm text-gray-300">ストレスレベル</p>
                  <p className="text-2xl font-bold">低</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">健康データ記録</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/checkin')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                >
                  体調チェックインを記録
                </button>
                <button
                  onClick={() => router.push('/health')}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg"
                >
                  健康データを入力
                </button>
                <button
                  onClick={() => router.push('/analytics')}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg"
                >
                  データ分析を見る
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">AI健康アドバイス</h2>
              <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg mb-4">
                <p className="text-sm">💡 今日のアドバイス</p>
                <p className="mt-2">睡眠時間が改善されています。この調子で規則正しい生活を続けましょう。</p>
              </div>
              <button
                onClick={() => router.push('/chat')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
              >
                AIチャットで相談する
              </button>
            </div>
          )}
        </div>

        {/* クイックアクション */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">クイックアクション</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/counselor')}
              className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center"
            >
              <span className="text-2xl mb-2 block">👤</span>
              <span className="text-sm">カウンセラー</span>
            </button>
            <button
              onClick={() => router.push('/mood')}
              className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center"
            >
              <span className="text-2xl mb-2 block">😊</span>
              <span className="text-sm">気分記録</span>
            </button>
            <button
              onClick={() => router.push('/medication')}
              className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center"
            >
              <span className="text-2xl mb-2 block">💊</span>
              <span className="text-sm">服薬管理</span>
            </button>
            <button
              onClick={() => router.push('/emergency')}
              className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center"
            >
              <span className="text-2xl mb-2 block">🆘</span>
              <span className="text-sm">緊急連絡</span>
            </button>
          </div>
        </div>
      </div>

      {/* ボトムナビゲーション */}
      <MobileBottomNav />
    </div>
  )
}