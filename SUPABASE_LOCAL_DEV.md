# Supabase Local Development Guide

Complete guide for developing PromptBrain with Supabase local containers and edge functions.

## Quick Start

```bash
# 1. Start local Supabase (Docker must be running)
./scripts/setup-local-dev.sh

# 2. Test edge functions
./scripts/test-edge-functions.sh

# 3. Start frontend with local environment
cp .env.local.development .env.local
npm run dev
```

## Prerequisites

- ✅ Docker Desktop (running)
- ✅ Supabase CLI v2.48.3+
- ✅ Node.js 18+
- ✅ Homebrew (macOS)

## Local Development Environment

### Start Supabase

```bash
supabase start
```

This starts:
- PostgreSQL database (port 54322)
- PostgREST API (port 54321)
- Supabase Studio (port 54323)
- Edge Runtime (Deno)
- Mailpit (email testing, port 54324)
- Storage API
- Realtime server

### Stop Supabase

```bash
supabase stop
```

### Reset Database

```bash
supabase db reset
```

This will:
1. Drop and recreate the database
2. Run all migrations from `supabase/migrations/`
3. Seed data if configured

## Edge Functions

### Serve Functions Locally

```bash
# Serve all functions
supabase functions serve

# Serve specific function with debug logs
supabase functions serve backend-brain-enhance --debug

# Serve with environment variables
supabase functions serve --env-file supabase/.env
```

### Test Functions

```bash
# Using curl
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/backend-brain-enhance' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "prompt": "Create a marketing strategy",
    "options": { "includeExamples": true }
  }'

# Or use the test script
./scripts/test-edge-functions.sh
```

### Deploy Functions to Production

```bash
# Deploy all functions
./scripts/deploy-functions.sh

# Or deploy individually
supabase functions deploy backend-brain-enhance --project-ref YOUR_PROJECT_REF
```

## Environment Variables

### Local Development (.env.local.development)

```env
# Local Supabase
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Edge Functions
GEMINI_API_KEY=your_gemini_api_key
```

### Edge Functions (supabase/.env)

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Migrations

### Create New Migration

```bash
supabase migration new migration_name
```

### Apply Migrations

```bash
# Apply to local database
supabase db reset

# Apply to remote database
supabase db push
```

### Generate Migration from Remote

```bash
supabase db pull
```

## Available Edge Functions

### 1. backend-brain-enhance
Enhances prompts using Backend Brain AI engine.

**Endpoint**: `/functions/v1/backend-brain-enhance`

**Request**:
```json
{
  "prompt": "Your prompt here",
  "userId": "optional-user-id",
  "options": {
    "maxTokens": 1536,
    "domain": "marketing",
    "includeExamples": true
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "enhancedText": "...",
    "enhancedJson": {...},
    "whySummary": "...",
    "qualityScore": 0.85,
    "metadata": {...}
  }
}
```

### 2. credits
Manages user credits.

### 3. get-session / save-session
Session management for chat history.

### 4. get-draft / save-draft
Draft management for saved prompts.

## Supabase Studio

Access at: http://127.0.0.1:54323

Features:
- Table Editor
- SQL Editor
- Database Schema
- API Documentation
- Storage Browser
- Edge Functions Logs

## Debugging

### View Function Logs

```bash
# Real-time logs
supabase functions serve --debug

# View logs in Studio
# Navigate to Edge Functions → Select function → Logs tab
```

### Database Logs

```bash
# View Postgres logs
docker logs supabase_db_pbm-project

# View all container logs
docker ps
docker logs <container_id>
```

### Common Issues

**Docker not running**
```bash
# Start Docker Desktop manually
open -a Docker
```

**Port conflicts**
```bash
# Check what's using ports
lsof -i :54321
lsof -i :54322
lsof -i :54323

# Kill process if needed
kill -9 <PID>
```

**Database reset fails**
```bash
# Stop and remove all containers
supabase stop --no-backup
docker system prune -a

# Start fresh
supabase start
```

## Production Deployment

### Link to Remote Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Deploy Database Changes

```bash
# Push migrations
supabase db push

# Or reset remote database (⚠️ destructive)
supabase db reset --linked
```

### Deploy Edge Functions

```bash
# Deploy all
./scripts/deploy-functions.sh

# Deploy specific function
supabase functions deploy backend-brain-enhance
```

### Set Production Secrets

```bash
# Set environment variables for edge functions
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key

# List secrets
supabase secrets list
```

## Development Workflow

1. **Start local environment**
   ```bash
   ./scripts/setup-local-dev.sh
   ```

2. **Make changes to edge functions**
   - Edit files in `supabase/functions/`
   - Functions auto-reload with `supabase functions serve`

3. **Test locally**
   ```bash
   ./scripts/test-edge-functions.sh
   ```

4. **Create database migrations**
   ```bash
   supabase migration new your_migration_name
   # Edit the generated SQL file
   supabase db reset  # Test locally
   ```

5. **Deploy to production**
   ```bash
   supabase db push  # Deploy migrations
   ./scripts/deploy-functions.sh  # Deploy functions
   ```

## Useful Commands

```bash
# Check status
supabase status

# View logs
supabase functions serve --debug

# Generate TypeScript types from database
supabase gen types typescript --local > src/types/supabase.ts

# Backup database
supabase db dump -f backup.sql

# Restore database
psql -h 127.0.0.1 -p 54322 -U postgres < backup.sql
```

## Resources

- [Supabase Local Development Docs](https://supabase.com/docs/guides/local-development)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

## Next Steps

Based on the spec context feedback, consider:

1. **Backend as an Engine**: Implement pipeline architecture in edge functions
2. **Scalable Data Layer**: Add embeddings and vectorization for prompt learning
3. **Multi-modal Support**: Extend edge functions to handle image/video prompts
4. **Adaptive Prompting**: Add clarifying questions when CRISP validation fails
5. **Multi-framework Fallback**: Implement automatic framework switching (AIDA → PAS)

---

**Need help?** Check the logs or run `supabase status` to verify everything is running.
