// Authentication Middleware
// Comprehensive middleware for JWT validation, session management, and authorization

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth';
import { rateLimit } from '../services/rateLimit';
import { auditLogger } from '../services/audit';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId: string;
        sessionId: string;
        role: string;
        companyId: string;
        permissions?: string[];
      };
      session?: {
        id: string;
        userId: string;
        isActive: boolean;
        expiresAt: Date;
        ipAddress: string;
        userAgent: string;
      };
      rateLimitInfo?: {
        remaining: number;
        resetTime: Date;
        blocked: boolean;
      };
    }
  }
}

interface AuthOptions {
  required?: boolean;
  roles?: string[];
  permissions?: string[];
  rateLimit?: {
    requests: number;
    windowSeconds: number;
  };
  ipWhitelist?: string[];
  requireEmailVerification?: boolean;
  requireMFA?: boolean;
}

// Main authentication middleware
export function authenticate(options: AuthOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req);
      const clientInfo = getClientInfo(req);

      // Rate limiting check
      if (options.rateLimit) {
        const rateLimitCheck = await rateLimit.checkAdvanced(
          `auth:${clientInfo.ip}`,
          options.rateLimit.requests,
          options.rateLimit.windowSeconds
        );

        req.rateLimitInfo = {
          remaining: rateLimitCheck.remaining,
          resetTime: rateLimitCheck.resetTime,
          blocked: !rateLimitCheck.allowed
        };

        // Set rate limit headers
        res.set({
          'X-RateLimit-Limit': options.rateLimit.requests.toString(),
          'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimitCheck.resetTime.getTime() / 1000).toString()
        });

        if (!rateLimitCheck.allowed) {
          await auditLogger.logSecurityEvent({
            eventType: 'rate_limit_exceeded',
            severity: 'warning',
            ipAddress: clientInfo.ip,
            userAgent: clientInfo.userAgent,
            details: {
              endpoint: req.path,
              limit: options.rateLimit.requests,
              window: options.rateLimit.windowSeconds
            },
            success: false
          });

          return res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil((rateLimitCheck.resetTime.getTime() - Date.now()) / 1000)
          });
        }
      }

      // IP whitelist check
      if (options.ipWhitelist && !options.ipWhitelist.includes(clientInfo.ip)) {
        await auditLogger.logSecurityEvent({
          eventType: 'ip_not_whitelisted',
          severity: 'warning',
          ipAddress: clientInfo.ip,
          details: { endpoint: req.path, whitelistedIPs: options.ipWhitelist },
          success: false
        });

        return res.status(403).json({ error: 'Access denied from this IP address' });
      }

      // If no token provided
      if (!token) {
        if (options.required !== false) {
          return res.status(401).json({ error: 'Authentication token required' });
        }
        return next();
      }

      // Validate token
      const validation = await authService.validateToken(token);
      
      if (!validation.valid) {
        await auditLogger.logSecurityEvent({
          eventType: 'invalid_token',
          severity: 'warning',
          ipAddress: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          details: { error: validation.error, endpoint: req.path },
          success: false
        });

        return res.status(401).json({ error: validation.error || 'Invalid token' });
      }

      const { payload } = validation;
      const sessionData = payload.sessionData;

      // Set user context
      req.user = {
        id: payload.userId,
        userId: payload.userId,
        sessionId: payload.sessionId,
        role: payload.role,
        companyId: payload.companyId,
        permissions: await getUserPermissions(payload.userId, payload.role)
      };

      req.session = {
        id: sessionData.id,
        userId: sessionData.user_id,
        isActive: sessionData.is_active,
        expiresAt: new Date(sessionData.expires_at),
        ipAddress: sessionData.ip_address,
        userAgent: sessionData.user_agent
      };

      // Role-based access control
      if (options.roles && !options.roles.includes(req.user.role)) {
        await auditLogger.log(
          'access_denied_role',
          req.user.userId,
          clientInfo.ip,
          {
            requiredRoles: options.roles,
            userRole: req.user.role,
            endpoint: req.path
          },
          false
        );

        return res.status(403).json({ 
          error: 'Insufficient privileges',
          required: options.roles,
          current: req.user.role 
        });
      }

      // Permission-based access control
      if (options.permissions) {
        const userPermissions = req.user.permissions || [];
        const hasPermission = options.permissions.some(permission => 
          userPermissions.includes(permission)
        );

        if (!hasPermission) {
          await auditLogger.log(
            'access_denied_permission',
            req.user.userId,
            clientInfo.ip,
            {
              requiredPermissions: options.permissions,
              userPermissions,
              endpoint: req.path
            },
            false
          );

          return res.status(403).json({ 
            error: 'Insufficient permissions',
            required: options.permissions,
            current: userPermissions 
          });
        }
      }

      // Email verification check
      if (options.requireEmailVerification) {
        const emailVerified = await checkEmailVerification(req.user.userId);
        if (!emailVerified) {
          return res.status(403).json({ 
            error: 'Email verification required',
            code: 'EMAIL_NOT_VERIFIED'
          });
        }
      }

      // MFA check
      if (options.requireMFA) {
        const mfaVerified = await checkMFAStatus(req.user.userId, req.sessionId);
        if (!mfaVerified) {
          return res.status(403).json({ 
            error: 'Multi-factor authentication required',
            code: 'MFA_REQUIRED'
          });
        }
      }

      // Session IP validation (detect session hijacking)
      if (sessionData.ip_address && sessionData.ip_address !== clientInfo.ip) {
        await auditLogger.logSecurityEvent({
          eventType: 'session_ip_mismatch',
          severity: 'critical',
          userId: req.user.userId,
          sessionId: req.user.sessionId,
          ipAddress: clientInfo.ip,
          details: {
            originalIP: sessionData.ip_address,
            currentIP: clientInfo.ip,
            endpoint: req.path
          },
          success: false
        });

        // Optionally invalidate session on IP mismatch
        if (process.env.STRICT_IP_VALIDATION === 'true') {
          return res.status(401).json({ 
            error: 'Session security violation detected',
            code: 'IP_MISMATCH'
          });
        }
      }

      // Log successful authentication
      await auditLogger.log(
        'authenticated_request',
        req.user.userId,
        clientInfo.ip,
        {
          endpoint: req.path,
          method: req.method,
          userAgent: clientInfo.userAgent
        },
        true,
        {
          entityType: 'api_request',
          sessionId: req.user.sessionId
        }
      );

      next();

    } catch (error) {
      console.error('Authentication middleware error:', error);
      
      await auditLogger.logSecurityEvent({
        eventType: 'auth_middleware_error',
        severity: 'critical',
        ipAddress: getClientInfo(req).ip,
        details: { error: error.message, endpoint: req.path },
        success: false
      });

      res.status(500).json({ error: 'Authentication service error' });
    }
  };
}

