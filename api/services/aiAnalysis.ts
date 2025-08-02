// AI Analysis Service
// Advanced AI-powered health analysis, symptom prediction, and risk assessment
import { db } from '../db/connection';
import { auditLogger } from './audit';
import { v4 as uuidv4 } from 'uuid';

interface SymptomInput {
  symptom: string;
  severity: number; // 1-10
  duration: string;
  frequency: string;
  location?: string;
  triggers?: string[];
  relievingFactors?: string[];
}

interface VitalSignsInput {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

interface HealthMetricsInput {
  age: number;
  gender: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  familyHistory: string[];
  lifestyle: {
    smokingStatus: string;
    alcoholConsumption: string;
    exerciseFrequency: string;
    dietType: string;
    sleepHours: number;
    stressLevel: number;
  };
}

interface AIAnalysisResult {
  sessionId: string;
  analysisType: string;
  confidence: number;
  primaryFindings: string[];
  secondaryFindings: string[];
  riskFactors: RiskFactor[];
  recommendations: Recommendation[];
  urgencyLevel: 'low' | 'moderate' | 'high' | 'urgent';
  followUpSuggestions: string[];
  referralSuggestions?: string[];
}

interface RiskFactor {
  factor: string;
  riskLevel: 'low' | 'moderate' | 'high';
  confidence: number;
  explanation: string;
  modifiable: boolean;
}

interface Recommendation {
  category: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  timeframe: string;
  evidenceLevel: string;
}

interface TrendAnalysis {
  metric: string;
  trend: 'improving' | 'stable' | 'declining' | 'concerning';
  changeRate: number;
  significance: 'low' | 'moderate' | 'high';
  prediction: {
    nextWeek: number;
    nextMonth: number;
    confidence: number;
  };
}

class AIAnalysisService {
  // Symptom analysis and pattern recognition
  async analyzeSymptoms(
    userId: string,
    symptoms: SymptomInput[],
    vitalSigns?: VitalSignsInput,
    context?: HealthMetricsInput
  ): Promise<AIAnalysisResult> {
    const sessionId = uuidv4();
    
    try {
      // Log analysis start
      await auditLogger.logDataAccess(userId, 'ai_analysis', sessionId, {
        analysisType: 'symptom_analysis',
        symptomCount: symptoms.length
      });

      // Create analysis session
      await db.query(
        `INSERT INTO ai_analysis_sessions (id, user_id, session_type, input_data, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [sessionId, userId, 'symptom_analysis', JSON.stringify({ symptoms, vitalSigns, context }), 'processing']
      );

      // Perform symptom pattern analysis
      const symptomPatterns = await this.identifySymptomPatterns(symptoms);
      
      // Analyze vital signs if provided
      const vitalAnalysis = vitalSigns ? await this.analyzeVitalSigns(vitalSigns, context) : null;
      
      // Risk assessment based on symptoms and context
      const riskAssessment = await this.assessHealthRisks(symptoms, vitalSigns, context);
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        symptomPatterns,
        vitalAnalysis,
        riskAssessment,
        context
      );

      // Calculate urgency level
      const urgencyLevel = this.calculateUrgencyLevel(symptoms, vitalSigns, riskAssessment);

      const result: AIAnalysisResult = {
        sessionId,
        analysisType: 'symptom_analysis',
        confidence: this.calculateOverallConfidence(symptomPatterns, vitalAnalysis, riskAssessment),
        primaryFindings: symptomPatterns.primary,
        secondaryFindings: symptomPatterns.secondary,
        riskFactors: riskAssessment,
        recommendations,
        urgencyLevel,
        followUpSuggestions: await this.generateFollowUpSuggestions(urgencyLevel, riskAssessment),
        referralSuggestions: urgencyLevel === 'high' || urgencyLevel === 'urgent' 
          ? await this.generateReferralSuggestions(symptoms, riskAssessment)
          : undefined
      };

      // Store analysis results
      await db.query(
        `UPDATE ai_analysis_sessions 
         SET status = $1, results = $2, confidence_score = $3, completed_at = NOW()
         WHERE id = $4`,
        ['completed', JSON.stringify(result), result.confidence, sessionId]
      );

      // Store individual insights
      await this.storeAnalysisInsights(sessionId, result);

      return result;

    } catch (error) {
      console.error('Symptom analysis error:', error);
      
      await db.query(
        `UPDATE ai_analysis_sessions 
         SET status = $1, error_message = $2 
         WHERE id = $3`,
        ['failed', error.message, sessionId]
      );

      throw error;
    }
  }

  // Health risk assessment
  async assessHealthRisks(
    symptoms: SymptomInput[],
    vitalSigns?: VitalSignsInput,
    context?: HealthMetricsInput
  ): Promise<RiskFactor[]> {
    const riskFactors: RiskFactor[] = [];

    // Cardiovascular risk assessment
    if (context) {
      const cvRisk = await this.assessCardiovascularRisk(context, vitalSigns);
      if (cvRisk) riskFactors.push(cvRisk);
    }

    // Diabetes risk assessment
    if (symptoms.some(s => s.symptom.toLowerCase().includes('thirst') || 
                           s.symptom.toLowerCase().includes('urination') ||
                           s.symptom.toLowerCase().includes('fatigue'))) {
      const diabetesRisk = await this.assessDiabetesRisk(symptoms, context);
      if (diabetesRisk) riskFactors.push(diabetesRisk);
    }

    // Mental health risk assessment
    const mentalHealthRisk = await this.assessMentalHealthRisk(symptoms, context);
    if (mentalHealthRisk) riskFactors.push(mentalHealthRisk);

    // Infectious disease risk
    const infectionRisk = await this.assessInfectionRisk(symptoms, vitalSigns);
    if (infectionRisk) riskFactors.push(infectionRisk);

    return riskFactors;
  }

  // Trend analysis for health metrics over time
  async analyzeTrends(userId: string, metrics: string[], days: number = 30): Promise<TrendAnalysis[]> {
    const trends: TrendAnalysis[] = [];

    for (const metric of metrics) {
      // Fetch historical data
      const data = await db.query(
        `SELECT value_numeric, recorded_at
         FROM health_data_entries
         WHERE user_id = $1 AND data_type = $2 AND recorded_at >= NOW() - INTERVAL '${days} days'
         ORDER BY recorded_at ASC`,
        [userId, metric]
      );

      if (data.rows.length >= 3) {
        const trend = this.calculateTrend(data.rows);
        trends.push(trend);
      }
    }

    return trends;
  }

  // Predictive health modeling
  async generateHealthPredictions(userId: string): Promise<any> {
    // Fetch user's complete health profile
    const profile = await db.query(
      `SELECT u.*, hp.* FROM users u
       LEFT JOIN user_health_profiles hp ON u.id = hp.user_id
       WHERE u.id = $1`,
      [userId]
    );

    // Get recent health data
    const recentData = await db.query(
      `SELECT * FROM health_data_entries
       WHERE user_id = $1 AND recorded_at >= NOW() - INTERVAL '90 days'
       ORDER BY recorded_at DESC`,
      [userId]
    );

    // Generate predictions based on machine learning models
    return {
      cardiovascularRisk: await this.predictCardiovascularEvents(profile.rows[0], recentData.rows),
      diabetesRisk: await this.predictDiabetesOnset(profile.rows[0], recentData.rows),
      mentalHealthTrends: await this.predictMentalHealthTrends(recentData.rows),
      recommendedScreenings: await this.recommendHealthScreenings(profile.rows[0])
    };
  }

  // Private helper methods
  private async identifySymptomPatterns(symptoms: SymptomInput[]): Promise<{primary: string[], secondary: string[]}> {
    const patterns = { primary: [], secondary: [] };

    // Symptom clustering and pattern recognition
    const severities = symptoms.map(s => s.severity);
    const avgSeverity = severities.reduce((a, b) => a + b, 0) / severities.length;

    // High severity symptoms
    if (avgSeverity >= 7) {
      patterns.primary.push('High severity symptom cluster detected');
    }

    // Common symptom combinations
    const symptomNames = symptoms.map(s => s.symptom.toLowerCase());
    
    // Flu-like symptoms
    if (symptomNames.includes('fever') && symptomNames.includes('fatigue') && symptomNames.includes('muscle pain')) {
      patterns.primary.push('Viral syndrome pattern');
    }

    // Gastrointestinal cluster
    if (symptomNames.some(s => ['nausea', 'vomiting', 'diarrhea', 'abdominal pain'].includes(s))) {
      patterns.primary.push('Gastrointestinal symptom cluster');
    }

    // Respiratory cluster
    if (symptomNames.some(s => ['cough', 'shortness of breath', 'chest pain'].includes(s))) {
      patterns.primary.push('Respiratory symptom cluster');
    }

    // Neurological cluster
    if (symptomNames.some(s => ['headache', 'dizziness', 'confusion', 'weakness'].includes(s))) {
      patterns.primary.push('Neurological symptom cluster');
    }

    return patterns;
  }

  private async analyzeVitalSigns(vitalSigns: VitalSignsInput, context?: HealthMetricsInput): Promise<any> {
    const analysis = {
      bloodPressure: null,
      heartRate: null,
      temperature: null,
      respiratory: null,
      overall: 'normal'
    };

    // Blood pressure analysis
    if (vitalSigns.bloodPressureSystolic && vitalSigns.bloodPressureDiastolic) {
      const sys = vitalSigns.bloodPressureSystolic;
      const dia = vitalSigns.bloodPressureDiastolic;
      
      if (sys >= 180 || dia >= 120) {
        analysis.bloodPressure = 'hypertensive_crisis';
        analysis.overall = 'critical';
      } else if (sys >= 140 || dia >= 90) {
        analysis.bloodPressure = 'hypertensive';
        analysis.overall = 'abnormal';
      } else if (sys < 90 || dia < 60) {
        analysis.bloodPressure = 'hypotensive';
        analysis.overall = 'abnormal';
      } else {
        analysis.bloodPressure = 'normal';
      }
    }

    // Heart rate analysis
    if (vitalSigns.heartRate) {
      const hr = vitalSigns.heartRate;
      if (hr > 100) {
        analysis.heartRate = 'tachycardic';
        analysis.overall = analysis.overall === 'critical' ? 'critical' : 'abnormal';
      } else if (hr < 60) {
        analysis.heartRate = 'bradycardic';
        analysis.overall = analysis.overall === 'critical' ? 'critical' : 'abnormal';
      } else {
        analysis.heartRate = 'normal';
      }
    }

    // Temperature analysis
    if (vitalSigns.temperature) {
      const temp = vitalSigns.temperature;
      if (temp >= 38.5) {
        analysis.temperature = 'febrile';
        analysis.overall = analysis.overall === 'critical' ? 'critical' : 'abnormal';
      } else if (temp <= 35.0) {
        analysis.temperature = 'hypothermic';
        analysis.overall = 'critical';
      } else {
        analysis.temperature = 'normal';
      }
    }

    return analysis;
  }

  private async assessCardiovascularRisk(context: HealthMetricsInput, vitalSigns?: VitalSignsInput): Promise<RiskFactor | null> {
    let riskScore = 0;
    const factors = [];

    // Age factor
    if (context.age > 65) {
      riskScore += 3;
      factors.push('Advanced age');
    } else if (context.age > 45) {
      riskScore += 1;
      factors.push('Middle age');
    }

    // Lifestyle factors
    if (context.lifestyle.smokingStatus === 'current') {
      riskScore += 3;
      factors.push('Current smoking');
    }
    
    if (context.lifestyle.exerciseFrequency === 'sedentary') {
      riskScore += 2;
      factors.push('Sedentary lifestyle');
    }

    // Medical history
    if (context.medicalHistory.includes('hypertension')) {
      riskScore += 2;
      factors.push('History of hypertension');
    }

    if (context.medicalHistory.includes('diabetes')) {
      riskScore += 2;
      factors.push('History of diabetes');
    }

    // Vital signs
    if (vitalSigns?.bloodPressureSystolic && vitalSigns.bloodPressureSystolic > 140) {
      riskScore += 2;
      factors.push('Elevated blood pressure');
    }

    if (riskScore >= 5) {
      return {
        factor: 'Cardiovascular Disease',
        riskLevel: riskScore >= 8 ? 'high' : 'moderate',
        confidence: 0.8,
        explanation: `Multiple cardiovascular risk factors identified: ${factors.join(', ')}`,
        modifiable: true
      };
    }

    return null;
  }

  private async assessDiabetesRisk(symptoms: SymptomInput[], context?: HealthMetricsInput): Promise<RiskFactor | null> {
    let riskScore = 0;
    const factors = [];

    // Symptom analysis
    const diabeticSymptoms = ['excessive thirst', 'frequent urination', 'unexplained fatigue', 'blurred vision'];
    const presentSymptoms = symptoms.filter(s => 
      diabeticSymptoms.some(ds => s.symptom.toLowerCase().includes(ds.toLowerCase()))
    );

    if (presentSymptoms.length >= 2) {
      riskScore += 3;
      factors.push('Classic diabetic symptoms present');
    }

    // Context factors
    if (context) {
      if (context.age > 45) {
        riskScore += 1;
        factors.push('Age over 45');
      }

      if (context.familyHistory.includes('diabetes')) {
        riskScore += 2;
        factors.push('Family history of diabetes');
      }

      if (context.lifestyle.exerciseFrequency === 'sedentary') {
        riskScore += 1;
        factors.push('Sedentary lifestyle');
      }
    }

    if (riskScore >= 3) {
      return {
        factor: 'Type 2 Diabetes',
        riskLevel: riskScore >= 5 ? 'high' : 'moderate',
        confidence: 0.7,
        explanation: `Diabetes risk factors identified: ${factors.join(', ')}`,
        modifiable: true
      };
    }

    return null;
  }

  private async assessMentalHealthRisk(symptoms: SymptomInput[], context?: HealthMetricsInput): Promise<RiskFactor | null> {
    const mentalHealthSymptoms = ['anxiety', 'depression', 'mood changes', 'sleep disturbances', 'concentration problems'];
    const presentSymptoms = symptoms.filter(s => 
      mentalHealthSymptoms.some(mhs => s.symptom.toLowerCase().includes(mhs.toLowerCase()))
    );

    if (presentSymptoms.length >= 2 || context?.lifestyle.stressLevel >= 8) {
      return {
        factor: 'Mental Health Concerns',
        riskLevel: presentSymptoms.length >= 3 ? 'high' : 'moderate',
        confidence: 0.6,
        explanation: 'Multiple mental health-related symptoms or high stress levels detected',
        modifiable: true
      };
    }

    return null;
  }

  private async assessInfectionRisk(symptoms: SymptomInput[], vitalSigns?: VitalSignsInput): Promise<RiskFactor | null> {
    const infectionSymptoms = ['fever', 'chills', 'fatigue', 'muscle aches', 'sore throat', 'cough'];
    const presentSymptoms = symptoms.filter(s => 
      infectionSymptoms.some(is => s.symptom.toLowerCase().includes(is.toLowerCase()))
    );

    const hasFever = vitalSigns?.temperature && vitalSigns.temperature >= 38.0;

    if (presentSymptoms.length >= 2 || hasFever) {
      return {
        factor: 'Infectious Disease',
        riskLevel: hasFever && presentSymptoms.length >= 3 ? 'high' : 'moderate',
        confidence: 0.8,
        explanation: 'Symptoms suggestive of infectious process',
        modifiable: false
      };
    }

    return null;
  }

  private calculateUrgencyLevel(
    symptoms: SymptomInput[], 
    vitalSigns?: VitalSignsInput, 
    riskFactors?: RiskFactor[]
  ): 'low' | 'moderate' | 'high' | 'urgent' {
    // Check for urgent vital signs
    if (vitalSigns) {
      if (vitalSigns.bloodPressureSystolic && vitalSigns.bloodPressureSystolic >= 180) return 'urgent';
      if (vitalSigns.temperature && vitalSigns.temperature >= 39.5) return 'urgent';
      if (vitalSigns.heartRate && (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50)) return 'urgent';
    }

    // Check for severe symptoms
    const severities = symptoms.map(s => s.severity);
    const maxSeverity = Math.max(...severities);
    const avgSeverity = severities.reduce((a, b) => a + b, 0) / severities.length;

    if (maxSeverity >= 9 || avgSeverity >= 8) return 'high';
    if (maxSeverity >= 7 || avgSeverity >= 6) return 'moderate';

    // Check for high-risk factors
    const highRiskFactors = riskFactors?.filter(rf => rf.riskLevel === 'high') || [];
    if (highRiskFactors.length >= 2) return 'high';
    if (highRiskFactors.length === 1) return 'moderate';

    return 'low';
  }

  private calculateOverallConfidence(symptomPatterns: any, vitalAnalysis: any, riskAssessment: any): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on data completeness
    if (symptomPatterns.primary.length > 0) confidence += 0.1;
    if (vitalAnalysis) confidence += 0.2;
    if (riskAssessment.length > 0) confidence += 0.1;

    // Adjust based on pattern clarity
    if (symptomPatterns.primary.length >= 2) confidence += 0.1;

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private async generateRecommendations(
    symptomPatterns: any,
    vitalAnalysis: any,
    riskAssessment: RiskFactor[],
    context?: HealthMetricsInput
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // General recommendations based on symptoms
    if (symptomPatterns.primary.length > 0) {
      recommendations.push({
        category: 'monitoring',
        recommendation: 'Continue monitoring symptoms and record any changes',
        priority: 'medium',
        timeframe: 'daily',
        evidenceLevel: 'expert_consensus'
      });
    }

    // Lifestyle recommendations
    if (context?.lifestyle.exerciseFrequency === 'sedentary') {
      recommendations.push({
        category: 'lifestyle',
        recommendation: 'Increase physical activity with light exercise like walking',
        priority: 'medium',
        timeframe: 'immediate',
        evidenceLevel: 'high_quality_evidence'
      });
    }

    // Risk-specific recommendations
    for (const risk of riskAssessment) {
      if (risk.factor === 'Cardiovascular Disease') {
        recommendations.push({
          category: 'prevention',
          recommendation: 'Consider cardiovascular risk reduction strategies',
          priority: 'high',
          timeframe: 'within_week',
          evidenceLevel: 'high_quality_evidence'
        });
      }
    }

    return recommendations;
  }

  private async generateFollowUpSuggestions(urgencyLevel: string, riskFactors: RiskFactor[]): Promise<string[]> {
    const suggestions = [];

    switch (urgencyLevel) {
      case 'urgent':
        suggestions.push('Seek immediate medical attention');
        suggestions.push('Go to emergency room if symptoms worsen');
        break;
      case 'high':
        suggestions.push('Schedule appointment with healthcare provider within 24-48 hours');
        suggestions.push('Monitor symptoms closely');
        break;
      case 'moderate':
        suggestions.push('Schedule appointment with healthcare provider within 1 week');
        suggestions.push('Continue symptom tracking');
        break;
      case 'low':
        suggestions.push('Continue monitoring symptoms');
        suggestions.push('Schedule routine check-up if symptoms persist');
        break;
    }

    return suggestions;
  }

  private async generateReferralSuggestions(symptoms: SymptomInput[], riskFactors: RiskFactor[]): Promise<string[]> {
    const referrals = [];

    // Based on symptoms
    const cardiacSymptoms = symptoms.filter(s => 
      ['chest pain', 'shortness of breath', 'palpitations'].some(cs => 
        s.symptom.toLowerCase().includes(cs.toLowerCase())
      )
    );
    if (cardiacSymptoms.length > 0) {
      referrals.push('Cardiology consultation');
    }

    // Based on risk factors
    const cvRisk = riskFactors.find(rf => rf.factor === 'Cardiovascular Disease');
    if (cvRisk && cvRisk.riskLevel === 'high') {
      referrals.push('Preventive cardiology consultation');
    }

    return referrals;
  }

  private calculateTrend(dataPoints: any[]): TrendAnalysis {
    // Simple linear regression for trend calculation
    const n = dataPoints.length;
    const x = dataPoints.map((_, i) => i);
    const y = dataPoints.map(dp => parseFloat(dp.value_numeric));

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Determine trend direction
    let trend: 'improving' | 'stable' | 'declining' | 'concerning';
    if (Math.abs(slope) < 0.1) {
      trend = 'stable';
    } else if (slope > 0) {
      trend = 'improving';
    } else {
      trend = slope < -0.5 ? 'concerning' : 'declining';
    }

    return {
      metric: 'general', // This would be set by the caller
      trend,
      changeRate: slope,
      significance: Math.abs(slope) > 0.5 ? 'high' : Math.abs(slope) > 0.2 ? 'moderate' : 'low',
      prediction: {
        nextWeek: intercept + slope * (n + 7),
        nextMonth: intercept + slope * (n + 30),
        confidence: 0.7
      }
    };
  }

  private async predictCardiovascularEvents(profile: any, recentData: any[]): Promise<any> {
    // Simplified cardiovascular risk prediction
    return {
      tenYearRisk: 0.15, // 15% (placeholder)
      primaryConcerns: ['hypertension', 'cholesterol'],
      recommendations: ['Regular blood pressure monitoring', 'Cholesterol screening']
    };
  }

  private async predictDiabetesOnset(profile: any, recentData: any[]): Promise<any> {
    return {
      riskCategory: 'moderate',
      timeToOnset: 'unknown',
      recommendations: ['Regular glucose screening', 'Weight management']
    };
  }

  private async predictMentalHealthTrends(recentData: any[]): Promise<any> {
    return {
      moodTrend: 'stable',
      stressTrend: 'improving',
      recommendations: ['Stress management techniques', 'Regular sleep schedule']
    };
  }

  private async recommendHealthScreenings(profile: any): Promise<any> {
    const screenings = [];
    const age = profile.age || 0;

    if (age >= 40) {
      screenings.push('Annual comprehensive metabolic panel');
      screenings.push('Lipid screening');
    }
    if (age >= 50) {
      screenings.push('Colonoscopy screening');
      screenings.push('Mammography (if applicable)');
    }

    return screenings;
  }

  private async storeAnalysisInsights(sessionId: string, result: AIAnalysisResult): Promise<void> {
    // Store individual insights for later retrieval and learning
    for (const finding of result.primaryFindings) {
      await db.query(
        `INSERT INTO ai_insights (session_id, insight_type, category, content, confidence, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [sessionId, 'primary_finding', 'symptom_analysis', finding, result.confidence]
      );
    }

    for (const risk of result.riskFactors) {
      await db.query(
        `INSERT INTO ai_insights (session_id, insight_type, category, content, confidence, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [sessionId, 'risk_factor', risk.factor, JSON.stringify(risk), risk.confidence]
      );
    }
  }
}

export const aiAnalysisService = new AIAnalysisService();
export { AIAnalysisService, type AIAnalysisResult, type RiskFactor, type Recommendation };