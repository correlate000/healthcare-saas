'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ResponsiveLayout } from '@/components/responsive/ResponsiveLayout'
import { ResponsiveCard } from '@/components/responsive/ResponsiveCard'
import { ResponsiveGrid } from '@/components/responsive/ResponsiveGrid'
import { ResponsiveTable } from '@/components/responsive/ResponsiveTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useResponsive } from '@/hooks/useResponsive'
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Heart,
  Activity,
  Brain,
  Pill,
  ChevronRight,
  Filter,
  Share2
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// Sample data for charts
const healthTrendData = [
  { date: '1/1', weight: 68.5, bloodPressure: 120, heartRate: 72 },
  { date: '1/8', weight: 68.3, bloodPressure: 118, heartRate: 70 },
  { date: '1/15', weight: 68.1, bloodPressure: 122, heartRate: 74 },
  { date: '1/22', weight: 67.8, bloodPressure: 119, heartRate: 71 },
  { date: '1/29', weight: 67.5, bloodPressure: 117, heartRate: 69 },
]

const activityData = [
  { day: '月', steps: 8245, calories: 320 },
  { day: '火', steps: 6532, calories: 260 },
  { day: '水', steps: 9876, calories: 385 },
  { day: '木', steps: 7123, calories: 290 },
  { day: '金', steps: 10234, calories: 410 },
  { day: '土', steps: 5432, calories: 210 },
  { day: '日', steps: 6789, calories: 270 },
]

const symptomDistribution = [
  { name: '頭痛', value: 30, color: '#EF4444' },
  { name: '疲労', value: 25, color: '#F59E0B' },
  { name: '不眠', value: 20, color: '#3B82F6' },
  { name: 'ストレス', value: 15, color: '#8B5CF6' },
  { name: 'その他', value: 10, color: '#6B7280' },
]

const recentReports = [
  { id: '1', date: '2024/01/29', type: '週次レポート', status: 'completed' },
  { id: '2', date: '2024/01/22', type: '週次レポート', status: 'completed' },
  { id: '3', date: '2024/01/15', type: '週次レポート', status: 'completed' },
  { id: '4', date: '2024/01/01', type: '月次レポート', status: 'completed' },
]

interface ReportCardProps {
  title: string
  icon: React.ReactNode
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  onClick?: () => void
}

function ReportCard({ title, icon, value, change, trend, onClick }: ReportCardProps) {
  return (
    <ResponsiveCard
      interactive={!!onClick}
      onClick={onClick}
      className="relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-gray-600 mb-2">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        {onClick && (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </div>
    </ResponsiveCard>
  )
}

export default function ResponsiveReports() {
  const router = useRouter()
  const { user } = useAuth()
  const { isMobile, isTablet } = useResponsive()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedReport, setSelectedReport] = useState('health')

  const userData = user ? {
    name: user.name || 'ユーザー',
    email: user.email,
    avatar: user.avatar
  } : undefined

  const handleDownloadReport = (reportId: string) => {
    // Implement report download
    console.log('Downloading report:', reportId)
  }

  const handleShareReport = (reportId: string) => {
    // Implement report sharing
    console.log('Sharing report:', reportId)
  }

  return (
    <ResponsiveLayout user={userData}>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              レポート
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              健康データの詳細分析とレポート
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">週次</SelectItem>
                <SelectItem value="month">月次</SelectItem>
                <SelectItem value="quarter">四半期</SelectItem>
                <SelectItem value="year">年次</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              エクスポート
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <ResponsiveGrid
        cols={{ mobile: 1, sm: 2, lg: 4 }}
        gap="md"
        className="mb-6"
      >
        <ReportCard
          title="健康スコア"
          icon={<Heart className="h-4 w-4" />}
          value="85/100"
          change="+5 前週比"
          trend="up"
          onClick={() => alert('健康スコア詳細は準備中です')}
        />
        <ReportCard
          title="平均活動量"
          icon={<Activity className="h-4 w-4" />}
          value="7,532歩"
          change="-8% 前週比"
          trend="down"
          onClick={() => alert('活動量詳細は準備中です')}
        />
        <ReportCard
          title="症状記録"
          icon={<FileText className="h-4 w-4" />}
          value="23件"
          change="今週"
          trend="neutral"
          onClick={() => alert('症状記録詳細は準備中です')}
        />
        <ReportCard
          title="服薬遵守率"
          icon={<Pill className="h-4 w-4" />}
          value="92%"
          change="+2% 前週比"
          trend="up"
          onClick={() => alert('服薬詳細は準備中です')}
        />
      </ResponsiveGrid>

      {/* Report Type Tabs */}
      <div className="flex space-x-1 mb-6 overflow-x-auto">
        {[
          { id: 'health', label: '健康サマリー', icon: <Heart className="h-4 w-4" /> },
          { id: 'activity', label: '活動', icon: <Activity className="h-4 w-4" /> },
          { id: 'symptoms', label: '症状', icon: <Brain className="h-4 w-4" /> },
          { id: 'medications', label: '服薬', icon: <Pill className="h-4 w-4" /> },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={selectedReport === tab.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedReport(tab.id)}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-6 mb-6">
        {/* Health Trends Chart */}
        <ResponsiveCard>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            健康指標トレンド
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3B82F6" 
                  name="体重 (kg)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="bloodPressure" 
                  stroke="#EF4444" 
                  name="血圧"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="#10B981" 
                  name="心拍数"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ResponsiveCard>

        {/* Activity Chart */}
        <ResponsiveGrid cols={{ mobile: 1, lg: 2 }} gap="md">
          <ResponsiveCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              週間活動量
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="steps" fill="#3B82F6" name="歩数" />
                  <Bar dataKey="calories" fill="#10B981" name="カロリー" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ResponsiveCard>

          <ResponsiveCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              症状分布
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={symptomDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                  >
                    {symptomDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ResponsiveCard>
        </ResponsiveGrid>
      </div>

      {/* Recent Reports Table */}
      <ResponsiveCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            最近のレポート
          </h3>
          <Button variant="ghost" size="sm" onClick={() => alert('すべてのレポート表示は準備中です')}>
            すべて見る
          </Button>
        </div>
        
        <ResponsiveTable
          headers={['日付', 'タイプ', 'ステータス', 'アクション']}
          rows={recentReports.map(report => [
            report.date,
            report.type,
            <Badge key={report.id} variant="default" className="bg-green-100 text-green-800">
              完了
            </Badge>,
            <div key={`${report.id}-actions`} className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownloadReport(report.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShareReport(report.id)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          ])}
          mobileView="stack"
        />
      </ResponsiveCard>

      {/* Quick Actions */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-10">
          <Button
            size="lg"
            className="rounded-full shadow-lg"
            onClick={() => alert('レポート生成機能は準備中です')}
          >
            <FileText className="h-5 w-5 mr-2" />
            レポート作成
          </Button>
        </div>
      )}
    </ResponsiveLayout>
  )
}