// Motion variants for consistent animations across the app

export const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -20
  },
  transition: {
    duration: 0.4,
    ease: [0.2, 0.9, 0.2, 1]
  }
}

export const fadeInScale = {
  initial: {
    opacity: 0,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    scale: 1
  },
  exit: {
    opacity: 0,
    scale: 0.95
  },
  transition: {
    duration: 0.3,
    ease: [0.2, 0.9, 0.2, 1]
  }
}

export const slideInFromLeft = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: -20
  },
  transition: {
    duration: 0.4,
    ease: [0.2, 0.9, 0.2, 1]
  }
}

export const slideInFromRight = {
  initial: {
    opacity: 0,
    x: 20
  },
  animate: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: 20
  },
  transition: {
    duration: 0.4,
    ease: [0.2, 0.9, 0.2, 1]
  }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
}

export const staggerItem = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.2, 0.9, 0.2, 1]
    }
  }
}

export const hoverLift = {
  whileHover: {
    y: -2,
    transition: {
      duration: 0.15,
      ease: [0.2, 0.9, 0.2, 1]
    }
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
}

export const scaleOnHover = {
  whileHover: {
    scale: 1.02,
    transition: {
      duration: 0.15,
      ease: [0.2, 0.9, 0.2, 1]
    }
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
}

export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(255, 211, 77, 0.2)',
      '0 0 30px rgba(255, 211, 77, 0.4)',
      '0 0 20px rgba(255, 211, 77, 0.2)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

export const chargePulse = {
  animate: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 0 20px rgba(255, 211, 77, 0.3)',
      '0 0 40px rgba(255, 211, 77, 0.6)',
      '0 0 20px rgba(255, 211, 77, 0.3)'
    ],
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}

export const clipPathReveal = {
  initial: {
    clipPath: 'circle(0% at 50% 50%)'
  },
  animate: {
    clipPath: 'circle(100% at 50% 50%)',
    transition: {
      duration: 0.6,
      ease: [0.2, 0.9, 0.2, 1]
    }
  }
}

// Reduced motion variants for accessibility
export const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.01 }
}

// Hook to check for reduced motion preference
export const useReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}