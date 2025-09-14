// Design tokens matching the PRD specification
export const designTokens = {
  colors: {
    // Primary background
    background: '#070707',
    
    // Glass effects
    glass: 'rgba(0, 0, 0, 0.4)',
    glassBorder: 'rgba(255, 212, 64, 0.08)',
    
    // Brand gradients
    accent: 'linear-gradient(90deg, #6E00FF, #4A8DFF)',
    accentHover: 'linear-gradient(90deg, #7F1AFF, #5B9EFF)',
    
    // Gold accent (temple)
    gold: '#FFD400',
    goldBorder: 'rgba(255, 212, 64, 0.08)',
    
    // Text hierarchy
    textPrimary: '#EDEDED',
    textMuted: '#A6A6A6',
    textAccent: '#6E00FF',
    
    // Focus and interaction
    focusRing: 'rgba(110, 0, 255, 0.28)',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },

  typography: {
    // Font families
    fontSerif: 'Playfair Display, serif',
    fontSans: 'Inter Variable, sans-serif',
    
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
    normal: 1.5,
    relaxed: 1.7,
    
    // Font weights
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px'
  },

  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px'
  },

  shadows: {
    glass: '0 20px 40px -20px rgba(0, 0, 0, 0.6)',
    glow: '0 0 20px rgba(110, 0, 255, 0.3)',
    glowHover: '0 0 30px rgba(110, 0, 255, 0.4)',
    focus: '0 0 0 1px rgba(110, 0, 255, 0.28)',
    card: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },

  blur: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  }
}

// CSS custom properties for Tailwind
export const cssVariables = {
  '--color-background': designTokens.colors.background,
  '--color-glass': designTokens.colors.glass,
  '--color-text-primary': designTokens.colors.textPrimary,
  '--color-text-muted': designTokens.colors.textMuted,
  '--color-accent': designTokens.colors.textAccent,
  '--color-focus': designTokens.colors.focusRing,
  '--font-serif': designTokens.typography.fontSerif,
  '--font-sans': designTokens.typography.fontSans
}