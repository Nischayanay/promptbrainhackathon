#!/bin/bash

# Test Edge Functions Locally
# This script tests all edge functions with sample data

set -e

echo "🧪 Testing PromptBrain Edge Functions"
echo "======================================"
echo ""

# Check if Supabase is running
if ! supabase status > /dev/null 2>&1; then
    echo "❌ Supabase is not running. Run './scripts/setup-local-dev.sh' first."
    exit 1
fi

API_URL="http://127.0.0.1:54321/functions/v1"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

echo "🔍 Testing backend-brain-enhance function..."
echo ""

curl -i --location --request POST "${API_URL}/backend-brain-enhance" \
  --header "Authorization: Bearer ${ANON_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "prompt": "Create a marketing strategy for our new AI product",
    "options": {
      "includeExamples": true
    }
  }'

echo ""
echo ""
echo "✅ Test complete!"
echo ""
echo "💡 To test other functions, modify the URL and payload above"
echo "   Available functions:"
echo "   - backend-brain-enhance"
echo "   - credits"
echo "   - get-session"
echo "   - save-session"
echo "   - get-draft"
echo "   - save-draft"
echo ""
