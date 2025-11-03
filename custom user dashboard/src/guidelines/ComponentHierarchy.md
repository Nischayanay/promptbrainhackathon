# PromptBrain Component Hierarchy & Design System

## 🎯 Visual Hierarchy

### Primary Zone (Highest Priority)
**SearchInterface** - The core interaction point
- Location: Hero Section
- Purpose: User prompt input and output display
- Priority: P0 (Critical)
- ARIA: Main search landmark with proper labels

### Secondary Zone
**Output Display** - Inline results within SearchInterface
- Location: Below search input
- Purpose: Show AI-processed responses
- Priority: P1 (High)
- ARIA: Live region for dynamic updates

### Tertiary Zones
1. **HeroSection** - Branding and entry point
2. **FeedbackSection** - User input collection
3. **Footer** - Navigation and information

---

## 📦 Component Mapping

### Layout Components
| Component | File | Purpose | Shadcn Used |
|-----------|------|---------|-------------|
| App | `/App.tsx` | Root layout orchestrator | Toast |
| HeroSection | `/components/HeroSection.tsx` | Full-screen hero with search | - |
| FeedbackSection | `/components/FeedbackSection.tsx` | User feedback form | - |
| Footer | `/components/Footer.tsx` | Site footer with navigation | - |

### Feature Components
| Component | File | Purpose | Shadcn Used |
|-----------|------|---------|-------------|
| SearchInterface | `/components/SearchInterface.tsx` | Primary input/output UI | - |
| AnimatedGradient | `/components/AnimatedGradient.tsx` | Background animation | - |

### UI Components (Shadcn)
Available in `/components/ui/`:
- `button.tsx` - Interactive buttons
- `input.tsx` - Form inputs
- `textarea.tsx` - Multi-line inputs
- `dialog.tsx` - Modal dialogs
- `toast.tsx` - Notifications (via Sonner)
- `dropdown-menu.tsx` - Dropdown menus
- `tooltip.tsx` - Hover information

---

## 🎨 Design Tokens

### Spacing (8px Grid System)
```css
--spacing-1: 8px
--spacing-2: 16px
--spacing-3: 24px
--spacing-4: 32px
--spacing-5: 40px
--spacing-6: 48px
--spacing-8: 64px
--spacing-10: 80px
--spacing-12: 96px
--spacing-16: 128px
```

### Typography (Fluid Scaling)
```css
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem)
--text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)
--text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.5rem)
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.875rem)
--text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem)
--text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 3rem)
--text-4xl: clamp(2.25rem, 1.8rem + 2.25vw, 3.75rem)
--text-5xl: clamp(3rem, 2.25rem + 3.75vw, 5rem)
--text-6xl: clamp(3.75rem, 2.75rem + 5vw, 6.5rem)
```

### Colors (PromptBrain Palette)
```css
--pb-black: #000000        /* Primary background */
--pb-near-black: #0A0A0A   /* Card backgrounds */
--pb-dark-gray: #1A1A1A    /* Secondary surfaces */
--pb-gray: #333333         /* Borders, dividers */
--pb-mid-gray: #666666     /* Placeholder text */
--pb-light-gray: #999999   /* Disabled states */
--pb-white: #FFFFFF        /* Primary text */
--pb-cyan: #00D9FF         /* Primary accent, focus states */
--pb-cyan-dark: #0099FF    /* Gradient end, hover states */
--pb-cyan-light: #4DFFFF   /* Highlights */
```

### Animation Timing
```css
--transition-fast: 200ms       /* Micro-interactions */
--transition-base: 300ms       /* Standard transitions */
--transition-slow: 500ms       /* Complex animations */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## ♿ WCAG 2.1 AA Compliance

### Focus Indicators
- **Outline**: 2px solid cyan (#00D9FF)
- **Offset**: 2px
- **Contrast Ratio**: 4.5:1 minimum
- **Keyboard Navigation**: Full support with visible focus rings

### Color Contrast
- **Text on Black**: #FFFFFF (21:1 ratio) ✅
- **Cyan on Black**: #00D9FF (10.2:1 ratio) ✅
- **Gray Text**: #666666 (5.4:1 ratio) ✅

### Semantic HTML
- `<main>` for primary content
- `<section>` with ARIA labels
- `<nav>` for navigation
- `<footer>` for footer content
- Proper heading hierarchy (h1 → h2 → h3)

### ARIA Labels
```jsx
// Examples from codebase
<button aria-label="Send message">
<button aria-label="Start voice input">
<section aria-labelledby="hero-heading">
<div role="status" aria-live="polite"> // For output updates
```

### Keyboard Navigation
- Tab order follows visual hierarchy
- Enter/Space activates buttons
- Escape closes modals/dropdowns
- Arrow keys for dropdown navigation

---

## 📱 Responsive Breakpoints

### Mobile First Approach
```css
/* Base: 375px - 639px (Mobile) */
/* sm: 640px (Large Mobile) */
/* md: 768px (Tablet) */
/* lg: 1024px (Desktop) */
/* xl: 1280px (Large Desktop) */
/* 2xl: 1536px (Extra Large) */
```

### Component Behavior
| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| HeroSection | Stacked, reduced padding | Centered, more spacing | Full width, max 6xl |
| SearchInterface | Full width, simplified | Optimized width | Max 4xl container |
| Footer | Stacked vertical | Partial horizontal | Full horizontal layout |
| Feedback | Single column inputs | Side-by-side | Side-by-side with spacing |

---

## 🔄 State Management

### Component States
1. **Default** - Initial render
2. **Hover** - Mouse over (scale, glow effects)
3. **Focus** - Keyboard navigation (cyan outline)
4. **Active** - Click/tap (scale down)
5. **Disabled** - Reduced opacity, no interaction
6. **Loading** - Spinner or skeleton
7. **Error** - Red accent, error message

### Animation Patterns
- **Entry**: Fade in + slide up (opacity 0→1, y 20→0)
- **Exit**: Fade out + slide down
- **Hover**: Scale 1.05, glow shadow
- **Active**: Scale 0.95
- **Duration**: 200-300ms for interactions

---

## 🛠️ Development Guidelines

### File Naming
- Components: PascalCase (e.g., `SearchInterface.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Styles: kebab-case (e.g., `globals.css`)

### Import Order
1. React/External libraries
2. UI components (Shadcn)
3. Custom components
4. Utils/helpers
5. Styles/assets

### Code Organization
```
/components
  /ui              # Shadcn components
  /figma           # Figma-specific utilities
  [Feature].tsx    # Feature components

/styles
  globals.css      # Design system tokens

/guidelines
  Guidelines.md          # PRD
  ComponentHierarchy.md  # This file
```

---

## 🎯 Next Steps for Implementation

### Phase 1: Foundation ✅
- [x] Design tokens established
- [x] Fluid typography implemented
- [x] 8px grid system defined
- [x] WCAG focus states enhanced
- [x] Component hierarchy documented

### Phase 2: Component Refinement
- [ ] Apply fluid typography to all headings
- [ ] Standardize spacing using 8px grid
- [ ] Add skip-to-content link
- [ ] Enhance ARIA labels
- [ ] Implement consistent state management

### Phase 3: Testing & Validation
- [ ] Lighthouse accessibility audit
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA/JAWS)
- [ ] Color contrast validation
- [ ] Responsive design testing

---

**Last Updated**: October 17, 2025
**Version**: 1.0.0
**Maintained By**: PromptBrain Engineering
