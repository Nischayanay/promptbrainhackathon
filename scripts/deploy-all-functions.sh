#!/bin/bash

# Deploy All Edge Functions to Production
# This script deploys all edge functions with proper error handling

set -e

echo "🚀 Deploying All Edge Functions to Production"
echo "=============================================="
echo ""

# Get project ref
SUPABASE_PROJECT_REF="qaugvrsaeydptmsxllcu"

echo "📦 Project: $SUPABASE_PROJECT_REF"
echo ""

# Array of functions to deploy
FUNCTIONS=(
    "backend-brain-enhance"
    "credits"
    "daily-credit-refresh"
    "get-session"
    "save-session"
    "get-draft"
    "save-draft"
)

# Deploy each function
SUCCESS_COUNT=0
FAIL_COUNT=0

for func in "${FUNCTIONS[@]}"; do
    echo "🔄 Deploying $func..."
    if supabase functions deploy "$func" --project-ref "$SUPABASE_PROJECT_REF" --no-verify-jwt; then
        echo "✅ $func deployed successfully"
        ((SUCCESS_COUNT++))
    else
        echo "❌ Failed to deploy $func"
        ((FAIL_COUNT++))
    fi
    echo ""
done

echo "=============================================="
echo "📊 Deployment Summary:"
echo "   ✅ Successful: $SUCCESS_COUNT"
echo "   ❌ Failed: $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "🎉 All functions deployed successfully!"
    echo ""
    echo "🔗 View your functions at:"
    echo "   https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF/functions"
else
    echo "⚠️  Some functions failed to deploy. Check the logs above."
    exit 1
fi
