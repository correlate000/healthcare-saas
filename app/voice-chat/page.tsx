'use client'

import { useState, useEffect, useRef } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { getTypographyStyles } from '@/styles/typography'
import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'

export default function VoiceChatPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState('luna')
  const [audioLevel, setAudioLevel] = useState(0)
  const [currentResponse, setCurrentResponse] = useState('')
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isListeningRef = useRef(false)

  // キャラクター設定
  const characters = {
    luna: {
      name: 'ルナ',
      color: '#10b981',
      personality: 'gentle',
      pitch: 1.2,
      rate: 0.9,
      emoji: '🌙',
      eyeColor: '#064e3b',
      responses: {
        greeting: ['こんにちは！今日はどんな気分ですか？', 'お会いできて嬉しいです！何かお話ししましょう'],
        encouragement: ['大丈夫ですよ、一緒に頑張りましょう', 'あなたの気持ち、よく分かります'],
        advice: ['深呼吸してみましょう', 'ゆっくり休むことも大切ですよ']
      }
    },
    aria: {
      name: 'アリア',
      color: '#3b82f6',
      personality: 'energetic',
      pitch: 1.3,
      rate: 1.0,
      emoji: '⭐',
      eyeColor: '#1e3a8a',
      responses: {
        greeting: ['やっほー！元気してた？', 'わーい！話そう話そう！'],
        encouragement: ['頑張ってるね！すごいよ！', '一緒なら何でもできるよ！'],
        advice: ['楽しいこと考えよう！', '笑顔が一番の薬だよ！']
      }
    },
    kai: {
      name: 'カイ',
      color: '#8b5cf6',
      personality: 'calm',
      pitch: 1.0,
      rate: 0.85,
      emoji: '🌊',
      eyeColor: '#4c1d95',
      responses: {
        greeting: ['こんにちは。今日はゆっくり話しましょう', 'お疲れ様です。何かお悩みはありますか？'],
        encouragement: ['焦らず、自分のペースで大丈夫ですよ', '今日も一歩前進ですね'],
        advice: ['心を落ち着けて、今この瞬間を感じてみましょう', '時には立ち止まることも大切です']
      }
    }
  }

  const currentCharacter = characters[selectedCharacter as keyof typeof characters]

  // 音声認識の初期化
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'ja-JP'
      
      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(interimTranscript || finalTranscript)
        
        if (finalTranscript) {
          handleUserMessage(finalTranscript)
          setTranscript('')
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech') {
          console.log('No speech detected')
        }
        setIsListening(false)
        isListeningRef.current = false
        stopAudioAnalyser()
      }
      
      recognition.onend = () => {
        setIsListening(false)
        isListeningRef.current = false
        stopAudioAnalyser()
      }
      
      recognitionRef.current = recognition
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

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
        if (analyserRef.current && isListeningRef.current) {
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

  // ユーザーメッセージの処理
  const handleUserMessage = (text: string) => {
    console.log('User said:', text)
    
    // 音声認識を停止
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    // AI応答を生成
    setTimeout(() => {
      generateAIResponse(text)
    }, 500)
  }

  // AI応答の生成
  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase()
    let responseType: keyof typeof currentCharacter.responses = 'encouragement'
    
    if (input.includes('こんにちは') || input.includes('はじめ') || input.includes('ハロー')) {
      responseType = 'greeting'
    } else if (input.includes('疲れ') || input.includes('つらい') || input.includes('しんどい')) {
      responseType = 'advice'
    }
    
    const responses = currentCharacter.responses[responseType]
    const response = responses[Math.floor(Math.random() * responses.length)]
    
    setCurrentResponse(response)
    speakText(response)
  }

  // テキストを音声で読み上げ
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // 既存の音声をキャンセル
      window.speechSynthesis.cancel()
      
      // 少し待ってから音声を開始（キャンセル処理を確実に）
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'ja-JP'
        utterance.pitch = currentCharacter.pitch
        utterance.rate = currentCharacter.rate
        utterance.volume = 1.0
        
        utterance.onstart = () => {
          setIsSpeaking(true)
          console.log('Speaking started:', text)
        }
        
        utterance.onend = () => {
          setIsSpeaking(false)
          setCurrentResponse('')
          console.log('Speaking finished')
          
          // 自動的に次のリスニングを開始（連続対話モード）
          setTimeout(() => {
            if (!isListening && recognitionRef.current) {
              console.log('Auto-starting next listening session')
              startListening()
            }
          }, 500)
        }
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event)
          setIsSpeaking(false)
          setCurrentResponse('')
          alert('音声合成エラー: ' + event.error)
        }
        
        synthRef.current = utterance
        
        // 音声を再生
        try {
          window.speechSynthesis.speak(utterance)
          console.log('Speech synthesis started successfully')
        } catch (error) {
          console.error('Failed to start speech synthesis:', error)
          setIsSpeaking(false)
          setCurrentResponse('')
        }
      }, 100)
    } else {
      console.error('Speech synthesis not supported')
      alert('お使いのブラウザは音声合成に対応していません')
    }
  }

  // 音声認識の開始/停止
  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isSpeaking) {
      try {
        setTranscript('')
        setIsListening(true)
        isListeningRef.current = true
        recognitionRef.current.start()
        startAudioAnalyser()
        console.log('Started listening')
      } catch (error) {
        console.error('Error starting recognition:', error)
        setIsListening(false)
        isListeningRef.current = false
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      isListeningRef.current = false
      stopAudioAnalyser()
      console.log('Stopped listening')
    }
  }

  // キャラクターアバターコンポーネント
  const CharacterAvatar = () => {
    const time = Date.now() / 1000
    const bounceHeight = isSpeaking ? Math.sin(time * 3) * 5 : 0
    const scaleEffect = isSpeaking ? 1 + Math.sin(time * 6) * 0.05 : 1
    
    return (
      <svg 
        width="180" 
        height="180" 
        viewBox="0 0 100 100"
        style={{
          transform: `translateY(${bounceHeight}px) scale(${scaleEffect})`,
          transition: 'transform 0.1s ease'
        }}
      >
        {/* 背景の光 */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill={currentCharacter.color} 
          opacity="0.2"
        >
          {(isListening || isSpeaking) && (
            <animate 
              attributeName="r" 
              from="45" 
              to="48" 
              dur="1s" 
              repeatCount="indefinite"
            />
          )}
        </circle>
        
        {/* メインボディ */}
        <circle 
          cx="50" 
          cy="50" 
          r="35" 
          fill={currentCharacter.color}
        />
        
        {/* 顔 */}
        <ellipse 
          cx="50" 
          cy="48" 
          rx="28" 
          ry="26" 
          fill="white"
        />
        
        {/* 目 */}
        {isListening ? (
          // 聞いている時の目（大きく開いた目）
          <>
            <circle cx="40" cy="45" r="8" fill={currentCharacter.eyeColor}/>
            <circle cx="60" cy="45" r="8" fill={currentCharacter.eyeColor}/>
            <circle cx="40" cy="45" r="4" fill="white" opacity="0.8"/>
            <circle cx="60" cy="45" r="4" fill="white" opacity="0.8"/>
            <circle cx="41" cy="44" r="2" fill="white"/>
            <circle cx="61" cy="44" r="2" fill="white"/>
          </>
        ) : isSpeaking ? (
          // 話している時の目（ウインク風）
          <>
            <path 
              d="M 35 45 Q 40 42 45 45" 
              stroke={currentCharacter.eyeColor} 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
            />
            <circle cx="60" cy="45" r="7" fill={currentCharacter.eyeColor}/>
            <circle cx="60" cy="45" r="3" fill="white" opacity="0.8"/>
            <circle cx="61" cy="44" r="1.5" fill="white"/>
          </>
        ) : (
          // 通常の目
          <>
            <circle cx="40" cy="45" r="6" fill={currentCharacter.eyeColor}/>
            <circle cx="60" cy="45" r="6" fill={currentCharacter.eyeColor}/>
            <circle cx="40" cy="45" r="3" fill="black"/>
            <circle cx="60" cy="45" r="3" fill="black"/>
            <circle cx="41" cy="44" r="1.5" fill="white"/>
            <circle cx="61" cy="44" r="1.5" fill="white"/>
          </>
        )}
        
        {/* ほっぺ */}
        <ellipse 
          cx="25" 
          cy="52" 
          rx="8" 
          ry="5" 
          fill={currentCharacter.color} 
          opacity="0.3"
        />
        <ellipse 
          cx="75" 
          cy="52" 
          rx="8" 
          ry="5" 
          fill={currentCharacter.color} 
          opacity="0.3"
        />
        
        {/* 口 */}
        {isSpeaking ? (
          // 話している時の口（開いた口）
          <ellipse 
            cx="50" 
            cy="58" 
            rx={8 + Math.sin(time * 10) * 3} 
            ry={6 + Math.sin(time * 10) * 4} 
            fill={currentCharacter.eyeColor} 
            opacity="0.8"
          />
        ) : isListening ? (
          // 聞いている時の口（驚いた口）
          <ellipse 
            cx="50" 
            cy="58" 
            rx="6" 
            ry="8" 
            fill={currentCharacter.eyeColor} 
            opacity="0.6"
          />
        ) : (
          // 通常の口（笑顔）
          <path 
            d="M 40 56 Q 50 62 60 56" 
            stroke={currentCharacter.eyeColor} 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round"
          />
        )}
        
        {/* アクセサリー（キャラクターごとの特徴） */}
        {selectedCharacter === 'luna' && (
          // 月の飾り
          <path 
            d="M 70 25 Q 65 20 65 25 Q 65 30 70 25" 
            fill="#fbbf24" 
            opacity="0.8"
          />
        )}
        {selectedCharacter === 'aria' && (
          // 星の飾り
          <>
            <path 
              d="M 30 20 L 32 24 L 36 24 L 33 27 L 34 31 L 30 28 L 26 31 L 27 27 L 24 24 L 28 24 Z" 
              fill="#fbbf24"
            />
          </>
        )}
        {selectedCharacter === 'kai' && (
          // 波の模様
          <path 
            d="M 20 70 Q 25 68 30 70 T 40 70" 
            stroke="#60a5fa" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.6"
          />
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
            background: `linear-gradient(135deg, ${currentCharacter.color}, ${currentCharacter.color}dd)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {currentCharacter.name}と対話
          </h1>
          <p style={{
            ...getTypographyStyles('small'),
            color: '#94a3b8',
            margin: '4px 0 0 0'
          }}>
            {isListening ? '聞いています...' : isSpeaking ? '話しています...' : 'マイクボタンをタップ'}
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
                setSelectedCharacter(key)
                if (isSpeaking) {
                  window.speechSynthesis.cancel()
                  setIsSpeaking(false)
                }
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: selectedCharacter === key 
                  ? `linear-gradient(135deg, ${char.color}, ${char.color}dd)` 
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: selectedCharacter === key ? 'scale(1.1)' : 'scale(1)'
              }}
              title={char.name}
            >
              {char.emoji}
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
        padding: '20px',
        gap: '30px'
      }}>
        {/* Character Avatar */}
        <div style={{
          position: 'relative',
          padding: '20px'
        }}>
          <CharacterAvatar />
          
          {/* Speech Bubble for AI Response */}
          {currentResponse && (
            <div style={{
              position: 'absolute',
              bottom: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1e293b',
              padding: '12px 20px',
              borderRadius: '20px',
              maxWidth: '250px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              ...getTypographyStyles('base'),
              fontWeight: '500',
              animation: 'fadeIn 0.3s ease'
            }}>
              {currentResponse}
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '10px solid rgba(255, 255, 255, 0.95)'
              }} />
            </div>
          )}
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
                  background: isListening || isSpeaking ? currentCharacter.color : 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                  transition: 'all 0.1s ease'
                }}
              />
            )
          })}
        </div>

        {/* Transcript */}
        {transcript && (
          <div style={{
            maxWidth: '90%',
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            ...getTypographyStyles('base'),
            textAlign: 'center'
          }}>
            {transcript}
          </div>
        )}

        {/* Microphone Button */}
        <button
          onClick={toggleListening}
          disabled={isSpeaking}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isListening 
              ? `linear-gradient(135deg, #ef4444, #dc2626)`
              : isSpeaking
              ? 'rgba(100, 116, 139, 0.5)'
              : `linear-gradient(135deg, ${currentCharacter.color}, ${currentCharacter.color}dd)`,
            border: 'none',
            cursor: isSpeaking ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isListening 
              ? '0 0 0 0 rgba(239, 68, 68, 0.4), 0 0 0 15px rgba(239, 68, 68, 0.2), 0 0 0 30px rgba(239, 68, 68, 0.1)'
              : `0 4px 20px ${currentCharacter.color}40`,
            transition: 'all 0.3s ease',
            transform: isListening ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          {isListening ? (
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

        {/* Instructions */}
        {!isListening && !isSpeaking && !transcript && (
          <p style={{
            ...getTypographyStyles('small'),
            color: '#64748b',
            textAlign: 'center',
            maxWidth: '300px'
          }}>
            マイクボタンをタップして話しかけてください。
            「こんにちは」「疲れた」などと話しかけてみましょう！
          </p>
        )}

        {/* Debug Test Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => {
              console.log('Test: Triggering greeting response')
              generateAIResponse('こんにちは')
            }}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            テスト: 挨拶
          </button>
          <button
            onClick={() => {
              console.log('Test: Direct speech synthesis')
              speakText('テスト音声です。聞こえていますか？')
            }}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            テスト: 音声
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}