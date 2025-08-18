import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, startDate, endDate, dataTypes } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Use mock data if not authenticated
      const mockData = generateMockData(format, dataTypes)
      return NextResponse.json({ 
        success: true, 
        data: mockData,
        format,
        message: 'モックデータを生成しました'
      })
    }

    // Fetch real data from Supabase
    const exportData: any = {}

    if (dataTypes.includes('checkins')) {
      const { data: checkins } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .lte('created_at', endDate || new Date().toISOString())
        .order('created_at', { ascending: false })

      exportData.checkins = checkins || []
    }

    if (dataTypes.includes('conversations')) {
      const { data: conversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .lte('created_at', endDate || new Date().toISOString())
        .order('created_at', { ascending: false })

      exportData.conversations = conversations || []
    }

    if (dataTypes.includes('achievements')) {
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)

      exportData.achievements = achievements || []
    }

    if (dataTypes.includes('stats')) {
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      exportData.stats = stats || {}
    }

    // Format data based on requested format
    let formattedData
    if (format === 'csv') {
      formattedData = convertToCSV(exportData)
    } else if (format === 'pdf') {
      formattedData = preparePDFData(exportData)
    } else {
      formattedData = exportData
    }

    return NextResponse.json({
      success: true,
      data: formattedData,
      format,
      count: Object.keys(exportData).reduce((acc, key) => {
        return acc + (Array.isArray(exportData[key]) ? exportData[key].length : 1)
      }, 0)
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Export failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function generateMockData(format: string, dataTypes: string[]) {
  const mockData: any = {}

  if (dataTypes.includes('checkins')) {
    mockData.checkins = [
      {
        id: '1',
        date: new Date().toISOString(),
        mood: 'happy',
        energy_level: 4,
        stress_level: 2,
        sleep_hours: 7.5,
        activities: ['運動', '瞑想'],
        notes: '今日は調子が良かった'
      },
      {
        id: '2',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        mood: 'neutral',
        energy_level: 3,
        stress_level: 3,
        sleep_hours: 6.5,
        activities: ['散歩'],
        notes: '普通の一日'
      }
    ]
  }

  if (dataTypes.includes('conversations')) {
    mockData.conversations = [
      {
        id: '1',
        content: '今日は少し疲れました',
        role: 'user',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        content: 'お疲れ様でした。ゆっくり休んでくださいね。',
        role: 'assistant',
        created_at: new Date().toISOString()
      }
    ]
  }

  if (dataTypes.includes('achievements')) {
    mockData.achievements = [
      {
        id: '1',
        title: '初めてのチェックイン',
        description: '最初のチェックインを完了しました',
        unlocked_at: new Date().toISOString()
      }
    ]
  }

  if (dataTypes.includes('stats')) {
    mockData.stats = {
      total_xp: 1250,
      level: 5,
      streak_days: 7,
      total_sessions: 15,
      total_challenges_completed: 8
    }
  }

  return mockData
}

function convertToCSV(data: any): string {
  let csv = ''

  // Checkins CSV
  if (data.checkins && data.checkins.length > 0) {
    csv += 'チェックインデータ\n'
    csv += '日付,気分,エネルギー,ストレス,睡眠時間,活動,メモ\n'
    data.checkins.forEach((checkin: any) => {
      csv += `${checkin.created_at || checkin.date},${checkin.mood},${checkin.energy_level},${checkin.stress_level},${checkin.sleep_hours},${(checkin.activities || []).join(';')},${checkin.notes}\n`
    })
    csv += '\n'
  }

  // Stats CSV
  if (data.stats) {
    csv += '統計データ\n'
    csv += '項目,値\n'
    csv += `総XP,${data.stats.total_xp}\n`
    csv += `レベル,${data.stats.level}\n`
    csv += `連続日数,${data.stats.streak_days}\n`
    csv += `総セッション数,${data.stats.total_sessions}\n`
    csv += '\n'
  }

  return csv
}

function preparePDFData(data: any) {
  // Prepare data structure for PDF generation
  return {
    title: '健康データレポート',
    generatedAt: new Date().toISOString(),
    sections: [
      {
        title: 'チェックイン履歴',
        data: data.checkins || []
      },
      {
        title: '会話履歴',
        data: data.conversations || []
      },
      {
        title: '実績',
        data: data.achievements || []
      },
      {
        title: '統計',
        data: data.stats || {}
      }
    ]
  }
}