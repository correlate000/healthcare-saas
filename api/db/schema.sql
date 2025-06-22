-- Healthcare SaaS Database Schema
-- Designed for enterprise-grade security, anonymization, and GDPR compliance

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Companies table (enterprise organizations)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{
        "enforceSSO": true,
        "allowAnonymousMode": true,
        "dataRetentionDays": 365,
        "requireMFA": false,
        "encryptionLevel": "enterprise"
    }'::jsonb,
    encryption_key_hash VARCHAR(512),
    key_rotation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    compliance_level VARCHAR(20) DEFAULT 'enterprise' CHECK (compliance_level IN ('basic', 'gdpr', 'hipaa', 'enterprise'))
);

-- SSO providers configuration
CREATE TABLE sso_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(20) NOT NULL CHECK (provider_type IN ('saml', 'oauth', 'openid', 'ad')),
    config JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with anonymization support
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    email_hash VARCHAR(512) NOT NULL, -- Hashed email for privacy
    anonymous_id VARCHAR(32) NOT NULL UNIQUE, -- Consistent anonymous identifier
    encrypted_name TEXT, -- Encrypted with company key
    encrypted_department TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'counselor', 'expert')),
    sso_provider_id UUID REFERENCES sso_providers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    encryption_version INTEGER DEFAULT 1,
    
    -- Privacy compliance fields
    consent_given BOOLEAN DEFAULT false,
    consent_date TIMESTAMP WITH TIME ZONE,
    data_retention_until TIMESTAMP WITH TIME ZONE,
    
    INDEX(anonymous_id),
    INDEX(company_id),
    INDEX(email_hash)
);

-- AI Characters (Luna, Aria, Zen)
CREATE TABLE ai_characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    personality_traits JSONB NOT NULL,
    capabilities JSONB NOT NULL,
    voice_config JSONB,
    visual_config JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-Character relationships
CREATE TABLE user_character_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES ai_characters(id),
    relationship_level INTEGER DEFAULT 0 CHECK (relationship_level >= 0 AND relationship_level <= 100),
    trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
    conversation_count INTEGER DEFAULT 0,
    total_interaction_time INTERVAL DEFAULT '0 minutes',
    favorite_topics JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, character_id),
    INDEX(user_id),
    INDEX(character_id)
);

-- Encrypted conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES ai_characters(id),
    encrypted_content TEXT NOT NULL, -- E2E encrypted conversation data
    encryption_metadata JSONB NOT NULL, -- IV, auth tag, algorithm info
    session_type VARCHAR(20) DEFAULT 'chat' CHECK (session_type IN ('chat', 'checkin', 'emergency', 'counselor')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    message_count INTEGER DEFAULT 0,
    sentiment_analysis JSONB, -- Anonymized sentiment data
    is_archived BOOLEAN DEFAULT false,
    
    INDEX(user_id),
    INDEX(character_id),
    INDEX(started_at),
    INDEX(session_type)
);

-- Individual messages within conversations
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    encrypted_content TEXT NOT NULL,
    encryption_metadata JSONB NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'ai')),
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image', 'emoji')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    
    INDEX(conversation_id),
    INDEX(timestamp),
    INDEX(sender_type)
);

-- Daily check-ins and mood tracking
CREATE TABLE mood_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    encrypted_mood_data TEXT NOT NULL, -- Contains mood, energy, notes - all encrypted
    encryption_metadata JSONB NOT NULL,
    checkin_date DATE NOT NULL,
    streak_count INTEGER DEFAULT 1,
    xp_earned INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, checkin_date),
    INDEX(user_id),
    INDEX(checkin_date),
    INDEX(streak_count)
);

-- Team connections (anonymous within company)
CREATE TABLE team_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    anonymous_author_id VARCHAR(32) NOT NULL, -- Anonymous ID from users table
    encrypted_content TEXT NOT NULL,
    encryption_metadata JSONB NOT NULL,
    category VARCHAR(50),
    is_anonymous BOOLEAN DEFAULT true,
    reaction_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- Auto-delete for privacy
    
    INDEX(company_id),
    INDEX(category),
    INDEX(created_at),
    INDEX(anonymous_author_id)
);

-- Daily challenges and gamification
CREATE TABLE daily_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(30) NOT NULL CHECK (challenge_type IN ('checkin', 'exercise', 'mindfulness', 'gratitude', 'social')),
    difficulty VARCHAR(20) DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    xp_reward INTEGER DEFAULT 20,
    requirements JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User challenge completion tracking
