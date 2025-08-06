'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check, Star, Trophy, Target, TrendingUp, Calendar, Heart } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [userName] = useState('ユーザー')
  const [friendLevel] = useState(85)
  const [todayProgress, setTodayProgress] = useState(50)
  const [weeklyStreak, setWeeklyStreak] = useState(5)
  const [totalXP, setTotalXP] = useState(850)
  const [maxXP] = useState(1000)

  // モックデータ
  const todaysChallenges = [
    { id: 1, title: '朝の気分チェック', xp: 20, time: '1分', completed: true },
    { id: 2, title: '感謝の記録', xp: 30, time: '1分', completed: true },
    { id: 3, title: '3分間の深呼吸', xp: 40, time: '3分', completed: false },
  ]

  const achievements = [
    { id: 1, title: '7日連続記録達成！', icon: '🔥', new: true },
    { id: 2, title: 'フレンドレベルアップ', icon: '⬆️', new: false },
    { id: 3, title: 'チーム投稿が10いいね！', icon: '❤️', new: false },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ヘッダー部分 - キャラクターとメッセージ */}
      <div className="p-4 pb-2">
        <div className="flex items-start space-x-3">
          {/* キャラクターアイコン */}
          <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center">
            <span className="text-gray-900 text-xs font-medium">キャラクター</span>
          </div>
          
          {/* メッセージ吹き出し */}
          <div className="flex-1 bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-300">
              おかえりなさい。今日はどんな一日でしたか？午後の時間はいかがお過ごしですか？少し休憩してみましょう。...
            </p>
          </div>
        </div>

        {/* フレンドレベル */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">フレンドレベル {friendLevel}</span>
          <div className="flex-1 mx-3">
            <Progress value={(totalXP / maxXP) * 100} className="h-2 bg-gray-700" />
          </div>
          <span className="text-xs text-gray-400">lv.8 {totalXP} / {maxXP} xp</span>
        </div>
      </div>

      {/* 今日の運勢・メッセージ */}
      <div className="px-4 py-2">
        <Card className="bg-gray-800 border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">今日の運勢・メッセージ</h3>
          <p className="text-sm text-gray-300 mb-2">
            あなたの存在自体が、誰かにとっての光になっています。
          </p>
          <p className="text-sm text-gray-300">
            今日も自分らしく、一歩ずつ前に進んでいきましょう。
          </p>
          <div className="mt-2">
            <span className="text-xs text-blue-400">🔵 今日のラッキーカラー: ブルー</span>
          </div>
        </Card>
      </div>

      {/* 今週の記録 */}
      <div className="px-4 py-2">
        <Card className="bg-gray-800 border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">今週の記録</h3>
          
          {/* 今日の達成度 */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">今日の達成度</span>
              <span className="text-xs text-gray-400">2/4 タスク完了</span>
            </div>
            <Progress value={todayProgress} className="h-2 bg-gray-700" />
          </div>

          {/* 連続記録 */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">連続記録</span>
              <span className="text-xs text-lime-400 font-medium">12日</span>
            </div>
          </div>

          {/* 今週のチェックイン */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">今週のチェックイン</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`w-6 h-6 rounded ${
                    day <= weeklyStreak
                      ? 'bg-lime-400'
                      : 'bg-gray-700'
                  } flex items-center justify-center`}
                >
                  {day <= weeklyStreak && (
                    <Check className="w-3 h-3 text-gray-900" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 今日のチャレンジ */}
      <div className="px-4 py-2">
        <Card className="bg-gray-800 border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">今日のチャレンジ</h3>
          <div className="space-y-2">
            {todaysChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  challenge.completed ? 'bg-gray-700/50' : 'bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      challenge.completed
                        ? 'bg-lime-400 border-lime-400'
                        : 'border-gray-500'
                    } flex items-center justify-center`}
                  >
                    {challenge.completed && (
                      <Check className="w-3 h-3 text-gray-900" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm ${
                      challenge.completed ? 'text-gray-400 line-through' : 'text-gray-200'
                    }`}>
                      {challenge.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {challenge.xp} XP · {challenge.time}
                    </p>
                  </div>
                </div>
                {!challenge.completed && (
                  <Button
                    size="sm"
                    className="bg-lime-400 hover:bg-lime-500 text-gray-900"
                    onClick={() => {
                      // チャレンジ実行
                    }}
                  >
                    開始
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 最近の実績 */}
      <div className="px-4 py-2 pb-24">
        <Card className="bg-gray-800 border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">最近の実績</h3>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-sm text-gray-300">{achievement.title}</span>
                </div>
                {achievement.new && (
                  <span className="text-xs bg-lime-400 text-gray-900 px-2 py-1 rounded">
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ボトムナビゲーション */}
      <MobileBottomNav />
    </div>
  )
}