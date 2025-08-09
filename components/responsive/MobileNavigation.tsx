'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Calendar, 
  FileText, 
  Activity, 
  User, 
  Menu, 
  X,
  Settings,
  LogOut,
  Bell,
  Heart,
  ClipboardList,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavigationProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

const navigationItems = [
  { name: 'ホーム', href: '/dashboard', icon: Home },
  { name: 'チェックイン', href: '/checkin', icon: Heart },
  { name: 'レポート', href: '/reports', icon: BarChart3 },
  { name: '予約管理', href: '/booking', icon: Calendar },
  { name: 'エクスポート', href: '/export', icon: ClipboardList },
]

const bottomNavigationItems = [
  { name: 'ホーム', href: '/dashboard', icon: Home },
  { name: 'チェックイン', href: '/checkin', icon: Heart },
  { name: 'レポート', href: '/reports', icon: BarChart3 },
  { name: 'プロフィール', href: '/profile', icon: User },
]

export function MobileNavigation({ user }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 safe-area-inset-top">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="touch-target p-2 -ml-2"
            aria-label="メニューを開く"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          <h1 className="text-lg font-semibold text-gray-900">
            Healthcare SaaS
          </h1>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="touch-target p-2 -mr-2 relative"
            aria-label="通知"
          >
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transform transition-transform duration-300",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black transition-opacity duration-300",
            isMenuOpen ? "opacity-50" : "opacity-0"
          )}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
        <nav className="relative w-80 h-full bg-white shadow-xl overflow-y-auto safe-area-inset">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">メニュー</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="touch-target p-2 -mr-2"
                aria-label="メニューを閉じる"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* User Profile */}
          {user && (
            <div className="px-4 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="px-2 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Settings Section */}
          <div className="px-2 py-4 border-t border-gray-200">
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">設定</span>
            </Link>
            <button
              onClick={() => {
                // Handle logout
                console.log('Logout')
              }}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">ログアウト</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-40">
        <div className="grid grid-cols-4 h-16">
          {bottomNavigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-colors",
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="lg:hidden fixed top-14 right-0 left-0 bg-white shadow-lg border-b border-gray-200 z-40 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">通知</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="px-4 py-3 hover:bg-gray-50">
              <p className="text-sm font-medium text-gray-900">健康チェックリマインダー</p>
              <p className="text-sm text-gray-500 mt-1">本日の健康データを記録しましょう</p>
              <p className="text-xs text-gray-400 mt-1">2時間前</p>
            </div>
            <div className="px-4 py-3 hover:bg-gray-50">
              <p className="text-sm font-medium text-gray-900">週次レポート準備完了</p>
              <p className="text-sm text-gray-500 mt-1">先週の健康データサマリーを確認できます</p>
              <p className="text-xs text-gray-400 mt-1">昨日</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}