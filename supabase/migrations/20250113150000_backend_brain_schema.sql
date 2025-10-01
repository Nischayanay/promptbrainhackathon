-- Backend Brain Database Schema Migration
-- Creates all tables and functions needed for the Backend Brain system

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Enhanced prompts with full metadata
CREATE TABLE IF NOT EXISTS enhanced_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text TEXT NOT NULL,
  enhanced_text TEXT NOT NULL,
  enhanced_json JSONB NOT NULL,
  domain TEXT NOT NULL,
  techniques TEXT[] DEFAULT '{}',
  provenance JSONB NOT NULL,
  quality_score DECIMAL(3,2) NOT NULL CHECK (quality_score >= 0 AND quality_score <= 1),
  enhancement_ratio DECIMAL(5,2) NOT NULL CHECK (enhancement_ratio > 0),
  processing_time_ms INTEGER NOT NULL CHECK (processing_time_ms > 0),
  session_id TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domain knowledge templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  technique TEXT NOT NULL,
  framework TEXT,
  content JSONB NOT NULL,
  few_shots JSONB DEFAULT '[]',
  success_score DECIMAL(3,2) DEFAULT 0.5 CHECK (success_score >= 0 AND success_score <= 1),
  usage_count INTEGER DEFAULT 0 CHECK (usage_count >= 0),
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User feedback for learning
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enhanced_prompt_id UUID REFERENCES enhanced_prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('copy', 'save', 'regenerate', 'rate')),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Credit transactions (extends existing system)
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('debit', 'credit', 'refund')),
  reference_id UUID, -- references enhanced_prompts(id) for debits
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Vector embeddings for semantic search
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('template', 'example', 'domain_knowledge')),
  embedding vector(1536), -- OpenAI embedding dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Enhanced prompts indexes
