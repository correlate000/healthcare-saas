'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface HealthFormData {
  bloodPressure: { systolic: number; diastolic: number }
  heartRate: number
  weight: number
  height: number
  symptoms: string[]
}

interface HealthFormProps {
  onSubmit: (data: HealthFormData) => void
}

export function HealthForm({ onSubmit }: HealthFormProps) {
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    weight: '',
    height: '',
    symptoms: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validation
      const newErrors: Record<string, string> = {}
      
      if (!formData.systolic) {
        newErrors.systolic = '収縮期血圧を入力してください'
      }
      if (!formData.diastolic) {
        newErrors.diastolic = '拡張期血圧を入力してください'
      }

      if (formData.systolic) {
        const systolic = Number(formData.systolic)
        if (systolic < 50 || systolic > 300) {
          newErrors.systolic = '収縮期血圧は50-300の範囲で入力してください'
        }
      }
      
      if (formData.diastolic) {
        const diastolic = Number(formData.diastolic)
        if (diastolic < 30 || diastolic > 200) {
          newErrors.diastolic = '拡張期血圧は30-200の範囲で入力してください'
        }
      }

      if (formData.heartRate) {
        const heartRate = Number(formData.heartRate)
        if (heartRate < 30 || heartRate > 220) {
          newErrors.heartRate = '心拍数は30-220の範囲で入力してください'
        }
      }

      if (formData.weight && Number(formData.weight) < 0) {
        newErrors.weight = '体重は正の数値で入力してください'
      }

      if (formData.height) {
        const height = Number(formData.height)
        if (height < 50 || height > 250) {
          newErrors.height = '身長は50-250cmの範囲で入力してください'
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setIsLoading(false)
        return
      }

      const healthData: HealthFormData = {
        bloodPressure: { 
          systolic: Number(formData.systolic), 
          diastolic: Number(formData.diastolic) 
        },
        heartRate: Number(formData.heartRate) || 0,
        weight: Number(formData.weight) || 0,
        height: Number(formData.height) || 0,
        symptoms: formData.symptoms ? formData.symptoms.split(',').map(s => s.trim()) : []
      }

      await onSubmit(healthData)
    } catch (error) {
      setErrors({ general: 'エラーが発生しました' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2>健康データの記録</h2>
      
      <div>
        <label htmlFor="systolic">収縮期血圧</label>
        <input
          id="systolic"
          type="number"
          value={formData.systolic}
          onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
        />
        {errors.systolic && <span className="text-red-500">{errors.systolic}</span>}
      </div>

      <div>
        <label htmlFor="diastolic">拡張期血圧</label>
        <input
          id="diastolic"
          type="number"
          value={formData.diastolic}
          onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
        />
        {errors.diastolic && <span className="text-red-500">{errors.diastolic}</span>}
      </div>

      <div>
        <label htmlFor="heartRate">心拍数</label>
        <input
          id="heartRate"
          type="number"
          value={formData.heartRate}
          onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
        />
        {errors.heartRate && <span className="text-red-500">{errors.heartRate}</span>}
      </div>

      <div>
        <label htmlFor="weight">体重</label>
        <input
          id="weight"
          type="number"
          step="0.1"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
        />
        {errors.weight && <span className="text-red-500">{errors.weight}</span>}
      </div>

      <div>
        <label htmlFor="height">身長</label>
        <input
          id="height"
          type="number"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
        />
        {errors.height && <span className="text-red-500">{errors.height}</span>}
      </div>

      <div>
        <label htmlFor="symptoms">症状</label>
        <input
          id="symptoms"
          type="text"
          value={formData.symptoms}
          onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          placeholder="カンマ区切りで入力"
        />
      </div>

      {errors.general && <div className="text-red-500">{errors.general}</div>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? '送信中' : '記録を保存'}
      </Button>
    </form>
  )
}