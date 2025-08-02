import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveCardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: () => void
}

export function ResponsiveCard({ 
  children, 
  className, 
  padding = 'md',
  interactive = false,
  onClick 
}: ResponsiveCardProps) {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  }

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200",
        paddingClasses[padding],
        interactive && "cursor-pointer transition-all hover:shadow-md hover:border-gray-300 active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}