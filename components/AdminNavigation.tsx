'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Crown,
  Building2,
  ChevronRight,
  LogOut,
  Home
} from 'lucide-react'

export function AdminNavigation() {
  const auth = useAuth()
  const router = useRouter()

  if (!auth.isAuthenticated || !auth.isAdmin()) {
    return null
  }

  const adminRoutes = [
    {
      title: '管理者ダッシュボード',
      description: '組織全体のメンタルヘルス状況',
      icon: Shield,
      path: '/admin',
      color: 'bg-blue-500',
      requiredRole: 'admin' as const,
      visible: auth.isAdmin()
    },
    {
      title: '企業管理ダッシュボード',
      description: '企業レベルの管理機能',
      icon: Building2,
      path: '/enterprise-admin',
      color: 'bg-purple-500',
      requiredRole: 'enterprise-admin' as const,
      visible: auth.isEnterpriseAdmin()
    },
    {
      title: '企業分析',
      description: '詳細な分析とレポート',
      icon: BarChart3,
      path: '/enterprise-admin/analytics',
      color: 'bg-green-500',
      requiredRole: 'enterprise-admin' as const,
      visible: auth.isEnterpriseAdmin()
    },
    {
      title: 'スーパー管理者',
      description: 'システム全体の管理',
      icon: Crown,
      path: '/super-admin',
      color: 'bg-red-500',
      requiredRole: 'super-admin' as const,
      visible: auth.isSuperAdmin()
    }
  ]

  const handleLogout = () => {
    auth.logout()
    router.push('/')
  }

  const handleAdminLogin = async (adminType: 'admin' | 'enterprise-admin' | 'super-admin') => {
    // Set admin role in localStorage for demo purposes
    const adminRoles = {
      'admin': { role: 'admin', name: '管理者', permissions: ['view', 'edit'] },
      'enterprise-admin': { role: 'enterprise-admin', name: '企業管理者', permissions: ['view', 'edit', 'manage'] },
      'super-admin': { role: 'super-admin', name: 'スーパー管理者', permissions: ['view', 'edit', 'manage', 'delete', 'system'] }
    }
    
    const adminData = adminRoles[adminType]
    localStorage.setItem('adminRole', JSON.stringify(adminData))
    
    // Update auth context
    auth.setUser({
      ...auth.user!,
      role: adminType
    })
    
    toast({
      title: "管理者ログイン成功",
      description: `${adminData.name}としてログインしました`,
    })
    
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                管理者ダッシュボード
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">ログイン中:</span>
                  <Badge variant="secondary">{auth.user?.name}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">権限:</span>
                  <Badge 
                    variant={auth.user?.role === 'super-admin' ? 'destructive' : 'default'}
                    className={
                      auth.user?.role === 'super-admin' 
                        ? 'bg-red-500 text-white' 
                        : auth.user?.role === 'enterprise-admin' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }
                  >
                    {auth.user?.role === 'super-admin' && 'スーパー管理者'}
                    {auth.user?.role === 'enterprise-admin' && '企業管理者'}
                    {auth.user?.role === 'admin' && '管理者'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => router.push('/')}>
                <Home className="h-4 w-4 mr-2" />
                ホーム
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Routes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {adminRoutes.filter(route => route.visible).map((route, index) => {
            const IconComponent = route.icon
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200"
                onClick={() => router.push(route.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${route.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{route.title}</CardTitle>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{route.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {route.requiredRole}権限
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      アクセス →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Admin Login */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>管理者権限の切り替え</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => handleAdminLogin('admin')}
                disabled={auth.user?.role === 'admin'}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>一般管理者</span>
              </Button>
              <Button 
                onClick={() => handleAdminLogin('enterprise-admin')}
                disabled={auth.user?.role === 'enterprise-admin'}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Building2 className="h-4 w-4" />
                <span>企業管理者</span>
              </Button>
              <Button 
                onClick={() => handleAdminLogin('super-admin')}
                disabled={auth.user?.role === 'super-admin'}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Crown className="h-4 w-4" />
                <span>スーパー管理者</span>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              ※ 権限レベルに応じて、アクセス可能なページが変わります
            </p>
          </CardContent>
        </Card>

        {/* Current Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>現在の権限</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {auth.user?.permissions.map((permission, index) => (
                <Badge key={index} variant="outline" className="justify-center">
                  {permission}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}