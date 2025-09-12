**Add your own guidelines here**
<!--

System Guidelines – PromptBrain

Use this file to provide the AI with rules and guidelines it must follow during design, generation, and development of PromptBrain.

General Guidelines

Prefer responsive layouts (grid/flexbox) over absolute positioning.

Always keep UI minimal, modern, and distraction-free.

Refactor and simplify code/design components to keep files clean.

Maintain consistent spacing system (8px scale).

Keep microcopy professional, helpful, and human (tone: “Apple x Notion”).

Use subtle animations (fade, slide, hover) — never distracting.

Design System Guidelines

Typography:

Base font-size: 14px → scalable with rem.

Headings: Semi-bold, clear hierarchy (H1: 24px, H2: 20px, H3: 16px).

Body: Regular, 14–16px.

Font family: Inter / SF Pro / similar modern sans-serif.

Color Palette:

Primary: Deep Indigo (#4B4DED).

Secondary: Soft Gray (#F5F6F8).

Accent: Electric Blue (#3A86FF).

Error: Soft Red (#FF4D4D).

Success: Green (#2ECC71).

Always maintain high contrast for accessibility.

Spacing Tokens:

XS → 4px

SM → 8px

MD → 16px

LG → 24px

XL → 32px

Date Format: “Sep 03” (MMM DD).

Empty States: Should always have an illustration + guiding text.

Button

The Button component is a fundamental interactive element, designed to guide actions clearly.

Usage

Use for important actions: submissions, confirmations, starting processes.

Always label with clear verbs (e.g., “Sign In”, “Enhance Prompt”).

Only one Primary Button per screen/section.

Variants

Primary Button

Purpose: Highlight the main action

Style: Filled, primary brand color, white text

Usage: Only one per page section

Secondary Button

Purpose: Supportive/alternative actions

Style: Outlined with primary brand color, transparent background

Usage: Can be paired with a primary button

Tertiary Button

Purpose: Low-priority actions

Style: Text-only, brand color

Usage: For non-disruptive actions (e.g., “Learn More”)

Input Fields

Shape: Rounded corners (12–16px).

Border: 1px solid light gray, with subtle focus glow in primary color.

Placeholder: Neutral tone, never too dark.

Error State: Red border + helper text below.

Support inline icons (e.g., search, visibility toggle).

Cards

Used to group content (prompt input, outputs, saved prompts).

Rounded (16–20px), soft shadow, light background.

Padding: MD (16px) inside content.

Hover: Slight lift (shadow + scale 1.01).

Branding Guidelines

Logo Usage: Always placed top-left in login and dashboard.

Tagline: “Smarter Prompts, Smarter You.”

Tone of Voice: Professional, concise, friendly.

Illustrations: Minimal, abstract, vector-style (no stock images).

Animations: Subtle micro-interactions — e.g., button hover glow, loader with bouncing dots.