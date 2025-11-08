import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, RefreshCw } from 'lucide-react'

interface FloatingCreditsOrbProps {
  credits: number
  maxCredits?: number
  onAddCredits?: () => void
  onRefresh?: () => void
  isAnimating?: boolean
  className?: string
}

export function FloatingCreditsOrb({
  credits,
  maxCredits = 20, // Default to 20 credits per day
  onAddCredits,
  onRefresh,
  isAnimating = false,
  className = ''
}: FloatingCreditsOrbProps) {
  const [showPopover, setShowPopover] = useState(false)
  const [isCharging, setIsCharging] = useState(false)

  const creditsPercentage = Math.max(0, Math.min(100, (credits / maxCredits) * 100))

  // Determine color state based on credits percentage
  const getCreditsColor = () => {
    if (creditsPercentage > 60) return '#00D9FF' // Cyan
    if (creditsPercentage > 30) return '#FFD34D' // Gold
    return '#EF4444' // Red for low credits
  }

  const getCreditsGradient = () => {
    if (creditsPercentage > 60) return 'from-[#00D9FF] to-blue-500'
    if (creditsPercentage > 30) return 'from-[#FFD34D] to-yellow-500'
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
    <div className={`fixed top-6 right-6 z-50 ${className}`}>
      {/* Main Orb */}
      <motion.div
        variants={orbVariants}
        animate={isCharging ? 'charging' : 'idle'}
        whileHover="hover"
        onClick={() => setShowPopover(!showPopover)}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        className="
          relative w-14 h-14 rounded-full cursor-pointer
          flex items-center justify-center
          backdrop-blur-md
        "
        style={{
          background: `conic-gradient(${getCreditsColor()} ${creditsPercentage * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
          border: '2px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Inner circle with credit count */}
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
          style={{
            background: 'rgba(10, 10, 10, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <span className="text-white text-sm font-bold">
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
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            style={{ border: '2px solid rgba(10, 10, 10, 0.9)' }}
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
            className="absolute top-full right-0 mt-3 w-72 rounded-xl shadow-2xl overflow-hidden"
            style={{
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* Header */}
            <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCreditsColor() }}
                  />
                  <span className="text-white font-semibold">
                    Credits
                  </span>
                </div>
                <div className="text-white/60 text-sm">
                  {credits} / {maxCredits}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${creditsPercentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${getCreditsGradient()}`}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="p-4">
              {/* Usage tips */}
              <div className="text-xs text-white/60 mb-2">
                💡 Tips
              </div>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Each enhancement costs 1 credit</li>
                <li>• Credits reset daily at midnight</li>
                <li>• You get {maxCredits} credits per day</li>
                <li>• Credits don't stack up</li>
              </ul>
            </div>

            {/* Actions */}
            {onAddCredits && (
              <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddCredits()
                    setShowPopover(false)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FFD34D] to-yellow-500 text-black font-semibold py-2.5 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-600 transition-all duration-200"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade Plan</span>
                </motion.button>

                <div className="text-center mt-2">
                  <span className="text-xs text-white/40">
                    Coming soon
                  </span>
                </div>
              </div>
            )}

            {/* Arrow pointer */}
            <div 
              className="absolute -top-2 right-6 w-4 h-4 transform rotate-45"
              style={{
                background: 'rgba(10, 10, 10, 0.95)',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
