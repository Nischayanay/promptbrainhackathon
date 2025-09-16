import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  History, 
  Archive, 
  Settings,
  User,
  LogOut,
  ChevronLeft,
  Home,
  Zap
} from 'lucide-react'

interface SidebarItem {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  description?: string
  onClick?: () => void
}

interface CollapsibleSidebarProps {
  collapsed: boolean
  onToggle: () => void
  activeItem: string
  onItemSelect: (item: string) => void
  recentHistory?: any[]
  className?: string
}

const navigationItems: SidebarItem[] = [
  { 
    id: 'home', 
    icon: Home, 
    label: 'Home', 
    description: 'Dashboard home'
  },
  { 
    id: 'enhance', 
    icon: Zap, 
    label: 'Enhance', 
    description: 'Prompt enhancement',
    active: true
  },
  { 
    id: 'history', 
    icon: History, 
    label: 'History', 
    description: 'Recent enhancements'
  },
  { 
    id: 'archive', 
    icon: Archive, 
    label: 'Archive', 
    description: 'Saved prompts'
  },
  { 
    id: 'profile', 
    icon: User, 
    label: 'Profile', 
    description: 'User settings'
  },
  { 
    id: 'settings', 
    icon: Settings, 
    label: 'Settings', 
    description: 'App preferences'
  }
]

const secondaryItems: SidebarItem[] = [
  { 
    id: 'logout', 
    icon: LogOut, 
    label: 'Logout', 
    description: 'Sign out'
  }
]

export function CollapsibleSidebar({
  collapsed,
  onToggle,
  activeItem,
  onItemSelect,
  recentHistory = [],
  className = ''
}: CollapsibleSidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Keyboard shortcut for toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        onToggle()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onToggle])

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed) {
        onToggle()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [collapsed, onToggle])

  const sidebarVariants = {
    collapsed: { 
      width: 'var(--sidebar-width-collapsed)',
      transition: { 
        duration: 0.22, 
        ease: [0.2, 0.9, 0.2, 1] 
      }
    },
    expanded: { 
      width: 'var(--sidebar-width-expanded)',
      transition: { 
        duration: 0.32, 
        ease: [0.2, 0.9, 0.2, 1] 
      }
    }
  }

  const contentVariants = {
    collapsed: { 
      opacity: 0,
      x: -10,
      transition: { duration: 0.15 }
    },
    expanded: { 
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, delay: 0.1 }
    }
  }

  return (
    <motion.div
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      className={`
        relative h-screen glass-panel-strong
        border-r border-glass-border
        ${className}
      `}
      style={{ minWidth: collapsed ? '72px' : '260px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-glass-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gold to-yellow-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="text-text-primary font-semibold text-sm">
                PromptBrain
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={onToggle}
          className="
            p-2 rounded-lg text-text-muted hover:text-text-primary 
            hover:bg-glass transition-all duration-150
            premium-focus
          "
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={`${collapsed ? 'Expand' : 'Collapse'} sidebar (⌘B)`}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          const isHovered = hoveredItem === item.id

          return (
            <motion.button
              key={item.id}
              onClick={() => onItemSelect(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative w-full flex items-center rounded-lg p-3 text-sm font-medium
                transition-all duration-150 premium-focus
                ${collapsed ? 'justify-center' : 'justify-start space-x-3'}
                ${isActive 
                  ? 'text-text-primary bg-glass-border' 
                  : 'text-text-muted hover:text-text-primary hover:bg-glass'
                }
              `}
              style={{ 
                '--stagger-index': index 
              } as React.CSSProperties}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-gold rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon with glow effect */}
              <div className="relative">
                <Icon className="w-4 h-4 relative z-10" />
                {(isActive || isHovered) && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 bg-brand-gold rounded-full blur-sm"
                  />
                )}
              </div>

              {/* Label */}
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="relative z-10"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.9 }}
                      className="
                        absolute left-full ml-3 top-1/2 -translate-y-1/2
                        glass-panel px-3 py-2 rounded-lg shadow-lg z-50
                        whitespace-nowrap
                      "
                    >
                      <div className="text-text-primary text-sm font-medium">
                        {item.label}
                      </div>
                      <div className="text-text-muted text-xs">
                        {item.description}
                      </div>
                      {/* Arrow */}
                      <div className="
                        absolute right-full top-1/2 -translate-y-1/2
                        border-4 border-transparent border-r-[var(--panel)]
                      " />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Recent History - Only show when expanded */}
      <AnimatePresence>
        {!collapsed && recentHistory.length > 0 && (
          <motion.div
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="p-3 border-t border-glass-border"
          >
            <div className="text-xs font-medium text-text-muted mb-2 px-3">
              Recent
            </div>
            <div className="space-y-1">
              {recentHistory.slice(0, 3).map((item, index) => (
                <button
                  key={index}
                  className="
                    w-full text-left px-3 py-2 text-sm text-text-muted 
                    hover:text-text-primary hover:bg-glass rounded-lg 
                    transition-all truncate
                  "
                >
                  {item.title || 'Untitled enhancement'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Actions */}
      <div className="p-3 border-t border-glass-border">
        {secondaryItems.map((item) => {
          const Icon = item.icon
          const isHovered = hoveredItem === item.id

          return (
            <motion.button
              key={item.id}
              onClick={() => onItemSelect(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative w-full flex items-center rounded-lg p-3 text-sm font-medium
                transition-all duration-150 premium-focus
                text-text-muted hover:text-red-400 hover:bg-red-500/10
                ${collapsed ? 'justify-center' : 'justify-start space-x-3'}
              `}
            >
              <Icon className="w-4 h-4" />
              
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.9 }}
                      className="
                        absolute left-full ml-3 top-1/2 -translate-y-1/2
                        glass-panel px-3 py-2 rounded-lg shadow-lg z-50
                        whitespace-nowrap
                      "
                    >
                      <div className="text-text-primary text-sm font-medium">
                        {item.label}
                      </div>
                      <div className="text-text-muted text-xs">
                        {item.description}
                      </div>
                      {/* Arrow */}
                      <div className="
                        absolute right-full top-1/2 -translate-y-1/2
                        border-4 border-transparent border-r-[var(--panel)]
                      " />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}