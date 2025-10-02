-- Dashboard Revamp Database Schema Migration
-- Creates tables for draft persistence and session management

-- ============================================================================
-- DRAFT PROMPTS TABLE
-- ============================================================================

-- Table for storing user draft prompts with persistence
CREATE TABLE IF NOT EXISTS draft_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  mode TEXT NOT NULL DEFAULT 'ideate' CHECK (mode IN ('ideate', 'flow')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_draft_prompts_user_id ON draft_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_draft_prompts_updated_at ON draft_prompts(updated_at DESC);

-- RLS policies
ALTER TABLE draft_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own drafts" ON draft_prompts
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- USER SESSIONS TABLE
-- ============================================================================

-- Table for storing user session state and preferences
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_mode TEXT NOT NULL DEFAULT 'ideate' CHECK (last_mode IN ('ideate', 'flow')),
  sidebar_collapsed BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_active ON user_sessions(last_active DESC);

-- RLS policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- ENHANCED PROMPTS TABLE UPDATES
-- ============================================================================

-- Add columns for chat threading support
ALTER TABLE enhanced_prompts ADD COLUMN IF NOT EXISTS thread_id UUID;
ALTER TABLE enhanced_prompts ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'enhancement' CHECK (message_type IN ('user_input', 'enhancement', 'system'));
ALTER TABLE enhanced_prompts ADD COLUMN IF NOT EXISTS parent_message_id UUID REFERENCES enhanced_prompts(id);

-- Indexes for chat threading
CREATE INDEX IF NOT EXISTS idx_enhanced_prompts_thread_id ON enhanced_prompts(thread_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_prompts_parent_id ON enhanced_prompts(parent_message_id);

-- ============================================================================
-- FUNCTIONS FOR DRAFT MANAGEMENT
-- ============================================================================

-- Function to upsert user draft
CREATE OR REPLACE FUNCTION upsert_user_draft(
  p_user_id UUID,
  p_content TEXT,
  p_mode TEXT DEFAULT 'ideate',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  mode TEXT,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO draft_prompts (user_id, content, mode, metadata)
  VALUES (p_user_id, p_content, p_mode, p_metadata)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    content = EXCLUDED.content,
    mode = EXCLUDED.mode,
    metadata = EXCLUDED.metadata,
    updated_at = NOW()
  RETURNING draft_prompts.id, draft_prompts.content, draft_prompts.mode, draft_prompts.updated_at;
END;
$$;

-- Function to get user draft
CREATE OR REPLACE FUNCTION get_user_draft(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  content TEXT,
  mode TEXT,
  metadata JSONB,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    draft_prompts.id,
    draft_prompts.content,
    draft_prompts.mode,
    draft_prompts.metadata,
    draft_prompts.updated_at
  FROM draft_prompts
  WHERE draft_prompts.user_id = p_user_id
  ORDER BY draft_prompts.updated_at DESC
  LIMIT 1;
END;
$$;

-- Function to upsert user session
CREATE OR REPLACE FUNCTION upsert_user_session(
  p_user_id UUID,
  p_last_mode TEXT DEFAULT 'ideate',
  p_sidebar_collapsed BOOLEAN DEFAULT true,
  p_preferences JSONB DEFAULT '{}'
)
RETURNS TABLE (
  id UUID,
  last_mode TEXT,
  sidebar_collapsed BOOLEAN,
  preferences JSONB,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO user_sessions (user_id, last_mode, sidebar_collapsed, preferences, last_active)
  VALUES (p_user_id, p_last_mode, p_sidebar_collapsed, p_preferences, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    last_mode = EXCLUDED.last_mode,
    sidebar_collapsed = EXCLUDED.sidebar_collapsed,
    preferences = EXCLUDED.preferences,
    last_active = NOW(),
    updated_at = NOW()
  RETURNING user_sessions.id, user_sessions.last_mode, user_sessions.sidebar_collapsed, user_sessions.preferences, user_sessions.updated_at;
END;
$$;

-- Function to get user session
CREATE OR REPLACE FUNCTION get_user_session(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  last_mode TEXT,
  sidebar_collapsed BOOLEAN,
  preferences JSONB,
  last_active TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    user_sessions.id,
    user_sessions.last_mode,
    user_sessions.sidebar_collapsed,
    user_sessions.preferences,
    user_sessions.last_active
  FROM user_sessions
  WHERE user_sessions.user_id = p_user_id;
END;
$$;

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update timestamp trigger for draft_prompts
CREATE TRIGGER update_draft_prompts_updated_at 
  BEFORE UPDATE ON draft_prompts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update timestamp trigger for user_sessions
CREATE TRIGGER update_user_sessions_updated_at 
  BEFORE UPDATE ON user_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE draft_prompts IS 'Stores user draft prompts for persistence across sessions';
COMMENT ON TABLE user_sessions IS 'Stores user session state and preferences';
COMMENT ON FUNCTION upsert_user_draft IS 'Upserts user draft prompt with conflict resolution';
COMMENT ON FUNCTION get_user_draft IS 'Retrieves the latest user draft prompt';
COMMENT ON FUNCTION upsert_user_session IS 'Upserts user session state';
COMMENT ON FUNCTION get_user_session IS 'Retrieves user session state';