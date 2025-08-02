// Audit Logging Service
// Comprehensive audit trail for security, compliance, and data access tracking

import { db } from '../db/connection';

interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId?: string;
  actorType: 'user' | 'system' | 'api';
  actorId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  success: boolean;
  details?: Record<string, any>;
  complianceTags?: string[];
  legalBasis?: string;
}

interface SecurityEvent {
  eventType: string;
  eventSubtype?: string;
  severity: 'info' | 'warning' | 'critical';
  userId?: string;
  sessionId?: string;
  ipAddress: string;
  userAgent?: string;
  details: Record<string, any>;
  success: boolean;
}

interface DataProcessingEvent {
  activity: string;
  dataController: string;
  dataProcessor?: string;
  dataSubjectId?: string;
  legalBasis: string;
  dataCategories: string[];
  purpose: string;
  retentionPeriod?: string;
  sharedWith?: string[];
}

interface ComplianceReport {
  period: { start: Date; end: Date };
  totalEvents: number;
  eventsByType: Record<string, number>;
  securityIncidents: number;
  dataSubjectRequests: number;
  privacyViolations: number;
  accessPatterns: Array<{
    action: string;
    count: number;
    uniqueUsers: number;
  }>;
}

class AuditLogger {
  private batchSize = 100;
  private batch: AuditLogEntry[] = [];
  private flushInterval: NodeJS.Timeout;
  private isShuttingDown = false;

