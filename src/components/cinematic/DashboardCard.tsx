import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface DashboardCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  isFloating?: boolean;
  glowColor?: 'cyan' | 'emerald' | 'gold';
  onClick?: () => void;
  delay?: number;
}

export function DashboardCard({ 
  children, 
  title, 
  className = '', 
  isFloating = true,
  glowColor = 'cyan',
  onClick,
  delay = 0
}: DashboardCardProps) {
  const glowColors = {
    cyan: 'rgba(0, 255, 231, 0.2)',
    emerald: 'rgba(10, 255, 144, 0.2)',
    gold: 'rgba(255, 214, 0, 0.2)'
  };

  const borderColors = {
    cyan: 'rgba(0, 255, 231, 0.3)',
    emerald: 'rgba(10, 255, 144, 0.3)',
    gold: 'rgba(255, 214, 0, 0.3)'
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 40,
        scale: 0.95 
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: 1 
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={`
        relative group cursor-pointer
        ${isFloating ? 'card-float' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        transform: 'translateZ(0)', // GPU acceleration
      }}
    >
      {/* Main Card */}
      <div className="glass-card rounded-2xl p-6 h-full relative overflow-hidden cinematic-hover gpu-accelerated">
        {/* Glow Effect on Hover */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: `0 0 40px ${glowColors[glowColor]}, inset 0 0 20px ${glowColors[glowColor]}`
          }}
        />

        {/* Border Glow */}
        <div 
          className="absolute inset-0 rounded-2xl border transition-all duration-300"
          style={{
            borderColor: borderColors[glowColor]
          }}
        />

        {/* Scanline Effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div 
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-300"
            style={{
              top: '50%',
              animation: 'scanline-sweep 3s linear infinite'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {title && (
            <motion.h3 
              className="text-lg font-semibold text-glass-white mb-4 group-hover:text-neon-cyan transition-colors duration-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
            >
              {title}
            </motion.h3>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {children}
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-neon-cyan opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-neon-cyan opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}