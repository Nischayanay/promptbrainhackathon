import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface CinematicBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function CinematicBackground({ children, className = '' }: CinematicBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div className={`relative min-h-screen bg-cinematic-base overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cinematic-base via-cinematic-dark to-cinematic-base" />

      {/* Animated mesh grid */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 231, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 231, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
        animate={{
          backgroundPosition: [`0px 0px`, `80px 80px`],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Parallax orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-neon-cyan opacity-5 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * 0.1,
          y: mousePosition.y * 0.1,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-deep-emerald opacity-5 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * -0.05,
          y: mousePosition.y * -0.05,
        }}
        transition={{ type: 'spring', stiffness: 30, damping: 15 }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-gold opacity-3 rounded-full blur-3xl"
        style={{ transform: 'translate(-50%, -50%)' }}
        animate={{
          x: mousePosition.x * 0.03,
          y: mousePosition.y * 0.03,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          x: { type: 'spring', stiffness: 20, damping: 10 },
          y: { type: 'spring', stiffness: 20, damping: 10 },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-glass-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-10 scanline-sweep" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}