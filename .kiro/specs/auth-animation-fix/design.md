# Design Document

## Overview

This design outlines the minimal changes needed to convert vertical (y-axis) animations to horizontal (x-axis) animations in the AuthForm component. The approach focuses on preserving all existing design elements, timing, and visual effects while only changing the animation direction.

## Architecture

### Current Animation System
- **Framer Motion**: Used for all animations in the AuthForm component
- **Animation Types**: Hover effects, entrance animations, and mode transition animations
- **Current Direction**: Vertical (y-axis) movements causing up/down motion

### Target Animation System
- **Same Framework**: Continue using Framer Motion with identical configuration
- **Direction Change**: Convert all y-axis animations to x-axis animations
- **Preserved Elements**: All timing, easing, durations, and visual styling remain unchanged

## Components and Interfaces

### AuthForm Component (`pbauth/src/components/AuthForm.tsx`)

#### Current Vertical Animations to Convert:
1. **Button Hover Effects**
   - Current: `whileHover={{ y: -1 }}`
   - Target: `whileHover={{ x: 1 }}`

2. **Main Card Entrance Animation**
   - Current: `initial={{ y: 20, opacity: 0 }}, animate={{ y: 0, opacity: 1 }}`
   - Target: `initial={{ x: 20, opacity: 0 }}, animate={{ x: 0, opacity: 1 }}`

3. **Name Field AnimatePresence**
   - Current: `initial={{ opacity: 0, height: 0, y: -10 }}, animate={{ opacity: 1, height: "auto", y: 0 }}, exit={{ opacity: 0, height: 0, y: -10 }}`
   - Target: `initial={{ opacity: 0, height: 0, x: -10 }}, animate={{ opacity: 1, height: "auto", x: 0 }}, exit={{ opacity: 0, height: 0, x: -10 }}`

4. **Benefit Text Animation**
   - Current: `initial={{ opacity: 0, y: -5 }}, animate={{ opacity: 1, y: 0 }}, exit={{ opacity: 0, y: -5 }}`
   - Target: `initial={{ opacity: 0, x: -5 }}, animate={{ opacity: 1, x: 0 }}, exit={{ opacity: 0, x: -5 }}`

#### Preserved Elements:
- All transition durations and easing functions
- All opacity animations
- All height animations for the name field
- All visual styling and CSS classes
- All component structure and logic

## Data Models

No data model changes required. All existing state management, form handling, and component props remain identical.

## Error Handling

No changes to error handling. All existing error states, validation, and user feedback mechanisms remain unchanged.

## Testing Strategy

### Manual Testing:
1. **Hover Testing**: Verify buttons move horizontally (right) on hover instead of vertically (up)
2. **Mode Switching**: Confirm name field slides horizontally when switching between login/signup
3. **Page Load**: Check entrance animations move from left to right instead of bottom to top
4. **Visual Regression**: Ensure all styling, colors, spacing, and layout remain identical

### Validation Criteria:
- Animation direction changed from vertical to horizontal
- All animation timing preserved
- No visual design changes
- No functional behavior changes
- Smooth horizontal transitions maintained