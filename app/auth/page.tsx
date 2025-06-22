'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Checkbox } from '@/src/components/ui/checkbox'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Building2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Globe,
  UserPlus,
  LogIn,
  Chrome,
  Apple
} from 'lucide-react'
import { RippleButton, FloatingNotification } from '@/src/components/ui/micro-interactions'

interface AuthForm {
  email: string
  password: string
  confirmPassword?: string
  name?: string
  company?: string
  agreeTerms: boolean
  agreePrivacy: boolean
}

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [formData, setFormData] = useState<AuthForm>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: '',
    agreeTerms: false,
    agreePrivacy: false
  })
  const [errors, setErrors] = useState<Partial<AuthForm>>({})

  const validateForm = () => {
    const newErrors: Partial<AuthForm> = {}

    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください'
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください'
    }

    if (activeTab === 'register') {
      if (!formData.name) {
        newErrors.name = 'お名前を入力してください'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワード確認を入力してください'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワードが一致しません'
      }
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = '利用規約に同意してください'
      }
      if (!formData.agreePrivacy) {
        newErrors.agreePrivacy = 'プライバシーポリシーに同意してください'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      
      // Store auth state
      localStorage.setItem('mindcare-auth', JSON.stringify({
        isAuthenticated: true,
        user: {
          id: '1',
          email: formData.email,
          name: formData.name || formData.email.split('@')[0],
          company: formData.company,
          registeredAt: new Date().toISOString()
        }
      }))

      // Check if it's a new registration
      if (activeTab === 'register') {
        setNotificationMessage('アカウントが作成されました！')
        setShowNotification(true)
        setTimeout(() => {
          router.push('/onboarding')
        }, 2000)
      } else {
        setNotificationMessage('ログインしました！')
        setShowNotification(true)
        setTimeout(() => {
          // Check if user has checked in today
          const today = new Date().toDateString()
          const lastCheckin = localStorage.getItem('mindcare-last-checkin')
          
          if (lastCheckin === today) {
            router.push('/dashboard')
          } else {
            router.push('/checkin')
          }
        }, 2000)
      }
    }, 1500)
  }

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setIsLoading(true)
    
    // Simulate social login
    setTimeout(() => {
      setIsLoading(false)
      localStorage.setItem('mindcare-auth', JSON.stringify({
        isAuthenticated: true,
        user: {
          id: '1',
          email: `user@${provider}.com`,
          name: `${provider}ユーザー`,
          provider: provider,
          registeredAt: new Date().toISOString()
        }
      }))

      setNotificationMessage(`${provider === 'google' ? 'Google' : 'Apple'}でログインしました！`)
      setShowNotification(true)
      
      setTimeout(() => {
        router.push('/onboarding')
      }, 2000)
    }, 1000)
  }

  const updateFormData = (field: keyof AuthForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <FloatingNotification
        isVisible={showNotification}
        title="成功"
        message={notificationMessage}
        type="success"
        onClose={() => setShowNotification(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">MindCare</h1>
          <p className="text-gray-600">あなたの心の健康パートナー</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {activeTab === 'login' ? 'ログイン' : 'アカウント作成'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'login' 
                ? 'アカウントにログインしてください' 
                : '新しいアカウントを作成しましょう'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>ログイン</span>
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>新規登録</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="login" className="space-y-4 mt-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">メールアドレス</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">パスワード</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="パスワードを入力"
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
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
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <Checkbox />
                      <span className="text-gray-600">ログイン状態を保持</span>
                    </label>
                    <button type="button" className="text-blue-600 hover:underline">
                      パスワードを忘れた方
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">お名前</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="田中 太郎"
                        className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Company (Optional) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">会社名（任意）</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="株式会社サンプル"
                        className="pl-10"
                        value={formData.company}
                        onChange={(e) => updateFormData('company', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">メールアドレス</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">パスワード</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="8文字以上のパスワード"
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
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
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">パスワード確認</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="パスワードをもう一度入力"
                        className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <Checkbox
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => updateFormData('agreeTerms', checked as boolean)}
                      />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        <a href="#" className="text-blue-600 hover:underline">利用規約</a>に同意します
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-sm text-red-500 flex items-center ml-6">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.agreeTerms}
                      </p>
                    )}

                    <label className="flex items-start space-x-3">
                      <Checkbox
                        checked={formData.agreePrivacy}
                        onCheckedChange={(checked) => updateFormData('agreePrivacy', checked as boolean)}
                      />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        <a href="#" className="text-blue-600 hover:underline">プライバシーポリシー</a>に同意します
                      </span>
                    </label>
                    {errors.agreePrivacy && (
                      <p className="text-sm text-red-500 flex items-center ml-6">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.agreePrivacy}
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Submit Button */}
                <RippleButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>{activeTab === 'login' ? 'ログイン' : 'アカウント作成'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </RippleButton>
              </form>
            </Tabs>

            {/* Social Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <RippleButton
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-lg"
              >
                <Chrome className="h-4 w-4" />
                <span className="text-sm">Google</span>
              </RippleButton>
              <RippleButton
                type="button"
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-lg"
              >
                <Apple className="h-4 w-4" />
                <span className="text-sm">Apple</span>
              </RippleButton>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">🔒 プライバシー保護</h4>
                  <p className="text-sm text-blue-700">
                    すべてのデータは暗号化され、個人を特定できない形で処理されます。
                    企業には集計データのみが提供されます。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">
            サポートが必要ですか？{' '}
            <button className="text-blue-600 hover:underline">
              ヘルプセンター
            </button>
          </p>
          <p className="text-xs text-gray-500">
            © 2024 MindCare. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}