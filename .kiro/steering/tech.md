# Tech Stack

## Frontend

- **Framework**: React 18.3+ with TypeScript
- **Build Tool**: Vite 5.4+ with SWC plugin for fast compilation
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Animations**: Framer Motion 12+ and GSAP 3.12+
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Icons**: Lucide React

## Backend

- **Database & Auth**: Supabase (PostgreSQL 17)
- **Edge Functions**: Supabase Edge Functions (Deno runtime)
- **AI Integration**: Google Gemini API
- **Analytics**: Vercel Analytics

## Key Libraries

- `@supabase/supabase-js` - Database client and auth
- `framer-motion` - Animations and transitions
- `react-hook-form` - Form validation
- `sonner` - Toast notifications
- `recharts` - Data visualization
- `class-variance-authority` & `clsx` - Dynamic className management
- `tailwind-merge` - Tailwind class merging utility

## Development Tools

- **Testing**: Playwright for E2E tests
- **Storybook**: Component development and documentation
- **TypeScript**: Strict mode enabled with path aliases (`@/*`)
- **Node Version**: Managed via `.nvmrc`

## Common Commands

```bash
# Development
npm run dev                    # Start dev server (port 3000)
npm run dev:local             # Start with local env config
npm run build                 # Production build

# Supabase Local Development
npm run supabase:start        # Start local Supabase
npm run supabase:stop         # Stop local Supabase
npm run supabase:reset        # Reset database
npm run supabase:status       # Check status
npm run supabase:studio       # Open Studio UI

# Edge Functions
npm run functions:serve       # Serve functions locally
npm run functions:test        # Test edge functions
npm run functions:deploy      # Deploy all functions

# Testing
npm run test:e2e              # Run Playwright tests
npm run test:e2e:ui           # Run with UI
npm run test:e2e:headed       # Run in headed mode

# Storybook
npm run storybook             # Start Storybook (port 6006)
npm run build-storybook       # Build Storybook
```

## Environment Variables

Required environment variables (see `.env` files):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `GEMINI_API_KEY` - Google Gemini API key (for edge functions)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for edge functions)

## Build Configuration

- **Output Directory**: `build/`
- **Target**: ES2020
- **Module Resolution**: Bundler mode
- **Path Aliases**: `@/*` maps to `src/*`
- **Dev Server**: Port 3000, auto-opens browser
- **TypeScript**: Strict mode with unused variable checks

## Architecture Patterns

- **Dependency Injection**: Backend Brain uses DI container pattern
- **Service Layer**: Separated business logic (services/) from UI (components/)
- **Custom Hooks**: Reusable logic in `src/hooks/`
- **Utility Functions**: Shared utilities in `src/lib/` and `src/utils/`
- **Component Composition**: Atomic design with Shadcn UI primitives
