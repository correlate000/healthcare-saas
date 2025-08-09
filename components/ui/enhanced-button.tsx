'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Sparkles, Heart, Star, Zap } from 'lucide-react'

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden touch-manipulation select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105",
        success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105",
        warning: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105",
        magical: "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white shadow-xl hover:shadow-2xl",
      },
      size: {
        default: "h-11 md:h-9 px-4 py-2",
        sm: "h-10 md:h-8 rounded-md px-3 text-xs",
        lg: "h-12 md:h-10 rounded-md px-8",
        xl: "h-14 md:h-12 rounded-lg px-10 text-base",
        icon: "h-11 w-11 md:h-9 md:w-9",
      },
      effect: {
        none: "",
        ripple: "",
        sparkle: "",
        pulse: "",
        bounce: "",
        shake: "",
        glow: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "ripple",
    },
  }
)

interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  loading?: boolean
  success?: boolean
  celebration?: boolean
  soundEffect?: boolean
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    effect, 
    asChild = false, 
    loading = false,
    success = false,
    celebration = false,
    soundEffect = false,
    children,
    onClick,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [isClicked, setIsClicked] = useState(false)
    const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([])
    const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, type: string}>>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // リップルエフェクト
      if (effect === 'ripple') {
        const newRipple = { id: Date.now(), x, y }
        setRipples(prev => [...prev, newRipple])
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
        }, 600)
      }

      // スパークルエフェクト
      if (effect === 'sparkle' || celebration) {
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          type: ['sparkle', 'heart', 'star'][Math.floor(Math.random() * 3)]
        }))
        setParticles(prev => [...prev, ...newParticles])
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
        }, 1000)
      }

      // クリックアニメーション
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 150)

      // 音響効果（実際の実装では Web Audio API を使用）
      if (soundEffect) {
        // プレースホルダー: 実際の音響効果
        console.log('🔊 Button click sound!')
      }

      onClick?.(e)
    }

    const { disabled } = props

    return (
      <motion.div
        className="relative inline-block"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        animate={effect === 'pulse' ? {
          boxShadow: [
            '0 0 0 0 rgba(59, 130, 246, 0.7)',
            '0 0 0 10px rgba(59, 130, 246, 0)',
            '0 0 0 0 rgba(59, 130, 246, 0)'
          ]
        } : {}}
        transition={effect === 'pulse' ? { duration: 1.5, repeat: Infinity } : { duration: 0.1 }}
      >
        <Comp
          className={cn(enhancedButtonVariants({ variant, size }), className, {
            'animate-bounce': effect === 'bounce' && !disabled,
            'animate-pulse': loading,
            'cursor-not-allowed': disabled || loading,
            'transform rotate-1': effect === 'shake' && isClicked,
            'shadow-2xl shadow-purple-500/50': effect === 'glow',
          })}
          ref={ref}
          onClick={handleClick}
          disabled={disabled || loading}
          {...props}
        >
          {/* ローディングスピナー */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-current/10 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* サクセスアイコン */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                >
                  ✓
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* リップルエフェクト */}
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                className="absolute rounded-full bg-white/30"
                style={{
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  width: 20,
                  height: 20,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {/* パーティクルエフェクト */}
          <AnimatePresence>
            {particles.map((particle) => {
              const ParticleIcon = particle.type === 'sparkle' ? Sparkles :
                                 particle.type === 'heart' ? Heart : Star
              return (
                <motion.div
                  key={particle.id}
                  className="absolute pointer-events-none"
                  style={{ left: particle.x, top: particle.y }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    y: [0, -30, -60],
                    x: [0, (Math.random() - 0.5) * 40],
                    opacity: [1, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <ParticleIcon className="w-3 h-3 text-yellow-400" />
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* グラデーション光沢 */}
          {variant === 'magical' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* 子要素 */}
          <span className="relative z-10 flex items-center gap-2">
            {loading ? '処理中...' : children}
          </span>
        </Comp>
      </motion.div>
    )
  }
)

EnhancedButton.displayName = "EnhancedButton"

export { enhancedButtonVariants }