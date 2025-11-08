import { motion } from 'framer-motion'

interface TypingIndicatorProps {
  isVisible: boolean
  text?: string
  className?: string
}

export function TypingIndicator({ 
  isVisible, 
  text = "AI is thinking...", 
  className = "" 
}: TypingIndicatorProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-3 text-white/70 text-sm ${className}`}
    >
      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-[#00D9FF] rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      
      {/* Text with subtle animation */}
      <motion.span
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {text}
      </motion.span>
    </motion.div>
  )
}

// Enhanced typing indicator with personality
export function PersonalityTypingIndicator({ 
  isVisible, 
  stage = 'thinking',
  className = "" 
}: {
  isVisible: boolean
  stage?: 'thinking' | 'analyzing' | 'enhancing' | 'finalizing'
  className?: string
}) {
  const stageConfig = {
    thinking: { text: "🤔 Analyzing your prompt...", color: "#00D9FF" },
    analyzing: { text: "🔍 Understanding context...", color: "#8B5CF6" },
    enhancing: { text: "✨ Crafting enhancement...", color: "#10B981" },
    finalizing: { text: "🎯 Polishing results...", color: "#F59E0B" }
  }

  const config = stageConfig[stage]

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {/* Pulsing brain icon */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className="text-xl"
      >
        🧠
      </motion.div>

      {/* Progress bar */}
      <div className="flex-1 max-w-xs">
        <div className="text-white/80 text-sm mb-1">{config.text}</div>
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: config.color }}
            animate={{ 
              x: ['-100%', '100%'],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}