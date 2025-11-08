import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
}

interface SuccessCelebrationProps {
  trigger: boolean
  onComplete?: () => void
  type?: 'confetti' | 'sparkles' | 'fireworks'
  intensity?: 'low' | 'medium' | 'high'
}

const colors = ['#00D9FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']

export function SuccessCelebration({ 
  trigger, 
  onComplete, 
  type = 'confetti',
  intensity = 'medium' 
}: SuccessCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  const particleCount = {
    low: 20,
    medium: 40,
    high: 80
  }[intensity]

  useEffect(() => {
    if (!trigger) return

    setIsActive(true)
    
    // Create particles
    const newParticles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        life: 1
      })
    }
    
    setParticles(newParticles)

    // Animate particles
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.5, // gravity
          life: particle.life - 0.02
        })).filter(particle => particle.life > 0)
      )
    }

    const interval = setInterval(animateParticles, 16) // 60fps

    // Clean up after animation
    const timeout = setTimeout(() => {
      setIsActive(false)
      setParticles([])
      onComplete?.()
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [trigger, particleCount, onComplete])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </AnimatePresence>

      {/* Success message overlay */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'backOut' }}
      >
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="text-2xl"
            >
              🎉
            </motion.div>
            <div>
              <div className="font-bold text-lg">Success!</div>
              <div className="text-sm opacity-90">Prompt enhanced perfectly</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}