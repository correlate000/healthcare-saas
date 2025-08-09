'use client'

import React from 'react'
import { getTypographyStyles } from '@/styles/typography'

interface TouchButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  disabled?: boolean
  style?: React.CSSProperties
  ariaLabel?: string
}

export function TouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  style = {},
  ariaLabel
}: TouchButtonProps) {
  // Minimum tap target size for accessibility (48px)
  const MIN_TAP_SIZE = 48

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          minHeight: `${MIN_TAP_SIZE}px`,
          padding: '12px 16px',
          ...getTypographyStyles('button')
        }
      case 'large':
        return {
          minHeight: '56px',
          padding: '16px 24px',
          ...getTypographyStyles('large')
        }
      default: // medium
        return {
          minHeight: `${MIN_TAP_SIZE}px`,
          padding: '14px 20px',
          ...getTypographyStyles('button')
        }
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'rgba(55, 65, 81, 0.6)',
          color: '#d1d5db',
          border: '1px solid rgba(55, 65, 81, 0.3)'
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#9ca3af',
          border: 'none'
        }
      default: // primary
        return {
          background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
          color: '#111827',
          border: 'none'
        }
    }
  }

  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    ...getSizeStyles(),
    ...getVariantStyles(),
    fontWeight: '600', // Override any fontWeight from getSizeStyles
    ...style
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    
    // Add ripple effect
    const button = e.currentTarget
    const ripple = document.createElement('span')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.classList.add('ripple')
    
    button.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)
    
    onClick?.()
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        style={baseStyles}
        aria-label={ariaLabel}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {children}
      </button>
      
      <style jsx>{`
        button {
          position: relative;
          overflow: hidden;
        }
        
        :global(.ripple) {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
        }
        
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}