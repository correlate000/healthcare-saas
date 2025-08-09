'use client'

import { useState } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  HappyFaceIcon, 
  SadFaceIcon, 
  HeartHandsIcon, 
  MeditationIcon, 
  SleepingIcon, 
  StressedIcon, 
  CalmIcon, 
  EnergeticIcon, 
  ThinkingIcon 
} from '@/components/icons/illustrations'
import {
  ChartIcon,
  UsersIcon,
  MailIcon,
  LockIcon,
  SaveIcon,
  TrashIcon,
  FileIcon,
  WarningIcon,
  HeartIcon,
  PhoneIcon,
  MessageIcon,
  BellIcon,
  TrophyIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@/components/icons'

export default function DemoIconsPage() {
  const [selectedSize, setSelectedSize] = useState(64)
  const [primaryColor, setPrimaryColor] = useState('#a3e635')
  
  const illustrationIcons = [
    { name: 'HappyFaceIcon', component: HappyFaceIcon, label: '幸せ' },
    { name: 'SadFaceIcon', component: SadFaceIcon, label: '悲しい' },
    { name: 'HeartHandsIcon', component: HeartHandsIcon, label: '愛情' },
    { name: 'MeditationIcon', component: MeditationIcon, label: '瞑想' },
    { name: 'SleepingIcon', component: SleepingIcon, label: '睡眠' },
    { name: 'StressedIcon', component: StressedIcon, label: 'ストレス' },
    { name: 'CalmIcon', component: CalmIcon, label: '穏やか' },
    { name: 'EnergeticIcon', component: EnergeticIcon, label: '元気' },
    { name: 'ThinkingIcon', component: ThinkingIcon, label: '考え中' }
  ]
  
  const simpleIcons = [
    { name: 'ChartIcon', component: ChartIcon, label: 'チャート' },
    { name: 'UsersIcon', component: UsersIcon, label: 'ユーザー' },
    { name: 'MailIcon', component: MailIcon, label: 'メール' },
    { name: 'LockIcon', component: LockIcon, label: 'ロック' },
    { name: 'SaveIcon', component: SaveIcon, label: '保存' },
    { name: 'TrashIcon', component: TrashIcon, label: 'ゴミ箱' },
    { name: 'FileIcon', component: FileIcon, label: 'ファイル' },
    { name: 'WarningIcon', component: WarningIcon, label: '警告' },
    { name: 'HeartIcon', component: HeartIcon, label: 'ハート' },
    { name: 'PhoneIcon', component: PhoneIcon, label: '電話' },
    { name: 'MessageIcon', component: MessageIcon, label: 'メッセージ' },
    { name: 'BellIcon', component: BellIcon, label: 'ベル' },
    { name: 'TrophyIcon', component: TrophyIcon, label: 'トロフィー' },
    { name: 'CalendarIcon', component: CalendarIcon, label: 'カレンダー' },
    { name: 'ClockIcon', component: ClockIcon, label: '時計' },
    { name: 'CheckCircleIcon', component: CheckCircleIcon, label: 'チェック' }
  ]

  const colors = [
    '#a3e635', // lime
    '#60a5fa', // blue
    '#fbbf24', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#10b981', // emerald
    '#f59e0b', // orange
    '#ec4899', // pink
  ]

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
        background: 'rgba(31, 41, 55, 0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          アイコンギャラリー
        </h1>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px', margin: '8px 0 0 0' }}>
          SVGアイコンコンポーネント一覧
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Controls */}
        <div style={{
          background: 'rgba(31, 41, 55, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid rgba(55, 65, 81, 0.3)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>
              サイズ: {selectedSize}px
            </label>
            <input
              type="range"
              min="24"
              max="120"
              value={selectedSize}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                background: 'linear-gradient(to right, #a3e635 0%, #84cc16 100%)',
                borderRadius: '3px',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '14px', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>
              カラー選択
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: color,
                    border: primaryColor === color ? '3px solid white' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Illustration Icons */}
        <div style={{
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#f3f4f6',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#a3e635' }}>✨</span>
            リッチなイラストアイコン
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '16px'
          }}>
            {illustrationIcons.map(({ name, component: Icon, label }) => (
              <div
                key={name}
                style={{
                  background: 'rgba(31, 41, 55, 0.6)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(55, 65, 81, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
                  e.currentTarget.style.borderColor = 'rgba(163, 230, 53, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.3)'
                }}
              >
                <Icon size={selectedSize} primaryColor={primaryColor} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#a3e635', fontWeight: '600' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px', fontFamily: 'monospace' }}>
                    {name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Icons */}
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#f3f4f6',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#60a5fa' }}>📐</span>
            シンプルなアイコン
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '12px'
          }}>
            {simpleIcons.map(({ name, component: Icon, label }) => (
              <div
                key={name}
                style={{
                  background: 'rgba(31, 41, 55, 0.6)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(55, 65, 81, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.3)'
                }}
              >
                <Icon size={Math.min(selectedSize * 0.6, 32)} color={primaryColor} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: '500' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '1px', fontFamily: 'monospace' }}>
                    {name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Example */}
        <div style={{
          marginTop: '32px',
          background: 'rgba(31, 41, 55, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(55, 65, 81, 0.3)'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '12px'
          }}>
            使用例
          </h3>
          <pre style={{
            background: 'rgba(17, 24, 39, 0.8)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#a3e635',
            overflowX: 'auto',
            fontFamily: 'monospace'
          }}>
{`import { HappyFaceIcon } from '@/components/icons/illustrations'
import { ChartIcon } from '@/components/icons'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

// イラストアイコン
<HappyFaceIcon size={64} primaryColor="#a3e635" />

// シンプルアイコン
<ChartIcon size={24} color="#60a5fa" />`}
          </pre>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}