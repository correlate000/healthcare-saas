-- Healthcare SaaS Health Data Tables
-- Migration: 002_health_data_tables.sql

-- User health profiles (encrypted sensitive data)
CREATE TABLE user_health_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic demographics (encrypted)
    encrypted_birth_date TEXT,
    encrypted_gender TEXT,
    encrypted_height TEXT, -- in cm
    encrypted_weight TEXT, -- in kg
    
    -- Medical information (encrypted)
    encrypted_blood_type TEXT,
    encrypted_allergies TEXT,
    encrypted_medications TEXT,
    encrypted_medical_conditions TEXT,
    encrypted_emergency_contact TEXT,
    
    -- Privacy and consent
    data_sharing_consent BOOLEAN DEFAULT false,
    research_participation_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    
    -- Metadata
    profile_completion_percentage INTEGER DEFAULT 0,
    last_updated_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Health data entries (symptoms, vitals, etc.)
CREATE TABLE health_data_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Entry type and category
    entry_type VARCHAR(50) NOT NULL, -- 'symptom', 'vital', 'mood', 'medication', 'activity'
    category VARCHAR(100), -- 'respiratory', 'cardiovascular', etc.
    
    -- Encrypted health data
    encrypted_data JSONB NOT NULL, -- All health metrics encrypted
    encryption_metadata JSONB, -- IV, tag, etc.
    
    -- Entry context
    severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 10),
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 100),
    data_source VARCHAR(50) DEFAULT 'manual', -- 'manual', 'device', 'import'
    
    -- Temporal information
    recorded_at TIMESTAMP NOT NULL,
    entry_date DATE NOT NULL,
    duration_minutes INTEGER,
    
    -- Quality and validation
    data_quality_score INTEGER CHECK (data_quality_score BETWEEN 1 AND 100),
    is_validated BOOLEAN DEFAULT false,
    validated_by UUID REFERENCES users(id),
    
    -- Tags and notes
    tags TEXT[],
    encrypted_notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Symptom tracking specific table
CREATE TABLE symptom_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_data_entry_id UUID REFERENCES health_data_entries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Symptom identification
    symptom_code VARCHAR(20), -- ICD-10 or custom codes
    symptom_name VARCHAR(255) NOT NULL,
    body_location VARCHAR(100),
    
    -- Symptom characteristics
    severity INTEGER CHECK (severity BETWEEN 1 AND 10) NOT NULL,
    frequency VARCHAR(50), -- 'constant', 'intermittent', 'occasional'
    duration_description VARCHAR(100),
    
    -- Triggers and relievers
    potential_triggers TEXT[],
    relief_methods TEXT[],
    
    -- Associated symptoms
    associated_symptoms JSONB DEFAULT '[]',
    
    -- Impact assessment
    impact_on_daily_life INTEGER CHECK (impact_on_daily_life BETWEEN 1 AND 10),
    impact_on_work INTEGER CHECK (impact_on_work BETWEEN 1 AND 10),
    impact_on_sleep INTEGER CHECK (impact_on_sleep BETWEEN 1 AND 10),
    
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vital signs tracking
CREATE TABLE vital_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_data_entry_id UUID REFERENCES health_data_entries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Vital measurements (encrypted)
    encrypted_blood_pressure_systolic TEXT,
    encrypted_blood_pressure_diastolic TEXT,
    encrypted_heart_rate TEXT,
    encrypted_temperature TEXT,
    encrypted_respiratory_rate TEXT,
    encrypted_oxygen_saturation TEXT,
    encrypted_blood_glucose TEXT,
    encrypted_weight TEXT,
    
    -- Measurement context
    measurement_method VARCHAR(100),
    device_info JSONB,
    measurement_position VARCHAR(50), -- 'sitting', 'standing', 'lying'
    
    -- Flags for abnormal values
    flags JSONB DEFAULT '{}', -- {'blood_pressure': 'high', 'heart_rate': 'irregular'}
    
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Medication tracking
CREATE TABLE medication_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_data_entry_id UUID REFERENCES health_data_entries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Medication information (encrypted)
    encrypted_medication_name TEXT NOT NULL,
    encrypted_dosage TEXT,
    encrypted_frequency TEXT,
    encrypted_route TEXT, -- 'oral', 'topical', 'injection'
    
    -- Medication details
    medication_type VARCHAR(50), -- 'prescription', 'otc', 'supplement'
    ndc_code VARCHAR(20), -- National Drug Code
    
    -- Administration tracking
    taken_as_prescribed BOOLEAN,
    missed_doses INTEGER DEFAULT 0,
    side_effects TEXT[],
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    
    -- Temporal information
    start_date DATE,
    end_date DATE,
    prescribed_by VARCHAR(255),
    
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Health goals and tracking
CREATE TABLE health_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Goal definition
    goal_type VARCHAR(50) NOT NULL, -- 'weight_loss', 'exercise', 'symptom_reduction'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Target metrics
    target_value DECIMAL(10,2),
    target_unit VARCHAR(20),
    target_date DATE,
    
    -- Current progress
    current_value DECIMAL(10,2),
    progress_percentage INTEGER DEFAULT 0,
    
    -- Goal status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
    priority INTEGER CHECK (priority BETWEEN 1 AND 5) DEFAULT 3,
    
    -- Milestones
    milestones JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Health insights and recommendations
