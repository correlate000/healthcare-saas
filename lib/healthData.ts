// Health Data Service
// Manages all health-related data operations
import { apiClient } from './api'

export interface HealthDataEntry {
  id: string
  userId: string
  dataType: string
  value: any
  valueNumeric?: number
  unit?: string
  metadata?: any
  recordedAt: string
  createdAt: string
}

export interface Symptom {
  id: string
  name: string
  severity: number
  duration: string
  location?: string
  triggers: string[]
  description?: string
  startTime: string
  isOngoing: boolean
}

export interface VitalSign {
  type: string
  value: number | string
  unit: string
  timestamp: string
  notes?: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  timing: string[]
  startDate: string
  endDate?: string
  purpose?: string
  sideEffects?: string[]
  notes?: string
  isActive: boolean
}

export interface LifestyleData {
  id: string
  category: string
  type: string
  value: number | string
  unit?: string
  duration?: string
  intensity?: string
  timestamp: string
  notes?: string
}

export interface MentalHealthData {
  mood: number
  stress: number
  anxiety: number
  energy: number
  motivation: number
  socialConnection: number
  copingStrategies: string[]
  dailyGratitude: string
  thoughts: string
  timestamp: string
}

class HealthDataService {
  // Record symptoms
  async recordSymptoms(symptoms: Symptom[]): Promise<void> {
    try {
      const entries = symptoms.map(symptom => ({
        dataType: 'symptom',
        value: JSON.stringify(symptom),
        valueNumeric: symptom.severity,
        metadata: {
          name: symptom.name,
          location: symptom.location,
          triggers: symptom.triggers,
          duration: symptom.duration,
          isOngoing: symptom.isOngoing
        },
        recordedAt: symptom.startTime
      }))

      await apiClient.batchCreateHealthEntries(entries)
    } catch (error) {
      console.error('Failed to record symptoms:', error)
      throw error
    }
  }

  // Record vital signs
  async recordVitalSigns(vitalSigns: VitalSign[]): Promise<void> {
    try {
      const entries = vitalSigns.map(vital => {
        let valueNumeric: number | undefined
        
        if (vital.type === 'blood_pressure') {
          // Extract systolic for numeric value
          const parts = vital.value.toString().split('/')
          valueNumeric = parts[0] ? parseFloat(parts[0]) : undefined
        } else {
          valueNumeric = parseFloat(vital.value.toString())
        }

        return {
          dataType: vital.type,
          value: vital.value.toString(),
          valueNumeric: isNaN(valueNumeric!) ? undefined : valueNumeric,
          unit: vital.unit,
          metadata: {
            notes: vital.notes
          },
          recordedAt: vital.timestamp
        }
      })

      await apiClient.batchCreateHealthEntries(entries)
    } catch (error) {
      console.error('Failed to record vital signs:', error)
      throw error
    }
  }

  // Record medications
  async recordMedications(medications: Medication[]): Promise<void> {
    try {
      const entries = medications.map(medication => ({
        dataType: 'medication',
        value: JSON.stringify(medication),
        metadata: {
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          timing: medication.timing,
          isActive: medication.isActive,
          purpose: medication.purpose,
          sideEffects: medication.sideEffects
        },
        recordedAt: new Date().toISOString()
      }))

      await apiClient.batchCreateHealthEntries(entries)
    } catch (error) {
      console.error('Failed to record medications:', error)
      throw error
    }
  }

  // Record lifestyle data
  async recordLifestyle(lifestyleData: LifestyleData[]): Promise<void> {
    try {
      const entries = lifestyleData.map(data => ({
        dataType: `lifestyle_${data.type}`,
        value: data.value.toString(),
        valueNumeric: typeof data.value === 'number' ? data.value : undefined,
        unit: data.unit,
        metadata: {
          category: data.category,
          duration: data.duration,
          intensity: data.intensity,
          notes: data.notes
        },
        recordedAt: data.timestamp
      }))

      await apiClient.batchCreateHealthEntries(entries)
    } catch (error) {
      console.error('Failed to record lifestyle data:', error)
      throw error
    }
  }

  // Record mental health data
  async recordMentalHealth(mentalHealthData: MentalHealthData): Promise<void> {
    try {
      // Calculate overall wellbeing score
      const positiveFactors = (mentalHealthData.mood + mentalHealthData.energy + 
                             mentalHealthData.motivation + mentalHealthData.socialConnection) / 4
      const negativeFactors = (11 - mentalHealthData.stress + 11 - mentalHealthData.anxiety) / 2
      const wellbeingScore = Math.round((positiveFactors + negativeFactors) / 2 * 10)

      const entry = {
        dataType: 'mental_health',
        value: JSON.stringify(mentalHealthData),
        valueNumeric: wellbeingScore,
        metadata: {
          mood: mentalHealthData.mood,
          stress: mentalHealthData.stress,
          anxiety: mentalHealthData.anxiety,
          energy: mentalHealthData.energy,
          motivation: mentalHealthData.motivation,
          socialConnection: mentalHealthData.socialConnection,
          copingStrategies: mentalHealthData.copingStrategies,
          wellbeingScore
        },
        recordedAt: mentalHealthData.timestamp
      }

      await apiClient.createHealthEntry(entry)
    } catch (error) {
      console.error('Failed to record mental health data:', error)
      throw error
    }
  }

