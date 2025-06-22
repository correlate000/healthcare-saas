// Authentication API Routes
import { Request, Response, NextFunction } from 'express'
import { db } from '../db/connection'
import { EnterpriseSSOService } from '../../lib/auth/enterprise-sso'
import { AnonymizationGateway } from '../../lib/security/anonymization-gateway'
import { randomBytes } from 'crypto'

const ssoService = new EnterpriseSSOService(process.env.JWT_SECRET!)
const anonymizationGateway = new AnonymizationGateway({
  saltRounds: 12,
  encryptionAlgorithm: 'aes-256-gcm',
  keyDerivationIterations: 100000,
  tokenExpiration: 86400, // 24 hours
  dataRetentionDays: 365,
  complianceLevel: 'enterprise'
}, process.env.MASTER_ENCRYPTION_KEY!)

// SSO Login Initiation
export async function initiateSSOLogin(req: Request, res: Response): Promise<void> {
  try {
    const { domain, returnUrl } = req.body

    // Find company by domain
    const result = await db.query(`
      SELECT id, name, domain, settings FROM companies 
      WHERE domain = $1 AND is_active = true
    `, [domain])

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Company not found' })
      return
    }

    const company = result.rows[0]

    // Get active SSO providers for company
    const providersResult = await db.query(`
      SELECT id, name, provider_type, config, status
      FROM sso_providers 
      WHERE company_id = $1 AND status = 'active'
      ORDER BY name
    `, [company.id])

    if (providersResult.rows.length === 0) {
      res.status(400).json({ error: 'No SSO providers configured' })
      return
    }

    // For now, use the first available provider
    const provider = providersResult.rows[0]
    
    // Generate SSO login URL
    const loginUrl = await ssoService.generateSSOLoginURL(
      company.id, 
      provider.id, 
      returnUrl
    )

    await db.logPrivacyAction({
      action: 'sso_initiate',
      anonymousUserId: 'anonymous',
      dataType: 'authentication',
      success: true,
      complianceFlags: ['SSO_LOGIN_ATTEMPT'],
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    res.json({
      loginUrl,
      provider: {
        id: provider.id,
        name: provider.name,
        type: provider.provider_type
      }
    })

  } catch (error) {
    console.error('SSO initiation failed:', error)
    res.status(500).json({ error: 'Authentication service temporarily unavailable' })
  }
}

// SSO Callback Handler
export async function handleSSOCallback(req: Request, res: Response): Promise<void> {
  try {
    const { providerId } = req.params
    const { code, state, SAMLResponse } = req.body

    // Determine auth data based on SSO type
    const authData = SAMLResponse ? { assertion: SAMLResponse } : { code }

    // Process SSO callback
    const { user, token } = await ssoService.processSSOCallback(providerId, authData, state)

    // Create anonymized session
    const anonymousSession = await anonymizationGateway.createAnonymousSession(
      user.id,
      user.companyId,
      'pseudo-anonymous'
    )

    // Store session in database
    await db.query(`
      INSERT INTO anonymous_sessions (
        session_id, anonymous_id, real_user_id, company_id,
        access_level, permissions, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      anonymousSession.sessionId,
      anonymousSession.anonymousId,
      user.id,
      user.companyId,
      anonymousSession.context.accessLevel,
      JSON.stringify(anonymousSession.permissions),
      anonymousSession.expiresAt
    ])

    // Update user last login
    await db.query(`
      UPDATE users SET last_login = NOW() WHERE id = $1
    `, [user.id])

    // Log successful authentication
    await db.logPrivacyAction({
      action: 'sso_success',
      anonymousUserId: anonymousSession.anonymousId,
      dataType: 'authentication',
      success: true,
      complianceFlags: ['SSO_LOGIN_SUCCESS', 'SESSION_CREATED'],
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    // Set secure cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })

    res.json({
      success: true,
      user: {
        anonymousId: anonymousSession.anonymousId,
        name: user.name,
        role: user.role,
        companyId: user.companyId
      },
      sessionId: anonymousSession.sessionId
    })

  } catch (error) {
    console.error('SSO callback failed:', error)
    
    await db.logPrivacyAction({
      action: 'sso_failure',
      anonymousUserId: 'unknown',
      dataType: 'authentication',
      success: false,
      complianceFlags: ['SSO_LOGIN_FAILURE'],
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    res.status(401).json({ error: 'Authentication failed' })
  }
}

// Anonymous Login (for demo/trial mode)
export async function anonymousLogin(req: Request, res: Response): Promise<void> {
  try {
    const { companyDomain } = req.body

    // Find company
    const result = await db.query(`
      SELECT id, name, domain, settings FROM companies 
      WHERE domain = $1 AND is_active = true
    `, [companyDomain])

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Company not found' })
      return
    }

    const company = result.rows[0]

    // Check if anonymous mode is allowed
    if (!company.settings.allowAnonymousMode) {
      res.status(403).json({ error: 'Anonymous access not permitted' })
      return
    }

    // Create anonymous user session
    const anonymousId = randomBytes(16).toString('hex')
    const sessionId = randomBytes(32).toString('hex')

    const anonymousSession = await anonymizationGateway.createAnonymousSession(
      anonymousId,
      company.id,
      'anonymous'
    )

    // Store anonymous session
    await db.query(`
      INSERT INTO anonymous_sessions (
        session_id, anonymous_id, company_id,
        access_level, permissions, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      sessionId,
      anonymousSession.anonymousId,
      company.id,
      'anonymous',
      JSON.stringify(anonymousSession.permissions),
      anonymousSession.expiresAt
    ])

    // Generate anonymous token
    const token = await ssoService.generateJWT({
      id: anonymousId,
      anonymousId: anonymousSession.anonymousId,
      role: 'user',
      companyId: company.id,
      isAnonymous: true
    } as any, company as any)

    await db.logPrivacyAction({
      action: 'anonymous_login',
      anonymousUserId: anonymousSession.anonymousId,
      dataType: 'authentication',
      success: true,
      complianceFlags: ['ANONYMOUS_ACCESS', 'PRIVACY_COMPLIANT'],
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    res.json({
      success: true,
      user: {
        anonymousId: anonymousSession.anonymousId,
        role: 'user',
        companyId: company.id,
        isAnonymous: true
      },
      sessionId,
      token
    })

  } catch (error) {
    console.error('Anonymous login failed:', error)
    res.status(500).json({ error: 'Login service temporarily unavailable' })
  }
}

// Session Verification Middleware
export async function verifySession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies.session_token || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      res.status(401).json({ error: 'No authentication token provided' })
      return
    }

    // Verify JWT token
    const payload = await ssoService.verifyToken(token)

    // Check if session exists in database
    const sessionResult = await db.query(`
      SELECT 
        s.session_id, s.anonymous_id, s.real_user_id, s.company_id,
        s.access_level, s.permissions, s.expires_at,
        c.name as company_name, c.settings as company_settings
      FROM anonymous_sessions s
      JOIN companies c ON s.company_id = c.id
      WHERE s.anonymous_id = $1 AND s.expires_at > NOW()
    `, [payload.anonymousId])

    if (sessionResult.rows.length === 0) {
      res.status(401).json({ error: 'Invalid or expired session' })
      return
    }

    const session = sessionResult.rows[0]

    // Update last activity
    await db.query(`
      UPDATE anonymous_sessions 
      SET last_activity = NOW() 
      WHERE session_id = $1
    `, [session.session_id])

    // Add session info to request
    req.user = {
      anonymousId: session.anonymous_id,
      realUserId: session.real_user_id,
      companyId: session.company_id,
      accessLevel: session.access_level,
      permissions: JSON.parse(session.permissions),
      companySettings: session.company_settings
    }

    next()

  } catch (error) {
    console.error('Session verification failed:', error)
    res.status(401).json({ error: 'Invalid authentication token' })
  }
}

