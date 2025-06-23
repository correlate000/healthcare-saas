'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Heart, Zap, Crown, MapPin, Calendar, Clock } from 'lucide-react'

export interface StoryArc {
  id: string
  title: string
  description: string
  chapters: StoryChapter[]
  character: 'luna' | 'aria' | 'zen'
  theme: 'growth' | 'resilience' | 'connection' | 'discovery'
  estimatedDuration: string
}

export interface StoryChapter {
  id: string
  title: string
  content: string
  choices?: StoryChoice[]
  reward?: {
    xp: number
    item?: string
    insight?: string
  }
  mood?: 'uplifting' | 'reflective' | 'energizing' | 'calming'
  unlockCondition?: {
    type: 'streak' | 'mood_improvement' | 'social_interaction'
    value: number
  }
}

export interface StoryChoice {
  id: string
  text: string
  consequence: string
  mood_impact: number
  next_chapter?: string
}

// Sample story arcs with personalized narratives
const storyArcs: StoryArc[] = [
  {
    id: 'luna-growth',
    title: 'Luna\'s Journey of Self-Discovery',
    description: 'Join Luna as she guides you through understanding your emotional patterns',
    character: 'luna',
    theme: 'discovery',
    estimatedDuration: '2週間',
    chapters: [
      {
        id: 'chapter-1',
        title: 'The Mirror of Emotions',
        content: '今日、私は新しい友達（あなた）に出会いました。🌙✨ あなたの心の中には、まるで月の満ち欠けのように、さまざまな感情が宿っています。一緒に、その美しい変化を観察してみませんか？',
        choices: [
          {
            id: 'curious',
            text: '興味深いです、もっと教えて',
            consequence: 'Lunaがあなたの好奇心を感じ取り、より深い洞察を分かち合います',
            mood_impact: 2
          },
          {
            id: 'hesitant',
            text: '少し不安ですが、試してみます',
            consequence: 'Lunaがあなたのペースに合わせて、優しくサポートします',
            mood_impact: 1
          }
        ],
        reward: { xp: 25, insight: '感情は天気のようなもの。一時的で、必ず変化します。' },
        mood: 'reflective'
      },
      {
        id: 'chapter-2',
        title: 'The Garden of Thoughts',
        content: 'あなたの心は美しい庭のようです。🌸 時には雑草（ネガティブな思考）が生えることもありますが、それも成長の一部。一緒に、心の庭を育てる方法を学びましょう。',
        reward: { xp: 30, item: 'Mental Garden Badge' },
        mood: 'uplifting'
      }
    ]
  },
  {
    id: 'aria-energy',
    title: 'Aria\'s Adventure of Vitality',
    description: 'Aria と一緒にエネルギーを高め、活力に満ちた毎日を手に入れる',
    character: 'aria',
    theme: 'growth',
    estimatedDuration: '10日間',
    chapters: [
      {
        id: 'energy-1',
        title: 'The Spark Within',
        content: 'こんにちは！私はAria、あなたの元気の源を見つけるお手伝いをします！🌟 みんなには内側に輝く星があるんです。一緒に、その星を見つけて、もっと明るく輝かせましょう！',
        choices: [
          {
            id: 'excited',
            text: 'はい！やってみたいです！',
            consequence: 'Ariaのエネルギーがあなたに伝わり、新しい発見への扉が開きます',
            mood_impact: 3
          },
          {
            id: 'tired',
            text: '疲れているけど、頑張ります',
            consequence: 'Ariaが優しくエネルギーを分けてくれます',
            mood_impact: 2
          }
        ],
        reward: { xp: 35, insight: '小さな成功の積み重ねが、大きな自信を育てます。' },
        mood: 'energizing'
      }
    ]
  },
  {
    id: 'zen-peace',
    title: 'Zen\'s Path to Inner Peace',
    description: '禅師Zenと共に心の平和と安らぎを見つける旅',
    character: 'zen',
    theme: 'resilience',
    estimatedDuration: '3週間',
    chapters: [
      {
        id: 'peace-1',
        title: 'The Still Waters',
        content: '静寂の中で、こんにちは。🧘‍♂️ 私はZen。あなたの心の湖が波立っているとき、一緒に穏やかな水面を取り戻しましょう。深呼吸とともに、今この瞬間に意識を向けてみてください。',
        reward: { xp: 20, insight: '平和は外から得るものではなく、内側で育てるもの。' },
        mood: 'calming'
      }
    ]
  }
]

