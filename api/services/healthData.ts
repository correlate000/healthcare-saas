// Healthcare Data Service
// Comprehensive CRUD operations for all health-related data with encryption and privacy

import { db } from '../db/connection';
import { auditLogger } from './audit';
import { v4 as uuidv4 } from 'uuid';

interface HealthDataEntry {
  entryType: 'symptom' | 'vital' | 'mood' | 'medication' | 'activity';
  category?: string;
  data: Record<string, any>;
  severityLevel?: number;
  confidenceLevel?: number;
  dataSource?: string;
  recordedAt: Date;
  entryDate: Date;
  durationMinutes?: number;
  tags?: string[];
  notes?: string;
}

interface SymptomEntry {
  symptomCode?: string;
  symptomName: string;
  bodyLocation?: string;
  severity: number;
  frequency?: string;
  durationDescription?: string;
  potentialTriggers?: string[];
  reliefMethods?: string[];
  associatedSymptoms?: any[];
  impactOnDailyLife?: number;
  impactOnWork?: number;
  impactOnSleep?: number;
}

interface VitalSigns {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  bloodGlucose?: number;
  weight?: number;
  measurementMethod?: string;
  deviceInfo?: any;
  measurementPosition?: string;
}

interface MedicationEntry {
  medicationName: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  medicationType?: string;
  ndcCode?: string;
  takenAsPrescribed?: boolean;
  missedDoses?: number;
  sideEffects?: string[];
  effectivenessRating?: number;
  startDate?: Date;
  endDate?: Date;
  prescribedBy?: string;
}

interface HealthGoal {
  goalType: string;
  title: string;
  description?: string;
  targetValue?: number;
  targetUnit?: string;
  targetDate?: Date;
  currentValue?: number;
  status?: string;
  priority?: number;
  milestones?: any[];
}

interface HealthProfile {
  birthDate?: Date;
  gender?: string;
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  medicalConditions?: string[];
  emergencyContact?: any;
  dataSharingConsent?: boolean;
  researchParticipationConsent?: boolean;
  marketingConsent?: boolean;
}