// Logout
export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req

    if (user) {
      // Invalidate session in database
      await db.query(`
        DELETE FROM anonymous_sessions 
        WHERE anonymous_id = $1
      `, [user.anonymousId])

      // Log logout
      await db.logPrivacyAction({
        action: 'logout',
        anonymousUserId: user.anonymousId,
        dataType: 'authentication',
        success: true,
        complianceFlags: ['SESSION_TERMINATED'],
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      })
    }

    // Clear cookie
    res.clearCookie('session_token')

    res.json({ success: true, message: 'Logged out successfully' })

  } catch (error) {
    console.error('Logout failed:', error)
    res.status(500).json({ error: 'Logout failed' })
  }
}

// Get current user info
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    const { user } = req

    let userInfo: any = {
      anonymousId: user.anonymousId,
      companyId: user.companyId,
      accessLevel: user.accessLevel,
      permissions: user.permissions
    }

    // If not anonymous, get additional user details
    if (user.realUserId && user.accessLevel !== 'anonymous') {
      const userResult = await db.getUserByAnonymousId(user.anonymousId)
      
      if (userResult) {
        userInfo = {
          ...userInfo,
          name: userResult.name,
          department: userResult.department,
          role: userResult.role,
          lastLogin: userResult.last_login,
          isActive: userResult.is_active
        }
      }
    }

    res.json({ user: userInfo })

  } catch (error) {
    console.error('Get current user failed:', error)
    res.status(500).json({ error: 'Failed to retrieve user information' })
  }
}

