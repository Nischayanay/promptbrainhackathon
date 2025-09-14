import { motion, AnimatePresence } from 'framer-motion'
import { Home, History, User, Settings, Menu, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: History, label: 'Enhancements', active: false },
  { icon: User, label: 'Profile', active: false },
  { icon: Settings, label: 'Settings', active: false }
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
      className="bg-[#1A1A1A] border-r border-[#FFD95A]/10 flex flex-col h-full"
    >
      {/* Toggle Button */}
      <div className="p-4 border-b border-[#FFD95A]/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-8 h-8 rounded-lg bg-[#FFD95A]/10 hover:bg-[#FFD95A]/20 text-[#FFD95A] transition-colors"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        <TooltipProvider>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center justify-start space-x-3 p-3 rounded-lg transition-colors group relative h-auto ${
                      item.active 
                        ? 'bg-[#1D4ED8] text-white hover:bg-[#1D4ED8]' 
                        : 'text-[#A6A6A6] hover:text-white hover:bg-[#FFD95A]/10'
                    }`}
                    asChild
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="font-medium"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </nav>
    </motion.div>
  )
}