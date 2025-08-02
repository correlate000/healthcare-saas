'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Shield, Mail, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requireEmailVerification?: boolean
  requiredRole?: 'admin' | 'enterprise-admin' | 'super-admin'
  requiredPermissions?: string[]
  fallback?: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireEmailVerification = false,
  requiredRole,
  requiredPermissions = [],
  fallback,
  redirectTo = '/auth'
}: ProtectedRouteProps) {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    emailVerified,
    resendVerificationEmail,
    hasPermission,
    isAdmin,
    isEnterpriseAdmin,
    isSuperAdmin
  } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, requireAuth, router, redirectTo])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">認証状態を確認中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Shield className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">認証が必要です</h2>
            <p className="text-sm text-gray-600 text-center">
              このページにアクセスするにはログインが必要です。
            </p>
            <Button 
              onClick={() => router.push(redirectTo)}
              className="w-full"
            >
              ログインページへ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Email verification required
  if (requireEmailVerification && !emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Mail className="h-12 w-12 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">メール認証が必要です</h2>
              <p className="text-sm text-gray-600 text-center">
                このページにアクセスするには、メールアドレスの認証が必要です。
                登録時に送信された認証メールを確認してください。
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={resendVerificationEmail}
                variant="outline"
                className="w-full"
              >
                認証メールを再送信
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                ダッシュボードに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Role-based access control
  if (requiredRole) {
    const hasRequiredRole = (() => {
      switch (requiredRole) {
        case 'admin':
          return isAdmin()
        case 'enterprise-admin':
          return isEnterpriseAdmin()
        case 'super-admin':
          return isSuperAdmin()
        default:
          return false
      }
    })()

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">アクセス権限がありません</h2>
              <p className="text-sm text-gray-600 text-center">
                このページにアクセスするには、{requiredRole}権限が必要です。
              </p>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                ダッシュボードに戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  // Permission-based access control
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission))
    
    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">アクセス権限がありません</h2>
              <p className="text-sm text-gray-600 text-center">
                このページにアクセスするには、追加の権限が必要です。
              </p>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                ダッシュボードに戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  // All checks passed, render children
  return <>{children}</>
}

// Higher-order component for easy use
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Convenience components for common use cases
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireEmailVerification={true}
      requiredRole="admin"
    >
      {children}
    </ProtectedRoute>
  )
}

export function EnterpriseAdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireEmailVerification={true}
      requiredRole="enterprise-admin"
    >
      {children}
    </ProtectedRoute>
  )
}

export function SuperAdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireEmailVerification={true}
      requiredRole="super-admin"
    >
      {children}
    </ProtectedRoute>
  )
}

export function AuthenticatedRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true}>
      {children}
    </ProtectedRoute>
  )
}

export function VerifiedRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireEmailVerification={true}
    >
      {children}
    </ProtectedRoute>
  )
}