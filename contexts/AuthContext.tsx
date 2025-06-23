'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'enterprise-admin' | 'super-admin'
  permissions: string[]
  company?: string
  provider?: 'google' | 'apple' | 'email'
  registeredAt: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>
  logout: () => void
  socialLogin: (provider: 'google' | 'apple') => Promise<boolean>
  hasCheckedInToday: () => boolean
  markCheckedInToday: () => void
  isAdmin: () => boolean
  isEnterpriseAdmin: () => boolean
  isSuperAdmin: () => boolean
  hasPermission: (permission: string) => boolean
  loginAsAdmin: (adminType: 'admin' | 'enterprise-admin' | 'super-admin') => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  })

  useEffect(() => {
    // Check for existing auth state on mount
    const checkAuthState = () => {
      try {
        const storedAuth = localStorage.getItem('mindcare-auth')
        if (storedAuth) {
          const authData = JSON.parse(storedAuth)
          if (authData.isAuthenticated && authData.user) {
            setAuthState({
              isAuthenticated: true,
              user: authData.user,
              isLoading: false
            })
            return
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
      }
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      })
    }

    checkAuthState()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any email/password
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user',
        permissions: ['read:own-data', 'write:own-data'],
        registeredAt: new Date().toISOString()
      }

      const authData = {
        isAuthenticated: true,
        user
      }

      localStorage.setItem('mindcare-auth', JSON.stringify(authData))
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false
      })

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const user: User = {
        id: Date.now().toString(),
        email: userData.email!,
        name: userData.name!,
        role: 'user',
        permissions: ['read:own-data', 'write:own-data'],
        company: userData.company,
        registeredAt: new Date().toISOString()
      }

      const authData = {
        isAuthenticated: true,
        user
      }

      localStorage.setItem('mindcare-auth', JSON.stringify(authData))
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false
      })

      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const socialLogin = async (provider: 'google' | 'apple'): Promise<boolean> => {
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user: User = {
        id: Date.now().toString(),
        email: `user@${provider}.com`,
        name: `${provider}ユーザー`,
        role: 'user',
        permissions: ['read:own-data', 'write:own-data'],
        provider,
        registeredAt: new Date().toISOString()
      }

      const authData = {
        isAuthenticated: true,
        user
      }

      localStorage.setItem('mindcare-auth', JSON.stringify(authData))
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false
      })

      return true
    } catch (error) {
      console.error('Social login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('mindcare-auth')
    localStorage.removeItem('mindcare-last-checkin')
    localStorage.removeItem('mindcare-setup')
    localStorage.removeItem('mindcare-widgets')
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    })
  }

  const hasCheckedInToday = (): boolean => {
    const today = new Date().toDateString()
    const lastCheckin = localStorage.getItem('mindcare-last-checkin')
    return lastCheckin === today
  }

  const markCheckedInToday = () => {
    const today = new Date().toDateString()
    localStorage.setItem('mindcare-last-checkin', today)
  }

  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin' || authState.user?.role === 'enterprise-admin' || authState.user?.role === 'super-admin'
  }

  const isEnterpriseAdmin = (): boolean => {
    return authState.user?.role === 'enterprise-admin' || authState.user?.role === 'super-admin'
  }

  const isSuperAdmin = (): boolean => {
    return authState.user?.role === 'super-admin'
  }

  const hasPermission = (permission: string): boolean => {
    return authState.user?.permissions?.includes(permission) || false
  }

  const loginAsAdmin = async (adminType: 'admin' | 'enterprise-admin' | 'super-admin'): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const adminPermissions = {
        'admin': ['read:all-users', 'write:all-users', 'read:reports', 'manage:organization'],
        'enterprise-admin': ['read:all-users', 'write:all-users', 'read:reports', 'manage:organization', 'manage:enterprise', 'read:analytics'],
        'super-admin': ['read:all-users', 'write:all-users', 'read:reports', 'manage:organization', 'manage:enterprise', 'read:analytics', 'manage:system', 'manage:all-organizations']
      }

      const user: User = {
        id: `${adminType}-${Date.now()}`,
        email: `${adminType}@mindcare.com`,
        name: `${adminType === 'super-admin' ? 'スーパー管理者' : adminType === 'enterprise-admin' ? '企業管理者' : '管理者'}`,
        role: adminType,
        permissions: adminPermissions[adminType],
        registeredAt: new Date().toISOString()
      }

      const authData = {
        isAuthenticated: true,
        user
      }

      localStorage.setItem('mindcare-auth', JSON.stringify(authData))
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false
      })

      return true
    } catch (error) {
      console.error('Admin login error:', error)
      return false
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    socialLogin,
    hasCheckedInToday,
    markCheckedInToday,
    isAdmin,
    isEnterpriseAdmin,
    isSuperAdmin,
    hasPermission,
    loginAsAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}