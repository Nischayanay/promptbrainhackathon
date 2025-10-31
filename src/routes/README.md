# PromptBrain Routing System

## Overview
Clean, organized routing system with proper theming and authentication protection.

## Routes
- `/` - Landing page (landing theme)
- `/login` - Authentication login (temple theme)  
- `/signup` - User registration (temple theme)
- `/enhance` - Main dashboard (cinematic theme)
- `/profile` - User profile (cinematic theme)

## Features
- **Theme-based CSS**: Each route applies appropriate theme classes
- **Route Protection**: Dashboard and profile require authentication
- **Smooth Transitions**: Framer Motion page transitions
- **Type Safety**: TypeScript route configuration
- **Navigation Hook**: `useAppNavigation()` for consistent navigation

## Usage

### Basic Navigation
```tsx
import { useAppNavigation } from '../hooks/useAppNavigation';

const { goToDashboard, goToLogin } = useAppNavigation();
```

### Route Configuration
```tsx
import { routeConfig } from '../routes';

navigate(routeConfig.dashboard); // /enhance
```

### Theme Wrapper
```tsx
<ThemeWrapper theme="cinematic">
  <YourComponent />
</ThemeWrapper>
```

## CSS Themes
- **landing-theme**: Landing page styling
- **temple-theme**: Auth pages with mystical design
- **cinematic-theme**: Dashboard with modern UI

## File Structure
```
src/routes/
├── index.tsx          # Route config and helpers
├── README.md          # This file
src/hooks/
├── useAppNavigation.ts # Navigation utilities
src/styles/
├── themes.css         # Theme-specific styles
src/components/common/
├── RouteTransition.tsx # Page transitions
```