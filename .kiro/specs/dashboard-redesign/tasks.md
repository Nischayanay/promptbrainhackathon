# Implementation Plan

- [x] 1. Set up design tokens and CSS foundation
  - Create new CSS custom properties for the redesigned color palette, spacing, and typography
  - Update existing design tokens to match the premium aesthetic (#020203 background, #FFD34D brand gold, etc.)
  - Add glass effect utilities and motion system CSS variables
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 2. Create AppShell layout component
  - Build the 3-column CSS Grid layout container that manages global positioning
  - Implement responsive behavior with proper breakpoints (mobile < 768px, tablet 768-1024px, desktop > 1024px)
  - Add consistent vertical rhythm spacing (64px top, 32px between sections, 16px between elements)
  - _Requirements: 1.1, 1.4_

- [x] 3. Implement CollapsibleSidebar component
  - Create sidebar that defaults to collapsed state (72px wide) with icon-only navigation
  - Add smooth expand/collapse animation (220-320ms duration) triggered by hover or click
  - Implement navigation items (Home, Enhance, History, Archive, Profile, Settings, Logout) with proper visual hierarchy
  - Add keyboard shortcut (Ctrl/Cmd + B) for toggle functionality
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4. Build FloatingCreditsOrb component
  - Create circular orb with radial progress visualization using SVG
  - Implement color states (cyan/blue when full, amber when low, red when empty)
  - Add floating position in top-right corner with subtle breathing glow animation (6s loop)
  - Create hover popover showing credit breakdown (total, used today, reset date, CTA)
  - Add charge pulse and decrement animations (400ms) triggered on enhance usage
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5. Redesign PromptConsole as the primary focal component
  - Update dimensions to 220-280px height on desktop, max-width 900-1000px, centered positioning
  - Implement mobile responsive behavior (160px min-height, full width)
  - Add glass effect styling with backdrop-filter: blur(8px) and 16px border radius
  - Create clear visual distinction between Ideate and Flow modes
  - _Requirements: 1.2, 1.3, 3.1_

- [x] 6. Implement Flow mode question system
  - Create FlowQuestionCard component that displays numbered questions (1/5 format) above input
  - Add question transition animations with fade + slide (y: 8px → 0) and typing-dot intro (300ms)
  - Implement answer accumulation as pill chips above input to show context building
  - Add Next button with disabled state when answer length < 3 characters
  - Create flow completion logic that enables Enhance button after all questions answered
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 7. Enhance motion system with Framer Motion animations
  - Implement entrance animations (400-500ms duration, cubic-bezier(.2,.9,.2,1) easing)
  - Add hover micro-animations (150-220ms duration) for interactive elements
  - Create stagger animations with 0.06s delay between children
  - Add prefers-reduced-motion support to respect user accessibility preferences
  - Implement Enhance button charge animation and credit orb pulse on usage
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. Create enhanced OutputCard component
  - Build output card that renders below PromptConsole with expandable/collapsible functionality
  - Add header row with mode tag, timestamp, and re-run button
  - Implement format toggle dropdown (English/JSON) with smooth transitions
  - Create action bar with Copy, Save, Edit, Regenerate buttons
  - Add metadata display (tokens used, credit cost, model version)
  - Implement cinematic reveal animation using clip-path circle expand
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 9. Implement comprehensive keyboard navigation and accessibility
  - Add proper tab order: Sidebar → Mode toggle → Input → Enhance button → Output actions
  - Implement keyboard shortcuts (⌘ + Enter to Enhance) with visual hint display
  - Add ARIA labels for credits orb, interactive elements, and dynamic content
  - Create visible focus states that meet accessibility standards
  - Ensure all text meets WCAG AA contrast requirements (4.5:1 ratio minimum)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 10. Add copy functionality with format options and feedback
  - Implement copy to clipboard for English, JSON, and Markdown formats
  - Add visual feedback animations for successful copy actions
  - Create format-specific output transformations (JSON structure, Markdown formatting)
  - Add toast notifications with proper timing and positioning
  - _Requirements: 8.6_

- [x] 11. Integrate all components into Dashboard2Pro
  - Replace existing Dashboard2Pro layout with new AppShell structure
  - Connect all component interactions and state management
  - Implement proper error boundaries and loading states
  - Add responsive behavior testing across all breakpoints
  - Ensure smooth transitions between all component states
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 12. Add comprehensive error handling and loading states
  - Implement loading animations for Enhance button (spinning icon, disabled state)
  - Add error states for insufficient credits with modal prompt
  - Create network error handling with retry mechanisms
  - Add input validation with real-time feedback
  - Implement graceful degradation for animation failures
  - _Requirements: 4.6_

- [ ] 13. Optimize performance and add testing
  - Ensure animations run at 60fps or degrade gracefully
  - Add lazy loading for non-critical components
  - Implement proper cleanup for animation listeners
  - Add unit tests for component rendering and state management
  - Create accessibility tests for keyboard navigation and screen reader support
  - _Requirements: 5.4, 6.1, 6.2, 6.3, 6.4, 6.5_