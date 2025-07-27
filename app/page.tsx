'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // スプラッシュ画面を3秒表示してから同意画面に遷移
    const timer = setTimeout(() => {
      router.push('/consent')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center relative">
      {/* メインコンテンツ - ワイヤーフレーム通りの配置 */}
      <div className="flex flex-col items-center space-y-8">
        {/* キャラクターエリア - ライムグリーンの大きな丸 */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 200,
            delay: 0.2
          }}
          className="w-80 h-80 bg-lime-400 rounded-3xl flex items-center justify-center shadow-xl"
        >
          <span className="text-gray-800 text-xl font-medium">キャラクター</span>
        </motion.div>

        {/* サービスロゴテキスト */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-white text-lg font-medium">
            サービスロゴ
          </h1>
        </motion.div>
      </div>

      {/* ローディングアニメーション */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-20"
      >
        {/* シンプルなローディングドット */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-lime-400 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}