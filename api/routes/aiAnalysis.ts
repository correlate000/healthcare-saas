// AI Analysis Routes
// REST API endpoints for AI-powered health analysis and predictions
import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { aiAnalysisService } from '../services/aiAnalysis';
import { authenticate, requireRole } from '../middleware/auth';
import { auditLogger } from '../services/audit';

const router = express.Router();

// Analyze symptoms with AI
router.post('/analyze/symptoms',
  authenticate,
  [
    body('symptoms').isArray({ min: 1 }).withMessage('At least one symptom is required'),
    body('symptoms.*.symptom').notEmpty().withMessage('Symptom description is required'),
    body('symptoms.*.severity').isInt({ min: 1, max: 10 }).withMessage('Severity must be between 1-10'),
    body('symptoms.*.duration').optional().isString(),
    body('symptoms.*.frequency').optional().isString(),
    body('symptoms.*.location').optional().isString(),
    body('symptoms.*.triggers').optional().isArray(),
    body('symptoms.*.relievingFactors').optional().isArray(),
    
    body('vitalSigns').optional().isObject(),
    body('vitalSigns.bloodPressureSystolic').optional().isFloat({ min: 60, max: 300 }),
    body('vitalSigns.bloodPressureDiastolic').optional().isFloat({ min: 30, max: 200 }),
    body('vitalSigns.heartRate').optional().isInt({ min: 30, max: 200 }),
    body('vitalSigns.temperature').optional().isFloat({ min: 30, max: 45 }),
    body('vitalSigns.respiratoryRate').optional().isInt({ min: 5, max: 50 }),
    body('vitalSigns.oxygenSaturation').optional().isFloat({ min: 50, max: 100 }),
    body('vitalSigns.weight').optional().isFloat({ min: 1, max: 500 }),
    body('vitalSigns.height').optional().isFloat({ min: 50, max: 250 }),
    
    body('context').optional().isObject(),
    body('context.age').optional().isInt({ min: 0, max: 150 }),
    body('context.gender').optional().isIn(['male', 'female', 'other']),
    body('context.medicalHistory').optional().isArray(),
    body('context.currentMedications').optional().isArray(),
    body('context.allergies').optional().isArray(),
    body('context.familyHistory').optional().isArray(),
    body('context.lifestyle').optional().isObject()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { symptoms, vitalSigns, context } = req.body;
      const userId = req.user!.id;

      // Log the analysis request
      await auditLogger.logAction(
        userId,
        'ai_symptom_analysis_requested',
        'ai_analysis',
        undefined,
        { symptomCount: symptoms.length }
      );

      const analysis = await aiAnalysisService.analyzeSymptoms(
        userId,
        symptoms,
        vitalSigns,
        context
      );

      // Log the completion
      await auditLogger.logAction(
        userId,
        'ai_symptom_analysis_completed',
        'ai_analysis',
        analysis.sessionId,
        { 
          urgencyLevel: analysis.urgencyLevel,
          confidence: analysis.confidence,
          riskFactorCount: analysis.riskFactors.length
        }
      );

      res.json({
        success: true,
        data: analysis
      });

    } catch (error) {
      console.error('Symptom analysis error:', error);
      
      await auditLogger.logAction(
        req.user!.id,
        'ai_symptom_analysis_failed',
        'ai_analysis',
        undefined,
        { error: error.message }
      );

      res.status(500).json({
        success: false,
        message: 'Analysis failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Get trend analysis for health metrics
router.get('/trends/:userId',
  authenticate,
  [
    param('userId').isUUID().withMessage('Invalid user ID'),
    query('metrics').isString().withMessage('Metrics parameter is required'),
    query('days').optional().isInt({ min: 7, max: 365 }).withMessage('Days must be between 7-365')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { userId } = req.params;
      const { metrics, days = 30 } = req.query;

      // Authorization: users can only access their own data unless admin
      if (req.user!.id !== userId && req.user!.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const metricsList = (metrics as string).split(',').map(m => m.trim());
      const trends = await aiAnalysisService.analyzeTrends(userId, metricsList, parseInt(days as string));

      await auditLogger.logDataAccess(
        req.user!.id,
        'ai_trend_analysis',
        userId,
        { metrics: metricsList, days }
      );

      res.json({
        success: true,
        data: trends
      });

    } catch (error) {
      console.error('Trend analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Trend analysis failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Generate health predictions
router.get('/predictions/:userId',
  authenticate,
  [
    param('userId').isUUID().withMessage('Invalid user ID')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { userId } = req.params;

      // Authorization: users can only access their own data unless admin
      if (req.user!.id !== userId && req.user!.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const predictions = await aiAnalysisService.generateHealthPredictions(userId);

      await auditLogger.logDataAccess(
        req.user!.id,
        'ai_health_predictions',
        userId,
        { predictionTypes: Object.keys(predictions) }
      );

      res.json({
        success: true,
        data: predictions
      });

    } catch (error) {
      console.error('Health predictions error:', error);
      res.status(500).json({
        success: false,
        message: 'Prediction generation failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Get analysis history
router.get('/history/:userId',
  authenticate,
  [
    param('userId').isUUID().withMessage('Invalid user ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
    query('type').optional().isIn(['symptom_analysis', 'risk_assessment', 'trend_analysis'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { userId } = req.params;
      const { page = 1, limit = 20, type } = req.query;

      // Authorization
      if (req.user!.id !== userId && req.user!.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      let query = `
        SELECT id, session_type, confidence_score, status, created_at, completed_at,
               CASE 
                 WHEN status = 'completed' THEN results->>'urgencyLevel'
                 ELSE NULL 
               END as urgency_level
        FROM ai_analysis_sessions
        WHERE user_id = $1
      `;
      
      const params = [userId];
      
      if (type) {
        query += ` AND session_type = $${params.length + 1}`;
        params.push(type as string);
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit as string, offset.toString());

      const result = await aiAnalysisService['db'].query(query, params);

      // Get total count
      let countQuery = `SELECT COUNT(*) FROM ai_analysis_sessions WHERE user_id = $1`;
      const countParams = [userId];
      
      if (type) {
        countQuery += ` AND session_type = $2`;
        countParams.push(type as string);
      }
      
      const countResult = await aiAnalysisService['db'].query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].count);

      await auditLogger.logDataAccess(
        req.user!.id,
        'ai_analysis_history',
        userId,
        { page, limit, type }
      );

      res.json({
        success: true,
        data: {
          sessions: result.rows,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            totalCount,
            totalPages: Math.ceil(totalCount / parseInt(limit as string))
          }
        }
      });

    } catch (error) {
      console.error('Analysis history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analysis history',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Get specific analysis session details
router.get('/session/:sessionId',
  authenticate,
  [
    param('sessionId').isUUID().withMessage('Invalid session ID')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { sessionId } = req.params;

      // Get session details
      const result = await aiAnalysisService['db'].query(
        `SELECT s.*, u.id as user_id
         FROM ai_analysis_sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = $1`,
        [sessionId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Analysis session not found'
        });
      }

      const session = result.rows[0];

      // Authorization
      if (req.user!.id !== session.user_id && req.user!.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Get associated insights
      const insightsResult = await aiAnalysisService['db'].query(
        `SELECT insight_type, category, content, confidence, created_at
         FROM ai_insights
         WHERE session_id = $1
         ORDER BY created_at ASC`,
        [sessionId]
      );

      await auditLogger.logDataAccess(
        req.user!.id,
        'ai_session_details',
        sessionId,
        { sessionType: session.session_type }
      );

      res.json({
        success: true,
        data: {
          session: {
            id: session.id,
            sessionType: session.session_type,
            status: session.status,
            confidenceScore: session.confidence_score,
            results: session.results,
            createdAt: session.created_at,
            completedAt: session.completed_at,
            errorMessage: session.error_message
          },
          insights: insightsResult.rows
        }
      });

    } catch (error) {
      console.error('Session details error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve session details',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Get AI analysis statistics for a user
router.get('/stats/:userId',
  authenticate,
  [
    param('userId').isUUID().withMessage('Invalid user ID'),
    query('period').optional().isIn(['week', 'month', 'quarter', 'year']).withMessage('Invalid period')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { userId } = req.params;
      const { period = 'month' } = req.query;

      // Authorization
      if (req.user!.id !== userId && req.user!.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const intervalMap = {
        week: '7 days',
        month: '30 days',
        quarter: '90 days',
        year: '365 days'
      };

      const interval = intervalMap[period as keyof typeof intervalMap];

      // Get analysis statistics
      const statsResult = await aiAnalysisService['db'].query(
        `SELECT 
           session_type,
           COUNT(*) as total_sessions,
           COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
           COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_sessions,
           AVG(CASE WHEN confidence_score IS NOT NULL THEN confidence_score END) as avg_confidence,
           COUNT(CASE WHEN results->>'urgencyLevel' = 'urgent' THEN 1 END) as urgent_analyses,
           COUNT(CASE WHEN results->>'urgencyLevel' = 'high' THEN 1 END) as high_priority_analyses
         FROM ai_analysis_sessions
         WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${interval}'
         GROUP BY session_type`,
        [userId]
      );

      // Get trend over time
      const trendResult = await aiAnalysisService['db'].query(
        `SELECT 
           DATE(created_at) as date,
           COUNT(*) as sessions_count
         FROM ai_analysis_sessions
         WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${interval}'
         GROUP BY DATE(created_at)
         ORDER BY date ASC`,
        [userId]
      );

      await auditLogger.logDataAccess(
        req.user!.id,
        'ai_analysis_stats',
        userId,
        { period }
      );

      res.json({
        success: true,
        data: {
          period,
          statistics: statsResult.rows,
          trend: trendResult.rows
        }
      });

    } catch (error) {
      console.error('Analysis statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analysis statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

export default router;