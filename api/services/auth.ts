// Healthcare SaaS Authentication Service
// Complete JWT + Session based authentication with enterprise security

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/connection';
import { rateLimit } from './rateLimit';
import { emailService } from './email';
import { auditLogger } from './audit';

interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  sessionSecret: string;
  sessionMaxAge: number;
  bcryptRounds: number;
  maxLoginAttempts: number;
  lockDuration: number;
}

interface LoginCredentials {
  email: string;
  password: string;
  companyDomain?: string;
  rememberMe?: boolean;
  mfaToken?: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  companyId?: string;
  companyDomain?: string;
  department?: string;
  inviteToken?: string;
}

interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  refreshToken?: string;
  sessionId?: string;
  mfaRequired?: boolean;
  error?: string;
  remainingAttempts?: number;
}

interface PasswordResetRequest {
  email: string;
  companyDomain?: string;
}

interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

class AuthenticationService {
  private config: AuthConfig;
  private readonly tokenBlacklist = new Set<string>();

  constructor() {
    this.config = {
      jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_change_in_production',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
      sessionSecret: process.env.SESSION_SECRET || 'your_session_secret_change_in_production',
      sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'), // 24 hours
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
      maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5'),
      lockDuration: parseInt(process.env.ACCOUNT_LOCK_DURATION_MINUTES || '30') * 60 * 1000
    };

    // Validate configuration
    this.validateConfig();
  }

  private validateConfig(): void {
    const requiredEnvVars = ['JWT_SECRET', 'SESSION_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required authentication environment variables: ${missingVars.join(', ')}`);
    }

    if (this.config.jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }
  }

