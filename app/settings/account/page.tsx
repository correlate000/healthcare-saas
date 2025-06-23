'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppLayout } from '@/components/layout/AppLayout'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Key, 
  AlertTriangle,
  CheckCircle,
  Edit,
  Save,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock user data
const userData = {
  id: 'user_123',
  name: '田中 太郎',
  email: 'tanaka@company.com',
  phone: '090-1234-5678',
  company: '株式会社サンプル',
  department: 'マーケティング部',
  joinDate: '2024-01-15',
  plan: 'Enterprise',
  status: 'active',
  lastLogin: '2024-06-18T10:30:00Z',
  twoFactorEnabled: false,
  emailNotifications: true,
  profileVisibility: 'team'
}

export default function AccountSettings() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    department: userData.department
  })
  const [settings, setSettings] = useState({
    twoFactorEnabled: userData.twoFactorEnabled,
    emailNotifications: userData.emailNotifications,
    profileVisibility: userData.profileVisibility
  })

  const handleSave = () => {
    // Here you would typically save to an API
    console.log('Saving user data:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      department: userData.department
    })
    setIsEditing(false)
  }

  return (
    <AppLayout title="アカウント設定" showBackButton>
      <div className="px-4 py-6 space-y-6">
        
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-500 text-white text-xl">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                  <Badge variant="outline" className="text-xs">
                    {userData.plan}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{userData.email}</p>
                <p className="text-sm text-gray-500">{userData.company}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">アクティブ</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    最終ログイン: {new Date(userData.lastLogin).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <span>基本情報</span>
            </CardTitle>
            <CardDescription>
              プロフィール情報を管理します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">氏名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? '' : 'bg-gray-50'}
                />
              </div>
              
              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className={`flex-1 ${isEditing ? '' : 'bg-gray-50'}`}
                  />
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">電話番号</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className={`flex-1 ${isEditing ? '' : 'bg-gray-50'}`}
                  />
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="company">会社名</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="company"
                    value={userData.company}
                    disabled
                    className="flex-1 bg-gray-50"
                  />
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  会社情報は管理者によって管理されています
                </p>
              </div>
              
              <div>
                <Label htmlFor="department">部署</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? '' : 'bg-gray-50'}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  キャンセル
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>セキュリティ設定</span>
            </CardTitle>
            <CardDescription>
              アカウントのセキュリティを強化します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium text-gray-900">二段階認証</h4>
                  <p className="text-sm text-gray-600">
                    ログイン時の追加セキュリティ
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, twoFactorEnabled: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/settings/account/password')}
              >
                <Key className="h-4 w-4 mr-2" />
                パスワードの変更
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/settings/account/devices')}
              >
                <Shield className="h-4 w-4 mr-2" />
                ログインデバイス管理
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-500" />
              <span>プライバシー設定</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">メール通知</h4>
                <p className="text-sm text-gray-600">
                  重要な更新をメールで受信
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>

            <div>
              <Label htmlFor="visibility" className="text-sm font-medium">
                プロフィール表示範囲
              </Label>
              <select
                id="visibility"
                value={settings.profileVisibility}
                onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="private">非公開</option>
                <option value="team">チームメンバーのみ</option>
                <option value="company">社内全体</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>アカウント状態</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">アカウント正常</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                アカウントは正常に動作しています
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => router.push('/settings/account/deactivate')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                アカウントの無効化
              </Button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>アカウント作成日: {new Date(userData.joinDate).toLocaleDateString('ja-JP')}</p>
              <p>ユーザーID: {userData.id}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}