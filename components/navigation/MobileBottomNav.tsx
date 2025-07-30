'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Heart, 
  MessageSquare, 
  BarChart3, 
  User,
  Calendar,
  Settings,
  Bell
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  badge?: number
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'ホーム',
    icon: Home,
    path: '/dashboard'
  },
  {
    id: 'checkin',
    label: 'チェックイン',
    icon: Heart,
    path: '/checkin'
  },
  {
    id: 'chat',
    label: 'チャット',
    icon: MessageSquare,
    path: '/chat'
  },
  {
    id: 'analytics',
    label: '分析',
    icon: BarChart3,
    path: '/analytics'
  },
  {
    id: 'booking',
    label: '予約',
    icon: Calendar,
    path: '/booking'
  }
]

export function MobileBottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <>
      {/* ボトムナビゲーション */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 w-full max-w-[375px] mx-auto bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50 z-[100] shadow-2xl"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 40, duration: 0.3 }}
      >
        <div className="px-2 py-2">
          <div className="grid grid-cols-5 gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.path
              
              return (
                <motion.button
                  key={item.id}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 touch-manipulation min-h-[60px] ${
                    isActive 
                      ? 'text-emerald-400' 
                      : 'text-gray-500 hover:text-gray-300 active:text-emerald-400'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* アクティブ状態の背景 */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gray-800/80 rounded-lg border border-emerald-400/20"
                      layoutId="activeBackground"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                        duration: 0.2
                      }}
                    />
                  )}
                  
                  {/* アイコンとバッジ */}
                  <div className="relative z-10">
                    <div className="relative">
                      <IconComponent 
                        className={`h-5 w-5 transition-all duration-200 ${
                          isActive ? 'scale-105 drop-shadow-sm' : ''
                        }`}
                      />
                      
                      {/* 通知バッジ */}
                      {item.badge && item.badge > 0 && (
                        <motion.div
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </motion.div>
                      )}
                    </div>
                    
                    {/* ラベル */}
                    <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                      isActive ? 'opacity-100 text-emerald-400' : 'opacity-80 text-gray-500'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
        
      </motion.nav>
    </>
  )
}