CREATE TABLE user_challenge_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES daily_challenges(id),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xp_earned INTEGER NOT NULL,
    completion_data JSONB, -- Encrypted details about completion
    
    UNIQUE(user_id, challenge_id, DATE(completed_at)),
    INDEX(user_id),
    INDEX(challenge_id),
    INDEX(completed_at)
);

-- Content library (articles, videos, exercises)
CREATE TABLE content_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('article', 'video', 'exercise', 'audio')),
    category VARCHAR(100),
    encrypted_content TEXT, -- For sensitive content
    external_url TEXT, -- For external resources
    author VARCHAR(255),
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_duration INTEGER, -- in minutes
    tags JSONB DEFAULT '[]'::jsonb,
    rating DECIMAL(3,2) DEFAULT 0.0,
    view_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX(content_type),
    INDEX(category),
    INDEX(difficulty_level),
    INDEX(is_featured)
);

-- User content interactions
CREATE TABLE user_content_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content_library(id),
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('view', 'like', 'bookmark', 'complete')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX(user_id),
    INDEX(content_id),
    INDEX(interaction_type),
    INDEX(timestamp)
);

-- Achievements and badges system
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    badge_type VARCHAR(20) DEFAULT 'bronze' CHECK (badge_type IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    requirements JSONB NOT NULL, -- Conditions to unlock
    xp_reward INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements tracking
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_data JSONB, -- Track progress towards achievement
    
    UNIQUE(user_id, achievement_id),
    INDEX(user_id),
    INDEX(achievement_id),
    INDEX(unlocked_at)
);

-- Emergency support logs
CREATE TABLE emergency_support_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    support_type VARCHAR(30) NOT NULL CHECK (support_type IN ('crisis', 'urgent', 'information')),
    encrypted_details TEXT,
    encryption_metadata JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'escalated')),
    assigned_counselor_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    INDEX(user_id),
    INDEX(support_type),
    INDEX(status),
    INDEX(created_at)
);

-- Analytics and reporting (anonymized data)
CREATE TABLE analytics_aggregates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    time_period VARCHAR(20) NOT NULL CHECK (time_period IN ('daily', 'weekly', 'monthly', 'quarterly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    anonymized_data JSONB NOT NULL, -- Aggregated, anonymized metrics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id, metric_type, time_period, period_start),
    INDEX(company_id),
    INDEX(metric_type),
    INDEX(time_period),
    INDEX(period_start)
);

-- Privacy audit logs
CREATE TABLE privacy_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(30) NOT NULL,
    anonymous_user_id VARCHAR(32), -- Anonymous ID
    data_type VARCHAR(50),
    success BOOLEAN NOT NULL,
    compliance_flags JSONB DEFAULT '[]'::jsonb,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retention_until TIMESTAMP WITH TIME ZONE, -- Auto-delete audit logs
    
    INDEX(action),
    INDEX(anonymous_user_id),
    INDEX(timestamp),
    INDEX(success)
);

-- Session management for anonymization
CREATE TABLE anonymous_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(64) UNIQUE NOT NULL,
    anonymous_id VARCHAR(32) NOT NULL,
    real_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    access_level VARCHAR(20) DEFAULT 'anonymous' CHECK (access_level IN ('anonymous', 'pseudo-anonymous', 'identified')),
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX(session_id),
    INDEX(anonymous_id),
    INDEX(real_user_id),
    INDEX(expires_at)
);

-- Data retention and cleanup tracking
CREATE TABLE data_retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    data_type VARCHAR(50) NOT NULL,
    retention_period_days INTEGER NOT NULL,
    auto_delete BOOLEAN DEFAULT true,
    encryption_required BOOLEAN DEFAULT true,
    anonymization_required BOOLEAN DEFAULT true,
    last_cleanup TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(company_id, data_type),
    INDEX(company_id),
    INDEX(data_type),
    INDEX(last_cleanup)
);

-- Indexes for performance
CREATE INDEX idx_users_anonymous_id ON users(anonymous_id);
CREATE INDEX idx_conversations_user_date ON conversations(user_id, started_at);
CREATE INDEX idx_messages_conversation_time ON messages(conversation_id, timestamp);
CREATE INDEX idx_mood_checkins_user_date ON mood_checkins(user_id, checkin_date);
CREATE INDEX idx_team_posts_company_date ON team_posts(company_id, created_at);
CREATE INDEX idx_audit_logs_time ON privacy_audit_logs(timestamp);
CREATE INDEX idx_sessions_expires ON anonymous_sessions(expires_at);

