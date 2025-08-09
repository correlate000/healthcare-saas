'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { ChartIcon, ExportIcon, DatabaseIcon } from '@/components/icons/illustrations'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function ReportsPage() {
  const router = useRouter()
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const reports = [
    {
      id: 'health-summary',
      title: '健康サマリー',
      description: '全体的な健康状態のレポート',
      icon: '📊',
      color: '#a3e635',
      lastUpdated: '2024年6月9日'
    },
    {
      id: 'mood-trends',
      title: '気分トレンド',
      description: '気分の変化と傾向分析',
      icon: '📈',
      color: '#60a5fa',
      lastUpdated: '2024年6月8日'
    },
    {
      id: 'activity-log',
      title: '活動ログ',
      description: '日々の活動記録と統計',
      icon: '📝',
      color: '#fbbf24',
      lastUpdated: '2024年6月7日'
    },
    {
      id: 'stress-analysis',
      title: 'ストレス分析',
      description: 'ストレスレベルと要因分析',
      icon: '🧠',
      color: '#f87171',
      lastUpdated: '2024年6月9日'
    }
  ]

  const handleExport = (reportId: string) => {
    setSelectedReport(reportId)
    setTimeout(() => {
      alert(`${reports.find(r => r.id === reportId)?.title}をエクスポート中...`)
      setSelectedReport(null)
    }, 500)
  }

  const handleViewDetails = (reportId: string) => {
    router.push('/analytics')
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
          background: 'linear-gradient(135deg, #f3f4f6 0%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          レポート
        </h1>
        <p style={{
          ...getTypographyStyles('base'),
          color: '#9ca3af',
          marginTop: '8px',
          margin: '8px 0 0 0'
        }}>
          健康データのレポートを表示・エクスポート
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => router.push('/analytics')}
            style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#0f172a',
              border: 'none',
              borderRadius: '12px',
              ...getTypographyStyles('button'),
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ChartIcon size={18} primaryColor="#0f172a" />
            分析を見る
          </button>
          <button
            onClick={() => router.push('/export')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'rgba(55, 65, 81, 0.6)',
              color: '#d1d5db',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderRadius: '12px',
              ...getTypographyStyles('button'),
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ExportIcon size={18} color="#9ca3af" />
            一括エクスポート
          </button>
        </div>

        {/* Reports List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(55, 65, 81, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => handleViewDetails(report.id)}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px'
              }}>
                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: `${report.color}20`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  {report.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    ...getTypographyStyles('large'),
                    fontWeight: '600',
                    color: '#f3f4f6',
                    marginBottom: '4px'
                  }}>
                    {report.title}
                  </h3>
                  <p style={{
                    ...getTypographyStyles('base'),
                    color: '#9ca3af',
                    marginBottom: '8px'
                  }}>
                    {report.description}
                  </p>
                  <div style={{
                    ...getTypographyStyles('caption'),
                    color: '#6b7280'
                  }}>
                    最終更新: {report.lastUpdated}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleExport(report.id)
                  }}
                  style={{
                    padding: '8px',
                    backgroundColor: 'rgba(163, 230, 53, 0.1)',
                    border: '1px solid rgba(163, 230, 53, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: selectedReport === report.id ? 0.5 : 1
                  }}
                  disabled={selectedReport === report.id}
                >
                  <ExportIcon size={20} color="#a3e635" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Help text */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(96, 165, 250, 0.2)'
        }}>
          <p style={{
            ...getTypographyStyles('small'),
            color: '#60a5fa',
            margin: 0
          }}>
            💡 レポートをタップして詳細を確認するか、エクスポートボタンでPDFやCSV形式でダウンロードできます。
          </p>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}