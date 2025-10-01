#!/bin/bash

# Deploy Server-Authoritative Credits System
echo "🚀 Deploying Server-Authoritative Credits System..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory"
    exit 1
fi

echo "📊 Running database migrations..."
supabase db push

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed"
    exit 1
fi

echo "🔧 Deploying edge functions..."
supabase functions deploy credits

if [ $? -ne 0 ]; then
    echo "❌ Edge function deployment failed"
    exit 1
fi

echo "✅ Credits system deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Test the credits system in your app"
echo "2. Verify that localStorage is no longer used for credits"
echo "3. Check that credit deductions are atomic and server-side"
echo "4. Confirm audit trail is working in credits_log table"
echo ""
echo "🔍 To verify deployment:"
echo "- Check Supabase Dashboard > Database > Tables (user_credits, credits_log)"
echo "- Check Supabase Dashboard > Edge Functions (credits function)"
echo "- Test credit spending in your app"