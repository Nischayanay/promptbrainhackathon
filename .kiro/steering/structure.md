# Project Structure

## Root Level

```
├── src/                    # Frontend application source
├── supabase/              # Backend (database, functions, migrations)
├── scripts/               # Deployment and setup scripts
├── .storybook/           # Storybook configuration
├── docs/                 # Documentation
└── spec context/         # Specification documents
```

## Frontend Structure (`src/`)

### Core Application Files
- `main.tsx` - Application entry point with React Router
- `App.tsx` - Main app component with routing and auth logic
- `index.css` - Global styles and Tailwind imports

### Components (`src/components/`)

Organized by feature/domain:

- `dashboard2/` - **Primary dashboard** (chat-first interface, current implementation)
  - `ChatBox.tsx`, `OutputBubble.tsx`, `Sidebar.tsx`, `HeaderBar.tsx`
  - Pro variants: `ChatBoxPro.tsx`, `OutputBubblePro.tsx`, etc.
  
- `landing/` - Landing page sections (Hero, HowItWorks, Testimonials, etc.)
- `auth/` - Authentication components (AuthModal, GoogleAuth)
- `profile/` - User profile components (ProfileHeader, Stats, SavedPrompts)
- `credits/` - Credit system UI (CreditSystem.tsx)
- `ui/` - **Shadcn UI components** (Button, Card, Dialog, etc.)
  - Reusable primitives built on Radix UI
  - `utils.ts` - cn() utility for className merging

### Backend Brain (`src/backend-brain/`)

The core prompt enhancement engine with modular architecture:

```
backend-brain/
├── core/              # DI container, config, registry
├── modules/           # 7-stage pipeline modules
│   ├── input-analyzer/
│   ├── context-architect/
│   ├── domain-translator/
│   ├── few-shot-orchestrator/
│   ├── prompt-compiler/
│   ├── constraint-validator/
│   └── output-formatter/
├── services/          # Business logic services
│   ├── backend-brain-service.ts
│   ├── credit-service.ts
│   ├── gemini-service.ts
│   └── monitoring-service.ts
├── types/             # TypeScript type definitions
├── database/          # Database client
├── api/               # API endpoints
└── components/        # Backend Brain UI components
```

### Utilities & Libraries

- `src/hooks/` - Custom React hooks (useFlowMode, useKeyboardShortcuts, etc.)
- `src/lib/` - Shared utilities (analytics, animations, credits, supabase client)
- `src/utils/` - Helper functions (auth, supabase utilities)
- `src/types/` - TypeScript type definitions
- `src/styles/` - Additional CSS files

## Backend Structure (`supabase/`)

### Edge Functions (`supabase/functions/`)

Serverless functions running on Deno:

- `backend-brain-enhance/` - Main prompt enhancement endpoint
- `credits/` - Credit management operations
- `daily-credit-refresh/` - Scheduled credit refresh
- `save-session/`, `get-session/` - Session persistence
- `save-draft/`, `get-draft/` - Draft management

### Database (`supabase/migrations/`)

SQL migration files in chronological order:
- Credits system schema
- Backend Brain schema
- Dashboard revamp schema

### Configuration

- `config.toml` - Supabase local development configuration
- `.env` - Environment variables for edge functions

## Key Conventions

### Import Paths
- Use `@/` alias for imports from `src/`: `import { Button } from '@/components/ui/button'`
- Relative imports for same-directory files

### Component Organization
- One component per file
- Co-locate related components in feature folders
- Separate "Pro" variants with suffix (e.g., `ChatBoxPro.tsx`)

### Naming Conventions
- Components: PascalCase (`ChatBox.tsx`)
- Utilities/hooks: camelCase (`useFlowMode.ts`)
- Constants: UPPER_SNAKE_CASE
- CSS classes: kebab-case or Tailwind utilities

### File Patterns
- `index.ts` - Barrel exports for modules
- `README.md` - Documentation in feature folders
- `.tsx` - React components
- `.ts` - TypeScript utilities/services

## Configuration Files

- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.js` - Tailwind CSS configuration (if exists)
- `playwright.config.ts` - E2E test configuration
- `vercel.json` - Vercel deployment configuration
- `deno.json` - Deno configuration for edge functions

## Important Notes

- **Dashboard2** is the current/active dashboard implementation (chat-first design)
- **Backend Brain** is the core enhancement engine (modular, production-ready)
- **Shadcn UI** components in `src/components/ui/` should not be modified directly
- Edge functions use Deno runtime, not Node.js
- Local development requires Supabase CLI
