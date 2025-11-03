import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FloatingCTAProps {
  onAction: () => void;
  label?: string;
}

export function FloatingCTA({ onAction, label = "Enhance Now" }: FloatingCTAProps) {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  // Show after scrolling past 50% of viewport
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.5;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating animation
  const y = useTransform(scrollY, [0, 300], [0, -10]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      style={{ y }}
      className="fixed bottom-8 right-8 z-40"
      role="complementary"
      aria-label="Quick access enhance button"
    >
      <motion.button
        onClick={onAction}
        className="relative overflow-hidden bg-gradient-to-r from-[#00D9FF] to-[#0099FF] text-white rounded-full shadow-2xl
                   flex items-center border-2 border-white/20"
        style={{
          padding: 'var(--spacing-2) var(--spacing-4)',
          gap: 'var(--spacing-2)',
          fontSize: 'var(--text-base)',
          minHeight: 'var(--min-touch-target)'
        }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 40px rgba(0,217,255,0.6)'
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 8px 32px rgba(0,217,255,0.4)',
            '0 8px 48px rgba(0,217,255,0.6)',
            '0 8px 32px rgba(0,217,255,0.4)'
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
        aria-label={label}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Zap className="w-5 h-5" aria-hidden="true" />
        </motion.div>

        {/* Label */}
        <span className="relative z-10 font-medium">{label}</span>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white"
          animate={{
            scale: [1, 1.3],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      </motion.button>

      {/* Tooltip on hover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black border border-white/20 rounded-lg whitespace-nowrap pointer-events-none"
        style={{ fontSize: 'var(--text-xs)' }}
      >
        <div className="text-white/90">Scroll to top & enhance ⚡</div>
        <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-black border-r border-b border-white/20 rotate-45" />
      </motion.div>
    </motion.div>
  );
}
