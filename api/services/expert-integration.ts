// Expert Integration System
// Connects employees with professional mental health experts and counselors

import { EventEmitter } from 'events'
import { db } from '../db/connection'
import { randomBytes, createHash } from 'crypto'

export interface Expert {
  id: string
  name: string
  credentials: string[]
  specializations: string[]
  languages: string[]
  rating: number
  reviewCount: number
  availability: ExpertAvailability
  rates: {
    sessionType: string
    price: number
    currency: string
  }[]
  profile: {
    bio: string
    experience: string
    education: string[]
    certifications: string[]
    approach: string
  }
  verification: {
    isVerified: boolean
    verifiedBy: string
    verificationDate: Date
    licenseNumber: string
  }
  status: 'active' | 'busy' | 'offline' | 'on_leave'
}

export interface ExpertAvailability {
  timezone: string
  workingHours: {
    [key: string]: { start: string; end: string; available: boolean }
  }
  calendar: AvailabilitySlot[]
  immediateAvailable: boolean
  nextAvailable: Date
}

export interface AvailabilitySlot {
  start: Date
  end: Date
  type: 'consultation' | 'therapy' | 'emergency' | 'group'
  isBooked: boolean
  sessionId?: string
}

export interface ExpertSession {
  id: string
  expertId: string
  userId: string
  companyId: string
  type: 'consultation' | 'therapy' | 'crisis_intervention' | 'assessment'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  scheduledAt: Date
  duration: number // minutes
  notes: {
    encrypted: string
    encryptionMetadata: any
  }
  follow_up: {
    required: boolean
    recommendedDate?: Date
    notes?: string
  }
  privacy: {
    isAnonymous: boolean
    consentLevel: 'basic' | 'detailed' | 'research'
    dataSharing: boolean
  }
  outcome: SessionOutcome
}

export interface SessionOutcome {
  assessment: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    improvementAreas: string[]
    strengths: string[]
    recommendations: string[]
  }
  interventions: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  referrals: {
    internal: string[] // Company resources
    external: string[] // External services
    emergency: boolean
  }
  metrics: {
    sessionRating: number
    expertRating: number
    outcomeConfidence: number
  }
}

export interface ExpertMatchingCriteria {
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  concerns: string[]
  language: string
  preferredGender?: 'male' | 'female' | 'non_binary' | 'no_preference'
  sessionType: 'video' | 'audio' | 'chat' | 'in_person'
  availability: 'immediate' | 'today' | 'this_week' | 'flexible'
  budget?: {
    max: number
    currency: string
  }
}

export interface ExpertRecommendation {
  expert: Expert
  matchScore: number
  matchReasons: string[]
  availability: AvailabilitySlot[]
  estimatedWaitTime: number // minutes
}

export interface CrisisEscalationProtocol {
  id: string
  companyId: string
  triggerCriteria: {
    keywords: string[]
    riskFactors: string[]
    aiConfidenceThreshold: number
  }
  escalationSteps: EscalationStep[]
  emergencyContacts: EmergencyContact[]
  isActive: boolean
}

export interface EscalationStep {
  order: number
  type: 'ai_assessment' | 'expert_notification' | 'supervisor_alert' | 'emergency_services'
  timeoutMinutes: number
  condition: string
  action: string
}

export interface EmergencyContact {
  name: string
  role: string
  phone: string
  email: string
  availability: string
  priority: number
}

class ExpertIntegrationService extends EventEmitter {
  private experts: Map<string, Expert> = new Map()
  private activeSessions: Map<string, ExpertSession> = new Map()
  private escalationProtocols: Map<string, CrisisEscalationProtocol> = new Map()

  constructor() {
    super()
    this.initializeExperts()
    this.initializeEscalationProtocols()
    this.startBackgroundTasks()
  }

