'use client'

import { useState } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    checkinReminder: true,
    weeklyReport: true,
    encouragement: true,
    marketing: false
  })

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      style={{
        width: '48px',
        height: '28px',
        backgroundColor: checked ? '#a3e635' : '#4b5563',
        borderRadius: '14px',
        position: 'relative',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        backgroundColor: 'white',
        borderRadius: '50%',
        position: 'absolute',
        top: '2px',
        left: checked ? '22px' : '2px',
        transition: 'all 0.2s ease'
      }}></div>
    </button>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #374151' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>
          設定
        </h1>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Profile section */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#a3e635',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>
                ユーザー
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', margin: '0 0 4px 0' }}>
                ユーザー名
              </h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 4px 0' }}>
                xxx@gmail.com
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                2025年6月から利用開始
              </p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#a3e635', marginBottom: '4px' }}>45</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>セッション</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#a3e635', marginBottom: '4px' }}>15</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>連続記録</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#a3e635', marginBottom: '4px' }}>lv.8</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>レベル</div>
            </div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>次のレベルまで</span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>850 / 1000 XP</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#374151',
              borderRadius: '4px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                height: '100%',
                width: '85%',
                backgroundColor: '#a3e635',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        </div>

        {/* Account settings */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            アカウント
          </h2>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px' }}>
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #374151',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>👤</span>
                <span>プロフィール編集</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #374151',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🤖</span>
                <span>AIキャラクター設定</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🏆</span>
                <span>レベル・バッジ</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
          </div>
        </div>

        {/* App settings */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            設定
          </h2>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px' }}>
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #374151',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🔔</span>
                <span>通知設定</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #374151',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🌐</span>
                <span>言語設定</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>📱</span>
                <span>デバイス設定</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
          </div>
        </div>

        {/* Notification settings */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            通知設定
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#f3f4f6', marginBottom: '4px' }}>
                  チェックインリマインダー
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  毎日決まった時間にリマインダーを送信
                </div>
              </div>
              <Toggle
                checked={notifications.checkinReminder}
                onChange={() => toggleNotification('checkinReminder')}
              />
            </div>

            {notifications.checkinReminder && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>朝のリマインダー</div>
                  <div style={{ 
                    backgroundColor: '#374151', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    textAlign: 'center',
                    color: '#f3f4f6',
                    fontSize: '14px'
                  }}>
                    9:00
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>夜のリマインダー</div>
                  <div style={{ 
                    backgroundColor: '#374151', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    textAlign: 'center',
                    color: '#f3f4f6',
                    fontSize: '14px'
                  }}>
                    21:00
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#f3f4f6', marginBottom: '4px' }}>
                  週次レポート
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  週の振り返りレポート
                </div>
              </div>
              <Toggle
                checked={notifications.weeklyReport}
                onChange={() => toggleNotification('weeklyReport')}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#f3f4f6', marginBottom: '4px' }}>
                  励ましメッセージ
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  AIからの応援メッセージ
                </div>
              </div>
              <Toggle
                checked={notifications.encouragement}
                onChange={() => toggleNotification('encouragement')}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#f3f4f6', marginBottom: '4px' }}>
                  マーケティング情報
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  新しいサービスやお知らせ
                </div>
              </div>
              <Toggle
                checked={notifications.marketing}
                onChange={() => toggleNotification('marketing')}
              />
            </div>
          </div>
        </div>

        {/* Data & Account Management */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            データ・アカウント管理
          </h2>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px' }}>
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #374151',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>💾</span>
                <span>データCSVエクスポート</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #374151',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🔒</span>
                <span>プライバシー設定</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ef4444',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🗑️</span>
                <span>アカウント削除</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
          </div>
        </div>

        {/* Support & Help */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            サポート・ヘルプ
          </h2>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '12px' }}>
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #374151',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>❓</span>
                <span>ヘルプ・FAQ</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #374151',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🚪</span>
                <span>ログアウト</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
            
            <button style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#d1d5db',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>⭐</span>
                <span>アプリを評価</span>
              </div>
              <span style={{ color: '#9ca3af' }}>›</span>
            </button>
          </div>
        </div>

        {/* App info */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>
            アプリ情報
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>バージョン</span>
              <span style={{ color: '#f3f4f6', fontSize: '14px' }}>1.0.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>ビルド</span>
              <span style={{ color: '#f3f4f6', fontSize: '14px' }}>20250806</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>最終更新</span>
              <span style={{ color: '#f3f4f6', fontSize: '14px' }}>2025年8月6日</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
            © 2025 Healthcare SaaS. All rights reserved.
          </p>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}