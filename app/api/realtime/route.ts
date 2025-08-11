import { NextRequest, NextResponse } from 'next/server'

// Realtime API接続用のエンドポイント
export async function POST(req: NextRequest) {
  try {
    // OpenAI APIキーの確認
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // セッショントークンを生成（簡易版）
    const sessionToken = generateSessionToken()
    
    // クライアントに接続情報を返す
    return NextResponse.json({
      url: 'wss://api.openai.com/v1/realtime',
      model: 'gpt-4o-realtime-preview-2024-12-17',
      sessionToken,
      // セキュリティのため、APIキーは含めない
      // クライアントサイドではセッショントークンを使用
    })
  } catch (error) {
    console.error('Realtime API initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize realtime session' },
      { status: 500 }
    )
  }
}

// WebSocket接続用のエフェメラルトークン生成（本番環境では別実装推奨）
export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // OpenAI Realtime API用のエフェメラルキー生成
    // 注：本番環境では適切な認証とレート制限を実装してください
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy', // 日本語対応音声
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      client_secret: data.client_secret,
      expires_at: Date.now() + 60 * 1000, // 1分間有効
    })
  } catch (error) {
    console.error('Failed to create ephemeral key:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}