'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Heart
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('メールアドレスを入力してください')
      return
    }

    if (!validateEmail(email)) {
      setError('有効なメールアドレスを入力してください')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await forgotPassword(email)
      
      if (success) {
        setIsSuccess(true)
      }
    } catch (error) {
      setError('パスワードリセット要求に失敗しました。')
    } finally {
      setIsLoading(false)
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
                メールを送信しました
              </CardTitle>
              <CardDescription className="text-gray-300">
                パスワードリセットの手順をお送りしました
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-300">
                  <strong>{email}</strong> 宛にパスワードリセット用のリンクを送信しました。
                </p>
                <p className="text-sm text-gray-400">
                  メールが届かない場合は、迷惑メールフォルダもご確認ください。
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/auth')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  ログインページに戻る
                </Button>
                
                <Button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail('')
                  }}
                  variant="outline"
                  className="w-full border-gray-500/50 bg-gray-600/50 hover:bg-gray-600/70 text-white"
                >
                  別のメールアドレスで再試行
                </Button>
              </div>
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
              パスワードをお忘れですか？
            </CardTitle>
            <CardDescription className="text-gray-300">
              メールアドレスを入力してパスワードをリセットしてください
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">メールアドレス</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className={`pl-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400 ${error ? 'border-red-500' : ''}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 min-h-[48px]"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>リセットメールを送信</span>
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

            {/* Additional Help */}
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">📧 メールが届かない場合</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 迷惑メールフォルダを確認してください</li>
                <li>• メールアドレスが正しいか確認してください</li>
                <li>• 数分待ってから再度お試しください</li>
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