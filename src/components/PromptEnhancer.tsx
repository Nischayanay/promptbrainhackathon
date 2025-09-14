import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Copy, 
  Save, 
  RotateCcw, 
  Share2, 
  Sparkles,
  Brain,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { supabase } from '../lib/supabase'

type Mode = 'ideate' | 'instant-fit' | 'blueprint'

interface EnhancedPrompt {
  id: string
  title: string
  body: string
  mode: Mode
  timestamp: string
  original: string
}

const modeConfig = {
  ideate: {
    icon: Sparkles,
    label: 'Ideate',
    description: 'Quick enhancement for raw prompts/ideas',
    gradient: 'from-purple-500 to-pink-500'
  },
  'instant-fit': {
    icon: Zap,
    label: 'Instant-Fit',
    description: 'Optimized prompts for immediate use',
    gradient: 'from-blue-500 to-cyan-500'
  },
  blueprint: {
    icon: FileText,
    label: 'Blueprint',
    description: 'Structured breakdowns and workflows',
    gradient: 'from-indigo-500 to-purple-500'
  }
}

const brandMessages = [
  "Your idea just got sharper 🔥",
  "Blueprint clarity unlocked 🏗",
  "Instant magic applied ✨",
  "Prompt perfection achieved 🎯",
  "Creative boost activated 🚀"
]

export function PromptEnhancer() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('ideate')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [currentOutput, setCurrentOutput] = useState<EnhancedPrompt | null>(null)
  const [history, setHistory] = useState<EnhancedPrompt[]>([])
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null)
  const [brandMessage, setBrandMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const { data } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (data) {
        const formattedHistory = data.map(prompt => ({
          id: prompt.id,
          title: prompt.title,
          body: prompt.enhanced_prompt,
          mode: prompt.mode as Mode || 'ideate',
          timestamp: prompt.created_at,
          original: prompt.original_prompt
        }))
        setHistory(formattedHistory)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const enhancePrompt = async () => {
    if (!input.trim()) return

    setIsEnhancing(true)
    
    try {
      // Simulate API call - replace with actual Gemini API integration
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const enhanced: EnhancedPrompt = {
        id: Date.now().toString(),
        title: `Enhanced Prompt v${history.length + 1}`,
        body: `Enhanced version of: "${input}"\n\nThis is a ${mode} enhanced prompt that provides:\n• Clear structure and context\n• Specific instructions and parameters\n• Expected output format\n• Relevant examples and constraints\n\nThe enhanced prompt maintains the original intent while adding precision and clarity for better AI responses.`,
        mode,
        timestamp: new Date().toISOString(),
        original: input
      }

      setCurrentOutput(enhanced)
      setHistory(prev => [enhanced, ...prev.slice(0, 4)])
      setBrandMessage(brandMessages[Math.floor(Math.random() * brandMessages.length)])
      
      // Save to Supabase
      await supabase.from('prompts').insert({
        title: enhanced.title,
        original_prompt: input,
        enhanced_prompt: enhanced.body,
        enhancement_type: mode,
        mode: mode,
        user_id: 'demo-user' // Replace with actual user ID
      })
      
    } catch (error) {
      console.error('Error enhancing prompt:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Add toast notification here
  }

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        
        {/* Main Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
            <div className="space-y-6">
              
              {/* Mode Selector */}
              <div className="flex justify-center">
                <div className="flex bg-black/20 rounded-2xl p-1 backdrop-blur-sm">
                  {Object.entries(modeConfig).map(([key, config]) => {
                    const Icon = config.icon
                    const isActive = mode === key
                    
                    return (
                      <motion.button
                        key={key}
                        onClick={() => setMode(key as Mode)}
                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                          isActive
                            ? 'text-white shadow-lg'
                            : 'text-white/70 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeMode"
                            className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl`}
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{config.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Input Textarea */}
              <div className="relative">
                <motion.textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    autoResize()
                  }}
                  placeholder="Start typing your prompt..."
                  className="w-full bg-transparent text-white placeholder-white/50 border-2 border-white/20 rounded-2xl p-4 text-lg resize-none min-h-[120px] focus:outline-none focus:border-purple-400 transition-all"
                  style={{ height: 'auto' }}
                  whileFocus={{
                    boxShadow: '0 0 0 1px rgba(168, 85, 247, 0.4), 0 0 20px rgba(168, 85, 247, 0.2)'
                  }}
                />
              </div>

              {/* Enhance Button */}
              <div className="flex justify-center">
                <motion.button
                  onClick={enhancePrompt}
                  disabled={!input.trim() || isEnhancing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center space-x-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEnhancing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <Zap className="w-6 h-6" />
                  )}
                  <span>{isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Output */}
        <AnimatePresence>
          {currentOutput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold text-white">{currentOutput.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${modeConfig[currentOutput.mode].gradient} text-white`}>
                    {modeConfig[currentOutput.mode].label}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => copyToClipboard(currentOutput.body)}
                    className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Save className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={enhancePrompt}
                    className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 whitespace-pre-wrap leading-relaxed"
              >
                {currentOutput.body}
              </motion.div>
              
              {brandMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-center text-purple-300 font-medium"
                >
                  {brandMessage}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white/90 text-center">Recent Enhancements</h3>
            
            <div className="space-y-3">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedHistory(expandedHistory === item.id ? null : item.id)}
                    className="w-full p-4 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${modeConfig[item.mode].gradient} text-white`}>
                        {modeConfig[item.mode].label}
                      </span>
                      <span className="text-white/90 truncate">{item.original}</span>
                    </div>
                    {expandedHistory === item.id ? (
                      <ChevronUp className="w-4 h-4 text-white/70" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/70" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedHistory === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4 text-white/80 text-sm whitespace-pre-wrap">
                          {item.body}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}