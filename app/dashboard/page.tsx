'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SimpleDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
      <p>ようこそ、{user?.name || 'ユーザー'}さん</p>
      <p>Email: {user?.email}</p>
      <button
        onClick={() => router.push('/auth')}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ログアウト
      </button>
    </div>
  )
}