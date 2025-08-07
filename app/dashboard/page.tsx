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
    { id: 2, title: 'Lunaとのフレンドレベルアップ', icon: '⬆️', new: true },
    { id: 3, title: 'チーム投稿が10いいね！', icon: '❤️', new: false },
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* ヘッダー部分 - キャラクターとメッセージ */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
          {/* キャラクターアイコン */}
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: '#a3e635', 
            borderRadius: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span style={{ color: '#111827', fontSize: '14px', fontWeight: '600' }}>キャラクター</span>
          </div>
          
          {/* メッセージ吹き出し */}
          <div style={{ 
            flex: 1, 
            backgroundColor: '#374151', 
            borderRadius: '12px', 
            padding: '16px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '-8px',
              top: '20px',
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '8px solid #374151'
            }}></div>
            <p style={{ fontSize: '14px', color: '#e5e7eb', margin: 0, lineHeight: '1.5' }}>
              おかえりなさい。今日はどんな一日でしたか？午後の時間はいかがお過ごしですか？少し休憩してみましょう。...
            </p>
          </div>
        </div>

        {/* フレンドレベル */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>フレンドレベル {friendLevel}</span>
          <div style={{ 
            flex: 1, 
            margin: '0 12px', 
            height: '6px', 
            backgroundColor: '#374151', 
            borderRadius: '3px', 
            position: 'relative' 
          }}>
            <div style={{ 
              position: 'absolute', 
              height: '100%', 
              width: `${(totalXP / maxXP) * 100}%`, 
              backgroundColor: '#a3e635', 
              borderRadius: '3px' 
            }}></div>
          </div>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>lv.8 {totalXP} / {maxXP} xp</span>
        </div>
      </div>

      {/* 今日の運勢・メッセージ */}
      <div style={{ padding: '0 16px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '12px', margin: '0 0 12px 0' }}>今日の運勢・メッセージ</h3>
          <p style={{ fontSize: '14px', color: '#d1d5db', marginBottom: '8px', margin: '0 0 8px 0', lineHeight: '1.5' }}>
            あなたの存在自体が、誰かにとっての光になっています。
          </p>
          <p style={{ fontSize: '14px', color: '#d1d5db', margin: '0 0 12px 0', lineHeight: '1.5' }}>
            今日も自分らしく、一歩ずつ前に進んでいきましょう。
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🔵</span>
            <span style={{ fontSize: '12px', color: '#60a5fa' }}>今日のラッキーカラー: ブルー</span>
          </div>
        </div>
      </div>

      {/* 今週の記録 */}
      <div style={{ padding: '0 16px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>今週の記録</h3>
          
          {/* 今日の達成度 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>今日の達成度</span>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>2/4 タスク完了</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#374151', borderRadius: '4px', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                height: '100%', 
                width: `${todayProgress}%`, 
                backgroundColor: '#a3e635', 
                borderRadius: '4px' 
              }}></div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>{todayProgress}%</span>
            </div>
          </div>

          {/* 連続記録 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>連続記録</span>
              <span style={{ fontSize: '16px', color: '#a3e635', fontWeight: '600' }}>12日</span>
            </div>
          </div>

          {/* 今週のチェックイン */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>今週のチェックイン</span>
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
          
          <div style={{ textAlign: 'right', marginTop: '8px' }}>
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>5 /7日</span>
          </div>
        </div>
      </div>

      {/* 今日のチャレンジ */}
      <div style={{ padding: '0 16px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', margin: 0 }}>今日のチャレンジ</h3>
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>2/4</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todaysChallenges.map((challenge) => (
              <div
                key={challenge.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: challenge.completed ? '#374151' : '#4b5563'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
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
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '14px',
                        color: challenge.completed ? '#9ca3af' : '#e5e7eb',
                        textDecoration: challenge.completed ? 'line-through' : 'none',
                        fontWeight: '500'
                      }}>
                        {challenge.title}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        backgroundColor: '#65a30d',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        簡単
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        +{challenge.xp} XP
                      </span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        ⏱ {challenge.time}
                      </span>
                    </div>
                  </div>
                </div>
                {challenge.completed && (
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: '#a3e635',
                    color: '#111827',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>
                    完了
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 最近の実績 */}
      <div style={{ padding: '0 16px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>最近の実績</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#374151'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{achievement.icon}</span>
                  <span style={{ fontSize: '14px', color: '#d1d5db', fontWeight: '500' }}>{achievement.title}</span>
                </div>
                {achievement.new && (
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: '#a3e635',
                    color: '#111827',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 今週の記録サマリー */}
      <div style={{ padding: '0 16px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f3f4f6', marginBottom: '16px', margin: '0 0 16px 0' }}>今週の記録</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>85%</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>エネルギー</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>78%</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>幸福度</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#a3e635' }}>4/5</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>週間目標</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7日連続記録達成バナー */}
      <div style={{ padding: '0 16px', marginBottom: '20px' }}>
        <div style={{ 
          backgroundColor: '#1f2937', 
          borderRadius: '12px', 
          padding: '20px', 
          textAlign: 'center',
          border: '2px solid #a3e635'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#a3e635', margin: '0 0 8px 0' }}>7日連続記録達成！</h3>
          <p style={{ fontSize: '14px', color: '#d1d5db', margin: '0 0 16px 0' }}>新しいバッジと限定スタンプをゲット！</p>
          <button style={{
            backgroundColor: '#a3e635',
            color: '#111827',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            報酬を受け取る
          </button>
        </div>
      </div>

      {/* ボトムナビゲーション */}
      <MobileBottomNav />
    </div>
  )
}