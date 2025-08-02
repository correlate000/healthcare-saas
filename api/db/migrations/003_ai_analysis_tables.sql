-- Healthcare SaaS AI Analysis Tables
-- Migration: 003_ai_analysis_tables.sql

-- AI analysis sessions
CREATE TABLE ai_analysis_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Session metadata
    session_type VARCHAR(50) NOT NULL, -- 'symptom_analysis', 'risk_assessment', 'trend_analysis'
    model_version VARCHAR(50) NOT NULL,
    model_provider VARCHAR(50) NOT NULL, -- 'openai', 'anthropic', 'local'
    
    -- Input data
    input_data_hash VARCHAR(64), -- SHA256 hash of input for caching
    data_points_count INTEGER DEFAULT 0,
    time_range_days INTEGER,
    
    -- Analysis parameters
    analysis_config JSONB DEFAULT '{}',
    confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
    
    -- Processing info
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    processing_duration_ms INTEGER,
    
    -- Resource usage
    tokens_used INTEGER,
    api_cost_cents INTEGER,
    
    -- Error handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI analysis results
CREATE TABLE ai_analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES ai_analysis_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Result metadata
    result_type VARCHAR(50) NOT NULL, -- 'risk_score', 'recommendation', 'pattern', 'prediction'
    category VARCHAR(100), -- 'cardiovascular', 'respiratory', 'mental_health'
    
    -- Analysis output
    analysis_result JSONB NOT NULL,
    confidence_score DECIMAL(5,4) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
    
    -- Risk assessment
    risk_level VARCHAR(20), -- 'low', 'moderate', 'high', 'critical'
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    risk_factors JSONB DEFAULT '[]',
    
    -- Recommendations
    recommendations JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]',
    follow_up_suggested BOOLEAN DEFAULT false,
    
    -- Clinical relevance
    clinical_significance VARCHAR(20) DEFAULT 'informational', -- 'informational', 'notable', 'concerning', 'urgent'
    medical_disclaimer TEXT,
    
    -- Validation and feedback
    is_validated BOOLEAN DEFAULT false,
    validated_by UUID REFERENCES users(id),
    user_feedback_rating INTEGER CHECK (user_feedback_rating BETWEEN 1 AND 5),
    user_feedback_text TEXT,
    
    -- Temporal relevance
    relevant_until TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Symptom pattern detection
CREATE TABLE symptom_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_session_id UUID REFERENCES ai_analysis_sessions(id),
    
    -- Pattern identification
    pattern_type VARCHAR(50) NOT NULL, -- 'recurring', 'seasonal', 'triggered', 'progressive'
    pattern_name VARCHAR(255),
    
    -- Pattern details
    symptoms_involved TEXT[] NOT NULL,
    frequency_pattern VARCHAR(100), -- 'daily', 'weekly', 'monthly', 'irregular'
    duration_pattern VARCHAR(100),
    severity_trend VARCHAR(50), -- 'increasing', 'decreasing', 'stable', 'fluctuating'
    
    -- Temporal analysis
    first_occurrence DATE,
    last_occurrence DATE,
    occurrences_count INTEGER DEFAULT 1,
    
    -- Pattern strength
    confidence_level DECIMAL(3,2) NOT NULL CHECK (confidence_level BETWEEN 0 AND 1),
    statistical_significance DECIMAL(5,4),
    
    -- Associated factors
    potential_triggers JSONB DEFAULT '[]',
    environmental_factors JSONB DEFAULT '[]',
    lifestyle_correlations JSONB DEFAULT '[]',
    
    -- Impact assessment
    quality_of_life_impact INTEGER CHECK (quality_of_life_impact BETWEEN 1 AND 10),
    productivity_impact INTEGER CHECK (productivity_impact BETWEEN 1 AND 10),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Health risk predictions
