'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResponsiveModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  mobileFullScreen?: boolean
  className?: string
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  mobileFullScreen = true,
  className
}: ResponsiveModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-full sm:m-4'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className={cn(
            "relative transform overflow-hidden bg-white transition-all",
            mobileFullScreen
              ? "w-full h-full sm:h-auto sm:rounded-lg sm:shadow-xl"
              : "w-full rounded-t-xl sm:rounded-lg shadow-xl",
            sizeClasses[size],
            "sm:w-full",
            className
          )}
        >
          {/* Header */}
          {title && (
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="touch-target rounded-lg p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                  aria-label="閉じる"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div 
            className={cn(
              "overflow-y-auto",
              mobileFullScreen
                ? "h-[calc(100vh-4rem)] sm:h-auto sm:max-h-[calc(100vh-10rem)]"
                : "max-h-[70vh] sm:max-h-[calc(100vh-10rem)]",
              title ? "" : "pt-12" // Add padding if no title
            )}
          >
            {/* Close button when no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 touch-target rounded-lg p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            <div className="px-4 py-4 sm:px-6 sm:py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}