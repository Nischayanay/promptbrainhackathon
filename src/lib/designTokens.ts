// Design tokens for premium dashboard redesign
export const designTokens = {
  colors: {
    // Premium background palette
    background: '#020203',
    panel: '#0f1113',
    
    // Brand colors
    brandGold: '#FFD34D',
    accentCyan: '#30C4C8',
    accentPurple: '#7F56FF',
    
    // Glass effects
    glass: 'rgba(255, 255, 255, 0.04)',
    glassBorder: 'rgba(255, 212, 77, 0.12)',
    
    // Text hierarchy
    textPrimary: '#E8E8EA',
    textMuted: '#A6A6AB',
    textAccent: '#FFD34D',
    
    // Focus and interaction
    focusRing: 'rgba(255, 211, 77, 0.4)',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    
    // Credits orb states
    creditsHigh: '#30C4C8',
    creditsLow: '#FFD34D', 
    creditsEmpty: '#EF4444'
  },

  typography: {
    // Font families
    fontDisplay: 'Playfair Display, serif',
    fontBody: 'Inter Variable, -apple-system, BlinkMacSystemFont, sans-serif',
    
    // Font sizes
    hero: '48px',
    heroMobile: '36px',
    h1: '36px',
    h2: '28px',
    h3: '24px',
    body: '16px',
    small: '14px',
    xs: '12px',
    
    // Line heights
    tight: 1.2,
    normalHeight: 1.4,
    relaxed: 1.6,
    
    // Font weights
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  spacing: {
    xs: '8px',
    sm: '12px',
    md: '20px',
    lg: '32px',
    xl: '64px',
    
    // Component-specific spacing
    sidebarCollapsed: '72px',
    sidebarExpanded: '260px',
    consoleHeight: 'clamp(160px, 25vh, 280px)',
    creditsOrbSize: '48px'
  },

  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
  },

  shadows: {
    glass: '0 20px 40px -20px rgba(0, 0, 0, 0.6)',
    glow: '0 0 20px rgba(255, 211, 77, 0.3)',
    glowHover: '0 0 30px rgba(255, 211, 77, 0.4)',
    focus: '0 0 0 2px rgba(255, 211, 77, 0.4)',
    card: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },

  blur: {
    glass: '8px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },

  motion: {
    // Timing functions
    easeOut: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Durations
    fast: '150ms',
    medium: '220ms',
    slow: '400ms',
    entrance: '500ms',
    
    // Stagger delay
    stagger: '60ms'
  }
}

// CSS custom properties for premium dashboard
export const cssVariables = {
  // Colors
  '--bg': designTokens.colors.background,
  '--panel': designTokens.colors.panel,
  '--brand-gold': designTokens.colors.brandGold,
  '--accent-cyan': designTokens.colors.accentCyan,
  '--accent-purple': designTokens.colors.accentPurple,
  '--text-primary': designTokens.colors.textPrimary,
  '--text-muted': designTokens.colors.textMuted,
  '--glass': designTokens.colors.glass,
  '--glass-border': designTokens.colors.glassBorder,
  
  // Typography
  '--font-display': designTokens.typography.fontDisplay,
  '--font-body': designTokens.typography.fontBody,
  
  // Spacing
  '--space-xs': designTokens.spacing.xs,
  '--space-sm': designTokens.spacing.sm,
  '--space-md': designTokens.spacing.md,
  '--space-lg': designTokens.spacing.lg,
  '--space-xl': designTokens.spacing.xl,
  
  // Component dimensions
  '--sidebar-width-collapsed': designTokens.spacing.sidebarCollapsed,
  '--sidebar-width-expanded': designTokens.spacing.sidebarExpanded,
  '--console-height': designTokens.spacing.consoleHeight,
  '--credits-orb-size': designTokens.spacing.creditsOrbSize,
  
  // Border radius
  '--radius-sm': designTokens.borderRadius.sm,
  '--radius-md': designTokens.borderRadius.md,
  '--radius-lg': designTokens.borderRadius.lg,
  '--radius-xl': designTokens.borderRadius.xl
}