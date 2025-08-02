'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  CheckCircle,
  AlertCircle,
  Heart,
  Loader2,
  Mail,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail, resendVerificationEmail, isAuthenticated } = useAuth()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (urlToken) {
      setToken(urlToken)
      handleVerification(urlToken)
    } else {
      setError('認証トークンが見つかりません。')
      setIsLoading(false)
    }
  }, [searchParams])

  const handleVerification = async (verificationToken: string) => {
    try {
      setIsLoading(true)
      const success = await verifyEmail(verificationToken)
      
      if (success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        setError('認証に失敗しました。トークンが無効または期限切れの可能性があります。')
      }
    } catch (error) {
      setError('認証中にエラーが発生しました。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    try {
      setIsLoading(true)
      await resendVerificationEmail()
    } catch (error) {
      setError('認証メールの再送信に失敗しました。')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (isLoading) {
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-xl text-white">
                メール認証中...
              </CardTitle>
              <CardDescription className="text-gray-300">
                しばらくお待ちください
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Success state
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
              <motion.div 
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <CardTitle className="text-xl text-white">
                認証が完了しました！
              </CardTitle>
              <CardDescription className="text-gray-300">
                メールアドレスが正常に認証されました
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-300">
                  ありがとうございます。メールアドレスの認証が完了しました。
                  全ての機能をご利用いただけます。
                </p>
                <p className="text-xs text-gray-400">
                  3秒後に自動的にダッシュボードに移動します...
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  ダッシュボードへ進む
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Error state
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-white">
              認証に失敗しました
            </CardTitle>
            <CardDescription className="text-gray-300">
              メール認証でエラーが発生しました
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-red-400">
                {error}
              </p>
              <p className="text-sm text-gray-300">
                認証リンクが期限切れまたは無効の可能性があります。
                新しい認証メールを送信してください。
              </p>
            </div>

            <div className="space-y-3">
              {isAuthenticated && (
                <Button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  認証メールを再送信
                </Button>
              )}
              
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
                className="w-full border-gray-500/50 bg-gray-600/50 hover:bg-gray-600/70 text-white"
              >
                ログインページへ戻る
              </Button>
            </div>

            {/* Help Section */}
            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
              <h4 className="font-medium text-yellow-400 mb-2">💡 ヘルプ</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 認証メールが届かない場合は迷惑メールフォルダを確認してください</li>
                <li>• リンクは24時間で期限切れになります</li>
                <li>• 問題が続く場合はサポートまでお問い合わせください</li>
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