import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarPro } from './dashboard2/SidebarPro'
import { ChatBoxPro } from './dashboard2/ChatBoxPro'
import { OutputBubblePro } from './dashboard2/OutputBubblePro'
import { HeaderPro } from './dashboard2/HeaderPro'
import { Toast } from './dashboard2/Toast'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

type Mode = 'ideate' | 'flow'
type OutputFormat = 'english' | 'json'

interface ChatMessage {
  id: string
  mode: Mode
  timestamp: string
  input: string
  output: string
  title: string
}

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
}

export function Dashboard2Pro() {
  const [activeMode, setActiveMode] = useState<Mode>('ideate')
  const [input, setInput] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  const enhancePrompt = async () => {
    if (!input.trim() || isEnhancing) return

    setIsEnhancing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        mode: activeMode,
        timestamp: new Date().toISOString(),
        input: input.trim(),
        output: generateEnhancedOutput(input, activeMode),
        title: `Enhanced ${activeMode === 'ideate' ? 'Idea' : 'Flow'}`
      }

      setChatHistory(prev => [newMessage, ...prev])
      setInput('')
      
    } catch (error) {
      console.error('Enhancement failed:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const generateEnhancedOutput = (input: string, mode: Mode): string => {
    if (mode === 'ideate') {
      return `Enhanced creative prompt:\n\n"${input}"\n\n✨ Key improvements:\n• Added specific context and constraints\n• Clarified desired output format\n• Enhanced with creative direction\n• Optimized for AI understanding\n\nThis refined prompt will generate more focused and creative results.`
    } else {
      return `Structured workflow for: "${input}"\n\n🌊 Step-by-step process:\n\n1. **Analysis Phase**\n   - Break down core requirements\n   - Identify key stakeholders\n\n2. **Planning Phase**\n   - Define success metrics\n   - Create timeline\n\n3. **Execution Phase**\n   - Implement solution\n   - Monitor progress\n\n4. **Review Phase**\n   - Evaluate results\n   - Iterate improvements`
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Minimal Header */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">P</span>
          </div>
          <span className="text-white text-xl font-semibold tracking-tight">PromptBrain</span>
        </div>
      </div>

      {/* Main Content - Grok Style */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="w-full max-w-3xl mb-8 space-y-6">
            <AnimatePresence>
              {chatHistory.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-white/5 rounded-2xl px-4 py-3 max-w-[80%]">
                      <p className="text-white/90 text-sm">{message.input}</p>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-black font-bold text-xs">P</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                        {message.output}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State Logo */}
        {chatHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white flex items-center justify-center">
              <span className="text-black font-bold text-xl">P</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">PromptBrain</h1>
            <p className="text-white/50 text-lg">What do you want to enhance?</p>
          </motion.div>
        )}

        {/* Input Area - Grok Style */}
        <div className="w-full max-w-2xl">
          <div className="relative bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
            {/* Mode Selector */}
            <div className="flex items-center px-4 py-3 border-b border-white/5">
              <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setActiveMode('ideate')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    activeMode === 'ideate' 
                      ? 'bg-white text-black font-medium' 
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  ⚡ Ideate
                </button>
                <button
                  onClick={() => setActiveMode('flow')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    activeMode === 'flow' 
                      ? 'bg-white text-black font-medium' 
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  🌊 Flow
                </button>
              </div>
            </div>

            {/* Input Field */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    enhancePrompt()
                  }
                }}
                placeholder="What do you want to enhance?"
                className="w-full bg-transparent text-white placeholder-white/40 px-4 py-4 text-base resize-none focus:outline-none min-h-[60px] max-h-[200px]"
                style={{ 
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}
              />

              {/* Send Button */}
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={enhancePrompt}
                  disabled={!input.trim() || isEnhancing}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    input.trim() && !isEnhancing
                      ? 'bg-white text-black hover:bg-white/90' 
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {isEnhancing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Hint */}
          <div className="text-center mt-3">
            <span className="text-white/30 text-sm">Press ⌘ + Enter to enhance</span>
          </div>
        </div>
      </div>
    </div>
  )
}