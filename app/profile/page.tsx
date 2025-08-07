'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '山田 太郎',
    email: 'yamada@example.com',
    phone: '090-1234-5678',
    birthDate: '1990-01-15',
    gender: 'male',
    location: '東京都',
    bio: 'メンタルヘルスの改善に取り組んでいます。毎日の小さな習慣を大切にしています。',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisible: true,
      showStats: false,
      anonymous: false
    }
  })

  // Bird Avatar Component
  const BirdAvatar = ({ size = 80 }: { size?: number }) => (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      position: 'relative',
      margin: '0 auto'
    }}>
      {/* Background circle */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#374151',
        borderRadius: '50%'
      }}></div>
      
      {/* Bird body */}
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.15}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${size * 0.5}px`,
        height: `${size * 0.45}px`,
        backgroundColor: '#a3e635',
        borderRadius: '50% 50% 45% 45%',
        zIndex: 1
      }}></div>
      
      {/* Eyes */}
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.4}px`,
        left: `${size * 0.35}px`,
        width: `${size * 0.08}px`,
        height: `${size * 0.1}px`,
        backgroundColor: '#111827',
        borderRadius: '50%',
        zIndex: 2
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.4}px`,
        right: `${size * 0.35}px`,
        width: `${size * 0.08}px`,
        height: `${size * 0.1}px`,
        backgroundColor: '#111827',
        borderRadius: '50%',
        zIndex: 2
      }}></div>
      
      {/* Beak */}
      <div style={{
        position: 'absolute',
        bottom: `${size * 0.32}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${size * 0.12}px`,
        height: `${size * 0.08}px`,
        backgroundColor: '#f59e0b',
        borderRadius: '0 0 50% 50%',
        zIndex: 2
      }}></div>
    </div>
  )

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px',
        borderBottom: '1px solid #374151'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px'
          }}>
            <button
              onClick={() => router.push('/settings')}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9ca3af',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ←
            </button>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#f3f4f6',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              プロフィール
            </h1>
          </div>
          
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: isEditing ? '#a3e635' : '#374151',
              color: isEditing ? '#111827' : '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isEditing ? '保存' : '編集'}
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Profile Avatar Section */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <BirdAvatar size={100} />
            {isEditing && (
              <button
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#a3e635',
                  borderRadius: '50%',
                  border: '2px solid #111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                📷
              </button>
            )}
          </div>
          
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#f3f4f6',
            marginTop: '16px',
            marginBottom: '4px',
            letterSpacing: '-0.5px'
          }}>
            {profileData.name}
          </h2>
          
          <p style={{
            fontSize: '14px',
            color: '#9ca3af'
          }}>
            メンバーID: #12345
          </p>
        </div>

        {/* Basic Information */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #374151'
          }}>
            基本情報
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <label style={{
                fontSize: '13px',
                color: '#9ca3af',
                marginBottom: '6px',
                display: 'block',
                fontWeight: '500'
              }}>
                氏名
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: isEditing ? '#111827' : '#374151',
                  border: isEditing ? '1px solid #4b5563' : '1px solid transparent',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{
                fontSize: '13px',
                color: '#9ca3af',
                marginBottom: '6px',
                display: 'block',
                fontWeight: '500'
              }}>
                メールアドレス
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: isEditing ? '#111827' : '#374151',
                  border: isEditing ? '1px solid #4b5563' : '1px solid transparent',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{
                fontSize: '13px',
                color: '#9ca3af',
                marginBottom: '6px',
                display: 'block',
                fontWeight: '500'
              }}>
                電話番号
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: isEditing ? '#111827' : '#374151',
                  border: isEditing ? '1px solid #4b5563' : '1px solid transparent',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            {/* Birth Date & Gender Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  display: 'block',
                  fontWeight: '500'
                }}>
                  生年月日
                </label>
                <input
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: isEditing ? '#111827' : '#374151',
                    border: isEditing ? '1px solid #4b5563' : '1px solid transparent',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  fontSize: '13px',
                  color: '#9ca3af',
                  marginBottom: '6px',
                  display: 'block',
                  fontWeight: '500'
                }}>
                  性別
                </label>
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: isEditing ? '#111827' : '#374151',
                    border: isEditing ? '1px solid #4b5563' : '1px solid transparent',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    cursor: isEditing ? 'pointer' : 'default'
                  }}
                >
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                  <option value="other">その他</option>
                  <option value="prefer_not">回答しない</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={{
                fontSize: '13px',
                color: '#9ca3af',
                marginBottom: '6px',
                display: 'block',
                fontWeight: '500'
              }}>
                居住地
              </label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: isEditing ? '#111827' : '#374151',
                  border: isEditing ? '1px solid #4b5563' : '1px solid transparent',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            {/* Bio */}
            <div>
              <label style={{
                fontSize: '13px',
                color: '#9ca3af',
                marginBottom: '6px',
                display: 'block',
                fontWeight: '500'
              }}>
                自己紹介
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                disabled={!isEditing}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: isEditing ? '#111827' : '#374151',
                  border: isEditing ? '1px solid #4b5563' : '1px solid transparent',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}
              />
            </div>
          </div>
        </div>

        {/* Health Goals */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #374151'
          }}>
            健康目標
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'ストレス軽減', progress: 75 },
              { label: '睡眠改善', progress: 60 },
              { label: '運動習慣', progress: 40 },
              { label: 'マインドフルネス', progress: 85 }
            ].map((goal) => (
              <div key={goal.label}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#f3f4f6',
                    fontWeight: '500'
                  }}>
                    {goal.label}
                  </span>
                  <span style={{
                    fontSize: '13px',
                    color: '#a3e635',
                    fontWeight: '600'
                  }}>
                    {goal.progress}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#374151',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${goal.progress}%`,
                    backgroundColor: '#a3e635',
                    borderRadius: '3px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stats */}
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '20px'
          }}>
            アクティビティ統計
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div style={{
              backgroundColor: '#111827',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#a3e635',
                marginBottom: '4px'
              }}>
                45
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                総セッション数
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#111827',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#60a5fa',
                marginBottom: '4px'
              }}>
                15
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                連続記録
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#111827',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#fbbf24',
                marginBottom: '4px'
              }}>
                Lv.8
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                現在レベル
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#111827',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#a78bfa',
                marginBottom: '4px'
              }}>
                12
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                獲得バッジ
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button
            onClick={() => router.push('/privacy-settings')}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#374151',
              color: '#d1d5db',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
          >
            <span>プライバシー設定</span>
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
          
          <button
            onClick={() => router.push('/export')}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#374151',
              color: '#d1d5db',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4b5563' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#374151' }}
          >
            <span>データエクスポート</span>
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
          
          <button
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = '#ef4444'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#ef4444'
            }}
          >
            アカウントを削除
          </button>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}