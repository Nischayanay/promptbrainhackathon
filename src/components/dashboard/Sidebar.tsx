import { motion } from "motion/react";
import { 
  Home, 
  History, 
  Sparkles
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  selectedRole?: string | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateBack?: () => void;
  showBackToProfile?: boolean;
}

export function Sidebar({ currentPage, onPageChange, selectedRole, isCollapsed = false, onToggleCollapse, onNavigateToProfile, onNavigateBack, showBackToProfile }: SidebarProps) {
  const navigationItems = [
    {
      id: 'enhance',
      label: 'Dashboard',
      icon: Home,
      description: 'Main workspace',
      available: true,
      primary: true
    },
    {
      id: 'history',
      label: 'Archive',
      icon: History,
      description: 'Saved prompts',
      available: false
    }
  ];

  return (
    <TooltipProvider>
      <motion.div 
        className={`${isCollapsed ? 'w-16' : 'w-20'} relative`}
        initial={false}
        animate={{ width: isCollapsed ? 64 : 320 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Glass Panel Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-temple-black/80 via-temple-black/60 to-temple-black/80 backdrop-blur-xl border-r border-royal-gold/20" />
        
        {/* Content */}
        <div className="relative z-10 h-screen p-6 flex flex-col">
          {/* Minimal Header */}
          <motion.div 
            className="mb-16"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={onToggleCollapse}
                    className="relative w-10 h-10 rounded-2xl flex items-center justify-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Glass background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-royal-gold/20 to-royal-gold/10 rounded-2xl backdrop-blur-sm" />
                    <div className="absolute inset-0 border border-royal-gold/30 rounded-2xl group-hover:border-royal-gold/50 transition-colors duration-300" />
                    
                    {/* Icon */}
                    <Sparkles className="relative w-5 h-5 text-royal-gold group-hover:text-royal-gold/80 transition-colors duration-300" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-temple-black/90 backdrop-blur-sm border-royal-gold/20 text-marble-white">
                  <p>{isCollapsed ? 'Expand Panel' : 'Collapse Panel'}</p>
                </TooltipContent>
              </Tooltip>
              
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex-1"
                >
                  <h1 
                    className="text-xl font-light text-royal-gold leading-tight"
                    style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
                  >
                    PromptBrain
                  </h1>
                </motion.div>
              )}
            </div>
          </motion.div>



          {/* Sacred Navigation */}
          <nav className="flex-1 space-y-3">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isAvailable = item.available;
              
              const buttonContent = (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    if (isAvailable) {
                      onPageChange(item.id);
                    }
                  }}
                  disabled={!isAvailable}
                  className="relative w-full group"
                  whileHover={isAvailable ? { scale: 1.02 } : {}}
                  whileTap={isAvailable ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  {/* Glass background with active glow */}
                  <div className={`absolute inset-0 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                    isActive && isAvailable
                      ? 'bg-gradient-to-r from-royal-gold/20 to-royal-gold/10 shadow-lg shadow-royal-gold/20'
                      : isAvailable
                        ? 'bg-gradient-to-r from-marble-white/5 to-marble-white/10 group-hover:from-marble-white/10 group-hover:to-marble-white/15'
                        : 'bg-gradient-to-r from-marble-white/5 to-marble-white/5'
                  }`} />
                  
                  {/* Border with active state */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                    isActive && isAvailable
                      ? 'border border-royal-gold/40'
                      : isAvailable
                        ? 'border border-marble-white/10 group-hover:border-marble-white/20'
                        : 'border border-marble-white/5'
                  }`} />
                  
                  {/* Active torch line */}
                  {isActive && isAvailable && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-royal-gold via-royal-gold to-royal-gold/50 rounded-r-full shadow-lg shadow-royal-gold/50"
                      layoutId="activeTorch"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <div className={`relative p-4 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'}`}>
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      (isActive && isAvailable) || item.primary
                        ? 'text-royal-gold drop-shadow-sm' 
                        : isAvailable 
                          ? 'text-marble-white/60 group-hover:text-marble-white/80' 
                          : 'text-marble-white/30'
                    }`} />
                    
                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className={`text-sm font-light transition-all duration-300 ${
                          (isActive && isAvailable) || item.primary
                            ? 'text-royal-gold' 
                            : isAvailable 
                              ? 'text-marble-white/80 group-hover:text-marble-white' 
                              : 'text-marble-white/40'
                        }`}>
                          {item.label}
                        </div>
                        {item.secondary && (
                          <div className="text-xs text-royal-gold/60 mt-0.5">
                            {item.description}
                          </div>
                        )}
                        {!item.primary && !item.secondary && !isActive && (
                          <div className="text-xs text-marble-white/40 mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Available indicator */}
                    {!isCollapsed && !isAvailable && (
                      <div className="w-1.5 h-1.5 bg-marble-white/30 rounded-full" />
                    )}
                  </div>
                </motion.button>
              );
              
              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-temple-black/90 backdrop-blur-sm border-royal-gold/20 text-marble-white">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-marble-white/60">{item.description}</p>
                        {!isAvailable && (
                          <p className="text-xs text-marble-white/40 mt-1">Coming soon</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              }
              
              return buttonContent;
            })}
          </nav>


        </div>
      </motion.div>
    </TooltipProvider>
  );
}