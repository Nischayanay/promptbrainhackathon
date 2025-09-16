import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Waves, 
  Send, 
  Mic, 
  Paperclip, 
  Zap,
  Command
} from 'lucide-react'

type Mode = 'ideate' | 'flow'

interface PromptConsoleProps {
  input: string
  setInput: (value: string) => void
  activeMode: Mode
  onModeChange: (mode: Mode) => void
  isEnhancing: boolean
  onEnhance: () => void
  flowState?: {
    currentStep: number
    answers: string[]
    questions: any[]
    isComplete: boolean
  }
  className?: string
}

const modeConfig = {
  ideate: {
    icon: Sparkles,
    label: 'Ideate',
    description: 'Creative brainstorming and idea enhancement',
    gradient: 'from-purple-500 via-pink-500 to-purple-600',
    placeholder: "Start typing your idea (e.g., 'landing page copy for coffee brand')",
    color: 'text-purple-400'
  },
  flow: {
    icon: Waves,
    label: 'Flow',
    description: 'Structured, multi-step logical workflows',
    gradient: 'from-blue-500 via-cyan-500 to-teal-600',
    placeholder: "Let's build your prompt step by step...",
    color: 'text-cyan-400'
  }
}

export function PromptConsole({
  input,
  setInput,
  activeMode,
  onModeChange,
  isEnhancing,
  onEnhance,
  flowState,
  className = ''
}: PromptConsoleProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const maxChars = 2000

  const currentModeConfig = modeConfig[activeMode]

  // Auto-resize textarea
  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 200 // Max height in pixels
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px'
    }
  }

  useEffect(() => {
    autoResize()
    setCharCount(input.length)
  }, [input])

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if (input.trim() && !isEnhancing) {
        onEnhance()
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxChars) {
      setInput(value)
    }
  }

  const canEnhance = input.trim().length > 0 && !isEnhancing

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.2, 0.9, 0.2, 1],
        delay: 0.2 
      }}
      className={`
        prompt-console w-full max-w-4xl mx-auto
        ${className}
      `}
    >
      {/* Main Console Container */}
      <div className={`
        relative glass-panel rounded-2xl border transition-all duration-300 overflow-hidden
        ${isFocused 
          ? 'border-brand-gold/30 shadow-[0_0_0_1px_rgba(255,211,77,0.2)]' 
          : 'border-glass-border hover:border-glass-border/60'
        }
      `}>
        {/* Mode Selector Header */}
        <div className="flex items-center justify-between p-4 border-b border-glass-border/50">
          <div className="flex items-center space-x-2">
            {Object.entries(modeConfig).map(([key, config]) => {
              const Icon = config.icon
              const isActive = activeMode === key
              
              return (
                <motion.button
                  key={key}
                  onClick={() => onModeChange(key as Mode)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium 
                    transition-all duration-200 premium-focus
                    ${isActive 
                      ? 'text-text-primary bg-glass-border shadow-sm' 
                      : 'text-text-muted hover:text-text-primary hover:bg-glass'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{config.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeModeIndicator"
                      className="w-1.5 h-1.5 rounded-full bg-brand-gold"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
          
          {/* Character Count */}
          <div className={`
            text-xs transition-colors duration-200
            ${charCount > maxChars * 0.9 
              ? 'text-red-400' 
              : charCount > maxChars * 0.7 
                ? 'text-yellow-400' 
                : 'text-text-muted'
            }
          `}>
            {charCount}/{maxChars}
          </div>
        </div>

        {/* Mode Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 border-b border-glass-border/30"
          >
            <div className={`text-sm ${currentModeConfig.color}`}>
              {currentModeConfig.description}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main Input Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={currentModeConfig.placeholder}
            className="
              w-full bg-transparent text-text-primary placeholder-text-muted/60
              px-6 py-6 text-base leading-relaxed resize-none 
              focus:outline-none min-h-[120px] max-h-[200px]
              font-body tracking-normal
            "
            style={{ 
              fontSize: '16px',
              lineHeight: '1.6'
            }}
            aria-label="Prompt input"
          />

          {/* Input Enhancement Overlay */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${currentModeConfig.gradient} 
                  opacity-[0.02] rounded-2xl
                `} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-glass-border/50">
          {/* Left Actions */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                p-2 text-text-muted hover:text-text-primary rounded-lg 
                hover:bg-glass transition-all duration-150 premium-focus
              "
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                p-2 text-text-muted hover:text-text-primary rounded-lg 
                hover:bg-glass transition-all duration-150 premium-focus
              "
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Keyboard Shortcut Hint */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-text-muted">
              <Command className="w-3 h-3" />
              <span>+ Enter to enhance</span>
            </div>

            {/* Enhance Button */}
            <motion.button
              onClick={onEnhance}
              disabled={!canEnhance}
              whileHover={canEnhance ? { scale: 1.02 } : undefined}
              whileTap={canEnhance ? { scale: 0.98 } : undefined}
              className={`
                flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold
                transition-all duration-200 premium-focus min-w-[120px] justify-center
                ${canEnhance
                  ? `bg-gradient-to-r ${currentModeConfig.gradient} text-white shadow-lg hover:shadow-xl` 
                  : 'bg-glass text-text-muted cursor-not-allowed'
                }
              `}
            >
              {isEnhancing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-4 h-4" />
                  </motion.div>
                  <span>Enhancing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enhance</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Focus Ring Effect */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute inset-0 rounded-2xl border border-brand-gold/20 shadow-[0_0_20px_rgba(255,211,77,0.1)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions - Only show when empty and not focused */}
      <AnimatePresence>
        {!input && !isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap gap-3 justify-center"
          >
            {[
              "Write a landing page for a SaaS product",
              "Create a marketing email sequence", 
              "Design a user onboarding flow",
              "Generate social media content",
              "Build a product launch strategy"
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => setInput(suggestion)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="
                  px-4 py-2 text-sm text-text-muted hover:text-text-primary 
                  glass-panel hover:bg-glass-border rounded-xl transition-all duration-200
                  border border-glass-border hover:border-brand-gold/30
                  premium-focus
                "
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}