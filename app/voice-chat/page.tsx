'use client'

import { useState, useEffect, useRef } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { getTypographyStyles } from '@/styles/typography'
import { RealtimeService, ConnectionState } from '@/lib/realtime-service'
import { conversationStorage, ConversationMessage, EmotionAnalysis } from '@/lib/conversation-storage'

export default function VoiceChatPage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
  const [selectedCharacter, setSelectedCharacter] = useState('luna')
  const [audioLevel, setAudioLevel] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRealtimeAvailable, setIsRealtimeAvailable] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [currentEmotion, setCurrentEmotion] = useState<EmotionAnalysis | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [sessionId, setSessionId] = useState<string>('')
  
  // ユーザーID（ローカルストレージから取得または生成）
  const userId = typeof window !== 'undefined' ? 
    'user-' + (localStorage.getItem('userId') || Date.now()) : 
    'user-' + Date.now()
  
  // Realtime API Service
  const realtimeService = useRef<RealtimeService | null>(null)
  
  // Fallback用の既存の参照
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isSessionActiveRef = useRef(false)
  
  // 状態から表示用フラグを導出
  const isListening = connectionState === 'listening'
  const isSpeaking = connectionState === 'speaking'
  const isSessionActive = ['connected', 'authenticated', 'listening', 'speaking'].includes(connectionState)
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('lg')

  // キャラクター設定（感情に応じた応答を追加）
  const characters = {
    luna: {
      id: 'luna',
      name: 'るな',
      color: '#a3e635',
      bodyColor: '#a3e635',
      bellyColor: '#ecfccb',
      pitch: 1.2,
      rate: 0.95,
      personality: 'empathetic', // 共感的
      responses: {
        greeting: ['こんにちは！今日の調子はいかがですか？', '元気でしたか？お話を聞かせてください'],
        encouragement: ['それは素晴らしいですね！', 'いいですね、その調子です'],
        advice: ['ゆっくり休息を取ることも大切ですよ', '深呼吸をして、リラックスしてみましょう'],
        listening: ['なるほど', 'そうなんですね', 'うんうん', 'へぇ〜'],
        // 感情別の応答
        sadness: ['辛い気持ち、よく分かります。', '今は無理をせず、ゆっくり過ごしてくださいね。'],
        anxiety: ['不安な気持ちを抱えているんですね。一緒に考えていきましょう。'],
        joy: ['とても嬉しそうですね！その気持ちを大切にしてください。'],
        anger: ['イライラする気持ち、よく分かります。少し深呼吸しましょう。']
      }
    },
    aria: {
      id: 'aria',
      name: 'あーりあ',
      color: '#60a5fa',
      bodyColor: '#60a5fa',
      bellyColor: '#dbeafe',
      pitch: 1.3,
      rate: 1.05,
      personality: 'cheerful', // 元気
      responses: {
        greeting: ['やっほー！元気してた？', 'わーい！今日も楽しく話そう！'],
        encouragement: ['やったー！その調子！', 'すごいすごい！'],
        advice: ['大丈夫！きっと明日はもっと良い日になるよ！', '一緒に頑張ろう！'],
        listening: ['うんうん！', 'へぇ〜すごい！', 'それで？それで？', 'わくわく！'],
        sadness: ['大丈夫だよ！私がついてるから！', '明日はきっと良いことあるよ！'],
        anxiety: ['心配しないで！なんとかなるよ！', '一緒に乗り越えよう！'],
        joy: ['わーい！嬉しいね！', 'やったね！一緒に喜ぼう！'],
        anger: ['そっかー、それは嫌だったね。でも大丈夫！']
      }
    },
    zen: {
      id: 'zen',
      name: 'ぜん',
      color: '#f59e0b',
      bodyColor: '#f59e0b',
      bellyColor: '#fed7aa',
      pitch: 0.95,
      rate: 0.85,
      personality: 'calm', // 落ち着いた
      responses: {
        greeting: ['こんにちは。今日はゆっくり話しましょう', '心を落ち着けて、お話ししませんか'],
        encouragement: ['素晴らしい気づきですね', '良い流れを感じます'],
        advice: ['今この瞬間に意識を向けてみましょう', '呼吸に集中してみてください'],
        listening: ['ふむふむ', 'なるほど...', 'そうですか', '興味深いですね'],
        sadness: ['その気持ちを認めることから始めましょう。', '感情は波のように来て、去っていきます。'],
        anxiety: ['不安は未来への警告です。今に集中しましょう。', '一歩ずつ進んでいきましょう。'],
        joy: ['喜びを感じることは大切です。', 'その瞬間を大切にしてください。'],
        anger: ['怒りも大切な感情です。まず認めましょう。', '感情を観察してみましょう。']
      }
    }
  }

  const currentCharacter = characters[selectedCharacter as keyof typeof characters]

  // 初期化時にユーザーIDを保存し、会話履歴を読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId.replace('user-', ''))
      loadConversationHistory()
    }
  }, [])

  // 会話履歴を読み込む
  const loadConversationHistory = async () => {
    try {
      await conversationStorage.initialize()
      const history = await conversationStorage.getConversationHistory(userId, 20)
      setConversationHistory(history)
      
      // 最新の感情状態を取得
      const recentEmotions = await conversationStorage.getEmotionTrends(userId, 7)
      if (recentEmotions.length > 0) {
        setCurrentEmotion(recentEmotions[recentEmotions.length - 1])
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error)
    }
  }

  // 感情分析を行う
  const analyzeEmotion = async (text: string): Promise<EmotionAnalysis | null> => {
    try {
      const response = await fetch('/api/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userId })
      })

      if (response.ok) {
        const data = await response.json()
        return data.analysis
      }
    } catch (error) {
      console.error('Emotion analysis failed:', error)
    }
    return null
  }

  // パーソナライズされた応答を取得
  const getPersonalizedResponse = async (
    userMessage: string,
    emotion: EmotionAnalysis | null
  ): Promise<string> => {
    try {
      // 会話履歴の最新10件を送信（コンテキストを増やす）
      const recentHistory = conversationHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/personalized-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: userMessage,
          emotion,
          conversationHistory: recentHistory,
          responseStyle: currentCharacter.personality,
          characterName: currentCharacter.name
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.response
      }
    } catch (error) {
      console.error('Failed to get personalized response:', error)
    }

    // フォールバック：キャラクターの感情別応答
    if (emotion) {
      const emotionResponses = currentCharacter.responses[emotion.primary as keyof typeof currentCharacter.responses]
      if (emotionResponses && Array.isArray(emotionResponses)) {
        return emotionResponses[Math.floor(Math.random() * emotionResponses.length)]
      }
    }
    
    return currentCharacter.responses.listening[0]
  }

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width <= 320) setScreenSize('xs')
      else if (width <= 375) setScreenSize('sm')
      else if (width <= 480) setScreenSize('md')
      else setScreenSize('lg')
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Realtime API利用可能チェック
  useEffect(() => {
    const checkRealtimeAvailability = async () => {
      try {
        const response = await fetch('/api/realtime', { method: 'GET' })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.client_secret || data.url) {
            setIsRealtimeAvailable(true)
            console.log('Realtime API is available')
          } else {
            setIsRealtimeAvailable(false)
            setUseFallback(true)
          }
        } else {
          setIsRealtimeAvailable(false)
          setUseFallback(true)
        }
      } catch (error) {
        console.error('Failed to check Realtime API:', error)
        setIsRealtimeAvailable(false)
        setUseFallback(true)
      }
    }
    
    checkRealtimeAvailability()
  }, [])

  // 音声認識の初期化（フォールバック用）
  useEffect(() => {
    if (!useFallback) return
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'ja-JP'
      
      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        
        if (finalTranscript) {
          setCurrentTranscript(finalTranscript)
          if (isSessionActiveRef.current) {
            handleUserMessage(finalTranscript)
          }
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech' && isSessionActiveRef.current) {
          playListeningResponse()
        }
      }
      
      recognition.onend = () => {
        if (isSessionActiveRef.current) {
          try {
            recognition.start()
          } catch (e) {
            console.log('Recognition restart failed:', e)
          }
        }
      }
      
      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current)
      }
    }
  }, [useFallback])

  // 相槌を打つ
  const playListeningResponse = () => {
    if (!isSpeaking && isSessionActiveRef.current) {
      // 感情に応じた相槌を選択
      let responses = currentCharacter.responses.listening
      
      // 前回の感情を考慮した相槌
      if (currentEmotion) {
        const emotionResponses = {
          sadness: ['うんうん...', 'そうなんですね...', 'つらかったですね...'],
          anxiety: ['なるほど...', 'そうですか...', 'ふむふむ...'],
          anger: ['そうですね...', 'わかります...', 'うーん...'],
          joy: ['いいですね！', 'そうなんですか！', 'へぇー！'],
          neutral: currentCharacter.responses.listening
        }
        responses = emotionResponses[currentEmotion.primary as keyof typeof emotionResponses] || responses
      }
      
      const response = responses[Math.floor(Math.random() * responses.length)]
      speakText(response, false)
    }
  }

  // ユーザーメッセージの処理（パーソナライズ機能追加）
  const handleUserMessage = async (text: string) => {
    console.log('User message:', text)
    
    // セッションタイムアウトをリセット
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current)
    }

    // 感情分析を実行
    const emotion = await analyzeEmotion(text)
    setCurrentEmotion(emotion)

    // ユーザーメッセージを保存
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      userId,
      content: text,
      role: 'user',
      timestamp: new Date(),
      emotion: emotion || undefined
    }
    
    await conversationStorage.saveMessage(userMessage)
    setConversationHistory(prev => [...prev, userMessage])
    
    // パーソナライズされたAI応答を生成
    // 応答までの遅延をランダム化して自然に
    const responseDelay = Math.random() * 500 + 300 // 300-800ms
    setTimeout(async () => {
      // 考え中の相槌を入れる（短い場合のみ）
      if (text.length < 20) {
        const thinkingResponses = ['えーっと...', 'そうですね...', 'ふむふむ...']
        const thinkingResponse = thinkingResponses[Math.floor(Math.random() * thinkingResponses.length)]
        speakText(thinkingResponse, false)
        await new Promise(resolve => setTimeout(resolve, 800))
      }
      
      const response = await getPersonalizedResponse(text, emotion)
      
      // アシスタントメッセージを保存
      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        userId,
        content: response,
        role: 'assistant',
        timestamp: new Date()
      }
      
      await conversationStorage.saveMessage(assistantMessage)
      setConversationHistory(prev => [...prev, assistantMessage])
      
      // 音声で応答
      speakText(response, true)
    }, responseDelay)
    
    // 相槌のタイミングをランダム化（7-12秒）
    const listeningTimeout = Math.random() * 5000 + 7000
    sessionTimeoutRef.current = setTimeout(() => {
      if (isSessionActiveRef.current && !isSpeaking) {
        playListeningResponse()
      }
    }, listeningTimeout)
  }

  // テキストを音声で読み上げ
  const speakText = (text: string, isMainResponse: boolean = true) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'ja-JP'
        utterance.pitch = currentCharacter.pitch
        utterance.rate = isMainResponse ? currentCharacter.rate : currentCharacter.rate * 1.2
        utterance.volume = isMainResponse ? 1.0 : 0.7
        
        utterance.onstart = () => {
          setConnectionState('speaking')
        }
        
        utterance.onend = () => {
          setConnectionState('listening')
          
          if (isMainResponse && isSessionActiveRef.current) {
            setTimeout(() => {
              if (isSessionActiveRef.current && !isSpeaking) {
                sessionTimeoutRef.current = setTimeout(() => {
                  playListeningResponse()
                }, 5000)
              }
            }, 1000)
          }
        }
        
        utterance.onerror = () => {
          setConnectionState('listening')
        }
        
        synthRef.current = utterance
        window.speechSynthesis.speak(utterance)
      }, 100)
    }
  }

  // オーディオアナライザーの初期化
  const startAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isSessionActiveRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
          setAudioLevel(average / 255)
          
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }
      
      updateAudioLevel()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('マイクへのアクセスを許可してください')
    }
  }

  const stopAudioAnalyser = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop())
      micStreamRef.current = null
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    setAudioLevel(0)
  }

  // セッションの開始/停止
  const toggleSession = async () => {
    if (isSessionActive) {
      // セッション終了
      if (realtimeService.current) {
        await realtimeService.current.disconnect()
        realtimeService.current = null
      } else if (useFallback) {
        isSessionActiveRef.current = false
        if (recognitionRef.current) {
          recognitionRef.current.stop()
        }
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel()
        }
        stopAudioAnalyser()
        if (sessionTimeoutRef.current) {
          clearTimeout(sessionTimeoutRef.current)
        }
      }
      setConnectionState('disconnected')
      setErrorMessage(null)
      
      // セッション終了時にセッションを保存
      if (sessionId) {
        await conversationStorage.saveSession({
          id: sessionId,
          userId,
          messages: conversationHistory,
          startTime: new Date(parseInt(sessionId)),
          endTime: new Date(),
          overallEmotion: currentEmotion || undefined
        })
      }
    } else {
      // セッション開始
      setErrorMessage(null)
      const newSessionId = Date.now().toString()
      setSessionId(newSessionId)
      
      if (isRealtimeAvailable && !useFallback) {
        // Realtime API使用
        try {
          setConnectionState('connecting')
          
          if (!realtimeService.current) {
            realtimeService.current = new RealtimeService()
          }
          
          await realtimeService.current.connect(
            (state) => {
              setConnectionState(state)
            },
            (error) => {
              console.error('Realtime error:', error)
              setErrorMessage(error.message)
              setConnectionState('error')
              
              setTimeout(() => {
                setUseFallback(true)
                setConnectionState('disconnected')
              }, 3000)
            }
          )
        } catch (error) {
          console.error('Failed to start Realtime session:', error)
          setErrorMessage('接続に失敗しました。再度お試しください。')
          setConnectionState('error')
        }
      } else {
        // フォールバック使用
        isSessionActiveRef.current = true
        setConnectionState('listening')
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start()
            startAudioAnalyser()
            
            // パーソナライズされた初回の挨拶
            setTimeout(async () => {
              let greeting = currentCharacter.responses.greeting[0]
              
              // 過去の会話履歴がある場合はカスタマイズ
              if (conversationHistory.length > 0) {
                greeting = `おかえりなさい！また${currentCharacter.name}とお話しできて嬉しいです。`
              }
              
              speakText(greeting, true)
              
              // 挨拶を保存
              const greetingMessage: ConversationMessage = {
                id: (Date.now() + 1).toString(),
                userId,
                content: greeting,
                role: 'assistant',
                timestamp: new Date()
              }
              await conversationStorage.saveMessage(greetingMessage)
              setConversationHistory(prev => [...prev, greetingMessage])
            }, 500)
          } catch (error) {
            console.error('Failed to start recognition:', error)
            isSessionActiveRef.current = false
            setConnectionState('disconnected')
          }
        }
      }
    }
  }

  // 鳥キャラクターコンポーネント
  const BirdCharacter = ({ bodyColor, bellyColor, size = 30 }: { bodyColor: string, bellyColor: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <ellipse cx="50" cy="55" rx="35" ry="38" fill={bodyColor} />
      <ellipse cx="50" cy="60" rx="25" ry="28" fill={bellyColor} />
      <ellipse cx="25" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(-20 25 50)" />
      <ellipse cx="75" cy="50" rx="15" ry="25" fill={bodyColor} transform="rotate(20 75 50)" />
      <circle cx="40" cy="45" r="6" fill="white" />
      <circle cx="42" cy="45" r="4" fill="#111827" />
      <circle cx="43" cy="44" r="2" fill="white" />
      <circle cx="60" cy="45" r="6" fill="white" />
      <circle cx="58" cy="45" r="4" fill="#111827" />
      <circle cx="59" cy="44" r="2" fill="white" />
      <path d="M50 52 L45 57 L55 57 Z" fill="#fbbf24" />
    </svg>
  )

  // 感情インジケーター
  const EmotionIndicator = () => {
    if (!currentEmotion) return null

    const emotionColors = {
      joy: '#fbbf24',
      sadness: '#60a5fa',
      anger: '#ef4444',
      fear: '#a78bfa',
      surprise: '#f472b6',
      love: '#f87171',
      neutral: '#9ca3af'
    }

    const emotionEmojis = {
      joy: '😊',
      sadness: '😢',
      anger: '😠',
      fear: '😰',
      surprise: '😮',
      love: '❤️',
      neutral: '😐'
    }

    return (
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(31, 41, 55, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '8px 12px',
        border: `1px solid ${emotionColors[currentEmotion.primary]}40`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '20px' }}>
          {emotionEmojis[currentEmotion.primary]}
        </span>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: emotionColors[currentEmotion.primary],
          animation: 'pulse 2s infinite'
        }} />
        <span style={{
          fontSize: '12px',
          color: emotionColors[currentEmotion.primary],
          fontWeight: '500'
        }}>
          {Math.round(currentEmotion.confidence * 100)}%
        </span>
      </div>
    )
  }

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* ヘッダー */}
      <div style={{ 
        background: `linear-gradient(180deg, ${currentCharacter.color}10 0%, #111827 100%)`,
        borderBottom: '1px solid #374151', 
        flexShrink: 0,
        position: 'relative'
      }}>
        {/* 感情インジケーター */}
        <EmotionIndicator />
        
        <div style={{ 
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* メインキャラクターアバター */}
          <div style={{
            width: '56px',
            height: '56px',
            backgroundColor: currentCharacter.color + '20',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${currentCharacter.color}`,
            boxShadow: `0 4px 12px ${currentCharacter.color}30`,
            animation: 'float 3s ease-in-out infinite',
            flexShrink: 0
          }}>
            <BirdCharacter 
              bodyColor={currentCharacter.bodyColor} 
              bellyColor={currentCharacter.bellyColor}
              size={40}
            />
          </div>
          
          {/* キャラクター情報と切り替え */}
          <div style={{ 
            flex: 1,
            minWidth: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px'
            }}>
              <h2 style={{
                ...getTypographyStyles('base'),
                fontWeight: '700',
                color: currentCharacter.color,
                margin: 0,
                fontSize: '16px'
              }}>
                {currentCharacter.name}と音声対話
              </h2>
              <div style={{
                width: '5px',
                height: '5px',
                backgroundColor: isSessionActive ? '#a3e635' : '#6b7280',
                borderRadius: '50%',
                animation: isSessionActive ? 'pulse 2s ease-in-out infinite' : 'none',
                flexShrink: 0
              }}></div>
            </div>
            
            {/* キャラクター切り替えボタン */}
            <div style={{
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap'
            }}>
              {Object.entries(characters).filter(([key]) => key !== selectedCharacter).map(([key, char]) => (
                <button
                  key={key}
                  onClick={() => {
                    if (!isSessionActive) {
                      setSelectedCharacter(key)
                    }
                  }}
                  disabled={isSessionActive}
                  style={{
                    padding: '3px 6px',
                    backgroundColor: 'rgba(31, 41, 55, 0.6)',
                    color: '#9ca3af',
                    borderRadius: '6px',
                    border: '1px solid rgba(55, 65, 81, 0.5)',
                    fontSize: '10px',
                    fontWeight: '500',
                    cursor: isSessionActive ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    whiteSpace: 'nowrap',
                    opacity: isSessionActive ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSessionActive) {
                      e.currentTarget.style.backgroundColor = char.color + '30'
                      e.currentTarget.style.borderColor = char.color
                      e.currentTarget.style.color = '#f3f4f6'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.5)'
                    e.currentTarget.style.color = '#9ca3af'
                  }}
                >
                  <BirdCharacter 
                    bodyColor={char.bodyColor} 
                    bellyColor={char.bellyColor}
                    size={14}
                  />
                  <span>{char.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        height: 'calc(85vh - 88px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 20px',
        position: 'relative',
        background: 'linear-gradient(180deg, transparent 0%, rgba(31, 41, 55, 0.2) 100%)'
      }}>
        {/* 現在の文字起こし表示 */}
        {currentTranscript && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(31, 41, 55, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid rgba(55, 65, 81, 0.5)'
          }}>
            <p style={{
              ...getTypographyStyles('small'),
              color: '#f3f4f6',
              margin: 0
            }}>
              「{currentTranscript}」
            </p>
          </div>
        )}

        {/* Upper Section - Character and Status */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Character Avatar with speech bubble style */}
          <div style={{
            position: 'relative'
          }}>
            {/* Remove speech bubble */}
            
            <div style={{
              width: '140px',
              height: '140px',
              backgroundColor: currentCharacter.color + '20',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `3px solid ${currentCharacter.color}`,
              boxShadow: `0 8px 24px ${currentCharacter.color}30`,
              position: 'relative',
              animation: isSessionActive ? 'float 3s ease-in-out infinite' : 'none'
            }}>
              <BirdCharacter 
                bodyColor={currentCharacter.bodyColor} 
                bellyColor={currentCharacter.bellyColor}
                size={100}
              />
              {/* Active indicator - more subtle */}
              {isSessionActive && (
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: isListening ? '#10b981' : isSpeaking ? currentCharacter.color : '#6b7280',
                  borderRadius: '50%',
                  border: '2px solid #111827',
                  animation: isListening ? 'pulse 2s ease-in-out infinite' : 'none',
                  transition: 'background-color 0.3s ease'
                }} />
              )}
            </div>
          </div>

          {/* Status Text - Only show when connecting or error */}
          {(connectionState === 'connecting' || connectionState === 'error') && (
            <div style={{
              marginTop: '12px'
            }}>
              <p style={{
                ...getTypographyStyles('small'),
                color: connectionState === 'error' ? '#ef4444' : currentCharacter.color,
                fontWeight: '500',
                margin: 0,
                opacity: 0.9
              }}>
                {connectionState === 'connecting' && '接続中...'}
                {connectionState === 'error' && 'エラー'}
              </p>
            </div>
          )}
        </div>

        {/* Center Section - Waveform */}
        <div style={{
          width: '100%',
          maxWidth: '280px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '8px',
          background: 'rgba(31, 41, 55, 0.3)',
          borderRadius: '25px',
          border: '1px solid rgba(55, 65, 81, 0.2)'
        }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const height = isListening 
              ? Math.max(6, audioLevel * 35 + Math.random() * 15)
              : isSpeaking
              ? Math.max(8, Math.sin(Date.now() / 100 + i) * 15 + 15)
              : 6
            
            return (
              <div
                key={i}
                style={{
                  width: '3px',
                  height: `${height}px`,
                  background: (isListening || isSpeaking) 
                    ? `linear-gradient(180deg, ${currentCharacter.color}, ${currentCharacter.color}60)`
                    : 'rgba(156, 163, 175, 0.2)',
                  borderRadius: '2px',
                  transition: 'height 0.1s ease'
                }}
              />
            )
          })}
        </div>

        {/* Bottom Section - Control Button */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={toggleSession}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isSessionActive 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : `linear-gradient(135deg, ${currentCharacter.color}, ${currentCharacter.color}dd)`,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isSessionActive 
                ? '0 0 40px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(0,0,0,0.2)'
                : `0 0 40px ${currentCharacter.color}40, inset 0 2px 4px rgba(255,255,255,0.2)`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isSessionActive ? 'scale(1.1)' : 'scale(1)',
              position: 'relative',
              animation: !isSessionActive ? 'gentlePulse 3s ease-in-out infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = isSessionActive ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {isSessionActive ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <rect x="7" y="7" width="10" height="10" rx="1" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <defs>
                  <linearGradient id="micGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="1" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path d="M12 2C10.9 2 10 2.9 10 4V12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12V4C14 2.9 13.1 2 12 2Z" fill="url(#micGradient)"/>
                <path d="M17 11V12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12V11" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M12 17V21M9 21H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
            
            {/* Pulse rings */}
            {isSessionActive && (
              <>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '-4px',
                  right: '-4px',
                  bottom: '-4px',
                  border: '2px solid #ef4444',
                  borderRadius: '50%',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  right: '-8px',
                  bottom: '-8px',
                  border: '1px solid #ef4444',
                  borderRadius: '50%',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s',
                  opacity: 0.5
                }} />
              </>
            )}
          </button>
          
          {/* Remove the tap instruction text */}
        </div>
        
        {/* エラーメッセージ */}
        {errorMessage && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px'
          }}>
            <p style={{
              ...getTypographyStyles('small'),
              color: '#ef4444',
              margin: 0,
              textAlign: 'center'
            }}>
              {errorMessage}
            </p>
          </div>
        )}
        
        {/* フォールバックモード通知 */}
        {useFallback && isSessionActive && (
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '20px',
            right: '20px',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '12px',
            padding: '8px 12px'
          }}>
            <p style={{
              ...getTypographyStyles('caption'),
              color: '#fbbf24',
              margin: 0,
              textAlign: 'center'
            }}>
              シンプルモードで動作中
            </p>
          </div>
        )}
      </div>

      <MobileBottomNav />
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.95);
          }
        }
        
        @keyframes gentlePulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 40px ${currentCharacter.color}40;
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 50px ${currentCharacter.color}60;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
        
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}