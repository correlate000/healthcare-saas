'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, ShieldAlert, Lock } from 'lucide-react'

interface AdminRouteProps {
  children: ReactNode
  requiredRole?: 'admin' | 'enterprise-admin' | 'super-admin'
  fallback?: ReactNode
}

export function AdminRoute({ children, requiredRole = 'admin', fallback }: AdminRouteProps) {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/auth')
    }
  }, [auth.isLoading, auth.isAuthenticated, router])

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">認証状態を確認中...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">認証が必要です</h2>
              <p className="text-gray-600 mb-4">このページにアクセスするにはログインが必要です。</p>
              <Button onClick={() => router.push('/auth')}>
                ログインページへ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasRequiredRole = () => {
    switch (requiredRole) {
      case 'super-admin':
        return auth.isSuperAdmin()
      case 'enterprise-admin':
        return auth.isEnterpriseAdmin()
      case 'admin':
        return auth.isAdmin()
      default:
        return false
    }
  }

  if (!hasRequiredRole()) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">アクセス権限がありません</h2>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">このページには管理者権限が必要です。</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-500">現在のロール:</span>
                  <Badge variant="outline">{auth.user?.role || 'unknown'}</Badge>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-500">必要なロール:</span>
                  <Badge variant="destructive">{requiredRole}</Badge>
                </div>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => router.push('/')}>
                  ホームに戻る
                </Button>
                <Button onClick={() => router.push('/auth')}>
                  管理者ログイン
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

export function AdminLoginCard() {
  const auth = useAuth()
  const router = useRouter()

  const handleAdminLogin = async (adminType: 'admin' | 'enterprise-admin' | 'super-admin') => {
    const success = await auth.loginAsAdmin(adminType)
    if (success) {
      router.refresh()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 text-blue-500 mx-auto" />
          <h2 className="text-xl font-semibold">管理者ログイン</h2>
          <p className="text-gray-600">管理者権限でログインしてください</p>
          
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => handleAdminLogin('admin')}
            >
              一般管理者でログイン
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleAdminLogin('enterprise-admin')}
            >
              企業管理者でログイン
            </Button>
            <Button 
              className="w-full" 
              variant="secondary"
              onClick={() => handleAdminLogin('super-admin')}
            >
              スーパー管理者でログイン
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
            >
              ホームに戻る
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}