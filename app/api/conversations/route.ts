import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface ConversationMessage {
  id: string
  userId: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  emotion?: {
    primary: string
    confidence: number
    sentimentScore: number
    keywords: string[]
    topics: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, content, role, emotion } = body

    if (!userId || !content || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const message: ConversationMessage = {
      id: crypto.randomUUID(),
      userId,
      content,
      role,
      timestamp: new Date().toISOString(),
      emotion
    }

    // In production, save to database
    // For now, we'll return the message with confirmation
    return NextResponse.json({
      success: true,
      message,
      stored: true
    })
  } catch (error) {
    console.error('Error saving conversation:', error)
    return NextResponse.json(
      { error: 'Failed to save conversation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // In production, fetch from database
    // Mock response for now
    const mockHistory: ConversationMessage[] = [
      {
        id: '1',
        userId,
        content: 'こんにちは。今日は少し疲れています。',
        role: 'user',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: {
          primary: 'sadness',
          confidence: 0.7,
          sentimentScore: -0.3,
          keywords: ['疲れ', '今日'],
          topics: ['体調', '挨拶']
        }
      },
      {
        id: '2',
        userId,
        content: 'お疲れ様です。今日一日頑張られたんですね。少しゆっくり休む時間を作ってみませんか？',
        role: 'assistant',
        timestamp: new Date(Date.now() - 3590000).toISOString()
      }
    ]

    return NextResponse.json({
      conversations: mockHistory.slice(0, limit),
      total: mockHistory.length
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}