'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2 } from 'lucide-react'

interface VoiceCounselingProps {
  onTranscript?: (text: string, role: 'user' | 'assistant') => void
  onEmotionDetected?: (emotion: string) => void
}

export function VoiceCounseling({ onTranscript, onEmotionDetected }: VoiceCounselingProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [assistantResponse, setAssistantResponse] = useState('')
  
  const wsRef = useRef<WebSocket | null>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  const initializeWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      streamRef.current = stream

      // Create audio context
      audioContextRef.current = new AudioContext()

      // Initialize WebRTC peer connection
      pcRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      })

      // Add audio track to peer connection
      stream.getTracks().forEach(track => {
        pcRef.current?.addTrack(track, stream)
      })

      return true
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error)
      return false
    }
  }

  const connectToRealtimeAPI = async () => {
    setIsConnecting(true)

    try {
      // Get ephemeral token from our API
      const response = await fetch('/api/realtime', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to get realtime token')
      }

      const { url, client_secret } = await response.json()

      // Initialize WebRTC
      const webrtcReady = await initializeWebRTC()
      if (!webrtcReady) {
        throw new Error('Failed to initialize WebRTC')
      }

      // Connect to OpenAI Realtime API via WebSocket
      wsRef.current = new WebSocket(url)

      wsRef.current.onopen = () => {
        console.log('Connected to realtime API')
        
        // Send authentication
        wsRef.current?.send(JSON.stringify({
          type: 'session.update',
          session: {
            model: 'gpt-4o-realtime-preview-2024-12-17',
            client_secret,
            instructions: `あなたは思いやりのあるメンタルヘルスカウンセラーです。
            ユーザーの感情に寄り添い、共感的で温かい対応をしてください。
            判断や批判をせず、安心感を与える言葉を使ってください。
            会話は日本語で行ってください。`,
            voice: 'alloy',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500
            }
          }
        }))

        setIsConnected(true)
        setIsConnecting(false)
      }

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleRealtimeMessage(data)
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnecting(false)
      }

      wsRef.current.onclose = () => {
        console.log('Disconnected from realtime API')
        setIsConnected(false)
        setIsConnecting(false)
      }

    } catch (error) {
      console.error('Failed to connect:', error)
      setIsConnecting(false)
    }
  }

  const handleRealtimeMessage = (data: any) => {
    switch (data.type) {
      case 'conversation.item.created':
        if (data.item.role === 'user') {
          const transcript = data.item.content?.[0]?.transcript || ''
          setCurrentTranscript(transcript)
          onTranscript?.(transcript, 'user')
          
          // 感情分析
          analyzeEmotion(transcript)
        }
        break

      case 'response.audio_transcript.delta':
        setAssistantResponse(prev => prev + data.delta)
        break

      case 'response.audio_transcript.done':
        onTranscript?.(assistantResponse, 'assistant')
        setAssistantResponse('')
        break

      case 'response.audio.delta':
        // Handle audio streaming
        playAudioChunk(data.delta)
        break

      case 'error':
        console.error('Realtime API error:', data.error)
        break
    }
  }

  const analyzeEmotion = async (text: string) => {
    try {
      const response = await fetch('/api/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (response.ok) {
        const data = await response.json()
        onEmotionDetected?.(data.analysis.primary)
      }
    } catch (error) {
      console.error('Emotion analysis failed:', error)
    }
  }

  const playAudioChunk = async (audioData: string) => {
    if (!audioContextRef.current) return

    try {
      // Decode base64 audio data
      const audioBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
      
      // Create audio buffer
      const buffer = await audioContextRef.current.decodeAudioData(audioBuffer.buffer)
      
      // Create buffer source
      const source = audioContextRef.current.createBufferSource()
      source.buffer = buffer
      source.connect(audioContextRef.current.destination)
      source.start()
    } catch (error) {
      console.error('Failed to play audio:', error)
    }
  }

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const disconnect = () => {
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    // Close peer connection
    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setIsConnected(false)
    setCurrentTranscript('')
    setAssistantResponse('')
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* 接続状態 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
            }`} />
            <span className="text-sm font-medium">
              {isConnected ? '接続中' : isConnecting ? '接続中...' : '未接続'}
            </span>
          </div>
          
          {isConnected && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                className="flex items-center space-x-2"
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4 text-green-500" />
                )}
              </Button>
              <Volume2 className="h-4 w-4 text-gray-500" />
            </div>
          )}
        </div>

        {/* メイン操作ボタン */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={isConnected ? disconnect : connectToRealtimeAPI}
            disabled={isConnecting}
            className={`w-32 h-32 rounded-full ${
              isConnected 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isConnecting ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : isConnected ? (
              <PhoneOff className="h-12 w-12" />
            ) : (
              <Phone className="h-12 w-12" />
            )}
          </Button>
        </div>

        {/* 通話ステータス */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isConnected 
              ? 'お話しください。AIカウンセラーが聞いています。' 
              : isConnecting
              ? '接続しています...'
              : 'ボタンを押して音声相談を開始'}
          </p>
        </div>

        {/* リアルタイムトランスクリプト */}
        {(currentTranscript || assistantResponse) && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            {currentTranscript && (
              <div>
                <p className="text-xs text-gray-500 mb-1">あなた:</p>
                <p className="text-sm">{currentTranscript}</p>
              </div>
            )}
            {assistantResponse && (
              <div>
                <p className="text-xs text-gray-500 mb-1">カウンセラー:</p>
                <p className="text-sm">{assistantResponse}</p>
              </div>
            )}
          </div>
        )}

        {/* 注意事項 */}
        <div className="text-xs text-gray-500 text-center">
          <p>音声は暗号化され、プライバシーは保護されています</p>
          <p>緊急時は専門機関にご相談ください</p>
        </div>
      </div>
    </Card>
  )
}