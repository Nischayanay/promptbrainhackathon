-- Update credit system to 20 credits per day
-- This migration changes the daily credit allocation from 50 to 20

-- Update the default balance for new users
ALTER TABLE user_credits 
ALTER COLUMN balance SET DEFAULT 20;

-- Update all existing users to have max 20 credits (don't give more than 20)
UPDATE user_credits 
SET balance = LEAST(balance, 20),
    updated_at = NOW();

-- Update the refresh_daily_credits function to use 20 credits per day
CREATE OR REPLACE FUNCTION refresh_daily_credits(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  current_balance INTEGER;
  last_refresh DATE;
  new_balance INTEGER;
  days_missed INTEGER;
BEGIN
  -- Get current balance and last refresh date with row lock
  SELECT balance, last_refresh_date INTO current_balance, last_refresh
  FROM user_credits 
  WHERE user_id = p_user_id 
  FOR UPDATE;
  
  -- If user doesn't exist, create with 20 credits and today's date
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance, last_refresh_date) 
    VALUES (p_user_id, 20, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE SET 
      balance = 20, 
      last_refresh_date = CURRENT_DATE,
      updated_at = NOW();
    
    -- Log the initial credit grant
    INSERT INTO credits_log (user_id, action, amount, balance_after, reason)
    VALUES (p_user_id, 'credit', 20, 20, 'initial_daily_credits');
    
    RETURN json_build_object(
      'success', true,
      'balance', 20,
      'credits_added', 20,
      'refresh_type', 'initial'
    );
  END IF;
  
  -- Check if refresh is needed (last refresh was before today)
  IF last_refresh < CURRENT_DATE THEN
    -- Calculate days since last refresh
    days_missed := CURRENT_DATE - last_refresh;
    
    -- Reset to 20 credits (no stacking, just reset to daily limit)
    new_balance := 20;
    
    -- Update balance and refresh date
    UPDATE user_credits 
    SET balance = new_balance, 
        last_refresh_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Log the daily credit refresh
    INSERT INTO credits_log (user_id, action, amount, balance_after, reason)
    VALUES (p_user_id, 'credit', 20, new_balance, 'daily_refresh');
    
    RETURN json_build_object(
      'success', true,
      'balance', new_balance,
      'credits_added', 20,
      'refresh_type', 'daily',
      'days_missed', days_missed
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

-- Add comment to document the change
COMMENT ON FUNCTION refresh_daily_credits IS 'Refreshes user credits to 20 per day at midnight. Credits do not stack - always resets to 20.';
