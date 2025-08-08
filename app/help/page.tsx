'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function HelpPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const categories = [
    { id: 'getting-started', icon: '🚀', label: '使い方', count: 8 },
    { id: 'account', icon: '👤', label: 'アカウント', count: 6 },
    { id: 'features', icon: '✨', label: '機能', count: 12 },
    { id: 'troubleshooting', icon: '🔧', label: 'トラブル', count: 5 },
    { id: 'privacy', icon: '🔒', label: 'プライバシー', count: 4 },
    { id: 'billing', icon: '💳', label: '料金', count: 3 }
  ]

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'アプリの使い方を教えてください',
      answer: 'まずはダッシュボードから毎日の気分をチェックインしてください。AIキャラクターとのチャットや、デイリーチャレンジへの参加で、メンタルヘルスの改善をサポートします。'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'AIキャラクターとは何ですか？',
      answer: '6体のAIキャラクターがあなたの気分や状況に合わせてサポートします。各キャラクターは異なる性格を持ち、あなたに最適なアドバイスを提供します。'
    },
    {
      id: 3,
      category: 'features',
      question: 'デイリーチャレンジとは？',
      answer: '毎日新しい健康習慣を身につけるための小さなタスクです。瞑想、運動、感謝の実践など、様々なチャレンジがあります。完了するとXPを獲得できます。'
    },
    {
      id: 4,
      category: 'account',
      question: 'プロフィールの変更方法は？',
      answer: '設定ページからプロフィール編集ボタンをタップして、名前、アバター、目標などを変更できます。'
    },
    {
      id: 5,
      category: 'privacy',
      question: '私のデータは安全ですか？',
      answer: 'はい、すべてのデータは暗号化されて保存されます。第三者とデータを共有することはありません。詳細はプライバシーポリシーをご確認ください。'
    },
    {
      id: 6,
      category: 'troubleshooting',
      question: '通知が届きません',
      answer: '設定アプリから通知の許可を確認してください。アプリ内の通知設定もオンになっているか確認してください。'
    },
    {
      id: 7,
      category: 'billing',
      question: '無料で使えますか？',
      answer: '基本機能は無料でご利用いただけます。プレミアム機能をご利用の場合は、月額プランへのアップグレードが必要です。'
    }
  ]

  const quickLinks = [
    { icon: '📱', label: 'アプリガイド', description: '基本的な使い方を学ぶ' },
    { icon: '🎥', label: 'ビデオチュートリアル', description: '動画で使い方を見る' },
    { icon: '📧', label: 'お問い合わせ', description: 'サポートチームに連絡' },
    { icon: '💬', label: 'コミュニティ', description: 'ユーザーフォーラム' }
  ]

  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedCategory
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs

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
          margin: '0 0 16px 0'
        }}>
          ヘルプセンター
        </h1>

        {/* Search Bar */}
        <div style={{
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="質問を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              backgroundColor: 'rgba(55, 65, 81, 0.6)',
              border: '1px solid rgba(55, 65, 81, 0.5)',
              borderRadius: '12px',
              color: '#f3f4f6',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <span style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px'
          }}>
            🔍
          </span>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Quick Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '28px'
        }}>
          {quickLinks.map((link) => (
            <button
              key={link.label}
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
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
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{link.icon}</div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#f3f4f6',
                marginBottom: '4px'
              }}>
                {link.label}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                {link.description}
              </div>
            </button>
          ))}
        </div>

        {/* Categories */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#f3f4f6',
          marginBottom: '16px'
        }}>
          カテゴリー別ヘルプ
        </h3>
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '8px 16px',
              backgroundColor: !selectedCategory
                ? 'rgba(163, 230, 53, 0.2)'
                : 'rgba(55, 65, 81, 0.6)',
              color: !selectedCategory ? '#a3e635' : '#d1d5db',
              border: !selectedCategory
                ? '1px solid rgba(163, 230, 53, 0.3)'
                : '1px solid transparent',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            すべて
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === category.id
                  ? 'rgba(163, 230, 53, 0.2)'
                  : 'rgba(55, 65, 81, 0.6)',
                color: selectedCategory === category.id ? '#a3e635' : '#d1d5db',
                border: selectedCategory === category.id
                  ? '1px solid rgba(163, 230, 53, 0.3)'
                  : '1px solid transparent',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{category.icon}</span>
              {category.label}
              <span style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '2px 6px',
                borderRadius: '6px',
                fontSize: '11px'
              }}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#f3f4f6',
          marginBottom: '16px'
        }}>
          よくある質問
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(55, 65, 81, 0.3)',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {faq.question}
                  </div>
                  {expandedFaq !== faq.id && (
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: '20px',
                  color: '#9ca3af',
                  transform: expandedFaq === faq.id ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}>
                  ⌄
                </span>
              </button>
              {expandedFaq === faq.id && (
                <div style={{
                  padding: '0 16px 16px',
                  animation: 'slideDown 0.3s ease'
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#d1d5db',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {faq.answer}
                  </p>
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(55, 65, 81, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      この回答は役に立ちましたか？
                    </span>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: 'rgba(163, 230, 53, 0.2)',
                      color: '#a3e635',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      はい
                    </button>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: 'rgba(55, 65, 81, 0.6)',
                      color: '#9ca3af',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      いいえ
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div style={{
          marginTop: '32px',
          background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(31, 41, 55, 0.8) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'center',
          border: '1px solid rgba(96, 165, 250, 0.2)'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '12px'
          }}>
            🤝
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#f3f4f6',
            marginBottom: '8px'
          }}>
            さらにサポートが必要ですか？
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '20px'
          }}>
            私たちのサポートチームがお手伝いします
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => router.push('/emergency-support')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              緊急サポート
            </button>
            <button
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(163, 230, 53, 0.2)',
                color: '#a3e635',
                border: '1px solid rgba(163, 230, 53, 0.3)',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              メールで問い合わせ
            </button>
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