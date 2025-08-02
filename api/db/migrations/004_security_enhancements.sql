-- Healthcare SaaS Security Enhancements
-- Migration: 004_security_enhancements.sql

-- Security events logging
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event identification
    event_type VARCHAR(50) NOT NULL, -- 'login_attempt', 'password_change', 'data_access', 'suspicious_activity'
    event_subtype VARCHAR(50),
    severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'critical'
    
    -- User and session info
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID,
    anonymous_user_id VARCHAR(32),
    
    -- Network information
    ip_address INET NOT NULL,
    user_agent TEXT,
    country_code VARCHAR(2),
    
    -- Event details
    event_details JSONB DEFAULT '{}',
    resource_accessed VARCHAR(255),
    action_attempted VARCHAR(100),
    
    -- Success/failure
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    
    -- Response and mitigation
    response_taken VARCHAR(100),
    blocked BOOLEAN DEFAULT false,
    
    -- Timestamps
    occurred_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- File uploads and storage
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- File information
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) NOT NULL, -- SHA256
    
    -- Upload context
    upload_context VARCHAR(100), -- 'health_document', 'profile_image', 'report_attachment'
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    
    -- Security scanning
    virus_scan_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'clean', 'infected', 'failed'
    virus_scan_result TEXT,
    malware_detected BOOLEAN DEFAULT false,
    
    -- Content analysis
    content_type VARCHAR(100),
    contains_phi BOOLEAN DEFAULT false, -- Protected Health Information
    encryption_enabled BOOLEAN DEFAULT true,
    
    -- Access control
    access_level VARCHAR(20) DEFAULT 'private', -- 'private', 'company', 'public'
    download_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    
    -- Retention and cleanup
    expires_at TIMESTAMP,
    retention_policy VARCHAR(50) DEFAULT 'standard',
    
    -- Status
    processing_status VARCHAR(20) DEFAULT 'uploaded', -- 'uploaded', 'processing', 'ready', 'failed'
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification system
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification details
    type VARCHAR(50) NOT NULL, -- 'health_alert', 'reminder', 'system', 'marketing'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Notification data
    data JSONB DEFAULT '{}',
    action_url VARCHAR(500),
    action_text VARCHAR(100),
    
    -- Priority and urgency
    priority INTEGER CHECK (priority BETWEEN 1 AND 5) DEFAULT 3,
    urgency VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'critical'
    
    -- Delivery channels
    channels TEXT[] DEFAULT ARRAY['in_app'], -- 'in_app', 'email', 'sms', 'push'
    
    -- Delivery status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'cancelled'
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- User interaction
    read_at TIMESTAMP,
    clicked_at TIMESTAMP,
    dismissed_at TIMESTAMP,
    
    -- Expiration
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- System audit trails
CREATE TABLE audit_trails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Action identification
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'user', 'health_data', 'file', etc.
    entity_id UUID,
    
    -- Actor information
    actor_type VARCHAR(20) NOT NULL, -- 'user', 'system', 'api'
    actor_id UUID,
    anonymous_actor_id VARCHAR(32),
    
    -- Context
    session_id UUID,
    ip_address INET,
    user_agent TEXT,
    
    -- Changes made
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Request information
    request_id VARCHAR(100),
    endpoint VARCHAR(255),
    http_method VARCHAR(10),
    
    -- Compliance and legal
    compliance_tags TEXT[] DEFAULT '{}',
    legal_basis VARCHAR(100),
    
    -- Retention
    retention_until TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Compliance and legal data processing records
CREATE TABLE data_processing_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Processing identification
    processing_activity VARCHAR(100) NOT NULL,
    data_controller VARCHAR(255) NOT NULL,
    data_processor VARCHAR(255),
    
    -- Data subject
    data_subject_id UUID,
    anonymous_data_subject_id VARCHAR(32),
    
    -- Legal basis
    legal_basis VARCHAR(50) NOT NULL, -- 'consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests'
    consent_id UUID,
    
    -- Data categories
    data_categories TEXT[] NOT NULL, -- 'health_data', 'personal_identifiers', 'behavioral_data'
    special_categories TEXT[], -- 'health', 'biometric', 'genetic'
    
    -- Processing details
    purpose TEXT NOT NULL,
    retention_period VARCHAR(100),
    deletion_date DATE,
    
    -- Data sharing
    shared_with TEXT[],
    transfer_safeguards TEXT[],
    
    -- Technical measures
    encryption_used BOOLEAN DEFAULT true,
    pseudonymization BOOLEAN DEFAULT false,
    anonymization BOOLEAN DEFAULT false,
    
    -- Compliance framework
    gdpr_applicable BOOLEAN DEFAULT true,
    hipaa_applicable BOOLEAN DEFAULT true,
    other_regulations TEXT[],
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Data subject rights requests (GDPR compliance)
CREATE TABLE data_subject_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Request identification
    request_type VARCHAR(50) NOT NULL, -- 'access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Data subject
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    anonymous_user_id VARCHAR(32),
    requestor_email VARCHAR(255),
    
    -- Request details
    description TEXT,
    specific_data_requested TEXT[],
    reason_for_request TEXT,
    
    -- Identity verification
    identity_verified BOOLEAN DEFAULT false,
    verification_method VARCHAR(100),
    verification_documents TEXT[],
    
    -- Processing
    status VARCHAR(20) DEFAULT 'received', -- 'received', 'verifying', 'processing', 'completed', 'rejected'
    assigned_to VARCHAR(255),
    
    -- Response
    response_due_date DATE NOT NULL,
    response_sent_at TIMESTAMP,
    response_method VARCHAR(50),
    
    -- Actions taken
    actions_taken TEXT[],
    data_provided_at TIMESTAMP,
    data_deleted_at TIMESTAMP,
    
    -- Legal review
    legal_review_required BOOLEAN DEFAULT false,
    legal_review_completed BOOLEAN DEFAULT false,
    legal_notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Security configurations
