'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function ExportPage() {
  const router = useRouter()
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv' | 'pdf'>('json')
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>(['mood', 'activities'])
  const [dateRange, setDateRange] = useState({
    from: '2025-07-01',
    to: '2025-08-08'
  })

  const dataTypes = [
    { id: 'mood', label: '気分データ', icon: '😊', size: '2.3 MB' },
    { id: 'activities', label: 'アクティビティ', icon: '📊', size: '1.8 MB' },
    { id: 'chats', label: 'チャット履歴', icon: '💬', size: '3.5 MB' },
    { id: 'achievements', label: '実績・バッジ', icon: '🏆', size: '0.5 MB' },
    { id: 'challenges', label: 'チャレンジ記録', icon: '🎯', size: '1.2 MB' },
    { id: 'profile', label: 'プロフィール', icon: '👤', size: '0.1 MB' }
  ]

  const formats = [
    { id: 'json', label: 'JSON', description: '開発者向け', icon: '{ }' },
    { id: 'csv', label: 'CSV', description: 'Excel対応', icon: '📊' },
    { id: 'pdf', label: 'PDF', description: '印刷用', icon: '📄' }
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

  const handleExport = () => {
    // Simulate export
    alert(`エクスポート処理を開始しました。\nフォーマット: ${selectedFormat.toUpperCase()}\nサイズ: ${getTotalSize()} MB`)
  }

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
          fontSize: '24px',
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
            <span style={{ fontSize: '24px' }}>💾</span>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#f3f4f6'
            }}>
              あなたのデータ
            </h3>
          </div>
          <p style={{
            fontSize: '13px',
            color: '#9ca3af',
            lineHeight: '1.6'
          }}>
            すべての個人データをダウンロードできます。データはあなたのプライバシーを保護するため暗号化されています。
          </p>
        </div>

        {/* Date Range */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '16px',
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
                fontSize: '12px',
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
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                fontSize: '12px',
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
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Data Types */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '16px',
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
                  <span style={{ fontSize: '20px' }}>{type.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: selectedDataTypes.includes(type.id) ? '#f3f4f6' : '#d1d5db'
                    }}>
                      {type.label}
                    </div>
                    <div style={{
                      fontSize: '12px',
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

        {/* Format Selection */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f3f4f6',
            marginBottom: '12px'
          }}>
            フォーマット
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
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
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{format.icon}</div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: selectedFormat === format.id ? '#a3e635' : '#f3f4f6'
                }}>
                  {format.label}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af'
                }}>
                  {format.description}
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
              fontSize: '14px',
              color: '#9ca3af'
            }}>
              選択したデータ
            </span>
            <span style={{
              fontSize: '14px',
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
              fontSize: '14px',
              color: '#9ca3af'
            }}>
              推定サイズ
            </span>
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#a3e635'
            }}>
              {getTotalSize()} MB
            </span>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={selectedDataTypes.length === 0}
          style={{
            width: '100%',
            padding: '16px',
            background: selectedDataTypes.length > 0
              ? 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)'
              : 'rgba(55, 65, 81, 0.6)',
            color: selectedDataTypes.length > 0 ? '#111827' : '#6b7280',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: selectedDataTypes.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease'
          }}
        >
          エクスポート開始
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
            <span style={{ fontSize: '16px' }}>🔒</span>
            <div>
              <h4 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '4px'
              }}>
                プライバシー保護
              </h4>
              <p style={{
                fontSize: '12px',
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