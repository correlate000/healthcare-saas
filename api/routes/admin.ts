// Admin Routes
// Complete REST API endpoints for administrative operations

import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { adminDataService } from '../services/adminData';
import { authenticate, requireRole, requireAdmin, requireCompanyAdmin } from '../middleware/auth';
import { auditLogger } from '../services/audit';

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

// Company Management

// POST /admin/companies - Create company (super admin only)
router.post('/companies', [
  requireRole('super_admin'),
  body('name').isLength({ min: 2, max: 255 }).withMessage('Company name must be 2-255 characters'),
  body('domain').optional().isLength({ min: 3, max: 100 }).withMessage('Domain must be 3-100 characters'),
  body('subscriptionTier').optional().isIn(['basic', 'professional', 'enterprise']).withMessage('Invalid subscription tier'),
  body('maxUsers').optional().isInt({ min: 1, max: 10000 }).withMessage('Max users must be 1-10000'),
  body('settings').optional().isObject().withMessage('Settings must be an object')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const companyId = await adminDataService.createCompany(req.body, req.user.userId);

    res.status(201).json({
      message: 'Company created successfully',
      companyId
    });

  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// GET /admin/companies - Get companies
router.get('/companies', [
  requireRole('admin', 'super_admin'),
  query('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  query('subscriptionTier').optional().isIn(['basic', 'professional', 'enterprise']).withMessage('Invalid subscription tier'),
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
      isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
      subscriptionTier: req.query.subscriptionTier as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const result = await adminDataService.getCompanies(filters, req.user.userId);

    res.json(result);

  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to get companies' });
  }
});

// GET /admin/companies/:companyId - Get specific company
router.get('/companies/:companyId', [
  requireCompanyAdmin(),
  param('companyId').isUUID().withMessage('Invalid company ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user has access to this company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.companyId !== req.params.companyId) {
      return res.status(403).json({ error: 'Access denied to this company' });
    }

    const company = await adminDataService.getCompany(req.params.companyId, req.user.userId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ company });

  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Failed to get company' });
  }
});

// PUT /admin/companies/:companyId - Update company
router.put('/companies/:companyId', [
  requireCompanyAdmin(),
  param('companyId').isUUID().withMessage('Invalid company ID'),
  body('name').optional().isLength({ min: 2, max: 255 }).withMessage('Company name must be 2-255 characters'),
  body('domain').optional().isLength({ min: 3, max: 100 }).withMessage('Domain must be 3-100 characters'),
  body('subscriptionTier').optional().isIn(['basic', 'professional', 'enterprise']).withMessage('Invalid subscription tier'),
  body('maxUsers').optional().isInt({ min: 1, max: 10000 }).withMessage('Max users must be 1-10000'),
  body('settings').optional().isObject().withMessage('Settings must be an object'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user has access to this company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.companyId !== req.params.companyId) {
      return res.status(403).json({ error: 'Access denied to this company' });
    }

    const success = await adminDataService.updateCompany(
      req.params.companyId,
      req.body,
      req.user.userId
    );

    if (!success) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ message: 'Company updated successfully' });

  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// User Management

