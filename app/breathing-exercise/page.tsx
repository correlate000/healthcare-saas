'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Play, Pause, RotateCcw, Info, Wind, Heart, Brain } from 'lucide-react'

interface BreathingPattern {
  name: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  description: string
  benefits: string[]
  color: string
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: '4-7-8 呼吸法',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    description: 'リラックスと睡眠改善に効果的な呼吸法',
    benefits: ['不安の軽減', '睡眠の質向上', '血圧低下'],
    color: '#a78bfa'
  },
  {
    name: 'ボックス呼吸',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: 'ストレス管理に最適な四角形呼吸法',
    benefits: ['集中力向上', 'ストレス軽減', '感情の安定'],
    color: '#60a5fa'
  },
  {
    name: 'リラックス呼吸',
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
    description: '副交感神経を活性化させる呼吸法',
    benefits: ['即座のリラックス', '心拍数低下', '緊張緩和'],
    color: '#34d399'
  }
]

export default function BreathingExercisePage() {
  const router = useRouter()
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalCycles, setTotalCycles] = useState(0)
  const [cycleCount, setCycleCount] = useState(5)
  const animationFrameRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const phaseTimeRef = useRef<number>()

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const startExercise = () => {
    setIsPlaying(true)
    setCurrentPhase('inhale')
    setTimeRemaining(selectedPattern.inhale)
    phaseTimeRef.current = selectedPattern.inhale * 1000
    startTimeRef.current = Date.now()
    animate()
  }

  const stopExercise = () => {
    setIsPlaying(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const resetExercise = () => {
    stopExercise()
    setCurrentPhase('inhale')
    setTimeRemaining(0)
    setTotalCycles(0)
  }

  const animate = () => {
    if (!startTimeRef.current || !phaseTimeRef.current) return

    const elapsed = Date.now() - startTimeRef.current
    const remaining = Math.max(0, phaseTimeRef.current - elapsed) / 1000

    setTimeRemaining(remaining)

    if (remaining <= 0) {
      // Move to next phase
      moveToNextPhase()
    } else {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }

  const moveToNextPhase = () => {
    const phases: Array<'inhale' | 'hold1' | 'exhale' | 'hold2'> = ['inhale', 'hold1', 'exhale', 'hold2']
    const currentIndex = phases.indexOf(currentPhase)
    let nextIndex = (currentIndex + 1) % 4
    let nextPhase = phases[nextIndex]
    
    // Skip phases with 0 duration
    while (selectedPattern[nextPhase] === 0 && nextIndex !== currentIndex) {
      nextIndex = (nextIndex + 1) % 4
      nextPhase = phases[nextIndex]
    }

    if (nextPhase === 'inhale') {
      setTotalCycles(prev => {
        const newCount = prev + 1
        if (newCount >= cycleCount) {
          stopExercise()
          return prev
        }
        return newCount
      })
    }

    setCurrentPhase(nextPhase)
    phaseTimeRef.current = selectedPattern[nextPhase] * 1000
    startTimeRef.current = Date.now()
    
    if (isPlaying) {
      animate()
    }
  }

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return '吸う'
      case 'hold1': return '止める'
      case 'exhale': return '吐く'
      case 'hold2': return '止める'
    }
  }

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'inhale': return '↑'
      case 'hold1': return '━'
      case 'exhale': return '↓'
      case 'hold2': return '━'
    }
  }

  const circleScale = () => {
    if (!isPlaying) return 1
    switch (currentPhase) {
      case 'inhale': return 1.5
      case 'hold1': return 1.5
      case 'exhale': return 1
      case 'hold2': return 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                呼吸エクササイズ
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                心を落ち着かせる呼吸法を実践しましょう
              </p>
            </div>
          </div>
        </div>

        {/* Pattern Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {breathingPatterns.map((pattern) => (
            <button
              key={pattern.name}
              onClick={() => {
                setSelectedPattern(pattern)
                resetExercise()
              }}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedPattern.name === pattern.name
                  ? 'bg-white shadow-lg ring-2 ring-purple-500'
                  : 'bg-white/70 hover:bg-white hover:shadow-md'
              }`}
            >
              <h3 className="font-semibold text-gray-900">{pattern.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>
              <div className="flex gap-3 mt-3 text-xs">
                <span className="text-gray-500">
                  吸う: {pattern.inhale}秒
                </span>
                {pattern.hold1 > 0 && (
                  <span className="text-gray-500">
                    止める: {pattern.hold1}秒
                  </span>
                )}
                <span className="text-gray-500">
                  吐く: {pattern.exhale}秒
                </span>
                {pattern.hold2 > 0 && (
                  <span className="text-gray-500">
                    止める: {pattern.hold2}秒
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Main Exercise Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center">
            {/* Breathing Circle */}
            <div className="relative w-64 h-64 mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out"
                  style={{
                    backgroundColor: selectedPattern.color + '20',
                    transform: `scale(${circleScale()})`,
                    border: `4px solid ${selectedPattern.color}`
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getPhaseIcon()}</div>
                    <div className="text-2xl font-bold" style={{ color: selectedPattern.color }}>
                      {isPlaying ? getPhaseText() : '準備完了'}
                    </div>
                    {isPlaying && (
                      <div className="text-3xl font-mono mt-2">
                        {Math.ceil(timeRemaining)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cycle Counter */}
            {isPlaying && (
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  サイクル: {totalCycles} / {cycleCount}
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4 mb-6">
              {!isPlaying ? (
                <button
                  onClick={startExercise}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Play className="h-5 w-5" />
                  開始
                </button>
              ) : (
                <button
                  onClick={stopExercise}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Pause className="h-5 w-5" />
                  一時停止
                </button>
              )}
              <button
                onClick={resetExercise}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                <RotateCcw className="h-5 w-5" />
                リセット
              </button>
            </div>

            {/* Cycle Settings */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-gray-600">サイクル数:</label>
              <select
                value={cycleCount}
                onChange={(e) => setCycleCount(Number(e.target.value))}
                disabled={isPlaying}
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
              >
                <option value={3}>3回</option>
                <option value={5}>5回</option>
                <option value={10}>10回</option>
                <option value={15}>15回</option>
              </select>
            </div>

            {/* Benefits */}
            <div className="w-full max-w-md bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="h-5 w-5" />
                {selectedPattern.name}の効果
              </h3>
              <ul className="space-y-2">
                {selectedPattern.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="w-full max-w-md mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>ヒント:</strong> 楽な姿勢で座り、目を閉じるか一点を見つめながら行うと効果的です。
                無理をせず、自分のペースで呼吸を調整してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}