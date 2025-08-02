'use client'

import { ReactNode } from 'react'
import { MobileNavigation } from './MobileNavigation'
import { DesktopSidebar } from './DesktopSidebar'
import { cn } from '@/lib/utils'

interface ResponsiveLayoutProps {
  children: ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
  className?: string
}

export function ResponsiveLayout({ children, user, className }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNavigation user={user} />
      
      {/* Desktop Sidebar */}
      <DesktopSidebar user={user} />
      
      {/* Main Content */}
      <main 
        className={cn(
          // Mobile styles
          "pt-14 pb-16 lg:pt-0 lg:pb-0",
          // Desktop styles
          "lg:ml-64",
          // Common styles
          "min-h-screen",
          className
        )}
      >
        <div className="container-responsive py-4 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}