# Credit System Update - Migration Instructions

## Changes Made

### 1. Frontend Changes ✅ (Already Applied)
- Updated `FloatingCreditsOrb` to show credits out of 20
- Removed "Used today" section
- Removed "Resets in" countdown
- Updated tips to reflect 20 credits per day with no stacking
- Updated `CustomDashboardPage` to use 20 as max credits

### 2. Database Migration 🔄 (Needs Manual Application)

**Migration File:** `supabase/migrations/20250211000001_update_credits_to_20_per_day.sql`

**What it does:**
- Changes default credits from 50 to 20 per day
- Updates all existing users to have max 20 credits
- Modifies `refresh_daily_credits()` function to reset to 20 (no stacking)
- Credits reset at midnight (based on database timezone)

## How to Apply the Migration

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qaugvrsaeydptmsxllcu
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20250211000001_update_credits_to_20_per_day.sql`
5. Click **Run** to execute the migration

### Option 2: Via Supabase CLI (If Docker is running)

```bash
# Start Docker Desktop first, then:
npx supabase db push
```

## Verification

After applying the migration, verify:

1. **Check default credits for new users:**
   ```sql
   SELECT column_default 
   FROM information_schema.columns 
   WHERE table_name = 'user_credits' 
   AND column_name = 'balance';
   ```
   Should return: `20`

2. **Check existing user balances:**
   ```sql
   SELECT user_id, balance, last_refresh_date 
   FROM user_credits 
   LIMIT 10;
   ```
   All balances should be ≤ 20

3. **Test the refresh function:**
   ```sql
   SELECT refresh_daily_credits('YOUR_USER_ID');
   ```
   Should return balance of 20

## Current System Behavior

- ✅ Each user gets **20 credits per day**
- ✅ Credits **reset at midnight** (database timezone, typically UTC)
- ✅ Credits **do NOT stack** - always resets to 20
- ✅ Each enhancement costs **1 credit**
- ✅ Frontend shows credits as **X / 20**

## Notes

- The migration is safe to run multiple times (idempotent)
- Existing users will be capped at 20 credits immediately
- The refresh function will reset credits to 20 at midnight
- No credits will be lost - users just get a fresh 20 each day