CREATE TABLE security_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Password policies
    password_min_length INTEGER DEFAULT 8,
    password_require_uppercase BOOLEAN DEFAULT true,
    password_require_lowercase BOOLEAN DEFAULT true,
    password_require_numbers BOOLEAN DEFAULT true,
    password_require_symbols BOOLEAN DEFAULT true,
    password_max_age_days INTEGER DEFAULT 90,
    password_history_count INTEGER DEFAULT 5,
    
    -- Authentication settings
    mfa_required BOOLEAN DEFAULT false,
    mfa_methods TEXT[] DEFAULT ARRAY['totp', 'sms'],
    session_timeout_minutes INTEGER DEFAULT 480,
    max_concurrent_sessions INTEGER DEFAULT 3,
    
    -- Account lockout
    max_failed_attempts INTEGER DEFAULT 5,
    lockout_duration_minutes INTEGER DEFAULT 30,
    
    -- IP restrictions
    allowed_ip_ranges INET[],
    blocked_ip_ranges INET[],
    geo_restrictions TEXT[], -- Country codes
    
    -- File upload restrictions
    max_file_size_mb INTEGER DEFAULT 10,
    allowed_file_types TEXT[] DEFAULT ARRAY['pdf', 'jpg', 'png', 'docx'],
    virus_scanning_enabled BOOLEAN DEFAULT true,
    
    -- API security
    rate_limit_requests_per_minute INTEGER DEFAULT 60,
    api_key_rotation_days INTEGER DEFAULT 90,
    
    -- Data retention
    default_retention_years INTEGER DEFAULT 7,
    auto_deletion_enabled BOOLEAN DEFAULT true,
    
    -- Compliance settings
    gdpr_enabled BOOLEAN DEFAULT true,
    hipaa_enabled BOOLEAN DEFAULT true,
    audit_all_actions BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Email logs for tracking sent emails
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template_name VARCHAR(100),
    message_id VARCHAR(255),
    error_message TEXT,
    success BOOLEAN NOT NULL DEFAULT false,
    sent_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User invites table for invitation system
CREATE TABLE user_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    department VARCHAR(100),
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    invite_token VARCHAR(255) UNIQUE NOT NULL,
    message TEXT,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    used_by UUID REFERENCES users(id) ON DELETE SET NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- System health monitoring
CREATE TABLE system_health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Metric identification
    metric_name VARCHAR(100) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'counter', 'gauge', 'histogram'
    
    -- Metric values
    value DECIMAL(15,6) NOT NULL,
    unit VARCHAR(20),
    
    -- Context
    service_name VARCHAR(100),
    environment VARCHAR(50),
    host_name VARCHAR(255),
    
    -- Tags for filtering
    tags JSONB DEFAULT '{}',
    
    -- Thresholds
    warning_threshold DECIMAL(15,6),
    critical_threshold DECIMAL(15,6),
    
    -- Status
    status VARCHAR(20) DEFAULT 'normal', -- 'normal', 'warning', 'critical'
    
    -- Timestamp
    measured_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for security and monitoring tables
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_ip ON security_events(ip_address);
CREATE INDEX idx_security_events_occurred ON security_events(occurred_at);
CREATE INDEX idx_security_events_severity ON security_events(severity);

CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_hash ON file_uploads(file_hash);
CREATE INDEX idx_file_uploads_context ON file_uploads(upload_context);
CREATE INDEX idx_file_uploads_status ON file_uploads(processing_status);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created ON notifications(created_at);

