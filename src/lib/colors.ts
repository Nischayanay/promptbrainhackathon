// Cinematic AI Experience Color System
// As defined in the Micro PRD

export const CINEMATIC_COLORS = {
  // Base colors
  base: '#0B0C10',
  dark: '#000000',
  
  // Neon palette
  neonCyan: '#00FFE7',
  deepEmerald: '#0AFF90',
  accentGold: '#FFD600',
  
  // Glass system
  glassWhite: '#FFFFFF',
  glassOverlay: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  
  // Status colors
  softRed: '#FF4D4D',
  successGreen: '#2ECC71',
} as const;

// Glassmorphism opacity levels
export const GLASS_OPACITY = {
  light: 0.08,
  medium: 0.12,
  strong: 0.15,
  overlay: 0.75,
} as const;

// Blur levels for backdrop-filter
export const GLASS_BLUR = {
  soft: '16px',
  medium: '20px',
  strong: '24px',
} as const;

// Glow effects for different states
export const GLOW_EFFECTS = {
  cyan: {
    subtle: 'rgba(0, 255, 231, 0.2)',
    medium: 'rgba(0, 255, 231, 0.4)',
    strong: 'rgba(0, 255, 231, 0.6)',
  },
  emerald: {
    subtle: 'rgba(10, 255, 144, 0.2)',
    medium: 'rgba(10, 255, 144, 0.4)',
    strong: 'rgba(10, 255, 144, 0.6)',
  },
  gold: {
    subtle: 'rgba(255, 214, 0, 0.2)',
    medium: 'rgba(255, 214, 0, 0.4)',
    strong: 'rgba(255, 214, 0, 0.6)',
  },
} as const;

// Gradient definitions
export const CINEMATIC_GRADIENTS = {
  hero: `linear-gradient(135deg, ${CINEMATIC_COLORS.base} 0%, ${CINEMATIC_COLORS.dark} 50%, ${CINEMATIC_COLORS.base} 100%)`,
  neon: `linear-gradient(45deg, ${CINEMATIC_COLORS.neonCyan} 0%, ${CINEMATIC_COLORS.deepEmerald} 100%)`,
  glass: `linear-gradient(135deg, ${GLASS_OPACITY.light} 0%, ${GLASS_OPACITY.medium} 100%)`,
  glow: `radial-gradient(circle, ${GLOW_EFFECTS.cyan.medium} 0%, transparent 70%)`,
} as const;

// Shadow system for ambient lighting
export const AMBIENT_SHADOWS = {
  soft: '0 16px 32px rgba(0, 0, 0, 0.2)',
  medium: '0 24px 48px rgba(0, 0, 0, 0.3)',
  strong: '0 32px 64px rgba(0, 0, 0, 0.4)',
  glow: '0 0 40px rgba(0, 255, 231, 0.3)',
} as const;