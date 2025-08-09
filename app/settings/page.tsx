'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { BellIcon, WarningIcon, LockIcon, FileIcon, CalendarIcon, TrophyIcon, MessageIcon, ChartIcon } from '@/components/icons'
import { MobileIcon, FireIcon, StarIcon, TeamIcon, NoteIcon, HeartHandsIcon, MoonIcon, EnergyIcon, ClockIcon, DataExportIcon, DeleteAccountIcon } from '@/components/icons/illustrations'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [notifications, setNotifications] = useState({
    checkinReminder: true,
    weeklyReport: true,
    encouragement: true,
    marketing: false,
    achievements: true,
    teamUpdates: true
  })
  const [reminderTimes, setReminderTimes] = useState({
    morning: '09:00',
    evening: '21:00'
  })
  const [language, setLanguage] = useState('ja')
  const [dataSharing, setDataSharing] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const Toggle = ({ checked, onChange, size = 'medium' }: { checked: boolean; onChange: () => void; size?: 'small' | 'medium' | 'large' }) => {
    const dimensions = {
      small: { width: 40, height: 24, ball: 20 },
      medium: { width: 48, height: 28, ball: 24 },
      large: { width: 56, height: 32, ball: 28 }
    }
    const dim = dimensions[size]
    
    return (
      <button
        onClick={onChange}
        style={{
          width: `${dim.width}px`,
          height: `${dim.height}px`,
          background: checked 
            ? 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)' 
            : 'rgba(75, 85, 99, 0.6)',
          borderRadius: `${dim.height / 2}px`,
          position: 'relative',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: checked ? '0 2px 8px rgba(163, 230, 53, 0.3)' : 'none'
        }}
      >
        <div style={{
          width: `${dim.ball}px`,
          height: `${dim.ball}px`,
          backgroundColor: 'white',
          borderRadius: '50%',
          position: 'absolute',
          top: `${(dim.height - dim.ball) / 2}px`,
          left: checked ? `${dim.width - dim.ball - 2}px` : '2px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}></div>
      </button>
    )
  }

  const userStats = {
    name: 'ユーザー名',
    email: 'user@example.com',
    joinDate: '2025年6月',
    sessions: 45,
    streak: 15,
    level: 8,
    currentXP: 850,
    maxXP: 1000,
    badges: 12,
    friendsCount: 23,
    totalTime: '21時間'
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
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
          ...typographyPresets.pageTitle(), 
          fontWeight: '800', 
          background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0 
        }}>
          設定
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Profile Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px', 
          padding: '24px',
          marginBottom: '28px',
          border: '1px solid rgba(163, 230, 53, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(163, 230, 53, 0.2) 0%, transparent 70%)',
            borderRadius: '50%'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: '0 8px 24px rgba(163, 230, 53, 0.3)',
                border: '3px solid rgba(255, 255, 255, 0.1)'
              }}>
                👤
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  ...getTypographyStyles('h3'), 
                  fontWeight: '700', 
                  color: '#f3f4f6', 
                  margin: '0 0 6px 0' 
                }}>
                  {userStats.name}
                </h3>
                <p style={{ 
                  ...getTypographyStyles('base'), 
                  color: '#9ca3af', 
                  margin: '0 0 4px 0' 
                }}>
                  {userStats.email}
                </p>
                <p style={{ 
                  ...getTypographyStyles('small'), 
                  color: '#6b7280', 
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap'
                }}>
                  📅 {userStats.joinDate}から利用開始
                </p>
              </div>
              <button
                onClick={() => router.push('/profile')}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(163, 230, 53, 0.2)',
                  border: '1px solid rgba(163, 230, 53, 0.3)',
                  borderRadius: '12px',
                  color: '#a3e635',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(163, 230, 53, 0.3)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(163, 230, 53, 0.2)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                ✏️
              </button>
            </div>
            
            {/* Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              {[
                { label: 'セッション', value: userStats.sessions, icon: <MobileIcon size={20} primaryColor="#60a5fa" /> },
                { label: '連続記録', value: `${userStats.streak}日`, icon: <FireIcon size={20} primaryColor="#ef4444" /> },
                { label: 'レベル', value: `Lv.${userStats.level}`, icon: <StarIcon size={20} color="#fbbf24" /> }
              ].map((stat) => (
                <div key={stat.label} style={{
                  backgroundColor: 'rgba(31, 41, 55, 0.6)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(55, 65, 81, 0.3)'
                }}>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '700', 
                    background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '4px',
                    wordBreak: 'keep-all' 
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Level Progress */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '8px' 
              }}>
                <span style={{ fontSize: '13px', color: '#9ca3af', whiteSpace: 'nowrap' }}>次のレベルまで</span>
                <span style={{ 
                  fontSize: '13px', 
                  color: '#a3e635',
                  fontWeight: '600',
                  whiteSpace: 'nowrap' 
                }}>
                  {userStats.currentXP} / {userStats.maxXP} XP
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(55, 65, 81, 0.6)',
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(userStats.currentXP / userStats.maxXP) * 100}%`,
                  background: 'linear-gradient(90deg, #a3e635 0%, #84cc16 100%)',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease',
                  boxShadow: '0 0 10px rgba(163, 230, 53, 0.4)'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px', 
          marginBottom: '28px' 
        }}>
          {[
            { icon: '🏆', label: 'バッジ', count: userStats.badges, path: '/achievements' },
            { icon: <TeamIcon size={24} primaryColor="#8b5cf6" />, label: '友達', count: userStats.friendsCount, path: '/team-connect' },
            { icon: <ChartIcon size={24} color="#10b981" />, label: '分析', count: userStats.totalTime, path: '/analytics' },
            { icon: <EnergyIcon size={24} primaryColor="#f59e0b" />, label: 'キャラクター設定', count: '6体', path: '/characters' }
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.path)}
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(163, 230, 53, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(163, 230, 53, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>{typeof action.icon === 'string' ? <span style={{ fontSize: '24px' }}>{action.icon}</span> : action.icon}</div>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>{action.label}</span>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                color: '#a3e635' 
              }}>
                {action.count}
              </span>
            </button>
          ))}
        </div>

        {/* Settings Sections */}
        {/* Notifications */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setActiveSection(activeSection === 'notifications' ? null : 'notifications')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderRadius: activeSection === 'notifications' ? '16px 16px 0 0' : '16px',
              color: '#f3f4f6',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BellIcon size={20} color="#fbbf24" />
              通知設定
            </div>
            <span style={{
              color: '#9ca3af',
              transform: activeSection === 'notifications' ? 'rotate(90deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease'
            }}>›</span>
          </button>
          
          {activeSection === 'notifications' && (
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              padding: '20px',
              animation: 'slideDown 0.3s ease'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { key: 'checkinReminder', label: 'チェックインリマインダー', desc: '毎日の健康チェック', icon: <NoteIcon size={20} /> },
                  { key: 'weeklyReport', label: '週次レポート', desc: '週間の振り返りと分析', icon: <ChartIcon size={20} color="#10b981" /> },
                  { key: 'encouragement', label: '励ましメッセージ', desc: 'キャラクターからの応援', icon: <HeartHandsIcon size={20} /> },
                  { key: 'achievements', label: '実績通知', desc: 'バッジやレベルアップ', icon: <TrophyIcon size={20} color="#fbbf24" /> },
                  { key: 'teamUpdates', label: 'チーム更新', desc: 'チームメンバーの活動', icon: <TeamIcon size={20} primaryColor="#8b5cf6" /> },
                  { key: 'marketing', label: 'お知らせ', desc: '新機能やアップデート', icon: <BellIcon size={20} color="#ef4444" /> }
                ].map((item) => (
                  <div key={item.key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: 'rgba(31, 41, 55, 0.4)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      {item.icon}
                      <div>
                        <div style={{ fontSize: '14px', color: '#f3f4f6', marginBottom: '2px' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <Toggle
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={() => toggleNotification(item.key as keyof typeof notifications)}
                      size="small"
                    />
                  </div>
                ))}
              </div>

              {/* Reminder Times */}
              {notifications.checkinReminder && (
                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  backgroundColor: 'rgba(163, 230, 53, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(163, 230, 53, 0.2)'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#a3e635',
                    marginBottom: '12px'
                  }}>
                    リマインダー時刻
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                        朝のリマインダー
                      </label>
                      <input
                        type="time"
                        value={reminderTimes.morning}
                        onChange={(e) => setReminderTimes({ ...reminderTimes, morning: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: 'rgba(55, 65, 81, 0.6)',
                          border: '1px solid rgba(55, 65, 81, 0.5)',
                          borderRadius: '8px',
                          color: '#f3f4f6',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                        夜のリマインダー
                      </label>
                      <input
                        type="time"
                        value={reminderTimes.evening}
                        onChange={(e) => setReminderTimes({ ...reminderTimes, evening: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: 'rgba(55, 65, 81, 0.6)',
                          border: '1px solid rgba(55, 65, 81, 0.5)',
                          borderRadius: '8px',
                          color: '#f3f4f6',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Language */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setActiveSection(activeSection === 'language' ? null : 'language')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderRadius: activeSection === 'language' ? '16px 16px 0 0' : '16px',
              color: '#f3f4f6',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ChartIcon size={20} color="#a3e635" />
              言語設定
            </div>
            <span style={{
              color: '#9ca3af',
              transform: activeSection === 'language' ? 'rotate(90deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease'
            }}>›</span>
          </button>
          
          {activeSection === 'language' && (
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              padding: '20px',
              animation: 'slideDown 0.3s ease'
            }}>
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f3f4f6',
                  marginBottom: '12px'
                }}>
                  表示言語
                </h4>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'rgba(55, 65, 81, 0.6)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ja">日本語</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Privacy & Security */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setActiveSection(activeSection === 'privacy' ? null : 'privacy')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderRadius: activeSection === 'privacy' ? '16px 16px 0 0' : '16px',
              color: '#f3f4f6',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LockIcon size={20} color="#ef4444" />
              プライバシーとセキュリティ
            </div>
            <span style={{
              color: '#9ca3af',
              transform: activeSection === 'privacy' ? 'rotate(90deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease'
            }}>›</span>
          </button>
          
          {activeSection === 'privacy' && (
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
              padding: '20px',
              animation: 'slideDown 0.3s ease'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'rgba(31, 41, 55, 0.4)',
                  borderRadius: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#f3f4f6', marginBottom: '2px' }}>
                      データ共有
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      匿名データの品質向上への利用
                    </div>
                  </div>
                  <Toggle
                    checked={dataSharing}
                    onChange={() => setDataSharing(!dataSharing)}
                    size="small"
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'rgba(31, 41, 55, 0.4)',
                  borderRadius: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#f3f4f6', marginBottom: '2px' }}>
                      自動バックアップ
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      クラウドへの自動保存
                    </div>
                  </div>
                  <Toggle
                    checked={autoBackup}
                    onChange={() => setAutoBackup(!autoBackup)}
                    size="small"
                  />
                </div>

                <button
                  onClick={() => router.push('/export')}
                  style={{
                    padding: '14px',
                    backgroundColor: 'rgba(55, 65, 81, 0.6)',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRadius: '12px',
                    color: '#d1d5db',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.5)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DataExportIcon size={20} />
                    データエクスポート
                  </div>
                  <span style={{ color: '#9ca3af' }}>›</span>
                </button>

                <button
                  style={{
                    padding: '14px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '12px',
                    color: '#ef4444',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DeleteAccountIcon size={20} />
                    アカウント削除
                  </div>
                  <span style={{ color: '#ef4444' }}>›</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Support Links */}
        <div style={{
          background: 'rgba(31, 41, 55, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          {[
            { icon: <MessageIcon size={18} color="#60a5fa" />, label: 'ヘルプ・FAQ', path: '/help' },
            { icon: <FileIcon size={18} color="#8b5cf6" />, label: 'お問い合わせ', path: '/help#contact' },
            { icon: <TrophyIcon size={18} color="#fbbf24" />, label: 'アプリを評価', action: 'rate' },
            { icon: <WarningIcon size={18} color="#ef4444" />, label: 'ログアウト', action: 'logout', danger: true }
          ].map((item, index) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.path) {
                  router.push(item.path)
                } else if (item.action === 'logout') {
                  // Handle logout
                  console.log('Logout')
                } else if (item.action === 'rate') {
                  // Handle rating
                  console.log('Rate app')
                }
              }}
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: index < 3 ? '1px solid rgba(55, 65, 81, 0.3)' : 'none',
                color: item.danger ? '#ef4444' : '#d1d5db',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.icon}
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
              </div>
              <span style={{ color: item.danger ? '#ef4444' : '#9ca3af' }}>›</span>
            </button>
          ))}
        </div>

        {/* App Info */}
        <div style={{
          textAlign: 'center',
          padding: '24px',
          color: '#6b7280'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '16px',
            fontSize: '12px'
          }}>
            <span>バージョン 1.0.0</span>
            <span>•</span>
            <span>ビルド 20250807</span>
          </div>
          <p style={{ fontSize: '11px', margin: 0 }}>
            © 2025 Healthcare SaaS. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '16px'
          }}>
            <a href="#" style={{ color: '#9ca3af', fontSize: '11px', textDecoration: 'none' }}>利用規約</a>
            <a href="#" style={{ color: '#9ca3af', fontSize: '11px', textDecoration: 'none' }}>プライバシーポリシー</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}