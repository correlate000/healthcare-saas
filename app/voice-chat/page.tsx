'use client'

import { useState, useEffect, useRef } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'

export default function VoiceChatPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState<Array<{
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
  }>>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState('luna')
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  // キャラクター設定
  const characters = {
    luna: {
      name: 'ルナ',
      color: '#a3e635',
      personality: 'gentle',
      pitch: 1.2,
      rate: 0.9,
      responses: {
        greeting: ['こんにちは！今日はどんな気分ですか？', 'お会いできて嬉しいです！何かお話ししましょう'],
        encouragement: ['大丈夫ですよ、一緒に頑張りましょう', 'あなたの気持ち、よく分かります'],
        advice: ['深呼吸してみましょう', 'ゆっくり休むことも大切ですよ']
      }
    },
    aria: {
      name: 'アリア',
      color: '#60a5fa',
      personality: 'energetic',
      pitch: 1.3,
      rate: 1.0,
      responses: {
        greeting: ['やっほー！元気してた？', 'わーい！話そう話そう！'],
        encouragement: ['頑張ってるね！すごいよ！', '一緒なら何でもできるよ！'],
        advice: ['楽しいこと考えよう！', '笑顔が一番の薬だよ！']
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
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('')
        
        setTranscript(transcript)
        
        if (event.results[0].isFinal) {
          handleUserMessage(transcript)
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognitionRef.current = recognition
    }
  }, [])

  // ユーザーメッセージの処理
  const handleUserMessage = (text: string) => {
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: text,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setTranscript('')
    
    // AI応答を生成
    setTimeout(() => {
      generateAIResponse(text)
    }, 500)
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
    
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai' as const,
      content: response,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, aiMessage])
    speakText(response)
  }

  // テキストを音声で読み上げ
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // 既存の音声を停止
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      utterance.pitch = currentCharacter.pitch
      utterance.rate = currentCharacter.rate
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      
      synthRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  // 音声認識の開始/停止
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      setTranscript('')
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  // キャラクターSVGコンポーネント
  const CharacterAvatar = ({ size = 120, isAnimated = false }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100"
      style={{
        animation: isAnimated ? 'float 3s ease-in-out infinite' : 'none'
      }}
    >
      <circle cx="50" cy="50" r="40" fill={currentCharacter.color} opacity="0.2"/>
      <circle cx="50" cy="50" r="35" fill={currentCharacter.color}/>
      
      {/* 顔 */}
      <circle cx="50" cy="45" r="25" fill="#ffffff"/>
      
      {/* 目 */}
      {isSpeaking ? (
        <>
          <line x1="40" y1="40" x2="44" y2="40" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
          <line x1="56" y1="40" x2="60" y2="40" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <circle cx="42" cy="40" r="3" fill="#111827"/>
          <circle cx="58" cy="40" r="3" fill="#111827"/>
        </>
      )}
      
      {/* 口 */}
      {isSpeaking ? (
        <ellipse cx="50" cy="52" rx="8" ry="6" fill="#111827" opacity="0.8"/>
      ) : (
        <path d="M 42 50 Q 50 55 58 50" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round"/>
      )}
      
      {/* 音波エフェクト */}
      {isSpeaking && (
        <>
          <circle cx="50" cy="50" r="45" fill="none" stroke={currentCharacter.color} strokeWidth="1" opacity="0.3">
            <animate attributeName="r" from="45" to="55" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.3" to="0" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="50" cy="50" r="45" fill="none" stroke={currentCharacter.color} strokeWidth="1" opacity="0.3">
            <animate attributeName="r" from="45" to="55" dur="1s" begin="0.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.3" to="0" dur="1s" begin="0.5s" repeatCount="indefinite"/>
          </circle>
        </>
      )}
    </svg>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: '140px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(31, 41, 55, 0.4)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          音声対話
        </h1>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px', margin: '8px 0 0 0' }}>
          {currentCharacter.name}と話してみましょう
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* キャラクター選択 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          justifyContent: 'center'
        }}>
          {Object.entries(characters).map(([key, char]) => (
            <button
              key={key}
              onClick={() => setSelectedCharacter(key)}
              style={{
                padding: '8px 16px',
                background: selectedCharacter === key 
                  ? `linear-gradient(135deg, ${char.color} 0%, ${char.color}80 100%)`
                  : 'rgba(55, 65, 81, 0.6)',
                color: selectedCharacter === key ? '#111827' : '#d1d5db',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {char.name}
            </button>
          ))}
        </div>

        {/* キャラクターアバター */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            position: 'relative',
            padding: '20px',
            background: `radial-gradient(circle, ${currentCharacter.color}20 0%, transparent 70%)`,
            borderRadius: '50%'
          }}>
            <CharacterAvatar size={150} isAnimated={isSpeaking} />
            
            {/* ステータス表示 */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '4px 12px',
              background: isSpeaking ? currentCharacter.color : isListening ? '#ef4444' : 'rgba(55, 65, 81, 0.8)',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              color: isSpeaking || isListening ? '#111827' : '#d1d5db',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#111827',
                animation: (isSpeaking || isListening) ? 'pulse 1s infinite' : 'none'
              }}></div>
              {isSpeaking ? '話しています' : isListening ? '聞いています' : 'スタンバイ'}
            </div>
          </div>
        </div>

        {/* 会話履歴 */}
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          marginBottom: '24px',
          padding: '16px',
          background: 'rgba(31, 41, 55, 0.4)',
          borderRadius: '16px',
          border: '1px solid rgba(55, 65, 81, 0.3)'
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px',
              padding: '20px'
            }}>
              マイクボタンをタップして話しかけてください
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    background: message.type === 'user' 
                      ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
                      : `linear-gradient(135deg, ${currentCharacter.color} 0%, ${currentCharacter.color}80 100%)`,
                    color: message.type === 'user' ? 'white' : '#111827',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 現在の認識テキスト */}
        {transcript && (
          <div style={{
            padding: '12px',
            background: 'rgba(96, 165, 250, 0.1)',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#60a5fa',
            textAlign: 'center'
          }}>
            認識中: {transcript}
          </div>
        )}

        {/* マイクボタン */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <button
            onClick={toggleListening}
            disabled={isSpeaking}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isListening 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : isSpeaking
                ? 'rgba(55, 65, 81, 0.6)'
                : 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              border: 'none',
              cursor: isSpeaking ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening 
                ? '0 0 0 0 rgba(239, 68, 68, 0.4), 0 0 0 10px rgba(239, 68, 68, 0.2), 0 0 0 20px rgba(239, 68, 68, 0.1)'
                : '0 8px 24px rgba(163, 230, 53, 0.3)',
              transition: 'all 0.3s ease',
              opacity: isSpeaking ? 0.5 : 1
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="9" y="3" width="6" height="11" rx="3" fill={isListening ? 'white' : '#111827'} stroke={isListening ? 'white' : '#111827'} strokeWidth="2"/>
              <path d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10" stroke={isListening ? 'white' : '#111827'} strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 19V22" stroke={isListening ? 'white' : '#111827'} strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 22H16" stroke={isListening ? 'white' : '#111827'} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* クイックアクション */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          <button
            onClick={() => handleUserMessage('こんにちは')}
            style={{
              padding: '12px',
              background: 'rgba(55, 65, 81, 0.6)',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderRadius: '12px',
              color: '#d1d5db',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            挨拶する
          </button>
          <button
            onClick={() => handleUserMessage('今日は疲れました')}
            style={{
              padding: '12px',
              background: 'rgba(55, 65, 81, 0.6)',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderRadius: '12px',
              color: '#d1d5db',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            疲れを伝える
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}