# PromptBrain - Supabase Local Development

## ✅ Setup Complete!

Your Supabase CLI is installed and configured. Here's everything you need to know.

## 🎯 What's Installed

- ✅ **Supabase CLI v2.48.3** (latest)
- ✅ **Docker v28.3.2** (for containers)
- ✅ **8 Edge Functions** ready to deploy
- ✅ **6 Database Migrations** ready to run
- ✅ **Local development scripts** created

## 🚀 Quick Commands

```bash
# Start everything (recommended first time)
npm run supabase:start

# Start frontend with local Supabase
npm run dev:local

# Test edge functions
npm run functions:test

# Open Supabase Studio
npm run supabase:studio
```

## 📁 Files Created

```
.env.local.development          # Local Supabase config
supabase/.env                   # Edge functions env vars
scripts/setup-local-dev.sh      # Setup script
scripts/test-edge-functions.sh  # Test script
scripts/deploy-functions.sh     # Deploy script
SUPABASE_LOCAL_DEV.md          # Full documentation
QUICK_START.md                  # Quick reference
```

## 🔄 Typical Workflow

### First Time Setup

1. **Make sure Docker Desktop is running**
   ```bash
   open -a Docker
   ```

2. **Start Supabase**
   ```bash
   npm run supabase:start
   ```
   
   This will:
   - Pull Docker images (first time only, ~2-3 minutes)
   - Start all services
   - Run database migrations
   - Display connection info

3. **Start development**
   ```bash
   npm run dev:local
   ```

### Daily Development

```bash
# Terminal 1: Supabase (if not already running)
npm run supabase:status  # Check if running
# If not running:
supabase start

# Terminal 2: Frontend
npm run dev:local

# Terminal 3: Edge Functions (optional)
npm run functions:serve
```

## 🎨 Your Edge Functions

Located in `supabase/functions/`:

1. **backend-brain-enhance** - Core AI prompt enhancement
2. **credits** - User credits management
3. **get-session** / **save-session** - Chat history
4. **get-draft** / **save-draft** - Saved prompts
5. **daily-credit-refresh** - Automated credit refresh
6. **make-server-08c24b4c** - Custom server logic

## 🗄️ Database Migrations

Located in `supabase/migrations/`:

1. `20250113000001_create_credits_system.sql`
2. `20250113120000_create_credits_system_v2.sql`
3. `20250113130000_fix_credits_tables.sql`
4. `20250113140000_daily_credit_refresh.sql`
5. `20250113150000_backend_brain_schema.sql`
6. `20250210000001_dashboard_revamp_schema.sql`

## 🔗 Local URLs

When Supabase is running:

- **API**: http://127.0.0.1:54321
- **Studio**: http://127.0.0.1:54323
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Mailpit**: http://127.0.0.1:54324
- **Frontend**: http://localhost:5173 (when running)

## 🧪 Testing Edge Functions

### Method 1: Use the test script
```bash
npm run functions:test
```

### Method 2: Manual curl
```bash
curl -i --location --request POST \
  'http://127.0.0.1:54321/functions/v1/backend-brain-enhance' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
  --header 'Content-Type: application/json' \
  --data '{
    "prompt": "Create a marketing strategy for AI product",
    "options": { "includeExamples": true }
  }'
```

### Method 3: From your frontend
Just use the local URL in your code:
```typescript
const { data } = await supabase.functions.invoke('backend-brain-enhance', {
  body: { prompt: 'Your prompt here' }
})
```

## 🚢 Deploying to Production

### Deploy Edge Functions
```bash
npm run functions:deploy
```

### Deploy Database Changes
```bash
supabase db push
```

### Set Production Secrets
```bash
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
```

## 🐛 Common Issues & Solutions

### "Docker daemon not running"
```bash
# Start Docker Desktop
open -a Docker

# Wait 30 seconds, then try again
npm run supabase:start
```

### "Port already in use"
```bash
# Stop Supabase
npm run supabase:stop

# Check what's using the port
lsof -i :54321

# Kill the process if needed
kill -9 <PID>

# Start again
npm run supabase:start
```

### "Database reset failed"
```bash
# Full cleanup
npm run supabase:stop
docker system prune -a  # Warning: removes all unused Docker data

# Start fresh
npm run supabase:start
```

### "Edge function not found"
```bash
# Make sure Supabase is running
npm run supabase:status

# Serve functions locally
npm run functions:serve

# Check the function exists
ls supabase/functions/
```

## 📚 Documentation

- **Quick Start**: `QUICK_START.md` - 5-minute setup guide
- **Full Guide**: `SUPABASE_LOCAL_DEV.md` - Complete documentation
- **Spec Context**: `spec context/3.0/3` - Design feedback & roadmap

## 🎯 Next Steps Based on Spec Feedback

### Backend Improvements (Priority)
1. **Pipeline Architecture** - Implement tokenize → structure → validate → enhance
2. **Embeddings Layer** - Add vectorization for prompt learning
3. **Adaptive Prompting** - Ask clarifying questions when input is vague
4. **Multi-framework** - Auto-switch between AIDA, PAS, etc.

### Frontend Improvements
1. **Enhanced Chatbox** - Bigger, better visual separation
2. **Gamified Credits** - Circle meter with animations
3. **Microinteractions** - Animated copy button, typing effects
4. **Prompt Library** - Save, remix, and share prompts

### New Edge Functions Needed
- `adaptive-prompt` - Clarifying questions
- `framework-selector` - Auto-select best framework
- `prompt-embeddings` - Vectorize and learn from prompts
- `multi-modal-enhance` - Support image/video prompts

## 💡 Pro Tips

1. **Keep Docker running** - Supabase needs it
2. **Use Studio** - Great for debugging database issues
3. **Check logs** - `npm run functions:serve` shows real-time logs
4. **Test locally first** - Always test before deploying
5. **Commit migrations** - Keep your schema in version control

## 🆘 Need Help?

1. Check `supabase status` - Is everything running?
2. Check Docker Desktop - Is it running?
3. Check logs - `npm run functions:serve --debug`
4. Check the docs - `SUPABASE_LOCAL_DEV.md`

---

**Ready to build?** 🚀

```bash
npm run supabase:start && npm run dev:local
```

Then open http://localhost:5173 and start coding!
