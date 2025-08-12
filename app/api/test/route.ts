import { NextRequest, NextResponse } from 'next/server'

// Edge Runtime を使用
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    runtime: 'edge'
  })
}