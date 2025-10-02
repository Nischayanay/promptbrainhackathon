#!/bin/bash

echo "🔍 PromptBrain Chat Output Diagnostic Tool"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Environment variables
echo "1️⃣  Checking environment variables..."
if grep -q "GEMINI_API_KEY" .env; then
  echo -e "${GREEN}✅ GEMINI_API_KEY found in .env${NC}"
else
  echo -e "${RED}❌ GEMINI_API_KEY missing in .env${NC}"
fi

if grep -q "VITE_SUPABASE_URL" .env; then
  echo -e "${GREEN}✅ VITE_SUPABASE_URL found in .env${NC}"
else
  echo -e "${RED}❌ VITE_SUPABASE_URL missing in .env${NC}"
fi
echo ""

# Check 2: Edge Function files
echo "2️⃣  Checking Edge Function files..."
if [ -f "supabase/functions/make-server-08c24b4c/index.ts" ]; then
  echo -e "${GREEN}✅ Edge Function file exists${NC}"
  
  # Check route definition
  if grep -q 'app.post("/enhance-prompt"' supabase/functions/make-server-08c24b4c/index.ts; then
    echo -e "${GREEN}✅ Route correctly defined as /enhance-prompt${NC}"
  elif grep -q 'app.post("/make-server-08c24b4c/enhance-prompt"' supabase/functions/make-server-08c24b4c/index.ts; then
    echo -e "${RED}❌ Route has incorrect prefix: /make-server-08c24b4c/enhance-prompt${NC}"
    echo -e "${YELLOW}   Fix: Change to /enhance-prompt${NC}"
  else
    echo -e "${YELLOW}⚠️  Route definition not found or has unexpected format${NC}"
  fi
else
  echo -e "${RED}❌ Edge Function file missing${NC}"
fi
echo ""

# Check 3: Frontend files
echo "3️⃣  Checking frontend files..."
if [ -f "src/components/Dashboard2ProRedesigned.tsx" ]; then
  echo -e "${GREEN}✅ Dashboard component exists${NC}"
  
  # Check API endpoint
  if grep -q "enhance-prompt" src/components/Dashboard2ProRedesigned.tsx; then
    echo -e "${GREEN}✅ API endpoint call found${NC}"
  else
    echo -e "${RED}❌ API endpoint call not found${NC}"
  fi
  
  # Check debug logs
  if grep -q "DEBUG: Sending request" src/components/Dashboard2ProRedesigned.tsx; then
    echo -e "${GREEN}✅ Debug logging enabled${NC}"
  else
    echo -e "${YELLOW}⚠️  Debug logging not found (optional)${NC}"
  fi
else
  echo -e "${RED}❌ Dashboard component missing${NC}"
fi

if [ -f "src/components/Chat/ChatThread.tsx" ]; then
  echo -e "${GREEN}✅ ChatThread component exists${NC}"
else
  echo -e "${RED}❌ ChatThread component missing${NC}"
fi
echo ""

# Check 4: Test Gemini API directly
echo "4️⃣  Testing Gemini API connectivity..."
GEMINI_KEY=$(grep "GEMINI_API_KEY" .env | cut -d '=' -f2)

if [ -n "$GEMINI_KEY" ]; then
  GEMINI_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$GEMINI_KEY" \
    -H "Content-Type: application/json" \
    -d '{"contents":[{"parts":[{"text":"test"}]}]}')
  
  if [ "$GEMINI_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Gemini API is accessible and responding${NC}"
  else
    echo -e "${RED}❌ Gemini API returned status: $GEMINI_RESPONSE${NC}"
    echo -e "${YELLOW}   Check if API key is valid${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Could not extract Gemini API key from .env${NC}"
fi
echo ""

# Check 5: Supabase CLI
echo "5️⃣  Checking Supabase CLI..."
if command -v supabase &> /dev/null; then
  echo -e "${GREEN}✅ Supabase CLI installed${NC}"
  
  # Check if logged in
  if supabase projects list &> /dev/null; then
    echo -e "${GREEN}✅ Supabase CLI authenticated${NC}"
  else
    echo -e "${YELLOW}⚠️  Supabase CLI not authenticated${NC}"
    echo -e "${YELLOW}   Run: supabase login${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Supabase CLI not installed${NC}"
  echo -e "${YELLOW}   Install: npm install -g supabase${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo "📋 Summary & Next Steps"
echo "=========================================="
echo ""
echo "To fix the chat output issue:"
echo ""
echo "1. Deploy the Edge Function:"
echo "   ${GREEN}supabase functions deploy make-server-08c24b4c${NC}"
echo ""
echo "2. Set Gemini API key in Supabase (if not already set):"
echo "   - Go to Supabase Dashboard"
echo "   - Settings → Edge Functions → Secrets"
echo "   - Add: GEMINI_API_KEY = $GEMINI_KEY"
echo ""
echo "3. Test the endpoint:"
echo "   ${GREEN}./test-enhance-endpoint.sh${NC}"
echo ""
echo "4. Test in browser with DevTools open (F12)"
echo "   - Check Console for debug logs"
echo "   - Check Network tab for API requests"
echo ""
echo "📖 For detailed debugging guide, see: DEBUG_CHAT_OUTPUT.md"
echo ""