CREATE INDEX idx_audit_trails_entity ON audit_trails(entity_type, entity_id);
CREATE INDEX idx_audit_trails_actor ON audit_trails(actor_type, actor_id);
CREATE INDEX idx_audit_trails_action ON audit_trails(action);
CREATE INDEX idx_audit_trails_created ON audit_trails(created_at);

CREATE INDEX idx_data_processing_subject ON data_processing_records(data_subject_id);
CREATE INDEX idx_data_processing_activity ON data_processing_records(processing_activity);
CREATE INDEX idx_data_processing_legal_basis ON data_processing_records(legal_basis);

CREATE INDEX idx_data_requests_user_id ON data_subject_requests(user_id);
CREATE INDEX idx_data_requests_status ON data_subject_requests(status);
CREATE INDEX idx_data_requests_due_date ON data_subject_requests(response_due_date);

CREATE INDEX idx_security_config_company ON security_configurations(company_id);

CREATE INDEX idx_health_metrics_name ON system_health_metrics(metric_name);
CREATE INDEX idx_health_metrics_service ON system_health_metrics(service_name);
CREATE INDEX idx_health_metrics_measured ON system_health_metrics(measured_at);

CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX idx_email_logs_success ON email_logs(success);

CREATE INDEX idx_user_invites_company ON user_invites(company_id);
CREATE INDEX idx_user_invites_email ON user_invites(email);
CREATE INDEX idx_user_invites_token ON user_invites(invite_token);
CREATE INDEX idx_user_invites_expires ON user_invites(expires_at);
CREATE INDEX idx_user_invites_used ON user_invites(used);

-- Update triggers
CREATE TRIGGER update_file_uploads_updated_at BEFORE UPDATE ON file_uploads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_processing_updated_at BEFORE UPDATE ON data_processing_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_requests_updated_at BEFORE UPDATE ON data_subject_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_config_updated_at BEFORE UPDATE ON security_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type VARCHAR(50),
    p_user_id UUID DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT true,
    p_details JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
    severity VARCHAR(20) := 'info';
BEGIN
    -- Determine severity based on event type
    IF p_event_type IN ('failed_login', 'suspicious_activity', 'data_breach') THEN
        severity := 'critical';
    ELSIF p_event_type IN ('password_change', 'profile_update', 'unusual_access') THEN
        severity := 'warning';
    END IF;
    
    -- Insert security event
    INSERT INTO security_events (
        event_type, severity, user_id, ip_address, user_agent,
        success, event_details
    ) VALUES (
        p_event_type, severity, p_user_id, p_ip_address, p_user_agent,
        p_success, p_details
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_identifier VARCHAR(255),
    p_endpoint VARCHAR(255),
    p_limit INTEGER DEFAULT 60,
    p_window_minutes INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
    current_count INTEGER;
    window_start TIMESTAMP;
BEGIN
    window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
    
    -- Clean up old entries
    DELETE FROM rate_limits 
    WHERE identifier = p_identifier 
      AND endpoint = p_endpoint 
      AND window_start < window_start;
    
    -- Get current count
    SELECT COALESCE(request_count, 0) INTO current_count
    FROM rate_limits
    WHERE identifier = p_identifier
      AND endpoint = p_endpoint
      AND window_start >= window_start;
    
    -- Check if limit exceeded
    IF current_count >= p_limit THEN
        -- Update blocked_until
        UPDATE rate_limits 
        SET blocked_until = NOW() + (p_window_minutes || ' minutes')::INTERVAL
        WHERE identifier = p_identifier AND endpoint = p_endpoint;
        
        RETURN false;
    END IF;
    
    -- Increment counter
    INSERT INTO rate_limits (identifier, endpoint, request_count, window_start)
    VALUES (p_identifier, p_endpoint, 1, NOW())
    ON CONFLICT (identifier, endpoint)
    DO UPDATE SET 
        request_count = rate_limits.request_count + 1,
        updated_at = NOW();
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old security data
CREATE OR REPLACE FUNCTION cleanup_security_data()
RETURNS void AS $$
BEGIN
    -- Clean up old security events (keep for 2 years)
    DELETE FROM security_events 
    WHERE created_at < NOW() - INTERVAL '2 years';
    
    -- Clean up old audit trails (keep for 7 years)
    DELETE FROM audit_trails 
    WHERE retention_until IS NOT NULL AND retention_until < NOW();
    
    -- Clean up old notifications (keep for 6 months)
    DELETE FROM notifications 
    WHERE created_at < NOW() - INTERVAL '6 months'
      AND status IN ('delivered', 'dismissed', 'expired');
    
    -- Clean up old system metrics (keep for 1 year)
    DELETE FROM system_health_metrics 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    -- Clean up processed file uploads with retention policy
    DELETE FROM file_uploads 
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    RAISE NOTICE 'Security data cleanup completed';
END;
$$ LANGUAGE plpgsql;