// Daily narrative snippets based on user's mood and progress
const dailyNarratives = {
  morning: [
    { mood: 'any', character: 'luna', text: '🌙 朝の静けさの中で、新しい一日があなたを待っています。今日はどんな発見があるでしょうか？' },
    { mood: 'any', character: 'aria', text: '🌟 おはよう！今日という新しいキャンバスに、どんな色を塗りますか？ワクワクしますね！' },
    { mood: 'low', character: 'zen', text: '🧘‍♂️ 朝のひんやりした空気を感じてください。あなたの中の静けさが、一日の支えとなります。' }
  ],
  afternoon: [
    { mood: 'tired', character: 'luna', text: '🌙 午後の疲れを感じていますね。月が満ち欠けするように、エネルギーも自然なリズムがあります。' },
    { mood: 'good', character: 'aria', text: '🌟 午後の陽射しのように、あなたの笑顔が周りを明るくしていますね！' }
  ],
  evening: [
    { mood: 'any', character: 'zen', text: '🧘‍♂️ 夕暮れとともに、今日一日を振り返る時間です。小さな感謝を見つけてみましょう。' },
    { mood: 'accomplished', character: 'aria', text: '🌟 今日も素晴らしい一日でしたね！あなたの努力が実を結んでいます。' }
  ]
}

// Character development arcs that evolve based on user interaction
const characterEvolution = {
  luna: {
    stages: [
      { name: '新月', description: '出会ったばかりの神秘的な存在', relationship: 0 },
      { name: '三日月', description: '少しずつ心を開いてくれる友達', relationship: 25 },
      { name: '半月', description: '深い話ができる相談相手', relationship: 50 },
      { name: '満月', description: '魂の絆で結ばれたパートナー', relationship: 100 }
    ]
  },
  aria: {
    stages: [
      { name: '新星', description: '元気いっぱいの新しい友達', relationship: 0 },
      { name: '輝星', description: 'あなたの応援団長', relationship: 25 },
      { name: '流星', description: '一緒に冒険する親友', relationship: 50 },
      { name: '恒星', description: '永遠に輝く心の支え', relationship: 100 }
    ]
  },
  zen: {
    stages: [
      { name: '新参者', description: '静かな導き手', relationship: 0 },
      { name: '弟子', description: 'あなたの成長を見守る師', relationship: 25 },
      { name: '友人', description: '心の平和を分かち合う仲間', relationship: 50 },
      { name: '師弟', description: '互いに学び合う深い関係', relationship: 100 }
    ]
  }
}

