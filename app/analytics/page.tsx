'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'


export default function AnalyticsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-white text-xl font-medium text-center">分析・統計レポート</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Period selector */}
        <div className="flex space-x-2 mb-6">
          {[{key: 'week', label: '1週間'}, {key: 'month', label: '1ヶ月'}, {key: 'year', label: '1年'}].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-white text-gray-800'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">7日</div>
            <div className="text-sm text-gray-600">総セッション数</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">21h</div>
            <div className="text-sm text-gray-600">総回答時間</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">15日</div>
            <div className="text-sm text-gray-600">継続日数記録</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800 mb-1">82%</div>
            <div className="text-sm text-gray-600">平均気分スコア</div>
          </div>
        </div>

        {/* Weekly trend */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">週間トレンド</h3>
          <div className="text-white text-sm mb-3">気分スコア</div>
          
          <div className="space-y-2">
            {['月', '火', '水', '木', '金', '土', '日'].map((day, index) => {
              const values = [75, 80, 85, 90, 78, 82, 88]
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <span className="text-white text-sm w-4">{day}</span>
                  <div className="flex-1 bg-gray-600 rounded-full h-4">
                    <div 
                      className="bg-white h-4 rounded-full transition-all duration-1000" 
                      style={{ width: `${values[index]}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm w-8">{values[index]}%</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">今週の振り返り</h3>
          
          <div className="bg-gray-600 rounded-2xl p-4">
            <p className="text-white text-sm leading-relaxed">
              今週は安定した記録ができています。特に金曜日の気分スコアが
              高く、週末に向けて良い調子を維持できていますね。
            </p>
          </div>
          
          <div className="bg-gray-600 rounded-2xl p-4">
            <p className="text-white text-sm font-medium mb-2">気分の向上</p>
            <p className="text-white text-sm leading-relaxed">
              先週と比べて平均気分スコアが12%向上しています
            </p>
          </div>
          
          <div className="bg-gray-600 rounded-2xl p-4">
            <p className="text-white text-sm font-medium mb-2">継続力アップ</p>
            <p className="text-white text-sm leading-relaxed">
              7日連続でセッションを完了！素晴らしい継続力です
            </p>
          </div>
        </div>

        {/* Reports section */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">週間情報通達</h3>
          
          <div className="bg-gray-600 rounded-2xl p-4">
            <p className="text-white text-sm leading-relaxed">
              今週の目標時間180分をクリアオーバーで達成！
            </p>
          </div>
        </div>
        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}