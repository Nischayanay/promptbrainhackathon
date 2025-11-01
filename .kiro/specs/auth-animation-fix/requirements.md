# Requirements Document

## Introduction

Change the direction of existing animations in the PromptBrain authentication form from vertical (up/down) movement to horizontal (left/right) movement while preserving all existing design and motion effects.

## Glossary

- **AuthForm**: The authentication component located at `pbauth/src/components/AuthForm.tsx`
- **Framer Motion**: Animation library used for component animations
- **Vertical Movement**: Current y-axis animations (translateY, y transforms)
- **Horizontal Movement**: Target x-axis animations (translateX, x transforms)

## Requirements

### Requirement 1

**User Story:** As a user visiting the authentication page, I want the existing animations to move horizontally instead of vertically so that the visual effects feel more natural.

#### Acceptance Criteria

1. WHEN a user hovers over buttons, THE AuthForm SHALL move elements horizontally instead of vertically
2. WHEN switching between login and signup modes, THE AuthForm SHALL animate the name field horizontally
3. WHEN the page loads, THE AuthForm SHALL use horizontal entrance animations instead of vertical ones
4. THE AuthForm SHALL preserve all existing animation timing, easing, and visual design
5. THE AuthForm SHALL maintain identical animation behavior except for direction change

### Requirement 2

**User Story:** As a developer maintaining the code, I want minimal code changes so that the existing functionality and design remain intact.

#### Acceptance Criteria

1. THE AuthForm SHALL change only the animation direction properties (y to x)
2. THE AuthForm SHALL preserve all existing animation durations and easing functions
3. THE AuthForm SHALL maintain all existing visual styling and layout
4. THE AuthForm SHALL keep all existing Framer Motion animation patterns
5. THE AuthForm SHALL require no design mockups or visual redesign