export function StoryNarrative({ 
  currentArc,
  userMood,
  timeOfDay,
  onChoiceSelect,
  onChapterComplete 
}: {
  currentArc?: StoryArc
  userMood: string
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  onChoiceSelect?: (choice: StoryChoice) => void
  onChapterComplete?: (chapterId: string) => void
}) {
  const [currentChapter, setCurrentChapter] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showReward, setShowReward] = useState(false)

  if (!currentArc) return null

  const chapter = currentArc.chapters[currentChapter]

  const handleChoiceSelect = (choice: StoryChoice) => {
    setSelectedChoice(choice.id)
    
    setTimeout(() => {
      setShowReward(true)
      if (onChoiceSelect) onChoiceSelect(choice)
      
      setTimeout(() => {
        if (currentChapter < currentArc.chapters.length - 1) {
          setCurrentChapter(currentChapter + 1)
        }
        setShowReward(false)
        setSelectedChoice(null)
        if (onChapterComplete) onChapterComplete(chapter.id)
      }, 2000)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6">
          {/* Story Arc Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{currentArc.title}</h3>
              <p className="text-sm text-gray-600">{currentArc.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl">
                {currentArc.character === 'luna' ? '🌙' : 
                 currentArc.character === 'aria' ? '⭐' : '🧘‍♂️'}
              </div>
              <div className="text-xs text-gray-500">{currentArc.estimatedDuration}</div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Chapter {currentChapter + 1} of {currentArc.chapters.length}</span>
              <span>{Math.round(((currentChapter + 1) / currentArc.chapters.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-full h-2 transition-all duration-1000"
                style={{ width: `${((currentChapter + 1) / currentArc.chapters.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Chapter Content */}
          <Card className="bg-white border-0 shadow-inner">
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3">{chapter.title}</h4>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-gray-700 leading-relaxed">{chapter.content}</p>

                {/* Choices */}
                {chapter.choices && !selectedChoice && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-600">どう反応しますか？</p>
                    {chapter.choices.map((choice) => (
                      <motion.button
                        key={choice.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoiceSelect(choice)}
                        className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                      >
                        <div className="font-medium text-gray-800">{choice.text}</div>
                        <div className="text-xs text-gray-600 mt-1">{choice.consequence}</div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Selected Choice Feedback */}
                {selectedChoice && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="text-green-800 font-medium">選択が反映されています...</div>
                  </motion.div>
                )}

                {/* Reward Display */}
                <AnimatePresence>
                  {showReward && chapter.reward && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Star className="h-6 w-6 text-yellow-500" />
                        <div>
                          <div className="font-semibold text-yellow-800">Chapter Complete!</div>
                          <div className="text-sm text-yellow-700">
                            +{chapter.reward.xp} XP獲得
                            {chapter.reward.item && ` • ${chapter.reward.item}を獲得`}
                          </div>
                          {chapter.reward.insight && (
                            <div className="text-xs text-yellow-600 mt-1 italic">
                              "{chapter.reward.insight}"
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export function DailyNarrativeSnippet({ 
  userMood, 
  timeOfDay, 
  characterPreference 
}: {
  userMood: string
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  characterPreference?: 'luna' | 'aria' | 'zen'
}) {
  const [currentSnippet, setCurrentSnippet] = useState<any>(null)

  useEffect(() => {
    const timeBasedNarratives = dailyNarratives[timeOfDay] || []
    
    // Filter by mood or character preference
    let filteredNarratives = timeBasedNarratives.filter(n => 
      (n.mood === userMood || n.mood === 'any') &&
      (!characterPreference || n.character === characterPreference)
    )

    if (filteredNarratives.length === 0) {
      filteredNarratives = timeBasedNarratives.filter(n => n.mood === 'any')
    }

    if (filteredNarratives.length > 0) {
      const randomSnippet = filteredNarratives[Math.floor(Math.random() * filteredNarratives.length)]
      setCurrentSnippet(randomSnippet)
    }
  }, [userMood, timeOfDay, characterPreference])

  if (!currentSnippet) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">
              {currentSnippet.character === 'luna' ? '🌙' : 
               currentSnippet.character === 'aria' ? '⭐' : '🧘‍♂️'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-1">
                {currentSnippet.character === 'luna' ? 'Luna' : 
                 currentSnippet.character === 'aria' ? 'Aria' : 'Zen'}からのメッセージ
              </div>
              <p className="text-gray-600 leading-relaxed">{currentSnippet.text}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function CharacterRelationshipTracker({ 
  character, 
  relationshipLevel,
  interactionCount 
}: {
  character: 'luna' | 'aria' | 'zen'
  relationshipLevel: number
  interactionCount: number
}) {
  const evolution = characterEvolution[character]
  const currentStage = evolution.stages.find(stage => 
    relationshipLevel >= stage.relationship
  ) || evolution.stages[0]

  const nextStage = evolution.stages.find(stage => 
    relationshipLevel < stage.relationship
  )

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">
            {character === 'luna' ? 'Luna' : 
             character === 'aria' ? 'Aria' : 'Zen'}との絆
          </h4>
          <div className="text-2xl">
            {character === 'luna' ? '🌙' : 
             character === 'aria' ? '⭐' : '🧘‍♂️'}
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{currentStage.name}</span>
              <span>{relationshipLevel}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-full h-2 transition-all duration-1000"
                style={{ width: `${relationshipLevel}%` }}
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-600">{currentStage.description}</p>
          
          {nextStage && (
            <div className="text-xs text-gray-500">
              次のステージ「{nextStage.name}」まで {nextStage.relationship - relationshipLevel}%
            </div>
          )}
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{interactionCount}回の対話</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}