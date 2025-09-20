// Cinematic AI Experience Animation System
// Framer Motion configurations for 60fps performance with accessibility support

import { CINEMATIC_TIMING, CINEMATIC_EASING, CINEMATIC_STAGGER } from './performance';

// Check for reduced motion preference
const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

// Accessibility-aware motion configuration
export const ACCESSIBLE_MOTION = {
  duration: prefersReducedMotion ? 0.01 : 0.3,
  ease: prefersReducedMotion ? "linear" : [0.4, 0, 0.2, 1],
  stagger: prefersReducedMotion ? 0 : 0.1,
  scale: prefersReducedMotion ? 1 : 1.05,
  translate: prefersReducedMotion ? 0 : 4
};

// Transition presets
export const CINEMATIC_TRANSITIONS = {
  // Hero section animations
  heroFadeOut: {
    duration: 0.8,
    ease: CINEMATIC_EASING.smooth,
  },
  
  dashboardFadeIn: {
    duration: 0.8,
    ease: CINEMATIC_EASING.smooth,
    delay: 0.1,
  },
  
  // Card animations
  cardReveal: {
    duration: 0.6,
    ease: CINEMATIC_EASING.smooth,
  },
  
  cardHover: {
    duration: 0.3,
    ease: CINEMATIC_EASING.subtle,
  },
  
  cardFloat: {
    duration: 4,
    ease: 'easeInOut',
    repeat: Infinity,
  },
  
  // Text animations
  textStagger: {
    duration: 0.6,
    ease: CINEMATIC_EASING.smooth,
    staggerChildren: CINEMATIC_STAGGER.text,
  },
  
  // Button and interaction animations
  buttonPress: {
    duration: 0.15,
    ease: CINEMATIC_EASING.subtle,
  },
  
  iconTilt: {
    duration: 0.3,
    ease: CINEMATIC_EASING.smooth,
  },
  
  // System status animations
  statusPulse: {
    duration: 2,
    ease: 'easeInOut',
    repeat: Infinity,
  },
  
  // Loading animations
  spinnerRotate: {
    duration: 1,
    ease: 'linear',
    repeat: Infinity,
  },
  
  dotsStagger: {
    duration: 1.2,
    ease: 'easeInOut',
    repeat: Infinity,
    staggerChildren: 0.2,
  },
} as const;

// Animation variants for different states
export const CINEMATIC_VARIANTS = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.05, y: -20 },
  },
  
  // Card states with accessibility support
  cardStates: {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 40, scale: prefersReducedMotion ? 1 : 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    hover: { y: prefersReducedMotion ? 0 : -4, scale: prefersReducedMotion ? 1 : 1.02 },
    tap: { scale: prefersReducedMotion ? 1 : 0.98 },
  },
  
  // Text reveal with accessibility support
  textReveal: {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
  },
  
  // Floating elements with accessibility support
  float: {
    animate: prefersReducedMotion ? {
      y: 0,
      transition: { duration: 0.01 }
    } : {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  },
  
  // Glow effects
  glowPulse: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(0, 255, 231, 0.3)',
        '0 0 40px rgba(0, 255, 231, 0.6)',
        '0 0 20px rgba(0, 255, 231, 0.3)',
      ],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  },
  
  // Status indicators
  online: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  },
  
  // Loading states
  processing: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  },
} as const;

// Spring configurations for natural motion
export const CINEMATIC_SPRINGS = {
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
  
  bouncy: {
    type: 'spring',
    stiffness: 200,
    damping: 10,
  },
  
  snappy: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
  
  wobbly: {
    type: 'spring',
    stiffness: 150,
    damping: 8,
  },
} as const;

// Orchestrated animation sequences
export const CINEMATIC_SEQUENCES = {
  // Dashboard entrance
  dashboardEntrance: {
    hero: { delay: 0, duration: 0.8 },
    statusBar: { delay: 0.2, duration: 0.6 },
    title: { delay: 0.4, duration: 0.8 },
    modeCards: { delay: 0.6, duration: 0.6 },
    console: { delay: 0.8, duration: 0.6 },
    stats: { delay: 1.0, duration: 0.6 },
  },
  
  // Hero to dashboard transition
  heroTransition: {
    heroFadeOut: { delay: 0, duration: 0.8 },
    backgroundShift: { delay: 0.2, duration: 1.0 },
    dashboardFadeIn: { delay: 0.4, duration: 0.8 },
  },
  
  // Output panel reveal
  outputReveal: {
    slideIn: { delay: 0, duration: 0.6 },
    contentStagger: { delay: 0.2, duration: 0.4 },
    glowActivate: { delay: 0.4, duration: 0.3 },
  },
} as const;