-- Triggers for automatic data management
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sso_providers_updated_at BEFORE UPDATE ON sso_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_characters_updated_at BEFORE UPDATE ON ai_characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_character_relationships_updated_at BEFORE UPDATE ON user_character_relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_library_updated_at BEFORE UPDATE ON content_library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically cleanup expired data
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
    -- Delete expired anonymous sessions
    DELETE FROM anonymous_sessions WHERE expires_at < NOW();
    
    -- Delete expired team posts
    DELETE FROM team_posts WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    -- Delete old audit logs based on retention policy
    DELETE FROM privacy_audit_logs WHERE retention_until IS NOT NULL AND retention_until < NOW();
    
    -- Archive old conversations (move to cold storage in production)
    UPDATE conversations 
    SET is_archived = true 
    WHERE ended_at < NOW() - INTERVAL '90 days' 
    AND is_archived = false;
    
END;
$$ LANGUAGE plpgsql;

-- Initial data: Create default AI characters
INSERT INTO ai_characters (id, name, personality_traits, capabilities, voice_config, visual_config) VALUES
(uuid_generate_v4(), 'Luna', 
 '{"primary": "empathetic", "secondary": "calm", "traits": ["understanding", "gentle", "wise", "comforting"]}',
 '{"empathy": 95, "wisdom": 88, "patience": 97, "humor": 72}',
 '{"voice_type": "gentle_female", "speed": "normal", "pitch": "medium"}',
 '{"color_scheme": "purple", "avatar_style": "friendly", "animations": ["gentle_nod", "warm_smile"]}'),

(uuid_generate_v4(), 'Aria', 
 '{"primary": "energetic", "secondary": "optimistic", "traits": ["enthusiastic", "encouraging", "creative", "motivating"]}',
 '{"empathy": 85, "wisdom": 78, "patience": 80, "humor": 95}',
 '{"voice_type": "bright_female", "speed": "slightly_fast", "pitch": "higher"}',
 '{"color_scheme": "teal", "avatar_style": "dynamic", "animations": ["excited_gesture", "encouraging_thumbs_up"]}'),

(uuid_generate_v4(), 'Zen', 
 '{"primary": "peaceful", "secondary": "mindful", "traits": ["serene", "philosophical", "balanced", "grounding"]}',
 '{"empathy": 88, "wisdom": 95, "patience": 99, "humor": 65}',
 '{"voice_type": "calm_unisex", "speed": "slow", "pitch": "low"}',
 '{"color_scheme": "indigo", "avatar_style": "serene", "animations": ["meditation_pose", "slow_breathing"]}');

-- Initial achievements
INSERT INTO achievements (name, description, badge_type, requirements, xp_reward) VALUES
('First Steps', 'Complete your first mood check-in', 'bronze', '{"checkins": 1}', 10),
('Week Warrior', 'Complete 7 consecutive daily check-ins', 'silver', '{"streak": 7}', 50),
('Moon Guardian', 'Build a strong relationship with Luna', 'gold', '{"character": "Luna", "relationship_level": 80}', 100),
('Mindful Master', 'Complete 30 mindfulness exercises', 'gold', '{"mindfulness_exercises": 30}', 150),
('Team Player', 'Make 10 anonymous team posts', 'silver', '{"team_posts": 10}', 75),
('Wisdom Seeker', 'Read 20 articles from the content library', 'silver', '{"articles_read": 20}', 80),
('Legend of Care', 'Maintain a 100-day streak', 'diamond', '{"streak": 100}', 500);

-- Create data retention policies for compliance
INSERT INTO data_retention_policies (company_id, data_type, retention_period_days, auto_delete, encryption_required, anonymization_required) 
SELECT 
    id, 
    data_type, 
    CASE 
        WHEN data_type = 'conversation_data' THEN 365
        WHEN data_type = 'mood_data' THEN 730
        WHEN data_type = 'audit_logs' THEN 2555  -- 7 years
        WHEN data_type = 'team_posts' THEN 90
        ELSE 365
    END,
    true,
    true,
    CASE WHEN data_type != 'audit_logs' THEN true ELSE false END
FROM companies 
CROSS JOIN (VALUES ('conversation_data'), ('mood_data'), ('audit_logs'), ('team_posts'), ('user_data')) AS t(data_type);

-- Create weekly cleanup job (in production, use pg_cron or external scheduler)
-- SELECT cron.schedule('cleanup-expired-data', '0 2 * * 0', 'SELECT cleanup_expired_data();');