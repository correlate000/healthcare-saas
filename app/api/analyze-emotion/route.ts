import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface EmotionAnalysisRequest {
  text: string
  userId?: string
  context?: string[]
}

interface EmotionAnalysisResponse {
  primary: 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'love' | 'neutral'
  confidence: number
  sentimentScore: number
  keywords: string[]
  topics: string[]
  suggestions?: string[]
}

// 日本語の感情キーワード辞書
const emotionKeywords = {
  joy: ['嬉しい', '楽しい', '幸せ', 'ありがとう', '良い', '素晴らしい', '最高', 'わくわく'],
  sadness: ['悲しい', '辛い', '寂しい', '涙', '疲れ', 'しんどい', '落ち込', 'つらい'],
  anger: ['怒り', 'イライラ', 'ムカつく', '腹立つ', '許せない', 'うざい', '最悪'],
  fear: ['怖い', '不安', '心配', '恐れ', '緊張', 'びくびく', 'ドキドキ'],
  surprise: ['驚き', 'びっくり', 'まさか', '信じられない', '予想外', 'えっ'],
  love: ['愛', '好き', '大切', '恋', 'いとおしい', '優しい'],
  neutral: ['普通', 'まあまあ', '特に', 'いつも通り']
}

// トピック抽出用キーワード
const topicKeywords = {
  work: ['仕事', '会社', '職場', '上司', '同僚', '残業', 'プロジェクト'],
  family: ['家族', '親', '子供', '夫', '妻', '兄弟', '姉妹'],
  health: ['健康', '体調', '病気', '痛み', '睡眠', '食事', '運動'],
  relationships: ['友達', '恋人', '人間関係', '付き合い', 'コミュニケーション'],
  school: ['学校', '勉強', '試験', '宿題', '授業', '先生', '成績'],
  money: ['お金', '給料', '貯金', '借金', '支払い', '経済'],
  future: ['将来', '未来', '夢', '目標', 'キャリア', '計画']
}

function analyzeEmotion(text: string): EmotionAnalysisResponse {
  const lowerText = text.toLowerCase()
  const emotionScores: Record<string, number> = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    love: 0,
    neutral: 0
  }

  // 感情スコアリング
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        emotionScores[emotion] += 1
      }
    }
  }

  // 主要な感情を特定
  let primary = 'neutral' as EmotionAnalysisResponse['primary']
  let maxScore = 0
  for (const [emotion, score] of Object.entries(emotionScores)) {
    if (score > maxScore) {
      maxScore = score
      primary = emotion as EmotionAnalysisResponse['primary']
    }
  }

  // キーワード抽出
  const extractedKeywords: string[] = []
  for (const keywords of Object.values(emotionKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        extractedKeywords.push(keyword)
      }
    }
  }

  // トピック抽出
  const extractedTopics: string[] = []
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        extractedTopics.push(topic)
        break
      }
    }
  }

  // センチメントスコア計算
  let sentimentScore = 0
  if (['joy', 'love'].includes(primary)) {
    sentimentScore = 0.5 + (maxScore * 0.1)
  } else if (['sadness', 'anger', 'fear'].includes(primary)) {
    sentimentScore = -0.5 - (maxScore * 0.1)
  }
  sentimentScore = Math.max(-1, Math.min(1, sentimentScore))

  // 感情に基づく提案
  const suggestions = getSuggestions(primary, extractedTopics)

  return {
    primary,
    confidence: maxScore > 0 ? Math.min(0.9, 0.5 + maxScore * 0.1) : 0.3,
    sentimentScore,
    keywords: extractedKeywords.slice(0, 5),
    topics: extractedTopics,
    suggestions
  }
}

function getSuggestions(emotion: string, topics: string[]): string[] {
  const suggestions: string[] = []

  switch (emotion) {
    case 'sadness':
      suggestions.push('深呼吸をしてリラックスしましょう')
      suggestions.push('信頼できる人と話してみませんか')
      suggestions.push('好きな音楽を聴いてみるのはどうでしょう')
      break
    case 'anger':
      suggestions.push('少し散歩をして気分転換しましょう')
      suggestions.push('感情を紙に書き出してみませんか')
      suggestions.push('リラクゼーション法を試してみましょう')
      break
    case 'fear':
    case 'anxiety':
      suggestions.push('不安なことをリストアップしてみましょう')
      suggestions.push('マインドフルネス瞑想を試してみませんか')
      suggestions.push('小さな一歩から始めてみましょう')
      break
    case 'joy':
      suggestions.push('この気持ちを大切にしてください')
      suggestions.push('誰かとこの喜びを共有しませんか')
      break
    default:
      suggestions.push('今の気持ちを大切にしてください')
  }

  // トピックに基づく追加提案
  if (topics.includes('work')) {
    suggestions.push('仕事の優先順位を見直してみましょう')
  }
  if (topics.includes('health')) {
    suggestions.push('十分な休息を取ることを心がけましょう')
  }

  return suggestions.slice(0, 3)
}

export async function POST(request: NextRequest) {
  try {
    const body: EmotionAnalysisRequest = await request.json()
    const { text, userId } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for analysis' },
        { status: 400 }
      )
    }

    // OpenAI APIを使用した高度な分析（オプション）
    const apiKey = process.env.OPENAI_API_KEY
    let analysis: EmotionAnalysisResponse

    if (apiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `あなたは感情分析の専門家です。以下のテキストを分析して、JSON形式で感情分析結果を返してください。
                結果には以下を含めてください：
                - primary: 主要な感情（joy, sadness, anger, fear, surprise, love, neutral のいずれか）
                - confidence: 確信度（0-1）
                - sentimentScore: センチメントスコア（-1から1）
                - keywords: 重要なキーワード（配列）
                - topics: 話題（配列）
                - suggestions: 提案（配列、3つまで）`
              },
              {
                role: 'user',
                content: text
              }
            ],
            temperature: 0.3,
            max_tokens: 500
          })
        })

        if (response.ok) {
          const data = await response.json()
          const content = data.choices[0].message.content
          try {
            analysis = JSON.parse(content)
          } catch {
            // JSONパースに失敗した場合はローカル分析にフォールバック
            analysis = analyzeEmotion(text)
          }
        } else {
          analysis = analyzeEmotion(text)
        }
      } catch (error) {
        console.error('OpenAI API error:', error)
        analysis = analyzeEmotion(text)
      }
    } else {
      // ローカル分析
      analysis = analyzeEmotion(text)
    }

    // 分析結果を保存（必要に応じて）
    if (userId) {
      // データベースに保存する処理
      console.log(`Saving emotion analysis for user ${userId}`)
    }

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error analyzing emotion:', error)
    return NextResponse.json(
      { error: 'Failed to analyze emotion' },
      { status: 500 }
    )
  }
}