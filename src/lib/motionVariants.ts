// Motion system with consistent timing and easing
export const motionVariants = {
  // Base timing
  timing: {
    fast: 0.12,
    base: 0.32,
    slow: 0.5,
    cinematic: 0.75
  },

  // Easing curves
  easing: {
    gentle: [0.2, 0.9, 0.2, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    expo: [0.19, 1, 0.22, 1] as const
  },

  // Common animations
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },

  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },

  // Hover effects
  hover: {
    scale: 1.03,
    y: -3,
    transition: { duration: 0.12 }
  },

  tap: {
    scale: 0.97,
    transition: { duration: 0.12 }
  },

  // Focus states
  focus: {
    scale: 1.01,
    y: -2,
    boxShadow: '0 0 0 1px rgba(110,0,255,0.28)',
    transition: { duration: 0.32 }
  }
}

// Stagger configurations
export const staggerConfig = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.32, ease: motionVariants.easing.gentle }
    }
  }
}