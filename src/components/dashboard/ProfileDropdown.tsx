import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Settings, LogOut, Crown } from "lucide-react";

interface ProfileDropdownProps {
  onNavigateToProfile: () => void;
  onSignOut?: () => void;
}

export function ProfileDropdown({ onNavigateToProfile, onSignOut }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownItems = [
    {
      id: 'profile',
      label: 'View Profile',
      icon: User,
      action: () => {
        onNavigateToProfile();
        setIsOpen(false);
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: () => {
        // Settings functionality to be implemented
        setIsOpen(false);
      },
      disabled: true
    },
    {
      id: 'signout',
      label: 'Sign Out',
      icon: LogOut,
      action: () => {
        if (onSignOut) {
          onSignOut();
        }
        setIsOpen(false);
      },
      destructive: true
    }
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-marble-white/10 to-marble-white/5 backdrop-blur-xl rounded-full border border-marble-white/20 group-hover:border-royal-gold/30 transition-all duration-300 flex items-center justify-center">
          <User className="w-5 h-5 text-marble-white/60 group-hover:text-royal-gold/80 transition-colors duration-300" />
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="absolute top-12 right-0 z-50 w-56"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gradient-to-b from-temple-black/95 to-temple-dark/95 backdrop-blur-xl rounded-2xl border border-royal-gold/20 shadow-2xl shadow-royal-gold/10 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-royal-gold/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-royal-gold/20 to-royal-gold/10 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-royal-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-marble-white">Temple Access</p>
                      <p className="text-xs text-marble-white/50">Active Session</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {dropdownItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={item.action}
                        disabled={item.disabled}
                        className={`w-full px-4 py-3 flex items-center space-x-3 transition-all duration-200 ${
                          item.disabled 
                            ? 'opacity-50 cursor-not-allowed' 
                            : item.destructive
                              ? 'hover:bg-soft-red/10 text-marble-white/70 hover:text-soft-red'
                              : 'hover:bg-royal-gold/10 text-marble-white/70 hover:text-marble-white'
                        }`}
                        whileHover={!item.disabled ? { x: 4 } : {}}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Icon className={`w-4 h-4 ${
                          item.destructive && !item.disabled ? 'text-soft-red/70' : 'text-current'
                        }`} />
                        <span className="text-sm font-light">{item.label}</span>
                        {item.disabled && (
                          <span className="ml-auto text-xs text-marble-white/30">Soon</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}