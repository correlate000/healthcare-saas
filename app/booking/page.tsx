'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'


export default function BookingPage() {
  const router = useRouter()
  const [selectedSpecialist, setSelectedSpecialist] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-white text-xl font-medium text-center">専門家予約</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Available specialists */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">利用可能な専門家</h3>
          
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-800">田中 美咲</h4>
                <p className="text-sm text-gray-600">臨床心理士</p>
              </div>
              <div className="text-sm text-gray-600">今日 14:00</div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              ストレス管理と不安対処法を専門としています
            </p>
            <button 
              className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium"
              onClick={() => setSelectedSpecialist(1)}
            >
              予約する
            </button>
          </div>
          
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-800">佐藤 健太郎</h4>
                <p className="text-sm text-gray-600">精神科医</p>
              </div>
              <div className="text-sm text-gray-600">明日 10:30</div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              うつ病・適応障害の治療に特化しています
            </p>
            <button 
              className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium"
              onClick={() => setSelectedSpecialist(2)}
            >
              予約する
            </button>
          </div>
        </div>

        {/* Past appointments */}
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">過去の予約履歴</h3>
          
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">田中 美咲 先生</div>
                  <div className="text-sm text-gray-600">2024年6月15日 14:00</div>
                </div>
                <span className="text-sm text-gray-500">完了</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">エマ・ジョンソン 先生</div>
                  <div className="text-sm text-gray-600">2024年6月8日 16:00</div>
                </div>
                <span className="text-sm text-gray-500">完了</span>
              </div>
            </div>
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