// Company Registration (for admin setup)
export async function registerCompany(req: Request, res: Response): Promise<void> {
  try {
    const { name, domain, adminEmail, adminName, ssoConfig } = req.body

    // Check if company already exists
    const existingResult = await db.query(`
      SELECT id FROM companies WHERE domain = $1
    `, [domain])

    if (existingResult.rows.length > 0) {
      res.status(409).json({ error: 'Company with this domain already exists' })
      return
    }

    const transaction = await db.beginTransaction()

    try {
      // Create company
      const companyResult = await transaction.query(`
        INSERT INTO companies (name, domain, settings)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [
        name,
        domain,
        JSON.stringify({
          enforceSSO: !!ssoConfig,
          allowAnonymousMode: true,
          dataRetentionDays: 365,
          requireMFA: false,
          encryptionLevel: 'enterprise'
        })
      ])

      const companyId = companyResult.rows[0].id

      // Create admin user
      const { userId, anonymousId } = await db.createUser({
        companyId,
        email: adminEmail,
        name: adminName,
        role: 'admin'
      })

      // Configure SSO if provided
      if (ssoConfig) {
        await transaction.query(`
          INSERT INTO sso_providers (company_id, name, provider_type, config, status)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          companyId,
          ssoConfig.name,
          ssoConfig.type,
          JSON.stringify(ssoConfig.config),
          'active'
        ])
      }

      await transaction.commit()

      await db.logPrivacyAction({
        action: 'company_register',
        anonymousUserId: anonymousId,
        dataType: 'company_setup',
        success: true,
        complianceFlags: ['COMPANY_REGISTRATION', 'ADMIN_CREATED'],
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      })

      res.status(201).json({
        success: true,
        companyId,
        adminUserId: userId,
        message: 'Company registered successfully'
      })

    } catch (error) {
      await transaction.rollback()
      throw error
    } finally {
      await transaction.release()
    }

  } catch (error) {
    console.error('Company registration failed:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
}

// Extend user types for TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: {
        anonymousId: string
        realUserId?: string
        companyId: string
        accessLevel: string
        permissions: string[]
        companySettings: any
      }
    }
  }
}

export {
  initiateSSOLogin,
  handleSSOCallback,
  anonymousLogin,
  verifySession,
  logout,
  getCurrentUser,
  registerCompany
}