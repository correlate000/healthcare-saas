'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
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

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    socialLogin,
    hasCheckedInToday,
    markCheckedInToday
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