import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface PersonalizedResponseRequest {
  userId: string
  message: string
  emotion?: {
    primary: string
    sentimentScore: number
    topics: string[]
  }
  conversationHistory?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  responseStyle?: 'formal' | 'casual' | 'empathetic' | 'direct'
}

interface UserContext {
  recentEmotions: string[]
  concernAreas: string[]
  communicationStyle: string
  personalityTraits?: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
}

// ユーザーコンテキストのモック取得（本番ではデータベースから）
async function getUserContext(userId: string): Promise<UserContext> {
  return {
    recentEmotions: ['sadness', 'anxiety', 'neutral'],
    concernAreas: ['work', 'stress', 'relationships'],
    communicationStyle: 'empathetic',
    personalityTraits: {
      openness: 0.7,
      conscientiousness: 0.6,
      extraversion: 0.4,
      agreeableness: 0.8,
      neuroticism: 0.6
    }
  }
}

// パーソナライズされたプロンプトを生成
function generatePersonalizedPrompt(
  message: string,
  emotion: PersonalizedResponseRequest['emotion'],
  userContext: UserContext,
  conversationHistory?: PersonalizedResponseRequest['conversationHistory']
): string {
  const emotionContext = emotion ? `
現在の感情状態:
- 主要な感情: ${emotion.primary}
- センチメント: ${emotion.sentimentScore > 0 ? 'ポジティブ' : emotion.sentimentScore < 0 ? 'ネガティブ' : 'ニュートラル'}
- 話題: ${emotion.topics.join(', ')}` : ''

  const userContextInfo = `
ユーザーの背景:
- 最近の感情傾向: ${userContext.recentEmotions.join(', ')}
- 関心事: ${userContext.concernAreas.join(', ')}
- 好みのコミュニケーションスタイル: ${userContext.communicationStyle}`

  const conversationContext = conversationHistory && conversationHistory.length > 0
    ? `\n\n過去の会話:\n${conversationHistory.slice(-3).map(msg => 
        `${msg.role === 'user' ? 'ユーザー' : 'アシスタント'}: ${msg.content}`
      ).join('\n')}`
    : ''

  const systemPrompt = `あなたは思いやりのあるメンタルヘルスサポートアシスタントです。
以下の特徴を持って応答してください:

1. 共感的で温かい言葉遣い
2. 判断や批判をしない
3. 具体的で実践的なアドバイス
4. ユーザーの感情を認識し、受け入れる
5. 必要に応じて専門家への相談を勧める

${emotionContext}
${userContextInfo}
${conversationContext}

ユーザーのメッセージ: ${message}

以下の点を考慮して応答してください:
- ユーザーの現在の感情状態に寄り添う
- 過度に楽観的になりすぎない
- 実践可能な小さなステップを提案する
- ユーザーの努力を認める
- 安心感を与える言葉を使う`

  return systemPrompt
}

// ローカルでの応答生成（OpenAI APIが使えない場合のフォールバック）
function generateLocalResponse(
  message: string,
  emotion?: PersonalizedResponseRequest['emotion']
): string {
  const responses: Record<string, string[]> = {
    sadness: [
      'お辛い気持ち、よく分かります。今は無理をせず、ご自分のペースで過ごしてくださいね。',
      '今日は大変だったんですね。少しずつで大丈夫ですから、一緒に前を向いていきましょう。',
      'そのような気持ちになるのは自然なことです。今は休むことも大切な時間ですよ。'
    ],
    anxiety: [
      '不安な気持ちを抱えているんですね。深呼吸をして、今この瞬間に集中してみませんか。',
      '心配事があると辛いですよね。一つずつ整理していけば、きっと道が見えてきますよ。',
      '不安を感じるのは、あなたが真剣に考えている証拠です。一緒に解決策を見つけていきましょう。'
    ],
    anger: [
      'イライラする気持ち、よく分かります。まずは深呼吸をして、少し落ち着いてみましょう。',
      'そのような状況では怒りを感じるのも無理はありません。感情を認めることから始めましょう。',
      '怒りは大切な感情です。その気持ちを上手に表現する方法を一緒に考えてみませんか。'
    ],
    joy: [
      '素晴らしいですね！その前向きな気持ちを大切にしてください。',
      'とても良い調子ですね。この調子を保つために、今日できたことを振り返ってみましょう。',
      '喜びを感じられることは素晴らしいことです。この気持ちを覚えておいてくださいね。'
    ],
    neutral: [
      'お話を聞かせていただき、ありがとうございます。どんなことでもお気軽にお話しください。',
      '今日はどのような一日でしたか？小さなことでも構いませんので、お聞かせください。',
      'ゆっくりとお話ししていきましょう。あなたのペースで大丈夫ですよ。'
    ]
  }

  const primaryEmotion = emotion?.primary || 'neutral'
  const responseArray = responses[primaryEmotion] || responses.neutral
  const baseResponse = responseArray[Math.floor(Math.random() * responseArray.length)]

  // メッセージの内容に基づいて追加のアドバイス
  let additionalAdvice = ''
  if (message.includes('疲れ') || message.includes('しんどい')) {
    additionalAdvice = '\n\n今日は早めに休んで、明日に備えてくださいね。睡眠は心の回復にとても大切です。'
  } else if (message.includes('不安') || message.includes('心配')) {
    additionalAdvice = '\n\n不安なときは、紙に気持ちを書き出してみるのも効果的です。整理がつきやすくなりますよ。'
  } else if (message.includes('頑張')) {
    additionalAdvice = '\n\nあなたはもう十分頑張っています。時には休むことも大切な選択です。'
  }

  return baseResponse + additionalAdvice
}

