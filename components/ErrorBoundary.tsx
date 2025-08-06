'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
          <div className="bg-gray-700 text-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">エラーが発生しました</h2>
            <p className="text-gray-300 mb-4">
              申し訳ございません。予期しないエラーが発生しました。
            </p>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                  エラー詳細
                </summary>
                <pre className="mt-2 text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}