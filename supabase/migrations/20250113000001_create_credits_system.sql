-- Create user_credits table for server-authoritative credit storage
CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 50,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credits_log table for audit trail
CREATE TABLE credits_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID,
  action TEXT NOT NULL CHECK (action IN ('debit', 'credit')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_credits_log_user_id ON credits_log(user_id);
CREATE INDEX idx_credits_log_created_at ON credits_log(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_credits_updated_at 
  BEFORE UPDATE ON user_credits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RPC function for atomic credit spending
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id UUID,
  p_prompt_id UUID DEFAULT NULL,
  p_amount INTEGER DEFAULT 1,
  p_reason TEXT DEFAULT 'prompt_enhancement'
)
RETURNS JSON AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
  result JSON;
BEGIN
  -- Get current balance with row lock to prevent race conditions
  SELECT balance INTO current_balance 
  FROM user_credits 
  WHERE user_id = p_user_id 
  FOR UPDATE;
  
  -- If user doesn't exist, create with default balance
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance) 
    VALUES (p_user_id, 50)
    ON CONFLICT (user_id) DO NOTHING;
    current_balance := 50;
  END IF;
  
  -- Check if sufficient balance
  IF current_balance < p_amount THEN
    RETURN json_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'balance', current_balance,
      'required', p_amount
    );
  END IF;
  
  -- Calculate new balance
  new_balance := current_balance - p_amount;
  
  -- Update balance
  UPDATE user_credits 
  SET balance = new_balance 
  WHERE user_id = p_user_id;
  
  -- Log the transaction
  INSERT INTO credits_log (user_id, prompt_id, action, amount, balance_after, reason)
  VALUES (p_user_id, p_prompt_id, 'debit', p_amount, new_balance, p_reason);
  
  -- Return success response
  RETURN json_build_object(
    'success', true,
    'balance', new_balance,
    'spent', p_amount,
    'transaction_id', (SELECT id FROM credits_log WHERE user_id = p_user_id ORDER BY created_at DESC LIMIT 1)
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'transaction_failed',
      'message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function for adding credits
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'credit_purchase'
)
RETURNS JSON AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT balance INTO current_balance 
  FROM user_credits 
  WHERE user_id = p_user_id 
  FOR UPDATE;
  
  -- If user doesn't exist, create with default balance
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance) 
    VALUES (p_user_id, p_amount)
    ON CONFLICT (user_id) DO NOTHING;
    new_balance := p_amount;
  ELSE
    -- Calculate new balance
    new_balance := current_balance + p_amount;
    
    -- Update balance
    UPDATE user_credits 
    SET balance = new_balance 
    WHERE user_id = p_user_id;
  END IF;
  
  -- Log the transaction
  INSERT INTO credits_log (user_id, action, amount, balance_after, reason)
  VALUES (p_user_id, 'credit', p_amount, new_balance, p_reason);
  
  -- Return success response
  RETURN json_build_object(
    'success', true,
    'balance', new_balance,
    'added', p_amount
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'transaction_failed',
      'message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to get user balance
CREATE OR REPLACE FUNCTION get_user_balance(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  user_balance INTEGER;
BEGIN
  SELECT balance INTO user_balance 
  FROM user_credits 
  WHERE user_id = p_user_id;
  
  -- If user doesn't exist, create with default balance
  IF user_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance) 
    VALUES (p_user_id, 50)
    ON CONFLICT (user_id) DO NOTHING;
    user_balance := 50;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'balance', user_balance
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'fetch_failed',
      'message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_credits
CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits" ON user_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for credits_log
CREATE POLICY "Users can view own credit logs" ON credits_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert credit logs" ON credits_log
  FOR INSERT WITH CHECK (true);