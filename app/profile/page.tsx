'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  // Redirect to settings page since profile is now integrated there
  useEffect(() => {
    router.replace('/settings')
  }, [router])

  // Return minimal loading state while redirecting
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af'
    }}>
      <div>リダイレクト中...</div>
    </div>
  )
}