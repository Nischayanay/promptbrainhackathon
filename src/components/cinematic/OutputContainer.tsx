import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface OutputContainerProps {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
}

export function OutputContainer({ children, isVisible, className = '' }: OutputContainerProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className={`
        w-full max-w-4xl mx-auto mt-8
        glass-card-strong rounded-2xl
        p-8 relative overflow-hidden
        ${className}
      `}
    >
      {/* Ambient Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-deep-emerald/5 rounded-2xl" />
      
      {/* Subtle Border Animation */}
      <div className="absolute inset-0 rounded-2xl border border-glass-border opacity-60" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Corner Accents */}
      <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-neon-cyan/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-deep-emerald/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-deep-emerald/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-neon-cyan/30 rounded-br-lg" />
    </motion.div>
  );
}