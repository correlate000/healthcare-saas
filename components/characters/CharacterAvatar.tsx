'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Character3D } from './Character3D'

interface CharacterAvatarProps {
  character: 'luna' | 'aria' | 'zen'
  emotion?: 'happy' | 'excited' | 'calm' | 'concerned' | 'thinking' | 'celebrating'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  showVoiceWave?: boolean
  className?: string
  use3D?: boolean
}

const characters = {
  luna: {
    name: 'Luna',
    color: 'from-purple-400 to-pink-400',
    emoji: '🌙',
    personality: 'gentle',
    voice: '優しく穏やかな声'
  },
  aria: {
    name: 'Aria',
    color: 'from-blue-400 to-cyan-400',
    emoji: '✨',
    personality: 'energetic',
    voice: '明るく元気な声'
  },
  zen: {
    name: 'Zen',
    color: 'from-green-400 to-teal-400',
    emoji: '🧘',
    personality: 'wise',
    voice: '落ち着いた知的な声'
  }
}

const emotions = {
  happy: { emoji: '😊', scale: 1, bounce: true },
  excited: { emoji: '🤩', scale: 1.1, bounce: true },
  calm: { emoji: '😌', scale: 1, bounce: false },
  concerned: { emoji: '😟', scale: 0.95, bounce: false },
  thinking: { emoji: '🤔', scale: 1, bounce: false },
  celebrating: { emoji: '🎉', scale: 1.2, bounce: true }
}

const sizeConfig = {
  sm: { width: 'w-12 h-12', text: 'text-2xl', ring: 'ring-2' },
  md: { width: 'w-16 h-16', text: 'text-3xl', ring: 'ring-3' },
  lg: { width: 'w-24 h-24', text: 'text-4xl', ring: 'ring-4' },
  xl: { width: 'w-32 h-32', text: 'text-6xl', ring: 'ring-6' }
}

export function CharacterAvatar({
  character,
  emotion = 'happy',
  size = 'md',
  animated = true,
  showVoiceWave = false,
  className,
  use3D = false
}: CharacterAvatarProps) {
  const [currentEmotion, setCurrentEmotion] = useState(emotion)
  const [isBlinking, setIsBlinking] = useState(false)
  const [voiceIntensity, setVoiceIntensity] = useState(0)

  const char = characters[character]
  const emo = emotions[currentEmotion]
  const size_config = sizeConfig[size]

  // ランダムなまばたきアニメーション
  useEffect(() => {
    if (!animated) return
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(blinkInterval)
  }, [animated])

  // 音声波形アニメーション
  useEffect(() => {
    if (!showVoiceWave) return

    const waveInterval = setInterval(() => {
      setVoiceIntensity(Math.random() * 100)
    }, 100)

    return () => clearInterval(waveInterval)
  }, [showVoiceWave])

  // 感情変化エフェクト
  useEffect(() => {
    setCurrentEmotion(emotion)
  }, [emotion])

  // 3Dアバターを使用する場合
  if (use3D) {
    return (
      <Character3D
        character={character}
        emotion={emotion}
        size={size}
        animated={animated}
        showVoiceWave={showVoiceWave}
        className={className}
      />
    )
  }

  return (
    <div className={cn("relative inline-block", className)}>
      {/* メインアバター */}
      <motion.div
        className={cn(
          size_config.width,
          "relative rounded-full bg-gradient-to-br",
          char.color,
          "flex items-center justify-center shadow-lg",
          size_config.ring,
          "ring-white ring-opacity-50",
          "overflow-hidden"
        )}
        animate={{
          scale: emo.scale,
          y: emo.bounce ? [0, -2, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.3 },
          y: { duration: 1.5, repeat: emo.bounce ? Infinity : 0, ease: "easeInOut" }
        }}
        whileHover={{ scale: emo.scale * 1.05 }}
        whileTap={{ scale: emo.scale * 0.95 }}
      >
        {/* キャラクター基本絵文字 */}
        <motion.div
          className={cn(size_config.text, "relative z-10")}
          animate={{
            scaleY: isBlinking ? 0.1 : 1
          }}
          transition={{ duration: 0.1 }}
        >
          {char.emoji}
        </motion.div>

        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        
        {/* キラキラエフェクト */}
        {animated && (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* 感情表示エモート */}
      <AnimatePresence>
        <motion.div
          key={currentEmotion}
          className="absolute -top-2 -right-2 text-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          {emo.emoji}
        </motion.div>
      </AnimatePresence>

      {/* 音声波形 */}
      {showVoiceWave && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-white rounded-full"
              animate={{
                height: [2, voiceIntensity * 0.3 + 2, 2],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* ホバー時の詳細情報 */}
      <motion.div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 pointer-events-none whitespace-nowrap"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {char.name} - {char.voice}
      </motion.div>

      {/* レベル表示 */}
      {size === 'lg' || size === 'xl' ? (
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Lv.5
        </motion.div>
      ) : null}

      {/* パルスエフェクト（アクティブ時） */}
      {animated && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br",
            char.color,
            "opacity-30"
          )}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  )
}