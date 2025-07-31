'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const characters = [
  {
    id: 'luna',
    name: 'Luna',
    displayName: 'Luna',
    description: '優しく共感的',
    personality: '穏やかで思いやりのある対話を心がけます。困ったときはいつでも寄り添います。'
  },
  {
    id: 'aria',
    name: 'Aria',
    displayName: 'Aria',
    description: '明るく励ましてくれる',
    personality: '元気で楽観的な視点を提供します。一緒に前向きに歩んでいきましょう。'
  },
  {
    id: 'zen',
    name: 'Zen',
    displayName: 'Zen',
    description: '落ち着いていて知的',
    personality: '冷静で深い洞察を共有します。静かに、でも確実にサポートします。'
  }
]

export default function Characters() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState('')

  const handleContinue = () => {
    if (selectedCharacter) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-xl font-semibold text-center mb-2">AIキャラクターを選択</h1>
        <p className="text-gray-400 text-sm text-center">あなたの相談相手を選んでください</p>
      </div>

      {/* Character Selection */}
      <div className="flex-1 space-y-4">
        {characters.map((character, index) => (
          <motion.div
            key={character.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedCharacter === character.id
                ? 'bg-gray-700 border-emerald-400 shadow-lg'
                : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => setSelectedCharacter(character.id)}
          >
            <div className="flex items-center space-x-4">
              {/* Radio button */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedCharacter === character.id
                  ? 'border-emerald-400 bg-emerald-400'
                  : 'border-gray-500'
              }`}>
                {selectedCharacter === character.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              
              {/* Character info */}
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">{character.displayName}</h3>
                <p className="text-emerald-400 text-sm font-medium">{character.description}</p>
                <p className="text-gray-400 text-sm mt-1">{character.personality}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="pt-6">
        <Button
          onClick={handleContinue}
          disabled={!selectedCharacter}
          className={`w-full h-14 text-lg font-semibold rounded-xl transition-all ${
            selectedCharacter
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          続ける
        </Button>
      </div>
    </div>
  )
}