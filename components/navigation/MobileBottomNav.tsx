'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Home, 
  MessageSquare, 
  BarChart3, 
  Calendar,
  Settings
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
  },
  {
    id: 'settings',
    label: '設定',
    icon: Settings,
    path: '/settings'
  }
]

export function MobileBottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#111827',
      borderTop: '1px solid #374151',
      zIndex: 50,
      padding: '8px 0'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.path
          
          return (
            <button
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? '#a3e635' : '#9ca3af',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleNavigation(item.path)}
            >
              <div style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4px',
                borderRadius: '50%',
                backgroundColor: isActive ? '#a3e635' : 'transparent',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}>
                <IconComponent 
                  style={{
                    width: '20px',
                    height: '20px',
                    color: isActive ? '#111827' : '#9ca3af'
                  }}
                />
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: '500',
                color: isActive ? '#a3e635' : '#9ca3af'
              }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}