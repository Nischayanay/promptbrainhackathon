-- Update existing credit system to use 20 initial credits instead of 50
-- This integrates with the existing user_credits system

-- ============================================================================
-- UPDATE DEFAULT CREDITS FOR NEW USERS
-- ============================================================================

-- Update the get_user_balance function to create users with 20 credits instead of 50
CREATE OR REPLACE FUNCTION get_user_balance(p_user_id UUID)
RETURNS JSON AS $
DECLARE
  user_balance INTEGER;
BEGIN
  SELECT balance INTO user_balance 
  FROM user_credits 
  WHERE user_id = p_user_id;
  
  -- If user doesn't exist, create with 20 credits (instead of 50)
  IF user_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance) 
    VALUES (p_user_id, 20)
    ON CONFLICT (user_id) DO NOTHING;
    user_balance := 20;
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
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the spend_credits function to create users with 20 credits instead of 50
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id UUID,
  p_prompt_id UUID DEFAULT NULL,
  p_amount INTEGER DEFAULT 1,
  p_reason TEXT DEFAULT 'prompt_enhancement'
)
RETURNS JSON AS $
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
  
  -- If user doesn't exist, create with 20 credits (instead of 50)
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance) 
    VALUES (p_user_id, 20)
    ON CONFLICT (user_id) DO NOTHING;
    current_balance := 20;
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
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the add_credits function to create users with 20 credits instead of 50
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'credit_purchase'
)
RETURNS JSON AS $
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT balance INTO current_balance 
  FROM user_credits 
  WHERE user_id = p_user_id 
  FOR UPDATE;
  
  -- If user doesn't exist, create with 20 credits (instead of 50)
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance) 
    VALUES (p_user_id, 20)
    ON CONFLICT (user_id) DO NOTHING;
    new_balance := 20;
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
$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION get_user_balance IS 'Gets user credit balance, creates new users with 20 initial credits';
COMMENT ON FUNCTION spend_credits IS 'Spends user credits atomically, creates new users with 20 initial credits';
COMMENT ON FUNCTION add_credits IS 'Adds credits to user balance, creates new users with 20 initial credits';