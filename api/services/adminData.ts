// Administrative Data Service
// Comprehensive CRUD operations for users, companies, and system administration

import { db } from '../db/connection';
import { auditLogger } from './audit';
import { emailService } from './email';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface Company {
  id?: string;
  name: string;
  domain?: string;
  subscriptionTier?: string;
  maxUsers?: number;
  settings?: Record<string, any>;
  isActive?: boolean;
}

interface User {
  id?: string;
  companyId: string;
  email: string;
  name: string;
  department?: string;
  role?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}

interface UserInvite {
  email: string;
  companyId: string;
  role?: string;
  department?: string;
  invitedBy: string;
  message?: string;
}

interface SecurityConfiguration {
  companyId: string;
  passwordMinLength?: number;
  passwordRequireUppercase?: boolean;
  passwordRequireLowercase?: boolean;
  passwordRequireNumbers?: boolean;
  passwordRequireSymbols?: boolean;
  passwordMaxAgeDays?: number;
  mfaRequired?: boolean;
  sessionTimeoutMinutes?: number;
  maxConcurrentSessions?: number;
  maxFailedAttempts?: number;
  lockoutDurationMinutes?: number;
  allowedIpRanges?: string[];
  geoRestrictions?: string[];
}

interface ApiKey {
  id?: string;
  companyId: string;
  name: string;
  permissions: string[];
  expiresAt?: Date;
  isActive?: boolean;
}

