import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    console.log('Pages API - Realtime endpoint called')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Has API Key:', !!process.env.OPENAI_API_KEY)
    
    // OpenAI APIキーの確認
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return res.status(500).json({
        error: 'OpenAI API key not configured',
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      })
    }

    // APIキーとコネクション情報を返す
    res.status(200).json({
      url: 'wss://api.openai.com/v1/realtime',
      model: 'gpt-4o-realtime-preview-2024-12-17',
      client_secret: apiKey,
      expires_at: Date.now() + 60 * 60 * 1000, // 1時間有効
    })
  } catch (error) {
    console.error('Pages API - Realtime error:', error)
    res.status(500).json({
      error: 'Failed to initialize realtime session',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}