import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onTransitionComplete: () => void;
  shouldStartTransition: boolean;
}

export function HeroSection({ onTransitionComplete, shouldStartTransition }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (shouldStartTransition) {
      // Start transition after 2 seconds of hero display
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Wait for fade out animation to complete
        setTimeout(onTransitionComplete, 800);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [shouldStartTransition, onTransitionComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={shouldStartTransition ? { 
        opacity: 0, 
        scale: 1.1,
        filter: 'blur(4px)'
      } : { opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-cinematic-dark overflow-hidden"
    >
      {/* Animated Mesh Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 231, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 231, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gradient-shift 8s ease infinite'
        }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Main Hero Content */}
      <motion.div 
        className="relative z-10 text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {/* Logo/Brand */}
        <motion.div
          animate={{
            textShadow: [
              '0 0 20px rgba(0, 255, 231, 0.3)',
              '0 0 40px rgba(0, 255, 231, 0.6)',
              '0 0 20px rgba(0, 255, 231, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-glass-white mb-4">
            PromptBrain
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p 
          className="text-xl md:text-2xl text-neon-cyan font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Cinematic AI Experience
        </motion.p>

        {/* Loading Animation */}
        <motion.div 
          className="flex justify-center items-center space-x-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-accent-gold rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-deep-emerald opacity-10 rounded-full blur-3xl" />
    </motion.div>
  );
}