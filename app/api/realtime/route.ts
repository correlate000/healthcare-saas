import { NextRequest, NextResponse } from 'next/server'

// POSTとGETの両方に対応
export async function POST(req: NextRequest) {
  return handleRealtimeRequest()
}

export async function GET(req: NextRequest) {
  return handleRealtimeRequest()
}

async function handleRealtimeRequest() {
  try {
    // OpenAI APIキーの確認
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // 簡易的にAPIキーを返す（開発用）
    return NextResponse.json({
      url: 'wss://api.openai.com/v1/realtime',
      model: 'gpt-4o-realtime-preview-2024-12-17',
      client_secret: apiKey,
      expires_at: Date.now() + 60 * 60 * 1000, // 1時間有効
    })
  } catch (error) {
    console.error('Realtime API error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize realtime session' },
      { status: 500 }
    )
  }
}