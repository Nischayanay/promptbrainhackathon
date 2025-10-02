// Design tokens for premium dashboard redesign
export const designTokens = {
  colors: {
    // Apple/Chronicle-inspired background palette
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceElevated: '#2a2a2a',
    panel: '#1a1a1a',
    
    // Brand colors with Apple-like refinement
    brandGold: '#ffd700',
    accentBlue: '#3b82f6',
    accentPurple: '#8b5cf6',
    accentCyan: '#06b6d4',
    
    // Glass effects with subtle refinement
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    glassStrong: 'rgba(255, 255, 255, 0.08)',
    
    // Text hierarchy with improved contrast
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    textAccent: '#ffd700',
    
    // Focus and interaction states
    focusRing: 'rgba(59, 130, 246, 0.5)',
    hover: 'rgba(255, 255, 255, 0.05)',
    active: 'rgba(255, 255, 255, 0.1)',
    
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Credits orb states
    creditsHigh: '#10b981',
    creditsLow: '#f59e0b', 
    creditsEmpty: '#ef4444'
  },

  typography: {
    // Font families - Apple-inspired system fonts
    fontDisplay: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    fontBody: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    fontMono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    
    // Font sizes with consistent scale
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    
    // Line heights
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
    
    // Font weights
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  },

  spacing: {
    // Consistent spacing scale
    '0': '0',
    '1': '0.25rem',   // 4px
    '2': '0.5rem',    // 8px
    '3': '0.75rem',   // 12px
    '4': '1rem',      // 16px
    '5': '1.25rem',   // 20px
    '6': '1.5rem',    // 24px
    '8': '2rem',      // 32px
    '10': '2.5rem',   // 40px
    '12': '3rem',     // 48px
    '16': '4rem',     // 64px
    '20': '5rem',     // 80px
    '24': '6rem',     // 96px
    
    // Component-specific spacing
    sidebarCollapsed: '4.5rem',  // 72px
    sidebarExpanded: '16.25rem', // 260px
    consoleHeight: 'clamp(10rem, 25vh, 17.5rem)', // 160px-280px
    creditsOrbSize: '3rem'       // 48px
  },

  borderRadius: {
    none: '0',
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  shadows: {
    // Apple-inspired shadow system
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Special effects
    glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
    glowHover: '0 0 30px rgba(59, 130, 246, 0.4)',
    focus: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
  },

  blur: {
    glass: '8px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },

  motion: {
    // Apple-inspired timing functions
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    
    // Durations
    fastest: '100ms',
    fast: '150ms',
    medium: '200ms',
    slow: '300ms',
    slowest: '500ms',
    
    // Stagger delays
    stagger: '50ms',
    staggerSlow: '100ms'
  }
}

// CSS custom properties for modern dashboard
export const cssVariables = {
  // Colors
  '--color-background': designTokens.colors.background,
  '--color-surface': designTokens.colors.surface,
  '--color-surface-elevated': designTokens.colors.surfaceElevated,
  '--color-panel': designTokens.colors.panel,
  '--color-brand-gold': designTokens.colors.brandGold,
  '--color-accent-blue': designTokens.colors.accentBlue,
  '--color-accent-purple': designTokens.colors.accentPurple,
  '--color-accent-cyan': designTokens.colors.accentCyan,
  '--color-text-primary': designTokens.colors.textPrimary,
  '--color-text-secondary': designTokens.colors.textSecondary,
  '--color-text-muted': designTokens.colors.textMuted,
  '--color-text-accent': designTokens.colors.textAccent,
  '--color-glass': designTokens.colors.glass,
  '--color-glass-border': designTokens.colors.glassBorder,
  '--color-glass-strong': designTokens.colors.glassStrong,
  '--color-hover': designTokens.colors.hover,
  '--color-active': designTokens.colors.active,
  '--color-success': designTokens.colors.success,
  '--color-warning': designTokens.colors.warning,
  '--color-error': designTokens.colors.error,
  '--color-info': designTokens.colors.info,
  
  // Typography
  '--font-display': designTokens.typography.fontDisplay,
  '--font-body': designTokens.typography.fontBody,
  '--font-mono': designTokens.typography.fontMono,
  
  // Spacing
  '--space-1': designTokens.spacing['1'],
  '--space-2': designTokens.spacing['2'],
  '--space-3': designTokens.spacing['3'],
  '--space-4': designTokens.spacing['4'],
  '--space-5': designTokens.spacing['5'],
  '--space-6': designTokens.spacing['6'],
  '--space-8': designTokens.spacing['8'],
  '--space-10': designTokens.spacing['10'],
  '--space-12': designTokens.spacing['12'],
  '--space-16': designTokens.spacing['16'],
  '--space-20': designTokens.spacing['20'],
  '--space-24': designTokens.spacing['24'],
  
  // Component dimensions
  '--sidebar-width-collapsed': designTokens.spacing.sidebarCollapsed,
  '--sidebar-width-expanded': designTokens.spacing.sidebarExpanded,
  '--console-height': designTokens.spacing.consoleHeight,
  '--credits-orb-size': designTokens.spacing.creditsOrbSize,
  
  // Border radius
  '--radius-sm': designTokens.borderRadius.sm,
  '--radius-md': designTokens.borderRadius.md,
  '--radius-lg': designTokens.borderRadius.lg,
  '--radius-xl': designTokens.borderRadius.xl,
  '--radius-2xl': designTokens.borderRadius['2xl'],
  '--radius-3xl': designTokens.borderRadius['3xl'],
  '--radius-full': designTokens.borderRadius.full,
  
  // Shadows
  '--shadow-xs': designTokens.shadows.xs,
  '--shadow-sm': designTokens.shadows.sm,
  '--shadow-md': designTokens.shadows.md,
  '--shadow-lg': designTokens.shadows.lg,
  '--shadow-xl': designTokens.shadows.xl,
  '--shadow-2xl': designTokens.shadows['2xl'],
  '--shadow-glass': designTokens.shadows.glass,
  '--shadow-glow': designTokens.shadows.glow,
  '--shadow-focus': designTokens.shadows.focus,
  
  // Motion
  '--ease-out': designTokens.motion.easeOut,
  '--ease-in': designTokens.motion.easeIn,
  '--ease-in-out': designTokens.motion.easeInOut,
  '--ease-spring': designTokens.motion.spring,
  '--duration-fastest': designTokens.motion.fastest,
  '--duration-fast': designTokens.motion.fast,
  '--duration-medium': designTokens.motion.medium,
  '--duration-slow': designTokens.motion.slow,
  '--duration-slowest': designTokens.motion.slowest
}