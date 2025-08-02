// Health Data Routes
// Complete REST API endpoints for health data management

import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { healthDataService } from '../services/healthData';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// Helper function to handle validation errors
const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  return null;
};

// Apply authentication to all routes
router.use(authenticate());

// Health Profile Management

// GET /health-data/profile - Get user's health profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const profile = await healthDataService.getHealthProfile(req.user.id, req.user.userId);
    
    if (!profile) {
      return res.status(404).json({ error: 'Health profile not found' });
    }

    res.json({ profile });

  } catch (error) {
    console.error('Get health profile error:', error);
    res.status(500).json({ error: 'Failed to get health profile' });
  }
});

// PUT /health-data/profile - Create or update health profile
router.put('/profile', [
  body('birthDate').optional().isISO8601().withMessage('Invalid birth date format'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say']).withMessage('Invalid gender'),
  body('height').optional().isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50-300 cm'),
  body('weight').optional().isFloat({ min: 10, max: 500 }).withMessage('Weight must be between 10-500 kg'),
  body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),
  body('allergies').optional().isArray().withMessage('Allergies must be an array'),
  body('medications').optional().isArray().withMessage('Medications must be an array'),
  body('medicalConditions').optional().isArray().withMessage('Medical conditions must be an array'),
  body('emergencyContact').optional().isObject().withMessage('Emergency contact must be an object'),
  body('dataSharingConsent').optional().isBoolean().withMessage('Data sharing consent must be boolean'),
  body('researchParticipationConsent').optional().isBoolean().withMessage('Research participation consent must be boolean'),
  body('marketingConsent').optional().isBoolean().withMessage('Marketing consent must be boolean')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Convert date strings to Date objects
    const profileData = { ...req.body };
    if (profileData.birthDate) {
      profileData.birthDate = new Date(profileData.birthDate);
    }

    const result = await healthDataService.createOrUpdateHealthProfile(
      req.user.id,
      profileData,
      req.user.userId
    );

    res.json({ 
      message: 'Health profile updated successfully',
      profileId: result.profileId
    });

  } catch (error) {
    console.error('Update health profile error:', error);
    res.status(500).json({ error: 'Failed to update health profile' });
  }
});

// Health Data Entry Management

// POST /health-data/entries - Create health data entry
router.post('/entries', [
  body('entryType').isIn(['symptom', 'vital', 'mood', 'medication', 'activity']).withMessage('Invalid entry type'),
  body('category').optional().isLength({ min: 1, max: 100 }).withMessage('Category must be 1-100 characters'),
  body('data').isObject().withMessage('Data must be an object'),
  body('severityLevel').optional().isInt({ min: 1, max: 10 }).withMessage('Severity level must be 1-10'),
  body('confidenceLevel').optional().isInt({ min: 1, max: 100 }).withMessage('Confidence level must be 1-100'),
  body('dataSource').optional().isIn(['manual', 'device', 'import']).withMessage('Invalid data source'),
  body('recordedAt').isISO8601().withMessage('Invalid recorded at date'),
  body('entryDate').isISO8601().withMessage('Invalid entry date'),
  body('durationMinutes').optional().isInt({ min: 0 }).withMessage('Duration must be positive'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const entryData = {
      ...req.body,
      recordedAt: new Date(req.body.recordedAt),
      entryDate: new Date(req.body.entryDate)
    };

    const entryId = await healthDataService.createHealthDataEntry(
      req.user.id,
      entryData,
      req.user.userId
    );

    res.status(201).json({ 
      message: 'Health data entry created successfully',
      entryId 
    });

  } catch (error) {
    console.error('Create health data entry error:', error);
    res.status(500).json({ error: 'Failed to create health data entry' });
  }
});

// GET /health-data/entries - Get health data entries
router.get('/entries', [
  query('entryType').optional().isIn(['symptom', 'vital', 'mood', 'medication', 'activity']).withMessage('Invalid entry type'),
  query('category').optional().isLength({ min: 1, max: 100 }).withMessage('Invalid category'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const filters = {
      entryType: req.query.entryType as string,
      category: req.query.category as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const result = await healthDataService.getHealthDataEntries(
      req.user.id,
      filters,
      req.user.userId
    );

    res.json(result);

  } catch (error) {
    console.error('Get health data entries error:', error);
    res.status(500).json({ error: 'Failed to get health data entries' });
  }
});

// DELETE /health-data/entries/:entryId - Delete health data entry
router.delete('/entries/:entryId', [
  param('entryId').isUUID().withMessage('Invalid entry ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const success = await healthDataService.deleteHealthData(
      req.user.id,
      'health_data_entry',
      req.params.entryId,
      req.user.userId
    );

    if (!success) {
      return res.status(404).json({ error: 'Health data entry not found' });
    }

    res.json({ message: 'Health data entry deleted successfully' });

  } catch (error) {
    console.error('Delete health data entry error:', error);
    res.status(500).json({ error: 'Failed to delete health data entry' });
  }
});

// Symptom Entry Management

