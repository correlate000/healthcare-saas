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
    // デバッグ情報を追加
    console.log('Realtime API called')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Has API Key:', !!process.env.OPENAI_API_KEY)
    
    // OpenAI APIキーの確認
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          env: process.env.NODE_ENV,
          timestamp: new Date().toISOString()
        },
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
      { 
        error: 'Failed to initialize realtime session',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}