// Optional authentication (sets user if token is valid, but doesn't require it)
export function optionalAuth() {
  return authenticate({ required: false });
}

// Require specific role
export function requireRole(...roles: string[]) {
  return authenticate({ roles });
}

// Require specific permissions
export function requirePermissions(...permissions: string[]) {
  return authenticate({ permissions });
}

// Admin only middleware
export function requireAdmin() {
  return authenticate({ roles: ['admin', 'super_admin'] });
}

// Company admin or higher
export function requireCompanyAdmin() {
  return authenticate({ roles: ['company_admin', 'admin', 'super_admin'] });
}

// API key authentication (for external integrations)
export function authenticateApiKey() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      const clientInfo = getClientInfo(req);

      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      // Rate limiting for API keys
      const rateLimitCheck = await rateLimit.check(`api_key:${apiKey}`, 1000, 3600);
      if (!rateLimitCheck) {
        return res.status(429).json({ error: 'API rate limit exceeded' });
      }

      // Validate API key
      const validation = await validateApiKey(apiKey);
      
      if (!validation.valid) {
        await auditLogger.logSecurityEvent({
          eventType: 'invalid_api_key',
          severity: 'warning',
          ipAddress: clientInfo.ip,
          details: { endpoint: req.path },
          success: false
        });

        return res.status(401).json({ error: 'Invalid API key' });
      }

      // Set API context
      req.user = {
        id: validation.keyData.id,
        userId: validation.keyData.id,
        sessionId: `api_key_${validation.keyData.id}`,
        role: 'api',
        companyId: validation.keyData.companyId,
        permissions: validation.keyData.permissions
      };

      // Log API access
      await auditLogger.logApiAccess(
        req.path,
        req.method,
        200,
        undefined,
        validation.keyData.id,
        clientInfo.ip,
        0,
        { apiKeyName: validation.keyData.name }
      );

      next();

    } catch (error) {
      console.error('API key authentication error:', error);
      res.status(500).json({ error: 'API authentication service error' });
    }
  };
}

