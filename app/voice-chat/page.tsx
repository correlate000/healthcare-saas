'use client'

import { useState, useEffect, useRef } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'
import { RealtimeService, ConnectionState } from '@/lib/realtime-service'

export default function VoiceChatPage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
  const [selectedCharacter, setSelectedCharacter] = useState('luna')
  const [audioLevel, setAudioLevel] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRealtimeAvailable, setIsRealtimeAvailable] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  
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

  // Realtime API利用可能チェック
  useEffect(() => {
    const checkRealtimeAvailability = async () => {
      try {
        // 直接メインのエンドポイントを試す
        const response = await fetch('/api/realtime', { method: 'GET' })
        
        if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data)
          
          if (data.client_secret || data.url) {
            setIsRealtimeAvailable(true)
            console.log('Realtime API is available')
          } else {
            setIsRealtimeAvailable(false)
            setUseFallback(true)
            console.log('API response missing required fields')
          }
        } else {
          console.log('API returned error status:', response.status)
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
    console.log('=== handleUserMessage called with:', text)
    
    // セッションタイムアウトをリセット
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current)
    }
    
    // AI応答を生成（即座に）
    setTimeout(() => {
      generateAIResponse(text)
    }, 300)
    
    // 10秒間無音だったら相槌を打つ
    sessionTimeoutRef.current = setTimeout(() => {
      if (isSessionActiveRef.current && !isSpeaking) {
        console.log('10 seconds of silence, playing listening response')
        playListeningResponse()
      }
    }, 10000)
  }

  // AI応答の生成
  const generateAIResponse = (userInput: string) => {
    console.log('=== generateAIResponse called with:', userInput)
    const input = userInput.toLowerCase()
    let responseType: keyof typeof currentCharacter.responses = 'listening'
    
    if (input.includes('こんにちは') || input.includes('はじめ') || input.includes('ハロー')) {
      responseType = 'greeting'
    } else if (input.includes('疲れ') || input.includes('つらい') || input.includes('しんどい')) {
      responseType = 'advice'
    } else if (input.includes('頑張') || input.includes('元気') || input.includes('楽しい')) {
      responseType = 'encouragement'
    }
    
    console.log('Response type:', responseType)
    const responses = currentCharacter.responses[responseType]
    const response = responses[Math.floor(Math.random() * responses.length)]
    console.log('Selected response:', response)
    
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
          setConnectionState('speaking')
          console.log('Speaking:', text)
        }
        
        utterance.onend = () => {
          setConnectionState('listening')
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
        // フォールバック時の終了処理
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
      console.log('Session ended')
    } else {
      // セッション開始
      setErrorMessage(null)
      
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
              console.log('Connection state:', state)
            },
            (error) => {
              console.error('Realtime error:', error)
              setErrorMessage(error.message)
              setConnectionState('error')
              
              // エラー時はフォールバックに切り替え
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
            // 初回の挨拶
            setTimeout(() => {
              console.log('Playing initial greeting')
              generateAIResponse('こんにちは')
            }, 500)
            console.log('Fallback session started')
          } catch (error) {
            console.error('Failed to start recognition:', error)
            isSessionActiveRef.current = false
            setConnectionState('disconnected')
          }
        }
      }
    }
  }

  // 鳥キャラクターコンポーネント（チャットページと同じデザイン）
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
      {/* ヘッダー - チャット画面と統一 */}
      <div style={{ 
        background: `linear-gradient(180deg, ${currentCharacter.color}10 0%, #111827 100%)`,
        borderBottom: '1px solid #374151', 
        flexShrink: 0 
      }}>
        <div style={{ 
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* メインキャラクターアバター（SPサイズ調整） */}
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
            
            {/* キャラクター切り替えボタン（SP最適化） */}
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

      {/* Main Content - スクロール不要に最適化 */}
      <div style={{
        height: 'calc(85vh - 88px)', // 85vh minus header height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 20px',
        position: 'relative',
        background: 'linear-gradient(180deg, transparent 0%, rgba(31, 41, 55, 0.2) 100%)'
      }}>
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
            {/* Speech bubble when speaking */}
            {isSpeaking && (
              <div style={{
                position: 'absolute',
                top: '-45px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: currentCharacter.color,
                color: '#0f172a',
                padding: '10px 20px',
                borderRadius: '24px',
                fontSize: '15px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                animation: 'bounce 1s ease-in-out infinite',
                boxShadow: `0 4px 12px ${currentCharacter.color}40`
              }}>
                {['なるほど！', 'そうなんですね', 'いいですね！'][Math.floor(Date.now() / 2000) % 3]}
              </div>
            )}
            
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
              {/* Active indicator */}
              {isSessionActive && (
                <div style={{
                  position: 'absolute',
                  bottom: '0px',
                  right: '0px',
                  width: '32px',
                  height: '32px',
                  backgroundColor: isListening ? '#a3e635' : '#ef4444',
                  borderRadius: '50%',
                  border: '3px solid #111827',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
              )}
            </div>
          </div>

          {/* Status Card */}
          <div style={{
            background: 'rgba(31, 41, 55, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px 24px',
            border: `1px solid ${isSessionActive ? currentCharacter.color + '30' : 'rgba(55, 65, 81, 0.3)'}`,
            textAlign: 'center',
            minWidth: '200px'
          }}>
            <p style={{
              ...getTypographyStyles('base'),
              color: isSessionActive ? currentCharacter.color : '#9ca3af',
              fontWeight: '600',
              margin: 0
            }}>
              {connectionState === 'disconnected' && '🎙️ 音声対話を開始'}
              {connectionState === 'connecting' && '⏳ 接続中...'}
              {connectionState === 'connected' && '🔐 認証中...'}
              {connectionState === 'authenticated' && '✅ 準備完了'}
              {connectionState === 'listening' && '👂 聞いています'}
              {connectionState === 'speaking' && '💬 話しています'}
              {connectionState === 'error' && '❌ エラー'}
            </p>
          </div>
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
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = isSessionActive ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {isSessionActive ? (
              // Modern stop icon
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <rect x="7" y="7" width="10" height="10" rx="1" />
              </svg>
            ) : (
              // Beautiful mic icon with gradient
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
          
          {!isSessionActive && (
            <p style={{
              ...getTypographyStyles('small'),
              color: '#6b7280',
              textAlign: 'center'
            }}>
              タップして音声対話を開始
            </p>
          )}
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
            top: '20px',
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