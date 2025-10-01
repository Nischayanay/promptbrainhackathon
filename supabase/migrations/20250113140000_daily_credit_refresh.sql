-- Add daily credit refresh system
-- Add last_refresh_date column to track when credits were last refreshed
ALTER TABLE user_credits 
ADD COLUMN IF NOT EXISTS last_refresh_date DATE DEFAULT CURRENT_DATE;

-- Update existing users to have today's date
UPDATE user_credits 
SET last_refresh_date = CURRENT_DATE 
WHERE last_refresh_date IS NULL;

-- RPC function to refresh daily credits
CREATE OR REPLACE FUNCTION refresh_daily_credits(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  current_balance INTEGER;
  last_refresh DATE;
  credits_to_add INTEGER;
  new_balance INTEGER;
BEGIN
  -- Get current balance and last refresh date with row lock
  SELECT balance, last_refresh_date INTO current_balance, last_refresh
  FROM user_credits 
  WHERE user_id = p_user_id 
  FOR UPDATE;
  
  -- If user doesn't exist, create with 50 credits and today's date
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance, last_refresh_date) 
    VALUES (p_user_id, 50, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE SET 
      balance = 50, 
      last_refresh_date = CURRENT_DATE,
      updated_at = NOW();
    
    -- Log the initial credit grant
    INSERT INTO credits_log (user_id, action, amount, balance_after, reason)
    VALUES (p_user_id, 'credit', 50, 50, 'initial_daily_credits');
    
    RETURN json_build_object(
      'success', true,
      'balance', 50,
      'credits_added', 50,
      'refresh_type', 'initial'
    );
  END IF;
  
  -- Check if refresh is needed (last refresh was before today)
  IF last_refresh < CURRENT_DATE THEN
    -- Calculate days since last refresh
    credits_to_add := 50 * (CURRENT_DATE - last_refresh);
    
    -- Cap maximum credits to prevent abuse (max 7 days = 350 credits)
    IF credits_to_add > 350 THEN
      credits_to_add := 350;
    END IF;
    
    new_balance := current_balance + credits_to_add;
    
    -- Update balance and refresh date
    UPDATE user_credits 
    SET balance = new_balance, 
        last_refresh_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Log the daily credit refresh
    INSERT INTO credits_log (user_id, action, amount, balance_after, reason)
    VALUES (p_user_id, 'credit', credits_to_add, new_balance, 'daily_refresh');
    
    RETURN json_build_object(
      'success', true,
      'balance', new_balance,
      'credits_added', credits_to_add,
      'refresh_type', 'daily',
      'days_missed', (CURRENT_DATE - last_refresh)
    );
  ELSE
    -- No refresh needed, return current balance
    RETURN json_build_object(
      'success', true,
      'balance', current_balance,
      'credits_added', 0,
      'refresh_type', 'none',
      'next_refresh', CURRENT_DATE + INTERVAL '1 day'
    );
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', 'refresh_failed',
      'message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update get_user_balance to automatically refresh daily credits
CREATE OR REPLACE FUNCTION get_user_balance(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  refresh_result JSON;
  user_balance INTEGER;
BEGIN
  -- First, refresh daily credits if needed
  SELECT refresh_daily_credits(p_user_id) INTO refresh_result;
  
  -- If refresh failed, return the error
  IF NOT (refresh_result->>'success')::boolean THEN
    RETURN refresh_result;
  END IF;
  
  -- Get the updated balance
  SELECT balance INTO user_balance 
  FROM user_credits 
  WHERE user_id = p_user_id;
  
  RETURN json_build_object(
    'success', true,
    'balance', user_balance,
    'daily_refresh', refresh_result
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

-- Update spend_credits to check for daily refresh before spending
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id UUID,
  p_prompt_id UUID DEFAULT NULL,
  p_amount INTEGER DEFAULT 1,
  p_reason TEXT DEFAULT 'prompt_enhancement'
)
RETURNS JSON AS $$
DECLARE
  refresh_result JSON;
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- First, refresh daily credits if needed
  SELECT refresh_daily_credits(p_user_id) INTO refresh_result;
  
  -- If refresh failed, return the error
  IF NOT (refresh_result->>'success')::boolean THEN
    RETURN refresh_result;
  END IF;
  
  -- Get current balance with row lock to prevent race conditions
  SELECT balance INTO current_balance 
  FROM user_credits 
  WHERE user_id = p_user_id 
  FOR UPDATE;
  
  -- Check if sufficient balance
  IF current_balance < p_amount THEN
    RETURN json_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'balance', current_balance,
      'required', p_amount,
      'daily_refresh', refresh_result
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
    'daily_refresh', refresh_result,
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

-- Create a function to manually trigger daily refresh for all users (for cron jobs)
CREATE OR REPLACE FUNCTION refresh_all_users_daily_credits()
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  refresh_count INTEGER := 0;
  error_count INTEGER := 0;
BEGIN
  -- Loop through all users who need refresh
  FOR user_record IN 
    SELECT user_id 
    FROM user_credits 
    WHERE last_refresh_date < CURRENT_DATE
  LOOP
    BEGIN
      PERFORM refresh_daily_credits(user_record.user_id);
      refresh_count := refresh_count + 1;
    EXCEPTION
      WHEN OTHERS THEN
        error_count := error_count + 1;
    END;
  END LOOP;
  
  RETURN json_build_object(
    'success', true,
    'users_refreshed', refresh_count,
    'errors', error_count,
    'refresh_date', CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;