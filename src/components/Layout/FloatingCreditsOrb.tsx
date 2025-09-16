import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Plus, TrendingUp, Clock } from 'lucide-react'

interface FloatingCreditsOrbProps {
  credits: number
  maxCredits: number
  usedToday?: number
  resetDate?: Date
  onAddCredits: () => void
  onUseCredit: () => void
  isAnimating?: boolean
  className?: string
}

export function FloatingCreditsOrb({
  credits,
  maxCredits,
  usedToday = 0,
  resetDate = new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  onAddCredits,
  onUseCredit,
  isAnimating = false,
  className = ''
}: FloatingCreditsOrbProps) {
  const [showPopover, setShowPopover] = useState(false)
  const [isCharging, setIsCharging] = useState(false)

  const creditsPercentage = Math.max(0, Math.min(100, (credits / maxCredits) * 100))

  // Determine color state based on credits percentage
  const getCreditsColor = () => {
    if (creditsPercentage > 60) return 'var(--accent-cyan)'
    if (creditsPercentage > 30) return 'var(--brand-gold)'
    return '#EF4444' // Red for low credits
  }

  const getCreditsGradient = () => {
    if (creditsPercentage > 60) return 'from-accent-cyan to-blue-500'
    if (creditsPercentage > 30) return 'from-brand-gold to-yellow-500'
    return 'from-red-500 to-red-600'
  }

  // Handle credit usage animation
  useEffect(() => {
    if (isAnimating) {
      setIsCharging(true)
      const timer = setTimeout(() => setIsCharging(false), 400)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  // Format time until reset
  const getTimeUntilReset = () => {
    try {
      const now = new Date()
      const diff = resetDate.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${minutes}m`
    } catch (error) {
      return '24h'
    }
  }

  const orbVariants = {
    idle: {
      scale: 1,
      boxShadow: `0 0 20px ${getCreditsColor()}40`
    },
    hover: {
      scale: 1.05,
      boxShadow: `0 0 30px ${getCreditsColor()}60`
    },
    charging: {
      scale: [1, 1.1, 1],
      boxShadow: [
        `0 0 20px ${getCreditsColor()}40`,
        `0 0 40px ${getCreditsColor()}80`,
        `0 0 20px ${getCreditsColor()}40`
      ]
    }
  }

  return (
    <div className={`credits-orb ${className}`}>
      {/* Main Orb */}
      <motion.div
        variants={orbVariants}
        animate={isCharging ? 'charging' : 'idle'}
        whileHover="hover"
        onClick={() => setShowPopover(!showPopover)}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        className="
          relative w-12 h-12 rounded-full cursor-pointer
          glass-panel border-2 border-glass-border
          flex items-center justify-center
          breathing-glow
        "
        style={{
          background: `conic-gradient(${getCreditsColor()} ${creditsPercentage * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
        }}
      >
        {/* Inner circle with credit count */}
        <div className="
          w-8 h-8 rounded-full bg-premium-bg border border-glass-border
          flex items-center justify-center relative z-10
        ">
          <span className="text-text-primary text-xs font-bold">
            {credits}
          </span>
        </div>

        {/* Pulse effect when charging */}
        <AnimatePresence>
          {isCharging && (
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: getCreditsColor() }}
            />
          )}
        </AnimatePresence>

        {/* Low credits warning indicator */}
        {creditsPercentage <= 20 && (
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-premium-bg"
          />
        )}
      </motion.div>

      {/* Popover */}
      <AnimatePresence>
        {showPopover && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
            className="
              absolute top-full right-0 mt-3 w-72
              glass-panel-strong rounded-xl shadow-2xl
              border border-glass-border overflow-hidden z-50
            "
          >
            {/* Header */}
            <div className="p-4 border-b border-glass-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCreditsColor() }}
                  />
                  <span className="text-text-primary font-semibold">
                    Credits
                  </span>
                </div>
                <div className="text-text-muted text-sm">
                  {credits} / {maxCredits}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full h-2 bg-glass rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${creditsPercentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${getCreditsGradient()}`}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-text-muted">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Used today</span>
                </div>
                <span className="text-text-primary font-medium">
                  {usedToday}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-text-muted">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Resets in</span>
                </div>
                <span className="text-text-primary font-medium">
                  {getTimeUntilReset()}
                </span>
              </div>

              {/* Usage tips */}
              <div className="pt-2 border-t border-glass-border">
                <div className="text-xs text-text-muted mb-2">
                  💡 Tips
                </div>
                <ul className="text-xs text-text-muted space-y-1">
                  <li>• Each enhancement costs 1 credit</li>
                  <li>• Credits reset daily at midnight</li>
                  <li>• Flow mode uses the same cost as Ideate</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-glass-border">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddCredits()
                  setShowPopover(false)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  w-full flex items-center justify-center space-x-2
                  bg-gradient-to-r from-brand-gold to-yellow-500
                  text-black font-semibold py-2.5 px-4 rounded-lg
                  hover:from-yellow-400 hover:to-yellow-600
                  transition-all duration-200
                  premium-focus
                "
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade Plan</span>
              </motion.button>

              <div className="text-center mt-2">
                <span className="text-xs text-text-muted">
                  Coming soon
                </span>
              </div>
            </div>

            {/* Arrow pointer */}
            <div className="
              absolute -top-2 right-6 w-4 h-4 
              bg-premium-panel border-l border-t border-glass-border
              transform rotate-45
            " />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing credits state
export function useCredits(initialCredits = 42, maxCredits = 100) {
  const [credits, setCredits] = useState(initialCredits)
  const [usedToday, setUsedToday] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const useCredit = () => {
    if (credits > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCredits(prev => prev - 1)
        setUsedToday(prev => prev + 1)
        setIsAnimating(false)
      }, 200) // Delay to show charging animation first
    }
  }

  const addCredits = (amount: number) => {
    setCredits(prev => Math.min(maxCredits, prev + amount))
  }

  const resetDailyCredits = () => {
    setCredits(maxCredits)
    setUsedToday(0)
  }

  return {
    credits,
    maxCredits,
    usedToday,
    isAnimating,
    useCredit,
    addCredits,
    resetDailyCredits,
    canUseCredit: credits > 0
  }
}