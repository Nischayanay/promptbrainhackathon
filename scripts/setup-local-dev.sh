#!/bin/bash

# PromptBrain Local Development Setup Script
# This script sets up Supabase local development environment

set -e

echo "🚀 PromptBrain Local Development Setup"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi
echo "✅ Docker is running"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    brew install supabase/tap/supabase
else
    echo "✅ Supabase CLI installed ($(supabase --version))"
fi

# Stop any existing Supabase instance
echo ""
echo "🛑 Stopping existing Supabase instance (if any)..."
supabase stop || true

# Start Supabase local development
echo ""
echo "🔄 Starting Supabase local development..."
supabase start

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Display status
echo ""
echo "📊 Supabase Status:"
supabase status

# Run migrations
echo ""
echo "🔄 Running database migrations..."
supabase db reset --debug

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Copy .env.local.development to .env.local for local development"
echo "   2. Run 'npm run dev' to start the frontend"
echo "   3. Run 'supabase functions serve' to test edge functions locally"
echo "   4. Access Supabase Studio at http://127.0.0.1:54323"
echo ""
echo "🔗 Useful URLs:"
echo "   - API: http://127.0.0.1:54321"
echo "   - Studio: http://127.0.0.1:54323"
echo "   - Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
echo ""
