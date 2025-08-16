'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { DatabaseIcon, MoodHappyIcon, ChartIcon, ChatIcon, TrophySimpleIcon, UserIcon, LockIcon, CodeIcon, DocumentIcon, TargetIcon } from '@/components/icons/illustrations'
import { getTypographyStyles, typographyPresets } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function ExportPage() {
  const router = useRouter()
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv' | 'pdf' | 'xlsx'>('json')
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(['mood', 'activities'])
  const [dateRange, setDateRange] = useState({
    from: '2025-07-01',
    to: '2025-08-08'
  })
  const [exportMode, setExportMode] = useState<'download' | 'cloud' | 'schedule'>('download')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const dataTypes = [
    { id: 'mood', label: '気分データ', icon: <MoodHappyIcon size={20} color="#a3e635" />, size: '2.3 MB' },
    { id: 'activities', label: 'アクティビティ', icon: <ChartIcon size={20} primaryColor="#60a5fa" />, size: '1.8 MB' },
    { id: 'chats', label: 'チャット履歴', icon: <ChatIcon size={20} primaryColor="#a78bfa" />, size: '3.5 MB' },
    { id: 'achievements', label: '実績・バッジ', icon: <TrophySimpleIcon size={20} color="#fbbf24" />, size: '0.5 MB' },
    { id: 'challenges', label: 'チャレンジ記録', icon: <TargetIcon size={20} primaryColor="#f59e0b" />, size: '1.2 MB' },
    { id: 'profile', label: 'プロフィール', icon: <UserIcon size={20} primaryColor="#6b7280" />, size: '0.1 MB' }
  ]

  const formats = [
    { id: 'json', label: 'JSON', description: '開発者向け', icon: <CodeIcon size={20} color="#60a5fa" />, features: ['完全なデータ構造', 'メタデータ含む'] },
    { id: 'csv', label: 'CSV', description: 'Excel対応', icon: <ChartIcon size={20} primaryColor="#10b981" />, features: ['表形式', 'グラフ作成可能'] },
    { id: 'pdf', label: 'PDF', description: '印刷用', icon: <DocumentIcon size={20} color="#ef4444" />, features: ['レポート形式', 'グラフ付き'] },
    { id: 'xlsx', label: 'Excel', description: '分析用', icon: <ChartIcon size={20} primaryColor="#22c55e" />, features: ['複数シート', 'ピボット対応'] }
  ]

  const toggleDataType = (typeId: string) => {
    if (selectedDataTypes.includes(typeId)) {
      setSelectedDataTypes(selectedDataTypes.filter(t => t !== typeId))
    } else {
      setSelectedDataTypes([...selectedDataTypes, typeId])
    }
  }

  const getTotalSize = () => {
    const total = selectedDataTypes.reduce((sum, typeId) => {
      const type = dataTypes.find(t => t.id === typeId)
      const size = parseFloat(type?.size.replace(' MB', '') || '0')
      return sum + size
    }, 0)
    return total.toFixed(1)
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          // Success notification
          setTimeout(() => {
            alert(`エクスポートが完了しました！\nフォーマット: ${selectedFormat.toUpperCase()}\nサイズ: ${getTotalSize()} MB`)
            setExportProgress(0)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
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
          ...getTypographyStyles('h2'),
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          データエクスポート
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Info Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid rgba(96, 165, 250, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <DatabaseIcon size={24} color="#60a5fa" />
            <h3 style={{
              ...getTypographyStyles('large'),
              fontWeight: '600',
              color: '#f3f4f6'
            }}>
              あなたのデータ
            </h3>
          </div>
          <p style={{
            ...getTypographyStyles('label'),
            color: '#9ca3af',
            lineHeight: '1.6'
          }}>
            すべての個人データをダウンロードできます。データはあなたのプライバシーを保護するため暗号化されています。
          </p>
        </div>

        {/* Date Range */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            ...getTypographyStyles('large'),
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '12px'
          }}>
            期間を選択
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            <div>
              <label style={{
                ...getTypographyStyles('small'),
                color: '#9ca3af',
                display: 'block',
                marginBottom: '6px'
              }}>
                開始日
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'rgba(55, 65, 81, 0.6)',
                  border: '1px solid rgba(55, 65, 81, 0.5)',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  ...getTypographyStyles('base'),
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                ...getTypographyStyles('small'),
                color: '#9ca3af',
                display: 'block',
                marginBottom: '6px'
              }}>
                終了日
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'rgba(55, 65, 81, 0.6)',
                  border: '1px solid rgba(55, 65, 81, 0.5)',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                  ...getTypographyStyles('base'),
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Data Types */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            ...getTypographyStyles('large'),
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '12px'
          }}>
            エクスポートするデータ
          </h3>
          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {dataTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => toggleDataType(type.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: selectedDataTypes.includes(type.id)
                    ? 'rgba(163, 230, 53, 0.1)'
                    : 'rgba(31, 41, 55, 0.6)',
                  border: selectedDataTypes.includes(type.id)
                    ? '2px solid rgba(163, 230, 53, 0.3)'
                    : '1px solid rgba(55, 65, 81, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}>{type.icon}</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      ...getTypographyStyles('base'),
                      fontWeight: '600',
                      color: selectedDataTypes.includes(type.id) ? '#f3f4f6' : '#d1d5db'
                    }}>
                      {type.label}
                    </div>
                    <div style={{
                      ...getTypographyStyles('small'),
                      color: '#9ca3af'
                    }}>
                      {type.size}
                    </div>
                  </div>
                </div>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: selectedDataTypes.includes(type.id)
                    ? '#a3e635'
                    : 'rgba(55, 65, 81, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedDataTypes.includes(type.id) && '✓'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Mode Selection */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            ...getTypographyStyles('large'),
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '12px'
          }}>
            エクスポート方法
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => setExportMode('download')}
              style={{
                padding: '12px',
                backgroundColor: exportMode === 'download' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(31, 41, 55, 0.6)',
                border: exportMode === 'download' ? '2px solid rgba(96, 165, 250, 0.3)' : '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>💾</span>
              <div style={{ ...getTypographyStyles('small'), fontWeight: '600', color: exportMode === 'download' ? '#60a5fa' : '#f3f4f6' }}>
                ダウンロード
              </div>
            </button>
            <button
              onClick={() => setExportMode('cloud')}
              style={{
                padding: '12px',
                backgroundColor: exportMode === 'cloud' ? 'rgba(167, 139, 250, 0.2)' : 'rgba(31, 41, 55, 0.6)',
                border: exportMode === 'cloud' ? '2px solid rgba(167, 139, 250, 0.3)' : '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>☁️</span>
              <div style={{ ...getTypographyStyles('small'), fontWeight: '600', color: exportMode === 'cloud' ? '#a78bfa' : '#f3f4f6' }}>
                クラウド保存
              </div>
            </button>
            <button
              onClick={() => setExportMode('schedule')}
              style={{
                padding: '12px',
                backgroundColor: exportMode === 'schedule' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(31, 41, 55, 0.6)',
                border: exportMode === 'schedule' ? '2px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>⏰</span>
              <div style={{ ...getTypographyStyles('small'), fontWeight: '600', color: exportMode === 'schedule' ? '#fbbf24' : '#f3f4f6' }}>
                定期バックアップ
              </div>
            </button>
          </div>
        </div>

        {/* Format Selection */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            ...getTypographyStyles('large'),
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '12px'
          }}>
            フォーマット
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id as any)}
                style={{
                  padding: '16px',
                  backgroundColor: selectedFormat === format.id
                    ? 'rgba(163, 230, 53, 0.2)'
                    : 'rgba(31, 41, 55, 0.6)',
                  border: selectedFormat === format.id
                    ? '2px solid rgba(163, 230, 53, 0.3)'
                    : '1px solid rgba(55, 65, 81, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20px' }}>{format.icon}</div>
                  <div>
                    <div style={{
                      ...getTypographyStyles('label'),
                      fontWeight: '600',
                      color: selectedFormat === format.id ? '#a3e635' : '#f3f4f6'
                    }}>
                      {format.label}
                    </div>
                    <div style={{
                      ...getTypographyStyles('caption'),
                      color: '#9ca3af'
                    }}>
                      {format.description}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {format.features.map((feature, idx) => (
                    <span key={idx} style={{
                      ...getTypographyStyles('caption'),
                      backgroundColor: 'rgba(55, 65, 81, 0.4)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: '#9ca3af'
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{
          background: 'rgba(31, 41, 55, 0.6)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid rgba(55, 65, 81, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <span style={{
              ...getTypographyStyles('base'),
              color: '#9ca3af'
            }}>
              選択したデータ
            </span>
            <span style={{
              ...getTypographyStyles('base'),
              fontWeight: '600',
              color: '#f3f4f6'
            }}>
              {selectedDataTypes.length}種類
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              ...getTypographyStyles('base'),
              color: '#9ca3af'
            }}>
              推定サイズ
            </span>
            <span style={{
              ...getTypographyStyles('h4'),
              fontWeight: '700',
              color: '#a3e635'
            }}>
              {getTotalSize()} MB
            </span>
          </div>
        </div>

        {/* Export Button with Progress */}
        {isExporting && (
          <div style={{
            marginBottom: '16px',
            backgroundColor: 'rgba(31, 41, 55, 0.6)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{ ...getTypographyStyles('small'), color: '#9ca3af' }}>
                エクスポート中...
              </span>
              <span style={{ ...getTypographyStyles('small'), fontWeight: '600', color: '#a3e635' }}>
                {exportProgress}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(55, 65, 81, 0.6)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${exportProgress}%`,
                background: 'linear-gradient(90deg, #a3e635, #84cc16)',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
        
        <button
          onClick={handleExport}
          disabled={selectedDataTypes.length === 0 || isExporting}
          style={{
            width: '100%',
            padding: '16px',
            background: selectedDataTypes.length > 0 && !isExporting
              ? 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)'
              : 'rgba(55, 65, 81, 0.6)',
            color: selectedDataTypes.length > 0 && !isExporting ? '#111827' : '#6b7280',
            border: 'none',
            borderRadius: '12px',
            ...getTypographyStyles('large'),
            fontWeight: '600',
            cursor: selectedDataTypes.length > 0 && !isExporting ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease'
          }}
        >
          {isExporting ? 'エクスポート中...' : 'エクスポート開始'}
        </button>

        {/* Privacy Note */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'rgba(55, 65, 81, 0.3)',
          borderRadius: '12px',
          borderLeft: '3px solid #60a5fa'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <LockIcon size={16} primaryColor="#60a5fa" />
            <div>
              <h4 style={{
                ...getTypographyStyles('label'),
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '4px'
              }}>
                プライバシー保護
              </h4>
              <p style={{
                ...getTypographyStyles('small'),
                color: '#9ca3af',
                lineHeight: '1.5',
                margin: 0
              }}>
                エクスポートされたデータは暗号化され、あなたのデバイスに直接ダウンロードされます。第三者と共有されることはありません。
              </p>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}