# Vercel再接続手順

## 問題
Vercelのチーム転送後、GitHubとの連携が切れてデプロイが実行されなくなっています。

## 解決手順

### 1. Vercelダッシュボードで確認
1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. 新しいチームに切り替え
3. プロジェクト一覧から `healthcare-saas` を探す

### 2. GitHubリポジトリとの再接続

#### オプションA: 既存プロジェクトの再接続
1. Vercelダッシュボードでプロジェクトを開く
2. Settings → Git に移動
3. "Disconnect from Git" をクリック（既に切断されている場合はスキップ）
4. "Connect Git Repository" をクリック
5. GitHubアカウントを選択
6. `correlate000/healthcare-saas` リポジトリを選択
7. mainブランチを選択

#### オプションB: 新規プロジェクトとして作成
1. Vercelダッシュボードで "New Project" をクリック
2. "Import Git Repository" を選択
3. GitHubアカウントを選択（権限を求められたら許可）
4. `correlate000/healthcare-saas` リポジトリを選択
5. プロジェクト設定：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
   - Install Command: npm install

### 3. 環境変数の設定
以下の環境変数を設定してください：

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### 4. ビルド設定の確認
- Node.js Version: 18.x
- Build & Development Settings:
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

### 5. デプロイの確認
1. 設定完了後、自動的に最新コミットがデプロイされます
2. ビルドログを確認してエラーがないか確認
3. デプロイ完了後、プレビューURLで動作確認

### 6. GitHub連携の確認
1. GitHubリポジトリの Settings → Webhooks を確認
2. Vercelのwebhookが追加されていることを確認
3. 今後のコミットで自動デプロイが動作することを確認

## トラブルシューティング

### 依存関係エラーが発生した場合
1. `.vercelignore` ファイルが正しく設定されているか確認
2. `api/` ディレクトリが除外されているか確認

### ビルドエラーが発生した場合
1. ローカルで `npm run build` が成功するか確認
2. 環境変数が正しく設定されているか確認

## 関連ファイル
- `.vercelignore` - Vercelビルドから除外するファイル
- `vercel.json` - Vercel設定ファイル
- `DEPLOYMENT_STATUS.md` - デプロイステータス記録