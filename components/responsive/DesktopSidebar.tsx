'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Calendar, 
  FileText, 
  Activity, 
  User, 
  Settings,
  LogOut,
  Heart,
  ClipboardList,
  BarChart3,
  Shield,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DesktopSidebarProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

const navigationGroups = [
  {
    title: 'メイン',
    items: [
      { name: 'ダッシュボード', href: '/dashboard', icon: Home },
      { name: 'ヘルスチェックイン', href: '/checkin', icon: Heart },
      { name: 'レポート', href: '/reports', icon: BarChart3 },
      { name: 'カレンダー', href: '/calendar', icon: Calendar },
    ]
  },
  {
    title: 'データ管理',
    items: [
      { name: '健康記録', href: '/records', icon: ClipboardList },
      { name: 'アクティビティ', href: '/activity', icon: Activity },
      { name: 'ドキュメント', href: '/documents', icon: FileText },
    ]
  },
  {
    title: 'アカウント',
    items: [
      { name: 'プロフィール', href: '/profile', icon: User },
      { name: 'セキュリティ', href: '/security', icon: Shield },
      { name: '設定', href: '/settings', icon: Settings },
      { name: 'ヘルプ', href: '/help', icon: HelpCircle },
    ]
  }
]

export function DesktopSidebar({ user }: DesktopSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Healthcare SaaS
            </span>
          </Link>
        </div>

        {/* User Profile */}
        {user && (
          <div className="px-4 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-8">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Icon 
                        className={cn(
                          "mr-3 h-5 w-5 transition-colors",
                          isActive
                            ? "text-indigo-600"
                            : "text-gray-400 group-hover:text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              // Handle logout
              console.log('Logout')
            }}
            className="group flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
            ログアウト
          </button>
        </div>
      </div>
    </aside>
  )
}