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
    path: '/chat',
    badge: 2
  },
  {
    id: 'analytics',
    label: '分析',
    icon: BarChart3,
    path: '/analytics'
  },
  {
    id: 'profile',
    label: 'プロフィール',
    icon: User,
    path: '/profile'
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
      {/* スペーサー - コンテンツが底部ナビで隠れないように */}
      <div className="h-20 md:hidden" />
      
      {/* ボトムナビゲーション */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="px-2 py-1">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.path
              
              return (
                <motion.button
                  key={item.id}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 touch-manipulation min-h-[56px] ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 active:text-gray-800'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* アクティブ状態の背景 */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-blue-100 rounded-xl"
                      layoutId="activeBackground"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35
                      }}
                    />
                  )}
                  
                  {/* アイコンとバッジ */}
                  <div className="relative z-10">
                    <div className="relative">
                      <IconComponent 
                        className={`h-6 w-6 transition-all duration-200 ${
                          isActive ? 'scale-110' : ''
                        }`}
                      />
                      
                      {/* 通知バッジ */}
                      {item.badge && item.badge > 0 && (
                        <motion.div
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
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
                      isActive ? 'opacity-100' : 'opacity-70'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
        
        {/* ホームインジケーター（iOS風） */}
        <div className="flex justify-center pb-1">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </motion.nav>
    </>
  )
}