import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import ElectricBorder from '../ui/ElectricBorder'

interface AppShellProps {
  children: ReactNode
  sidebar?: ReactNode
  creditsOrb?: ReactNode
  className?: string
}

export function AppShell({ 
  children, 
  sidebar, 
  creditsOrb, 
  className = '' 
}: AppShellProps) {
  return (
    <div className={`app-shell ${className}`}>
      {/* Left Column - Sidebar */}
      {sidebar && (
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }}
          className="relative z-10"
        >
          {sidebar}
        </motion.aside>
      )}

      {/* Center Column - Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.2, 0.9, 0.2, 1],
          delay: 0.1 
        }}
        className="main-content"
        role="main"
        id="main-content"
      >
        {children}
      </motion.main>

      {/* Right Column - Reserved for future features */}
      <div className="relative">
        {/* Credits Orb floats here */}
        {creditsOrb}
      </div>
    </div>
  )
}

// Layout wrapper for consistent spacing and responsive behavior
export function AppShellContent({ 
  children, 
  className = '' 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={`
      w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8
      ${className}
    `}>
      {children}
    </div>
  )
}

// Hero section for main dashboard content
export function AppShellHero({ 
  title, 
  subtitle, 
  children,
  className = '' 
}: {
  title?: string
  subtitle?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.2, 0.9, 0.2, 1],
        delay: 0.2 
      }}
      className={`text-center mb-8 lg:mb-12 ${className}`}
    >
      {title && (
        <div className="mb-6 flex justify-center">
          <ElectricBorder 
            color="#00d4ff" 
            intensity={1.5} 
            speed={1.5}
            className="inline-block"
          >
            <h1 className="
              font-display text-4xl sm:text-5xl lg:text-6xl font-bold 
              tracking-tight
              bg-gradient-to-r from-cyan-300 via-cyan-200 to-cyan-400
              bg-clip-text text-transparent
              px-6 py-3
              drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]
            "
            style={{
              textShadow: '0 0 40px rgba(0, 212, 255, 0.8), 0 0 80px rgba(0, 212, 255, 0.4)',
              WebkitTextStroke: '1px rgba(0, 212, 255, 0.3)'
            }}
            >
              {title}
            </h1>
          </ElectricBorder>
        </div>
      )}
      
      {subtitle && (
        <p className="
          font-body text-lg sm:text-xl
          max-w-2xl mx-auto leading-relaxed
          text-gray-300
        "
        style={{
          color: 'rgba(209, 213, 219, 0.9)'
        }}
        >
          {subtitle}
        </p>
      )}
      
      {children}
    </motion.div>
  )
}

// Responsive grid for dashboard sections
export function AppShellGrid({ 
  children, 
  columns = 1,
  gap = 'md',
  className = '' 
}: {
  children: ReactNode
  columns?: 1 | 2 | 3
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  const gridGap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  return (
    <div className={`
      grid ${gridCols[columns]} ${gridGap[gap]}
      ${className}
    `}>
      {children}
    </div>
  )
}

// Card component for dashboard sections
export function AppShellCard({ 
  children, 
  className = '',
  hover = true 
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.15, ease: [0.2, 0.9, 0.2, 1] }}
      className={`
        glass-panel rounded-lg p-6
        ${hover ? 'hover-lift' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}