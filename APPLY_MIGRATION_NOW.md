# 🚀 Apply Credit Migration - Quick Guide

## The Issue
The Supabase CLI is failing because of a syntax error in an old migration file. The easiest solution is to apply the new migration manually through the Supabase Dashboard.

## ✅ Quick Steps (5 minutes)

### 1. Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/qaugvrsaeydptmsxllcu/sql/new

### 2. Copy the Migration SQL
Open the file: `supabase/migrations/20250211000001_update_credits_to_20_per_day.sql`

Or copy this SQL directly:

```sql
-- Update credit system to 20 credits per day
ALTER TABLE user_credits 
ALTER COLUMN balance SET DEFAULT 20;

-- Update all existing users to have max 20 credits
UPDATE user_credits 
SET balance = LEAST(balance, 20),
    updated_at = NOW();

-- Update the refresh_daily_credits function
CREATE OR REPLACE FUNCTION refresh_daily_credits(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  current_balance INTEGER;
  last_refresh DATE;
  new_balance INTEGER;
  days_missed INTEGER;
BEGIN
  SELECT balance, last_refresh_date INTO current_balance, last_refresh
  FROM user_credits 
  WHERE user_id = p_user_id 
  FOR UPDATE;
  
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance, last_refresh_date) 
    VALUES (p_user_id, 20, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE SET 
      balance = 20, 
      last_refresh_date = CURRENT_DATE,
      updated_at = NOW();
    
    INSERT INTO credits_log (user_id, action, amount, balance_after, reason)
    VALUES (p_user_id, 'credit', 20, 20, 'initial_daily_credits');
    
    RETURN json_build_object(
      'success', true,
      'balance', 20,
      'credits_added', 20,
      'refresh_type', 'initial'
    );
  END IF;
  
  IF last_refresh < CURRENT_DATE THEN
    days_missed := CURRENT_DATE - last_refresh;
    new_balance := 20;
    
    UPDATE user_credits 
    SET balance = new_balance, 
        last_refresh_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
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

COMMENT ON FUNCTION refresh_daily_credits IS 'Refreshes user credits to 20 per day at midnight. Credits do not stack - always resets to 20.';
```

### 3. Run the SQL
Click the **"Run"** button in the SQL Editor

### 4. Verify
Run this query to verify:
```sql
SELECT user_id, balance, last_refresh_date 
FROM user_credits 
LIMIT 10;
```

All balances should now be ≤ 20

## ✅ What This Does
- Sets default credits to 20 for new users
- Caps existing users at 20 credits
- Updates the refresh function to reset to 20 daily (no stacking)
- Credits reset at midnight UTC

## 🎉 Done!
Your credit system is now updated to 20 credits per day!
