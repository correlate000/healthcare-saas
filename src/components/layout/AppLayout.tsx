'use client'

import { ReactNode } from 'react'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { ArrowLeft, Heart, MessageCircle, TrendingUp, Calendar, Settings, Home, BarChart3, Map, Users, Building2, BookOpen, UserCheck, LogOut } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

interface AppLayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
}

export function AppLayout({ children, title, showBackButton }: AppLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Define navigation items
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'ホーム' },
    { path: '/checkin', icon: Heart, label: 'チェック' },
    { path: '/chat', icon: MessageCircle, label: 'チャット' },
    { path: '/analytics', icon: BarChart3, label: '分析' },
    { path: '/sitemap', icon: Map, label: 'サイトマップ' }
  ]

  // Check if current page is active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {(title || showBackButton) && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.back()}
                  className="mr-3"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {title && (
                <h1 className="font-medium text-gray-900">{title}</h1>
              )}
            </div>
            
            {/* Enterprise Admin Access - Only show if enterprise pages exist */}
            {pathname.includes('/enterprise-admin') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/enterprise-admin/dashboard')}
                className="text-blue-600"
              >
                <Building2 className="h-4 w-4 mr-1" />
                <span className="text-xs">企業</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto px-2">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    active
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'scale-110' : ''} transition-transform`} />
                  <span className={`text-xs font-medium ${active ? 'text-blue-600' : ''}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Quick Actions Row */}
          <div className="border-t border-gray-100 pt-2 pb-3">
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => router.push('/content-library')}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span className="text-xs">コンテンツ</span>
              </button>
              <button
                onClick={() => router.push('/booking')}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <UserCheck className="h-4 w-4" />
                <span className="text-xs">専門家</span>
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-xs">設定</span>
              </button>
              {/* Admin Access */}
              <button
                onClick={() => router.push('/admin-staging')}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Building2 className="h-4 w-4" />
                <span className="text-xs">管理者</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function QuickNav() {
  const router = useRouter()
  
  const navItems = [
    { label: '瞑想', path: '/meditation', icon: '🧘‍♀️' },
    { label: '日記', path: '/diary', icon: '📝' },
    { label: '実績', path: '/achievements', icon: '🏆' },
    { label: 'コミュニティ', path: '/community', icon: '👥' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => router.push(item.path)}
          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-sm font-medium text-gray-700">{item.label}</span>
        </button>
      ))}
    </div>
  )
}