'use client'

import React, { Component, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // You can also log the error to an error reporting service here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#111827',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(55, 65, 81, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <AlertCircle style={{ width: '32px', height: '32px', color: '#ef4444' }} />
            </div>
            
            <h1 style={{
              ...typographyPresets.h2(),
              color: '#f3f4f6',
              marginBottom: '16px'
            }}>
              エラーが発生しました
            </h1>
            
            <p style={{
              ...getTypographyStyles('base'),
              color: '#9ca3af',
              marginBottom: '24px'
            }}>
              申し訳ございません。予期しないエラーが発生しました。
              問題が続く場合は、サポートまでご連絡ください。
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <p style={{
                  ...getTypographyStyles('small'),
                  color: '#ef4444',
                  fontFamily: 'monospace',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#a3e635',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '8px',
                  ...getTypographyStyles('button'),
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#84cc16'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#a3e635'
                }}
              >
                ホームに戻る
              </button>
              
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#374151',
                  color: '#d1d5db',
                  border: 'none',
                  borderRadius: '8px',
                  ...getTypographyStyles('button'),
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151'
                }}
              >
                ページを再読み込み
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}