// Session-based authentication (for web app)
export function authenticateSession() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = req.cookies?.sessionToken || req.headers['x-session-token'];
      const clientInfo = getClientInfo(req);

      if (!sessionToken) {
        return res.status(401).json({ error: 'Session token required' });
      }

      // Validate session
      const validation = await validateSessionToken(sessionToken);
      
      if (!validation.valid) {
        return res.status(401).json({ error: validation.error || 'Invalid session' });
      }

      req.user = validation.user;
      req.session = validation.session;

      next();

    } catch (error) {
      console.error('Session authentication error:', error);
      res.status(500).json({ error: 'Session authentication service error' });
    }
  };
}

// CORS middleware with authentication context
export function corsWithAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',');
    
    // Allow requests from allowed origins
    if (allowedOrigins.includes(origin || '')) {
      res.setHeader('Access-Control-Allow-Origin', origin || '');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, X-Session-Token');
    res.setHeader('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  };
}

// Security headers middleware
export function securityHeaders() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    
    next();
  };
}

// Helper functions
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check for token in cookie
  return req.cookies?.authToken || null;
}

function getClientInfo(req: Request): { ip: string; userAgent: string } {
  return {
    ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress || 
        (req.connection as any).socket?.remoteAddress || 
        '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Unknown'
  };
}

async function getUserPermissions(userId: string, role: string): Promise<string[]> {
  // Basic role-based permissions
  const rolePermissions: Record<string, string[]> = {
    'user': ['read_own_data', 'write_own_data'],
    'company_admin': ['read_own_data', 'write_own_data', 'read_company_data', 'manage_users'],
    'admin': ['read_all_data', 'write_all_data', 'manage_all_users', 'system_admin'],
    'super_admin': ['*'] // All permissions
  };

  return rolePermissions[role] || rolePermissions['user'];
}

async function checkEmailVerification(userId: string): Promise<boolean> {
  try {
    const result = await authService.getUserSessions(userId);
    // This is a simplified check - you'd actually query the user's email_verified status
    return true; // Placeholder
  } catch (error) {
    return false;
  }
}

async function checkMFAStatus(userId: string, sessionId?: string): Promise<boolean> {
  // Placeholder for MFA verification logic
  return true;
}

async function validateApiKey(apiKey: string): Promise<{ valid: boolean; keyData?: any; error?: string }> {
  // Placeholder for API key validation
  return { valid: true, keyData: { id: 'api_key_id', companyId: 'company_id', permissions: [], name: 'API Key' } };
}

async function validateSessionToken(sessionToken: string): Promise<{ valid: boolean; user?: any; session?: any; error?: string }> {
  // Placeholder for session token validation
  return { valid: true, user: {}, session: {} };
}

export {
  type AuthOptions
};