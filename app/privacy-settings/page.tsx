'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { ChartIcon, UsersIcon, MailIcon, LockIcon, SaveIcon, TrashIcon, FileIcon } from '@/components/icons'
import { getTypographyStyles, typographyPresets } from '@/styles/typography'

export default function PrivacySettingsPage() {
  const router = useRouter()
  
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: {
      analytics: true,
      personalizedAds: false,
      improvementProgram: true,
      crashReports: true
    },
    dataSharing: {
      profileVisibility: 'friends',
      activitySharing: true,
      achievementSharing: true,
      moodSharing: false
    },
    notifications: {
      marketingEmails: false,
      productUpdates: true,
      researchInvitations: false,
      communityDigest: true
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      biometricAuth: true,
      autoLogout: '30'
    }
  })

  const handleToggle = (category: string, setting: string) => {
    setPrivacySettings(prev => {
      const categoryData = prev[category as keyof typeof prev] as any
      return {
        ...prev,
        [category]: {
          ...categoryData,
          [setting]: !categoryData[setting]
        }
      }
    })
  }

  const handleSelectChange = (category: string, setting: string, value: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }))
  }

  const privacySections = [
    {
      id: 'dataCollection',
      title: 'データ収集',
      icon: <ChartIcon size={24} color="#60a5fa" />,
      description: 'アプリがどのようにデータを収集するか管理',
      settings: [
        {
          id: 'analytics',
          label: '使用状況分析',
          description: 'アプリの改善のための匿名データ収集',
          type: 'toggle'
        },
        {
          id: 'personalizedAds',
          label: 'パーソナライズ広告',
          description: '興味に基づいた広告の表示',
          type: 'toggle'
        },
        {
          id: 'improvementProgram',
          label: '品質向上プログラム',
          description: 'サービス改善のためのフィードバック収集',
          type: 'toggle'
        },
        {
          id: 'crashReports',
          label: 'クラッシュレポート',
          description: 'エラー情報の自動送信',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'dataSharing',
      title: 'データ共有',
      icon: <UsersIcon size={24} color="#a3e635" />,
      description: '他のユーザーと共有する情報を選択',
      settings: [
        {
          id: 'profileVisibility',
          label: 'プロフィール公開範囲',
          description: 'プロフィールを見ることができる人',
          type: 'select',
          options: [
            { value: 'public', label: '全員' },
            { value: 'friends', label: '友達のみ' },
            { value: 'private', label: '非公開' }
          ]
        },
        {
          id: 'activitySharing',
          label: 'アクティビティ共有',
          description: '日々の活動を友達と共有',
          type: 'toggle'
        },
        {
          id: 'achievementSharing',
          label: '実績の共有',
          description: '獲得したバッジや実績を表示',
          type: 'toggle'
        },
        {
          id: 'moodSharing',
          label: '気分データの共有',
          description: '気分チェックインを友達と共有',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'notifications',
      title: '通知とメール',
      icon: <MailIcon size={24} color="#fbbf24" />,
      description: '受け取る通知とメールの種類を管理',
      settings: [
        {
          id: 'marketingEmails',
          label: 'マーケティングメール',
          description: 'プロモーションや特典のお知らせ',
          type: 'toggle'
        },
        {
          id: 'productUpdates',
          label: '製品アップデート',
          description: '新機能やアップデートのお知らせ',
          type: 'toggle'
        },
        {
          id: 'researchInvitations',
          label: '研究への招待',
          description: 'メンタルヘルス研究への参加案内',
          type: 'toggle'
        },
        {
          id: 'communityDigest',
          label: 'コミュニティダイジェスト',
          description: '週間コミュニティハイライト',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'security',
      title: 'セキュリティ',
      icon: <LockIcon size={24} color="#ef4444" />,
      description: 'アカウントのセキュリティ設定',
      settings: [
        {
          id: 'twoFactorAuth',
          label: '2段階認証',
          description: 'ログイン時の追加セキュリティ',
          type: 'toggle'
        },
        {
          id: 'loginAlerts',
          label: 'ログインアラート',
          description: '新しいデバイスからのログイン通知',
          type: 'toggle'
        },
        {
          id: 'biometricAuth',
          label: '生体認証',
          description: '指紋/顔認証でのログイン',
          type: 'toggle'
        },
        {
          id: 'autoLogout',
          label: '自動ログアウト',
          description: '非アクティブ時の自動ログアウト',
          type: 'select',
          options: [
            { value: '15', label: '15分' },
            { value: '30', label: '30分' },
            { value: '60', label: '1時間' },
            { value: 'never', label: 'なし' }
          ]
        }
      ]
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: '140px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(31, 41, 55, 0.4)'
      }}>
        <h1 style={{
          ...getTypographyStyles('h2'),
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          プライバシー設定
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Privacy Score Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid rgba(96, 165, 250, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div>
                <h3 style={{
                  ...getTypographyStyles('large'),
                  fontWeight: '600',
                  color: '#f3f4f6',
                  marginBottom: '4px'
                }}>
                  プライバシースコア
                </h3>
                <p style={{
                  ...getTypographyStyles('small'),
                  color: '#9ca3af'
                }}>
                  現在のプライバシー保護レベル
                </p>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...getTypographyStyles('h3'),
                fontWeight: '700',
                color: 'white',
                boxShadow: '0 8px 24px rgba(96, 165, 250, 0.3)'
              }}>
                85%
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              {['高セキュリティ', 'データ最小化', '透明性'].map((label, index) => (
                <div
                  key={label}
                  style={{
                    padding: '8px',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    ...getTypographyStyles('caption'),
                    color: '#60a5fa',
                    fontWeight: '500'
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Sections */}
        {privacySections.map((section) => (
          <div
            key={section.id}
            style={{
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(55, 65, 81, 0.3)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {section.icon}
              </div>
              <div>
                <h3 style={{
                  ...getTypographyStyles('large'),
                  fontWeight: '600',
                  color: '#f3f4f6',
                  marginBottom: '2px'
                }}>
                  {section.title}
                </h3>
                <p style={{
                  ...getTypographyStyles('small'),
                  color: '#9ca3af',
                  margin: 0
                }}>
                  {section.description}
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {section.settings.map((setting) => (
                <div
                  key={setting.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: 'rgba(55, 65, 81, 0.3)',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ flex: 1, marginRight: '12px' }}>
                    <div style={{
                      ...getTypographyStyles('base'),
                      fontWeight: '500',
                      color: '#f3f4f6',
                      marginBottom: '2px'
                    }}>
                      {setting.label}
                    </div>
                    <div style={{
                      ...getTypographyStyles('small'),
                      color: '#9ca3af'
                    }}>
                      {setting.description}
                    </div>
                  </div>
                  
                  {setting.type === 'toggle' ? (
                    <button
                      onClick={() => handleToggle(section.id, setting.id)}
                      style={{
                        width: '48px',
                        height: '26px',
                        backgroundColor: (privacySettings[section.id as keyof typeof privacySettings] as any)[setting.id]
                          ? '#a3e635'
                          : 'rgba(75, 85, 99, 0.6)',
                        borderRadius: '13px',
                        border: 'none',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '3px',
                        left: (privacySettings[section.id as keyof typeof privacySettings] as any)[setting.id]
                          ? '25px'
                          : '3px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'left 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}></div>
                    </button>
                  ) : (
                    <select
                      value={(privacySettings[section.id as keyof typeof privacySettings] as any)[setting.id] as string}
                      onChange={(e) => handleSelectChange(section.id, setting.id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(55, 65, 81, 0.6)',
                        border: '1px solid rgba(55, 65, 81, 0.5)',
                        borderRadius: '8px',
                        color: '#f3f4f6',
                        ...getTypographyStyles('label'),
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {setting.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => router.push('/export')}
            style={{
              padding: '14px',
              backgroundColor: 'rgba(96, 165, 250, 0.2)',
              color: '#60a5fa',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              borderRadius: '12px',
              ...getTypographyStyles('button'),
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <SaveIcon size={20} color="#60a5fa" />
            データをエクスポート
          </button>
          
          <button
            style={{
              padding: '14px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              ...getTypographyStyles('button'),
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <TrashIcon size={20} color="#ef4444" />
            データを削除
          </button>
        </div>

        {/* Privacy Policy Link */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'rgba(55, 65, 81, 0.3)',
          borderRadius: '12px',
          borderLeft: '3px solid #a3e635'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <FileIcon size={20} color="#a3e635" />
            <div>
              <h4 style={{
                ...getTypographyStyles('label'),
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '4px'
              }}>
                プライバシーポリシー
              </h4>
              <p style={{
                ...getTypographyStyles('small'),
                color: '#9ca3af',
                lineHeight: '1.5',
                margin: '0 0 8px 0'
              }}>
                私たちがどのようにあなたのデータを保護し、使用するかについて詳しく説明しています。
              </p>
              <button
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(163, 230, 53, 0.2)',
                  color: '#a3e635',
                  border: '1px solid rgba(163, 230, 53, 0.3)',
                  borderRadius: '6px',
                  ...getTypographyStyles('small'),
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ポリシーを読む
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}