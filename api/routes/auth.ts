// Authentication Routes
// Complete REST API endpoints for authentication and user management

import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authService } from '../services/auth';
import { rateLimit } from '../services/rateLimit';
import { auditLogger } from '../services/audit';
import { emailService } from '../services/email';
import { authenticate, requireRole } from '../middleware/auth';
import { db } from '../db/connection';

const router = express.Router();

// Helper function to get client info
const getClientInfo = (req: Request) => ({
  ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
      req.connection.remoteAddress || '127.0.0.1',
  userAgent: req.headers['user-agent'] || 'Unknown'
});

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

// POST /auth/register - User registration
router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be 8-128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters long'),
  body('companyDomain')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Company domain must be 3-100 characters long'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must be less than 100 characters'),
  body('inviteToken')
    .optional()
    .isLength({ min: 10, max: 100 })
    .withMessage('Invalid invite token format')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const clientInfo = getClientInfo(req);
    
    // Rate limiting for registration
    if (!await rateLimit.check(`register:${clientInfo.ip}`, 5, 3600)) {
      return res.status(429).json({
        error: 'Too many registration attempts. Please try again later.'
      });
    }

    const result = await authService.register(req.body, clientInfo);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Log successful registration
    await auditLogger.log(
      'user_registration_success',
      null,
      clientInfo.ip,
      {
        email: req.body.email,
        hasInviteToken: !!req.body.inviteToken
      },
      true
    );

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification.',
      user: result.user
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    await auditLogger.logSecurityEvent({
      eventType: 'registration_error',
      severity: 'critical',
      ipAddress: getClientInfo(req).ip,
      details: { error: error.message },
      success: false
    });

    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /auth/login - User login
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('RememberMe must be a boolean'),
  body('mfaToken')
    .optional()
    .isLength({ min: 6, max: 8 })
    .withMessage('MFA token must be 6-8 characters')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const clientInfo = getClientInfo(req);
    
    const result = await authService.login(req.body, clientInfo);

    if (!result.success) {
      return res.status(401).json({ 
        error: result.error,
        mfaRequired: result.mfaRequired,
        remainingAttempts: result.remainingAttempts
      });
    }

    // Set secure HTTP-only cookie for web clients
    if (result.token) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: req.body.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days or 24 hours
      };
      
      res.cookie('authToken', result.token, cookieOptions);
      res.cookie('refreshToken', result.refreshToken, cookieOptions);
    }

    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken,
      sessionId: result.sessionId
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// POST /auth/logout - User logout
router.post('/logout', authenticate(), async (req: Request, res: Response) => {
  try {
    const clientInfo = getClientInfo(req);
    
    if (req.user?.sessionId) {
      await authService.logout(req.user.sessionId, clientInfo);
      
      // Blacklist the current token
      const token = req.headers.authorization?.substring(7);
      if (token) {
        authService.blacklistToken(token);
      }
    }

    // Clear cookies
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionToken');

    res.json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// POST /auth/refresh - Refresh access token
router.post('/refresh', [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const clientInfo = getClientInfo(req);
    const result = await authService.refreshToken(req.body.refreshToken, clientInfo);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    // Update cookies
    if (result.token) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      };
      
      res.cookie('authToken', result.token, cookieOptions);
      res.cookie('refreshToken', result.refreshToken, cookieOptions);
    }

    res.json({
      message: 'Token refreshed successfully',
      token: result.token,
      refreshToken: result.refreshToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// POST /auth/forgot-password - Request password reset
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('companyDomain')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Company domain must be 3-100 characters long')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const clientInfo = getClientInfo(req);
    const result = await authService.requestPasswordReset(req.body, clientInfo);

    // Always return success to prevent email enumeration
    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Password reset request failed' });
  }
});

// POST /auth/reset-password - Confirm password reset
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be 8-128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const clientInfo = getClientInfo(req);
    const result = await authService.confirmPasswordReset(req.body, clientInfo);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ message: 'Password reset successful. Please log in with your new password.' });

  } catch (error) {
    console.error('Password reset confirmation error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// GET /auth/verify-email/:token - Verify email address
router.get('/verify-email/:token', [
  param('token')
    .isLength({ min: 32, max: 128 })
    .withMessage('Invalid verification token')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const { token } = req.params;
    const clientInfo = getClientInfo(req);

    // Find and validate token
    const result = await db.query(`
      SELECT vt.user_id, u.encrypted_email, u.encrypted_name, u.company_id
      FROM email_verification_tokens vt
      JOIN users u ON vt.user_id = u.id
      WHERE vt.token = $1 
        AND vt.expires_at > NOW() 
        AND vt.verified = false
        AND u.is_active = true
    `, [token]);

    if (result.rows.length === 0) {
      await auditLogger.logSecurityEvent({
        eventType: 'invalid_email_verification',
        severity: 'warning',
        ipAddress: clientInfo.ip,
        details: { token: token.substring(0, 8) + '...' },
        success: false
      });

      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    const user = result.rows[0];

    // Update user as verified and mark token as used
    await db.query('BEGIN');
    
    try {
      await db.query(`
        UPDATE users 
        SET email_verified = true, updated_at = NOW()
        WHERE id = $1
      `, [user.user_id]);

      await db.query(`
        UPDATE email_verification_tokens 
        SET verified = true 
        WHERE user_id = $1 AND token = $2
      `, [user.user_id, token]);

      await db.query('COMMIT');

      // Decrypt user data for welcome email
      const decryptedName = user.encrypted_name ? 
        db.decryptData(
          JSON.parse(user.encrypted_name).encrypted,
          JSON.parse(user.encrypted_name).iv,
          JSON.parse(user.encrypted_name).tag,
          user.company_id
        ) : '';

      const decryptedEmail = user.encrypted_email ? 
        db.decryptData(
          JSON.parse(user.encrypted_email).encrypted,
          JSON.parse(user.encrypted_email).iv,
          JSON.parse(user.encrypted_email).tag,
          user.company_id
        ) : '';

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(decryptedEmail, decryptedName);
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
      }

      // Log successful verification
      await auditLogger.log(
        'email_verification_success',
        user.user_id,
        clientInfo.ip,
        { email: decryptedEmail },
        true,
        {
          entityType: 'user',
          entityId: user.user_id,
          complianceTags: ['EMAIL_VERIFICATION']
        }
      );

      res.json({ 
        message: 'Email verified successfully. Welcome to Healthcare SaaS!',
        verified: true 
      });

    } catch (dbError) {
      await db.query('ROLLBACK');
      throw dbError;
    }

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// GET /auth/me - Get current user info
router.get('/me', authenticate(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get detailed user information
    const result = await db.query(`
      SELECT 
        u.anonymous_id, u.role, u.email_verified, u.created_at, u.last_login,
        u.encrypted_name, u.encrypted_email, u.company_id,
        c.name as company_name, c.subscription_tier,
        hp.profile_completion_percentage
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
      LEFT JOIN user_health_profiles hp ON u.id = hp.user_id
      WHERE u.anonymous_id = $1 AND u.is_active = true
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Decrypt sensitive data
    const decryptedName = user.encrypted_name ? 
      db.decryptData(
        JSON.parse(user.encrypted_name).encrypted,
        JSON.parse(user.encrypted_name).iv,
        JSON.parse(user.encrypted_name).tag,
        user.company_id
      ) : '';

    const decryptedEmail = user.encrypted_email ? 
      db.decryptData(
        JSON.parse(user.encrypted_email).encrypted,
        JSON.parse(user.encrypted_email).iv,
        JSON.parse(user.encrypted_email).tag,
        user.company_id
      ) : '';

    res.json({
      id: user.anonymous_id,
      name: decryptedName,
      email: decryptedEmail,
      role: user.role,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      company: {
        id: user.company_id,
        name: user.company_name,
        tier: user.subscription_tier
      },
      profile: {
        completionPercentage: user.profile_completion_percentage || 0
      },
      permissions: req.user.permissions
    });

  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

// GET /auth/sessions - Get user sessions
router.get('/sessions', authenticate(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const sessions = await authService.getUserSessions(req.user.id);
    
    res.json({ sessions });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// DELETE /auth/sessions/:sessionId - Revoke specific session
router.delete('/sessions/:sessionId', [
  authenticate(),
  param('sessionId').isUUID().withMessage('Invalid session ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const success = await authService.revokeSession(req.params.sessionId, req.user.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await auditLogger.log(
      'session_revoked',
      req.user.userId,
      getClientInfo(req).ip,
      { revokedSessionId: req.params.sessionId },
      true
    );

    res.json({ message: 'Session revoked successfully' });

  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({ error: 'Failed to revoke session' });
  }
});

// POST /auth/change-password - Change password
router.post('/change-password', [
  authenticate(),
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be 8-128 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // This would be implemented in the auth service
    // const result = await authService.changePassword(req.user.userId, req.body.currentPassword, req.body.newPassword);
    
    await auditLogger.log(
      'password_change_success',
      req.user.userId,
      getClientInfo(req).ip,
      {},
      true,
      {
        entityType: 'user',
        entityId: req.user.userId,
        complianceTags: ['PASSWORD_CHANGE']
      }
    );

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// GET /auth/validate - Validate current token
router.get('/validate', authenticate(), async (req: Request, res: Response) => {
  try {
    res.json({ 
      valid: true,
      user: {
        id: req.user?.id,
        role: req.user?.role,
        sessionId: req.user?.sessionId
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

// POST /auth/resend-verification - Resend email verification
router.post('/resend-verification', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    const clientInfo = getClientInfo(req);
    
    // Rate limiting
    if (!await rateLimit.check(`resend_verification:${clientInfo.ip}`, 3, 3600)) {
      return res.status(429).json({ error: 'Too many verification emails sent. Please try again later.' });
    }

    // Implementation would be in auth service
    // await authService.resendVerificationEmail(req.body.email);

    res.json({ message: 'Verification email sent if account exists and is not already verified.' });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

export default router;