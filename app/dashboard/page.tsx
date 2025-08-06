'use client'
import '../globals.css'

import { useState } from 'react'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { Check } from 'lucide-react'

export default function Dashboard() {
  const [friendLevel] = useState(85)
  const [todayProgress] = useState(50)
  const [weeklyStreak] = useState(5)
  const [totalXP] = useState(850)
  const [maxXP] = useState(1000)

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
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: 'white' }}>
      {/* ヘッダー部分 - キャラクターとメッセージ */}
      <div style={{ padding: '16px', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* キャラクターアイコン */}
          <div style={{ width: '64px', height: '64px', backgroundColor: '#a3e635', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#111827', fontSize: '12px', fontWeight: '500' }}>キャラクター</span>
          </div>
          
          {/* メッセージ吹き出し */}
          <div style={{ flex: 1, backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px' }}>
            <p style={{ fontSize: '14px', color: '#d1d5db' }}>
              おかえりなさい。今日はどんな一日でしたか？午後の時間はいかがお過ごしですか？少し休憩してみましょう。...
            </p>
          </div>
        </div>

        {/* フレンドレベル */}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>フレンドレベル {friendLevel}</span>
          <div style={{ flex: 1, margin: '0 12px', height: '8px', backgroundColor: '#374151', borderRadius: '4px', position: 'relative' }}>
            <div style={{ position: 'absolute', height: '100%', width: `${(totalXP / maxXP) * 100}%`, backgroundColor: '#a3e635', borderRadius: '4px' }}></div>
          </div>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>lv.8 {totalXP} / {maxXP} xp</span>
        </div>
      </div>

      {/* 今日の運勢・メッセージ */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#9ca3af', marginBottom: '8px' }}>今日の運勢・メッセージ</h3>
          <p style={{ fontSize: '14px', color: '#d1d5db', marginBottom: '8px' }}>
            あなたの存在自体が、誰かにとっての光になっています。
          </p>
          <p style={{ fontSize: '14px', color: '#d1d5db' }}>
            今日も自分らしく、一歩ずつ前に進んでいきましょう。
          </p>
          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: '#60a5fa' }}>🔵 今日のラッキーカラー: ブルー</span>
          </div>
        </div>
      </div>

      {/* 今週の記録 */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#9ca3af', marginBottom: '12px' }}>今週の記録</h3>
          
          {/* 今日の達成度 */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>今日の達成度</span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>2/4 タスク完了</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#374151', borderRadius: '4px', position: 'relative' }}>
              <div style={{ position: 'absolute', height: '100%', width: `${todayProgress}%`, backgroundColor: '#a3e635', borderRadius: '4px' }}></div>
            </div>
          </div>

          {/* 連続記録 */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>連続記録</span>
              <span style={{ fontSize: '12px', color: '#a3e635', fontWeight: '500' }}>12日</span>
            </div>
          </div>

          {/* 今週のチェックイン */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>今週のチェックイン</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: day <= weeklyStreak ? '#a3e635' : '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {day <= weeklyStreak && (
                    <Check style={{ width: '12px', height: '12px', color: '#111827' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 今日のチャレンジ */}
      <div style={{ padding: '8px 16px' }}>
        <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#9ca3af', marginBottom: '12px' }}>今日のチャレンジ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todaysChallenges.map((challenge) => (
              <div
                key={challenge.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: challenge.completed ? 'rgba(55, 65, 81, 0.5)' : '#374151'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${challenge.completed ? '#a3e635' : '#6b7280'}`,
                      backgroundColor: challenge.completed ? '#a3e635' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {challenge.completed && (
                      <Check style={{ width: '12px', height: '12px', color: '#111827' }} />
                    )}
                  </div>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      color: challenge.completed ? '#9ca3af' : '#e5e7eb',
                      textDecoration: challenge.completed ? 'line-through' : 'none'
                    }}>
                      {challenge.title}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                      {challenge.xp} XP · {challenge.time}
                    </p>
                  </div>
                </div>
                {!challenge.completed && (
                  <button
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#a3e635',
                      color: '#111827',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    開始
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 最近の実績 */}
      <div style={{ padding: '8px 16px', paddingBottom: '96px' }}>
        <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#9ca3af', marginBottom: '12px' }}>最近の実績</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(55, 65, 81, 0.5)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{achievement.icon}</span>
                  <span style={{ fontSize: '14px', color: '#d1d5db' }}>{achievement.title}</span>
                </div>
                {achievement.new && (
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: '#a3e635',
                    color: '#111827',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ボトムナビゲーション */}
      <MobileBottomNav />
    </div>
  )
}