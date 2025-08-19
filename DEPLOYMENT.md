# デプロイメント環境構成

## 3環境構成

### 🟢 Main（本番環境）
- **ブランチ**: `main` 
- **URL**: `https://healthcare-saas.com`（カスタムドメイン設定後）
- **現在**: `https://healthcare-saas-plum.vercel.app`
- **特徴**: 
  - 本番用データ使用
  - SEO有効
  - アナリティクス有効
  - 検索エンジンにインデックス

### 🟡 Staging（ステージング環境）
- **ブランチ**: `staging`
- **URL**: `https://healthcare-saas-staging.vercel.app` 
- **特徴**:
  - テスト用環境
  - 本番と同じデータ構成
  - SEO無効（noindex）
  - 開発チーム向け検証

### 🔵 Demo（デモ・営業環境）
- **ブランチ**: `demo`
- **URL**: `https://healthcare-saas-demo.vercel.app`
- **特徴**:
  - モックデータ使用
  - 営業・プレゼン用
  - SEO無効
  - デモ専用レスポンス

## Vercel設定

### 自動デプロイ設定
```bash
# 各ブランチが自動デプロイ対象
main    -> 本番環境（メインサイト）
staging -> ステージング環境
demo    -> デモ環境
```

### 環境変数設定（Vercel Dashboard）

**Production（main）**
```
NEXT_PUBLIC_SITE_URL=https://healthcare-saas.com
OPENAI_API_KEY=実際のAPIキー
SUPABASE_URL=本番URL
SUPABASE_ANON_KEY=本番キー
```

**Preview（staging）**
```
NEXT_PUBLIC_SITE_URL=https://healthcare-saas-staging.vercel.app  
OPENAI_API_KEY=テスト用APIキー
SUPABASE_URL=ステージング用URL
SUPABASE_ANON_KEY=ステージング用キー
```

**Preview（demo）**
```
NEXT_PUBLIC_SITE_URL=https://healthcare-saas-demo.vercel.app
OPENAI_API_KEY=デモ用APIキー（使用量制限）
DEMO_MODE=true
```

## ワークフロー

### 開発フロー
```
feature/xxx → staging → main
```

### デモ更新フロー
```  
main → demo（手動マージ）
```

### 緊急修正フロー
```
hotfix/xxx → main → staging
```

## ブランチ保護ルール

**main**
- Direct push禁止
- PR必須
- レビュー必須

**staging** 
- Direct push可能
- テスト用

**demo**
- Direct push可能  
- 営業チーム用

## SEO設定

### robots.txt
```
# Production（main）
User-agent: *
Allow: /

# Staging/Demo
User-agent: *
Disallow: /
```

### メタタグ
```jsx
// 環境別でnoindex制御
{config.environment !== 'production' && (
  <meta name="robots" content="noindex,nofollow" />
)}
```

## 監視・分析

### 本番のみ有効
- Google Analytics
- Vercel Analytics  
- エラー監視
- パフォーマンス監視

### 全環境共通
- ログ収集
- ヘルスチェック