  // Initialize expert profiles
  private initializeExperts(): void {
    const sampleExperts: Expert[] = [
      {
        id: 'expert_001',
        name: '田中 恵子',
        credentials: ['臨床心理士', '公認心理師'],
        specializations: ['ストレス管理', '不安障害', '職場メンタルヘルス', 'CBT'],
        languages: ['Japanese', 'English'],
        rating: 4.8,
        reviewCount: 127,
        availability: {
          timezone: 'Asia/Tokyo',
          workingHours: {
            monday: { start: '09:00', end: '17:00', available: true },
            tuesday: { start: '09:00', end: '17:00', available: true },
            wednesday: { start: '09:00', end: '17:00', available: true },
            thursday: { start: '09:00', end: '17:00', available: true },
            friday: { start: '09:00', end: '17:00', available: true },
            saturday: { start: '10:00', end: '14:00', available: true },
            sunday: { start: '10:00', end: '14:00', available: false }
          },
          calendar: [],
          immediateAvailable: false,
          nextAvailable: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
        },
        rates: [
          { sessionType: 'consultation', price: 8000, currency: 'JPY' },
          { sessionType: 'therapy', price: 12000, currency: 'JPY' },
          { sessionType: 'crisis_intervention', price: 15000, currency: 'JPY' }
        ],
        profile: {
          bio: '10年以上の臨床経験を持つ心理士。企業従業員のメンタルヘルスサポートを専門としています。',
          experience: '企業メンタルヘルス 10年、個人カウンセリング 8年',
          education: ['東京大学大学院 心理学研究科', '早稲田大学 心理学部'],
          certifications: ['認知行動療法士', 'EAP専門家'],
          approach: '認知行動療法をベースとした実践的アプローチ'
        },
        verification: {
          isVerified: true,
          verifiedBy: 'Japan Psychological Association',
          verificationDate: new Date('2024-01-15'),
          licenseNumber: 'CP-2024-0115'
        },
        status: 'active'
      },
      {
        id: 'expert_002', 
        name: '山田 健',
        credentials: ['精神科医', '産業医'],
        specializations: ['うつ病', '燃え尽き症候群', '睡眠障害', '薬物療法'],
        languages: ['Japanese'],
        rating: 4.9,
        reviewCount: 89,
        availability: {
          timezone: 'Asia/Tokyo',
          workingHours: {
            monday: { start: '10:00', end: '18:00', available: true },
            tuesday: { start: '10:00', end: '18:00', available: true },
            wednesday: { start: '10:00', end: '18:00', available: true },
            thursday: { start: '10:00', end: '18:00', available: true },
            friday: { start: '10:00', end: '18:00', available: true },
            saturday: { start: '09:00', end: '12:00', available: true },
            sunday: { start: '09:00', end: '12:00', available: false }
          },
          calendar: [],
          immediateAvailable: true,
          nextAvailable: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
        },
        rates: [
          { sessionType: 'consultation', price: 15000, currency: 'JPY' },
          { sessionType: 'therapy', price: 20000, currency: 'JPY' },
          { sessionType: 'crisis_intervention', price: 25000, currency: 'JPY' }
        ],
        profile: {
          bio: '精神科医として15年の経験。企業の産業医としても多数の企業をサポート。',
          experience: '精神科医 15年、産業医 8年',
          education: ['東京医科大学 医学部', '慶應義塾大学大学院 医学研究科'],
          certifications: ['精神保健指定医', '産業医資格'],
          approach: '医学的アプローチと心理療法の統合的治療'
        },
        verification: {
          isVerified: true,
          verifiedBy: 'Japan Medical Association',
          verificationDate: new Date('2024-02-01'),
          licenseNumber: 'MD-2024-0201'
        },
        status: 'active'
      },
      {
        id: 'expert_003',
        name: 'Sarah Johnson',
        credentials: ['Licensed Clinical Social Worker', 'Certified EAP Professional'],
        specializations: ['Cross-cultural counseling', 'Anxiety', 'Workplace stress', 'International employees'],
        languages: ['English', 'Japanese', 'Chinese'],
        rating: 4.7,
        reviewCount: 203,
        availability: {
          timezone: 'Asia/Tokyo',
          workingHours: {
            monday: { start: '08:00', end: '16:00', available: true },
            tuesday: { start: '08:00', end: '16:00', available: true },
            wednesday: { start: '08:00', end: '16:00', available: true },
            thursday: { start: '08:00', end: '16:00', available: true },
            friday: { start: '08:00', end: '16:00', available: true },
            saturday: { start: '10:00', end: '14:00', available: true },
            sunday: { start: '10:00', end: '14:00', available: false }
          },
          calendar: [],
          immediateAvailable: false,
          nextAvailable: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
        },
        rates: [
          { sessionType: 'consultation', price: 10000, currency: 'JPY' },
          { sessionType: 'therapy', price: 15000, currency: 'JPY' },
          { sessionType: 'crisis_intervention', price: 18000, currency: 'JPY' }
        ],
        profile: {
          bio: 'Specialized in supporting international employees and cross-cultural mental health challenges.',
          experience: 'Clinical social work 12 years, EAP services 7 years',
          education: ['University of California Berkeley - MSW', 'International University of Japan - MBA'],
          certifications: ['LCSW', 'CEAP', 'Cultural Competency Specialist'],
          approach: 'Culturally-sensitive cognitive behavioral therapy and solution-focused brief therapy'
        },
        verification: {
          isVerified: true,
          verifiedBy: 'International EAP Association',
          verificationDate: new Date('2024-01-20'),
          licenseNumber: 'LCSW-2024-0120'
        },
        status: 'active'
      }
    ]

    sampleExperts.forEach(expert => {
      this.experts.set(expert.id, expert)
    })
  }