// GET /admin/users - Get users in company
router.get('/users', [
  requireCompanyAdmin(),
  query('companyId').optional().isUUID().withMessage('Invalid company ID'),
  query('role').optional().isIn(['user', 'company_admin', 'admin', 'super_admin']).withMessage('Invalid role'),
  query('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  query('emailVerified').optional().isBoolean().withMessage('emailVerified must be boolean'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Determine which company to query
    let companyId = req.query.companyId as string;
    if (!companyId) {
      if (req.user.role === 'super_admin' || req.user.role === 'admin') {
        return res.status(400).json({ error: 'Company ID required for admin users' });
      }
      companyId = req.user.companyId;
    }

    // Check if user has access to this company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.companyId !== companyId) {
      return res.status(403).json({ error: 'Access denied to this company' });
    }

    const filters = {
      role: req.query.role as string,
      isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
      emailVerified: req.query.emailVerified ? req.query.emailVerified === 'true' : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const result = await adminDataService.getUsers(companyId, filters, req.user.userId);

    res.json(result);

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// PUT /admin/users/:userId - Update user
router.put('/users/:userId', [
  requireCompanyAdmin(),
  param('userId').isUUID().withMessage('Invalid user ID'),
  body('role').optional().isIn(['user', 'company_admin']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('name').optional().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('department').optional().isLength({ max: 100 }).withMessage('Department must be less than 100 characters')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Super admins and admins can assign admin roles
    if (req.body.role === 'admin' || req.body.role === 'super_admin') {
      if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges to assign admin roles' });
      }
    }

    const success = await adminDataService.updateUser(
      req.params.userId,
      req.body,
      req.user.userId
    );

    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// POST /admin/users/invite - Invite user to company
router.post('/users/invite', [
  requireCompanyAdmin(),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('companyId').optional().isUUID().withMessage('Invalid company ID'),
  body('role').optional().isIn(['user', 'company_admin']).withMessage('Invalid role'),
  body('department').optional().isLength({ max: 100 }).withMessage('Department must be less than 100 characters'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message must be less than 500 characters')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Use user's company if not specified
    const companyId = req.body.companyId || req.user.companyId;

    // Check if user has access to this company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.companyId !== companyId) {
      return res.status(403).json({ error: 'Access denied to this company' });
    }

    const inviteData = {
      email: req.body.email,
      companyId,
      role: req.body.role || 'user',
      department: req.body.department,
      invitedBy: req.user.userId,
      message: req.body.message
    };

    const inviteToken = await adminDataService.inviteUser(inviteData, req.user.userId);

    res.status(201).json({
      message: 'User invitation sent successfully',
      inviteToken
    });

  } catch (error) {
    console.error('Invite user error:', error);
    if (error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
    } else if (error.message.includes('maximum user limit')) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to invite user' });
    }
  }
});

// POST /admin/users/batch-update - Batch update users
router.post('/users/batch-update', [
  requireCompanyAdmin(),
  body('updates').isArray({ min: 1, max: 50 }).withMessage('Updates must be an array with 1-50 items'),
  body('updates.*.userId').isUUID().withMessage('Invalid user ID'),
  body('updates.*.updateData').isObject().withMessage('Update data must be an object')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await adminDataService.batchUpdateUsers(req.body.updates, req.user.userId);

    res.json({
      message: 'Batch update completed',
      result
    });

  } catch (error) {
    console.error('Batch update users error:', error);
    res.status(500).json({ error: 'Failed to perform batch update' });
  }
});

// Security Configuration Management

// GET /admin/security-config/:companyId - Get security configuration
router.get('/security-config/:companyId', [
  requireCompanyAdmin(),
  param('companyId').isUUID().withMessage('Invalid company ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user has access to this company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.companyId !== req.params.companyId) {
      return res.status(403).json({ error: 'Access denied to this company' });
    }

    const config = await adminDataService.getSecurityConfiguration(req.params.companyId, req.user.userId);

    if (!config) {
      return res.status(404).json({ error: 'Security configuration not found' });
    }

    res.json({ config });

  } catch (error) {
    console.error('Get security configuration error:', error);
    res.status(500).json({ error: 'Failed to get security configuration' });
  }
});

// PUT /admin/security-config/:companyId - Update security configuration
router.put('/security-config/:companyId', [
  requireCompanyAdmin(),
  param('companyId').isUUID().withMessage('Invalid company ID'),
  body('passwordMinLength').optional().isInt({ min: 6, max: 128 }).withMessage('Password min length must be 6-128'),
  body('passwordRequireUppercase').optional().isBoolean().withMessage('Password require uppercase must be boolean'),
  body('passwordRequireLowercase').optional().isBoolean().withMessage('Password require lowercase must be boolean'),
  body('passwordRequireNumbers').optional().isBoolean().withMessage('Password require numbers must be boolean'),
  body('passwordRequireSymbols').optional().isBoolean().withMessage('Password require symbols must be boolean'),
  body('passwordMaxAgeDays').optional().isInt({ min: 0, max: 365 }).withMessage('Password max age must be 0-365 days'),
  body('mfaRequired').optional().isBoolean().withMessage('MFA required must be boolean'),
  body('sessionTimeoutMinutes').optional().isInt({ min: 5, max: 1440 }).withMessage('Session timeout must be 5-1440 minutes'),
  body('maxConcurrentSessions').optional().isInt({ min: 1, max: 10 }).withMessage('Max concurrent sessions must be 1-10'),
  body('maxFailedAttempts').optional().isInt({ min: 3, max: 20 }).withMessage('Max failed attempts must be 3-20'),
  body('lockoutDurationMinutes').optional().isInt({ min: 1, max: 1440 }).withMessage('Lockout duration must be 1-1440 minutes'),
  body('allowedIpRanges').optional().isArray().withMessage('Allowed IP ranges must be an array'),
  body('geoRestrictions').optional().isArray().withMessage('Geo restrictions must be an array')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user has access to this company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.companyId !== req.params.companyId) {
      return res.status(403).json({ error: 'Access denied to this company' });
    }

    const config = {
      companyId: req.params.companyId,
      ...req.body
    };

    const success = await adminDataService.updateSecurityConfiguration(
      req.params.companyId,
      config,
      req.user.userId
    );

    if (!success) {
      return res.status(404).json({ error: 'Security configuration not found' });
    }

    res.json({ message: 'Security configuration updated successfully' });

  } catch (error) {
    console.error('Update security configuration error:', error);
    res.status(500).json({ error: 'Failed to update security configuration' });
  }
});

// API Key Management

