-- Add 100 credits to your user account
-- Replace 'YOUR_EMAIL@example.com' with your actual email

-- Method 1: If you know your email
UPDATE user_credits 
SET balance = 100 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com'
);

-- Method 2: Add to ALL users (for testing)
UPDATE user_credits SET balance = 100;

-- Method 3: Check current balance first
SELECT 
  u.email,
  uc.balance,
  uc.last_refresh
FROM user_credits uc
JOIN auth.users u ON u.id = uc.user_id;

-- Method 4: Create credits record if it doesn't exist
INSERT INTO user_credits (user_id, balance, last_refresh)
SELECT 
  id,
  100,
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_credits);
