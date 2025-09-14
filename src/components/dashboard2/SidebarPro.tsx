import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  History, 
  Bookmark, 
  Settings,
  ChevronLeft,
  Plus
} from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface SidebarProProps {
  collapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  { 
    icon: MessageSquare, 
    label: 'Chat', 
    active: true,
    description: 'New conversation'
  },
  { 
    icon: History, 
    label: 'History', 
    active: false,
    description: 'Previous enhancements'
  },
  { 
    icon: Bookmark, 
    label: 'Saved', 
    active: false,
    description: 'Bookmarked prompts'
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    active: false,
    description: 'Preferences'
  }
]

export function SidebarPro({ collapsed, onToggle }: SidebarProProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full bg-black border-r border-white/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/5">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-white/60 hover:text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Chat
            </Button>
          </motion.div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <TooltipProvider>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`
                      w-full justify-start h-10 px-3 transition-all
                      ${item.active 
                        ? 'bg-white/10 text-white hover:bg-white/15' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                      }
                      ${collapsed ? 'px-0 justify-center' : ''}
                    `}
                  >
                    <Icon className={`w-4 h-4 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="bg-[#1a1a1a] border-white/10">
                    <p className="text-sm">{item.label}</p>
                    <p className="text-xs text-white/60">{item.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </nav>

      {/* Recent Chats - Only show when expanded */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-3 border-t border-white/5"
        >
          <div className="text-xs font-medium text-white/40 mb-2 px-3">Recent</div>
          <div className="space-y-1">
            {[
              "Landing page copy for...",
              "Email sequence for...",
              "Social media content..."
            ].map((title, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all truncate"
              >
                {title}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}