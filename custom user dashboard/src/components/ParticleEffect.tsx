import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  life: number;
}

interface ParticleEffectProps {
  x: number;
  y: number;
  color?: string;
  count?: number;
  onComplete?: () => void;
}

export function ParticleEffect({ x, y, color = '#00D9FF', count = 15, onComplete }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 2 + Math.random() * 3;
      
      newParticles.push({
        id: i,
        x,
        y,
        color: i % 2 === 0 ? color : '#8B5CF6',
        size: 4 + Math.random() * 6,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity,
        life: 1
      });
    }
    setParticles(newParticles);

    // Cleanup after animation
    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [x, y, color, count, onComplete]);

  return (
    <div className="particle-container">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
            initial={{ 
              opacity: 1, 
              scale: 1,
              x: 0,
              y: 0
            }}
            animate={{ 
              opacity: 0, 
              scale: 0,
              x: particle.velocityX * 100,
              y: particle.velocityY * 100
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1, 
              ease: 'easeOut'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