class AdminDataService {
  // Company Management
  async createCompany(companyData: Company, actorId: string): Promise<string> {
    const transaction = await db.beginTransaction();
    
    try {
      const companyId = uuidv4();

      await transaction.query(`
        INSERT INTO companies (
          id, name, domain, subscription_tier, max_users, settings, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        companyId,
        companyData.name,
        companyData.domain,
        companyData.subscriptionTier || 'basic',
        companyData.maxUsers || 100,
        JSON.stringify(companyData.settings || {}),
        companyData.isActive !== false
      ]);

      // Create default security configuration
      await transaction.query(`
        INSERT INTO security_configurations (
          company_id, password_min_length, password_require_uppercase,
          password_require_lowercase, password_require_numbers,
          password_require_symbols, mfa_required, session_timeout_minutes,
          max_concurrent_sessions, max_failed_attempts, lockout_duration_minutes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        companyId, 8, true, true, true, true, false, 480, 3, 5, 30
      ]);

      await transaction.commit();

      await auditLogger.log(
        'company_created',
        actorId,
        '127.0.0.1',
        { companyName: companyData.name, domain: companyData.domain },
        true,
        {
          entityType: 'company',
          entityId: companyId,
          complianceTags: ['COMPANY_MANAGEMENT']
        }
      );

      return companyId;

    } catch (error) {
      await transaction.rollback();
      console.error('Create company error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  async updateCompany(companyId: string, updateData: Partial<Company>, actorId: string): Promise<boolean> {
    const transaction = await db.beginTransaction();
    
    try {
      // Get current company data for audit trail
      const currentResult = await transaction.query(
        'SELECT * FROM companies WHERE id = $1',
        [companyId]
      );

      if (currentResult.rows.length === 0) {
        return false;
      }

      const currentData = currentResult.rows[0];

      // Build dynamic update query
      const updateFields: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (updateData.name !== undefined) {
        updateFields.push(`name = $${paramIndex}`);
        params.push(updateData.name);
        paramIndex++;
      }

      if (updateData.domain !== undefined) {
        updateFields.push(`domain = $${paramIndex}`);
        params.push(updateData.domain);
        paramIndex++;
      }

      if (updateData.subscriptionTier !== undefined) {
        updateFields.push(`subscription_tier = $${paramIndex}`);
        params.push(updateData.subscriptionTier);
        paramIndex++;
      }

      if (updateData.maxUsers !== undefined) {
        updateFields.push(`max_users = $${paramIndex}`);
        params.push(updateData.maxUsers);
        paramIndex++;
      }

      if (updateData.settings !== undefined) {
        updateFields.push(`settings = $${paramIndex}`);
        params.push(JSON.stringify(updateData.settings));
        paramIndex++;
      }

      if (updateData.isActive !== undefined) {
        updateFields.push(`is_active = $${paramIndex}`);
        params.push(updateData.isActive);
        paramIndex++;
      }

      if (updateFields.length === 0) {
        return false;
      }

      updateFields.push(`updated_at = NOW()`);
      params.push(companyId);

      await transaction.query(`
        UPDATE companies 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
      `, params);

      await transaction.commit();

      await auditLogger.log(
        'company_updated',
        actorId,
        '127.0.0.1',
        { changedFields: Object.keys(updateData) },
        true,
        {
          entityType: 'company',
          entityId: companyId,
          oldValues: currentData,
          newValues: updateData,
          complianceTags: ['COMPANY_MANAGEMENT']
        }
      );

      return true;

    } catch (error) {
      await transaction.rollback();
      console.error('Update company error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  async getCompany(companyId: string, actorId: string): Promise<Company | null> {
    try {
      const result = await db.query(`
        SELECT 
          id, name, domain, subscription_tier, max_users,
          settings, is_active, created_at, updated_at
        FROM companies
        WHERE id = $1
      `, [companyId]);

      if (result.rows.length === 0) {
        return null;
      }

      const company = result.rows[0];

      await auditLogger.logDataAccess(
        actorId,
        'company',
        companyId,
        'read',
        '127.0.0.1'
      );

      return {
        id: company.id,
        name: company.name,
        domain: company.domain,
        subscriptionTier: company.subscription_tier,
        maxUsers: company.max_users,
        settings: company.settings,
        isActive: company.is_active
      };

    } catch (error) {
      console.error('Get company error:', error);
      throw error;
    }
  }

  async getCompanies(filters: {
    isActive?: boolean;
    subscriptionTier?: string;
    limit?: number;
    offset?: number;
  }, actorId: string): Promise<{ companies: Company[]; total: number }> {
    try {
      let query = `
        SELECT 
          id, name, domain, subscription_tier, max_users,
          settings, is_active, created_at, updated_at
        FROM companies
        WHERE 1=1
      `;

      let countQuery = 'SELECT COUNT(*) as total FROM companies WHERE 1=1';
      
      const params: any[] = [];
      let paramIndex = 1;

      if (filters.isActive !== undefined) {
        query += ` AND is_active = $${paramIndex}`;
        countQuery += ` AND is_active = $${paramIndex}`;
        params.push(filters.isActive);
        paramIndex++;
      }

      if (filters.subscriptionTier) {
        query += ` AND subscription_tier = $${paramIndex}`;
        countQuery += ` AND subscription_tier = $${paramIndex}`;
        params.push(filters.subscriptionTier);
        paramIndex++;
      }

      query += ' ORDER BY created_at DESC';

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

      const [companiesResult, countResult] = await Promise.all([
        db.query(query, params.slice(0, paramIndex - (filters.offset ? 2 : 1))),
        db.query(countQuery, params.slice(0, paramIndex - (filters.limit ? (filters.offset ? 2 : 1) : 0)))
      ]);

      const companies = companiesResult.rows.map(company => ({
        id: company.id,
        name: company.name,
        domain: company.domain,
        subscriptionTier: company.subscription_tier,
        maxUsers: company.max_users,
        settings: company.settings,
        isActive: company.is_active
      }));

      await auditLogger.logDataAccess(
        actorId,
        'companies',
        'bulk',
        'read',
        '127.0.0.1',
        undefined,
        { count: companies.length, filters }
      );

      return {
        companies,
        total: parseInt(countResult.rows[0].total)
      };

    } catch (error) {
      console.error('Get companies error:', error);
      throw error;
    }
  }

  // User Management
  async getUsers(companyId: string, filters: {
    role?: string;
    isActive?: boolean;
    emailVerified?: boolean;
    limit?: number;
    offset?: number;
  }, actorId: string): Promise<{ users: User[]; total: number }> {
    try {
      let query = `
        SELECT 
          u.anonymous_id as id, u.company_id, u.role, u.is_active,
          u.email_verified, u.last_login, u.created_at,
          u.encrypted_name, u.encrypted_email, u.encrypted_department
        FROM users u
        WHERE u.company_id = $1
      `;

      let countQuery = 'SELECT COUNT(*) as total FROM users u WHERE u.company_id = $1';
      
      const params: any[] = [companyId];
      let paramIndex = 2;

      if (filters.role) {
        query += ` AND u.role = $${paramIndex}`;
        countQuery += ` AND u.role = $${paramIndex}`;
        params.push(filters.role);
        paramIndex++;
      }

      if (filters.isActive !== undefined) {
        query += ` AND u.is_active = $${paramIndex}`;
        countQuery += ` AND u.is_active = $${paramIndex}`;
        params.push(filters.isActive);
        paramIndex++;
      }

      if (filters.emailVerified !== undefined) {
        query += ` AND u.email_verified = $${paramIndex}`;
        countQuery += ` AND u.email_verified = $${paramIndex}`;
        params.push(filters.emailVerified);
        paramIndex++;
      }

      query += ' ORDER BY u.created_at DESC';

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

      const [usersResult, countResult] = await Promise.all([
        db.query(query, params.slice(0, paramIndex - (filters.offset ? 2 : 1))),
        db.query(countQuery, params.slice(0, paramIndex - (filters.limit ? (filters.offset ? 2 : 1) : 0)))
      ]);

      // Decrypt user data
      const users = usersResult.rows.map(user => {
        let name = '';
        let email = '';
        let department = '';

        if (user.encrypted_name) {
          const nameData = JSON.parse(user.encrypted_name);
          name = db.decryptData(nameData.encrypted, nameData.iv, nameData.tag, companyId);
        }

        if (user.encrypted_email) {
          const emailData = JSON.parse(user.encrypted_email);
          email = db.decryptData(emailData.encrypted, emailData.iv, emailData.tag, companyId);
        }

        if (user.encrypted_department) {
          const deptData = JSON.parse(user.encrypted_department);
          department = db.decryptData(deptData.encrypted, deptData.iv, deptData.tag, companyId);
        }

        return {
          id: user.id,
          companyId: user.company_id,
          email,
          name,
          department,
          role: user.role,
          isActive: user.is_active,
          emailVerified: user.email_verified,
          lastLogin: user.last_login,
          createdAt: user.created_at
        };
      });

      await auditLogger.logDataAccess(
        actorId,
        'users',
        'bulk',
        'read',
        '127.0.0.1',
        undefined,
        { companyId, count: users.length, filters }
      );

      return {
        users,
        total: parseInt(countResult.rows[0].total)
      };

    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updateData: Partial<User>, actorId: string): Promise<boolean> {
    const transaction = await db.beginTransaction();
    
    try {
      // Get current user data
      const currentResult = await transaction.query(`
        SELECT u.*, c.id as company_id
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        WHERE u.anonymous_id = $1
      `, [userId]);

      if (currentResult.rows.length === 0) {
        return false;
      }

      const currentUser = currentResult.rows[0];
      const companyId = currentUser.company_id;

      // Build dynamic update query
      const updateFields: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (updateData.role !== undefined) {
        updateFields.push(`role = $${paramIndex}`);
        params.push(updateData.role);
        paramIndex++;
      }

      if (updateData.isActive !== undefined) {
        updateFields.push(`is_active = $${paramIndex}`);
        params.push(updateData.isActive);
        paramIndex++;
      }

      if (updateData.name !== undefined) {
        const encryptedName = db.encryptData(updateData.name, companyId);
        updateFields.push(`encrypted_name = $${paramIndex}`);
        params.push(JSON.stringify(encryptedName));
        paramIndex++;
      }

      if (updateData.department !== undefined) {
        const encryptedDepartment = db.encryptData(updateData.department, companyId);
        updateFields.push(`encrypted_department = $${paramIndex}`);
        params.push(JSON.stringify(encryptedDepartment));
        paramIndex++;
      }

      if (updateFields.length === 0) {
        return false;
      }

      updateFields.push(`updated_at = NOW()`);
      params.push(userId);

      await transaction.query(`
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE anonymous_id = $${paramIndex}
      `, params);

      await transaction.commit();

      await auditLogger.log(
        'user_updated',
        actorId,
        '127.0.0.1',
        { 
          targetUserId: userId,
          changedFields: Object.keys(updateData).filter(key => key !== 'name' && key !== 'department')
        },
        true,
        {
          entityType: 'user',
          entityId: userId,
          complianceTags: ['USER_MANAGEMENT']
        }
      );

      return true;

    } catch (error) {
      await transaction.rollback();
      console.error('Update user error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  // User Invitation System
  async inviteUser(inviteData: UserInvite, actorId: string): Promise<string> {
    const transaction = await db.beginTransaction();
    
    try {
      // Check if user already exists
      const emailHash = db.hashIdentifier(inviteData.email);
      const existingUser = await transaction.query(
        'SELECT id FROM users WHERE email_hash = $1',
        [emailHash]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Check company user limit
      const companyResult = await transaction.query(
        'SELECT max_users FROM companies WHERE id = $1',
        [inviteData.companyId]
      );

      if (companyResult.rows.length === 0) {
        throw new Error('Company not found');
      }

      const maxUsers = companyResult.rows[0].max_users;
      const currentUserCount = await transaction.query(
        'SELECT COUNT(*) as count FROM users WHERE company_id = $1 AND is_active = true',
        [inviteData.companyId]
      );

      if (parseInt(currentUserCount.rows[0].count) >= maxUsers) {
        throw new Error('Company has reached maximum user limit');
      }

      // Generate invite token
      const inviteToken = crypto.randomBytes(32).toString('hex');
      const inviteId = uuidv4();

      // Store invite
      await transaction.query(`
        INSERT INTO user_invites (
          id, company_id, email, role, department, invited_by,
          invite_token, expires_at, message
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL '7 days', $8)
      `, [
        inviteId, inviteData.companyId, inviteData.email,
        inviteData.role || 'user', inviteData.department,
        inviteData.invitedBy, inviteToken, inviteData.message
      ]);

      await transaction.commit();

      // Send invitation email
      try {
        const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite?token=${inviteToken}`;
        await emailService.sendEmail({
          to: inviteData.email,
          subject: 'You\'re invited to join Healthcare SaaS',
          html: `
            <h2>You're invited to join Healthcare SaaS!</h2>
            <p>You have been invited to join our healthcare data management platform.</p>
            <p><a href="${inviteUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Invitation</a></p>
            <p>This invitation expires in 7 days.</p>
            ${inviteData.message ? `<p><strong>Personal message:</strong> ${inviteData.message}</p>` : ''}
          `,
          text: `
            You're invited to join Healthcare SaaS!
            
            You have been invited to join our healthcare data management platform.
            
            Click this link to accept: ${inviteUrl}
            
            This invitation expires in 7 days.
            
            ${inviteData.message ? `Personal message: ${inviteData.message}` : ''}
          `
        });
      } catch (emailError) {
        console.error('Failed to send invitation email:', emailError);
      }

      await auditLogger.log(
        'user_invited',
        actorId,
        '127.0.0.1',
        {
          invitedEmail: inviteData.email,
          companyId: inviteData.companyId,
          role: inviteData.role
        },
        true,
        {
          entityType: 'user_invite',
          entityId: inviteId,
          complianceTags: ['USER_MANAGEMENT']
        }
      );

      return inviteToken;

    } catch (error) {
      await transaction.rollback();
      console.error('Invite user error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  // Security Configuration Management
  async updateSecurityConfiguration(companyId: string, config: SecurityConfiguration, actorId: string): Promise<boolean> {
    const transaction = await db.beginTransaction();
    
    try {
      // Get current configuration for audit trail
      const currentResult = await transaction.query(
        'SELECT * FROM security_configurations WHERE company_id = $1',
        [companyId]
      );

      const currentConfig = currentResult.rows[0];

      // Update security configuration
      await transaction.query(`
        UPDATE security_configurations SET
          password_min_length = COALESCE($2, password_min_length),
          password_require_uppercase = COALESCE($3, password_require_uppercase),
          password_require_lowercase = COALESCE($4, password_require_lowercase),
          password_require_numbers = COALESCE($5, password_require_numbers),
          password_require_symbols = COALESCE($6, password_require_symbols),
          password_max_age_days = COALESCE($7, password_max_age_days),
          mfa_required = COALESCE($8, mfa_required),
          session_timeout_minutes = COALESCE($9, session_timeout_minutes),
          max_concurrent_sessions = COALESCE($10, max_concurrent_sessions),
          max_failed_attempts = COALESCE($11, max_failed_attempts),
          lockout_duration_minutes = COALESCE($12, lockout_duration_minutes),
          allowed_ip_ranges = COALESCE($13, allowed_ip_ranges),
          geo_restrictions = COALESCE($14, geo_restrictions),
          updated_at = NOW()
        WHERE company_id = $1
      `, [
        companyId,
        config.passwordMinLength,
        config.passwordRequireUppercase,
        config.passwordRequireLowercase,
        config.passwordRequireNumbers,
        config.passwordRequireSymbols,
        config.passwordMaxAgeDays,
        config.mfaRequired,
        config.sessionTimeoutMinutes,
        config.maxConcurrentSessions,
        config.maxFailedAttempts,
        config.lockoutDurationMinutes,
        config.allowedIpRanges,
        config.geoRestrictions
      ]);

      await transaction.commit();

      await auditLogger.log(
        'security_config_updated',
        actorId,
        '127.0.0.1',
        { companyId, changedFields: Object.keys(config) },
        true,
        {
          entityType: 'security_configuration',
          entityId: companyId,
          oldValues: currentConfig,
          newValues: config,
          complianceTags: ['SECURITY_CONFIGURATION']
        }
      );

      return true;

    } catch (error) {
      await transaction.rollback();
      console.error('Update security configuration error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  async getSecurityConfiguration(companyId: string, actorId: string): Promise<SecurityConfiguration | null> {
    try {
      const result = await db.query(`
        SELECT * FROM security_configurations WHERE company_id = $1
      `, [companyId]);

      if (result.rows.length === 0) {
        return null;
      }

      const config = result.rows[0];

      await auditLogger.logDataAccess(
        actorId,
        'security_configuration',
        companyId,
        'read',
        '127.0.0.1'
      );

      return {
        companyId: config.company_id,
        passwordMinLength: config.password_min_length,
        passwordRequireUppercase: config.password_require_uppercase,
        passwordRequireLowercase: config.password_require_lowercase,
        passwordRequireNumbers: config.password_require_numbers,
        passwordRequireSymbols: config.password_require_symbols,
        passwordMaxAgeDays: config.password_max_age_days,
        mfaRequired: config.mfa_required,
        sessionTimeoutMinutes: config.session_timeout_minutes,
        maxConcurrentSessions: config.max_concurrent_sessions,
        maxFailedAttempts: config.max_failed_attempts,
        lockoutDurationMinutes: config.lockout_duration_minutes,
        allowedIpRanges: config.allowed_ip_ranges,
        geoRestrictions: config.geo_restrictions
      };

    } catch (error) {
      console.error('Get security configuration error:', error);
      throw error;
    }
  }

  // API Key Management
  async createApiKey(apiKeyData: ApiKey, actorId: string): Promise<{ id: string; key: string }> {
    const transaction = await db.beginTransaction();
    
    try {
      const apiKeyId = uuidv4();
      const apiKey = crypto.randomBytes(32).toString('hex');
      const keyHash = db.hashIdentifier(apiKey);

      await transaction.query(`
        INSERT INTO api_keys (
          id, company_id, name, key_hash, permissions, expires_at, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        apiKeyId,
        apiKeyData.companyId,
        apiKeyData.name,
        keyHash,
        JSON.stringify(apiKeyData.permissions),
        apiKeyData.expiresAt,
        apiKeyData.isActive !== false
      ]);

      await transaction.commit();

      await auditLogger.log(
        'api_key_created',
        actorId,
        '127.0.0.1',
        {
          apiKeyName: apiKeyData.name,
          companyId: apiKeyData.companyId,
          permissions: apiKeyData.permissions
        },
        true,
        {
          entityType: 'api_key',
          entityId: apiKeyId,
          complianceTags: ['API_KEY_MANAGEMENT']
        }
      );

      return { id: apiKeyId, key: apiKey };

    } catch (error) {
      await transaction.rollback();
      console.error('Create API key error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  async getApiKeys(companyId: string, actorId: string): Promise<ApiKey[]> {
    try {
      const result = await db.query(`
        SELECT 
          id, company_id, name, permissions, last_used_at,
          expires_at, is_active, created_at
        FROM api_keys
        WHERE company_id = $1
        ORDER BY created_at DESC
      `, [companyId]);

      const apiKeys = result.rows.map(key => ({
        id: key.id,
        companyId: key.company_id,
        name: key.name,
        permissions: key.permissions,
        expiresAt: key.expires_at,
        isActive: key.is_active
      }));

      await auditLogger.logDataAccess(
        actorId,
        'api_keys',
        'bulk',
        'read',
        '127.0.0.1',
        undefined,
        { companyId, count: apiKeys.length }
      );

      return apiKeys;

    } catch (error) {
      console.error('Get API keys error:', error);
      throw error;
    }
  }

  async revokeApiKey(apiKeyId: string, actorId: string): Promise<boolean> {
    try {
      const result = await db.query(`
        UPDATE api_keys 
        SET is_active = false, updated_at = NOW()
        WHERE id = $1
      `, [apiKeyId]);

      if (result.rowCount === 0) {
        return false;
      }

      await auditLogger.log(
        'api_key_revoked',
        actorId,
        '127.0.0.1',
        { apiKeyId },
        true,
        {
          entityType: 'api_key',
          entityId: apiKeyId,
          complianceTags: ['API_KEY_MANAGEMENT']
        }
      );

      return true;

    } catch (error) {
      console.error('Revoke API key error:', error);
      throw error;
    }
  }

  // System Analytics
  async getSystemAnalytics(filters: {
    startDate?: Date;
    endDate?: Date;
    companyId?: string;
  }, actorId: string): Promise<any> {
    try {
      const analytics = {
        userStats: {},
        healthDataStats: {},
        securityEvents: {},
        systemHealth: {}
      };

      // User statistics
      const userStats = await db.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE is_active = true) as active_users,
          COUNT(*) FILTER (WHERE email_verified = true) as verified_users,
          COUNT(*) FILTER (WHERE created_at >= $1) as new_users_period
        FROM users u
        ${filters.companyId ? 'WHERE u.company_id = $2' : ''}
      `, filters.companyId ? [filters.startDate || new Date(Date.now() - 30*24*60*60*1000), filters.companyId] : [filters.startDate || new Date(Date.now() - 30*24*60*60*1000)]);

      analytics.userStats = userStats.rows[0];

      // Health data statistics
      const healthDataStats = await db.query(`
        SELECT 
          COUNT(*) as total_entries,
          COUNT(DISTINCT user_id) as users_with_data,
          entry_type,
          COUNT(*) as entries_by_type
        FROM health_data_entries hde
        ${filters.companyId ? 'JOIN users u ON hde.user_id = u.id WHERE u.company_id = $1' : 'WHERE 1=1'}
        ${filters.startDate ? (filters.companyId ? 'AND' : 'WHERE') + ' hde.created_at >= $' + (filters.companyId ? '2' : '1') : ''}
        GROUP BY entry_type
      `, filters.companyId && filters.startDate ? [filters.companyId, filters.startDate] : 
         filters.companyId ? [filters.companyId] : 
         filters.startDate ? [filters.startDate] : []);

      analytics.healthDataStats = healthDataStats.rows;

      // Security events
      const securityEvents = await db.query(`
        SELECT 
          event_type,
          severity,
          COUNT(*) as count
        FROM security_events
        WHERE occurred_at >= $1
        ${filters.endDate ? 'AND occurred_at <= $2' : ''}
        GROUP BY event_type, severity
        ORDER BY count DESC
      `, filters.endDate ? [filters.startDate || new Date(Date.now() - 30*24*60*60*1000), filters.endDate] 
                          : [filters.startDate || new Date(Date.now() - 30*24*60*60*1000)]);

      analytics.securityEvents = securityEvents.rows;

      await auditLogger.logDataAccess(
        actorId,
        'system_analytics',
        'aggregate',
        'read',
        '127.0.0.1',
        undefined,
        { filters }
      );

      return analytics;

    } catch (error) {
      console.error('Get system analytics error:', error);
      throw error;
    }
  }

  // Batch Operations
  async batchUpdateUsers(updates: Array<{ userId: string; updateData: Partial<User> }>, actorId: string): Promise<{ successful: number; failed: number; errors: any[] }> {
    const results = { successful: 0, failed: 0, errors: [] as any[] };

    for (const update of updates) {
      try {
        const success = await this.updateUser(update.userId, update.updateData, actorId);
        if (success) {
          results.successful++;
        } else {
          results.failed++;
          results.errors.push({ userId: update.userId, error: 'User not found' });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({ userId: update.userId, error: error.message });
      }
    }

    await auditLogger.log(
      'batch_user_update',
      actorId,
      '127.0.0.1',
      { totalUpdates: updates.length, successful: results.successful, failed: results.failed },
      true,
      {
        entityType: 'user_batch',
        complianceTags: ['BATCH_OPERATIONS']
      }
    );

    return results;
  }

  // Data Export for Compliance
  async exportCompanyData(companyId: string, exportType: 'users' | 'health_data' | 'all', actorId: string): Promise<{ data: any; filename: string }> {
    try {
      let data: any = {};

      if (exportType === 'users' || exportType === 'all') {
        const users = await this.getUsers(companyId, {}, actorId);
        data.users = users.users;
      }

      if (exportType === 'health_data' || exportType === 'all') {
        // This would require integration with healthDataService
        // data.healthData = await healthDataService.getCompanyHealthData(companyId, actorId);
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `company-data-export-${companyId}-${timestamp}.json`;

      await auditLogger.log(
        'data_export',
        actorId,
        '127.0.0.1',
        { companyId, exportType },
        true,
        {
          entityType: 'data_export',
          entityId: companyId,
          complianceTags: ['DATA_EXPORT', 'GDPR_COMPLIANCE']
        }
      );

      return {
        data: JSON.stringify(data, null, 2),
        filename
      };

    } catch (error) {
      console.error('Export company data error:', error);
      throw error;
    }
  }
}

export const adminDataService = new AdminDataService();
export { AdminDataService, type Company, type User, type UserInvite, type SecurityConfiguration, type ApiKey };