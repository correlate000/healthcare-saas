'use client'

import { useState, useEffect, useRef } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

// Speech Recognition の型定義
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

// ブラウザのSpeechRecognition APIの型定義
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function VoiceDialoguePage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg'>('lg')

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

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'ja-JP'

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ''
          let interimTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
              finalTranscript += result[0].transcript
            } else {
              interimTranscript += result[0].transcript
            }
          }

          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript)
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      if (transcript.trim()) {
        handleSendMessage()
      }
    } else {
      setTranscript('')
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  // Send message to GPT
  const handleSendMessage = async () => {
    if (!transcript.trim()) return

    const userMessage = transcript.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setTranscript('')
    setIsProcessing(true)

    try {
      // ここで実際のGPT APIを呼び出す
      // 今はモックレスポンス
      const mockResponse = await simulateGPTResponse(userMessage)
      
      setMessages(prev => [...prev, { role: 'assistant', content: mockResponse }])
      
      // 音声で読み上げ
      speakText(mockResponse)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Simulate GPT response (モック)
  const simulateGPTResponse = (message: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          'こんにちは！今日はどんなお話をしましょうか？',
          'それは素晴らしいですね！もっと詳しく教えてください。',
          '今日も一緒にお話できて嬉しいです。',
          'なるほど、そういうことだったんですね。',
          'あなたの気持ち、よく分かります。'
        ]
        resolve(responses[Math.floor(Math.random() * responses.length)])
      }, 1000)
    })
  }

  // Text to speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // 既存の発話をキャンセル
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      utterance.rate = 1.0
      utterance.pitch = 1.1
      utterance.volume = 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingBottom: '80px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: screenSize === 'xs' ? '16px' : screenSize === 'sm' ? '20px' : '24px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{
          fontSize: screenSize === 'xs' ? '20px' : screenSize === 'sm' ? '22px' : '24px',
          fontWeight: '700',
          color: 'white',
          textAlign: 'center',
          margin: 0
        }}>
          音声対話
        </h1>
      </div>

      {/* Character Area */}
      <div style={{
        flex: '0 0 auto',
        padding: screenSize === 'xs' ? '20px' : screenSize === 'sm' ? '24px' : '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: screenSize === 'xs' ? '120px' : screenSize === 'sm' ? '140px' : '160px',
          height: screenSize === 'xs' ? '120px' : screenSize === 'sm' ? '140px' : '160px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: screenSize === 'xs' ? '48px' : screenSize === 'sm' ? '56px' : '64px',
          boxShadow: isSpeaking ? '0 0 40px rgba(255, 255, 255, 0.6)' : '0 10px 30px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          animation: isSpeaking ? 'pulse 1.5s infinite' : 'none',
          border: '4px solid rgba(255, 255, 255, 0.3)'
        }}>
          🤖
        </div>
        <p style={{
          marginTop: '16px',
          fontSize: screenSize === 'xs' ? '14px' : screenSize === 'sm' ? '15px' : '16px',
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center'
        }}>
          {isListening ? '聞いています...' : isSpeaking ? '話しています...' : isProcessing ? '考えています...' : 'マイクボタンをタップして話しかけてください'}
        </p>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: screenSize === 'xs' ? '16px' : screenSize === 'sm' ? '20px' : '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: screenSize === 'xs' ? '10px 14px' : '12px 16px',
              borderRadius: '16px',
              background: message.role === 'user' 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(255, 255, 255, 0.2)',
              color: message.role === 'user' ? '#333' : 'white',
              fontSize: screenSize === 'xs' ? '14px' : screenSize === 'sm' ? '15px' : '16px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            {message.content}
          </div>
        ))}
      </div>

      {/* Current Transcript */}
      {transcript && (
        <div style={{
          padding: screenSize === 'xs' ? '12px' : '16px',
          margin: '0 16px 16px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          color: 'white',
          fontSize: screenSize === 'xs' ? '14px' : '15px'
        }}>
          <span style={{ opacity: 0.7 }}>認識中: </span>{transcript}
        </div>
      )}

      {/* Control Area */}
      <div style={{
        padding: screenSize === 'xs' ? '16px' : screenSize === 'sm' ? '20px' : '24px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        gap: '16px'
      }}>
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          style={{
            width: screenSize === 'xs' ? '64px' : screenSize === 'sm' ? '72px' : '80px',
            height: screenSize === 'xs' ? '64px' : screenSize === 'sm' ? '72px' : '80px',
            borderRadius: '50%',
            border: 'none',
            background: isListening 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: screenSize === 'xs' ? '28px' : screenSize === 'sm' ? '32px' : '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isListening 
              ? '0 0 30px rgba(240, 147, 251, 0.6)' 
              : '0 8px 20px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            animation: isListening ? 'pulse 1.5s infinite' : 'none',
            opacity: isProcessing ? 0.5 : 1
          }}
        >
          {isListening ? '⏸️' : '🎤'}
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}