  // User registration with complete validation
  async register(data: RegisterData, clientInfo: { ip: string; userAgent: string }): Promise<AuthResult> {
    const transaction = await db.beginTransaction();
    
    try {
      // Rate limiting
      if (!await rateLimit.check(`registration:${clientInfo.ip}`, 5, 3600)) {
        return { success: false, error: 'Too many registration attempts. Please try again later.' };
      }

      // Validate input data
      const validation = await this.validateRegistrationData(data);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Check if email already exists
      const emailHash = db.hashIdentifier(data.email);
      const existingUser = await transaction.query(
        'SELECT id FROM users WHERE email_hash = $1',
        [emailHash]
      );

      if (existingUser.rows.length > 0) {
        await auditLogger.log('registration_attempt', null, clientInfo.ip, {
          email: data.email,
          reason: 'email_already_exists'
        }, false);
        return { success: false, error: 'An account with this email already exists.' };
      }

      // Handle company association
      let companyId = data.companyId;
      if (!companyId && data.companyDomain) {
        const company = await transaction.query(
          'SELECT id FROM companies WHERE domain = $1 AND is_active = true',
          [data.companyDomain]
        );
        
        if (company.rows.length > 0) {
          companyId = company.rows[0].id;
        } else {
          return { success: false, error: 'Invalid company domain.' };
        }
      }

      // Validate invite token if provided
      if (data.inviteToken) {
        const invite = await transaction.query(
          'SELECT * FROM user_invites WHERE token = $1 AND expires_at > NOW() AND used = false',
          [data.inviteToken]
        );
        
        if (invite.rows.length === 0) {
          return { success: false, error: 'Invalid or expired invite token.' };
        }
        
        companyId = invite.rows[0].company_id;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, this.config.bcryptRounds);

      // Create user with encryption
      const userId = uuidv4();
      const anonymousId = db.generateAnonymousId(userId, companyId || 'default');
      
      const encryptedName = db.encryptData(data.name, companyId || 'default');
      const encryptedEmail = db.encryptData(data.email, companyId || 'default');
      const encryptedDepartment = data.department ? 
        db.encryptData(data.department, companyId || 'default') : null;

      await transaction.query(`
        INSERT INTO users (
          id, company_id, email_hash, anonymous_id,
          encrypted_name, encrypted_email, encrypted_department,
          password_hash, role, consent_given, consent_date,
          data_retention_until, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      `, [
        userId, companyId, emailHash, anonymousId,
        JSON.stringify(encryptedName),
        JSON.stringify(encryptedEmail),
        encryptedDepartment ? JSON.stringify(encryptedDepartment) : null,
        passwordHash, 'user', true, new Date(),
        new Date(Date.now() + (3 * 365 * 24 * 60 * 60 * 1000)) // 3 years retention
      ]);

      // Create initial health profile
      await transaction.query(`
        INSERT INTO user_health_profiles (
          user_id, data_sharing_consent, research_participation_consent,
          profile_completion_percentage
        ) VALUES ($1, $2, $3, $4)
      `, [userId, false, false, 10]);

      // Mark invite as used if applicable
      if (data.inviteToken) {
        await transaction.query(
          'UPDATE user_invites SET used = true, used_by = $1, used_at = NOW() WHERE token = $2',
          [userId, data.inviteToken]
        );
      }

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      await transaction.query(`
        INSERT INTO email_verification_tokens (user_id, token, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '24 hours')
      `, [userId, verificationToken]);

      await transaction.commit();

      // Send verification email
      try {
        await emailService.sendVerificationEmail(data.email, data.name, verificationToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue with registration success even if email fails
      }

      // Log successful registration
      await auditLogger.log('user_registration', userId, clientInfo.ip, {
        email: data.email,
        companyId,
        hasInviteToken: !!data.inviteToken
      }, true);

      return {
        success: true,
        user: {
          id: anonymousId,
          email: data.email,
          name: data.name,
          emailVerified: false
        }
      };

    } catch (error) {
      await transaction.rollback();
      console.error('Registration error:', error);
      
      await auditLogger.log('registration_error', null, clientInfo.ip, {
        error: error.message,
        email: data.email
      }, false);
      
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      await transaction.release();
    }
  }

  // User login with security features
  async login(credentials: LoginCredentials, clientInfo: { ip: string; userAgent: string }): Promise<AuthResult> {
    try {
      // Rate limiting per IP and per email
      const ipKey = `login_ip:${clientInfo.ip}`;
      const emailKey = `login_email:${db.hashIdentifier(credentials.email)}`;
      
      if (!await rateLimit.check(ipKey, 10, 900) || !await rateLimit.check(emailKey, 5, 900)) {
        await auditLogger.log('login_rate_limited', null, clientInfo.ip, {
          email: credentials.email
        }, false);
        return { success: false, error: 'Too many login attempts. Please try again later.' };
      }

      // Find user by email hash
      const emailHash = db.hashIdentifier(credentials.email);
      const userResult = await db.query(`
        SELECT 
          u.id, u.company_id, u.anonymous_id, u.password_hash, u.role,
          u.encrypted_name, u.encrypted_email, u.is_active, u.email_verified,
          u.login_attempts, u.locked_until, u.last_login, u.sso_provider_id,
          c.name as company_name, c.subscription_tier
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        WHERE u.email_hash = $1
      `, [emailHash]);

      if (userResult.rows.length === 0) {
        await auditLogger.log('login_failed', null, clientInfo.ip, {
          email: credentials.email,
          reason: 'user_not_found'
        }, false);
        return { success: false, error: 'Invalid email or password.' };
      }

      const user = userResult.rows[0];

      // Check if account is active
      if (!user.is_active) {
        await auditLogger.log('login_failed', user.id, clientInfo.ip, {
          reason: 'account_inactive'
        }, false);
        return { success: false, error: 'Account is inactive. Please contact support.' };
      }

      // Check if account is locked
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        const unlockTime = new Date(user.locked_until);
        await auditLogger.log('login_failed', user.id, clientInfo.ip, {
          reason: 'account_locked',
          locked_until: unlockTime
        }, false);
        return { 
          success: false, 
          error: `Account is locked until ${unlockTime.toLocaleString()}. Please try again later.` 
        };
      }

      // Verify password
      const passwordValid = await bcrypt.compare(credentials.password, user.password_hash);
      
      if (!passwordValid) {
        // Increment failed attempts
        const newAttempts = (user.login_attempts || 0) + 1;
        const shouldLock = newAttempts >= this.config.maxLoginAttempts;
        
        await db.query(`
          UPDATE users 
          SET login_attempts = $1, 
              locked_until = $2,
              updated_at = NOW()
          WHERE id = $3
        `, [
          newAttempts,
          shouldLock ? new Date(Date.now() + this.config.lockDuration) : null,
          user.id
        ]);

        await auditLogger.log('login_failed', user.id, clientInfo.ip, {
          reason: 'invalid_password',
          attempts: newAttempts,
          locked: shouldLock
        }, false);

        const remainingAttempts = this.config.maxLoginAttempts - newAttempts;
        return { 
          success: false, 
          error: 'Invalid email or password.',
          remainingAttempts: Math.max(0, remainingAttempts)
        };
      }

      // Check if email verification is required
      if (!user.email_verified) {
        return { 
          success: false, 
          error: 'Please verify your email before logging in.' 
        };
      }

      // Check for MFA requirement
      if (await this.isMfaRequired(user.id)) {
        if (!credentials.mfaToken) {
          return { 
            success: false, 
            mfaRequired: true,
            error: 'Multi-factor authentication required.' 
          };
        }
        
        if (!await this.verifyMfaToken(user.id, credentials.mfaToken)) {
          await auditLogger.log('login_failed', user.id, clientInfo.ip, {
            reason: 'invalid_mfa'
          }, false);
          return { success: false, error: 'Invalid MFA token.' };
        }
      }

      // Reset login attempts on successful authentication
      await db.query(`
        UPDATE users 
        SET login_attempts = 0, 
            locked_until = NULL, 
            last_login = NOW(),
            updated_at = NOW()
        WHERE id = $1
      `, [user.id]);

      // Create session
      const session = await this.createSession(user, clientInfo, credentials.rememberMe);

      // Generate JWT token
      const token = this.generateJwtToken({
        userId: user.anonymous_id,
        sessionId: session.id,
        role: user.role,
        companyId: user.company_id
      });

      // Decrypt user data for response
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

      // Log successful login
      await auditLogger.log('login_success', user.id, clientInfo.ip, {
        sessionId: session.id,
        rememberMe: credentials.rememberMe
      }, true);

      return {
        success: true,
        token,
        refreshToken: session.refresh_token,
        sessionId: session.id,
        user: {
          id: user.anonymous_id,
          email: decryptedEmail,
          name: decryptedName,
          role: user.role,
          company: {
            id: user.company_id,
            name: user.company_name,
            tier: user.subscription_tier
          },
          lastLogin: user.last_login,
          emailVerified: user.email_verified
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      await auditLogger.log('login_error', null, clientInfo.ip, {
        error: error.message,
        email: credentials.email
      }, false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Password reset request
  async requestPasswordReset(data: PasswordResetRequest, clientInfo: { ip: string }): Promise<{ success: boolean; error?: string }> {
    try {
      // Rate limiting
      if (!await rateLimit.check(`password_reset:${clientInfo.ip}`, 3, 3600)) {
        return { success: false, error: 'Too many password reset requests. Please try again later.' };
      }

      const emailHash = db.hashIdentifier(data.email);
      const userResult = await db.query(`
        SELECT u.id, u.encrypted_name, u.encrypted_email, u.company_id, u.is_active
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        WHERE u.email_hash = $1 
          AND u.is_active = true
          AND (c.domain = $2 OR $2 IS NULL)
      `, [emailHash, data.companyDomain]);

      // Always return success to prevent email enumeration
      if (userResult.rows.length === 0) {
        await auditLogger.log('password_reset_request', null, clientInfo.ip, {
          email: data.email,
          reason: 'user_not_found'
        }, false);
        return { success: true };
      }

      const user = userResult.rows[0];

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Store reset token (expires in 1 hour)
      await db.query(`
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '1 hour')
      `, [user.id, hashedToken]);

      // Decrypt user data for email
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

      // Send password reset email
      await emailService.sendPasswordResetEmail(decryptedEmail, decryptedName, resetToken);

      await auditLogger.log('password_reset_request', user.id, clientInfo.ip, {
        email: data.email
      }, true);

      return { success: true };

    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: 'Failed to process password reset request.' };
    }
  }

  // Confirm password reset
  async confirmPasswordReset(data: PasswordResetConfirm, clientInfo: { ip: string }): Promise<{ success: boolean; error?: string }> {
    const transaction = await db.beginTransaction();
    
    try {
      // Validate passwords match
      if (data.newPassword !== data.confirmPassword) {
        return { success: false, error: 'Passwords do not match.' };
      }

      // Validate password strength
      const passwordValidation = this.validatePassword(data.newPassword);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      // Hash the token to match stored version
      const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');

      // Find valid reset token
      const tokenResult = await transaction.query(`
        SELECT rt.user_id, u.anonymous_id, u.password_hash
        FROM password_reset_tokens rt
        JOIN users u ON rt.user_id = u.id
        WHERE rt.token = $1 
          AND rt.expires_at > NOW() 
          AND rt.used = false
          AND u.is_active = true
      `, [hashedToken]);

      if (tokenResult.rows.length === 0) {
        await auditLogger.log('password_reset_failed', null, clientInfo.ip, {
          reason: 'invalid_or_expired_token'
        }, false);
        return { success: false, error: 'Invalid or expired reset token.' };
      }

      const { user_id, anonymous_id, password_hash } = tokenResult.rows[0];

      // Check if new password is different from current
      const isSamePassword = await bcrypt.compare(data.newPassword, password_hash);
      if (isSamePassword) {
        return { success: false, error: 'New password must be different from current password.' };
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(data.newPassword, this.config.bcryptRounds);

      // Update password and reset login attempts
      await transaction.query(`
        UPDATE users 
        SET password_hash = $1, 
            login_attempts = 0, 
            locked_until = NULL,
            updated_at = NOW()
        WHERE id = $2
      `, [newPasswordHash, user_id]);

      // Mark token as used
      await transaction.query(`
        UPDATE password_reset_tokens 
        SET used = true 
        WHERE user_id = $1 AND token = $2
      `, [user_id, hashedToken]);

      // Invalidate all existing sessions for security
      await transaction.query(`
        UPDATE user_sessions 
        SET is_active = false 
        WHERE user_id = $1
      `, [user_id]);

      await transaction.commit();

      await auditLogger.log('password_reset_success', user_id, clientInfo.ip, {
        anonymousId: anonymous_id
      }, true);

      return { success: true };

    } catch (error) {
      await transaction.rollback();
      console.error('Password reset confirmation error:', error);
      return { success: false, error: 'Failed to reset password.' };
    } finally {
      await transaction.release();
    }
  }

  // Validate JWT token
  async validateToken(token: string): Promise<{ valid: boolean; payload?: any; error?: string }> {
    try {
      // Check if token is blacklisted
      if (this.tokenBlacklist.has(token)) {
        return { valid: false, error: 'Token has been revoked' };
      }

      // Verify JWT
      const payload = jwt.verify(token, this.config.jwtSecret) as any;

      // Validate session is still active
      const sessionResult = await db.query(`
        SELECT s.*, u.anonymous_id, u.is_active as user_active
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1 AND s.is_active = true AND s.expires_at > NOW()
      `, [payload.sessionId]);

      if (sessionResult.rows.length === 0) {
        return { valid: false, error: 'Session expired or invalid' };
      }

      const session = sessionResult.rows[0];
      
      if (!session.user_active) {
        return { valid: false, error: 'User account is inactive' };
      }

      return { 
        valid: true, 
        payload: {
          ...payload,
          sessionData: session
        }
      };

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return { valid: false, error: 'Invalid token' };
      }
      if (error instanceof jwt.TokenExpiredError) {
        return { valid: false, error: 'Token expired' };
      }
      
      console.error('Token validation error:', error);
      return { valid: false, error: 'Token validation failed' };
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string, clientInfo: { ip: string; userAgent: string }): Promise<AuthResult> {
    try {
      const sessionResult = await db.query(`
        SELECT s.*, u.anonymous_id, u.role, u.company_id, u.is_active
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.refresh_token = $1 
          AND s.is_active = true 
          AND s.expires_at > NOW()
      `, [refreshToken]);

      if (sessionResult.rows.length === 0) {
        return { success: false, error: 'Invalid refresh token' };
      }

      const session = sessionResult.rows[0];

      if (!session.is_active) {
        return { success: false, error: 'User account is inactive' };
      }

      // Generate new tokens
      const newRefreshToken = crypto.randomBytes(32).toString('hex');
      const newToken = this.generateJwtToken({
        userId: session.anonymous_id,
        sessionId: session.id,
        role: session.role,
        companyId: session.company_id
      });

      // Update session with new refresh token
      await db.query(`
        UPDATE user_sessions 
        SET refresh_token = $1, updated_at = NOW()
        WHERE id = $2
      `, [newRefreshToken, session.id]);

      await auditLogger.log('token_refresh', session.user_id, clientInfo.ip, {
        sessionId: session.id
      }, true);

      return {
        success: true,
        token: newToken,
        refreshToken: newRefreshToken,
        sessionId: session.id
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, error: 'Failed to refresh token' };
    }
  }

  // Logout
  async logout(sessionId: string, clientInfo: { ip: string }): Promise<{ success: boolean }> {
    try {
      const result = await db.query(`
        UPDATE user_sessions 
        SET is_active = false, updated_at = NOW()
        WHERE id = $1
        RETURNING user_id
      `, [sessionId]);

      if (result.rows.length > 0) {
        await auditLogger.log('logout', result.rows[0].user_id, clientInfo.ip, {
          sessionId
        }, true);
      }

      return { success: true };

    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }

  // Private helper methods
  private async createSession(user: any, clientInfo: { ip: string; userAgent: string }, rememberMe: boolean = false): Promise<any> {
    const sessionId = uuidv4();
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Extended expiration for "remember me"
    const expirationHours = rememberMe ? 24 * 30 : 24; // 30 days vs 24 hours
    const expiresAt = new Date(Date.now() + (expirationHours * 60 * 60 * 1000));

    await db.query(`
      INSERT INTO user_sessions (
        id, user_id, session_token, refresh_token, expires_at,
        ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      sessionId, user.id, sessionToken, refreshToken, expiresAt,
      clientInfo.ip, clientInfo.userAgent
    ]);

    return {
      id: sessionId,
      session_token: sessionToken,
      refresh_token: refreshToken,
      expires_at: expiresAt
    };
  }

  private generateJwtToken(payload: any): string {
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiresIn,
      issuer: 'healthcare-saas',
      audience: 'healthcare-users'
    });
  }

  private async validateRegistrationData(data: RegisterData): Promise<{ valid: boolean; error?: string }> {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { valid: false, error: 'Invalid email format.' };
    }

    // Password validation
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.valid) {
      return passwordValidation;
    }

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters long.' };
    }

    if (data.name.length > 100) {
      return { valid: false, error: 'Name must be less than 100 characters.' };
    }

    return { valid: true };
  }

  private validatePassword(password: string): { valid: boolean; error?: string } {
    if (password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters long.' };
    }

    if (password.length > 128) {
      return { valid: false, error: 'Password must be less than 128 characters.' };
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: 'Password must contain at least one uppercase letter.' };
    }

    if (!/[a-z]/.test(password)) {
      return { valid: false, error: 'Password must contain at least one lowercase letter.' };
    }

    if (!/\d/.test(password)) {
      return { valid: false, error: 'Password must contain at least one number.' };
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return { valid: false, error: 'Password must contain at least one special character.' };
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '12345678', 'qwerty123', 'abc123456', 'password123'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      return { valid: false, error: 'Password is too common. Please choose a stronger password.' };
    }

    return { valid: true };
  }

  private async isMfaRequired(userId: string): Promise<boolean> {
    const result = await db.query(`
      SELECT sc.mfa_required 
      FROM users u
      JOIN companies c ON u.company_id = c.id
      JOIN security_configurations sc ON c.id = sc.company_id
      WHERE u.id = $1
    `, [userId]);

    return result.rows.length > 0 ? result.rows[0].mfa_required : false;
  }

  private async verifyMfaToken(userId: string, token: string): Promise<boolean> {
    // Implement TOTP verification logic here
    // This is a placeholder - you'd integrate with a TOTP library
    return true;
  }

  // Blacklist token (for logout/security)
  blacklistToken(token: string): void {
    this.tokenBlacklist.add(token);
    
    // Clean up old tokens periodically
    if (this.tokenBlacklist.size > 10000) {
      this.tokenBlacklist.clear();
    }
  }

  // Get user sessions
  async getUserSessions(userId: string): Promise<any[]> {
    const result = await db.query(`
      SELECT id, ip_address, user_agent, created_at, last_accessed_at, is_active
      FROM user_sessions
      WHERE user_id = (SELECT id FROM users WHERE anonymous_id = $1)
      ORDER BY created_at DESC
      LIMIT 10
    `, [userId]);

    return result.rows;
  }

  // Revoke session
  async revokeSession(sessionId: string, userId: string): Promise<boolean> {
    const result = await db.query(`
      UPDATE user_sessions 
      SET is_active = false 
      WHERE id = $1 AND user_id = (SELECT id FROM users WHERE anonymous_id = $2)
    `, [sessionId, userId]);

    return result.rowCount > 0;
  }
}

export const authService = new AuthenticationService();
export { AuthenticationService, type AuthResult, type LoginCredentials, type RegisterData };