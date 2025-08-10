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
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // キャラクター設定
  const characters = {
    luna: {
      name: 'ルナ',
      color: '#10b981',
      personality: 'gentle',
      pitch: 1.2,
      rate: 0.9,
      emoji: '🌙',
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
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'ja-JP'
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('')
        
        setTranscript(transcript)
        
        if (event.results[event.results.length - 1].isFinal) {
          handleUserMessage(transcript)
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        stopAudioAnalyser()
      }
      
      recognition.onend = () => {
        if (isListening) {
          recognition.start()
        }
      }
      
      recognitionRef.current = recognition
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isListening])

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
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
          setAudioLevel(average / 255)
        }
        
        if (isListening) {
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
        }
      }
      
      updateAudioLevel()
    } catch (error) {
      console.error('Error accessing microphone:', error)
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
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    setAudioLevel(0)
  }

  // ユーザーメッセージの処理
  const handleUserMessage = (text: string) => {
    setTranscript('')
    
    // AI応答を生成
    setTimeout(() => {
      generateAIResponse(text)
    }, 300)
  }

  // AI応答の生成
  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase()
    let responseType: keyof typeof currentCharacter.responses = 'encouragement'
    
    if (input.includes('こんにちは') || input.includes('はじめ')) {
      responseType = 'greeting'
    } else if (input.includes('疲れ') || input.includes('つらい')) {
      responseType = 'advice'
    }
    
    const responses = currentCharacter.responses[responseType]
    const response = responses[Math.floor(Math.random() * responses.length)]
    
    speakText(response)
  }

  // テキストを音声で読み上げ
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      utterance.pitch = currentCharacter.pitch
      utterance.rate = currentCharacter.rate
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        // 自動的に再び聞き取りを開始
        if (!isListening && recognitionRef.current) {
          startListening()
        }
      }
      
      synthRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  // 音声認識の開始
  const startListening = () => {
    setTranscript('')
    recognitionRef.current?.start()
    setIsListening(true)
    startAudioAnalyser()
  }

  // 音声認識の停止
  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
    stopAudioAnalyser()
  }

  // 音声認識の開始/停止
  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // 音声波形ビジュアライザー
  const WaveformVisualizer = () => {
    const bars = 40
    const barWidth = 100 / bars
    
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '120px',
        gap: '2px',
        padding: '0 20px'
      }}>
        {Array.from({ length: bars }).map((_, i) => {
          const isCenter = i >= bars / 2 - 2 && i <= bars / 2 + 1
          const distance = Math.abs(i - bars / 2)
          const maxHeight = isCenter ? 100 : Math.max(20, 100 - distance * 4)
          const height = isListening 
            ? Math.max(10, audioLevel * maxHeight + Math.random() * 20)
            : isSpeaking
            ? Math.max(15, Math.sin(Date.now() / 100 + i) * 30 + 40)
            : 4
          
          return (
            <div
              key={i}
              style={{
                width: `${barWidth}%`,
                height: `${height}px`,
                background: isListening 
                  ? 'white'
                  : isSpeaking
                  ? currentCharacter.color
                  : 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                transition: 'all 0.1s ease',
                opacity: isListening || isSpeaking ? 1 : 0.3
              }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: 'white',
      paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Minimal Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isListening ? '#10b981' : isSpeaking ? currentCharacter.color : '#374151',
            animation: (isListening || isSpeaking) ? 'pulse 1.5s infinite' : 'none'
          }} />
          <span style={{
            ...getTypographyStyles('small'),
            color: '#9ca3af',
            fontWeight: '500'
          }}>
            {isListening ? 'リスニング中' : isSpeaking ? '話しています' : 'スタンバイ'}
          </span>
        </div>
        
        {/* Minimal Character Selector */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {Object.entries(characters).map(([key, char]) => (
            <button
              key={key}
              onClick={() => setSelectedCharacter(key)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: selectedCharacter === key ? char.color : 'transparent',
                border: `2px solid ${selectedCharacter === key ? char.color : '#374151'}`,
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={char.name}
            >
              {char.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        gap: '40px'
      }}>
        {/* Central Orb */}
        <div style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              isListening ? 'rgba(255, 255, 255, 0.1)' 
              : isSpeaking ? `${currentCharacter.color}20` 
              : 'transparent'
            } 0%, transparent 70%)`,
            animation: (isListening || isSpeaking) ? 'glow 2s ease-in-out infinite' : 'none'
          }} />
          
          {/* Main orb */}
          <div style={{
            width: isListening || isSpeaking ? '160px' : '140px',
            height: isListening || isSpeaking ? '160px' : '140px',
            borderRadius: '50%',
            background: isListening 
              ? 'radial-gradient(circle at 30% 30%, #ffffff, #e5e7eb)'
              : isSpeaking
              ? `radial-gradient(circle at 30% 30%, ${currentCharacter.color}, ${currentCharacter.color}dd)`
              : 'radial-gradient(circle at 30% 30%, #1f2937, #111827)',
            boxShadow: isListening 
              ? '0 0 60px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)'
              : isSpeaking
              ? `0 0 60px ${currentCharacter.color}80, inset 0 0 20px ${currentCharacter.color}40`
              : 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Inner detail */}
            <div style={{
              width: '40%',
              height: '40%',
              borderRadius: '50%',
              background: isListening 
                ? 'rgba(0, 0, 0, 0.1)'
                : isSpeaking
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)'
            }} />
          </div>

          {/* Ripple effects */}
          {(isListening || isSpeaking) && (
            <>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `1px solid ${isListening ? 'rgba(255, 255, 255, 0.3)' : `${currentCharacter.color}40`}`,
                animation: 'ripple 2s ease-out infinite'
              }} />
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `1px solid ${isListening ? 'rgba(255, 255, 255, 0.3)' : `${currentCharacter.color}40`}`,
                animation: 'ripple 2s ease-out infinite 0.5s'
              }} />
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `1px solid ${isListening ? 'rgba(255, 255, 255, 0.3)' : `${currentCharacter.color}40`}`,
                animation: 'ripple 2s ease-out infinite 1s'
              }} />
            </>
          )}
        </div>

        {/* Waveform Visualizer */}
        <WaveformVisualizer />

        {/* Transcript Display */}
        {transcript && (
          <div style={{
            maxWidth: '500px',
            padding: '16px 24px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            ...getTypographyStyles('base'),
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            {transcript}
          </div>
        )}

        {/* Control Button */}
        <button
          onClick={toggleListening}
          disabled={isSpeaking}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isListening 
              ? 'white'
              : isSpeaking
              ? 'rgba(55, 65, 81, 0.3)'
              : 'rgba(255, 255, 255, 0.1)',
            border: `2px solid ${isListening ? 'white' : 'rgba(255, 255, 255, 0.2)'}`,
            cursor: isSpeaking ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            opacity: isSpeaking ? 0.5 : 1,
            backdropFilter: 'blur(10px)'
          }}
        >
          {isListening ? (
            <div style={{
              width: '24px',
              height: '24px',
              background: 'black',
              borderRadius: '4px'
            }} />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="3" width="6" height="11" rx="3" 
                fill="white" 
                opacity={isSpeaking ? 0.5 : 1}
              />
              <path d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round"
                opacity={isSpeaking ? 0.5 : 1}
              />
            </svg>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}