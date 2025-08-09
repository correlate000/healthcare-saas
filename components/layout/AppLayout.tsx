'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Building2, Shield, Crown } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

interface AppLayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
}

export function AppLayout({ children, title, showBackButton }: AppLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()


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
            
            {/* Admin Access - Enhanced with multiple admin levels */}
            <div className="flex items-center space-x-2">
              {pathname.includes('/enterprise-admin') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/enterprise-admin/dashboard')}
                  className="text-blue-600"
                >
                  <Building2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">企業管理</span>
                </Button>
              )}
              
              {pathname.includes('/admin') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/admin')}
                  className="text-purple-600"
                >
                  <Crown className="h-4 w-4 mr-1" />
                  <span className="text-xs">管理者</span>
                </Button>
              )}
              
              {pathname.includes('/super-admin') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/super-admin')}
                  className="text-red-600"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-xs">スーパー管理</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* モバイルボトムナビゲーション */}
      <MobileBottomNav />
    </div>
  )
}

export function QuickNav() {
  const router = useRouter()
  
  const navItems = [
    { label: 'コンテンツ', path: '/content-library', icon: '🧘‍♀️' },
    { label: 'チャット', path: '/chat', icon: '📝' },
    { label: '実績', path: '/achievements', icon: '🏆' },
    { label: 'チーム', path: '/team-connect', icon: '👥' },
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