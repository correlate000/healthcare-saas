// Healthcare SaaS API Server
// Complete Express.js server with all endpoints and middleware

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

// Import routes
import authRoutes from './routes/auth';
import healthDataRoutes from './routes/healthData';
import adminRoutes from './routes/admin';
import filesRoutes from './routes/files';
import aiAnalysisRoutes from './routes/aiAnalysis';
import healthRoutes from './routes/health';

// Import middleware
import { corsWithAuth, securityHeaders } from './middleware/auth';
import { csrfMiddleware } from './middleware/csrf';
import { enhancedSecurity } from './middleware/security';
import { auditLogger } from './services/audit';
import { db } from './db/connection';

// Initialize Express app
const app = express();
const PORT = process.env.API_PORT || 3001;
const HOST = process.env.API_HOST || '0.0.0.0';

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(corsWithAuth());

// Compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      console.log(message.trim());
    }
  }
}));

// Rate limiting
const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    auditLogger.logSecurityEvent({
      eventType: 'rate_limit_exceeded',
      severity: 'warning',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: { endpoint: req.path, method: req.method },
      success: false
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.'
    });
  }
});

app.use(globalRateLimit);

// Slow down repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes, then...
  delayMs: 500 // Begin adding 500ms of delay per request above 50
});

app.use(speedLimiter);

// Security headers
app.use(securityHeaders());

// Enhanced security middleware
app.use(enhancedSecurity());

// CSRF protection
app.use(csrfMiddleware);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    const dbHealth = await db.healthCheck();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      cpu: process.cpuUsage()
    };

    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/health-data', healthDataRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/files', filesRoutes);
app.use('/api/v1/ai', aiAnalysisRoutes);
app.use('/api/v1/health', healthRoutes);

// API Documentation endpoint
app.get('/api/v1/docs', (req: Request, res: Response) => {
  res.json({
    title: 'Healthcare SaaS API',
    version: '1.0.0',
    description: 'Complete healthcare data management API with authentication, file upload, and AI analysis',
    endpoints: {
      authentication: {
        'POST /api/v1/auth/register': 'User registration',
        'POST /api/v1/auth/login': 'User login',
        'POST /api/v1/auth/logout': 'User logout',
        'POST /api/v1/auth/refresh': 'Refresh access token',
        'POST /api/v1/auth/forgot-password': 'Request password reset',
        'POST /api/v1/auth/reset-password': 'Confirm password reset',
        'GET /api/v1/auth/verify-email/:token': 'Verify email address',
        'GET /api/v1/auth/me': 'Get current user info',
        'GET /api/v1/auth/sessions': 'Get user sessions',
        'DELETE /api/v1/auth/sessions/:sessionId': 'Revoke session',
        'POST /api/v1/auth/change-password': 'Change password'
      },
      healthData: {
        'GET /api/v1/health-data/profile': 'Get health profile',
        'PUT /api/v1/health-data/profile': 'Update health profile',
        'POST /api/v1/health-data/entries': 'Create health data entry',
        'GET /api/v1/health-data/entries': 'Get health data entries',
        'DELETE /api/v1/health-data/entries/:id': 'Delete health data entry',
        'POST /api/v1/health-data/symptoms': 'Create symptom entry',
        'POST /api/v1/health-data/vitals': 'Create vital signs entry',
        'POST /api/v1/health-data/medications': 'Create medication entry',
        'POST /api/v1/health-data/goals': 'Create health goal',
        'GET /api/v1/health-data/statistics': 'Get health statistics'
      },
      files: {
        'POST /api/v1/files/upload': 'Upload single file',
        'POST /api/v1/files/upload-multiple': 'Upload multiple files',
        'GET /api/v1/files': 'Get user files',
        'GET /api/v1/files/:id': 'Get file info',
        'GET /api/v1/files/:id/download': 'Download file',
        'GET /api/v1/files/:id/thumbnail/:size': 'Get file thumbnail',
        'DELETE /api/v1/files/:id': 'Delete file',
        'POST /api/v1/files/bulk-delete': 'Bulk delete files'
      },
      admin: {
        'POST /api/v1/admin/companies': 'Create company',
        'GET /api/v1/admin/companies': 'Get companies',
        'GET /api/v1/admin/companies/:id': 'Get company',
        'PUT /api/v1/admin/companies/:id': 'Update company',
        'GET /api/v1/admin/users': 'Get users',
        'PUT /api/v1/admin/users/:id': 'Update user',
        'POST /api/v1/admin/users/invite': 'Invite user',
        'POST /api/v1/admin/users/batch-update': 'Batch update users',
        'GET /api/v1/admin/security-config/:companyId': 'Get security config',
        'PUT /api/v1/admin/security-config/:companyId': 'Update security config',
        'GET /api/v1/admin/api-keys/:companyId': 'Get API keys',
        'POST /api/v1/admin/api-keys': 'Create API key',
        'DELETE /api/v1/admin/api-keys/:id': 'Revoke API key',
        'GET /api/v1/admin/analytics': 'Get system analytics',
        'POST /api/v1/admin/export/:companyId': 'Export company data',
        'GET /api/v1/admin/audit-logs': 'Get audit logs',
        'GET /api/v1/admin/compliance-report': 'Generate compliance report',
        'POST /api/v1/admin/audit-logs/export': 'Export audit logs'
      },
      aiAnalysis: {
        'POST /api/v1/ai/analyze/symptoms': 'AI symptom analysis',
        'GET /api/v1/ai/trends/:userId': 'Health trend analysis',
        'GET /api/v1/ai/predictions/:userId': 'Health predictions',
        'GET /api/v1/ai/history/:userId': 'Analysis history',
        'GET /api/v1/ai/session/:sessionId': 'Session details',
        'GET /api/v1/ai/stats/:userId': 'Analysis statistics'
      }
    },
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      cookies: 'authToken, refreshToken (HTTP-only)'
    },
    rateLimit: {
      global: '100 requests per 15 minutes per IP',
      authentication: '20 requests per hour per IP',
      fileUpload: '20 uploads per hour per user',
      fileDownload: '100 downloads per hour per user'
    },
    security: {
      encryption: 'AES-256-GCM for sensitive data',
      hashing: 'bcrypt with 12 rounds for passwords',
      sessions: 'Secure HTTP-only cookies with CSRF protection',
      fileScanning: 'Virus scanning for all uploads',
      privacyCompliance: 'GDPR and HIPAA compliant data handling'
    }
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Healthcare SaaS API Server',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/v1/docs',
    health: '/health'
  });
});

// 404 handler for API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);

  // Log security-related errors
  if (err.type === 'entity.parse.failed' || err.status === 400) {
    auditLogger.logSecurityEvent({
      eventType: 'malformed_request',
      severity: 'warning',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: { 
        error: err.message,
        endpoint: req.path,
        method: req.method 
      },
      success: false
    });
  }

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  // Close database connections
  try {
    await db.close();
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }

  // Close server
  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('Server closed successfully');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log('🏥 Healthcare SaaS API Server Starting...');
  console.log(`📡 Server running on http://${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API Documentation: http://${HOST}:${PORT}/api/v1/docs`);
  console.log(`❤️  Health Check: http://${HOST}:${PORT}/health`);
  console.log('✅ Server ready to accept connections');
});

// Increase server timeout for large file uploads
server.timeout = 300000; // 5 minutes
server.keepAliveTimeout = 65000; // 65 seconds
server.headersTimeout = 66000; // 66 seconds

export default app;