CREATE TABLE health_risk_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_session_id UUID REFERENCES ai_analysis_sessions(id),
    
    -- Risk identification
    risk_category VARCHAR(100) NOT NULL, -- 'cardiovascular', 'diabetes', 'mental_health'
    risk_condition VARCHAR(255) NOT NULL,
    icd_10_code VARCHAR(10),
    
    -- Prediction details
    predicted_probability DECIMAL(5,4) NOT NULL CHECK (predicted_probability BETWEEN 0 AND 1),
    risk_timeline VARCHAR(50), -- '1_month', '3_months', '6_months', '1_year', '5_years'
    confidence_interval JSONB, -- {'lower': 0.15, 'upper': 0.35}
    
    -- Risk factors
    contributing_factors JSONB NOT NULL,
    modifiable_factors JSONB DEFAULT '[]',
    non_modifiable_factors JSONB DEFAULT '[]',
    
    -- Prevention strategies
    prevention_recommendations JSONB DEFAULT '[]',
    lifestyle_modifications JSONB DEFAULT '[]',
    monitoring_suggestions JSONB DEFAULT '[]',
    
    -- Clinical context
    baseline_risk DECIMAL(5,4), -- Population baseline
    relative_risk DECIMAL(5,2), -- Compared to baseline
    
    -- Model information
    model_name VARCHAR(100),
    model_accuracy DECIMAL(5,4),
    training_data_size INTEGER,
    
    -- Validation
    is_clinically_reviewed BOOLEAN DEFAULT false,
    reviewed_by VARCHAR(255),
    review_notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI-generated health insights
CREATE TABLE ai_health_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_session_id UUID REFERENCES ai_analysis_sessions(id),
    
    -- Insight details
    insight_category VARCHAR(50) NOT NULL, -- 'trend', 'anomaly', 'improvement', 'deterioration'
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    detailed_analysis TEXT,
    
    -- Supporting data
    data_evidence JSONB NOT NULL,
    statistical_measures JSONB,
    
    -- Insight metrics
    importance_score INTEGER CHECK (importance_score BETWEEN 1 AND 10),
    urgency_level VARCHAR(20) DEFAULT 'routine', -- 'routine', 'priority', 'urgent'
    confidence_level DECIMAL(3,2) NOT NULL,
    
    -- Actionability
    actionable_recommendations JSONB DEFAULT '[]',
    next_steps JSONB DEFAULT '[]',
    
    -- User engagement
    is_acknowledged BOOLEAN DEFAULT false,
    user_interest_level INTEGER CHECK (user_interest_level BETWEEN 1 AND 5),
    user_action_taken BOOLEAN DEFAULT false,
    
    -- Temporal relevance
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ML model performance tracking
CREATE TABLE ml_model_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Model identification
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'classification', 'regression', 'clustering'
    
    -- Performance metrics
    accuracy DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    auc_roc DECIMAL(5,4),
    
    -- Evaluation dataset
    test_dataset_size INTEGER,
    evaluation_date DATE,
    
    -- Model deployment
    is_active BOOLEAN DEFAULT false,
    deployment_date TIMESTAMP,
    
    -- Performance over time
    prediction_count INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    false_positives INTEGER DEFAULT 0,
    false_negatives INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- AI conversation logs (for chatbot interactions)
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Conversation metadata
    conversation_type VARCHAR(50) NOT NULL, -- 'health_check', 'symptom_inquiry', 'general_support'
    session_id VARCHAR(255),
    
    -- Message details
    message_role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    message_content TEXT NOT NULL,
    
    -- AI model info
    model_used VARCHAR(100),
    tokens_consumed INTEGER,
    response_time_ms INTEGER,
    
    -- Content analysis
    sentiment_score DECIMAL(3,2), -- -1 to 1
    intent_detected VARCHAR(100),
    entities_extracted JSONB DEFAULT '[]',
    
    -- Quality metrics
    response_quality_score INTEGER CHECK (response_quality_score BETWEEN 1 AND 10),
    user_satisfaction INTEGER CHECK (user_satisfaction BETWEEN 1 AND 5),
    
    -- Safety and compliance
    content_flagged BOOLEAN DEFAULT false,
    medical_advice_given BOOLEAN DEFAULT false,
    disclaimer_shown BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI training data (anonymized for model improvement)
CREATE TABLE ai_training_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Data source
    source_type VARCHAR(50) NOT NULL, -- 'user_feedback', 'expert_annotation', 'synthetic'
    anonymized_user_id VARCHAR(32),
    
    -- Training sample
    input_features JSONB NOT NULL,
    target_labels JSONB NOT NULL,
    
    -- Data quality
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 10),
    is_validated BOOLEAN DEFAULT false,
    validation_source VARCHAR(100),
    
    -- Usage tracking
    used_in_training BOOLEAN DEFAULT false,
    model_versions TEXT[],
    
    -- Privacy compliance
    consent_given BOOLEAN DEFAULT true,
    retention_until TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for AI tables
CREATE INDEX idx_ai_sessions_user_id ON ai_analysis_sessions(user_id);
CREATE INDEX idx_ai_sessions_status ON ai_analysis_sessions(status);
CREATE INDEX idx_ai_sessions_type ON ai_analysis_sessions(session_type);
CREATE INDEX idx_ai_sessions_completed ON ai_analysis_sessions(completed_at);