export async function POST(request: NextRequest) {
  try {
    const body: PersonalizedResponseRequest = await request.json()
    const { userId, message, emotion, conversationHistory, responseStyle } = body

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'userId and message are required' },
        { status: 400 }
      )
    }

    // ユーザーコンテキストを取得
    const userContext = await getUserContext(userId)

    // OpenAI APIキーの確認
    const apiKey = process.env.OPENAI_API_KEY
    let response: string
    let isStreaming = false

    if (apiKey) {
      try {
        // パーソナライズされたプロンプトを生成
        const prompt = generatePersonalizedPrompt(
          message,
          emotion,
          userContext,
          conversationHistory
        )

        // OpenAI APIを使用
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
              {
                role: 'system',
                content: prompt
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 500,
            stream: false
          })
        })

        if (openaiResponse.ok) {
          const data = await openaiResponse.json()
          response = data.choices[0].message.content
        } else {
          // APIエラーの場合はローカル応答にフォールバック
          response = generateLocalResponse(message, emotion)
        }
      } catch (error) {
        console.error('OpenAI API error:', error)
        response = generateLocalResponse(message, emotion)
      }
    } else {
      // APIキーがない場合はローカル応答
      response = generateLocalResponse(message, emotion)
    }

    // 応答に基づく追加の提案
    const suggestions = generateSuggestions(emotion, userContext)

    return NextResponse.json({
      success: true,
      response,
      suggestions,
      metadata: {
        userId,
        timestamp: new Date().toISOString(),
        emotionDetected: emotion?.primary || 'neutral',
        responseStyle: responseStyle || userContext.communicationStyle
      }
    })
  } catch (error) {
    console.error('Error generating personalized response:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

function generateSuggestions(
  emotion?: PersonalizedResponseRequest['emotion'],
  userContext?: UserContext
): string[] {
  const suggestions: string[] = []

  // 感情に基づく提案
  if (emotion?.primary === 'sadness' || emotion?.primary === 'anxiety') {
    suggestions.push('マインドフルネス瞑想を試してみる')
    suggestions.push('信頼できる友人や家族と話す')
    suggestions.push('軽い運動や散歩をする')
  } else if (emotion?.primary === 'anger') {
    suggestions.push('深呼吸エクササイズを行う')
    suggestions.push('感情日記をつける')
    suggestions.push('リラクゼーション音楽を聴く')
  }

  // 関心事に基づく提案
  if (userContext?.concernAreas.includes('work')) {
    suggestions.push('仕事の優先順位を見直す')
    suggestions.push('定期的な休憩を取る')
  }
  if (userContext?.concernAreas.includes('stress')) {
    suggestions.push('ストレス管理のテクニックを学ぶ')
    suggestions.push('趣味の時間を作る')
  }

  return suggestions.slice(0, 3)
}

// ストリーミング応答用のエンドポイント（将来の拡張用）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    )
  }

  // ユーザーの過去の応答履歴を返す（モック）
  return NextResponse.json({
    userId,
    responseHistory: [],
    preferences: {
      responseStyle: 'empathetic',
      preferredLength: 'medium'
    }
  })
}