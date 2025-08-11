import { NextRequest, NextResponse } from 'next/server'

// テスト用の新しいエンドポイント
export async function GET(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'API key not set',
      hasKey: false 
    }, { status: 500 })
  }
  
  return NextResponse.json({ 
    success: true,
    hasKey: true,
    keyPrefix: apiKey.substring(0, 10) + '...',
    timestamp: new Date().toISOString()
  })
}

export async function POST(req: NextRequest) {
  return GET(req)
}