CREATE INDEX IF NOT EXISTS idx_enhanced_prompts_user_id ON enhanced_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_prompts_domain ON enhanced_prompts(domain);
CREATE INDEX IF NOT EXISTS idx_enhanced_prompts_quality ON enhanced_prompts(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_enhanced_prompts_created_at ON enhanced_prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enhanced_prompts_session ON enhanced_prompts(session_id) WHERE session_id IS NOT NULL;

-- Templates indexes
CREATE INDEX IF NOT EXISTS idx_templates_domain ON templates(domain);
CREATE INDEX IF NOT EXISTS idx_templates_technique ON templates(technique);
CREATE INDEX IF NOT EXISTS idx_templates_success ON templates(success_score DESC);
CREATE INDEX IF NOT EXISTS idx_templates_usage ON templates(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_templates_last_used ON templates(last_used DESC NULLS LAST);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_enhanced_prompt ON feedback(enhanced_prompt_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_action ON feedback(action);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp DESC);

-- Credit transactions indexes
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_timestamp ON credit_transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_reference ON credit_transactions(reference_id) WHERE reference_id IS NOT NULL;

-- Embeddings indexes
CREATE INDEX IF NOT EXISTS idx_embeddings_content ON embeddings(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================================
-- VECTOR SEARCH FUNCTIONS
-- ============================================================================

-- Function for similarity search of templates
CREATE OR REPLACE FUNCTION match_templates(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  domain_filter text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  domain text,
  technique text,
  content jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.domain,
    t.technique,
    t.content,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM templates t
  JOIN embeddings e ON e.content_id = t.id AND e.content_type = 'template'
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
    AND (domain_filter IS NULL OR t.domain = domain_filter)
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function for similarity search of examples
CREATE OR REPLACE FUNCTION match_examples(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  domain_filter text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  domain text,
  content jsonb,
  success_score decimal,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.domain,
    t.few_shots,
    t.success_score,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM templates t
  JOIN embeddings e ON e.content_id = t.id AND e.content_type = 'example'
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
    AND (domain_filter IS NULL OR t.domain = domain_filter)
    AND jsonb_array_length(t.few_shots) > 0
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- CREDIT MANAGEMENT FUNCTIONS
-- ============================================================================

-- Function to get user credit balance
CREATE OR REPLACE FUNCTION get_user_credits(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current balance from user metadata or calculate from transactions
  SELECT COALESCE(
    (raw_user_meta_data->>'credit_balance')::INTEGER,
    COALESCE(
      (SELECT SUM(
        CASE 
          WHEN transaction_type = 'credit' THEN amount
          WHEN transaction_type = 'debit' THEN -amount
          WHEN transaction_type = 'refund' THEN amount
          ELSE 0
        END
      ) FROM credit_transactions WHERE user_id = user_uuid),
      100 -- Default starting balance
    )
  ) INTO current_balance
  FROM auth.users 
  WHERE id = user_uuid;
  
  RETURN COALESCE(current_balance, 0);
END;
$$;

-- Function to deduct credits with transaction logging
CREATE OR REPLACE FUNCTION deduct_credits(
  user_uuid UUID,
  amount_to_deduct INTEGER,
  reference_uuid UUID DEFAULT NULL,
  description_text TEXT DEFAULT 'Backend Brain enhancement'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Get current balance
  current_balance := get_user_credits(user_uuid);
  
  -- Check if user has sufficient credits
  IF current_balance < amount_to_deduct THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate new balance
  new_balance := current_balance - amount_to_deduct;
  
  -- Insert transaction record
  INSERT INTO credit_transactions (
    user_id,
    amount,
    transaction_type,
    reference_id,
    description,
    metadata
  ) VALUES (
    user_uuid,
    amount_to_deduct,
    'debit',
    reference_uuid,
    description_text,
    jsonb_build_object('balance_before', current_balance, 'balance_after', new_balance)
  );
  
  -- Update user balance in metadata
  UPDATE auth.users 
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('credit_balance', new_balance)
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$;

-- ============================================================================
-- ANALYTICS AND REPORTING FUNCTIONS
-- ============================================================================

-- Function to get enhancement statistics
CREATE OR REPLACE FUNCTION get_enhancement_stats(
  user_uuid UUID DEFAULT NULL,
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_enhancements BIGINT,
  avg_quality_score DECIMAL,
  avg_enhancement_ratio DECIMAL,
  avg_processing_time DECIMAL,
  top_domain TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_enhancements,
    AVG(ep.quality_score) as avg_quality_score,
    AVG(ep.enhancement_ratio) as avg_enhancement_ratio,
    AVG(ep.processing_time_ms) as avg_processing_time,
    MODE() WITHIN GROUP (ORDER BY ep.domain) as top_domain
  FROM enhanced_prompts ep
  WHERE (user_uuid IS NULL OR ep.user_id = user_uuid)
    AND ep.created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE enhanced_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Enhanced prompts policies
CREATE POLICY "Users can view their own enhanced prompts" ON enhanced_prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enhanced prompts" ON enhanced_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can view their own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credit transactions policies
CREATE POLICY "Users can view their own credit transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Templates and embeddings are publicly readable (no user-specific data)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are publicly readable" ON templates
  FOR SELECT USING (true);

CREATE POLICY "Embeddings are publicly readable" ON embeddings
  FOR SELECT USING (true);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_enhanced_prompts_updated_at 
  BEFORE UPDATE ON enhanced_prompts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at 
  BEFORE UPDATE ON templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- Insert default templates for each domain
INSERT INTO templates (domain, technique, framework, content, few_shots, success_score) VALUES
('marketing', 'AIDA Framework', 'AIDA', 
 '{"structure": ["Attention", "Interest", "Desire", "Action"], "description": "Classic marketing framework for persuasive content"}',
 '[{"input": "Write an email about our new product", "output": "Subject: Revolutionary New Product That Will Transform Your Workflow\n\nAttention: Are you tired of spending hours on repetitive tasks?\nInterest: Our new AI-powered tool automates 90% of your daily workflow...\nDesire: Imagine having 3 extra hours every day to focus on what matters...\nAction: Click here to start your free trial today!"}]',
 0.85),

('design', 'Design Principles', 'UI/UX', 
 '{"principles": ["Contrast", "Repetition", "Alignment", "Proximity"], "description": "Fundamental design principles for effective visual communication"}',
 '[{"input": "Design a landing page", "output": "Landing Page Design Brief:\n\n1. CONTRAST: Use bold headlines against subtle backgrounds\n2. REPETITION: Consistent color scheme and typography throughout\n3. ALIGNMENT: Grid-based layout with clear visual hierarchy\n4. PROXIMITY: Group related elements together\n\nKey Elements:\n- Hero section with compelling headline\n- Clear value proposition\n- Social proof testimonials\n- Strong call-to-action button"}]',
 0.80),

('coding', 'Clean Code', 'Software Engineering', 
 '{"principles": ["Single Responsibility", "DRY", "SOLID"], "description": "Best practices for writing maintainable, scalable code"}',
 '[{"input": "Write a function to process user data", "output": "```typescript\n// Single Responsibility: Each function has one clear purpose\ninterface UserData {\n  id: string;\n  email: string;\n  name: string;\n}\n\n// Validate user data\nfunction validateUserData(data: unknown): UserData {\n  // Validation logic here\n  return data as UserData;\n}\n\n// Process validated user data\nfunction processUserData(userData: UserData): ProcessedUser {\n  return {\n    ...userData,\n    processedAt: new Date(),\n    status: 'active'\n  };\n}\n```"}]',
 0.90),

('psychology', 'Behavioral Psychology', 'Persuasion', 
 '{"concepts": ["Social Proof", "Scarcity", "Authority", "Reciprocity"], "description": "Psychological principles for influence and persuasion"}',
 '[{"input": "Convince users to sign up", "output": "Psychological Persuasion Strategy:\n\n1. SOCIAL PROOF: \"Join 50,000+ satisfied users\"\n2. SCARCITY: \"Limited time offer - only 100 spots left\"\n3. AUTHORITY: \"Recommended by industry experts\"\n4. RECIPROCITY: \"Free valuable resource in exchange for email\"\n\nImplementation:\n- Show user testimonials and reviews\n- Display real-time signup counter\n- Feature expert endorsements\n- Offer immediate value upfront"}]',
 0.75),

('business', 'Strategic Planning', 'Business Strategy', 
 '{"frameworks": ["SWOT", "Porter Five Forces", "Business Model Canvas"], "description": "Strategic frameworks for business analysis and planning"}',
 '[{"input": "Create a business strategy", "output": "Strategic Business Plan Framework:\n\n1. SITUATION ANALYSIS (SWOT):\n   - Strengths: Core competencies and advantages\n   - Weaknesses: Areas for improvement\n   - Opportunities: Market gaps and trends\n   - Threats: Competition and risks\n\n2. COMPETITIVE ANALYSIS (Porter Five Forces):\n   - Supplier power, buyer power, competitive rivalry\n   - Threat of substitutes and new entrants\n\n3. BUSINESS MODEL:\n   - Value proposition and revenue streams\n   - Key partnerships and resources\n   - Cost structure and customer segments"}]',
 0.82);

-- Create initial embeddings (placeholder - in real implementation, these would be generated)
INSERT INTO embeddings (content_id, content_type, embedding, metadata) 
SELECT 
  id, 
  'template', 
  array_fill(0.1, ARRAY[1536])::vector, -- Placeholder embedding
  jsonb_build_object('domain', domain, 'technique', technique)
FROM templates;

COMMENT ON TABLE enhanced_prompts IS 'Stores enhanced prompts with full metadata and provenance tracking';
COMMENT ON TABLE templates IS 'Domain-specific knowledge templates and frameworks';
COMMENT ON TABLE feedback IS 'User feedback for continuous learning and improvement';
COMMENT ON TABLE credit_transactions IS 'Credit transaction history for usage tracking';
COMMENT ON TABLE embeddings IS 'Vector embeddings for semantic search and similarity matching';