// POST /health-data/symptoms - Create symptom entry
router.post('/symptoms', [
  body('healthDataEntryId').isUUID().withMessage('Invalid health data entry ID'),
  body('symptomName').isLength({ min: 1, max: 255 }).withMessage('Symptom name must be 1-255 characters'),
  body('symptomCode').optional().isLength({ min: 1, max: 20 }).withMessage('Symptom code must be 1-20 characters'),
  body('bodyLocation').optional().isLength({ max: 100 }).withMessage('Body location must be less than 100 characters'),
  body('severity').isInt({ min: 1, max: 10 }).withMessage('Severity must be 1-10'),
  body('frequency').optional().isIn(['constant', 'intermittent', 'occasional']).withMessage('Invalid frequency'),
  body('durationDescription').optional().isLength({ max: 100 }).withMessage('Duration description must be less than 100 characters'),
  body('potentialTriggers').optional().isArray().withMessage('Potential triggers must be an array'),
  body('reliefMethods').optional().isArray().withMessage('Relief methods must be an array'),
  body('associatedSymptoms').optional().isArray().withMessage('Associated symptoms must be an array'),
  body('impactOnDailyLife').optional().isInt({ min: 1, max: 10 }).withMessage('Impact on daily life must be 1-10'),
  body('impactOnWork').optional().isInt({ min: 1, max: 10 }).withMessage('Impact on work must be 1-10'),
  body('impactOnSleep').optional().isInt({ min: 1, max: 10 }).withMessage('Impact on sleep must be 1-10')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { healthDataEntryId, ...symptomData } = req.body;

    const symptomId = await healthDataService.createSymptomEntry(
      req.user.id,
      healthDataEntryId,
      symptomData,
      req.user.userId
    );

    res.status(201).json({ 
      message: 'Symptom entry created successfully',
      symptomId 
    });

  } catch (error) {
    console.error('Create symptom entry error:', error);
    res.status(500).json({ error: 'Failed to create symptom entry' });
  }
});

// Vital Signs Management

// POST /health-data/vitals - Create vital signs entry
router.post('/vitals', [
  body('healthDataEntryId').isUUID().withMessage('Invalid health data entry ID'),
  body('bloodPressureSystolic').optional().isInt({ min: 50, max: 300 }).withMessage('Systolic BP must be 50-300'),
  body('bloodPressureDiastolic').optional().isInt({ min: 30, max: 200 }).withMessage('Diastolic BP must be 30-200'),
  body('heartRate').optional().isInt({ min: 30, max: 220 }).withMessage('Heart rate must be 30-220'),
  body('temperature').optional().isFloat({ min: 30, max: 45 }).withMessage('Temperature must be 30-45°C'),
  body('respiratoryRate').optional().isInt({ min: 5, max: 60 }).withMessage('Respiratory rate must be 5-60'),
  body('oxygenSaturation').optional().isInt({ min: 50, max: 100 }).withMessage('Oxygen saturation must be 50-100%'),
  body('bloodGlucose').optional().isFloat({ min: 20, max: 600 }).withMessage('Blood glucose must be 20-600 mg/dL'),
  body('weight').optional().isFloat({ min: 10, max: 500 }).withMessage('Weight must be 10-500 kg'),
  body('measurementMethod').optional().isLength({ max: 100 }).withMessage('Measurement method must be less than 100 characters'),
  body('deviceInfo').optional().isObject().withMessage('Device info must be an object'),
  body('measurementPosition').optional().isIn(['sitting', 'standing', 'lying']).withMessage('Invalid measurement position')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { healthDataEntryId, ...vitalsData } = req.body;

    const vitalsId = await healthDataService.createVitalSigns(
      req.user.id,
      healthDataEntryId,
      vitalsData,
      req.user.userId
    );

    res.status(201).json({ 
      message: 'Vital signs entry created successfully',
      vitalsId 
    });

  } catch (error) {
    console.error('Create vital signs entry error:', error);
    res.status(500).json({ error: 'Failed to create vital signs entry' });
  }
});

// Medication Entry Management

// POST /health-data/medications - Create medication entry
router.post('/medications', [
  body('healthDataEntryId').isUUID().withMessage('Invalid health data entry ID'),
  body('medicationName').isLength({ min: 1, max: 255 }).withMessage('Medication name must be 1-255 characters'),
  body('dosage').optional().isLength({ max: 100 }).withMessage('Dosage must be less than 100 characters'),
  body('frequency').optional().isLength({ max: 100 }).withMessage('Frequency must be less than 100 characters'),
  body('route').optional().isIn(['oral', 'topical', 'injection', 'inhalation', 'sublingual']).withMessage('Invalid route'),
  body('medicationType').optional().isIn(['prescription', 'otc', 'supplement']).withMessage('Invalid medication type'),
  body('ndcCode').optional().isLength({ max: 20 }).withMessage('NDC code must be less than 20 characters'),
  body('takenAsPrescribed').optional().isBoolean().withMessage('Taken as prescribed must be boolean'),
  body('missedDoses').optional().isInt({ min: 0 }).withMessage('Missed doses must be non-negative'),
  body('sideEffects').optional().isArray().withMessage('Side effects must be an array'),
  body('effectivenessRating').optional().isInt({ min: 1, max: 10 }).withMessage('Effectiveness rating must be 1-10'),
  body('startDate').optional().isISO8601().withMessage('Invalid start date'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date'),
  body('prescribedBy').optional().isLength({ max: 255 }).withMessage('Prescribed by must be less than 255 characters')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { healthDataEntryId, ...medicationData } = req.body;

    // Convert date strings to Date objects
    if (medicationData.startDate) {
      medicationData.startDate = new Date(medicationData.startDate);
    }
    if (medicationData.endDate) {
      medicationData.endDate = new Date(medicationData.endDate);
    }

    const medicationId = await healthDataService.createMedicationEntry(
      req.user.id,
      healthDataEntryId,
      medicationData,
      req.user.userId
    );

    res.status(201).json({ 
      message: 'Medication entry created successfully',
      medicationId 
    });

  } catch (error) {
    console.error('Create medication entry error:', error);
    res.status(500).json({ error: 'Failed to create medication entry' });
  }
});

