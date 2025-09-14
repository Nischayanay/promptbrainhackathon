import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Waves } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

type Mode = 'ideate' | 'flow'

interface ChatBoxProps {
  input: string
  setInput: (value: string) => void
  activeMode: Mode
  setActiveMode: (mode: Mode) => void
  isEnhancing: boolean
  onEnhance: () => void
}

const modeConfig = {
  ideate: {
    icon: Zap,
    label: 'Ideate',
    description: 'Short, crisp, polished enhancement',
    color: '#6E00FF'
  },
  flow: {
    icon: Waves,
    label: 'Flow', 
    description: 'Structured, step-by-step output',
    color: '#1D4ED8'
  }
}

export function ChatBox({ 
  input, 
  setInput, 
  activeMode, 
  setActiveMode, 
  isEnhancing, 
  onEnhance 
}: ChatBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    autoResize()
  }, [input])

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to enhance
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (input.trim() && !isEnhancing) {
          onEnhance()
        }
      }
      // Cmd/Ctrl + 1 for Ideate mode
      if (e.key === '1' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setActiveMode('ideate')
      }
      // Cmd/Ctrl + 2 for Flow mode
      if (e.key === '2' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setActiveMode('flow')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [input, isEnhancing, onEnhance, setActiveMode])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onEnhance()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1A1A] backdrop-blur-md rounded-3xl border border-[#FFD95A]/10 p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]"
    >
      {/* Mode Tabs */}
      <div className="flex items-center justify-center mb-6">
        <TooltipProvider>
          <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as Mode)}>
            <TabsList className="bg-[#0D0D0D] border border-[#FFD95A]/10 p-1">
              {Object.entries(modeConfig).map(([key, config]) => {
                const Icon = config.icon
                const isActive = activeMode === key
                
                return (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <TabsTrigger 
                        value={key}
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 data-[state=active]:text-white ${
                          isActive
                            ? 'text-white'
                            : 'text-[#A6A6A6] hover:text-white'
                        }`}
                        asChild
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute inset-0 rounded-xl"
                              style={{ 
                                background: `linear-gradient(90deg, ${config.color}, #3B82F6)` 
                              }}
                              initial={false}
                              transition={{ type: "spring", bounce: 0.2, duration: 0.32 }}
                            />
                          )}
                          <Icon className="w-4 h-4 relative z-10" />
                          <span className="relative z-10">{config.label}</span>
                        </motion.div>
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{config.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Cmd+{key === 'ideate' ? '1' : '2'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </TabsList>
          </Tabs>
        </TooltipProvider>
      </div>

      {/* Input Area */}
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              autoResize()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your idea here..."
            className="w-full bg-transparent text-white placeholder-[#A6A6A6] border-2 border-[#FFD95A]/10 rounded-2xl p-4 text-lg resize-none min-h-[120px] focus:border-[#6E00FF]/50 focus:shadow-[0_0_0_1px_rgba(110,0,255,0.28)] transition-all"
            style={{ height: 'auto' }}
          />
        </div>
        
        {/* Enhance Button with Ripple Effect */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onEnhance}
                disabled={!input.trim() || isEnhancing}
                className="bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] text-white px-6 py-4 rounded-2xl font-semibold shadow-[0_20px_40px_-20px_rgba(29,78,216,0.6)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden h-auto"
                asChild
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: '0 20px 40px -20px rgba(29,78,216,0.8)' 
                  }}
                  whileTap={{ 
                    scale: 0.97,
                    // Ripple effect
                    background: [
                      'linear-gradient(90deg, #1D4ED8, #3B82F6)',
                      'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%), linear-gradient(90deg, #1D4ED8, #3B82F6)',
                      'linear-gradient(90deg, #1D4ED8, #3B82F6)'
                    ]
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isEnhancing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </>
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  <span className="relative z-10">
                    {isEnhancing ? 'Enhancing...' : 'Enhance'}
                  </span>
                </motion.button>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enhance your prompt</p>
              <p className="text-xs text-muted-foreground mt-1">Cmd+Enter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}