  constructor() {
    // Flush batch every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushBatch();
    }, 30000);

    // Handle graceful shutdown
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  // Log general audit event
  async log(
    action: string,
    actorId?: string,
    ipAddress?: string,
    details?: Record<string, any>,
    success: boolean = true,
    options?: {
      entityType?: string;
      entityId?: string;
      sessionId?: string;
      userAgent?: string;
      oldValues?: Record<string, any>;
      newValues?: Record<string, any>;
      complianceTags?: string[];
      legalBasis?: string;
    }
  ): Promise<void> {
    const entry: AuditLogEntry = {
      action,
      entityType: options?.entityType || 'system',
      entityId: options?.entityId,
      actorType: actorId ? 'user' : 'system',
      actorId,
      sessionId: options?.sessionId,
      ipAddress,
      userAgent: options?.userAgent,
      oldValues: options?.oldValues,
      newValues: options?.newValues,
      success,
      details,
      complianceTags: options?.complianceTags || [],
      legalBasis: options?.legalBasis
    };

    // Add to batch for performance
    this.batch.push(entry);

    // Flush immediately for critical events
    if (action.includes('security') || action.includes('breach') || !success) {
      await this.flushBatch();
    } else if (this.batch.length >= this.batchSize) {
      await this.flushBatch();
    }
  }

  // Log security event
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      await db.query(`
        INSERT INTO security_events (
          event_type, event_subtype, severity, user_id, session_id,
          ip_address, user_agent, event_details, success
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        event.eventType,
        event.eventSubtype,
        event.severity,
        event.userId,
        event.sessionId,
        event.ipAddress,
        event.userAgent,
        JSON.stringify(event.details),
        event.success
      ]);

      // Also log as audit trail
      await this.log(
        `security_${event.eventType}`,
        event.userId,
        event.ipAddress,
        { ...event.details, severity: event.severity },
        event.success,
        {
          entityType: 'security_event',
          sessionId: event.sessionId,
          userAgent: event.userAgent,
          complianceTags: ['SECURITY_MONITORING']
        }
      );
    } catch (error) {
      console.error('Security event logging error:', error);
    }
  }

  // Log data processing activity (GDPR compliance)
  async logDataProcessing(event: DataProcessingEvent): Promise<void> {
    try {
      await db.query(`
        INSERT INTO data_processing_records (
          processing_activity, data_controller, data_processor,
          data_subject_id, legal_basis, data_categories, purpose,
          retention_period, shared_with
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        event.activity,
        event.dataController,
        event.dataProcessor,
        event.dataSubjectId,
        event.legalBasis,
        event.dataCategories,
        event.purpose,
        event.retentionPeriod,
        event.sharedWith || []
      ]);

      // Also log as audit trail
      await this.log(
        'data_processing',
        'system',
        null,
        {
          activity: event.activity,
          legalBasis: event.legalBasis,
          dataCategories: event.dataCategories,
          purpose: event.purpose
        },
        true,
        {
          entityType: 'data_processing',
          entityId: event.dataSubjectId,
          complianceTags: ['GDPR_COMPLIANCE', 'DATA_PROCESSING'],
          legalBasis: event.legalBasis
        }
      );
    } catch (error) {
      console.error('Data processing logging error:', error);
    }
  }

  // Log data access
  async logDataAccess(
    userId: string,
    dataType: string,
    dataId: string,
    action: 'read' | 'create' | 'update' | 'delete',
    ipAddress: string,
    sessionId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.log(
      `data_${action}`,
      userId,
      ipAddress,
      { dataType, dataId, ...details },
      true,
      {
        entityType: dataType,
        entityId: dataId,
        sessionId,
        complianceTags: ['DATA_ACCESS', 'HIPAA_COMPLIANCE'],
        legalBasis: 'consent'
      }
    );
  }

  // Log API access
  async logApiAccess(
    endpoint: string,
    method: string,
    statusCode: number,
    userId?: string,
    apiKeyId?: string,
    ipAddress?: string,
    requestDuration?: number,
    details?: Record<string, any>
  ): Promise<void> {
    const success = statusCode >= 200 && statusCode < 400;
    const severity = statusCode >= 500 ? 'critical' : (statusCode >= 400 ? 'warning' : 'info');

    await this.log(
      'api_access',
      userId || apiKeyId,
      ipAddress,
      {
        endpoint,
        method,
        statusCode,
        requestDuration,
        ...details
      },
      success,
      {
        entityType: 'api_endpoint',
        entityId: endpoint,
        complianceTags: ['API_ACCESS']
      }
    );

    // Log as security event if suspicious
    if (statusCode === 401 || statusCode === 403) {
      await this.logSecurityEvent({
        eventType: 'unauthorized_access',
        severity: 'warning',
        userId,
        ipAddress: ipAddress || '',
        details: { endpoint, method, statusCode },
        success: false
      });
    }
  }

  // Log authentication events
  async logAuth(
    action: 'login' | 'logout' | 'password_change' | 'password_reset' | 'mfa_verify',
    userId: string,
    ipAddress: string,
    success: boolean,
    details?: Record<string, any>
  ): Promise<void> {
    const severity = success ? 'info' : 'warning';
    
    await this.logSecurityEvent({
      eventType: action,
      severity,
      userId,
      ipAddress,
      details: details || {},
      success
    });

    // Additional compliance logging for authentication
    await this.log(
      `auth_${action}`,
      userId,
      ipAddress,
      details,
      success,
      {
        entityType: 'user_auth',
        entityId: userId,
        complianceTags: ['AUTHENTICATION', 'SECURITY']
      }
    );
  }

  // Log privacy-related actions
  async logPrivacyAction(
    action: 'consent_given' | 'consent_withdrawn' | 'data_export' | 'data_deletion' | 'access_request',
    userId: string,
    details?: Record<string, any>
  ): Promise<void> {
    await db.query(`
      INSERT INTO privacy_audit_logs (
        action, anonymous_user_id, data_type, success,
        compliance_flags, retention_until
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      action,
      await this.getAnonymousUserId(userId),
      details?.dataType || 'user_data',
      true,
      JSON.stringify(['GDPR_COMPLIANCE', 'PRIVACY_RIGHTS']),
      new Date(Date.now() + (7 * 365 * 24 * 60 * 60 * 1000)) // 7 years retention
    ]);

    await this.log(
      action,
      userId,
      null,
      details,
      true,
      {
        entityType: 'privacy_action',
        entityId: userId,
        complianceTags: ['GDPR_COMPLIANCE', 'PRIVACY_RIGHTS'],
        legalBasis: 'legal_obligation'
      }
    );
  }

  // Generate compliance report
  async generateComplianceReport(period: { start: Date; end: Date }): Promise<ComplianceReport> {
    try {
      // Get total events
      const totalResult = await db.query(`
        SELECT COUNT(*) as total
        FROM audit_trails
        WHERE created_at >= $1 AND created_at <= $2
      `, [period.start, period.end]);

      // Get events by type
      const eventTypesResult = await db.query(`
        SELECT action, COUNT(*) as count
        FROM audit_trails
        WHERE created_at >= $1 AND created_at <= $2
        GROUP BY action
        ORDER BY count DESC
      `, [period.start, period.end]);

      // Get security incidents
      const securityResult = await db.query(`
        SELECT COUNT(*) as incidents
        FROM security_events
        WHERE occurred_at >= $1 AND occurred_at <= $2
          AND severity IN ('warning', 'critical')
      `, [period.start, period.end]);

      // Get data subject requests
      const requestsResult = await db.query(`
        SELECT COUNT(*) as requests
        FROM data_subject_requests
        WHERE created_at >= $1 AND created_at <= $2
      `, [period.start, period.end]);

      // Get access patterns
      const accessResult = await db.query(`
        SELECT 
          action,
          COUNT(*) as count,
          COUNT(DISTINCT actor_id) as unique_users
        FROM audit_trails
        WHERE created_at >= $1 AND created_at <= $2
          AND action LIKE 'data_%'
        GROUP BY action
        ORDER BY count DESC
        LIMIT 10
      `, [period.start, period.end]);

      const eventsByType: Record<string, number> = {};
      eventTypesResult.rows.forEach(row => {
        eventsByType[row.action] = parseInt(row.count);
      });

      return {
        period,
        totalEvents: parseInt(totalResult.rows[0].total),
        eventsByType,
        securityIncidents: parseInt(securityResult.rows[0].incidents),
        dataSubjectRequests: parseInt(requestsResult.rows[0].requests),
        privacyViolations: 0, // Would be calculated based on specific criteria
        accessPatterns: accessResult.rows.map(row => ({
          action: row.action,
          count: parseInt(row.count),
          uniqueUsers: parseInt(row.unique_users)
        }))
      };
    } catch (error) {
      console.error('Compliance report generation error:', error);
      throw error;
    }
  }

  // Search audit logs
  async searchLogs(criteria: {
    action?: string;
    actorId?: string;
    entityType?: string;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
    success?: boolean;
    ipAddress?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: any[]; total: number }> {
    try {
      let query = 'SELECT * FROM audit_trails WHERE 1=1';
      let countQuery = 'SELECT COUNT(*) FROM audit_trails WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      // Build dynamic query based on criteria
      if (criteria.action) {
        query += ` AND action = $${paramIndex}`;
        countQuery += ` AND action = $${paramIndex}`;
        params.push(criteria.action);
        paramIndex++;
      }

      if (criteria.actorId) {
        query += ` AND actor_id = $${paramIndex}`;
        countQuery += ` AND actor_id = $${paramIndex}`;
        params.push(criteria.actorId);
        paramIndex++;
      }

      if (criteria.entityType) {
        query += ` AND entity_type = $${paramIndex}`;
        countQuery += ` AND entity_type = $${paramIndex}`;
        params.push(criteria.entityType);
        paramIndex++;
      }

      if (criteria.entityId) {
        query += ` AND entity_id = $${paramIndex}`;
        countQuery += ` AND entity_id = $${paramIndex}`;
        params.push(criteria.entityId);
        paramIndex++;
      }

      if (criteria.startDate) {
        query += ` AND created_at >= $${paramIndex}`;
        countQuery += ` AND created_at >= $${paramIndex}`;
        params.push(criteria.startDate);
        paramIndex++;
      }

      if (criteria.endDate) {
        query += ` AND created_at <= $${paramIndex}`;
        countQuery += ` AND created_at <= $${paramIndex}`;
        params.push(criteria.endDate);
        paramIndex++;
      }

      if (criteria.success !== undefined) {
        query += ` AND success = $${paramIndex}`;
        countQuery += ` AND success = $${paramIndex}`;
        params.push(criteria.success);
        paramIndex++;
      }

      if (criteria.ipAddress) {
        query += ` AND ip_address = $${paramIndex}`;
        countQuery += ` AND ip_address = $${paramIndex}`;
        params.push(criteria.ipAddress);
        paramIndex++;
      }

      // Add ordering and pagination
      query += ' ORDER BY created_at DESC';
      
      if (criteria.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(criteria.limit);
        paramIndex++;
      }

      if (criteria.offset) {
        query += ` OFFSET $${paramIndex}`;
        params.push(criteria.offset);
        paramIndex++;
      }

      // Execute queries
      const [logsResult, countResult] = await Promise.all([
        db.query(query, params.slice(0, paramIndex - (criteria.offset ? 2 : 1))),
        db.query(countQuery, params.slice(0, paramIndex - (criteria.limit ? (criteria.offset ? 2 : 1) : 0)))
      ]);

      return {
        logs: logsResult.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } catch (error) {
      console.error('Audit log search error:', error);
      throw error;
    }
  }

  // Export audit logs (for compliance)
  async exportLogs(
    startDate: Date,
    endDate: Date,
    format: 'json' | 'csv' = 'json'
  ): Promise<{ data: string; filename: string }> {
    try {
      const result = await db.query(`
        SELECT 
          action, entity_type, entity_id, actor_type, actor_id,
          session_id, ip_address, user_agent, old_values, new_values,
          success, details, compliance_tags, legal_basis, created_at
        FROM audit_trails
        WHERE created_at >= $1 AND created_at <= $2
        ORDER BY created_at DESC
      `, [startDate, endDate]);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `audit-logs-${timestamp}.${format}`;

      if (format === 'json') {
        return {
          data: JSON.stringify(result.rows, null, 2),
          filename
        };
      } else {
        // CSV format
        const headers = [
          'timestamp', 'action', 'entity_type', 'entity_id', 'actor_type',
          'actor_id', 'session_id', 'ip_address', 'success', 'details'
        ];
        
        const csvRows = [
          headers.join(','),
          ...result.rows.map(row => [
            row.created_at,
            row.action,
            row.entity_type,
            row.entity_id || '',
            row.actor_type,
            row.actor_id || '',
            row.session_id || '',
            row.ip_address || '',
            row.success,
            JSON.stringify(row.details || {}).replace(/"/g, '""')
          ].map(field => `"${field}"`).join(','))
        ];

        return {
          data: csvRows.join('\n'),
          filename
        };
      }
    } catch (error) {
      console.error('Audit log export error:', error);
      throw error;
    }
  }

  // Private methods
  private async flushBatch(): Promise<void> {
    if (this.batch.length === 0 || this.isShuttingDown) {
      return;
    }

    const batchToFlush = [...this.batch];
    this.batch = [];

    try {
      // Batch insert for performance
      const values = batchToFlush.map(entry => 
        `('${entry.action}', '${entry.entityType}', ${entry.entityId ? `'${entry.entityId}'` : 'NULL'}, '${entry.actorType}', ${entry.actorId ? `'${entry.actorId}'` : 'NULL'}, ${entry.sessionId ? `'${entry.sessionId}'` : 'NULL'}, ${entry.ipAddress ? `'${entry.ipAddress}'` : 'NULL'}, ${entry.userAgent ? `'${entry.userAgent}'` : 'NULL'}, ${entry.oldValues ? `'${JSON.stringify(entry.oldValues)}'` : 'NULL'}, ${entry.newValues ? `'${JSON.stringify(entry.newValues)}'` : 'NULL'}, ${entry.success}, ${entry.details ? `'${JSON.stringify(entry.details)}'` : 'NULL'}, '${JSON.stringify(entry.complianceTags || [])}', ${entry.legalBasis ? `'${entry.legalBasis}'` : 'NULL'})`
      ).join(',');

      await db.query(`
        INSERT INTO audit_trails (
          action, entity_type, entity_id, actor_type, actor_id,
          session_id, ip_address, user_agent, old_values, new_values,
          success, details, compliance_tags, legal_basis
        ) VALUES ${values}
      `);
    } catch (error) {
      console.error('Audit batch flush error:', error);
      // Re-add failed entries to batch for retry
      this.batch.unshift(...batchToFlush);
    }
  }

  private async getAnonymousUserId(userId: string): Promise<string> {
    try {
      const result = await db.query(
        'SELECT anonymous_id FROM users WHERE id = $1',
        [userId]
      );
      return result.rows[0]?.anonymous_id || userId;
    } catch (error) {
      return userId;
    }
  }

  // Graceful shutdown
  private async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    // Flush remaining entries
    await this.flushBatch();
  }
}

export const auditLogger = new AuditLogger();
export { AuditLogger, type AuditLogEntry, type SecurityEvent, type ComplianceReport };