  // Get health data entries
  async getHealthDataEntries(params?: {
    type?: string
    startDate?: string
    endDate?: string
    limit?: number
  }): Promise<HealthDataEntry[]> {
    try {
      const response = await apiClient.getHealthEntries(params)
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch health data entries:', error)
      return []
    }
  }

  // Get latest entry of a specific type
  async getLatestEntry(dataType: string): Promise<HealthDataEntry | null> {
    try {
      const entries = await this.getHealthDataEntries({ type: dataType, limit: 1 })
      return entries[0] || null
    } catch (error) {
      console.error('Failed to fetch latest entry:', error)
      return null
    }
  }

  // Get health summary for a date range
  async getHealthSummary(startDate: string, endDate: string): Promise<{
    symptoms: Symptom[]
    vitalSigns: VitalSign[]
    medications: Medication[]
    lifestyle: LifestyleData[]
    mentalHealth: MentalHealthData[]
  }> {
    try {
      const entries = await this.getHealthDataEntries({ startDate, endDate })
      
      const summary = {
        symptoms: [] as Symptom[],
        vitalSigns: [] as VitalSign[],
        medications: [] as Medication[],
        lifestyle: [] as LifestyleData[],
        mentalHealth: [] as MentalHealthData[]
      }

      entries.forEach(entry => {
        if (entry.dataType === 'symptom') {
          try {
            const symptom = JSON.parse(entry.value)
            summary.symptoms.push(symptom)
          } catch (e) {}
        } else if (entry.dataType.startsWith('lifestyle_')) {
          summary.lifestyle.push({
            id: entry.id,
            category: entry.metadata?.category || '',
            type: entry.dataType.replace('lifestyle_', ''),
            value: entry.value,
            unit: entry.unit,
            duration: entry.metadata?.duration,
            intensity: entry.metadata?.intensity,
            timestamp: entry.recordedAt,
            notes: entry.metadata?.notes
          })
        } else if (entry.dataType === 'medication') {
          try {
            const medication = JSON.parse(entry.value)
            summary.medications.push(medication)
          } catch (e) {}
        } else if (entry.dataType === 'mental_health') {
          try {
            const mentalHealth = JSON.parse(entry.value)
            summary.mentalHealth.push(mentalHealth)
          } catch (e) {}
        } else {
          // Vital signs
          summary.vitalSigns.push({
            type: entry.dataType,
            value: entry.value,
            unit: entry.unit || '',
            timestamp: entry.recordedAt,
            notes: entry.metadata?.notes
          })
        }
      })

      return summary
    } catch (error) {
      console.error('Failed to get health summary:', error)
      return {
        symptoms: [],
        vitalSigns: [],
        medications: [],
        lifestyle: [],
        mentalHealth: []
      }
    }
  }

  // Calculate health trends
  async calculateHealthTrends(dataType: string, days: number = 30): Promise<{
    trend: 'improving' | 'stable' | 'declining'
    averageValue: number
    changePercent: number
  }> {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const entries = await this.getHealthDataEntries({
        type: dataType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })

      if (entries.length === 0) {
        return { trend: 'stable', averageValue: 0, changePercent: 0 }
      }

      // Calculate average and trend
      const numericEntries = entries
        .filter(e => e.valueNumeric !== undefined)
        .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())

      if (numericEntries.length === 0) {
        return { trend: 'stable', averageValue: 0, changePercent: 0 }
      }

      const averageValue = numericEntries.reduce((sum, e) => sum + (e.valueNumeric || 0), 0) / numericEntries.length

      // Compare first half vs second half
      const midPoint = Math.floor(numericEntries.length / 2)
      const firstHalf = numericEntries.slice(0, midPoint)
      const secondHalf = numericEntries.slice(midPoint)

      const firstAvg = firstHalf.reduce((sum, e) => sum + (e.valueNumeric || 0), 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((sum, e) => sum + (e.valueNumeric || 0), 0) / secondHalf.length

      const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100

      let trend: 'improving' | 'stable' | 'declining' = 'stable'
      if (Math.abs(changePercent) < 5) {
        trend = 'stable'
      } else if (dataType === 'stress' || dataType === 'anxiety') {
        // For stress and anxiety, lower is better
        trend = changePercent < 0 ? 'improving' : 'declining'
      } else {
        // For most metrics, higher is better
        trend = changePercent > 0 ? 'improving' : 'declining'
      }

      return {
        trend,
        averageValue: Math.round(averageValue * 10) / 10,
        changePercent: Math.round(changePercent * 10) / 10
      }
    } catch (error) {
      console.error('Failed to calculate health trends:', error)
      return { trend: 'stable', averageValue: 0, changePercent: 0 }
    }
  }
}

export const healthDataService = new HealthDataService()