CREATE INDEX idx_ai_results_session_id ON ai_analysis_results(session_id);
CREATE INDEX idx_ai_results_user_id ON ai_analysis_results(user_id);
CREATE INDEX idx_ai_results_type ON ai_analysis_results(result_type);
CREATE INDEX idx_ai_results_risk_level ON ai_analysis_results(risk_level);

CREATE INDEX idx_symptom_patterns_user_id ON symptom_patterns(user_id);
CREATE INDEX idx_symptom_patterns_type ON symptom_patterns(pattern_type);
CREATE INDEX idx_symptom_patterns_active ON symptom_patterns(is_active);

CREATE INDEX idx_risk_predictions_user_id ON health_risk_predictions(user_id);
CREATE INDEX idx_risk_predictions_category ON health_risk_predictions(risk_category);
CREATE INDEX idx_risk_predictions_probability ON health_risk_predictions(predicted_probability);

CREATE INDEX idx_ai_insights_user_id ON ai_health_insights(user_id);
CREATE INDEX idx_ai_insights_category ON ai_health_insights(insight_category);
CREATE INDEX idx_ai_insights_importance ON ai_health_insights(importance_score);

CREATE INDEX idx_ml_performance_model ON ml_model_performance(model_name, model_version);
CREATE INDEX idx_ml_performance_active ON ml_model_performance(is_active);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_type ON ai_conversations(conversation_type);
CREATE INDEX idx_ai_conversations_created ON ai_conversations(created_at);

CREATE INDEX idx_training_data_source ON ai_training_data(source_type);
CREATE INDEX idx_training_data_quality ON ai_training_data(quality_score);
CREATE INDEX idx_training_data_validated ON ai_training_data(is_validated);

-- Update triggers
CREATE TRIGGER update_symptom_patterns_updated_at BEFORE UPDATE ON symptom_patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ml_performance_updated_at BEFORE UPDATE ON ml_model_performance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get AI analysis summary for a user
CREATE OR REPLACE FUNCTION get_ai_analysis_summary(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
    summary JSONB := '{}';
    total_analyses INTEGER;
    avg_risk_score DECIMAL(5,2);
    active_patterns INTEGER;
    recent_insights INTEGER;
BEGIN
    -- Count total analyses
    SELECT COUNT(*) INTO total_analyses
    FROM ai_analysis_sessions
    WHERE user_id = p_user_id
      AND completed_at >= NOW() - (p_days || ' days')::INTERVAL
      AND status = 'completed';
    
    -- Calculate average risk score
    SELECT AVG(risk_score) INTO avg_risk_score
    FROM ai_analysis_results
    WHERE user_id = p_user_id
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
      AND risk_score IS NOT NULL;
    
    -- Count active patterns
    SELECT COUNT(*) INTO active_patterns
    FROM symptom_patterns
    WHERE user_id = p_user_id AND is_active = true;
    
    -- Count recent insights
    SELECT COUNT(*) INTO recent_insights
    FROM ai_health_insights
    WHERE user_id = p_user_id
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
    
    -- Build summary JSON
    summary := jsonb_build_object(
        'total_analyses', COALESCE(total_analyses, 0),
        'average_risk_score', COALESCE(avg_risk_score, 0),
        'active_patterns', COALESCE(active_patterns, 0),
        'recent_insights', COALESCE(recent_insights, 0),
        'analysis_period_days', p_days,
        'generated_at', NOW()
    );
    
    RETURN summary;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old AI data
CREATE OR REPLACE FUNCTION cleanup_old_ai_data()
RETURNS void AS $$
BEGIN
    -- Clean up old completed analysis sessions (keep for 1 year)
    DELETE FROM ai_analysis_sessions
    WHERE status = 'completed'
      AND completed_at < NOW() - INTERVAL '1 year';
    
    -- Clean up expired insights
    DELETE FROM ai_health_insights
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    -- Clean up old conversation logs (keep for 6 months)
    DELETE FROM ai_conversations
    WHERE created_at < NOW() - INTERVAL '6 months';
    
    -- Clean up old training data that has exceeded retention
    DELETE FROM ai_training_data
    WHERE retention_until IS NOT NULL AND retention_until < NOW();
    
    RAISE NOTICE 'Old AI data cleanup completed';
END;
$$ LANGUAGE plpgsql;