CREATE TABLE health_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Insight details
    insight_type VARCHAR(50) NOT NULL, -- 'trend', 'recommendation', 'alert', 'pattern'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Insight data
    data_points JSONB, -- Related data points
    confidence_score INTEGER CHECK (confidence_score BETWEEN 1 AND 100),
    severity VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'critical'
    
    -- AI analysis reference
    ai_analysis_id UUID,
    
    -- User interaction
    is_read BOOLEAN DEFAULT false,
    user_feedback INTEGER CHECK (user_feedback BETWEEN 1 AND 5),
    user_notes TEXT,
    
    -- Temporal relevance
    relevant_from TIMESTAMP DEFAULT NOW(),
    relevant_until TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Health reports (periodic summaries)
CREATE TABLE health_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Report details
    report_type VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'quarterly', 'annual'
    title VARCHAR(255) NOT NULL,
    
    -- Report period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Report content (encrypted)
    encrypted_content JSONB NOT NULL,
    encryption_metadata JSONB,
    
    -- Report metadata
    total_entries INTEGER DEFAULT 0,
    key_insights TEXT[],
    recommended_actions TEXT[],
    
    -- Generation info
    generated_by VARCHAR(50) DEFAULT 'system', -- 'system', 'user', 'ai'
    generation_duration_ms INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Health data sharing and exports
CREATE TABLE health_data_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Export details
    export_type VARCHAR(50) NOT NULL, -- 'pdf', 'csv', 'json', 'fhir'
    data_types TEXT[] NOT NULL, -- ['symptoms', 'vitals', 'medications']
    
    -- Time range
    date_from DATE,
    date_to DATE,
    
    -- Export file info
    file_name VARCHAR(255),
    file_size INTEGER,
    file_path TEXT,
    
    -- Security
    encryption_enabled BOOLEAN DEFAULT true,
    password_protected BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for health data tables
CREATE INDEX idx_health_profiles_user_id ON user_health_profiles(user_id);

CREATE INDEX idx_health_entries_user_id ON health_data_entries(user_id);
CREATE INDEX idx_health_entries_type ON health_data_entries(entry_type);
CREATE INDEX idx_health_entries_date ON health_data_entries(entry_date);
CREATE INDEX idx_health_entries_recorded_at ON health_data_entries(recorded_at);

CREATE INDEX idx_symptom_entries_user_id ON symptom_entries(user_id);
CREATE INDEX idx_symptom_entries_code ON symptom_entries(symptom_code);
CREATE INDEX idx_symptom_entries_severity ON symptom_entries(severity);

CREATE INDEX idx_vital_signs_user_id ON vital_signs(user_id);
CREATE INDEX idx_vital_signs_recorded_at ON vital_signs(recorded_at);

CREATE INDEX idx_medication_entries_user_id ON medication_entries(user_id);
CREATE INDEX idx_medication_entries_type ON medication_entries(medication_type);

CREATE INDEX idx_health_goals_user_id ON health_goals(user_id);
CREATE INDEX idx_health_goals_status ON health_goals(status);

CREATE INDEX idx_health_insights_user_id ON health_insights(user_id);
CREATE INDEX idx_health_insights_type ON health_insights(insight_type);
CREATE INDEX idx_health_insights_read ON health_insights(is_read);

CREATE INDEX idx_health_reports_user_id ON health_reports(user_id);
CREATE INDEX idx_health_reports_period ON health_reports(period_start, period_end);

CREATE INDEX idx_health_exports_user_id ON health_data_exports(user_id);
CREATE INDEX idx_health_exports_status ON health_data_exports(status);

-- Update triggers
CREATE TRIGGER update_health_profiles_updated_at BEFORE UPDATE ON user_health_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_entries_updated_at BEFORE UPDATE ON health_data_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_goals_updated_at BEFORE UPDATE ON health_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate health score based on recent data
CREATE OR REPLACE FUNCTION calculate_health_score(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    symptom_score INTEGER := 100;
    vital_score INTEGER := 100;
    medication_score INTEGER := 100;
    activity_score INTEGER := 100;
    final_score INTEGER;
BEGIN
    -- Calculate symptom-based score (lower severity = higher score)
    SELECT COALESCE(100 - (AVG(severity) * 10), 100) INTO symptom_score
    FROM symptom_entries 
    WHERE user_id = p_user_id 
      AND recorded_at >= NOW() - (p_days || ' days')::INTERVAL;
    
    -- Calculate medication adherence score
    SELECT COALESCE(AVG(CASE WHEN taken_as_prescribed THEN 100 ELSE 50 END), 100) INTO medication_score
    FROM medication_entries 
    WHERE user_id = p_user_id 
      AND recorded_at >= NOW() - (p_days || ' days')::INTERVAL;
    
    -- Combined health score
    final_score := (symptom_score * 0.4 + vital_score * 0.3 + medication_score * 0.2 + activity_score * 0.1)::INTEGER;
    
    -- Ensure score is between 0 and 100
    final_score := GREATEST(0, LEAST(100, final_score));
    
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;