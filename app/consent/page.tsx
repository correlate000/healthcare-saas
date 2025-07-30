'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function ConsentScreen() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)

  const handleContinue = () => {
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gray-800 relative">
      {/* ワイヤーフレーム通りの配置 */}
      <div className="flex flex-col h-screen">
        
        {/* キャラクターエリア */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl"
          >
            <span className="text-gray-800 text-xl font-medium">キャラクター</span>
          </motion.div>
        </div>

        {/* 下部のボタンとテキスト */}
        <div className="p-6 space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Button
              onClick={handleContinue}
              className="w-full h-14 bg-white text-gray-800 hover:bg-gray-100 text-lg font-medium rounded-xl"
            >
              同意して続行
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center text-white text-sm leading-relaxed px-4"
          >
            続行すると、弊社の利用規約に同意し、弊社のプライバシーポリシーを受け取ったことを認めることになります。
          </motion.div>
        </div>
      </div>
    </div>
  )
}