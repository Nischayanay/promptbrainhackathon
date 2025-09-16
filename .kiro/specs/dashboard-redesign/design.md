# Design Document

## Overview

This design document outlines the comprehensive redesign of the PromptBrain dashboard to create a premium, cinematic user experience. The redesign transforms the current Dashboard2Pro component into a focused, accessible interface that prioritizes the main chat console while introducing a cohesive motion system and improved visual hierarchy.

The design follows a "cinematic minimalism" approach, drawing inspiration from premium interfaces like Linear, Figma, and modern AI tools, while maintaining the existing brand identity and technical architecture.

## Architecture

### Component Hierarchy

```
Dashboard2Pro (Redesigned)
├── AppShell
│   ├── FloatingCreditsOrb
│   └── CollapsibleSidebar
├── PromptConsole (Main Focus)
│   ├── ModeToggle (Ideate/Flow)
│   ├── FlowQuestionCard (Flow mode only)
│   ├── MainInput (Textarea)
│   └── EnhanceButton
├── OutputCard (Results)
│   ├── OutputHeader
│   ├── OutputContent
│   └── OutputActions
└── TemplatesGrid (Optional)
```

### Layout System

The design uses a 3-column CSS Grid layout:
- **Left**: Collapsible sidebar (72px collapsed, 260px expanded)
- **Center**: Main content area (max-width: 1000px, vertically centered)
- **Right**: Reserved for future features (credits orb floats here)

### State Management

The redesign maintains the existing React state structure but adds new states for:
- Sidebar collapse/expand
- Credits orb animations
- Flow mode progression
- Motion preferences (respects `prefers-reduced-motion`)

## Components and Interfaces

### 1. AppShell Component

**Purpose**: Main layout container that manages global layout and navigation

**Props Interface**:
```typescript
interface AppShellProps {
  children: React.ReactNode
  sidebarCollapsed: boolean
  onSidebarToggle: () => void
  credits: number
  maxCredits: number
  onCreditsClick: () => void
}
```

**Key Features**:
- Responsive 3-column grid layout
- Consistent vertical rhythm (64px top, 32px between sections, 16px between elements)
- Glass panel effects with backdrop-filter: blur(8px)
- Removes heavy top navigation, keeps minimal status indication

### 2. CollapsibleSidebar Component

**Purpose**: Space-efficient navigation that doesn't compete with main content

**Props Interface**:
```typescript
interface CollapsibleSidebarProps {
  collapsed: boolean
  onToggle: () => void
  activeItem: string
  onItemSelect: (item: string) => void
  recentHistory: ChatMessage[]
}
```

**States**:
- **Collapsed**: 72px wide, icon-only vertical rail
- **Expanded**: 260px wide with labels and content
- **Animation**: 220-320ms slide transition with cubic-bezier(.2,.9,.2,1)

**Navigation Items**:
- Home, Enhance (active), History, Archive, Profile, Settings, Logout
- Visual hierarchy with glowing left accent strip for active items
- Hover effects: outer neon ring grow (150ms) + icon shadow

### 3. PromptConsole Component

**Purpose**: The primary focal element for prompt input and mode management

**Props Interface**:
```typescript
interface PromptConsoleProps {
  input: string
  setInput: (value: string) => void
  activeMode: 'ideate' | 'flow'
  onModeChange: (mode: 'ideate' | 'flow') => void
  isEnhancing: boolean
  onEnhance: () => void
  flowState: FlowState
}
```

**Dimensions**:
- Desktop: max-width 900-1000px, height 220-280px
- Mobile: full width, min-height 160px
- Border radius: 16px with glass effect

**Mode Behaviors**:

**Ideate Mode**:
- Single large textarea
- Immediate Enhance button availability
- Placeholder: "Start typing your idea (e.g., 'landing page copy for coffee brand')"

**Flow Mode**:
- Pinned question card above input (numbered 1/5 format)
- Context accumulation as pill chips above input
- Next button disabled until answer length ≥ 3 characters
- Sequential question progression with fade + slide animations

### 4. FloatingCreditsOrb Component

**Purpose**: Engaging, informative credit system that delights users

**Props Interface**:
```typescript
interface FloatingCreditsOrbProps {
  credits: number
  maxCredits: number
  onAddCredits: () => void
  onUseCredit: () => void
}
```

**Visual Design**:
- Circular orb with radial progress (SVG-based)
- Color states: cyan/blue (full), amber (low), red (empty)
- Floating position: top-right corner
- Subtle breathing glow animation (6s loop)

**Interactions**:
- Hover: expands to popover with breakdown
- On enhance: charge pulse + decrement animation (400ms)
- Click: shows upgrade modal or credit purchase flow

### 5. OutputCard Component

**Purpose**: Clear, actionable presentation of enhanced content

**Props Interface**:
```typescript
interface OutputCardProps {
  message: ChatMessage
  onCopy: (text: string, format: 'english' | 'json' | 'markdown') => void
  onRerun: (messageId: string) => void
  onFeedback: (messageId: string, type: 'up' | 'down') => void
}
```

**Layout**:
- Renders below PromptConsole as expandable card
- Header row: mode tag, timestamp, re-run button
- Content area: selectable text with format toggle
- Action bar: Copy, Save, Edit, Regenerate buttons
- Metadata: tokens used, credit cost, model version

