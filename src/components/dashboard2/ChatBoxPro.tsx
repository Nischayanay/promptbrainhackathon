import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Waves, Sparkles, Send, Mic, Paperclip } from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

type Mode = 'ideate' | 'flow'

interface ChatBoxProProps {
  input: string
  setInput: (value: string) => void
  activeMode: Mode
  setActiveMode: (mode: Mode) => void
  isEnhancing: boolean
  onEnhance: () => void
}

const modeConfig = {
  ideate: {
    icon: Sparkles,
    label: 'Ideate',
    description: 'Creative enhancement',
    gradient: 'from-purple-500 to-pink-500'
  },
  flow: {
    icon: Waves,
    label: 'Flow', 
    description: 'Structured workflow',
    gradient: 'from-blue-500 to-cyan-500'
  }
}

export function ChatBoxPro({ 
  input, 
  setInput, 
  activeMode, 
  setActiveMode, 
  isEnhancing, 
  onEnhance 
}: ChatBoxProProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  useEffect(() => {
    autoResize()
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onEnhance()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Input Container - Grok Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Input Field */}
        <div className={`
          relative bg-[#1a1a1a] rounded-2xl border transition-all duration-300 overflow-hidden
          ${isFocused 
            ? 'border-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]' 
            : 'border-white/10 hover:border-white/15'
          }
        `}>
          {/* Mode Selector - Subtle Pills */}
          <div className="flex items-center justify-between p-3 border-b border-white/5">
            <div className="flex items-center space-x-2">
              {Object.entries(modeConfig).map(([key, config]) => {
                const Icon = config.icon
                const isActive = activeMode === key
                
                return (
                  <TooltipProvider key={key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setActiveMode(key as Mode)}
                          className={`
                            flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${isActive 
                              ? 'bg-white/10 text-white' 
                              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{config.label}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{config.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
            
            {/* Character Count */}
            <div className="text-xs text-white/40">
              {input.length}/2000
            </div>
          </div>

          {/* Main Input Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= 2000) {
                  setInput(e.target.value)
                  autoResize()
                }
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What do you want to enhance?"
              className="
                w-full bg-transparent text-white placeholder-white/40 
                px-4 py-4 text-base leading-relaxed resize-none 
                focus:outline-none min-h-[60px] max-h-[200px]
                font-normal tracking-normal
              "
              style={{ 
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '16px',
                lineHeight: '1.5'
              }}
            />

            {/* Bottom Bar */}
            <div className="flex items-center justify-between px-4 pb-3">
              {/* Left Actions */}
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/40 hover:text-white/60 hover:bg-white/5"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/40 hover:text-white/60 hover:bg-white/5"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voice input</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-3">
                {/* Keyboard Shortcut Hint */}
                <div className="text-xs text-white/30 hidden sm:block">
                  ⌘ + Enter to enhance
                </div>

                {/* Send Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={onEnhance}
                        disabled={!input.trim() || isEnhancing}
                        size="sm"
                        className={`
                          h-8 w-8 p-0 rounded-lg transition-all duration-200
                          ${input.trim() && !isEnhancing
                            ? 'bg-white text-black hover:bg-white/90 shadow-sm' 
                            : 'bg-white/10 text-white/40 cursor-not-allowed'
                          }
                        `}
                      >
                        {isEnhancing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Zap className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isEnhancing ? 'Enhancing...' : 'Enhance prompt'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions - Only show when empty */}
        <AnimatePresence>
          {!input && !isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 flex flex-wrap gap-2 justify-center"
            >
              {[
                "Write a landing page for a SaaS product",
                "Create a marketing email sequence", 
                "Design a user onboarding flow",
                "Generate social media content"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion)}
                  className="
                    px-3 py-1.5 text-sm text-white/60 hover:text-white/80 
                    bg-white/5 hover:bg-white/10 rounded-lg transition-all
                    border border-white/10 hover:border-white/20
                  "
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}