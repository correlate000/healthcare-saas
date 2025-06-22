'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Square, Play } from 'lucide-react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onError?: (error: string) => void
  className?: string
}

export function VoiceInput({ onTranscript, onError, className }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'ja-JP'

        recognitionRef.current.onresult = (event: any) => {
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

          const fullTranscript = finalTranscript || interimTranscript
          setTranscript(fullTranscript)
          
          if (finalTranscript) {
            onTranscript(finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsRecording(false)
          onError?.(event.error)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, onError])

  const startRecording = () => {
    if (!isSupported || !recognitionRef.current) {
      onError?.('音声認識がサポートされていません')
      return
    }

    setTranscript('')
    setIsRecording(true)
    recognitionRef.current.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  if (!isSupported) {
    return (
      <div className={`text-center p-4 text-gray-500 ${className}`}>
        <MicOff className="h-6 w-6 mx-auto mb-2" />
        <p className="text-sm">音声入力は利用できません</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Recording Button */}
      <div className="text-center">
        <Button
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "outline"}
          size="lg"
          className={`relative w-16 h-16 rounded-full ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'hover:bg-blue-50'
          }`}
        >
          {isRecording ? (
            <Square className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        
        <p className="text-sm text-gray-600 mt-2">
          {isRecording ? '録音中... タップで停止' : 'タップして音声入力'}
        </p>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-start space-x-2">
            <Play className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">音声認識結果</p>
              <p className="text-gray-900">{transcript}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 text-red-600">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-4 bg-red-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          <span className="text-sm font-medium">録音中</span>
        </div>
      )}
    </div>
  )
}