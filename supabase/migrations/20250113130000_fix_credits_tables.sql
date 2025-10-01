-- Check and fix the user_credits table structure
DO $$
BEGIN
    -- Check if balance column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_credits' AND column_name = 'balance') THEN
        -- If credits_remaining exists, rename it to balance
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_credits' AND column_name = 'credits_remaining') THEN
            ALTER TABLE user_credits RENAME COLUMN credits_remaining TO balance;
        ELSE
            -- Add balance column if neither exists
            ALTER TABLE user_credits ADD COLUMN balance INTEGER NOT NULL DEFAULT 50;
        END IF;
    END IF;
END $$;

-- Ensure the table has the correct structure
ALTER TABLE user_credits 
  ALTER COLUMN balance SET NOT NULL,
  ALTER COLUMN balance SET DEFAULT 50;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_credits' AND column_name = 'updated_at') THEN
        ALTER TABLE user_credits ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Recreate the RPC functions with correct column names
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
    ON CONFLICT (user_id) DO UPDATE SET balance = 50;
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
  SET balance = new_balance, updated_at = NOW()
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
  
  -- If user doesn't exist, create with default balance plus the amount
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance) 
    VALUES (p_user_id, 50 + p_amount)
    ON CONFLICT (user_id) DO UPDATE SET balance = 50 + p_amount;
    new_balance := 50 + p_amount;
  ELSE
    -- Calculate new balance
    new_balance := current_balance + p_amount;
    
    -- Update balance
    UPDATE user_credits 
    SET balance = new_balance, updated_at = NOW()
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
    ON CONFLICT (user_id) DO UPDATE SET balance = 50;
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