## Data Models

### Enhanced ChatMessage Interface

```typescript
interface ChatMessage {
  id: string
  mode: 'ideate' | 'flow'
  timestamp: string
  input: string
  output: string
  title: string
  effectType?: string
  metadata: {
    tokensUsed: number
    creditCost: number
    modelVersion: string
    processingTime: number
  }
}
```

### FlowState Interface

```typescript
interface FlowState {
  currentStep: number
  answers: string[]
  questions: FlowQuestion[]
  isComplete: boolean
}

interface FlowQuestion {
  id: string
  question: string
  placeholder: string
  category: string
  optional?: boolean
}
```

### CreditsState Interface

```typescript
interface CreditsState {
  current: number
  maximum: number
  usedToday: number
  resetDate: Date
  isAnimating: boolean
}
```

## Error Handling

### Input Validation
- Character limits: 2000 characters for main input
- Required field validation for Flow mode questions
- Real-time validation feedback with visual indicators

### API Error States
- Network connectivity issues
- Rate limiting responses
- Insufficient credits handling
- Graceful degradation with retry mechanisms

### User Feedback
- Toast notifications for copy actions
- Loading states during enhancement
- Error messages with actionable solutions
- Accessibility announcements for screen readers

## Testing Strategy

### Unit Tests
- Component rendering with various props
- State management logic
- Animation trigger conditions
- Accessibility compliance (ARIA labels, keyboard navigation)

### Integration Tests
- Mode switching behavior
- Flow question progression
- Credits system interactions
- Copy/paste functionality

### Visual Regression Tests
- Component states across different screen sizes
- Animation keyframes and transitions
- Color contrast ratios
- Focus state visibility

### Performance Tests
- Animation frame rates (target: 60fps)
- Bundle size impact
- Memory usage during long sessions
- Initial paint time (target: <1s)

## Motion System

### Animation Principles
- **Entrance**: 400-500ms duration with cubic-bezier(.2,.9,.2,1)
- **Hover micro**: 150-220ms duration
- **Stagger**: 0.06s delay between children
- **Respect**: prefers-reduced-motion settings

### Key Animations

**Sidebar Transitions**:
```css
.sidebar-transition {
  transition: width 220ms cubic-bezier(.2,.9,.2,1);
}
```

**Flow Question Reveals**:
```css
.question-reveal {
  animation: fadeSlideUp 300ms cubic-bezier(.2,.9,.2,1);
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Credits Orb Animations**:
```css
.credits-breathing {
  animation: breathingGlow 6s ease-in-out infinite;
}

.credits-charge {
  animation: chargePulse 400ms ease-out;
}
```

**Enhance Button States**:
```css
.enhance-loading {
  animation: spin 600ms linear infinite;
}

.enhance-success {
  animation: confettiBurst 800ms ease-out;
}
```

## Design Tokens

### Color Palette
```css
:root {
  --bg: #020203;
  --panel: #0f1113;
  --brand-gold: #FFD34D;
  --accent-cyan: #30C4C8;
  --accent-purple: #7F56FF;
  --text-primary: #E8E8EA;
  --text-muted: #A6A6AB;
  --glass: rgba(255,255,255,0.04);
  --glass-border: rgba(255,212,77,0.12);
}
```

### Typography Scale
```css
:root {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter Variable', sans-serif;
  
  --text-hero: 48px;
  --text-h1: 36px;
  --text-h2: 28px;
  --text-h3: 24px;
  --text-body: 16px;
  --text-small: 14px;
  --text-xs: 12px;
}
```

### Spacing System
```css
:root {
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 20px;
  --space-lg: 32px;
  --space-xl: 64px;
}
```

### Border Radius
```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
}
```

## Accessibility Considerations

### Keyboard Navigation
- Tab order: Sidebar → Mode toggle → Input → Enhance button → Output actions
- Keyboard shortcuts: Cmd/Ctrl + B (sidebar toggle), Cmd/Ctrl + Enter (enhance)
- Focus indicators: 2px solid outline with brand colors

### Screen Reader Support
- ARIA labels for all interactive elements
- Live regions for dynamic content updates
- Semantic HTML structure with proper headings

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Focus states have sufficient contrast
- Color is not the only indicator of state changes

### Motion Preferences
- Respects `prefers-reduced-motion: reduce`
- Provides alternative static indicators when motion is disabled
- Essential animations (loading states) remain functional

## Implementation Notes

### Framer Motion Integration
The design leverages the existing Framer Motion setup with these key patterns:

```typescript
// Entrance animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.2, 0.9, 0.2, 1] }
}

// Stagger children
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06
    }
  }
}
```

### CSS Custom Properties
Maintains compatibility with existing Tailwind setup while introducing new design tokens:

```css
/* New tokens for redesign */
--prompt-console-height: clamp(160px, 25vh, 280px);
--sidebar-width-collapsed: 72px;
--sidebar-width-expanded: 260px;
--credits-orb-size: 48px;
```

### Responsive Breakpoints
- Mobile: < 768px (sidebar becomes hamburger, console full width)
- Tablet: 768px - 1024px (sidebar auto-collapses)
- Desktop: > 1024px (full layout with expanded options)

This design document provides the foundation for implementing a premium, accessible dashboard that addresses all the issues identified in the original critique while maintaining the existing technical architecture and brand identity.