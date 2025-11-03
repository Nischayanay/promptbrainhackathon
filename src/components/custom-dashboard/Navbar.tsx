import { User, Coins, Menu, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { Logo } from './Logo';

// Spring animation config
const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30
};

export function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [credits, setCredits] = useState(1250);
  const [isVisible, setIsVisible] = useState(false);
  const creditControls = useAnimationControls();
  const [magneticPosition, setMagneticPosition] = useState({ x: 0, y: 0 });
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  // Slide-down animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animate credits count-up
  const animateCreditChange = (newValue: number) => {
    creditControls.start({
      scale: [1, 1.2, 1],
      color: ['#FFFFFF', '#00D9FF', '#FFFFFF'],
      transition: { duration: 0.5 }
    });
    setCredits(newValue);
  };

  // Magnetic button effect
  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 8;
    const y = (e.clientY - rect.top - rect.height / 2) / 8;
    setMagneticPosition({ x, y });
  };

  const handleMagneticLeave = () => {
    setMagneticPosition({ x: 0, y: 0 });
  };

  return (
    <motion.nav 
      initial={{ y: -80, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -80,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ 
        height: 'var(--spacing-7)',
        background: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(var(--glass-blur)) saturate(180%)',
        borderColor: 'var(--glass-border)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset, var(--shadow-sm)'
      }}
    >
      <div className="h-full flex items-center justify-between" style={{ padding: '0 var(--spacing-3)' }}>
        {/* Left - Logo */}
        <motion.div 
          className="flex items-center premium-hover"
          style={{ gap: 'var(--spacing-2)' }}
          whileHover={{ scale: 1.02 }}
          transition={spring}
        >
          <motion.div 
            className="relative"
            style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }}
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div 
              className="rounded-full border-2 border-white relative"
              style={{ 
                width: 'var(--spacing-4)', 
                height: 'var(--spacing-4)',
                boxShadow: '0 0 0 rgba(255,255,255,0)',
                transition: 'box-shadow var(--transition-base) var(--ease-out)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-cyan-sm)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 rgba(255,255,255,0)'}
            >
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white -rotate-45 origin-center" />
            </div>
          </motion.div>
          <span 
            className="text-white"
            style={{ 
              fontSize: 'var(--text-xl)',
              letterSpacing: 'var(--tracking-tight)',
              fontWeight: 600
            }}
          >
            PromptBrain
          </span>
        </motion.div>

        {/* Right - Icons */}
        <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
          {/* Credits with tooltip */}
          <div className="relative group">
            <motion.button 
              className="flex items-center rounded-full premium-hover glass-card"
              style={{
                gap: 'var(--spacing-1)',
                padding: 'var(--spacing-1) var(--spacing-2-5)',
                minWidth: 'var(--min-touch-target)',
                minHeight: 'var(--min-touch-target)',
                borderRadius: 'var(--radius-full)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              aria-label={`${credits} credits available`}
            >
              <Coins className="w-4 h-4 text-[#00D9FF]" aria-hidden="true" />
              <motion.span 
                className="text-white"
                style={{ 
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-tight)'
                }}
                animate={creditControls}
              >
                {credits.toLocaleString()}
              </motion.span>
            </motion.button>
            
            {/* Tooltip */}
            <div 
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 glass-card whitespace-nowrap
                       opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{
                fontSize: 'var(--text-xs)',
                transition: 'opacity var(--transition-base) var(--ease-out)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div className="text-white/90">Resets daily at midnight 🕛</div>
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderTop: 'none',
                  borderLeft: 'none'
                }}
              />
            </div>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              ref={profileButtonRef}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="bg-gradient-to-br from-[#00D9FF] to-[#8B5CF6] rounded-full 
                       flex items-center justify-center magnetic-button relative overflow-hidden"
              style={{
                width: 'var(--spacing-5)',
                height: 'var(--spacing-5)',
                minWidth: 'var(--min-touch-target)',
                minHeight: 'var(--min-touch-target)',
                boxShadow: 'var(--shadow-md)'
              }}
              animate={{ 
                x: magneticPosition.x, 
                y: magneticPosition.y 
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: 'var(--shadow-cyan-md)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              aria-label="Profile menu"
              aria-expanded={showProfileMenu}
            >
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
              <User className="w-5 h-5 text-white relative z-10" aria-hidden="true" />
            </motion.button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={spring}
                className="absolute top-full right-0 w-56 glass-card overflow-hidden"
                style={{ 
                  marginTop: 'var(--spacing-2)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-2xl)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                }}
              >
                <div 
                  className="border-b"
                  style={{ 
                    padding: 'var(--spacing-2-5) var(--spacing-3)',
                    borderColor: 'var(--glass-border)'
                  }}
                >
                  <p className="text-white" style={{ 
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    letterSpacing: 'var(--tracking-tight)'
                  }}>Solo Founder</p>
                  <p className="text-white/60" style={{ 
                    fontSize: 'var(--text-xs)',
                    marginTop: '2px'
                  }}>founder@promptbrain.ai</p>
                </div>
                
                <motion.button 
                  className="w-full text-left text-white hover:bg-white/5 flex items-center premium-hover"
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    gap: 'var(--spacing-2)',
                    fontSize: 'var(--text-sm)',
                    minHeight: 'var(--min-touch-target)',
                    transition: 'background var(--transition-fast) var(--ease-out)'
                  }}
                  whileHover={{ x: 4 }}
                  transition={spring}
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  My Profile
                </motion.button>
                
                <motion.button 
                  className="w-full text-left text-white hover:bg-white/5 flex items-center premium-hover"
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    gap: 'var(--spacing-2)',
                    fontSize: 'var(--text-sm)',
                    minHeight: 'var(--min-touch-target)',
                    transition: 'background var(--transition-fast) var(--ease-out)'
                  }}
                  whileHover={{ x: 4 }}
                  transition={spring}
                >
                  <Coins className="w-4 h-4" aria-hidden="true" />
                  Purchase Credits
                </motion.button>
                
                <div className="border-t" style={{ borderColor: 'var(--glass-border)' }}>
                  <motion.button 
                    className="w-full text-left text-red-400 hover:bg-red-500/10 flex items-center premium-hover"
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-3)',
                      gap: 'var(--spacing-2)',
                      fontSize: 'var(--text-sm)',
                      minHeight: 'var(--min-touch-target)',
                      transition: 'background var(--transition-fast) var(--ease-out)'
                    }}
                    whileHover={{ 
                      x: 4,
                      rotate: -3
                    }}
                    transition={spring}
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Logout
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
