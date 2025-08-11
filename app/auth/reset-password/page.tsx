'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Heart,
  ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const urlToken = searchParams?.get('token')
    if (urlToken) {
      setToken(urlToken)
    } else {
      // Redirect to forgot password if no token
      router.push('/auth/forgot-password')
    }
  }, [searchParams, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password) {
      newErrors.password = 'パスワードを入力してください'
    } else if (password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'パスワードは大文字、小文字、数字を含む必要があります'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'パスワード確認を入力してください'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !token) {
      return
    }

    setIsLoading(true)

    try {
      const success = await resetPassword(token, password)
      
      if (success) {
        setIsSuccess(true)
      }
    } catch (error) {
      setErrors({ general: 'パスワードのリセットに失敗しました。' })
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    if (field === 'password') {
      setPassword(value)
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value)
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">MindCare</h1>
          </div>

          <Card className="shadow-xl border border-gray-600/30 bg-gray-700/95">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-white">
                パスワードが変更されました
              </CardTitle>
              <CardDescription className="text-gray-300">
                新しいパスワードでログインできます
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-300">
                  パスワードが正常に変更されました。新しいパスワードでログインしてください。
                </p>
              </div>

              <Button
                onClick={() => router.push('/auth')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                ログインページへ
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">MindCare</h1>
        </div>

        <Card className="shadow-xl border border-gray-600/30 bg-gray-700/95">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white">
              新しいパスワードを設定
            </CardTitle>
            <CardDescription className="text-gray-300">
              安全な新しいパスワードを入力してください
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                  <p className="text-sm text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.general}
                  </p>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">新しいパスワード</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8文字以上の安全なパスワード"
                    className={`pl-10 pr-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400 ${errors.password ? 'border-red-500' : ''}`}
                    value={password}
                    onChange={(e) => updateField('password', e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
                <div className="text-xs text-gray-400">
                  パスワードは大文字、小文字、数字を含む8文字以上で設定してください
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">パスワード確認</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="パスワードをもう一度入力"
                    className={`pl-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    value={confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 min-h-[48px]"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>パスワードを変更</span>
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/auth"
                className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>ログインページに戻る</span>
              </Link>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">🔒 セキュリティのヒント</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 他のサービスと同じパスワードは使用しないでください</li>
                <li>• 定期的にパスワードを変更することをお勧めします</li>
                <li>• パスワードマネージャーの使用を検討してください</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            © 2024 MindCare. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}