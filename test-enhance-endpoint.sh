#!/bin/bash

# Test script for enhance-prompt endpoint
# This tests the Edge Function directly

echo "🧪 Testing PromptBrain enhance-prompt endpoint..."
echo ""

# Configuration
API_URL="https://qaugvrsaeydptmsxllcu.supabase.co/functions/v1/make-server-08c24b4c/enhance-prompt"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdWd2cnNhZXlkcHRtc3hsbGN1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTkwMDc3OSwiZXhwIjoyMDY1NDc2Nzc5fQ.mthkPFNO0QfH02TiHoA5lHbBZ02fUX2YZQGkMS4kGpc"

# Test payload
TEST_PROMPT="Create a landing page for a coffee brand"

echo "📡 Sending request to: $API_URL"
echo "📝 Test prompt: $TEST_PROMPT"
echo ""

# Make the request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -d "{
    \"mode\": \"ideate\",
    \"originalPrompt\": \"$TEST_PROMPT\",
    \"flowData\": null
  }")

# Extract status code and body
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📊 Response Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ SUCCESS! Endpoint is working."
  echo ""
  echo "📦 Response Preview:"
  echo "$BODY" | jq -r '.enhancedPrompt.detailed' | head -c 200
  echo "..."
  echo ""
  echo "🎉 The backend is functioning correctly!"
  echo "   If the frontend still doesn't show output, check browser console logs."
else
  echo "❌ ERROR! Status code: $HTTP_CODE"
  echo ""
  echo "📦 Error Response:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""
  echo "🔍 Troubleshooting:"
  echo "   1. Check if Edge Function is deployed: supabase functions list"
  echo "   2. Check Supabase logs: Dashboard → Functions → Logs"
  echo "   3. Verify GEMINI_API_KEY is set in Supabase secrets"
fi

echo ""
echo "📝 Full response saved to: test-response.json"
echo "$BODY" > test-response.json
