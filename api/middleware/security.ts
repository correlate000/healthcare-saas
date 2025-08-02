import { Request, Response, NextFunction } from 'express'
import xss from 'xss'
import { body, validationResult } from 'express-validator'
import { auditService } from '../services/audit'

// Enhanced security headers middleware
export const securityHeaders = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY')
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff')
    
    // Enable XSS filter
    res.setHeader('X-XSS-Protection', '1; mode=block')
    
    // DNS prefetch control
    res.setHeader('X-DNS-Prefetch-Control', 'off')
    
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // Permissions policy
    res.setHeader('Permissions-Policy', 
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()'
    )
    
    // Additional security headers for production
    if (process.env.NODE_ENV === 'production') {
      // Expect-CT for certificate transparency
      res.setHeader('Expect-CT', 'max-age=86400, enforce')
      
      // Feature policy
      res.setHeader('Feature-Policy', 
        "camera 'none'; microphone 'none'; geolocation 'none'; payment 'none'; usb 'none'"
      )
    }
    
    next()
  }
}

// XSS protection for user input
export const xssProtection = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip for file uploads
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      return next()
    }

    // Clean request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body)
    }

    // Clean query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query) as any
    }

    // Clean params
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params) as any
    }

    next()
  }
}

// Recursive sanitization function
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return xss(obj, {
      whiteList: {}, // No HTML tags allowed
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script']
    })
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Sanitize key as well
        const sanitizedKey = xss(key)
        sanitized[sanitizedKey] = sanitizeObject(obj[key])
      }
    }
    return sanitized
  }
  
  return obj
}

// SQL injection prevention validation
export const sqlInjectionPrevention = () => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FROM|WHERE|OR|AND|NOT|NULL|LIKE|INTO|VALUES|TABLE|DATABASE|PROCEDURE|FUNCTION|TRIGGER|VIEW|INDEX)\b)/gi,
    /(--|\/\*|\*\/|xp_|sp_|@@|@)/g,
    /(\bWAITFOR\s+DELAY\b|\bBENCHMARK\b|\bSLEEP\b)/gi
  ]

  return (req: Request, res: Response, next: NextFunction) => {
    const checkValue = (value: any): boolean => {
      if (typeof value === 'string') {
        return sqlPatterns.some(pattern => pattern.test(value))
      }
      return false
    }

    const checkObject = (obj: any): boolean => {
      if (typeof obj === 'string') {
        return checkValue(obj)
      }
      
      if (Array.isArray(obj)) {
        return obj.some(item => checkObject(item))
      }
      
      if (obj && typeof obj === 'object') {
        return Object.values(obj).some(value => checkObject(value))
      }
      
      return false
    }

    // Check request body, query, and params
    if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
      // Log potential SQL injection attempt
      auditService.logSecurityEvent({
        eventType: 'sql_injection_attempt',
        severity: 'high',
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          path: req.path,
          method: req.method
        },
        success: false
      })

      return res.status(400).json({
        success: false,
        error: 'Invalid input detected'
      })
    }

    next()
  }
}

// Path traversal prevention
export const pathTraversalPrevention = () => {
  const pathPatterns = [
    /\.\./g,
    /\.\.%2[fF]/g,
    /%2[eE]\./g,
    /\0/g,
    /(^|[/\\])\./
  ]

  return (req: Request, res: Response, next: NextFunction) => {
    const checkPath = (value: string): boolean => {
      return pathPatterns.some(pattern => pattern.test(value))
    }

    // Check all string values in request
    const paths = [
      req.path,
      ...Object.values(req.params || {}),
      ...Object.values(req.query || {}),
      ...(req.body && typeof req.body === 'object' ? 
        Object.values(req.body).filter(v => typeof v === 'string') : [])
    ].filter(v => typeof v === 'string')

    if (paths.some(path => checkPath(path as string))) {
      // Log path traversal attempt
      auditService.logSecurityEvent({
        eventType: 'path_traversal_attempt',
        severity: 'high',
        userId: req.user?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          path: req.path,
          method: req.method
        },
        success: false
      })

      return res.status(400).json({
        success: false,
        error: 'Invalid path'
      })
    }

    next()
  }
}

// Content type validation
export const contentTypeValidation = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next()
    }

    const contentType = req.headers['content-type']
    if (!contentType) {
      return res.status(400).json({
        success: false,
        error: 'Content-Type header is required'
      })
    }

    const isAllowed = allowedTypes.some(type => contentType.includes(type))
    if (!isAllowed) {
      return res.status(415).json({
        success: false,
        error: 'Unsupported Media Type'
      })
    }

    next()
  }
}

// Input size validation
export const inputSizeValidation = (maxSize: number = 1024 * 1024) => { // 1MB default
  return (req: Request, res: Response, next: NextFunction) => {
    const checkSize = (obj: any, currentSize: number = 0): number => {
      if (typeof obj === 'string') {
        return currentSize + Buffer.byteLength(obj)
      }
      
      if (Array.isArray(obj)) {
        return obj.reduce((size, item) => checkSize(item, size), currentSize)
      }
      
      if (obj && typeof obj === 'object') {
        return Object.values(obj).reduce((size, value) => checkSize(value, size), currentSize)
      }
      
      return currentSize
    }

    const totalSize = checkSize(req.body) + checkSize(req.query) + checkSize(req.params)
    
    if (totalSize > maxSize) {
      return res.status(413).json({
        success: false,
        error: 'Request entity too large'
      })
    }

    next()
  }
}

// Combined security middleware
export const enhancedSecurity = () => {
  return [
    securityHeaders(),
    xssProtection(),
    sqlInjectionPrevention(),
    pathTraversalPrevention(),
    contentTypeValidation(['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded']),
    inputSizeValidation()
  ]
}