import { Router, Request, Response } from 'express'
import { body, query, validationResult } from 'express-validator'
import { authMiddleware } from '../middleware/auth'
import { healthDataService } from '../services/healthData'
import { auditService } from '../services/audit'
import { aiAnalysisService } from '../services/aiAnalysis'

const router = Router()

// Create health data entry
router.post('/entries',
  authMiddleware,
  [
    body('dataType').notEmpty().withMessage('Data type is required'),
    body('value').notEmpty().withMessage('Value is required'),
    body('recordedAt').isISO8601().withMessage('Valid date is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { dataType, value, valueNumeric, unit, metadata, recordedAt } = req.body
      const userId = req.user!.id

      // Create health data entry
      const entry = await healthDataService.createEntry({
        userId,
        dataType,
        value,
        valueNumeric,
        unit,
        metadata,
        recordedAt
      })

      // Log audit
      await auditService.log({
        userId,
        action: 'health_data_created',
        resourceType: 'health_data',
        resourceId: entry.id,
        details: { dataType }
      })

      // Trigger AI analysis for certain data types
      if (['symptom', 'vital_signs', 'mental_health'].includes(dataType)) {
        await aiAnalysisService.analyzeHealthData(userId, entry)
      }

      res.json({
        success: true,
        data: entry
      })
    } catch (error) {
      console.error('Create health entry error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to create health data entry'
      })
    }
  }
)

// Get health data entries
router.get('/entries',
  authMiddleware,
  [
    query('type').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = req.user!.id
      const { type, startDate, endDate, limit } = req.query

      const entries = await healthDataService.getEntries({
        userId,
        dataType: type as string,
        startDate: startDate as string,
        endDate: endDate as string,
        limit: limit ? parseInt(limit as string) : 50
      })

      res.json({
        success: true,
        data: entries
      })
    } catch (error) {
      console.error('Get health entries error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve health data entries'
      })
    }
  }
)

// Update health data entry
router.put('/entries/:id',
  authMiddleware,
  [
    body('value').notEmpty().withMessage('Value is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = req.user!.id
      const entryId = req.params.id
      const { value, valueNumeric, metadata } = req.body

      // Verify ownership
      const existingEntry = await healthDataService.getEntry(entryId)
      if (!existingEntry || existingEntry.userId !== userId) {
        return res.status(404).json({
          success: false,
          error: 'Entry not found'
        })
      }

      // Update entry
      const updatedEntry = await healthDataService.updateEntry(entryId, {
        value,
        valueNumeric,
        metadata
      })

      // Log audit
      await auditService.log({
        userId,
        action: 'health_data_updated',
        resourceType: 'health_data',
        resourceId: entryId,
        details: { dataType: existingEntry.dataType }
      })

      res.json({
        success: true,
        data: updatedEntry
      })
    } catch (error) {
      console.error('Update health entry error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update health data entry'
      })
    }
  }
)

// Delete health data entry
router.delete('/entries/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id
      const entryId = req.params.id

      // Verify ownership
      const existingEntry = await healthDataService.getEntry(entryId)
      if (!existingEntry || existingEntry.userId !== userId) {
        return res.status(404).json({
          success: false,
          error: 'Entry not found'
        })
      }

      // Delete entry
      await healthDataService.deleteEntry(entryId)

      // Log audit
      await auditService.log({
        userId,
        action: 'health_data_deleted',
        resourceType: 'health_data',
        resourceId: entryId,
        details: { dataType: existingEntry.dataType }
      })

      res.json({
        success: true,
        message: 'Health data entry deleted successfully'
      })
    } catch (error) {
      console.error('Delete health entry error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to delete health data entry'
      })
    }
  }
)

// Get health summary
router.get('/summary',
  authMiddleware,
  [
    query('days').optional().isInt({ min: 1, max: 365 })
  ],
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id
      const days = req.query.days ? parseInt(req.query.days as string) : 30

      const summary = await healthDataService.getHealthSummary(userId, days)

      res.json({
        success: true,
        data: summary
      })
    } catch (error) {
      console.error('Get health summary error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve health summary'
      })
    }
  }
)

// Get health trends
router.get('/trends',
  authMiddleware,
  [
    query('metric').notEmpty().withMessage('Metric is required'),
    query('days').optional().isInt({ min: 7, max: 365 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = req.user!.id
      const metric = req.query.metric as string
      const days = req.query.days ? parseInt(req.query.days as string) : 30

      const trends = await healthDataService.getHealthTrends(userId, metric, days)

      res.json({
        success: true,
        data: trends
      })
    } catch (error) {
      console.error('Get health trends error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve health trends'
      })
    }
  }
)

// Get AI analysis for health data
router.post('/analyze',
  authMiddleware,
  [
    body('dataType').notEmpty().withMessage('Data type is required'),
    body('timeRange').optional().isInt({ min: 1, max: 90 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = req.user!.id
      const { dataType, timeRange = 30 } = req.body

      // Get recent health data
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - timeRange)

      const healthData = await healthDataService.getEntries({
        userId,
        dataType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })

      if (healthData.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No health data found for analysis'
        })
      }

      // Perform AI analysis
      const analysis = await aiAnalysisService.analyzeHealthTrends(userId, healthData)

      res.json({
        success: true,
        data: analysis
      })
    } catch (error) {
      console.error('AI analysis error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to analyze health data'
      })
    }
  }
)

// Batch create health entries (for check-in)
router.post('/batch',
  authMiddleware,
  [
    body('entries').isArray().withMessage('Entries must be an array'),
    body('entries.*.dataType').notEmpty().withMessage('Data type is required'),
    body('entries.*.value').notEmpty().withMessage('Value is required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const userId = req.user!.id
      const { entries } = req.body

      // Create all entries
      const createdEntries = await Promise.all(
        entries.map((entry: any) => 
          healthDataService.createEntry({
            userId,
            ...entry,
            recordedAt: entry.recordedAt || new Date().toISOString()
          })
        )
      )

      // Log audit
      await auditService.log({
        userId,
        action: 'health_data_batch_created',
        resourceType: 'health_data',
        resourceId: 'batch',
        details: { count: createdEntries.length }
      })

      // Trigger AI analysis
      await aiAnalysisService.analyzeCheckIn(userId, createdEntries)

      res.json({
        success: true,
        data: createdEntries
      })
    } catch (error) {
      console.error('Batch create error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to create health data entries'
      })
    }
  }
)

export default router