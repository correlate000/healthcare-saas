// 統一タイポグラフィシステム
// 現在の使用状況: 14px(155回), 12px(111回), 16px(85回), 24px(50回)が主要

export const typography = {
  // Desktop & Mobile 共通のベースサイズ
  heading: {
    h1: { fontSize: '24px', fontWeight: '700', lineHeight: '1.2' }, // メインタイトル
    h2: { fontSize: '20px', fontWeight: '600', lineHeight: '1.3' }, // セクションタイトル  
    h3: { fontSize: '18px', fontWeight: '600', lineHeight: '1.4' }, // サブセクション
    h4: { fontSize: '16px', fontWeight: '500', lineHeight: '1.4' }, // カードタイトル
  },
  
  body: {
    large: { fontSize: '16px', fontWeight: '400', lineHeight: '1.5' }, // 重要な本文
    base: { fontSize: '14px', fontWeight: '400', lineHeight: '1.5' },  // 標準本文
    small: { fontSize: '12px', fontWeight: '400', lineHeight: '1.4' }, // 詳細・ラベル
  },
  
  // モバイル用のオーバーライド (768px以下)
  mobile: {
    heading: {
      h1: { fontSize: '20px', fontWeight: '700', lineHeight: '1.2' },
      h2: { fontSize: '18px', fontWeight: '600', lineHeight: '1.3' },
      h3: { fontSize: '16px', fontWeight: '600', lineHeight: '1.4' },
      h4: { fontSize: '15px', fontWeight: '500', lineHeight: '1.4' },
    },
    
    body: {
      large: { fontSize: '15px', fontWeight: '400', lineHeight: '1.5' },
      base: { fontSize: '14px', fontWeight: '400', lineHeight: '1.5' },
      small: { fontSize: '12px', fontWeight: '400', lineHeight: '1.4' },
    }
  },
  
  // 特殊用途
  caption: { fontSize: '11px', fontWeight: '400', lineHeight: '1.3' }, // キャプション・補足
  button: { fontSize: '14px', fontWeight: '500', lineHeight: '1' },     // ボタンテキスト
  label: { fontSize: '13px', fontWeight: '500', lineHeight: '1.2' },    // フォームラベル
} as const

// 使用例のヘルパー関数
export const getTypographyStyles = (
  variant: keyof typeof typography.heading | keyof typeof typography.body | 'caption' | 'button' | 'label',
  isMobile = false
) => {
  switch (variant) {
    case 'h1':
      return isMobile ? typography.mobile.heading.h1 : typography.heading.h1
    case 'h2':
      return isMobile ? typography.mobile.heading.h2 : typography.heading.h2  
    case 'h3':
      return isMobile ? typography.mobile.heading.h3 : typography.heading.h3
    case 'h4':
      return isMobile ? typography.mobile.heading.h4 : typography.heading.h4
    case 'large':
      return isMobile ? typography.mobile.body.large : typography.body.large
    case 'base':
      return isMobile ? typography.mobile.body.base : typography.body.base
    case 'small':
      return isMobile ? typography.mobile.body.small : typography.body.small
    case 'caption':
      return typography.caption
    case 'button':
      return typography.button
    case 'label':
      return typography.label
    default:
      return typography.body.base
  }
}

// よく使われる組み合わせのプリセット
export const typographyPresets = {
  // ページタイトル
  pageTitle: (isMobile = false) => ({
    ...getTypographyStyles('h1', isMobile),
    color: '#f3f4f6',
    marginBottom: '8px'
  }),
  
  // セクションヘッダー
  sectionHeader: (isMobile = false) => ({
    ...getTypographyStyles('h2', isMobile),
    color: '#f3f4f6', 
    marginBottom: '16px'
  }),
  
  // カードタイトル
  cardTitle: (isMobile = false) => ({
    ...getTypographyStyles('h4', isMobile),
    color: '#f3f4f6',
    marginBottom: '8px'
  }),
  
  // 本文テキスト
  bodyText: (isMobile = false) => ({
    ...getTypographyStyles('base', isMobile),
    color: '#d1d5db'
  }),
  
  // サブテキスト・説明文
  subText: (isMobile = false) => ({
    ...getTypographyStyles('small', isMobile),
    color: '#9ca3af'
  }),
  
  // アクティブ・強調テキスト
  activeText: (isMobile = false) => ({
    ...getTypographyStyles('base', isMobile),
    color: '#a3e635',
    fontWeight: '500'
  })
} as const