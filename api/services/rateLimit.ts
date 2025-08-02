// Rate Limiting Service
// Advanced rate limiting with multiple strategies and Redis support

import { db } from '../db/connection';

interface RateLimitRule {
  key: string;
  requests: number;
  windowSeconds: number;
  blockDurationSeconds?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  blockUntil?: Date;
}

class RateLimitService {
  private memoryCache = new Map<string, { count: number; windowStart: number; blockUntil?: number }>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }

  // Check rate limit using database (persistent)
  async check(identifier: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    try {
      const result = await db.query(`
        SELECT check_rate_limit($1, $2, $3, $4) as allowed
      `, [identifier, 'default', maxRequests, Math.floor(windowSeconds / 60)]);

      return result.rows[0]?.allowed || false;
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fallback to memory-based rate limiting
      return this.checkMemory(identifier, maxRequests, windowSeconds);
    }
  }

  // Memory-based rate limiting (faster, but not persistent)
  checkMemory(identifier: string, maxRequests: number, windowSeconds: number): boolean {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    
    let entry = this.memoryCache.get(identifier);
    
    // Check if blocked
    if (entry?.blockUntil && now < entry.blockUntil) {
      return false;
    }

    // Reset window if expired
    if (!entry || now - entry.windowStart >= windowMs) {
      entry = {
        count: 1,
        windowStart: now
      };
      this.memoryCache.set(identifier, entry);
      return true;
    }

    // Increment counter
    entry.count++;
    
    // Check if limit exceeded
    if (entry.count > maxRequests) {
      // Block for the remainder of the window
      entry.blockUntil = now + (windowMs - (now - entry.windowStart));
      return false;
    }

    return true;
  }

  // Advanced rate limiting with detailed result
  async checkAdvanced(identifier: string, maxRequests: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    
    try {
      // Try database first
      const result = await db.query(`
        SELECT 
          request_count,
          window_start,
          blocked_until,
          CASE 
            WHEN blocked_until > NOW() THEN false
            WHEN request_count >= $3 THEN false
            ELSE true
          END as allowed
        FROM rate_limits
        WHERE identifier = $1 AND endpoint = $2
      `, [identifier, 'default', maxRequests]);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        const windowStart = new Date(row.window_start).getTime();
        const resetTime = new Date(windowStart + windowMs);
        
        return {
          allowed: row.allowed,
          remaining: Math.max(0, maxRequests - row.request_count),
          resetTime,
          blockUntil: row.blocked_until ? new Date(row.blocked_until) : undefined
        };
      }
    } catch (error) {
      console.error('Advanced rate limit check error:', error);
    }

    // Fallback to memory
    const allowed = this.checkMemory(identifier, maxRequests, windowSeconds);
    const entry = this.memoryCache.get(identifier);
    
    return {
      allowed,
      remaining: entry ? Math.max(0, maxRequests - entry.count) : maxRequests - 1,
      resetTime: new Date(now + windowMs),
      blockUntil: entry?.blockUntil ? new Date(entry.blockUntil) : undefined
    };
  }

  // IP-based rate limiting with geolocation consideration
  async checkIP(ip: string, maxRequests: number = 100, windowSeconds: number = 900): Promise<boolean> {
    // Higher limits for known good IPs, lower for suspicious ones
    const adjustedLimit = await this.getAdjustedLimitForIP(ip, maxRequests);
    return this.check(`ip:${ip}`, adjustedLimit, windowSeconds);
  }

  // User-based rate limiting
  async checkUser(userId: string, maxRequests: number = 200, windowSeconds: number = 900): Promise<boolean> {
    return this.check(`user:${userId}`, maxRequests, windowSeconds);
  }

  // Endpoint-specific rate limiting
  async checkEndpoint(identifier: string, endpoint: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    return this.check(`${identifier}:${endpoint}`, maxRequests, windowSeconds);
  }

  // Burst protection (short-term high-frequency requests)
  async checkBurst(identifier: string, maxBurst: number = 10, burstWindowSeconds: number = 10): Promise<boolean> {
    return this.check(`burst:${identifier}`, maxBurst, burstWindowSeconds);
  }

  // Sliding window rate limiting (more accurate but resource intensive)
  async checkSlidingWindow(identifier: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const key = `sliding:${identifier}`;
    
    let timestamps = this.getTimestamps(key);
    
    // Remove expired timestamps
    timestamps = timestamps.filter(ts => now - ts < windowMs);
    
    // Add current timestamp
    timestamps.push(now);
    
    // Store updated timestamps
    this.setTimestamps(key, timestamps);
    
    return timestamps.length <= maxRequests;
  }

  // Distributed rate limiting (for multiple server instances)
  async checkDistributed(identifier: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    try {
      // Use database for distributed coordination
      const result = await db.query(`
        WITH rate_check AS (
          INSERT INTO rate_limits (identifier, endpoint, request_count, window_start)
          VALUES ($1, 'distributed', 1, NOW())
          ON CONFLICT (identifier, endpoint)
          DO UPDATE SET 
            request_count = CASE 
              WHEN rate_limits.window_start < NOW() - ($3 || ' seconds')::INTERVAL 
              THEN 1
              ELSE rate_limits.request_count + 1
            END,
            window_start = CASE 
              WHEN rate_limits.window_start < NOW() - ($3 || ' seconds')::INTERVAL 
              THEN NOW()
              ELSE rate_limits.window_start
            END,
            updated_at = NOW()
          RETURNING request_count
        )
        SELECT request_count <= $2 as allowed FROM rate_check
      `, [identifier, maxRequests, windowSeconds]);

      return result.rows[0]?.allowed || false;
    } catch (error) {
      console.error('Distributed rate limit error:', error);
      return this.check(identifier, maxRequests, windowSeconds);
    }
  }

  // Rate limit with exponential backoff
  async checkWithBackoff(identifier: string, baseRequests: number, windowSeconds: number): Promise<RateLimitResult> {
    const violationKey = `violations:${identifier}`;
    const violations = this.getViolationCount(violationKey);
    
    // Reduce allowed requests exponentially with each violation
    const adjustedRequests = Math.max(1, Math.floor(baseRequests / Math.pow(2, violations)));
    
    const result = await this.checkAdvanced(identifier, adjustedRequests, windowSeconds);
    
    if (!result.allowed) {
      this.incrementViolations(violationKey);
    } else if (violations > 0) {
      // Gradually reduce violations on successful requests
      this.decrementViolations(violationKey);
    }
    
    return result;
  }

  // Whitelist/blacklist support
  async checkWithLists(identifier: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    // Check blacklist first
    if (await this.isBlacklisted(identifier)) {
      return false;
    }
    
    // Check whitelist
    if (await this.isWhitelisted(identifier)) {
      return true;
    }
    
    return this.check(identifier, maxRequests, windowSeconds);
  }

  // Get rate limit status without incrementing
  async getStatus(identifier: string): Promise<{ requests: number; windowStart: Date; remaining: number }> {
    try {
      const result = await db.query(`
        SELECT request_count, window_start
        FROM rate_limits
        WHERE identifier = $1 AND endpoint = 'default'
      `, [identifier]);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return {
          requests: row.request_count,
          windowStart: new Date(row.window_start),
          remaining: Math.max(0, 100 - row.request_count) // Default limit of 100
        };
      }
    } catch (error) {
      console.error('Rate limit status error:', error);
    }

    return { requests: 0, windowStart: new Date(), remaining: 100 };
  }

  // Reset rate limit for identifier
  async reset(identifier: string): Promise<void> {
    try {
      await db.query(`
        DELETE FROM rate_limits WHERE identifier = $1
      `, [identifier]);
      
      this.memoryCache.delete(identifier);
    } catch (error) {
      console.error('Rate limit reset error:', error);
    }
  }

  // Block identifier for specified duration
  async block(identifier: string, durationSeconds: number): Promise<void> {
    const blockUntil = new Date(Date.now() + (durationSeconds * 1000));
    
    try {
      await db.query(`
        INSERT INTO rate_limits (identifier, endpoint, request_count, window_start, blocked_until)
        VALUES ($1, 'blocked', 999999, NOW(), $2)
        ON CONFLICT (identifier, endpoint)
        DO UPDATE SET 
          blocked_until = $2,
          request_count = 999999,
          updated_at = NOW()
      `, [identifier, blockUntil]);
    } catch (error) {
      console.error('Rate limit block error:', error);
    }
    
    // Also block in memory
    this.memoryCache.set(identifier, {
      count: 999999,
      windowStart: Date.now(),
      blockUntil: blockUntil.getTime()
    });
  }

  // Unblock identifier
  async unblock(identifier: string): Promise<void> {
    try {
      await db.query(`
        UPDATE rate_limits 
        SET blocked_until = NULL, request_count = 0
        WHERE identifier = $1
      `, [identifier]);
      
      this.memoryCache.delete(identifier);
    } catch (error) {
      console.error('Rate limit unblock error:', error);
    }
  }

  // Private helper methods
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.memoryCache.entries()) {
      // Remove entries older than 1 hour
      if (now - entry.windowStart > 3600000) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.memoryCache.delete(key));
  }

  private async getAdjustedLimitForIP(ip: string, baseLimit: number): Promise<number> {
    try {
      // Check IP reputation (simplified)
      const result = await db.query(`
        SELECT 
          COUNT(*) as violation_count,
          MAX(created_at) as last_violation
        FROM security_events
        WHERE ip_address = $1 
          AND event_type IN ('failed_login', 'suspicious_activity')
          AND created_at > NOW() - INTERVAL '24 hours'
      `, [ip]);

      const violationCount = parseInt(result.rows[0]?.violation_count || '0');
      
      if (violationCount > 10) return Math.floor(baseLimit * 0.1); // 10% of base limit
      if (violationCount > 5) return Math.floor(baseLimit * 0.3);  // 30% of base limit
      if (violationCount > 0) return Math.floor(baseLimit * 0.7);  // 70% of base limit
      
      return baseLimit;
    } catch (error) {
      console.error('IP reputation check error:', error);
      return baseLimit;
    }
  }

  private getTimestamps(key: string): number[] {
    const entry = this.memoryCache.get(`timestamps:${key}`);
    return entry ? (entry as any).timestamps || [] : [];
  }

  private setTimestamps(key: string, timestamps: number[]): void {
    this.memoryCache.set(`timestamps:${key}`, { 
      timestamps, 
      count: timestamps.length, 
      windowStart: Date.now() 
    });
  }

  private getViolationCount(key: string): number {
    const entry = this.memoryCache.get(key);
    return entry?.count || 0;
  }

  private incrementViolations(key: string): void {
    const entry = this.memoryCache.get(key);
    const count = (entry?.count || 0) + 1;
    
    this.memoryCache.set(key, {
      count,
      windowStart: Date.now()
    });
  }

  private decrementViolations(key: string): void {
    const entry = this.memoryCache.get(key);
    if (entry && entry.count > 0) {
      this.memoryCache.set(key, {
        count: entry.count - 1,
        windowStart: entry.windowStart
      });
    }
  }

  private async isBlacklisted(identifier: string): Promise<boolean> {
    try {
      const result = await db.query(`
        SELECT 1 FROM rate_limits 
        WHERE identifier = $1 AND endpoint = 'blacklist'
      `, [identifier]);
      
      return result.rows.length > 0;
    } catch (error) {
      return false;
    }
  }

  private async isWhitelisted(identifier: string): Promise<boolean> {
    try {
      const result = await db.query(`
        SELECT 1 FROM rate_limits 
        WHERE identifier = $1 AND endpoint = 'whitelist'
      `, [identifier]);
      
      return result.rows.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Cleanup on service shutdown
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.memoryCache.clear();
  }
}

export const rateLimit = new RateLimitService();
export { RateLimitService, type RateLimitResult, type RateLimitRule };