import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { RateLimiter } from '../services/rateLimit'

interface CSRFOptions {
  excludePaths?: string[]
  tokenLength?: number
  tokenName?: string
  headerName?: string
  cookieName?: string
  cookieOptions?: {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
    maxAge?: number
    path?: string
  }
}

class CSRFProtection {
  private tokenStore: Map<string, { token: string; createdAt: Date }>
  private rateLimiter: RateLimiter
  private options: Required<CSRFOptions>

  constructor(options: CSRFOptions = {}) {
    this.tokenStore = new Map()
    this.rateLimiter = new RateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 50,
      prefix: 'csrf_'
    })

    this.options = {
      excludePaths: options.excludePaths || ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh'],
      tokenLength: options.tokenLength || 32,
      tokenName: options.tokenName || 'csrf_token',
      headerName: options.headerName || 'x-csrf-token',
      cookieName: options.cookieName || 'csrf_token',
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
        ...options.cookieOptions
      }
    }

    // Clean up expired tokens every hour
    setInterval(() => this.cleanupExpiredTokens(), 60 * 60 * 1000)
  }

  generateToken(): string {
    return crypto.randomBytes(this.options.tokenLength).toString('hex')
  }

  storeToken(sessionId: string, token: string): void {
    this.tokenStore.set(sessionId, {
      token,
      createdAt: new Date()
    })
  }

  getToken(sessionId: string): string | null {
    const tokenData = this.tokenStore.get(sessionId)
    if (!tokenData) return null

    // Check if token is expired (24 hours)
    const now = new Date()
    const expiryTime = new Date(tokenData.createdAt.getTime() + this.options.cookieOptions.maxAge!)
    
    if (now > expiryTime) {
      this.tokenStore.delete(sessionId)
      return null
    }

    return tokenData.token
  }

  validateToken(sessionId: string, providedToken: string): boolean {
    const storedToken = this.getToken(sessionId)
    if (!storedToken) return false

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(storedToken),
      Buffer.from(providedToken)
    )
  }

  cleanupExpiredTokens(): void {
    const now = new Date()
    for (const [sessionId, tokenData] of this.tokenStore.entries()) {
      const expiryTime = new Date(tokenData.createdAt.getTime() + this.options.cookieOptions.maxAge!)
      if (now > expiryTime) {
        this.tokenStore.delete(sessionId)
      }
    }
  }

  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Skip CSRF check for excluded paths
      if (this.options.excludePaths.some(path => req.path.startsWith(path))) {
        return next()
      }

      // Skip CSRF check for GET, HEAD, OPTIONS requests
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        // Generate and set CSRF token for subsequent requests
        const sessionId = req.session?.id || req.ip
        let token = this.getToken(sessionId)
        
        if (!token) {
          token = this.generateToken()
          this.storeToken(sessionId, token)
        }

        // Set CSRF token in response header and cookie
        res.setHeader(this.options.headerName, token)
        res.cookie(this.options.cookieName, token, this.options.cookieOptions)
        
        return next()
      }

      // For state-changing requests, validate CSRF token
      const sessionId = req.session?.id || req.ip
      
      // Check rate limit
      const identifier = `${sessionId}_${req.path}`
      const allowed = await this.rateLimiter.checkLimit(identifier)
      
      if (!allowed) {
        return res.status(429).json({
          success: false,
          error: 'Too many failed CSRF attempts'
        })
      }

      // Get token from header or body
      const providedToken = req.headers[this.options.headerName] as string ||
                          req.body?.[this.options.tokenName] as string

      if (!providedToken) {
        await this.rateLimiter.recordAttempt(identifier)
        return res.status(403).json({
          success: false,
          error: 'CSRF token missing'
        })
      }

      // Validate token
      if (!this.validateToken(sessionId, providedToken)) {
        await this.rateLimiter.recordAttempt(identifier)
        return res.status(403).json({
          success: false,
          error: 'Invalid CSRF token'
        })
      }

      // Generate new token for next request (token rotation)
      const newToken = this.generateToken()
      this.storeToken(sessionId, newToken)
      
      res.setHeader(this.options.headerName, newToken)
      res.cookie(this.options.cookieName, newToken, this.options.cookieOptions)

      next()
    }
  }
}

// Create singleton instance
export const csrfProtection = new CSRFProtection()

// Export middleware function
export const csrfMiddleware = csrfProtection.middleware()