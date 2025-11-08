-- Fix get_user_balance to call refresh_daily_credits automatically
-- This ensures credits are refreshed every time balance is checked

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

COMMENT ON FUNCTION get_user_balance IS 'Gets user credit balance with automatic daily refresh to 20 credits at midnight';
