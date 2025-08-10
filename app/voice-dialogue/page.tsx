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

// 会話ログの型定義
interface ConversationLog {
  timestamp: Date
  speaker: 'user' | 'assistant'
  text: string
  duration?: number
}

// ブラウザのSpeechRecognition APIの型定義
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function VoiceDialoguePage() {
  const [isActive, setIsActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [conversationLogs, setConversationLogs] = useState<ConversationLog[]>([])
  const [showTranscript, setShowTranscript] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
  
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
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

          // 暫定認識結果を表示
          if (interimTranscript) {
            setCurrentTranscript(interimTranscript)
          }

          // 最終認識結果が出たら処理
          if (finalTranscript && isActive) {
            handleUserSpeech(finalTranscript)
          }

          // 無音検出タイマーをリセット
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current)
          }

          // 1.5秒の無音で発話終了と判定
          silenceTimerRef.current = setTimeout(() => {
            if (finalTranscript && isActive) {
              // 自動的に応答を生成
            }
          }, 1500)
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'no-speech') {
            // 無音が続いた場合は再開
            if (isActive) {
              recognition.start()
            }
          }
        }

        recognition.onend = () => {
          // アクティブな場合は自動再開
          if (isActive) {
            setTimeout(() => {
              try {
                recognition.start()
              } catch (e) {
                console.log('Recognition restart failed:', e)
              }
            }, 100)
          }
        }

        recognitionRef.current = recognition
      }
    }
  }, [isActive])

  // ユーザーの発話を処理
  const handleUserSpeech = async (text: string) => {
    // 会話ログに追加
    const userLog: ConversationLog = {
      timestamp: new Date(),
      speaker: 'user',
      text: text
    }
    setConversationLogs(prev => [...prev, userLog])
    setCurrentTranscript('')
    
    // GPT応答を取得して音声で返す
    setIsProcessing(true)
    try {
      const response = await getGPTResponse(text)
      
      // アシスタントログを追加
      const assistantLog: ConversationLog = {
        timestamp: new Date(),
        speaker: 'assistant',
        text: response
      }
      setConversationLogs(prev => [...prev, assistantLog])
      
      // 音声で応答
      await speakResponse(response)
    } catch (error) {
      console.error('Error processing speech:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // GPTレスポンスを取得（モック）
  const getGPTResponse = async (message: string): Promise<string> => {
    // 実際のGPT APIコールに置き換え予定
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          'はい、お聞きしています。どうぞお話しください。',
          'なるほど、それは興味深いですね。',
          '素晴らしい考えだと思います。',
          'もう少し詳しく教えていただけますか？',
          'そのお気持ち、よく分かります。'
        ]
        resolve(responses[Math.floor(Math.random() * responses.length)])
      }, 500)
    })
  }

  // 音声で応答
  const speakResponse = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        // 既存の発話をキャンセル
        window.speechSynthesis.cancel()
        
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'ja-JP'
        utterance.rate = 1.0
        utterance.pitch = 1.1
        utterance.volume = 1.0

        utterance.onstart = () => {
          setIsSpeaking(true)
          // 音声再生中は音声認識を一時停止
          if (recognitionRef.current && isActive) {
            recognitionRef.current.stop()
          }
        }

        utterance.onend = () => {
          setIsSpeaking(false)
          // 音声再生終了後、音声認識を再開
          if (recognitionRef.current && isActive) {
            setTimeout(() => {
              try {
                recognitionRef.current.start()
                setIsListening(true)
              } catch (e) {
                console.log('Recognition restart failed:', e)
              }
            }, 300)
          }
          resolve()
        }

        synthRef.current = utterance
        window.speechSynthesis.speak(utterance)
      } else {
        resolve()
      }
    })
  }

  // 会話セッションの開始/終了
  const toggleSession = () => {
    if (isActive) {
      // セッション終了
      setIsActive(false)
      setIsListening(false)
      setConnectionStatus('idle')
      
      // 音声認識を停止
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      
      // 音声合成を停止
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      
      // タイマーをクリア
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    } else {
      // セッション開始
      setIsActive(true)
      setConnectionStatus('connecting')
      setConversationLogs([])
      
      // 初回の挨拶
      setTimeout(async () => {
        setConnectionStatus('connected')
        const greeting = 'こんにちは！今日はどんなお話をしましょうか？'
        const greetingLog: ConversationLog = {
          timestamp: new Date(),
          speaker: 'assistant',
          text: greeting
        }
        setConversationLogs([greetingLog])
        
        await speakResponse(greeting)
        
        // 音声認識開始
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start()
            setIsListening(true)
          } catch (e) {
            console.log('Recognition start failed:', e)
          }
        }
      }, 500)
    }
  }

  // 通話時間の計算
  const getCallDuration = () => {
    if (conversationLogs.length === 0) return '00:00'
    
    const start = conversationLogs[0].timestamp
    const now = new Date()
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000)
    
    const minutes = Math.floor(diff / 60)
    const seconds = diff % 60
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isActive 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      paddingBottom: '80px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background 0.5s ease'
    }}>
      {/* Header */}
      <div style={{
        padding: screenSize === 'xs' ? '16px' : screenSize === 'sm' ? '20px' : '24px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: screenSize === 'xs' ? '20px' : screenSize === 'sm' ? '22px' : '24px',
          fontWeight: '700',
          color: 'white',
          margin: 0
        }}>
          AI音声対話
        </h1>
        {isActive && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: connectionStatus === 'connected' ? '#10b981' : '#fbbf24',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{
              fontSize: screenSize === 'xs' ? '12px' : '14px',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              {getCallDuration()}
            </span>
          </div>
        )}
      </div>

      {/* Main Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: screenSize === 'xs' ? '20px' : screenSize === 'sm' ? '24px' : '32px',
      }}>
        {/* AI Avatar */}
        <div style={{
          position: 'relative',
          marginBottom: '32px'
        }}>
          <div style={{
            width: screenSize === 'xs' ? '160px' : screenSize === 'sm' ? '180px' : '200px',
            height: screenSize === 'xs' ? '160px' : screenSize === 'sm' ? '180px' : '200px',
            borderRadius: '50%',
            background: isActive 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: screenSize === 'xs' ? '64px' : screenSize === 'sm' ? '72px' : '80px',
            boxShadow: isActive 
              ? '0 0 60px rgba(240, 147, 251, 0.5)'
              : '0 10px 40px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.5s ease',
            animation: isSpeaking || isListening ? 'glow 1.5s infinite' : 'none',
            border: '4px solid rgba(255, 255, 255, 0.2)'
          }}>
            {isActive ? (isSpeaking ? '🗣️' : isListening ? '👂' : '🤖') : '😴'}
          </div>
          
          {/* Sound Wave Visualizer */}
          {(isListening || isSpeaking) && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              pointerEvents: 'none'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                animation: 'ripple 1.5s infinite'
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                animation: 'ripple 1.5s infinite 0.3s'
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                animation: 'ripple 1.5s infinite 0.6s'
              }} />
            </div>
          )}
        </div>

        {/* Status Text */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: screenSize === 'xs' ? '18px' : screenSize === 'sm' ? '20px' : '24px',
            color: 'white',
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            {!isActive ? '開始ボタンをタップ' :
             isSpeaking ? '話しています...' :
             isListening ? '聞いています...' :
             isProcessing ? '考えています...' :
             '待機中...'}
          </h2>
          
          {/* Current Transcript */}
          {currentTranscript && (
            <p style={{
              fontSize: screenSize === 'xs' ? '14px' : '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              「{currentTranscript}」
            </p>
          )}
        </div>

        {/* Control Button */}
        <button
          onClick={toggleSession}
          style={{
            width: screenSize === 'xs' ? '120px' : screenSize === 'sm' ? '140px' : '160px',
            height: screenSize === 'xs' ? '120px' : screenSize === 'sm' ? '140px' : '160px',
            borderRadius: '50%',
            border: 'none',
            background: isActive
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontSize: screenSize === 'xs' ? '16px' : screenSize === 'sm' ? '18px' : '20px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          <span style={{ fontSize: screenSize === 'xs' ? '36px' : screenSize === 'sm' ? '42px' : '48px' }}>
            {isActive ? '⏹️' : '▶️'}
          </span>
          <span>{isActive ? '終了' : '開始'}</span>
        </button>
      </div>

      {/* Transcript Toggle Button */}
      <button
        onClick={() => setShowTranscript(!showTranscript)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        📝
      </button>

      {/* Transcript Panel */}
      {showTranscript && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: 0,
          right: 0,
          maxHeight: '50vh',
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          overflowY: 'auto',
          padding: screenSize === 'xs' ? '16px' : '20px',
          animation: 'slideUp 0.3s ease'
        }}>
          <h3 style={{
            fontSize: screenSize === 'xs' ? '16px' : '18px',
            color: 'white',
            marginBottom: '16px',
            fontWeight: '600'
          }}>
            会話記録
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {conversationLogs.map((log, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>{log.speaker === 'user' ? '👤 あなた' : '🤖 AI'}</span>
                  <span>{log.timestamp.toLocaleTimeString('ja-JP')}</span>
                </div>
                <div style={{
                  padding: '8px 12px',
                  background: log.speaker === 'user' 
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(168, 85, 247, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: screenSize === 'xs' ? '14px' : '15px',
                  borderLeft: `3px solid ${log.speaker === 'user' ? '#3b82f6' : '#a855f7'}`
                }}>
                  {log.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}