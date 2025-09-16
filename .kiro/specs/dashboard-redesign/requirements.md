# Requirements Document

## Introduction

This feature redesigns the PromptBrain dashboard to create a premium, cinematic user experience with improved visual hierarchy, better component organization, and enhanced user interactions. The redesign addresses current issues with visual weight distribution, component sizing, spacing inconsistencies, and lack of clear mode differentiation while introducing a cohesive motion system and improved accessibility.

## Requirements

### Requirement 1

**User Story:** As a user, I want a clean, focused interface that prioritizes the main chat console, so that I can concentrate on prompt creation without visual distractions.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the top navigation SHALL be removed or minimized to a thin status bar (8-12px) or eliminated entirely
2. WHEN viewing the dashboard THEN the main chat console SHALL be the primary focal element with dimensions of 220-280px height on desktop and max-width of 900-1000px
3. WHEN using mobile devices THEN the chat console SHALL collapse to minimum height of 160px while maintaining full width
4. WHEN the page loads THEN content SHALL be vertically centered using a 3-column grid layout with consistent spacing (64px top, 32px between major sections, 16px between elements)

### Requirement 2

**User Story:** As a user, I want a collapsible sidebar that doesn't consume excessive screen real estate, so that I have more space for the main content while still accessing navigation.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the sidebar SHALL be collapsed by default showing only a 72px wide vertical rail with icon-only buttons
2. WHEN I hover over or click the collapsed sidebar THEN it SHALL expand to 260px width with labels using a smooth animation (220-320ms duration)
3. WHEN the sidebar is expanded THEN it SHALL display items: Home, Enhance (active), History, Archive, Profile, Settings, Logout with visual hierarchy
4. WHEN I press Ctrl/Cmd + B THEN the sidebar SHALL toggle between collapsed and expanded states
5. WHEN interacting with sidebar items THEN they SHALL show hover effects (outer neon ring grow in 150ms) and active states (glowing left accent strip + 1.03 scale)

### Requirement 3

**User Story:** As a user, I want clear visual distinction between Ideate and Flow modes, so that I understand what behavior to expect and can see my progress through the flow.

#### Acceptance Criteria

1. WHEN in Ideate mode THEN the interface SHALL show a single large textarea with immediate Enhance functionality
2. WHEN in Flow mode THEN the interface SHALL display numbered question cards (1/5 format) above the input with small example placeholders
3. WHEN answering Flow questions THEN my responses SHALL appear as summarized pill chips above the input to show context accumulation
4. WHEN transitioning between questions THEN new questions SHALL appear with fade + slide animation (y: 8px → 0) and typing-dot intro (300ms)
5. WHEN I haven't provided sufficient answer (< 3 characters) THEN the Next button SHALL be visually disabled
6. WHEN completing all Flow questions THEN the Enhance button SHALL become enabled with clear visual indication

### Requirement 4

**User Story:** As a user, I want an informative and delightful credits system, so that I understand my usage and feel engaged with the credit mechanism.

#### Acceptance Criteria

1. WHEN viewing the dashboard THEN credits SHALL be displayed as a floating circular orb in the top-right corner with radial progress visualization
2. WHEN credits are full THEN the orb SHALL be cyan/blue, amber when low, and red when at 0
3. WHEN I hover over the credits orb THEN it SHALL expand into a popover showing breakdown (total, used today, resets in X days) and CTA to add credits
4. WHEN I click Enhance THEN the orb SHALL animate with a quick charge pulse and decrement animation (400ms)
5. WHEN idle THEN the orb SHALL show subtle breathing glow animation (6s loop)
6. WHEN credits are insufficient for enhancement THEN a modal SHALL prompt with "Add credits" CTA

### Requirement 5

**User Story:** As a user, I want smooth, cohesive animations throughout the interface, so that the experience feels polished and premium.

#### Acceptance Criteria

1. WHEN elements enter the view THEN they SHALL use entrance animations with 400-500ms duration and cubic-bezier(.2,.9,.2,1) easing
2. WHEN hovering over interactive elements THEN they SHALL respond with micro-animations of 150-220ms duration
3. WHEN multiple elements animate THEN they SHALL stagger with 0.06s delay between children
4. WHEN user has reduced motion preferences THEN all animations SHALL respect prefers-reduced-motion settings
5. WHEN Enhance is clicked THEN it SHALL show a charge animation in the credit orb plus small pyramid Lottie at center for 600-900ms
6. WHEN output is generated THEN it SHALL appear with cinematic reveal using clip-path circle expand animation

### Requirement 6

**User Story:** As a user, I want accessible keyboard navigation and clear visual feedback, so that I can efficiently use the interface regardless of my input method.

#### Acceptance Criteria

1. WHEN navigating with keyboard THEN all interactive elements SHALL be reachable via Tab key
2. WHEN focusing on elements THEN they SHALL show clear, visible focus states
3. WHEN using the main input THEN keyboard shortcuts (⌘ + Enter to Enhance) SHALL be communicated via micro hint text
4. WHEN interacting with the credits orb THEN it SHALL have appropriate aria-label with current credit count
5. WHEN text contrast is measured THEN all body text SHALL meet AA accessibility standards on their backgrounds
6. WHEN Enter key is pressed in input THEN it SHALL trigger the primary action (Next in Flow, Enhance in Ideate)

### Requirement 7

**User Story:** As a user, I want a cohesive visual design system with premium aesthetics, so that the interface feels sophisticated and trustworthy.

#### Acceptance Criteria

1. WHEN viewing the interface THEN it SHALL use the defined color palette: background #020203, panels #0f1113, brand gold #FFD34D, cyan #30C4C8, purple #7F56FF, text #E8E8EA
2. WHEN viewing text THEN display text SHALL use Playfair Display serif font and UI/body text SHALL use Inter variable font
3. WHEN viewing panels THEN they SHALL use glass effect with backdrop-filter: blur(8px) and soft neon edges using brand-gold at 8-12% opacity
4. WHEN viewing the background THEN it SHALL include subtle animated noise overlay (opacity 0.04) for depth
5. WHEN measuring spacing THEN it SHALL follow consistent rhythm: 8px, 12px, 20px, 32px, 64px scale
6. WHEN viewing borders THEN they SHALL use consistent radius values: 12px medium, 16px large

### Requirement 8

**User Story:** As a user, I want clear output presentation with useful actions, so that I can effectively work with the enhanced content.

#### Acceptance Criteria

1. WHEN enhancement completes THEN output SHALL render as a card below the input with title row containing copy button and dropdown for English/JSON formats
2. WHEN viewing output THEN content SHALL be selectable text with monospaced formatting for JSON
3. WHEN interacting with output THEN actions SHALL be available: Save, Copy, Edit, Regenerate
4. WHEN viewing output metadata THEN it SHALL show tokens used, credit cost, and model version in small text
5. WHEN output is too long THEN it SHALL be expandable/collapsible
6. WHEN copying output THEN it SHALL provide immediate visual feedback of successful copy action