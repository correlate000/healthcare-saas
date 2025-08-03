'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'enterprise-admin' | 'super-admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await apiRequest('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.user) {
        setUser(response.user)
      }
    } catch (err) {
      localStorage.removeItem('token')
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiRequest('/auth/login', {
        method: 'POST',
        data: { email, password }
      })

      if (response.user && response.token) {
        setUser(response.user)
        localStorage.setItem('token', response.token)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
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