'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar'
import { VoiceInput } from '@/src/components/ui/voice-input'
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Mic, 
  MessageCircle,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock AI responses for voice chat
const aiVoiceResponses = {
  greeting: [
    "こんにちは！音声でお話しできて嬉しいです。今日はどんな気分ですか？",
    "お疲れ様です。ゆっくりとお話を聞かせてください。",
    "いらっしゃいませ。今日はどんなことを話しましょうか？"
  ],
  encouragement: [
    "そうですね。あなたの気持ちがよく伝わってきます。",
    "お話ししてくれてありがとうございます。一人じゃありませんよ。",
    "大変な時期を過ごしているんですね。あなたの強さを信じています。"
  ],
  advice: [
    "そんな時は、深呼吸をしてゆっくり休んでみてください。",
    "無理をしないで、自分のペースで大丈夫ですよ。",
    "今日は特別よく頑張っていると思います。自分を褒めてあげてください。"
  ]
}

export default function VoiceChat() {
  const router = useRouter()
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [conversation, setConversation] = useState<Array<{id: string, type: 'user' | 'ai', content: string, timestamp: Date}>>([])
  const [isAISpeaking, setIsAISpeaking] = useState(false)

  const character = {
    name: 'Luna',
    color: 'bg-purple-500'
  }

  const handleVoiceTranscript = (text: string) => {
    if (text.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: text,
        timestamp: new Date()
      }
      
      setConversation(prev => [...prev, userMessage])
      
      // Generate AI response
      setTimeout(() => {
        generateAIResponse(text)
      }, 1000)
    }
  }

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase()
    let responses = aiVoiceResponses.encouragement
    
    if (input.includes('こんにちは') || input.includes('はじめまして')) {
      responses = aiVoiceResponses.greeting
    } else if (input.includes('疲れ') || input.includes('辛い') || input.includes('ストレス')) {
      responses = aiVoiceResponses.advice
    }
    
    const response = responses[Math.floor(Math.random() * responses.length)]
    
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai' as const,
      content: response,
      timestamp: new Date()
    }
    
    setConversation(prev => [...prev, aiMessage])
    
    // Text-to-speech for AI response
    if (isAudioEnabled) {
      speakText(response)
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsAISpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.9
      utterance.pitch = 1.1
      
      utterance.onend = () => {
        setIsAISpeaking(false)
      }
      
      speechSynthesis.speak(utterance)
    }
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    if (isAISpeaking) {
      speechSynthesis.cancel()
      setIsAISpeaking(false)
    }
  }

  const handleVoiceError = (error: string) => {
    console.error('Voice input error:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={`${character.color} text-white`}>
                  {character.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-medium text-gray-900">音声チャット</h1>
                <p className="text-xs text-gray-500 flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isAISpeaking ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`}></div>
                  {isAISpeaking ? '話しています...' : 'オンライン'}
                </p>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Introduction */}
        {conversation.length === 0 && (
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarFallback className={`${character.color} text-white text-xl`}>
                  {character.name[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {character.name}との音声対話
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                マイクボタンをタップして、気軽にお話しください。Lunaがあなたの声に応答します。
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mic className="h-3 w-3" />
                  <span>音声入力</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Volume2 className="h-3 w-3" />
                  <span>音声応答</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Conversation History */}
        {conversation.length > 0 && (
          <div className="space-y-4">
            {conversation.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {message.type === 'ai' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={`${character.color} text-white text-sm`}>
                        {character.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('ja-JP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voice Input Component */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Mic className="h-5 w-5 text-blue-500" />
              <span>音声で話す</span>
            </CardTitle>
            <CardDescription>
              マイクボタンを押して話しかけてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              onError={handleVoiceError}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">クイックアクション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => handleVoiceTranscript("今日はとても疲れています")}
              >
                <div className="text-left">
                  <div className="font-medium">疲れを伝える</div>
                  <div className="text-sm text-gray-500">「今日はとても疲れています」</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => handleVoiceTranscript("ストレスが溜まっています")}
              >
                <div className="text-left">
                  <div className="font-medium">ストレスを相談</div>
                  <div className="text-sm text-gray-500">「ストレスが溜まっています」</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => handleVoiceTranscript("今日はいい気分です")}
              >
                <div className="text-left">
                  <div className="font-medium">良い気分を共有</div>
                  <div className="text-sm text-gray-500">「今日はいい気分です」</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>音声チャットの特徴</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 自然な日本語での音声認識</li>
                <li>• AIによる音声応答（ON/OFF切替可能）</li>
                <li>• 感情に寄り添った対話</li>
                <li>• プライバシー保護された会話</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Text Chat Alternative */}
        <div className="text-center">
          <Button 
            variant="outline"
            onClick={() => router.push('/chat')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            テキストチャットに切り替え
          </Button>
        </div>
      </div>
    </div>
  )
}