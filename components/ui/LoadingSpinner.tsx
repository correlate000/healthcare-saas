'use client'

import React from 'react'
import { getTypographyStyles } from '@/styles/typography'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  size = 'medium', 
  message = '読み込み中...', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '32px', height: '32px', borderWidth: '3px' }
      case 'large':
        return { width: '60px', height: '60px', borderWidth: '5px' }
      default:
        return { width: '48px', height: '48px', borderWidth: '4px' }
    }
  }

  const spinnerStyles = getSizeStyles()

  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    }}>
      <div style={{
        position: 'relative',
        ...spinnerStyles
      }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `${spinnerStyles.borderWidth} solid rgba(163, 230, 53, 0.2)`,
          borderRadius: '50%'
        }} />
        
        {/* Spinning ring */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `${spinnerStyles.borderWidth} solid transparent`,
          borderTopColor: '#a3e635',
          borderRadius: '50%',
          animation: 'spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite'
        }} />
        
        {/* Center dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          backgroundColor: '#a3e635',
          borderRadius: '50%',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      </div>
      
      {message && (
        <p style={{
          ...getTypographyStyles('base'),
          color: '#9ca3af',
          margin: 0,
          animation: 'fadeIn 0.3s ease-in'
        }}>
          {message}
        </p>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)'
      }}>
        {content}
      </div>
    )
  }

  return content
}

// Skeleton loader for content placeholders
export function SkeletonLoader({ 
  width = '100%', 
  height = '20px',
  borderRadius = '4px'
}: { 
  width?: string | number
  height?: string | number
  borderRadius?: string
}) {
  return (
    <div style={{
      width,
      height,
      backgroundColor: 'rgba(55, 65, 81, 0.6)',
      borderRadius,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(163, 230, 53, 0.1), transparent)',
        animation: 'shimmer 2s infinite'
      }} />
      
      <style jsx>{`
        @keyframes shimmer {
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  )
}