// Health Goals Management

// POST /health-data/goals - Create health goal
router.post('/goals', [
  body('goalType').isLength({ min: 1, max: 50 }).withMessage('Goal type must be 1-50 characters'),
  body('title').isLength({ min: 1, max: 255 }).withMessage('Title must be 1-255 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('targetValue').optional().isFloat({ min: 0 }).withMessage('Target value must be non-negative'),
  body('targetUnit').optional().isLength({ max: 20 }).withMessage('Target unit must be less than 20 characters'),
  body('targetDate').optional().isISO8601().withMessage('Invalid target date'),
  body('currentValue').optional().isFloat({ min: 0 }).withMessage('Current value must be non-negative'),
  body('status').optional().isIn(['active', 'completed', 'paused', 'cancelled']).withMessage('Invalid status'),
  body('priority').optional().isInt({ min: 1, max: 5 }).withMessage('Priority must be 1-5'),
  body('milestones').optional().isArray().withMessage('Milestones must be an array')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const goalData = { ...req.body };
    if (goalData.targetDate) {
      goalData.targetDate = new Date(goalData.targetDate);
    }

    const goalId = await healthDataService.createHealthGoal(
      req.user.id,
      goalData,
      req.user.userId
    );

    res.status(201).json({ 
      message: 'Health goal created successfully',
      goalId 
    });

  } catch (error) {
    console.error('Create health goal error:', error);
    res.status(500).json({ error: 'Failed to create health goal' });
  }
});

// Health Statistics and Analytics

// GET /health-data/statistics - Get health statistics
router.get('/statistics', [
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const period = {
      start: req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: req.query.endDate ? new Date(req.query.endDate as string) : new Date()
    };

    const statistics = await healthDataService.getHealthStatistics(
      req.user.id,
      period,
      req.user.userId
    );

    res.json(statistics);

  } catch (error) {
    console.error('Get health statistics error:', error);
    res.status(500).json({ error: 'Failed to get health statistics' });
  }
});

// Health Data Export (GDPR compliance)

// POST /health-data/export - Request health data export
router.post('/export', [
  body('dataTypes').isArray().withMessage('Data types must be an array'),
  body('format').optional().isIn(['json', 'csv', 'pdf']).withMessage('Invalid format'),
  body('dateFrom').optional().isISO8601().withMessage('Invalid date from'),
  body('dateTo').optional().isISO8601().withMessage('Invalid date to')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // This would typically be implemented as an async job
    // For now, return a success message
    res.json({ 
      message: 'Data export request received. You will receive an email when your export is ready.',
      exportId: 'export_' + Date.now()
    });

  } catch (error) {
    console.error('Health data export error:', error);
    res.status(500).json({ error: 'Failed to request data export' });
  }
});

// Bulk Operations (for admin users)

// DELETE /health-data/bulk-delete - Bulk delete health data
router.delete('/bulk-delete', [
  requireRole('admin', 'company_admin'),
  body('dataType').isIn(['health_data_entry', 'symptom_entry', 'vital_signs', 'medication_entry', 'health_goal']).withMessage('Invalid data type'),
  body('dataIds').isArray().withMessage('Data IDs must be an array'),
  body('reason').isLength({ min: 1, max: 255 }).withMessage('Reason must be 1-255 characters')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { dataType, dataIds, reason } = req.body;
    const results = { successful: 0, failed: 0, errors: [] as any[] };

    for (const dataId of dataIds) {
      try {
        const success = await healthDataService.deleteHealthData(
          req.user.id,
          dataType,
          dataId,
          req.user.userId
        );
        if (success) {
          results.successful++;
        } else {
          results.failed++;
          results.errors.push({ dataId, error: 'Data not found' });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({ dataId, error: error.message });
      }
    }

    res.json({
      message: 'Bulk delete operation completed',
      results
    });

  } catch (error) {
    console.error('Bulk delete health data error:', error);
    res.status(500).json({ error: 'Failed to perform bulk delete operation' });
  }
});

export default router;