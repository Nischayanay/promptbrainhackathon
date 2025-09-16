/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./App.tsx"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Premium dashboard colors
        'premium-bg': 'var(--bg)',
        'premium-panel': 'var(--panel)',
        'brand-gold': 'var(--brand-gold)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-purple': 'var(--accent-purple)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        'glass': 'var(--glass)',
        'glass-border': 'var(--glass-border)',
        
        // Legacy temple theme colors (for compatibility)
        'temple-black': 'var(--color-temple-black)',
        'royal-gold': 'var(--color-royal-gold)',
        'marble-white': 'var(--color-marble-white)',
        'violet': 'var(--color-violet)',
        'electric-blue': 'var(--color-electric-blue)',
        'magenta': 'var(--color-magenta)',
        'cyan-glow': 'var(--color-cyan-glow)',
        
        // Shadcn colors
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        chart: {
          "1": "var(--color-chart-1)",
          "2": "var(--color-chart-2)",
          "3": "var(--color-chart-3)",
          "4": "var(--color-chart-4)",
          "5": "var(--color-chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--color-sidebar)",
          foreground: "var(--color-sidebar-foreground)",
          primary: "var(--color-sidebar-primary)",
          "primary-foreground": "var(--color-sidebar-primary-foreground)",
          accent: "var(--color-sidebar-accent)",
          "accent-foreground": "var(--color-sidebar-accent-foreground)",
          border: "var(--color-sidebar-border)",
          ring: "var(--color-sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter Variable', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      spacing: {
        'sidebar-collapsed': 'var(--sidebar-width-collapsed)',
        'sidebar-expanded': 'var(--sidebar-width-expanded)',
        'console-height': 'var(--console-height)',
        'credits-orb': 'var(--credits-orb-size)',
      },
      animation: {
        // Premium dashboard animations
        'fade-in-up': 'fadeInUp 500ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
        'fade-slide-up': 'fadeSlideUp 300ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
        'breathing-glow': 'breathingGlow 6s ease-in-out infinite',
        'charge-pulse': 'chargePulse 400ms ease-out',
        'clip-reveal': 'clipPathReveal 600ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards',
        
        // Legacy animations (for compatibility)
        'gradient-flow': 'gradient-flow 12s ease infinite',
        'temple-glow': 'temple-glow 4s ease-in-out infinite',
        'beam-rise': 'beam-rise 3s ease-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'hieroglyph-float': 'hieroglyph-float 12s ease-in-out infinite',
        'data-flow-up': 'data-flow-up 3s ease-in-out infinite',
        'data-flow-down': 'data-flow-down 3s ease-in-out infinite',
        'cosmic-drift-1': 'cosmic-drift-1 20s linear infinite',
        'cosmic-drift-2': 'cosmic-drift-2 25s linear infinite',
        'cosmic-drift-3': 'cosmic-drift-3 30s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'pyramid-glow': 'pyramid-glow 4s ease-in-out infinite',
        'apex-beam': 'apex-beam 3s ease-in-out infinite',
        'orbit-slow': 'orbit-slow 60s linear infinite',
        'float-particle': 'float-particle 3s ease-in-out infinite',
        'twinkle-subtle': 'twinkle-subtle 4s ease-in-out infinite',
        'slow-glow': 'slow-glow 6s ease-in-out infinite',
        'slide-in-from-right': 'slide-in-from-right 0.5s ease-out',
      },
      transitionTimingFunction: {
        'premium-out': 'cubic-bezier(0.2, 0.9, 0.2, 1)',
        'premium-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}