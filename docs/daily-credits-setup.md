# Daily Credits System Setup

## Overview
The daily credits system automatically gives each user 50 credits per day. Credits are refreshed automatically when users interact with the app, and can also be triggered via cron jobs.

## How It Works

### Automatic Refresh
- **When**: Every time a user checks balance or spends credits
- **Amount**: 50 credits per day missed (max 7 days = 350 credits)
- **Storage**: `user_credits.last_refresh_date` tracks last refresh
- **Audit**: All refreshes logged in `credits_log` table

### Manual Refresh
- Users can manually trigger refresh via the "Add Credits" button
- Calls `/functions/v1/credits/refresh` endpoint
- Shows notification when credits are added

## Database Schema

### user_credits table
```sql
- user_id (UUID, FK to auth.users)
- balance (INTEGER, default 50)
- last_refresh_date (DATE, default CURRENT_DATE)
- updated_at (TIMESTAMP)
```

### credits_log table
```sql
- id (UUID, primary key)
- user_id (UUID, FK to auth.users)
- prompt_id (UUID, nullable)
- action ('debit' | 'credit')
- amount (INTEGER)
- balance_after (INTEGER)
- reason (TEXT)
- created_at (TIMESTAMP)
```

## API Endpoints

### GET /functions/v1/credits/balance
- Automatically refreshes daily credits if needed
- Returns current balance and refresh info

### GET /functions/v1/credits/refresh
- Manually triggers daily refresh
- Returns refresh details and new balance

### POST /functions/v1/credits/spend
- Automatically refreshes daily credits before spending
- Deducts credits atomically
- Returns transaction details

## Cron Job Setup (Optional)

For proactive daily refresh of all users:

### 1. Deploy the cron function
```bash
supabase functions deploy daily-credit-refresh
```

### 2. Set up cron job (GitHub Actions example)
```yaml
name: Daily Credit Refresh
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC

jobs:
  refresh-credits:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger daily refresh
        run: |
          curl -X POST \
            -H "x-cron-secret: ${{ secrets.CRON_SECRET }}" \
            https://qaugvrsaeydptmsxllcu.supabase.co/functions/v1/daily-credit-refresh
```

### 3. Set environment variables in Supabase
- `CRON_SECRET`: Secret key for cron authentication
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations

## User Experience

### First Time Users
- Get 50 credits immediately upon first interaction
- `last_refresh_date` set to today

### Daily Users
- Credits automatically refresh when they open the app
- See notification: "🎉 Daily Credits Refreshed! +50 credits added"

### Returning Users (after multiple days)
- Get credits for each day missed (max 7 days)
- See notification: "🎉 Daily Credits Refreshed! +150 credits added (3 days worth)"

### Edge Cases
- **Max Credits**: 7 days worth (350 credits) to prevent abuse
- **Timezone**: Uses database server timezone (UTC)
- **Concurrent Access**: Row-level locking prevents race conditions

## Monitoring

### Check refresh logs
```sql
SELECT * FROM credits_log 
WHERE reason IN ('daily_refresh', 'initial_daily_credits')
ORDER BY created_at DESC;
```

### Check users needing refresh
```sql
SELECT user_id, balance, last_refresh_date,
       CURRENT_DATE - last_refresh_date as days_since_refresh
FROM user_credits 
WHERE last_refresh_date < CURRENT_DATE;
```

### Refresh statistics
```sql
SELECT 
  DATE(created_at) as refresh_date,
  COUNT(*) as users_refreshed,
  SUM(amount) as total_credits_added
FROM credits_log 
WHERE reason = 'daily_refresh'
GROUP BY DATE(created_at)
ORDER BY refresh_date DESC;
```

## Testing

### Test daily refresh for a user
```sql
-- Simulate user from yesterday
UPDATE user_credits 
SET last_refresh_date = CURRENT_DATE - 1 
WHERE user_id = 'your-user-id';

-- Check balance (should auto-refresh)
SELECT get_user_balance('your-user-id');
```

### Test cron job
```bash
curl -X POST \
  -H "x-cron-secret: daily-refresh-secret" \
  https://qaugvrsaeydptmsxllcu.supabase.co/functions/v1/daily-credit-refresh
```