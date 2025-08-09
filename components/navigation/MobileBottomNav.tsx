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
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(55, 65, 81, 0.5)',
      zIndex: 50,
      padding: '6px 0',
      boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)'
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
                padding: '10px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? '#a3e635' : '#9ca3af',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleNavigation(item.path)}
            >
              <div style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
                borderRadius: isActive ? '12px' : '50%',
                backgroundColor: isActive ? 'rgba(163, 230, 53, 0.15)' : 'transparent',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <IconComponent 
                  style={{
                    width: '18px',
                    height: '18px',
                    color: isActive ? '#a3e635' : '#9ca3af',
                    strokeWidth: isActive ? 2.5 : 2
                  }}
                />
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#a3e635' : '#9ca3af',
                letterSpacing: '-0.01em'
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