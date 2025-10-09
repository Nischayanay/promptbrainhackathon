#!/bin/bash

# Deploy Edge Functions to Production
# This script deploys all edge functions to your Supabase project

set -e

echo "🚀 Deploying Edge Functions to Production"
echo "=========================================="
echo ""

# Check if project ref is set
if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo "⚠️  SUPABASE_PROJECT_REF not set. Reading from .temp/project-ref..."
    if [ -f "supabase/.temp/project-ref" ]; then
        SUPABASE_PROJECT_REF=$(cat supabase/.temp/project-ref)
        echo "   Using project ref: $SUPABASE_PROJECT_REF"
    else
        echo "❌ Project ref not found. Please set SUPABASE_PROJECT_REF environment variable."
        exit 1
    fi
fi

echo "📦 Deploying functions to project: $SUPABASE_PROJECT_REF"
echo ""

# Deploy all functions
echo "🔄 Deploying backend-brain-enhance..."
supabase functions deploy backend-brain-enhance --project-ref "$SUPABASE_PROJECT_REF"

echo "🔄 Deploying credits..."
supabase functions deploy credits --project-ref "$SUPABASE_PROJECT_REF"

echo "🔄 Deploying session management functions..."
supabase functions deploy get-session --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy save-session --project-ref "$SUPABASE_PROJECT_REF"

echo "🔄 Deploying draft management functions..."
supabase functions deploy get-draft --project-ref "$SUPABASE_PROJECT_REF"
supabase functions deploy save-draft --project-ref "$SUPABASE_PROJECT_REF"

echo ""
echo "✅ All functions deployed successfully!"
echo ""
echo "🔗 View your functions at:"
echo "   https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF/functions"
echo ""
