import { NextRequest, NextResponse } from 'next/server'
import { DemoService } from '@/lib/demo-service'

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
    ? `\n\n過去の会話:\n${conversationHistory.slice(-5).map(msg => 
        `${msg.role === 'user' ? 'ユーザー' : 'あなた'}: ${msg.content}`
      ).join('\n')}`
    : ''

  // 感情に応じた応答スタイルの調整
  const emotionGuidelines = {
    sadness: '優しく包み込むような温かい口調で。希望を押し付けず、今の気持ちに寄り添う。',
    anxiety: '落ち着いた安心感のある口調で。具体的で実践しやすい対処法を提供。',
    anger: '冷静で理解を示す口調で。感情を否定せず、健康的な発散方法を提案。',
    joy: '一緒に喜びを分かち合う明るい口調で。この気持ちを維持する方法を提案。',
    fear: '保護的で安心感を与える口調で。恐怖を軽減する段階的なアプローチを提供。',
    neutral: '親しみやすく開かれた口調で。相手の話をもっと引き出すような質問を含める。'
  }

  const currentMood = emotion?.primary || 'neutral'
  const moodGuideline = emotionGuidelines[currentMood as keyof typeof emotionGuidelines] || emotionGuidelines.neutral

  const systemPrompt = `あなたは「ルナ」という名前の、思いやりのあるAIカウンセラーです。
ユーザーの心の健康をサポートする親友のような存在として振る舞ってください。

【重要な振る舞い方】
1. 自然な会話を心がける（カウンセラーっぽすぎない、友達のような温かさ）
2. 相槌や共感の言葉を自然に使う（「そうなんですね」「それは大変でしたね」など）
3. 時々質問を投げかけて、会話を深める
4. 長すぎる応答は避け、会話のキャッチボールを意識
5. 絵文字は控えめに、でも温かみを表現するために時々使用（😊💭など）

【応答スタイル】
${moodGuideline}

${emotionContext}
${userContextInfo}
${conversationContext}

【会話の文脈を考慮】
- 初めての会話なら自己紹介を含める
- 継続的な会話なら前回の内容を踏まえる
- 時間帯に応じた挨拶（朝なら「おはようございます」など）
- ユーザーの言葉遣いに合わせる（敬語/タメ口）

ユーザーのメッセージ: ${message}

【応答のポイント】
- まず共感を示す
- 具体的な体験談や例を交える
- 押し付けがましくない提案
- 会話が続くような終わり方
- 150文字以内で簡潔に`

  return systemPrompt
}

// ローカルでの応答生成（OpenAI APIが使えない場合のフォールバック）
function generateLocalResponse(
  message: string,
  emotion?: PersonalizedResponseRequest['emotion'],
  conversationHistory?: PersonalizedResponseRequest['conversationHistory']
): string {
  // メッセージの内容を解析
  const keywords = {
    tired: ['疲れ', 'つかれ', 'しんどい', 'だるい', 'へとへと'],
    worried: ['不安', '心配', 'こわい', '怖い', '気になる'],
    sad: ['悲しい', 'かなしい', '辛い', 'つらい', '泣き'],
    angry: ['イライラ', 'むかつく', '腹立', '怒'],
    happy: ['嬉しい', 'うれしい', '楽しい', 'たのしい', '幸せ'],
    work: ['仕事', '会社', '職場', '上司', '同僚'],
    relationship: ['友達', '友人', '家族', '恋人', 'パートナー'],
    health: ['体調', '健康', '病気', '痛み', '症状']
  }

  // キーワードマッチング
  let detectedContext = 'general'
  for (const [context, words] of Object.entries(keywords)) {
    if (words.some(word => message.includes(word))) {
      detectedContext = context
      break
    }
  }

  // 会話の文脈を考慮
  const isFirstMessage = !conversationHistory || conversationHistory.length === 0
  const hour = new Date().getHours()
  let greeting = ''
  if (isFirstMessage) {
    if (hour < 10) greeting = 'おはようございます！'
    else if (hour < 18) greeting = 'こんにちは！'
    else greeting = 'こんばんは！'
  }

  // コンテキストに応じた応答
  const contextResponses: Record<string, string[]> = {
    tired: [
      `${greeting}お疲れのようですね。今日も一日頑張られたんですね。少し休憩を取ってみませんか？`,
      `${greeting}体が重く感じる時は、心も疲れているサインかもしれません。温かいお茶でも飲みながら、ゆっくりしましょう。`,
      `${greeting}疲れを感じている時は、無理をしないことが大切です。今夜は早めに休んでくださいね。`
    ],
    worried: [
      `${greeting}不安な気持ちを抱えているんですね。どんなことが心配なのか、よかったらもう少し聞かせてもらえますか？`,
      `${greeting}心配事があると、頭がいっぱいになってしまいますよね。一緒に整理してみましょうか。`,
      `${greeting}不安は誰にでもあるものです。今の気持ちを大切にしながら、少しずつ向き合っていきましょう。`
    ],
    sad: [
      `${greeting}辛い気持ちなんですね...。そんな時は無理に元気を出さなくていいんですよ。`,
      `${greeting}悲しい時は、その気持ちに寄り添うことも大切です。今はゆっくり過ごしてくださいね。`,
      `${greeting}お辛いですね。私はここにいますから、いつでもお話を聞きますよ。`
    ],
    happy: [
      `${greeting}わぁ、嬉しいことがあったんですね！その気持ち、大切にしてください😊`,
      `${greeting}素敵ですね！喜びを感じられるって本当に大切なことです。`,
      `${greeting}良かったですね！その幸せな気持ち、私も嬉しくなります。`
    ],
    work: [
      `${greeting}お仕事のことでお悩みなんですね。どんなことがあったか、お話ししてみませんか？`,
      `${greeting}職場でのストレスは本当に大変ですよね。少しずつでも改善できる方法を一緒に考えましょう。`,
      `${greeting}仕事の悩みは尽きないものですよね。今日はどんな一日でしたか？`
    ],
    relationship: [
      `${greeting}人間関係のことなんですね。誰かとの関係で悩むのは、その人を大切に思っているからこそですよ。`,
      `${greeting}人との関わりは難しいこともありますよね。どんなことがあったのか、ゆっくり聞かせてください。`,
      `${greeting}大切な人との関係で悩んでいるんですね。一緒に考えていきましょう。`
    ],
    general: [
      `${greeting}今日はどんな気持ちでいらっしゃいますか？なんでもお話しくださいね。`,
      `${greeting}お話を聞かせていただけて嬉しいです。どんなことでも、お気軽にどうぞ。`,
      `${greeting}ルナです。あなたのお話、じっくり聞かせてくださいね。`
    ]
  }

  const primaryEmotion = emotion?.primary || 'neutral'
  const responseArray = contextResponses[primaryEmotion] || contextResponses.general
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

    // デモ環境での応答
    if (DemoService.isDemo()) {
      const demoResponse = await DemoService.mockApiResponse('/api/personalized-response', { message })
      return NextResponse.json(demoResponse)
    }

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
            model: 'gpt-4o-mini',
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
            temperature: 0.8,
            max_tokens: 200,
            stream: false
          })
        })

        if (openaiResponse.ok) {
          const data = await openaiResponse.json()
          response = data.choices[0].message.content
        } else {
          // APIエラーの場合はローカル応答にフォールバック
          response = generateLocalResponse(message, emotion, conversationHistory)
        }
      } catch (error) {
        console.error('OpenAI API error:', error)
        response = generateLocalResponse(message, emotion)
      }
    } else {
      // APIキーがない場合はローカル応答
      response = generateLocalResponse(message, emotion, conversationHistory)
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