// GET /admin/api-keys/:companyId - Get API keys for company
router.get('/api-keys/:companyId', [
  requireCompanyAdmin(),
  param('companyId').isUUID().withMessage('Invalid company ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user has access to this company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.companyId !== req.params.companyId) {
      return res.status(403).json({ error: 'Access denied to this company' });
    }

    const apiKeys = await adminDataService.getApiKeys(req.params.companyId, req.user.userId);

    res.json({ apiKeys });

  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Failed to get API keys' });
  }
});

// POST /admin/api-keys - Create API key
router.post('/api-keys', [
  requireCompanyAdmin(),
  body('companyId').isUUID().withMessage('Invalid company ID'),
  body('name').isLength({ min: 1, max: 255 }).withMessage('Name must be 1-255 characters'),
  body('permissions').isArray().withMessage('Permissions must be an array'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiration date')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user has access to this company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.companyId !== req.body.companyId) {
      return res.status(403).json({ error: 'Access denied to this company' });
    }

    const apiKeyData = {
      ...req.body,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined
    };

    const result = await adminDataService.createApiKey(apiKeyData, req.user.userId);

    res.status(201).json({
      message: 'API key created successfully',
      apiKeyId: result.id,
      apiKey: result.key // Only returned once
    });

  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

// DELETE /admin/api-keys/:apiKeyId - Revoke API key
router.delete('/api-keys/:apiKeyId', [
  requireCompanyAdmin(),
  param('apiKeyId').isUUID().withMessage('Invalid API key ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const success = await adminDataService.revokeApiKey(req.params.apiKeyId, req.user.userId);

    if (!success) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ message: 'API key revoked successfully' });

  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
});

// System Analytics

// GET /admin/analytics - Get system analytics
router.get('/analytics', [
  requireAdmin(),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('companyId').optional().isUUID().withMessage('Invalid company ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      companyId: req.query.companyId as string
    };

    const analytics = await adminDataService.getSystemAnalytics(filters, req.user.userId);

    res.json({ analytics });

  } catch (error) {
    console.error('Get system analytics error:', error);
    res.status(500).json({ error: 'Failed to get system analytics' });
  }
});

// Data Export

// POST /admin/export/:companyId - Export company data
router.post('/export/:companyId', [
  requireCompanyAdmin(),
  param('companyId').isUUID().withMessage('Invalid company ID'),
  body('exportType').isIn(['users', 'health_data', 'all']).withMessage('Invalid export type')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user has access to this company
    if (req.user.role !== 'super_admin' && req.user.role !== 'admin' && req.user.companyId !== req.params.companyId) {
      return res.status(403).json({ error: 'Access denied to this company' });
    }

    const result = await adminDataService.exportCompanyData(
      req.params.companyId,
      req.body.exportType,
      req.user.userId
    );

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);

  } catch (error) {
    console.error('Export company data error:', error);
    res.status(500).json({ error: 'Failed to export company data' });
  }
});

// Audit Logs

// GET /admin/audit-logs - Get audit logs
router.get('/audit-logs', [
  requireAdmin(),
  query('action').optional().isLength({ min: 1, max: 100 }).withMessage('Invalid action'),
  query('actorId').optional().isUUID().withMessage('Invalid actor ID'),
  query('entityType').optional().isLength({ min: 1, max: 50 }).withMessage('Invalid entity type'),
  query('entityId').optional().isUUID().withMessage('Invalid entity ID'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('success').optional().isBoolean().withMessage('Success must be boolean'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const criteria = {
      action: req.query.action as string,
      actorId: req.query.actorId as string,
      entityType: req.query.entityType as string,
      entityId: req.query.entityId as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      success: req.query.success ? req.query.success === 'true' : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const result = await auditLogger.searchLogs(criteria);

    res.json(result);

  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to get audit logs' });
  }
});

// GET /admin/compliance-report - Generate compliance report
router.get('/compliance-report', [
  requireAdmin(),
  query('startDate').isISO8601().withMessage('Start date is required'),
  query('endDate').isISO8601().withMessage('End date is required')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const period = {
      start: new Date(req.query.startDate as string),
      end: new Date(req.query.endDate as string)
    };

    const report = await auditLogger.generateComplianceReport(period);

    res.json({ report });

  } catch (error) {
    console.error('Generate compliance report error:', error);
    res.status(500).json({ error: 'Failed to generate compliance report' });
  }
});

// POST /admin/audit-logs/export - Export audit logs
router.post('/audit-logs/export', [
  requireAdmin(),
  body('startDate').isISO8601().withMessage('Start date is required'),
  body('endDate').isISO8601().withMessage('End date is required'),
  body('format').optional().isIn(['json', 'csv']).withMessage('Invalid format')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    const format = req.body.format || 'json';

    const result = await auditLogger.exportLogs(startDate, endDate, format as 'json' | 'csv');

    const contentType = format === 'csv' ? 'text/csv' : 'application/json';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);

  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

export default router;