class HealthDataService {
  // Health Profile Management
  async createOrUpdateHealthProfile(userId: string, profileData: HealthProfile, actorId: string): Promise<any> {
    const transaction = await db.beginTransaction();
    
    try {
      // Get user's company ID for encryption
      const userResult = await transaction.query(
        'SELECT company_id FROM users WHERE anonymous_id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const companyId = userResult.rows[0].company_id;

      // Encrypt sensitive data
      const encryptedData: any = {};
      
      if (profileData.birthDate) {
        encryptedData.encrypted_birth_date = JSON.stringify(
          db.encryptData(profileData.birthDate.toISOString(), companyId)
        );
      }
      
      if (profileData.gender) {
        encryptedData.encrypted_gender = JSON.stringify(
          db.encryptData(profileData.gender, companyId)
        );
      }
      
      if (profileData.height) {
        encryptedData.encrypted_height = JSON.stringify(
          db.encryptData(profileData.height.toString(), companyId)
        );
      }
      
      if (profileData.weight) {
        encryptedData.encrypted_weight = JSON.stringify(
          db.encryptData(profileData.weight.toString(), companyId)
        );
      }
      
      if (profileData.bloodType) {
        encryptedData.encrypted_blood_type = JSON.stringify(
          db.encryptData(profileData.bloodType, companyId)
        );
      }
      
      if (profileData.allergies) {
        encryptedData.encrypted_allergies = JSON.stringify(
          db.encryptData(JSON.stringify(profileData.allergies), companyId)
        );
      }
      
      if (profileData.medications) {
        encryptedData.encrypted_medications = JSON.stringify(
          db.encryptData(JSON.stringify(profileData.medications), companyId)
        );
      }
      
      if (profileData.medicalConditions) {
        encryptedData.encrypted_medical_conditions = JSON.stringify(
          db.encryptData(JSON.stringify(profileData.medicalConditions), companyId)
        );
      }
      
      if (profileData.emergencyContact) {
        encryptedData.encrypted_emergency_contact = JSON.stringify(
          db.encryptData(JSON.stringify(profileData.emergencyContact), companyId)
        );
      }

      // Upsert health profile
      const profileResult = await transaction.query(`
        INSERT INTO user_health_profiles (
          user_id, encrypted_birth_date, encrypted_gender, encrypted_height,
          encrypted_weight, encrypted_blood_type, encrypted_allergies,
          encrypted_medications, encrypted_medical_conditions,
          encrypted_emergency_contact, data_sharing_consent,
          research_participation_consent, marketing_consent,
          last_updated_by, profile_completion_percentage
        ) 
        SELECT 
          u.id, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        FROM users u 
        WHERE u.anonymous_id = $1
        ON CONFLICT (user_id) 
        DO UPDATE SET
          encrypted_birth_date = COALESCE($2, user_health_profiles.encrypted_birth_date),
          encrypted_gender = COALESCE($3, user_health_profiles.encrypted_gender),
          encrypted_height = COALESCE($4, user_health_profiles.encrypted_height),
          encrypted_weight = COALESCE($5, user_health_profiles.encrypted_weight),
          encrypted_blood_type = COALESCE($6, user_health_profiles.encrypted_blood_type),
          encrypted_allergies = COALESCE($7, user_health_profiles.encrypted_allergies),
          encrypted_medications = COALESCE($8, user_health_profiles.encrypted_medications),
          encrypted_medical_conditions = COALESCE($9, user_health_profiles.encrypted_medical_conditions),
          encrypted_emergency_contact = COALESCE($10, user_health_profiles.encrypted_emergency_contact),
          data_sharing_consent = COALESCE($11, user_health_profiles.data_sharing_consent),
          research_participation_consent = COALESCE($12, user_health_profiles.research_participation_consent),
          marketing_consent = COALESCE($13, user_health_profiles.marketing_consent),
          last_updated_by = (SELECT id FROM users WHERE anonymous_id = $14),
          profile_completion_percentage = $15,
          updated_at = NOW()
        RETURNING id
      `, [
        userId,
        encryptedData.encrypted_birth_date || null,
        encryptedData.encrypted_gender || null,
        encryptedData.encrypted_height || null,
        encryptedData.encrypted_weight || null,
        encryptedData.encrypted_blood_type || null,
        encryptedData.encrypted_allergies || null,
        encryptedData.encrypted_medications || null,
        encryptedData.encrypted_medical_conditions || null,
        encryptedData.encrypted_emergency_contact || null,
        profileData.dataSharingConsent,
        profileData.researchParticipationConsent,
        profileData.marketingConsent,
        actorId,
        this.calculateProfileCompletion(profileData)
      ]);

      await transaction.commit();

      // Log audit trail
      await auditLogger.logDataAccess(
        actorId,
        'health_profile',
        profileResult.rows[0].id,
        'update',
        '127.0.0.1', // Would be passed from request
        undefined,
        { profileFields: Object.keys(profileData) }
      );

      return { success: true, profileId: profileResult.rows[0].id };

    } catch (error) {
      await transaction.rollback();
      console.error('Health profile update error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  async getHealthProfile(userId: string, actorId: string): Promise<HealthProfile | null> {
    try {
      const result = await db.query(`
        SELECT 
          hp.*, u.company_id
        FROM user_health_profiles hp
        JOIN users u ON hp.user_id = u.id
        WHERE u.anonymous_id = $1
      `, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const profile = result.rows[0];
      const companyId = profile.company_id;

      // Decrypt sensitive data
      const decryptedProfile: HealthProfile = {};

      if (profile.encrypted_birth_date) {
        const birthData = JSON.parse(profile.encrypted_birth_date);
        decryptedProfile.birthDate = new Date(
          db.decryptData(birthData.encrypted, birthData.iv, birthData.tag, companyId)
        );
      }

      if (profile.encrypted_gender) {
        const genderData = JSON.parse(profile.encrypted_gender);
        decryptedProfile.gender = db.decryptData(genderData.encrypted, genderData.iv, genderData.tag, companyId);
      }

      if (profile.encrypted_height) {
        const heightData = JSON.parse(profile.encrypted_height);
        decryptedProfile.height = parseFloat(
          db.decryptData(heightData.encrypted, heightData.iv, heightData.tag, companyId)
        );
      }

      if (profile.encrypted_weight) {
        const weightData = JSON.parse(profile.encrypted_weight);
        decryptedProfile.weight = parseFloat(
          db.decryptData(weightData.encrypted, weightData.iv, weightData.tag, companyId)
        );
      }

      if (profile.encrypted_blood_type) {
        const bloodTypeData = JSON.parse(profile.encrypted_blood_type);
        decryptedProfile.bloodType = db.decryptData(
          bloodTypeData.encrypted, bloodTypeData.iv, bloodTypeData.tag, companyId
        );
      }

      if (profile.encrypted_allergies) {
        const allergiesData = JSON.parse(profile.encrypted_allergies);
        decryptedProfile.allergies = JSON.parse(
          db.decryptData(allergiesData.encrypted, allergiesData.iv, allergiesData.tag, companyId)
        );
      }

      if (profile.encrypted_medications) {
        const medicationsData = JSON.parse(profile.encrypted_medications);
        decryptedProfile.medications = JSON.parse(
          db.decryptData(medicationsData.encrypted, medicationsData.iv, medicationsData.tag, companyId)
        );
      }

      if (profile.encrypted_medical_conditions) {
        const conditionsData = JSON.parse(profile.encrypted_medical_conditions);
        decryptedProfile.medicalConditions = JSON.parse(
          db.decryptData(conditionsData.encrypted, conditionsData.iv, conditionsData.tag, companyId)
        );
      }

      if (profile.encrypted_emergency_contact) {
        const contactData = JSON.parse(profile.encrypted_emergency_contact);
        decryptedProfile.emergencyContact = JSON.parse(
          db.decryptData(contactData.encrypted, contactData.iv, contactData.tag, companyId)
        );
      }

      decryptedProfile.dataSharingConsent = profile.data_sharing_consent;
      decryptedProfile.researchParticipationConsent = profile.research_participation_consent;
      decryptedProfile.marketingConsent = profile.marketing_consent;

      // Log data access
      await auditLogger.logDataAccess(
        actorId,
        'health_profile',
        profile.id,
        'read',
        '127.0.0.1'
      );

      return decryptedProfile;

    } catch (error) {
      console.error('Get health profile error:', error);
      throw error;
    }
  }

  // Health Data Entry Management
  async createHealthDataEntry(userId: string, entryData: HealthDataEntry, actorId: string): Promise<string> {
    const transaction = await db.beginTransaction();
    
    try {
      // Get user's internal ID and company ID
      const userResult = await transaction.query(
        'SELECT id, company_id FROM users WHERE anonymous_id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const { id: internalUserId, company_id: companyId } = userResult.rows[0];
      const entryId = uuidv4();

      // Encrypt the data
      const encryptedData = db.encryptData(JSON.stringify(entryData.data), companyId);
      const encryptedNotes = entryData.notes ? 
        db.encryptData(entryData.notes, companyId) : null;

      // Insert health data entry
      await transaction.query(`
        INSERT INTO health_data_entries (
          id, user_id, entry_type, category, encrypted_data,
          encryption_metadata, severity_level, confidence_level,
          data_source, recorded_at, entry_date, duration_minutes,
          tags, encrypted_notes, data_quality_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        entryId, internalUserId, entryData.entryType, entryData.category,
        JSON.stringify(encryptedData), JSON.stringify({ companyId }),
        entryData.severityLevel, entryData.confidenceLevel,
        entryData.dataSource || 'manual', entryData.recordedAt,
        entryData.entryDate, entryData.durationMinutes,
        entryData.tags || [], encryptedNotes ? JSON.stringify(encryptedNotes) : null,
        85 // Default quality score
      ]);

      await transaction.commit();

      // Log data creation
      await auditLogger.logDataAccess(
        actorId,
        'health_data_entry',
        entryId,
        'create',
        '127.0.0.1',
        undefined,
        { entryType: entryData.entryType, category: entryData.category }
      );

      return entryId;

    } catch (error) {
      await transaction.rollback();
      console.error('Create health data entry error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  // Symptom Entry Management
  async createSymptomEntry(userId: string, healthDataEntryId: string, symptomData: SymptomEntry, actorId: string): Promise<string> {
    const transaction = await db.beginTransaction();
    
    try {
      const userResult = await transaction.query(
        'SELECT id FROM users WHERE anonymous_id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const internalUserId = userResult.rows[0].id;
      const symptomId = uuidv4();

      await transaction.query(`
        INSERT INTO symptom_entries (
          id, health_data_entry_id, user_id, symptom_code, symptom_name,
          body_location, severity, frequency, duration_description,
          potential_triggers, relief_methods, associated_symptoms,
          impact_on_daily_life, impact_on_work, impact_on_sleep, recorded_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      `, [
        symptomId, healthDataEntryId, internalUserId,
        symptomData.symptomCode, symptomData.symptomName,
        symptomData.bodyLocation, symptomData.severity,
        symptomData.frequency, symptomData.durationDescription,
        symptomData.potentialTriggers || [], symptomData.reliefMethods || [],
        JSON.stringify(symptomData.associatedSymptoms || []),
        symptomData.impactOnDailyLife, symptomData.impactOnWork,
        symptomData.impactOnSleep
      ]);

      await transaction.commit();

      await auditLogger.logDataAccess(
        actorId,
        'symptom_entry',
        symptomId,
        'create',
        '127.0.0.1',
        undefined,
        { symptomName: symptomData.symptomName, severity: symptomData.severity }
      );

      return symptomId;

    } catch (error) {
      await transaction.rollback();
      console.error('Create symptom entry error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  // Vital Signs Management
  async createVitalSigns(userId: string, healthDataEntryId: string, vitalsData: VitalSigns, actorId: string): Promise<string> {
    const transaction = await db.beginTransaction();
    
    try {
      const userResult = await transaction.query(
        'SELECT id, company_id FROM users WHERE anonymous_id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const { id: internalUserId, company_id: companyId } = userResult.rows[0];
      const vitalsId = uuidv4();

      // Encrypt vital signs data
      const encryptedVitals: any = {};
      
      if (vitalsData.bloodPressureSystolic) {
        encryptedVitals.encrypted_blood_pressure_systolic = JSON.stringify(
          db.encryptData(vitalsData.bloodPressureSystolic.toString(), companyId)
        );
      }
      
      if (vitalsData.bloodPressureDiastolic) {
        encryptedVitals.encrypted_blood_pressure_diastolic = JSON.stringify(
          db.encryptData(vitalsData.bloodPressureDiastolic.toString(), companyId)
        );
      }
      
      if (vitalsData.heartRate) {
        encryptedVitals.encrypted_heart_rate = JSON.stringify(
          db.encryptData(vitalsData.heartRate.toString(), companyId)
        );
      }
      
      if (vitalsData.temperature) {
        encryptedVitals.encrypted_temperature = JSON.stringify(
          db.encryptData(vitalsData.temperature.toString(), companyId)
        );
      }
      
      if (vitalsData.respiratoryRate) {
        encryptedVitals.encrypted_respiratory_rate = JSON.stringify(
          db.encryptData(vitalsData.respiratoryRate.toString(), companyId)
        );
      }
      
      if (vitalsData.oxygenSaturation) {
        encryptedVitals.encrypted_oxygen_saturation = JSON.stringify(
          db.encryptData(vitalsData.oxygenSaturation.toString(), companyId)
        );
      }
      
      if (vitalsData.bloodGlucose) {
        encryptedVitals.encrypted_blood_glucose = JSON.stringify(
          db.encryptData(vitalsData.bloodGlucose.toString(), companyId)
        );
      }
      
      if (vitalsData.weight) {
        encryptedVitals.encrypted_weight = JSON.stringify(
          db.encryptData(vitalsData.weight.toString(), companyId)
        );
      }

      await transaction.query(`
        INSERT INTO vital_signs (
          id, health_data_entry_id, user_id,
          encrypted_blood_pressure_systolic, encrypted_blood_pressure_diastolic,
          encrypted_heart_rate, encrypted_temperature, encrypted_respiratory_rate,
          encrypted_oxygen_saturation, encrypted_blood_glucose, encrypted_weight,
          measurement_method, device_info, measurement_position, recorded_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      `, [
        vitalsId, healthDataEntryId, internalUserId,
        encryptedVitals.encrypted_blood_pressure_systolic || null,
        encryptedVitals.encrypted_blood_pressure_diastolic || null,
        encryptedVitals.encrypted_heart_rate || null,
        encryptedVitals.encrypted_temperature || null,
        encryptedVitals.encrypted_respiratory_rate || null,
        encryptedVitals.encrypted_oxygen_saturation || null,
        encryptedVitals.encrypted_blood_glucose || null,
        encryptedVitals.encrypted_weight || null,
        vitalsData.measurementMethod,
        vitalsData.deviceInfo ? JSON.stringify(vitalsData.deviceInfo) : null,
        vitalsData.measurementPosition
      ]);

      await transaction.commit();

      await auditLogger.logDataAccess(
        actorId,
        'vital_signs',
        vitalsId,
        'create',
        '127.0.0.1',
        undefined,
        { measurementMethod: vitalsData.measurementMethod }
      );

      return vitalsId;

    } catch (error) {
      await transaction.rollback();
      console.error('Create vital signs error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  // Medication Entry Management
  async createMedicationEntry(userId: string, healthDataEntryId: string, medicationData: MedicationEntry, actorId: string): Promise<string> {
    const transaction = await db.beginTransaction();
    
    try {
      const userResult = await transaction.query(
        'SELECT id, company_id FROM users WHERE anonymous_id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const { id: internalUserId, company_id: companyId } = userResult.rows[0];
      const medicationId = uuidv4();

      // Encrypt medication data
      const encryptedMedication = db.encryptData(medicationData.medicationName, companyId);
      const encryptedDosage = medicationData.dosage ? 
        db.encryptData(medicationData.dosage, companyId) : null;
      const encryptedFrequency = medicationData.frequency ? 
        db.encryptData(medicationData.frequency, companyId) : null;
      const encryptedRoute = medicationData.route ? 
        db.encryptData(medicationData.route, companyId) : null;

      await transaction.query(`
        INSERT INTO medication_entries (
          id, health_data_entry_id, user_id, encrypted_medication_name,
          encrypted_dosage, encrypted_frequency, encrypted_route,
          medication_type, ndc_code, taken_as_prescribed, missed_doses,
          side_effects, effectiveness_rating, start_date, end_date,
          prescribed_by, recorded_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
      `, [
        medicationId, healthDataEntryId, internalUserId,
        JSON.stringify(encryptedMedication),
        encryptedDosage ? JSON.stringify(encryptedDosage) : null,
        encryptedFrequency ? JSON.stringify(encryptedFrequency) : null,
        encryptedRoute ? JSON.stringify(encryptedRoute) : null,
        medicationData.medicationType, medicationData.ndcCode,
        medicationData.takenAsPrescribed, medicationData.missedDoses,
        medicationData.sideEffects || [], medicationData.effectivenessRating,
        medicationData.startDate, medicationData.endDate,
        medicationData.prescribedBy
      ]);

      await transaction.commit();

      await auditLogger.logDataAccess(
        actorId,
        'medication_entry',
        medicationId,
        'create',
        '127.0.0.1',
        undefined,
        { medicationType: medicationData.medicationType }
      );

      return medicationId;

    } catch (error) {
      await transaction.rollback();
      console.error('Create medication entry error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  // Health Goals Management
  async createHealthGoal(userId: string, goalData: HealthGoal, actorId: string): Promise<string> {
    const transaction = await db.beginTransaction();
    
    try {
      const userResult = await transaction.query(
        'SELECT id FROM users WHERE anonymous_id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const internalUserId = userResult.rows[0].id;
      const goalId = uuidv4();

      await transaction.query(`
        INSERT INTO health_goals (
          id, user_id, goal_type, title, description,
          target_value, target_unit, target_date, current_value,
          status, priority, milestones
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        goalId, internalUserId, goalData.goalType, goalData.title,
        goalData.description, goalData.targetValue, goalData.targetUnit,
        goalData.targetDate, goalData.currentValue,
        goalData.status || 'active', goalData.priority || 3,
        JSON.stringify(goalData.milestones || [])
      ]);

      await transaction.commit();

      await auditLogger.logDataAccess(
        actorId,
        'health_goal',
        goalId,
        'create',
        '127.0.0.1',
        undefined,
        { goalType: goalData.goalType, title: goalData.title }
      );

      return goalId;

    } catch (error) {
      await transaction.rollback();
      console.error('Create health goal error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  // Data Retrieval Methods
  async getHealthDataEntries(userId: string, filters: {
    entryType?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }, actorId: string): Promise<{ entries: any[]; total: number }> {
    try {
      let query = `
        SELECT 
          hde.id, hde.entry_type, hde.category, hde.encrypted_data,
          hde.encryption_metadata, hde.severity_level, hde.confidence_level,
          hde.data_source, hde.recorded_at, hde.entry_date,
          hde.duration_minutes, hde.tags, hde.encrypted_notes,
          hde.data_quality_score, hde.created_at,
          u.company_id
        FROM health_data_entries hde
        JOIN users u ON hde.user_id = u.id
        WHERE u.anonymous_id = $1
      `;

      let countQuery = `
        SELECT COUNT(*) as total
        FROM health_data_entries hde
        JOIN users u ON hde.user_id = u.id
        WHERE u.anonymous_id = $1
      `;

      const params: any[] = [userId];
      let paramIndex = 2;

      if (filters.entryType) {
        query += ` AND hde.entry_type = $${paramIndex}`;
        countQuery += ` AND hde.entry_type = $${paramIndex}`;
        params.push(filters.entryType);
        paramIndex++;
      }

      if (filters.category) {
        query += ` AND hde.category = $${paramIndex}`;
        countQuery += ` AND hde.category = $${paramIndex}`;
        params.push(filters.category);
        paramIndex++;
      }

      if (filters.startDate) {
        query += ` AND hde.entry_date >= $${paramIndex}`;
        countQuery += ` AND hde.entry_date >= $${paramIndex}`;
        params.push(filters.startDate);
        paramIndex++;
      }

      if (filters.endDate) {
        query += ` AND hde.entry_date <= $${paramIndex}`;
        countQuery += ` AND hde.entry_date <= $${paramIndex}`;
        params.push(filters.endDate);
        paramIndex++;
      }

      query += ' ORDER BY hde.entry_date DESC, hde.created_at DESC';

      if (filters.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
        paramIndex++;
      }

      if (filters.offset) {
        query += ` OFFSET $${paramIndex}`;
        params.push(filters.offset);
        paramIndex++;
      }

      const [entriesResult, countResult] = await Promise.all([
        db.query(query, params.slice(0, paramIndex - (filters.offset ? 2 : 1))),
        db.query(countQuery, params.slice(0, paramIndex - (filters.limit ? (filters.offset ? 2 : 1) : 0)))
      ]);

      // Decrypt the data
      const decryptedEntries = entriesResult.rows.map(entry => {
        const encryptedData = JSON.parse(entry.encrypted_data);
        const decryptedData = db.decryptData(
          encryptedData.encrypted,
          encryptedData.iv,
          encryptedData.tag,
          entry.company_id
        );

        let decryptedNotes = null;
        if (entry.encrypted_notes) {
          const notesData = JSON.parse(entry.encrypted_notes);
          decryptedNotes = db.decryptData(
            notesData.encrypted,
            notesData.iv,
            notesData.tag,
            entry.company_id
          );
        }

        return {
          id: entry.id,
          entryType: entry.entry_type,
          category: entry.category,
          data: JSON.parse(decryptedData),
          severityLevel: entry.severity_level,
          confidenceLevel: entry.confidence_level,
          dataSource: entry.data_source,
          recordedAt: entry.recorded_at,
          entryDate: entry.entry_date,
          durationMinutes: entry.duration_minutes,
          tags: entry.tags,
          notes: decryptedNotes,
          dataQualityScore: entry.data_quality_score,
          createdAt: entry.created_at
        };
      });

      // Log data access
      await auditLogger.logDataAccess(
        actorId,
        'health_data_entries',
        'bulk',
        'read',
        '127.0.0.1',
        undefined,
        { count: decryptedEntries.length, filters }
      );

      return {
        entries: decryptedEntries,
        total: parseInt(countResult.rows[0].total)
      };

    } catch (error) {
      console.error('Get health data entries error:', error);
      throw error;
    }
  }

  // Health Statistics and Analytics
  async getHealthStatistics(userId: string, period: { start: Date; end: Date }, actorId: string): Promise<any> {
    try {
      const stats = await db.query(`
        SELECT 
          entry_type,
          category,
          COUNT(*) as entry_count,
          AVG(severity_level) as avg_severity,
          MAX(severity_level) as max_severity,
          MIN(severity_level) as min_severity
        FROM health_data_entries hde
        JOIN users u ON hde.user_id = u.id
        WHERE u.anonymous_id = $1
          AND hde.entry_date >= $2
          AND hde.entry_date <= $3
        GROUP BY entry_type, category
        ORDER BY entry_count DESC
      `, [userId, period.start, period.end]);

      const healthScore = await db.query(
        'SELECT calculate_health_score($1, $2) as score',
        [
          await this.getUserInternalId(userId),
          Math.ceil((period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24))
        ]
      );

      await auditLogger.logDataAccess(
        actorId,
        'health_statistics',
        'aggregate',
        'read',
        '127.0.0.1',
        undefined,
        { period }
      );

      return {
        healthScore: healthScore.rows[0]?.score || 0,
        statistics: stats.rows,
        period
      };

    } catch (error) {
      console.error('Get health statistics error:', error);
      throw error;
    }
  }

  // Helper methods
  private calculateProfileCompletion(profile: HealthProfile): number {
    const fields = [
      'birthDate', 'gender', 'height', 'weight', 'bloodType',
      'allergies', 'medications', 'medicalConditions', 'emergencyContact'
    ];
    
    const completedFields = fields.filter(field => profile[field as keyof HealthProfile] != null);
    return Math.round((completedFields.length / fields.length) * 100);
  }

  private async getUserInternalId(anonymousId: string): Promise<string> {
    const result = await db.query(
      'SELECT id FROM users WHERE anonymous_id = $1',
      [anonymousId]
    );
    return result.rows[0]?.id;
  }

  // Delete health data (for GDPR compliance)
  async deleteHealthData(userId: string, dataType: string, dataId: string, actorId: string): Promise<boolean> {
    const transaction = await db.beginTransaction();
    
    try {
      let deleteQuery = '';
      let params = [];

      switch (dataType) {
        case 'health_data_entry':
          deleteQuery = `
            DELETE FROM health_data_entries 
            WHERE id = $1 AND user_id = (SELECT id FROM users WHERE anonymous_id = $2)
          `;
          params = [dataId, userId];
          break;
        case 'symptom_entry':
          deleteQuery = `
            DELETE FROM symptom_entries 
            WHERE id = $1 AND user_id = (SELECT id FROM users WHERE anonymous_id = $2)
          `;
          params = [dataId, userId];
          break;
        case 'vital_signs':
          deleteQuery = `
            DELETE FROM vital_signs 
            WHERE id = $1 AND user_id = (SELECT id FROM users WHERE anonymous_id = $2)
          `;
          params = [dataId, userId];
          break;
        case 'medication_entry':
          deleteQuery = `
            DELETE FROM medication_entries 
            WHERE id = $1 AND user_id = (SELECT id FROM users WHERE anonymous_id = $2)
          `;
          params = [dataId, userId];
          break;
        case 'health_goal':
          deleteQuery = `
            DELETE FROM health_goals 
            WHERE id = $1 AND user_id = (SELECT id FROM users WHERE anonymous_id = $2)
          `;
          params = [dataId, userId];
          break;
        default:
          throw new Error(`Unsupported data type: ${dataType}`);
      }

      const result = await transaction.query(deleteQuery, params);
      
      if (result.rowCount === 0) {
        await transaction.rollback();
        return false;
      }

      await transaction.commit();

      // Log data deletion
      await auditLogger.logDataAccess(
        actorId,
        dataType,
        dataId,
        'delete',
        '127.0.0.1',
        undefined,
        { deletionReason: 'user_request' }
      );

      return true;

    } catch (error) {
      await transaction.rollback();
      console.error('Delete health data error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }
}

export const healthDataService = new HealthDataService();
export { HealthDataService, type HealthDataEntry, type SymptomEntry, type VitalSigns, type MedicationEntry, type HealthGoal, type HealthProfile };