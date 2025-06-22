'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone,
  Star,
  Heart,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FloatingNotification,
  RippleButton 
} from '@/components/ui/micro-interactions'

// サンプル専門家データ
const specialists = [
  {
    id: 1,
    name: '田中 美咲',
    title: '臨床心理士・公認心理師',
    specialty: 'ストレス管理・不安障害',
    rating: 4.9,
    reviewCount: 127,
    experience: '15年',
    image: '👩‍⚕️',
    nextAvailable: '今日 14:00',
    price: '¥8,000',
    languages: ['日本語', '英語'],
    methods: ['オンライン', '対面'],
    introduction: '企業メンタルヘルス専門。ストレス管理と不安対処法を得意としています。',
    tags: ['ストレス', '不安', '職場問題'],
    available: true
  },
  {
    id: 2,
    name: '佐藤 健太郎',
    title: '精神科医',
    specialty: 'うつ病・適応障害',
    rating: 4.8,
    reviewCount: 89,
    experience: '12年',
    image: '👨‍⚕️',
    nextAvailable: '明日 10:30',
    price: '¥12,000',
    languages: ['日本語'],
    methods: ['オンライン', '対面'],
    introduction: '企業従業員のメンタルヘルス治療に特化。薬物療法と心理療法を組み合わせたアプローチ。',
    tags: ['うつ病', '適応障害', '薬物療法'],
    available: false
  },
  {
    id: 3,
    name: 'エマ・ジョンソン',
    title: '認定心理療法士',
    specialty: 'CBT・マインドフルネス',
    rating: 4.9,
    reviewCount: 156,
    experience: '10年',
    image: '👩‍🦰',
    nextAvailable: '今日 16:00',
    price: '¥9,500',
    languages: ['英語', '日本語'],
    methods: ['オンライン'],
    introduction: '認知行動療法とマインドフルネスを専門とする国際的な心理療法士。',
    tags: ['CBT', 'マインドフルネス', '国際対応'],
    available: true
  }
]

// 予約時間帯
const timeSlots = [
  { time: '09:00', available: true, price: '¥8,000' },
  { time: '10:30', available: false, price: '¥8,000' },
  { time: '14:00', available: true, price: '¥8,000' },
  { time: '15:30', available: true, price: '¥8,000' },
  { time: '16:00', available: true, price: '¥8,000' },
  { time: '18:00', available: false, price: '¥8,000' }
]

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSpecialist, setSelectedSpecialist] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showBookingConfirm, setShowBookingConfirm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'available' | 'online'>('all')

  const filteredSpecialists = specialists.filter(specialist => {
    if (filter === 'available') return specialist.available
    if (filter === 'online') return specialist.methods.includes('オンライン')
    return true
  })

  const handleBooking = () => {
    if (selectedSpecialist && selectedTime) {
      setShowBookingConfirm(true)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <AppLayout title="専門家予約" showBackButton>
      <div className="px-4 py-6 space-y-6 max-w-md mx-auto">
        
        {/* 予約確認通知 */}
        <FloatingNotification
          isVisible={showBookingConfirm}
          title="予約確認"
          message="専門家との面談予約を確認しています..."
          type="success"
          onClose={() => setShowBookingConfirm(false)}
        />

        {/* 日付選択 */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>予約日時選択</span>
            </h3>
            
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-600">
                {formatDate(selectedDate)}
              </div>
              <div className="text-sm text-blue-700 mt-1">
                予約可能な時間帯があります
              </div>
            </div>
            
            {/* 時間帯選択 */}
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <RippleButton
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === slot.time
                      ? 'bg-blue-500 text-white'
                      : slot.available
                      ? 'bg-white border-2 border-blue-200 text-blue-600 hover:border-blue-400'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div>{slot.time}</div>
                  <div className="text-xs">{slot.available ? slot.price : '満席'}</div>
                </RippleButton>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* フィルター */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'すべて' },
            { key: 'available', label: '対応可能' },
            { key: 'online', label: 'オンライン' }
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.key as any)}
              className="flex-1"
            >
              {filterOption.label}
            </Button>
          ))}
        </div>

        {/* 専門家リスト */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <span>専門家一覧</span>
          </h3>
          
          <AnimatePresence>
            {filteredSpecialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedSpecialist === specialist.id
                      ? 'border-2 border-blue-400 bg-blue-50'
                      : 'border border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSpecialist(specialist.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="text-4xl">{specialist.image}</div>
                        {specialist.available && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="font-bold text-gray-800">{specialist.name}</h4>
                          <p className="text-sm text-gray-600">{specialist.title}</p>
                          <p className="text-sm font-medium text-blue-600">{specialist.specialty}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{specialist.rating}</span>
                            <span>({specialist.reviewCount})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-3 w-3" />
                            <span>{specialist.experience}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {specialist.introduction}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {specialist.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-800">
                              次回予約可能: {specialist.nextAvailable}
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              {specialist.price}
                            </div>
                          </div>
                          
                          <div className="flex space-x-1">
                            {specialist.methods.includes('オンライン') && (
                              <div className="p-1 bg-blue-100 rounded">
                                <Video className="h-4 w-4 text-blue-600" />
                              </div>
                            )}
                            {specialist.methods.includes('対面') && (
                              <div className="p-1 bg-green-100 rounded">
                                <MapPin className="h-4 w-4 text-green-600" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedSpecialist === specialist.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">対応言語:</span>
                            <div className="flex space-x-1">
                              {specialist.languages.map((lang) => (
                                <Badge key={lang} variant="outline" className="text-xs">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">面談方法:</span>
                            <div className="flex space-x-2">
                              {specialist.methods.map((method) => (
                                <div key={method} className="flex items-center space-x-1">
                                  {method === 'オンライン' ? (
                                    <Video className="h-3 w-3 text-blue-500" />
                                  ) : (
                                    <MapPin className="h-3 w-3 text-green-500" />
                                  )}
                                  <span className="text-xs">{method}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 予約確認・実行 */}
        {selectedSpecialist && selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-green-800 mb-4 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>予約内容確認</span>
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">専門家:</span>
                    <span className="font-medium">
                      {specialists.find(s => s.id === selectedSpecialist)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">日時:</span>
                    <span className="font-medium">
                      {formatDate(selectedDate)} {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">料金:</span>
                    <span className="font-bold text-green-600">
                      {specialists.find(s => s.id === selectedSpecialist)?.price}
                    </span>
                  </div>
                </div>
                
                <RippleButton
                  onClick={handleBooking}
                  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <span>予約を確定する</span>
                  <ArrowRight className="h-4 w-4" />
                </RippleButton>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* 緊急時連絡 */}
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-3">
              <Phone className="h-8 w-8 mx-auto" />
            </div>
            <h3 className="font-bold text-red-800 mb-2">緊急時サポート</h3>
            <p className="text-sm text-red-700 mb-4">
              緊急時や危機的状況の場合は、24時間対応のホットラインにご連絡ください
            </p>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
              緊急連絡先を確認
            </Button>
          </CardContent>
        </Card>

        {/* 過去の予約履歴 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">予約履歴</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">田中 美咲 先生</div>
                  <div className="text-sm text-gray-600">2024年6月15日 14:00</div>
                </div>
                <Badge variant="secondary">完了</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">エマ・ジョンソン 先生</div>
                  <div className="text-sm text-gray-600">2024年6月8日 16:00</div>
                </div>
                <Badge variant="secondary">完了</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}