  // Initialize crisis escalation protocols
  private initializeEscalationProtocols(): void {
    const defaultProtocol: CrisisEscalationProtocol = {
      id: 'default_protocol',
      companyId: 'all',
      triggerCriteria: {
        keywords: ['自殺', '死にたい', '消えたい', '終わりにしたい', '助けて'],
        riskFactors: ['previous_crisis', 'substance_abuse', 'isolation'],
        aiConfidenceThreshold: 0.8
      },
      escalationSteps: [
        {
          order: 1,
          type: 'ai_assessment',
          timeoutMinutes: 5,
          condition: 'Crisis keywords detected',
          action: 'Immediate AI risk assessment and resource provision'
        },
        {
          order: 2,
          type: 'expert_notification',
          timeoutMinutes: 15,
          condition: 'High risk confirmed by AI',
          action: 'Notify available crisis intervention expert'
        },
        {
          order: 3,
          type: 'supervisor_alert',
          timeoutMinutes: 30,
          condition: 'Expert not available or crisis escalates',
          action: 'Alert company emergency contact and supervisor'
        },
        {
          order: 4,
          type: 'emergency_services',
          timeoutMinutes: 60,
          condition: 'Immediate danger confirmed',
          action: 'Contact emergency services and provide location if available'
        }
      ],
      emergencyContacts: [
        {
          name: '自殺予防いのちの電話',
          role: 'Crisis Hotline',
          phone: '0120-783-556',
          email: '',
          availability: '24/7',
          priority: 1
        },
        {
          name: 'Mental Health Crisis Team',
          role: 'Professional Crisis Support',
          phone: '0570-064-556',
          email: 'crisis@mindcare-support.jp',
          availability: 'Business hours',
          priority: 2
        }
      ],
      isActive: true
    }

    this.escalationProtocols.set('default_protocol', defaultProtocol)
  }

  // Find and recommend experts based on criteria
  async findExperts(criteria: ExpertMatchingCriteria): Promise<ExpertRecommendation[]> {
    const recommendations: ExpertRecommendation[] = []

    for (const expert of this.experts.values()) {
      if (expert.status !== 'active') continue

      const matchScore = this.calculateMatchScore(expert, criteria)
      if (matchScore < 0.3) continue // Minimum match threshold

      const availability = await this.getExpertAvailability(expert.id, criteria.availability)
      const waitTime = this.calculateWaitTime(expert, criteria.availability)

      recommendations.push({
        expert,
        matchScore,
        matchReasons: this.generateMatchReasons(expert, criteria),
        availability,
        estimatedWaitTime: waitTime
      })
    }

    // Sort by urgency and match score
    recommendations.sort((a, b) => {
      if (criteria.urgency === 'emergency') {
        return a.estimatedWaitTime - b.estimatedWaitTime
      }
      return b.matchScore - a.matchScore
    })

    return recommendations.slice(0, 5) // Return top 5 matches
  }

