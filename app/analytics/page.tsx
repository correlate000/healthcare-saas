'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { 
  CalendarWeekIcon, CalendarMonthIcon, CalendarYearIcon, TrendUpIcon, FireIcon,
  TargetIcon, RelaxIcon, TrophySimpleIcon, ChartIcon, MoonIcon, RunnerIcon, 
  RocketIcon, CelebrationIcon, MusclePowerIcon, SparkleIcon, ExportIcon,
  MoodHappyIcon, LightningIcon, StressIcon, SleepIcon, MobileIcon, ClockIcon
} from '@/components/icons/illustrations'
import { typographyPresets, getTypographyStyles } from '@/styles/typography'

export default function AnalyticsPage() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'energy' | 'stress' | 'sleep'>('mood')
  const [animationKey, setAnimationKey] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Re-trigger animations when period changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [selectedPeriod])

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Different data for different periods
  const dataByPeriod = {
    week: {
      streak: 15,
      avgMood: 82,
      sessions: 7,
      totalTime: '21h',
      data: [
        { day: '月', mood: 75, energy: 80, stress: 40, sleep: 85 },
        { day: '火', mood: 80, energy: 75, stress: 35, sleep: 80 },
        { day: '水', mood: 85, energy: 90, stress: 30, sleep: 90 },
        { day: '木', mood: 90, energy: 85, stress: 25, sleep: 85 },
        { day: '金', mood: 78, energy: 70, stress: 50, sleep: 75 },
        { day: '土', mood: 82, energy: 85, stress: 20, sleep: 95 },
        { day: '日', mood: 88, energy: 90, stress: 15, sleep: 90 }
      ],
      insights: [
        { title: '気分の向上', content: '先週と比べて平均気分スコアが12%向上しています', icon: <TrendUpIcon size={24} color="#a3e635" />, color: '#a3e635' },
        { title: '継続力アップ', content: '7日連続でセッションを完了！素晴らしい継続力です！', icon: <FireIcon size={24} primaryColor="#f59e0b" />, color: '#f59e0b' },
        { title: '週間目標達成', content: '今週の目標時間180分を20分オーバーで達成！', icon: <TargetIcon size={24} primaryColor="#60a5fa" />, color: '#60a5fa' },
        { title: 'ストレス軽減', content: '先週より平均ストレスレベルが15%減少しました', icon: <RelaxIcon size={24} color="#a78bfa" />, color: '#a78bfa' }
      ]
    },
    month: {
      streak: 28,
      avgMood: 78,
      sessions: 28,
      totalTime: '84h',
      data: [
        { day: '第1週', mood: 72, energy: 75, stress: 45, sleep: 80 },
        { day: '第2週', mood: 75, energy: 78, stress: 40, sleep: 82 },
        { day: '第3週', mood: 82, energy: 85, stress: 30, sleep: 88 },
        { day: '第4週', mood: 83, energy: 82, stress: 28, sleep: 86 }
      ],
      insights: [
        { title: '月間達成', content: '28日間連続記録を達成！新記録です！', icon: <TrophySimpleIcon size={24} color="#fbbf24" />, color: '#fbbf24' },
        { title: '成長トレンド', content: '月初から11%の気分スコア改善を記録', icon: <ChartIcon size={24} primaryColor="#a3e635" />, color: '#a3e635' },
        { title: '睡眠改善', content: '平均睡眠の質が月初より8%向上しています', icon: <MoonIcon size={24} primaryColor="#60a5fa" />, color: '#60a5fa' },
        { title: '活動量増加', content: '先月より身体活動時間が25%増加しました', icon: <RunnerIcon size={24} color="#f87171" />, color: '#f87171' }
      ]
    },
    year: {
      streak: 234,
      avgMood: 75,
      sessions: 312,
      totalTime: '936h',
      data: [
        { day: '1月', mood: 68, energy: 70, stress: 50, sleep: 75 },
        { day: '2月', mood: 70, energy: 72, stress: 48, sleep: 76 },
        { day: '3月', mood: 72, energy: 74, stress: 45, sleep: 78 },
        { day: '4月', mood: 74, energy: 76, stress: 42, sleep: 80 },
        { day: '5月', mood: 76, energy: 78, stress: 40, sleep: 82 },
        { day: '6月', mood: 78, energy: 80, stress: 38, sleep: 84 },
        { day: '7月', mood: 80, energy: 82, stress: 35, sleep: 85 },
        { day: '8月', mood: 82, energy: 84, stress: 32, sleep: 86 }
      ],
      insights: [
        { title: '年間成長', content: '年初から気分スコアが20%向上しました', icon: <RocketIcon size={24} color="#a3e635" />, color: '#a3e635' },
        { title: 'マイルストーン', content: '300セッション達成！素晴らしい継続です', icon: <CelebrationIcon size={24} color="#fbbf24" />, color: '#fbbf24' },
        { title: '健康改善', content: 'ストレスレベルが年初から36%減少', icon: <MusclePowerIcon size={24} primaryColor="#60a5fa" />, color: '#60a5fa' },
        { title: '習慣化成功', content: '85%の日でチェックインを完了しています', icon: <SparkleIcon size={24} color="#a78bfa" />, color: '#a78bfa' }
      ]
    }
  }

  const currentData = dataByPeriod[selectedPeriod]

  const periods = [
    { key: 'week', label: '週間', icon: <CalendarWeekIcon size={20} color="#9ca3af" /> },
    { key: 'month', label: '月間', icon: <CalendarMonthIcon size={20} color="#9ca3af" /> },
    { key: 'year', label: '年間', icon: <CalendarYearIcon size={20} color="#9ca3af" /> }
  ]

  const metrics = [
    { key: 'mood', label: '気分', color: '#a3e635', icon: <MoodHappyIcon size={20} color="#a3e635" /> },
    { key: 'energy', label: 'エネルギー', color: '#fbbf24', icon: <LightningIcon size={20} color="#fbbf24" /> },
    { key: 'stress', label: 'ストレス', color: '#f87171', icon: <StressIcon size={20} color="#f87171" />, inverse: true },
    { key: 'sleep', label: '睡眠', color: '#60a5fa', icon: <SleepIcon size={20} color="#60a5fa" /> }
  ]

  const selectedMetricInfo = metrics.find(m => m.key === selectedMetric) || metrics[0]

  // Calculate max value for chart scaling
  const getMaxValue = () => {
    const values = currentData.data.map(d => d[selectedMetric as keyof typeof d] as number)
    return Math.max(...values, 100)
  }

  const maxValue = getMaxValue()

  // Bird Character Component
  const BirdCharacter = ({ bodyColor, size = 40 }: { bodyColor: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <ellipse cx="50" cy="55" rx="30" ry="33" fill={bodyColor} />
      <ellipse cx="50" cy="60" rx="22" ry="25" fill="#ecfccb" />
      <ellipse cx="28" cy="50" rx="12" ry="20" fill={bodyColor} transform="rotate(-20 28 50)" />
      <ellipse cx="72" cy="50" rx="12" ry="20" fill={bodyColor} transform="rotate(20 72 50)" />
      <circle cx="40" cy="45" r="6" fill="white" />
      <circle cx="42" cy="45" r="4" fill="#111827" />
      <circle cx="60" cy="45" r="6" fill="white" />
      <circle cx="58" cy="45" r="4" fill="#111827" />
      <path d="M50 50 L45 55 L55 55 Z" fill="#fbbf24" />
    </svg>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #111827 100%)',
      color: 'white',
      paddingBottom: '120px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(31, 41, 55, 0.4)'
      }}>
        <h1 style={{ 
          ...typographyPresets.pageTitle(isMobile),
          fontWeight: '800', 
          background: 'linear-gradient(135deg, #f3f4f6 0%, #a3e635 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0 
        }}>
          分析・インサイト
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Period selector with icons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              style={{
                flex: 1,
                padding: '14px 20px',
                background: selectedPeriod === period.key 
                  ? 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)' 
                  : 'rgba(55, 65, 81, 0.6)',
                backdropFilter: 'blur(10px)',
                color: selectedPeriod === period.key ? '#111827' : '#d1d5db',
                border: selectedPeriod === period.key 
                  ? '1px solid rgba(163, 230, 53, 0.3)' 
                  : '1px solid rgba(55, 65, 81, 0.3)',
                borderRadius: '16px',
                ...getTypographyStyles('button', isMobile),
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: selectedPeriod === period.key 
                  ? '0 4px 16px rgba(163, 230, 53, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                transform: selectedPeriod === period.key ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              {period.icon}
              {period.label}
            </button>
          ))}
        </div>

        {/* Summary stats with animations */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '16px', 
          marginBottom: '32px' 
        }}>
          {[
            { value: currentData.streak, label: selectedPeriod === 'week' ? '連続記録' : selectedPeriod === 'month' ? '月間記録' : '年間記録', icon: <FireIcon size={32} primaryColor="#f59e0b" />, color: '#f59e0b' },
            { value: `${currentData.avgMood}%`, label: '平均気分', icon: <MoodHappyIcon size={32} color="#a3e635" />, color: '#a3e635' },
            { value: currentData.sessions, label: 'セッション', icon: <MobileIcon size={32} primaryColor="#60a5fa" />, color: '#60a5fa' },
            { value: currentData.totalTime, label: '総利用時間', icon: <ClockIcon size={32} primaryColor="#a78bfa" />, color: '#a78bfa' }
          ].map((stat, index) => (
            <div key={`${stat.label}-${animationKey}`} style={{ 
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: '20px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              animation: `fadeInScale 0.5s ease-out ${index * 0.1}s both`,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
              e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}20`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ 
                fontSize: isMobile ? '28px' : '32px', 
                fontWeight: '800', 
                background: `linear-gradient(135deg, ${stat.color} 0%, #f3f4f6 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>
                {stat.value}
              </div>
              <div style={{ ...getTypographyStyles('label', isMobile), color: '#9ca3af' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Metric selector */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            ...typographyPresets.sectionHeader(isMobile)
          }}>
            メトリクス分析
          </h3>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key as any)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: selectedMetric === metric.key ? metric.color : 'rgba(55, 65, 81, 0.6)',
                  color: selectedMetric === metric.key ? '#111827' : '#d1d5db',
                  border: 'none',
                  borderRadius: '12px',
                  ...getTypographyStyles('button', isMobile),
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                {metric.icon}
                {metric.label}
              </button>
            ))}
          </div>

          {/* Interactive Chart */}
          <div style={{ 
            background: 'rgba(31, 41, 55, 0.6)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(55, 65, 81, 0.3)',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px' 
            }}>
              <h4 style={{ 
                ...typographyPresets.cardTitle(isMobile),
                margin: 0 
              }}>
                {selectedMetricInfo.label}トレンド
              </h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: `${selectedMetricInfo.color}20`,
                borderRadius: '8px'
              }}>
                {selectedMetricInfo.icon}
                <span style={{ 
                  ...getTypographyStyles('base', isMobile), 
                  color: selectedMetricInfo.color,
                  fontWeight: '600' 
                }}>
                  {selectedMetricInfo.inverse ? '低いほど良い' : '高いほど良い'}
                </span>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'space-between',
              height: '200px',
              gap: isMobile ? '4px' : '8px',
              marginBottom: '20px',
              position: 'relative',
              padding: '0 4px'
            }}>
              {currentData.data.map((day, index) => {
                const value = day[selectedMetric as keyof typeof day] as number
                const height = (value / maxValue) * 100
                
                return (
                  <div key={`${day.day}-${animationKey}`} style={{
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    position: 'relative',
                    cursor: 'pointer'
                  }}>
                    {/* Value label */}
                    <div style={{
                      position: 'absolute',
                      bottom: `${height + 5}%`,
                      width: '100%',
                      textAlign: 'center',
                      ...getTypographyStyles('small', isMobile),
                      fontWeight: '600',
                      color: selectedMetricInfo.color,
                      zIndex: 2
                    }}>
                      {value}%
                    </div>
                    
                    {/* Bar */}
                    <div 
                      data-bar
                      style={{
                        width: isMobile ? '90%' : '80%',
                        height: `${height}%`,
                        minHeight: '4px',
                        background: `linear-gradient(180deg, ${selectedMetricInfo.color} 0%, ${selectedMetricInfo.color}88 100%)`,
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transformOrigin: 'bottom',
                        animation: `growUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1.05)'
                        e.currentTarget.style.boxShadow = `0 -4px 20px ${selectedMetricInfo.color}40`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    ></div>
                  </div>
                )
              })}
            </div>
            
            {/* Day labels */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              {currentData.data.map((day) => (
                <div key={day.day} style={{
                  flex: 1,
                  textAlign: 'center'
                }}>
                  <span style={{ 
                    ...getTypographyStyles('small', isMobile), 
                    color: '#9ca3af',
                    fontWeight: '500'
                  }}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>

            {/* Average line */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: 'rgba(163, 230, 53, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(163, 230, 53, 0.2)'
            }}>
              <span style={{ ...getTypographyStyles('base', isMobile), color: '#d1d5db' }}>平均値</span>
              <span style={{ 
                ...getTypographyStyles('h4', isMobile), 
                fontWeight: '700', 
                color: '#a3e635' 
              }}>
                {Math.round(currentData.data.reduce((sum, d) => sum + (d[selectedMetric as keyof typeof d] as number), 0) / currentData.data.length)}%
              </span>
            </div>
          </div>
        </div>

        {/* Insights with icons */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ 
            ...typographyPresets.sectionHeader(isMobile),
            marginBottom: '20px'
          }}>
            {selectedPeriod === 'week' ? '今週のハイライト' : 
             selectedPeriod === 'month' ? '今月のハイライト' : '今年のハイライト'}
          </h3>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {currentData.insights.map((insight, index) => (
              <div key={`${insight.title}-${animationKey}`} style={{ 
                background: 'rgba(31, 41, 55, 0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '20px',
                border: `1px solid ${insight.color}30`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 8px 24px ${insight.color}20`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                {/* Background decoration */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  background: `radial-gradient(circle, ${insight.color}20 0%, transparent 70%)`,
                  borderRadius: '50%'
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '12px' 
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      backgroundColor: `${insight.color}20`,
                      borderRadius: '12px'
                    }}>
                      {insight.icon}
                    </div>
                    <h4 style={{ 
                      ...typographyPresets.cardTitle(isMobile),
                      color: insight.color,
                      margin: 0 
                    }}>
                      {insight.title}
                    </h4>
                  </div>
                  <p style={{ 
                    ...typographyPresets.bodyText(isMobile), 
                    margin: 0, 
                    lineHeight: '1.6' 
                  }}>
                    {insight.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Section */}
        <div style={{ 
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => router.push('/export')}
            style={{
              padding: '12px 24px',
              background: 'rgba(31, 41, 55, 0.6)',
              backdropFilter: 'blur(12px)',
              color: '#d1d5db',
              border: '1px solid rgba(55, 65, 81, 0.3)',
              borderRadius: '12px',
              ...getTypographyStyles('button', false),
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.background = 'rgba(55, 65, 81, 0.6)'
              e.currentTarget.style.borderColor = 'rgba(163, 230, 53, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.background = 'rgba(31, 41, 55, 0.6)'
              e.currentTarget.style.borderColor = 'rgba(55, 65, 81, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <ExportIcon size={18} color="#9ca3af" />
            <span>データをエクスポート</span>
          </button>
        </div>

        {/* Character Insights */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ 
            ...typographyPresets.sectionHeader(isMobile),
            marginBottom: '20px'
          }}>
            キャラクターからのアドバイス
          </h3>
          
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.1) 0%, rgba(31, 41, 55, 0.6) 100%)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(163, 230, 53, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative elements */}
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(163, 230, 53, 0.2) 0%, transparent 70%)',
              borderRadius: '50%'
            }}></div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'flex-start',
              gap: '16px',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ 
                width: isMobile ? '50px' : '60px', 
                height: isMobile ? '50px' : '60px', 
                backgroundColor: 'rgba(55, 65, 81, 0.6)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '2px solid rgba(163, 230, 53, 0.3)'
              }}>
                <BirdCharacter bodyColor="#a3e635" size={isMobile ? 40 : 48} />
              </div>
              
              <div style={{ 
                flex: 1,
                width: '100%',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '12px',
                  justifyContent: isMobile ? 'center' : 'flex-start'
                }}>
                  <span style={{ 
                    ...getTypographyStyles('large', isMobile), 
                    fontWeight: '600',
                    color: '#a3e635' 
                  }}>
                    ルナ
                  </span>
                  <span style={{
                    ...getTypographyStyles('small', isMobile),
                    padding: '4px 8px',
                    backgroundColor: 'rgba(163, 230, 53, 0.2)',
                    color: '#a3e635',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}>
                    パーソナルコーチ
                  </span>
                </div>
                
                <p style={{ 
                  ...getTypographyStyles(isMobile ? 'base' : 'large', isMobile), 
                  color: '#e5e7eb', 
                  margin: 0, 
                  lineHeight: '1.7',
                  textAlign: 'left',
                  padding: isMobile ? '0 8px' : '0'
                }}>
                  {selectedPeriod === 'week' ? 
                    'あなたの今週のデータを分析しました。特に木曜日のパフォーマンスが素晴らしいですね！睡眠の質と気分スコアに強い相関が見られます。週末も規則正しい生活リズムを保つことで、来週はさらに良い結果が期待できそうです。' :
                   selectedPeriod === 'month' ? 
                    '素晴らしい1ヶ月でした！第3週からの改善が特に顕著です。ストレス管理が上手くいっているようで、それが全体的な健康改善につながっています。この調子を維持しながら、来月は睡眠時間をもう少し増やすことをおすすめします。' :
                    '今年の成長は本当に素晴らしいです！継続的な改善が見られ、特にストレスレベルの減少が際立っています。あなたの努力が確実に実を結んでいます。来年に向けて、さらに高い目標を設定してみませんか？'}
                </p>
                
                {/* Action buttons */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '12px',
                  marginTop: '16px',
                  width: '100%'
                }}>
                  <button
                    onClick={() => router.push('/chat')}
                    style={{
                      padding: isMobile ? '12px 16px' : '8px 16px',
                      backgroundColor: '#a3e635',
                      color: '#111827',
                      border: 'none',
                      borderRadius: '8px',
                      ...getTypographyStyles('button', isMobile),
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: isMobile ? '100%' : 'auto'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#84cc16' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#a3e635' }}
                  >
                    詳しく相談する
                  </button>
                  <button
                    onClick={() => router.push('/insights')}
                    style={{
                      padding: isMobile ? '12px 16px' : '8px 16px',
                      backgroundColor: 'rgba(55, 65, 81, 0.6)',
                      color: '#d1d5db',
                      border: '1px solid rgba(55, 65, 81, 0.3)',
                      borderRadius: '8px',
                      ...getTypographyStyles('button', isMobile),
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      width: isMobile ? '100%' : 'auto'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.6)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.6)' }}
                  >
                    詳細分析を見る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes growUp {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          50% {
            transform: scaleY(1.05);
            opacity: 1;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      <MobileBottomNav />
    </div>
  )
}