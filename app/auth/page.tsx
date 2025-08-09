'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
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
import { RippleButton, FloatingNotification } from '@/components/ui/micro-interactions'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'

interface AuthForm {
  email: string
  password: string
  confirmPassword?: string
  name?: string
  company?: string
  department?: string
  agreeTerms: boolean
  agreePrivacy: boolean
  rememberMe: boolean
}

interface AuthFormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
  company?: string
  department?: string
  agreeTerms?: string
  agreePrivacy?: string
  rememberMe?: string
  general?: string
}

export default function AuthPage() {
  const router = useRouter()
  const { login, register, isAuthenticated } = useAuth()
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
    department: '',
    agreeTerms: false,
    agreePrivacy: false,
    rememberMe: false
  })
  const [errors, setErrors] = useState<AuthFormErrors>({})

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard')
    return null
  }

  const validateForm = () => {
    const newErrors: AuthFormErrors = {}

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
      // Show validation error notification
      setNotificationMessage('入力内容を確認してください')
      setShowNotification(true)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      if (activeTab === 'login') {
        const success = await login(formData.email, formData.password, formData.rememberMe)
        
        if (success) {
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
          }, 1500)
        } else {
          // Login failed
          setErrors({ general: 'メールアドレスまたはパスワードが正しくありません' })
          setNotificationMessage('ログインに失敗しました')
          setShowNotification(true)
        }
      } else {
        // Registration
        const success = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name!,
          company: formData.company,
          department: formData.department,
          agreeTerms: formData.agreeTerms,
          agreePrivacy: formData.agreePrivacy
        })
        
        if (success) {
          setNotificationMessage('アカウントが作成されました！メール認証を確認してください。')
          setShowNotification(true)
          
          setTimeout(() => {
            router.push('/onboarding')
          }, 2000)
        } else {
          // Registration failed
          setErrors({ general: 'アカウントの作成に失敗しました。別のメールアドレスをお試しください。' })
          setNotificationMessage('登録に失敗しました')
          setShowNotification(true)
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setErrors({ general: '認証中にエラーが発生しました。しばらくしてからお試しください。' })
      setNotificationMessage('エラーが発生しました')
      setShowNotification(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    // For now, show a message that social login is not implemented
    toast({
      title: "準備中",
      description: `${provider === 'google' ? 'Google' : 'Apple'}ログインは準備中です。メールアドレスでの登録をお試しください。`,
      variant: "default",
    })
  }

  const updateFormData = (field: keyof AuthForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
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
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">MindCare</h1>
          <p className="text-gray-300">あなたの心の健康パートナー</p>
        </div>

        <Card className="shadow-xl border border-gray-600/30 bg-gray-700/95">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white">
              {activeTab === 'login' ? 'ログイン' : 'アカウント作成'}
            </CardTitle>
            <CardDescription className="text-gray-300">
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
                {/* General Error Display */}
                {errors.general && (
                  <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {errors.general}
                    </p>
                  </div>
                )}

                <TabsContent value="login" className="space-y-4 mt-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white">メールアドレス</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400 ${errors.email ? 'border-red-500' : ''}`}
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
                    <label htmlFor="password" className="text-sm font-medium text-white">パスワード</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="パスワードを入力"
                        className={`pl-10 pr-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400 ${errors.password ? 'border-red-500' : ''}`}
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
                      <Checkbox 
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => updateFormData('rememberMe', checked as boolean)}
                      />
                      <span className="text-gray-300">ログイン状態を保持</span>
                    </label>
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-emerald-400 hover:underline"
                    >
                      パスワードを忘れた方
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 mt-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-white">お名前</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="田中 太郎"
                        className={`pl-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400 ${errors.name ? 'border-red-500' : ''}`}
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
                    <label className="text-sm font-medium text-white">会社名（任意）</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="株式会社サンプル"
                        className="pl-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400"
                        value={formData.company}
                        onChange={(e) => updateFormData('company', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Department (Optional) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">部署名（任意）</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="開発部"
                        className="pl-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400"
                        value={formData.department}
                        onChange={(e) => updateFormData('department', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white">メールアドレス</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400 ${errors.email ? 'border-red-500' : ''}`}
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
                    <label htmlFor="password" className="text-sm font-medium text-white">パスワード</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="8文字以上のパスワード"
                        className={`pl-10 pr-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400 ${errors.password ? 'border-red-500' : ''}`}
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
                    <label className="text-sm font-medium text-white">パスワード確認</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="パスワードをもう一度入力"
                        className={`pl-10 bg-gray-600/50 border-gray-500/50 text-white placeholder:text-gray-400 ${errors.confirmPassword ? 'border-red-500' : ''}`}
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
                      <span className="text-sm text-gray-300 leading-relaxed">
                        <a href="#" className="text-emerald-400 hover:underline">利用規約</a>に同意します
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
                      <span className="text-sm text-gray-300 leading-relaxed">
                        <a href="#" className="text-emerald-400 hover:underline">プライバシーポリシー</a>に同意します
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
                  className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation"
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
                <span className="px-2 bg-gray-700 text-gray-400">または</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <RippleButton
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 border border-gray-500/50 bg-gray-600/50 hover:bg-gray-600/70 text-white py-3 rounded-lg min-h-[48px] touch-manipulation"
              >
                <Chrome className="h-4 w-4" />
                <span className="text-sm">Google</span>
              </RippleButton>
              <RippleButton
                type="button"
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 border border-gray-500/50 bg-gray-600/50 hover:bg-gray-600/70 text-white py-3 rounded-lg min-h-[48px] touch-manipulation"
              >
                <Apple className="h-4 w-4" />
                <span className="text-sm">Apple</span>
              </RippleButton>
            </div>

            {/* Privacy Notice */}
            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-emerald-400 mb-1">🔒 プライバシー保護</h4>
                  <p className="text-sm text-gray-300">
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
          <p className="text-sm text-gray-300">
            サポートが必要ですか？{' '}
            <button className="text-emerald-400 hover:underline">
              ヘルプセンター
            </button>
          </p>
          <p className="text-xs text-gray-400">
            © 2024 MindCare. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}