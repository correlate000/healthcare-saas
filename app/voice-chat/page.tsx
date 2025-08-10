'use client'

import { useState, useEffect, useRef } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function VoiceChatPage() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState('luna')
  const [audioLevel, setAudioLevel] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isSessionActiveRef = useRef(false)

  // キャラクター設定（チャットページと統一）
  const characters = {
    luna: {
      id: 'luna',
      name: 'るな',
      color: '#a3e635',
      bodyColor: '#a3e635',
      bellyColor: '#ecfccb',
      pitch: 1.2,
      rate: 0.95,
      responses: {
        greeting: ['こんにちは！今日の調子はいかがですか？', '元気でしたか？お話を聞かせてください'],
        encouragement: ['それは素晴らしいですね！', 'いいですね、その調子です'],
        advice: ['ゆっくり休息を取ることも大切ですよ', '深呼吸をして、リラックスしてみましょう'],
        listening: ['なるほど', 'そうなんですね', 'うんうん', 'へぇ〜']
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
      responses: {
        greeting: ['やっほー！元気してた？', 'わーい！今日も楽しく話そう！'],
        encouragement: ['やったー！その調子！', 'すごいすごい！'],
        advice: ['大丈夫！きっと明日はもっと良い日になるよ！', '一緒に頑張ろう！'],
        listening: ['うんうん！', 'へぇ〜すごい！', 'それで？それで？', 'わくわく！']
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
      responses: {
        greeting: ['こんにちは。今日はゆっくり話しましょう', '心を落ち着けて、お話ししませんか'],
        encouragement: ['素晴らしい気づきですね', '良い流れを感じます'],
        advice: ['今この瞬間に意識を向けてみましょう', '呼吸に集中してみてください'],
        listening: ['ふむふむ', 'なるほど...', 'そうですか', '興味深いですね']
      }
    }
  }

  const currentCharacter = characters[selectedCharacter as keyof typeof characters]

  // 音声認識の初期化
  useEffect(() => {
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
          console.log('User said:', finalTranscript, 'Session active:', isSessionActiveRef.current)
          if (isSessionActiveRef.current) {
            handleUserMessage(finalTranscript)
          }
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech') {
          // 無音の場合は継続
          if (isSessionActiveRef.current) {
            console.log('No speech detected, playing listening response')
            playListeningResponse()
          }
        }
      }
      
      recognition.onend = () => {
        console.log('Recognition ended, session active:', isSessionActiveRef.current)
        // セッション中は自動的に再開
        if (isSessionActiveRef.current) {
          try {
            recognition.start()
            console.log('Recognition restarted')
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
  }, [])

  // 相槌を打つ
  const playListeningResponse = () => {
    console.log('playListeningResponse called, isSpeaking:', isSpeaking, 'isSessionActive:', isSessionActiveRef.current)
    if (!isSpeaking && isSessionActiveRef.current) {
      const responses = currentCharacter.responses.listening
      const response = responses[Math.floor(Math.random() * responses.length)]
      speakText(response, false)
    }
  }

  // ユーザーメッセージの処理
  const handleUserMessage = (text: string) => {
    // セッションタイムアウトをリセット
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current)
    }
    
    // 10秒間無音だったら相槌を打つ
    sessionTimeoutRef.current = setTimeout(() => {
      if (isSessionActiveRef.current && !isSpeaking) {
        console.log('10 seconds of silence, playing listening response')
        playListeningResponse()
      }
    }, 10000)
    
    // AI応答を生成
    generateAIResponse(text)
  }

  // AI応答の生成
  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase()
    let responseType: keyof typeof currentCharacter.responses = 'listening'
    
    if (input.includes('こんにちは') || input.includes('はじめ') || input.includes('ハロー')) {
      responseType = 'greeting'
    } else if (input.includes('疲れ') || input.includes('つらい') || input.includes('しんどい')) {
      responseType = 'advice'
    } else if (input.includes('頑張') || input.includes('元気') || input.includes('楽しい')) {
      responseType = 'encouragement'
    }
    
    const responses = currentCharacter.responses[responseType]
    const response = responses[Math.floor(Math.random() * responses.length)]
    
    speakText(response, true)
  }

  // テキストを音声で読み上げ
  const speakText = (text: string, isMainResponse: boolean = true) => {
    console.log('speakText called:', text, 'isMainResponse:', isMainResponse, 'isSessionActive:', isSessionActiveRef.current)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'ja-JP'
        utterance.pitch = currentCharacter.pitch
        utterance.rate = isMainResponse ? currentCharacter.rate : currentCharacter.rate * 1.2
        utterance.volume = isMainResponse ? 1.0 : 0.7
        
        utterance.onstart = () => {
          setIsSpeaking(true)
          console.log('Speaking:', text)
        }
        
        utterance.onend = () => {
          setIsSpeaking(false)
          console.log('Finished speaking')
          
          // メイン応答後は少し待ってから次の相槌の準備
          if (isMainResponse && isSessionActiveRef.current) {
            setTimeout(() => {
              if (isSessionActiveRef.current && !isSpeaking) {
                // 5秒後に相槌を打つ
                sessionTimeoutRef.current = setTimeout(() => {
                  console.log('5 seconds after main response, playing listening response')
                  playListeningResponse()
                }, 5000)
              }
            }, 1000)
          }
        }
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event)
          setIsSpeaking(false)
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
  const toggleSession = () => {
    if (isSessionActive) {
      // セッション終了
      setIsSessionActive(false)
      isSessionActiveRef.current = false
      setIsListening(false)
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
      console.log('Session ended')
    } else {
      // セッション開始
      setIsSessionActive(true)
      isSessionActiveRef.current = true
      setIsListening(true)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
          startAudioAnalyser()
          // 初回の挨拶
          setTimeout(() => {
            console.log('Playing initial greeting')
            generateAIResponse('こんにちは')
          }, 500)
          console.log('Session started')
        } catch (error) {
          console.error('Failed to start recognition:', error)
          setIsSessionActive(false)
          isSessionActiveRef.current = false
          setIsListening(false)
        }
      }
    }
  }

  // 鳥キャラクターコンポーネント（チャットページと同じデザイン）
  const BirdCharacter = ({ size = 180 }: { size?: number }) => {
    const scale = size / 100
    const time = Date.now() / 1000
    const bounceHeight = isSpeaking ? Math.sin(time * 4) * 5 : 0
    const wingFlap = isListening ? Math.sin(time * 8) * 10 : 0
    
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100"
        style={{
          transform: `translateY(${bounceHeight}px)`,
          transition: 'transform 0.1s ease'
        }}
      >
        {/* 体 */}
        <ellipse cx="50" cy="55" rx="35" ry="38" fill={currentCharacter.bodyColor} />
        
        {/* お腹 */}
        <ellipse cx="50" cy="60" rx="25" ry="28" fill={currentCharacter.bellyColor} />
        
        {/* 左羽 */}
        <ellipse 
          cx="25" 
          cy="50" 
          rx="15" 
          ry="25" 
          fill={currentCharacter.bodyColor} 
          transform={`rotate(${-20 + wingFlap} 25 50)`}
        />
        
        {/* 右羽 */}
        <ellipse 
          cx="75" 
          cy="50" 
          rx="15" 
          ry="25" 
          fill={currentCharacter.bodyColor} 
          transform={`rotate(${20 - wingFlap} 75 50)`}
        />
        
        {/* 左目 */}
        <circle cx="40" cy="45" r="6" fill="white" />
        <circle 
          cx={isListening ? "40" : "42"} 
          cy="45" 
          r={isSpeaking ? "3" : "4"} 
          fill="#111827" 
        />
        <circle cx="43" cy="44" r="2" fill="white" />
        
        {/* 右目 */}
        <circle cx="60" cy="45" r="6" fill="white" />
        <circle 
          cx={isListening ? "60" : "58"} 
          cy="45" 
          r={isSpeaking ? "3" : "4"} 
          fill="#111827" 
        />
        <circle cx="59" cy="44" r="2" fill="white" />
        
        {/* くちばし */}
        {isSpeaking ? (
          <ellipse 
            cx="50" 
            cy="55" 
            rx={4 + Math.sin(time * 10) * 2} 
            ry={3 + Math.sin(time * 10) * 2} 
            fill="#fbbf24" 
          />
        ) : (
          <path d="M50 52 L45 57 L55 57 Z" fill="#fbbf24" />
        )}
        
        {/* 音波エフェクト */}
        {(isListening || isSpeaking) && (
          <>
            <circle 
              cx="50" 
              cy="55" 
              r="45" 
              fill="none" 
              stroke={currentCharacter.color} 
              strokeWidth="1" 
              opacity="0.3"
            >
              <animate 
                attributeName="r" 
                from="45" 
                to="60" 
                dur="2s" 
                repeatCount="indefinite"
              />
              <animate 
                attributeName="opacity" 
                from="0.3" 
                to="0" 
                dur="2s" 
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </svg>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          <h1 style={{
            ...getTypographyStyles('h3'),
            margin: 0,
            fontWeight: '700',
            color: currentCharacter.color
          }}>
            {currentCharacter.name}と対話
          </h1>
          <p style={{
            ...getTypographyStyles('small'),
            color: '#94a3b8',
            margin: '4px 0 0 0'
          }}>
            {isSessionActive ? (isListening ? '聞いています...' : isSpeaking ? '話しています...' : '対話中...') : 'マイクボタンをタップ'}
          </p>
        </div>
        
        {/* Character Selector */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '8px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '24px'
        }}>
          {Object.entries(characters).map(([key, char]) => (
            <button
              key={key}
              onClick={() => {
                if (!isSessionActive) {
                  setSelectedCharacter(key)
                }
              }}
              disabled={isSessionActive}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: selectedCharacter === key 
                  ? `linear-gradient(135deg, ${char.color}, ${char.color}dd)` 
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#1e293b',
                fontSize: '12px',
                fontWeight: '600',
                cursor: isSessionActive ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: selectedCharacter === key ? 'scale(1.1)' : 'scale(1)',
                opacity: isSessionActive ? 0.5 : 1
              }}
              title={char.name}
            >
              {char.name.slice(0, 2)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 20px 100px 20px',
        gap: '20px'
      }}>
        {/* Character Avatar */}
        <div style={{
          position: 'relative'
        }}>
          <BirdCharacter size={180} />
        </div>

        {/* Audio Waveform */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60px',
          gap: '3px',
          padding: '0 40px'
        }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const height = isListening 
              ? Math.max(4, audioLevel * 50 + Math.random() * 20)
              : isSpeaking
              ? Math.max(8, Math.sin(Date.now() / 100 + i) * 20 + 20)
              : 4
            
            return (
              <div
                key={i}
                style={{
                  width: '3px',
                  height: `${height}px`,
                  background: (isListening || isSpeaking) ? currentCharacter.color : 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                  transition: 'all 0.1s ease'
                }}
              />
            )
          })}
        </div>

        {/* Session Control Button */}
        <button
          onClick={toggleSession}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isSessionActive 
              ? `linear-gradient(135deg, #ef4444, #dc2626)`
              : `linear-gradient(135deg, ${currentCharacter.color}, ${currentCharacter.color}dd)`,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isSessionActive 
              ? '0 0 0 0 rgba(239, 68, 68, 0.4), 0 0 0 15px rgba(239, 68, 68, 0.2), 0 0 0 30px rgba(239, 68, 68, 0.1)'
              : `0 4px 20px ${currentCharacter.color}40`,
            transition: 'all 0.3s ease',
            transform: isSessionActive ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          {isSessionActive ? (
            <div style={{
              width: '30px',
              height: '30px',
              background: 'white',
              borderRadius: '6px'
            }} />
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="12" rx="3" 
                fill="white"
              />
              <path d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
              <path d="M12 19V22M8 22H16" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {!isSessionActive && (
          <p style={{
            ...getTypographyStyles('small'),
            color: '#64748b',
            textAlign: 'center'
          }}>
            マイクボタンをタップして対話を開始
          </p>
        )}
      </div>

      <MobileBottomNav />
    </div>
  )
}