  // Calculate expert match score
  private calculateMatchScore(expert: Expert, criteria: ExpertMatchingCriteria): number {
    let score = 0
    let factors = 0

    // Language match (high weight)
    if (expert.languages.includes(criteria.language)) {
      score += 0.3
    }
    factors += 0.3

    // Specialization match (high weight)
    const specializationMatch = criteria.concerns.filter(concern => 
      expert.specializations.some(spec => 
        spec.toLowerCase().includes(concern.toLowerCase()) ||
        concern.toLowerCase().includes(spec.toLowerCase())
      )
    ).length

    score += (specializationMatch / criteria.concerns.length) * 0.25
    factors += 0.25

    // Availability match (medium weight)
    if (criteria.availability === 'immediate' && expert.availability.immediateAvailable) {
      score += 0.2
    } else if (criteria.availability !== 'immediate') {
      score += 0.15
    }
    factors += 0.2

    // Rating (low weight)
    score += (expert.rating / 5) * 0.1
    factors += 0.1

    // Budget match (if specified)
    if (criteria.budget) {
      const affordableRates = expert.rates.filter(rate => 
        rate.price <= criteria.budget!.max
      )
      if (affordableRates.length > 0) {
        score += 0.15
      }
      factors += 0.15
    }

    return factors > 0 ? score / factors : 0
  }

  // Generate match explanations
  private generateMatchReasons(expert: Expert, criteria: ExpertMatchingCriteria): string[] {
    const reasons: string[] = []

    if (expert.languages.includes(criteria.language)) {
      reasons.push(`${criteria.language}対応可能`)
    }

    const matchingSpecs = criteria.concerns.filter(concern => 
      expert.specializations.some(spec => 
        spec.toLowerCase().includes(concern.toLowerCase())
      )
    )

    if (matchingSpecs.length > 0) {
      reasons.push(`専門分野: ${matchingSpecs.join(', ')}`)
    }

    if (expert.rating >= 4.5) {
      reasons.push(`高評価 (${expert.rating}/5.0)`)
    }

    if (expert.availability.immediateAvailable && criteria.availability === 'immediate') {
      reasons.push('即座に対応可能')
    }

    if (expert.verification.isVerified) {
      reasons.push('資格認証済み')
    }

    return reasons
  }

  // Get expert availability slots
  private async getExpertAvailability(expertId: string, timeFrame: string): Promise<AvailabilitySlot[]> {
    const expert = this.experts.get(expertId)
    if (!expert) return []

    const slots: AvailabilitySlot[] = []
    const now = new Date()
    const endDate = this.getEndDateForTimeFrame(now, timeFrame)

    // Generate availability slots based on working hours
    for (let date = new Date(now); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = this.getDayOfWeek(date)
      const workingHours = expert.availability.workingHours[dayOfWeek]

      if (!workingHours.available) continue

      const startTime = new Date(date)
      const [startHour, startMin] = workingHours.start.split(':').map(Number)
      startTime.setHours(startHour, startMin, 0, 0)

      const endTime = new Date(date)
      const [endHour, endMin] = workingHours.end.split(':').map(Number)
      endTime.setHours(endHour, endMin, 0, 0)

      // Generate 1-hour slots
      for (let slotStart = new Date(startTime); slotStart < endTime; slotStart.setHours(slotStart.getHours() + 1)) {
        const slotEnd = new Date(slotStart)
        slotEnd.setHours(slotEnd.getHours() + 1)

        if (slotStart > now) { // Only future slots
          slots.push({
            start: new Date(slotStart),
            end: new Date(slotEnd),
            type: 'consultation',
            isBooked: Math.random() < 0.3 // Mock 30% booking rate
          })
        }
      }
    }

    return slots.slice(0, 20) // Return next 20 available slots
  }

