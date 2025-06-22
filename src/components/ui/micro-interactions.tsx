'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Star, Heart, Zap, Gift, Sparkles } from 'lucide-react'

// タスク完了時の成功アニメーション
export function TaskCompleteAnimation({ 
  isVisible, 
  onComplete,
  xpGained = 10,
  taskTitle = "タスク完了！"
}: {
  isVisible: boolean
  onComplete: () => void
  xpGained?: number
  taskTitle?: string
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 2500)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm mx-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="mb-4"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-bold text-gray-900 mb-2"
            >
              {taskTitle}
            </motion.h3>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center space-x-2 text-yellow-600"
            >
              <Star className="h-5 w-5" />
              <span className="font-bold">+{xpGained} XP</span>
              <Sparkles className="h-5 w-5" />
            </motion.div>

            {/* 紙吹雪エフェクト */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    y: -20, 
                    x: Math.random() * 300 - 150,
                    rotate: 0 
                  }}
                  animate={{ 
                    opacity: 0, 
                    y: 300, 
                    rotate: 360 
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '10%'
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// レベルアップアニメーション
export function LevelUpAnimation({ 
  isVisible, 
  onComplete,
  newLevel = 1
}: {
  isVisible: boolean
  onComplete: () => void
  newLevel?: number
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6"
            >
              <div className="text-8xl">🎉</div>
            </motion.div>
            
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              レベルアップ！
            </motion.h1>
            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-6xl font-bold mb-8"
            >
              レベル {newLevel}
            </motion.div>
            
            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onComplete}
              className="bg-white text-orange-500 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-50 transition-colors"
            >
              続ける
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// キャラクター反応アニメーション
export function CharacterReaction({ 
  isVisible, 
  character,
  reaction = 'happy'
}: {
  isVisible: boolean
  character: {
    name: string
    avatar: string
    color: string
  }
  reaction?: 'happy' | 'excited' | 'caring' | 'proud'
}) {
  const reactionMessages = {
    happy: `${character.name}が喜んでいます！`,
    excited: `${character.name}がとても興奮しています！`,
    caring: `${character.name}があなたを見守っています`,
    proud: `${character.name}があなたを誇りに思っています！`
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-gradient-to-r ${character.color} text-white px-6 py-3 rounded-full shadow-lg`}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: 2, duration: 0.5 }}
              className="text-2xl"
            >
              {character.avatar}
            </motion.div>
            <span className="font-medium text-sm">
              {reactionMessages[reaction]}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// カウントアップアニメーション
export function CountUpAnimation({ 
  from, 
  to, 
  duration = 1000,
  suffix = '',
  className = 'text-2xl font-bold'
}: {
  from: number
  to: number
  duration?: number
  suffix?: string
  className?: string
}) {
  const [current, setCurrent] = useState(from)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const newValue = Math.round(from + (to - from) * easeOutQuart)
      
      setCurrent(newValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [from, to, duration])

  return (
    <span className={className}>
      {current.toLocaleString()}{suffix}
    </span>
  )
}

// プルスエフェクト（注目を引く）
export function PulseHighlight({ 
  children, 
  isActive = false,
  color = 'yellow'
}: {
  children: React.ReactNode
  isActive?: boolean
  color?: 'yellow' | 'blue' | 'green' | 'red'
}) {
  const colorClasses = {
    yellow: 'shadow-yellow-400',
    blue: 'shadow-blue-400',
    green: 'shadow-green-400',
    red: 'shadow-red-400'
  }

  return (
    <motion.div
      animate={isActive ? {
        boxShadow: [
          `0 0 0 0 rgba(${color === 'yellow' ? '251, 191, 36' : '59, 130, 246'}, 0.4)`,
          `0 0 0 10px rgba(${color === 'yellow' ? '251, 191, 36' : '59, 130, 246'}, 0)`,
        ]
      } : {}}
      transition={{
        duration: 1.5,
        repeat: isActive ? Infinity : 0,
        ease: "easeOut"
      }}
      className="rounded-lg"
    >
      {children}
    </motion.div>
  )
}

// フロートイン通知
export function FloatingNotification({ 
  isVisible, 
  title, 
  message, 
  type = 'success',
  onClose
}: {
  isVisible: boolean
  title: string
  message: string
  type?: 'success' | 'info' | 'warning' | 'achievement'
  onClose: () => void
}) {
  const icons = {
    success: CheckCircle,
    info: Sparkles,
    warning: Zap,
    achievement: Gift
  }

  const colors = {
    success: 'from-green-500 to-emerald-500',
    info: 'from-blue-500 to-cyan-500',
    warning: 'from-orange-500 to-yellow-500',
    achievement: 'from-purple-500 to-pink-500'
  }

  const Icon = icons[type]

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl max-w-sm mx-4`}
        >
          <div className="flex items-start space-x-3">
            <Icon className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">{title}</h4>
              <p className="text-sm opacity-90">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// リップルエフェクト（タップフィードバック）
export function RippleButton({ 
  children, 
  onClick, 
  className = '',
  ...props
}: {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  className?: string
  [key: string]: any
}) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    }
    
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 1000)

    onClick?.(e)
  }

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bg-white rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20
          }}
        />
      ))}
    </button>
  )
}