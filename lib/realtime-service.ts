// 接続状態の型定義
export type ConnectionState = 
  | 'disconnected'
  | 'connecting' 
  | 'connected'
  | 'authenticated'
  | 'listening'
  | 'speaking'
  | 'error'

// OpenAI Realtime API接続サービス
export class RealtimeService {
  private pc: RTCPeerConnection | null = null
  private dc: RTCDataChannel | null = null
  private audioElement: HTMLAudioElement | null = null
  private mediaStream: MediaStream | null = null
  private isConnected: boolean = false
  private onStateChange?: (state: ConnectionState) => void
  private onError?: (error: Error) => void
  private ephemeralKey: string | null = null

  constructor() {
    // 音声再生用のaudio要素を準備
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio()
      this.audioElement.autoplay = true
    }
  }

  // エフェメラルキーを取得
  private async getEphemeralKey(): Promise<string> {
    try {
      const response = await fetch('/api/realtime', {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error('Failed to get ephemeral key')
      }
      
      const data = await response.json()
      return data.client_secret
    } catch (error) {
      console.error('Failed to get ephemeral key:', error)
      throw error
    }
  }

  // Realtime APIに接続
  async connect(
    onStateChange?: (state: ConnectionState) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    this.onStateChange = onStateChange
    this.onError = onError

    try {
      // 状態を接続中に
      this.updateState('connecting')

      // エフェメラルキーを取得
      this.ephemeralKey = await this.getEphemeralKey()

      // WebRTC接続を初期化
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })

      // マイクストリームを取得
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000, // Realtime API推奨
        }
      })

      // 音声トラックを追加
      this.mediaStream.getTracks().forEach(track => {
        this.pc!.addTrack(track, this.mediaStream!)
      })

      // リモート音声を受信
      this.pc.ontrack = (event) => {
        console.log('Received remote track')
        if (this.audioElement && event.streams[0]) {
          this.audioElement.srcObject = event.streams[0]
        }
      }

      // データチャンネルを作成
      this.dc = this.pc.createDataChannel('oai-events', {
        ordered: true
      })

      this.dc.onopen = () => {
        console.log('Data channel opened')
        this.updateState('connected')
        this.authenticate()
      }

      this.dc.onmessage = (event) => {
        this.handleRealtimeEvent(JSON.parse(event.data))
      }

      this.dc.onerror = (error) => {
        console.error('Data channel error:', error)
        this.handleError(new Error('Data channel error'))
      }

      // オファーを作成
      const offer = await this.pc.createOffer()
      await this.pc.setLocalDescription(offer)

      // OpenAI Realtime APIに接続
      const response = await fetch('https://api.openai.com/v1/realtime', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      })

      if (!response.ok) {
        throw new Error(`Failed to connect: ${response.statusText}`)
      }

      const answer = await response.text()
      await this.pc.setRemoteDescription({
        type: 'answer',
        sdp: answer,
      })

      this.isConnected = true
      this.updateState('authenticated')
      
    } catch (error) {
      console.error('Connection error:', error)
      this.handleError(error as Error)
    }
  }

  // 認証とセッション設定
  private authenticate(): void {
    if (!this.dc || this.dc.readyState !== 'open') return

    // セッション設定を送信
    this.sendEvent({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: `あなたは優しくて共感的なメンタルヘルスサポーターです。
          ユーザーの気持ちに寄り添い、励ましと実践的なアドバイスを提供してください。
          会話は自然で温かみのあるトーンで行ってください。`,
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1',
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
        tools: [],
        tool_choice: 'none',
        temperature: 0.8,
        max_response_output_tokens: 4096,
      }
    })

    // 会話を開始
    this.startConversation()
  }

  // 会話開始
  private startConversation(): void {
    this.updateState('listening')
    
    // 初回の挨拶を送信
    this.sendEvent({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text: 'こんにちは'
        }]
      }
    })

    this.sendEvent({
      type: 'response.create'
    })
  }

  // イベント送信
  private sendEvent(event: any): void {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.warn('Data channel not open')
      return
    }
    
    this.dc.send(JSON.stringify(event))
  }

  // Realtimeイベント処理
  private handleRealtimeEvent(event: any): void {
    console.log('Realtime event:', event.type)
    
    switch (event.type) {
      case 'error':
        console.error('Realtime error:', event.error)
        this.handleError(new Error(event.error.message))
        break
        
      case 'session.created':
      case 'session.updated':
        console.log('Session updated:', event.session)
        break
        
      case 'conversation.item.created':
        if (event.item.role === 'assistant') {
          this.updateState('speaking')
        }
        break
        
      case 'response.audio.delta':
        // 音声データを処理（ブラウザが自動的に再生）
        break
        
      case 'response.audio.done':
      case 'response.done':
        this.updateState('listening')
        break
        
      case 'input_audio_buffer.speech_started':
        // ユーザーが話し始めた
        this.updateState('listening')
        break
        
      case 'input_audio_buffer.speech_stopped':
        // ユーザーが話し終わった
        break
        
      case 'conversation.item.input_audio_transcription.completed':
        console.log('User said:', event.transcript)
        break
        
      default:
        console.log('Unhandled event:', event.type)
    }
  }

  // 状態更新
  private updateState(state: ConnectionState): void {
    console.log('State changed:', state)
    this.onStateChange?.(state)
  }

  // エラーハンドリング
  private handleError(error: Error): void {
    console.error('Realtime service error:', error)
    this.updateState('error')
    this.onError?.(error)
  }

  // 切断
  async disconnect(): Promise<void> {
    try {
      // データチャンネルを閉じる
      if (this.dc) {
        this.dc.close()
        this.dc = null
      }

      // WebRTC接続を閉じる
      if (this.pc) {
        this.pc.close()
        this.pc = null
      }

      // メディアストリームを停止
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop())
        this.mediaStream = null
      }

      // 音声要素をクリーンアップ
      if (this.audioElement) {
        this.audioElement.pause()
        this.audioElement.srcObject = null
      }

      this.isConnected = false
      this.updateState('disconnected')
      
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  // 接続状態を取得
  getConnectionState(): boolean {
    return this.isConnected
  }
}