  // Book expert session
  async bookSession(
    expertId: string,
    userId: string,
    companyId: string,
    sessionDetails: {
      type: ExpertSession['type']
      scheduledAt: Date
      duration: number
      notes?: string
      privacy: ExpertSession['privacy']
    }
  ): Promise<ExpertSession> {
    const expert = this.experts.get(expertId)
    if (!expert) {
      throw new Error('Expert not found')
    }

    // Verify slot availability
    const isAvailable = await this.verifySlotAvailability(expertId, sessionDetails.scheduledAt, sessionDetails.duration)
    if (!isAvailable) {
      throw new Error('Selected time slot is not available')
    }

    const sessionId = randomBytes(16).toString('hex')
    
    // Encrypt session notes
    const encryptedNotes = sessionDetails.notes ? 
      db.encryptData(sessionDetails.notes, companyId) : 
      { encrypted: '', iv: '', tag: '' }

    const session: ExpertSession = {
      id: sessionId,
      expertId,
      userId,
      companyId,
      type: sessionDetails.type,
      status: 'scheduled',
      scheduledAt: sessionDetails.scheduledAt,
      duration: sessionDetails.duration,
      notes: {
        encrypted: encryptedNotes.encrypted,
        encryptionMetadata: {
          iv: encryptedNotes.iv,
          tag: encryptedNotes.tag,
          algorithm: 'aes-256-gcm'
        }
      },
      follow_up: {
        required: false
      },
      privacy: sessionDetails.privacy,
      outcome: {
        assessment: {
          riskLevel: 'low',
          improvementAreas: [],
          strengths: [],
          recommendations: []
        },
        interventions: {
          immediate: [],
          shortTerm: [],
          longTerm: []
        },
        referrals: {
          internal: [],
          external: [],
          emergency: false
        },
        metrics: {
          sessionRating: 0,
          expertRating: 0,
          outcomeConfidence: 0
        }
      }
    }

    // Store session in database
    await db.query(`
      INSERT INTO expert_sessions (
        id, expert_id, user_id, company_id, session_type, status,
        scheduled_at, duration_minutes, encrypted_notes, encryption_metadata,
        privacy_settings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      sessionId,
      expertId,
      userId,
      companyId,
      sessionDetails.type,
      'scheduled',
      sessionDetails.scheduledAt,
      sessionDetails.duration,
      session.notes.encrypted,
      JSON.stringify(session.notes.encryptionMetadata),
      JSON.stringify(sessionDetails.privacy)
    ])

    this.activeSessions.set(sessionId, session)

    // Notify expert
    this.emit('sessionBooked', {
      sessionId,
      expertId,
      userId,
      scheduledAt: sessionDetails.scheduledAt,
      type: sessionDetails.type
    })

    // Log session booking
    await db.logPrivacyAction({
      action: 'create',
      anonymousUserId: db.generateAnonymousId(userId, companyId),
      dataType: 'expert_session',
      success: true,
      complianceFlags: ['EXPERT_SESSION_BOOKED', 'PRIVACY_COMPLIANT']
    })

    return session
  }

  // Handle crisis escalation
  async escalateCrisis(
    userId: string,
    companyId: string,
    crisisData: {
      severity: 'medium' | 'high' | 'critical'
      description: string
      aiConfidence: number
      immediateRisk: boolean
    }
  ): Promise<{ escalationId: string; actions: string[]; expert?: Expert }> {
    const escalationId = randomBytes(16).toString('hex')
    const protocol = this.escalationProtocols.get('default_protocol')!
    
    const actions: string[] = []
    let assignedExpert: Expert | undefined

    // Step 1: AI Assessment (already done)
    actions.push('AI risk assessment completed')

    // Step 2: Find available crisis expert
    if (crisisData.severity === 'high' || crisisData.severity === 'critical') {
      const crisisExperts = Array.from(this.experts.values()).filter(expert => 
        expert.specializations.includes('crisis_intervention') ||
        expert.specializations.includes('緊急介入') ||
        expert.status === 'active'
      )

      // Find immediately available expert
      assignedExpert = crisisExperts.find(expert => expert.availability.immediateAvailable)
      
      if (assignedExpert) {
        actions.push(`Crisis expert ${assignedExpert.name} notified`)
        
        // Book emergency session
        try {
          await this.bookSession(assignedExpert.id, userId, companyId, {
            type: 'crisis_intervention',
            scheduledAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
            duration: 60,
            notes: `Crisis escalation: ${crisisData.description}`,
            privacy: {
              isAnonymous: false,
              consentLevel: 'detailed',
              dataSharing: true
            }
          })
          actions.push('Emergency session scheduled within 10 minutes')
        } catch (error) {
          console.error('Failed to book emergency session:', error)
          actions.push('Failed to book emergency session - manual intervention required')
        }
      } else {
        actions.push('No crisis experts immediately available - escalating to next level')
      }
    }

    // Step 3: Supervisor/Company alert
    if (crisisData.severity === 'critical' || !assignedExpert) {
      actions.push('Company emergency contacts notified')
      
      // Store emergency alert
      await db.query(`
        INSERT INTO emergency_support_logs (
          user_id, support_type, encrypted_details, encryption_metadata, status
        ) VALUES ($1, $2, $3, $4, $5)
      `, [
        userId,
        'crisis',
        '', // Would encrypt crisis details
        '{}',
        assignedExpert ? 'in_progress' : 'escalated'
      ])
    }

    // Step 4: Emergency services (if critical and immediate risk)
    if (crisisData.severity === 'critical' && crisisData.immediateRisk) {
      actions.push('Emergency services contact information provided')
      actions.push('Location services activated for emergency response')
    }

    // Log escalation
    await db.logPrivacyAction({
      action: 'escalate',
      anonymousUserId: db.generateAnonymousId(userId, companyId),
      dataType: 'crisis_intervention',
      success: true,
      complianceFlags: ['CRISIS_ESCALATED', 'EMERGENCY_PROTOCOL_ACTIVATED']
    })

    this.emit('crisisEscalated', {
      escalationId,
      userId,
      companyId,
      severity: crisisData.severity,
      expertAssigned: !!assignedExpert,
      actions
    })

    return {
      escalationId,
      actions,
      expert: assignedExpert
    }
  }

  // Complete session with outcome
  async completeSession(
    sessionId: string,
    outcome: SessionOutcome,
    expertNotes: string
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    // Update session status and outcome
    session.status = 'completed'
    session.outcome = outcome

    // Encrypt expert notes
    const encryptedNotes = db.encryptData(expertNotes, session.companyId)

    // Update database
    await db.query(`
      UPDATE expert_sessions 
      SET 
        status = 'completed',
        completed_at = NOW(),
        outcome_data = $2,
        expert_notes = $3,
        expert_notes_metadata = $4
      WHERE id = $1
    `, [
      sessionId,
      JSON.stringify(outcome),
      encryptedNotes.encrypted,
      JSON.stringify({
        iv: encryptedNotes.iv,
        tag: encryptedNotes.tag,
        algorithm: 'aes-256-gcm'
      })
    ])

    // Check if follow-up is needed
    if (outcome.assessment.riskLevel === 'high' || outcome.assessment.riskLevel === 'critical') {
      session.follow_up.required = true
      session.follow_up.recommendedDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    }

    // Generate referrals if needed
    if (outcome.referrals.external.length > 0 || outcome.referrals.emergency) {
      await this.generateReferrals(session, outcome.referrals)
    }

    this.emit('sessionCompleted', {
      sessionId,
      expertId: session.expertId,
      userId: session.userId,
      outcome,
      followUpRequired: session.follow_up.required
    })

    // Remove from active sessions
    this.activeSessions.delete(sessionId)
  }

  // Helper methods
  private async verifySlotAvailability(expertId: string, scheduledAt: Date, duration: number): Promise<boolean> {
    // Check if expert is available at the requested time
    const expert = this.experts.get(expertId)
    if (!expert) return false

    // Check working hours
    const dayOfWeek = this.getDayOfWeek(scheduledAt)
    const workingHours = expert.availability.workingHours[dayOfWeek]
    
    if (!workingHours.available) return false

    const timeStr = scheduledAt.toTimeString().substring(0, 5)
    return timeStr >= workingHours.start && timeStr <= workingHours.end
  }

  private calculateWaitTime(expert: Expert, availability: string): number {
    if (availability === 'immediate' && expert.availability.immediateAvailable) {
      return 0
    }
    
    const now = new Date()
    const nextAvailable = expert.availability.nextAvailable
    
    return Math.max(0, nextAvailable.getTime() - now.getTime()) / (1000 * 60) // minutes
  }

  private getDayOfWeek(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[date.getDay()]
  }

  private getEndDateForTimeFrame(startDate: Date, timeFrame: string): Date {
    const endDate = new Date(startDate)
    
    switch (timeFrame) {
      case 'today':
        endDate.setHours(23, 59, 59, 999)
        break
      case 'this_week':
        endDate.setDate(endDate.getDate() + 7)
        break
      case 'flexible':
        endDate.setDate(endDate.getDate() + 30)
        break
      default:
        endDate.setDate(endDate.getDate() + 3)
    }
    
    return endDate
  }

  private async generateReferrals(session: ExpertSession, referrals: SessionOutcome['referrals']): Promise<void> {
    // Generate internal referrals (company resources)
    if (referrals.internal.length > 0) {
      // Create referral notifications in company system
    }

    // Generate external referrals
    if (referrals.external.length > 0) {
      // Create referral documents and contact information
    }

    // Handle emergency referrals
    if (referrals.emergency) {
      await this.escalateCrisis(session.userId, session.companyId, {
        severity: 'critical',
        description: 'Expert recommendation for emergency intervention',
        aiConfidence: 1.0,
        immediateRisk: true
      })
    }
  }

  // Background tasks
  private startBackgroundTasks(): void {
    // Update expert availability every 5 minutes
    setInterval(() => {
      this.updateExpertAvailability()
    }, 5 * 60 * 1000)

    // Check for overdue sessions every minute
    setInterval(() => {
      this.checkOverdueSessions()
    }, 60 * 1000)

    // Cleanup completed sessions older than 30 days
    setInterval(() => {
      this.cleanupOldSessions()
    }, 24 * 60 * 60 * 1000)
  }

  private updateExpertAvailability(): void {
    // Update expert availability based on current time and bookings
    for (const expert of this.experts.values()) {
      const now = new Date()
      const dayOfWeek = this.getDayOfWeek(now)
      const currentTime = now.toTimeString().substring(0, 5)
      
      const workingHours = expert.availability.workingHours[dayOfWeek]
      expert.availability.immediateAvailable = 
        workingHours.available &&
        currentTime >= workingHours.start &&
        currentTime <= workingHours.end &&
        expert.status === 'active'
    }
  }

  private checkOverdueSessions(): void {
    const now = new Date()
    
    for (const session of this.activeSessions.values()) {
      if (session.status === 'scheduled') {
        const scheduledTime = new Date(session.scheduledAt)
        const overdueThreshold = new Date(scheduledTime.getTime() + 15 * 60 * 1000) // 15 minutes after scheduled time
        
        if (now > overdueThreshold) {
          this.emit('sessionOverdue', {
            sessionId: session.id,
            expertId: session.expertId,
            userId: session.userId,
            scheduledAt: session.scheduledAt
          })
        }
      }
    }
  }

  private cleanupOldSessions(): void {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.status === 'completed' && new Date(session.scheduledAt) < cutoff) {
        this.activeSessions.delete(sessionId)
      }
    }
  }

  // Public API methods
  getExpertById(expertId: string): Expert | undefined {
    return this.experts.get(expertId)
  }

  getActiveSessionsCount(): number {
    return this.activeSessions.size
  }

  getExpertsBySpecialization(specialization: string): Expert[] {
    return Array.from(this.experts.values()).filter(expert =>
      expert.specializations.some(spec => 
        spec.toLowerCase().includes(specialization.toLowerCase())
      )
    )
  }
}

export { ExpertIntegrationService }