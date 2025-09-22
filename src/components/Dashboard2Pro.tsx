import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Zap, Sparkles, FileText, History, Settings, BarChart3, User, LogOut, RotateCcw, ThumbsUp, ThumbsDown, Clock, ChevronDown, ChevronRight, Brain, Crown } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Mode = 'ideate' | 'flow'
// Removed unused OutputFormat type

interface ChatMessage {
  id: string
  mode: Mode
  timestamp: string
  input: string
  output: string
  title: string
  effectType?: string
}

interface OutputBubbleProps {
  message: ChatMessage
  onCopy: (text: string, format: 'english' | 'json' | 'markdown') => void
  onRerun: (messageId: string) => void
  onFeedback: (messageId: string, type: 'up' | 'down') => void
}

// Removed unused ToastState interface

export function Dashboard2Pro() {
  const [activeMode, setActiveMode] = useState<Mode>('ideate')
  const [input, setInput] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [showEffectOptions, setShowEffectOptions] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Default collapsed as per spec
  const [activeNavItem, setActiveNavItem] = useState('profile')
  const [credits, setCredits] = useState(42)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  // Removed unused outputFormat state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showCreditsTooltip, setShowCreditsTooltip] = useState(false)
  const [maxCredits] = useState(100)

  // Flow Mode state
  const [currentFlowStep, setCurrentFlowStep] = useState(0)
  const [flowAnswers, setFlowAnswers] = useState<string[]>([])
  const [isFlowMode, setIsFlowMode] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState('')

  const modeConfig = {
    ideate: {
      icon: Sparkles,
      label: 'Ideate',
      description: 'For brainstorming raw ideas',
      gradient: 'from-amber-400 via-yellow-500 to-amber-600'
    },
    flow: {
      icon: FileText,
      label: 'Flow',
      description: 'For structured, multi-step logical flows',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600'
    }
  }

  // Flow Mode Questions (Component 6 spec)
  const flowQuestions = [
    {
      id: 'what',
      question: 'What is the core task/goal of your prompt?',
      placeholder: 'Describe what you want to accomplish...',
      category: 'What'
    },
    {
      id: 'who',
      question: 'Who is the audience / target output for this?',
      placeholder: 'Who will use or see this output?...',
      category: 'Who'
    },
    {
      id: 'why',
      question: 'Why do you need this prompt? What\'s the context?',
      placeholder: 'Explain the background or situation...',
      category: 'Why'
    },
    {
      id: 'format',
      question: 'What format or tone should the output have?',
      placeholder: 'Formal, casual, technical, creative, etc...',
      category: 'Format'
    },
    {
      id: 'constraints',
      question: 'Are there any constraints (time, word count, style, exclusions)?',
      placeholder: 'Any limitations or requirements...',
      category: 'Constraints'
    },
    {
      id: 'example',
      question: '[Optional] Provide a small example if you have one.',
      placeholder: 'Share an example to guide the output...',
      category: 'Example',
      optional: true
    }
  ]

  // Core sidebar items as per Component 5 spec
  const sidebarItems = [
    {
      id: 'profile',
      icon: User,
      label: 'Profile',
      tooltip: 'Profile',
      expandedContent: { username: 'User', email: 'user@example.com' }
    },
    {
      id: 'history',
      icon: History,
      label: 'History',
      tooltip: 'Recent Activity',
      expandedContent: { recentPrompts: chatHistory.slice(0, 3) || [] }
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      tooltip: 'Settings',
      expandedContent: { theme: 'dark', notifications: true }
    }
  ]

  // Auto-collapse on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('premium-sidebar')
      if (sidebar && !sidebar.contains(event.target as Node) && !sidebarCollapsed) {
        setSidebarCollapsed(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarCollapsed])

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mode toggle function
  const handleModeToggle = (mode: Mode) => {
    setActiveMode(mode)
    setIsFlowMode(mode === 'flow')

    // Reset flow state when switching modes
    if (mode === 'flow') {
      setCurrentFlowStep(0)
      setFlowAnswers([])
      setCurrentAnswer('')
      setInput('')
    } else {
      setCurrentFlowStep(0)
      setFlowAnswers([])
      setCurrentAnswer('')
    }

    // Add subtle haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  const enhancePrompt = async (effectType = 'enhance') => {
    if (!input.trim() || isEnhancing) return

    setIsEnhancing(true)
    setShowEffectOptions(false)

    const payload: any = {
      mode: activeMode === 'flow' ? 'flow' : 'direct',
      originalPrompt: input.trim()
    }

    try {
      // Get authentication token
      const { data: { session } } = await supabase.auth.getSession()
      const authHeader = session?.access_token 
        ? `Bearer ${session.access_token}` 
        : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`

      const res = await fetch('https://qaugvrsaeydptmsxllcu.supabase.co/functions/v1/make-server-08c24b4c/enhance-prompt', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(payload)
      })

      let outputText = ''
      if (res.ok) {
        const data = await res.json()
        outputText = data?.enhancedPrompt?.english
          || data?.enhancedPrompt?.detailed
          || data?.enhancedPrompt?.short
          || ''
      }

      if (!outputText) {
        // Fallback to local generator if server not reachable
        outputText = generateEnhancedOutput(input, activeMode, effectType)
      }

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        mode: activeMode,
        timestamp: new Date().toISOString(),
        input: input.trim(),
        output: outputText,
        title: `Enhanced ${activeMode === 'ideate' ? 'Idea' : 'Flow'} • ${effectType}`,
        effectType
      }

      setChatHistory(prev => [newMessage, ...prev])
      setInput('')

      // Deduct credits with animation
      setCredits(prev => Math.max(0, prev - 1))

    } catch (error) {
      console.error('Enhancement failed:', error)
      // Final fallback
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        mode: activeMode,
        timestamp: new Date().toISOString(),
        input: input.trim(),
        output: generateEnhancedOutput(input, activeMode, effectType),
        title: `Enhanced ${activeMode === 'ideate' ? 'Idea' : 'Flow'} • ${effectType}`,
        effectType
      }
      setChatHistory(prev => [newMessage, ...prev])
      setInput('')
    } finally {
      setIsEnhancing(false)
    }
  }

  // Premium Topbar Component
  const PremiumTopbar = () => {
    const creditsPercentage = (credits / maxCredits) * 100

    const getCreditsColor = () => {
      if (creditsPercentage > 60) return 'from-green-400 to-emerald-600'
      if (creditsPercentage > 30) return 'from-yellow-400 to-orange-500'
      return 'from-orange-500 to-red-500'
    }

    const handleCreditsClick = () => {
      // Show playful toast for future upgrade
      setCopySuccess("Upgrades coming soon 🚀")
      setTimeout(() => setCopySuccess(null), 2000)
    }



    return (
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 h-16 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50"
      >
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Left Zone - Brand/Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveNavItem('profile')}
          >
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Brain className="w-4 h-4 text-black" />
            </motion.div>
            <span className="text-white text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              PromptBrain
            </span>
          </motion.div>

          {/* Center Zone - Mode Indicator + Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-neutral-900/50 rounded-2xl p-1 border border-neutral-700/50">
              {Object.entries(modeConfig).map(([key, config]) => {
                const Icon = config.icon
                const isActive = activeMode === key

                return (
                  <motion.button
                    key={key}
                    onClick={() => handleModeToggle(key as Mode)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${isActive
                      ? 'text-white shadow-lg'
                      : 'text-white/60 hover:text-white/90'
                      }`}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTopbarMode"
                        className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl shadow-lg`}
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

            {/* Subtle gradient underline that shifts with mode */}
            <motion.div
              className={`h-1 w-16 rounded-full bg-gradient-to-r ${activeMode === 'ideate'
                ? 'from-purple-400 to-pink-500'
                : 'from-teal-400 to-cyan-500'
                }`}
              layoutId="modeUnderline"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          </div>

          {/* Right Zone - Credits + Profile */}
          <div className="flex items-center space-x-4">
            {/* Credits Display - Gamified Battery */}
            <div className="relative">
              <motion.div
                className="flex items-center space-x-3 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={handleCreditsClick}
                onMouseEnter={() => setShowCreditsTooltip(true)}
                onMouseLeave={() => setShowCreditsTooltip(false)}
              >
                {/* Credits Meter */}
                <div className="relative w-16 h-6 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getCreditsColor()} rounded-full relative`}
                    initial={{ width: 0 }}
                    animate={{ width: `${creditsPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* Subtle glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full"
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>

                  {/* Battery indicator dots */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${creditsPercentage > (i + 1) * 25
                            ? 'bg-white/80'
                            : 'bg-white/20'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-white/80 text-sm font-medium">{credits}</span>
              </motion.div>

              {/* Credits Tooltip */}
              <AnimatePresence>
                {showCreditsTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap shadow-xl"
                  >
                    {credits} / {maxCredits} credits
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 border-l border-t border-neutral-700 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <motion.button
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg border-2 border-transparent hover:border-amber-400/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <User className="w-5 h-5 text-black" />
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                    className="absolute top-full right-0 mt-3 w-56 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {/* Profile Header */}
                    <div className="p-4 border-b border-neutral-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                          <User className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">User</div>
                          <div className="text-white/60 text-sm">user@example.com</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <motion.button
                        className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-all"
                        whileHover={{ x: 4 }}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </motion.button>

                      <motion.button
                        className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-all"
                        whileHover={{ x: 4 }}
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Usage Stats</span>
                      </motion.button>

                      <motion.button
                        className="w-full flex items-center space-x-3 px-4 py-3 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all opacity-50 cursor-not-allowed"
                        whileHover={{ x: 4 }}
                        onClick={handleCreditsClick}
                      >
                        <Crown className="w-4 h-4" />
                        <span>Upgrade</span>
                        <span className="ml-auto text-xs bg-amber-500/20 px-2 py-1 rounded-full">Soon</span>
                      </motion.button>

                      <div className="border-t border-neutral-700/50 mt-2 pt-2">
                        <motion.button
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                          whileHover={{ x: 4 }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Copy Success Toast */}
        <AnimatePresence>
          {copySuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="absolute top-full right-6 mt-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl"
            >
              {copySuccess}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  const generateEnhancedOutput = (input: string, mode: Mode, effectType: string): string => {
    const effects = {
      enhance: mode === 'ideate'
        ? `✨ Enhanced Creative Prompt:\n\n"${input}"\n\n🎯 Key Improvements:\n• Added specific context and constraints\n• Clarified desired output format\n• Enhanced with creative direction\n• Optimized for AI understanding\n\nThis refined prompt will generate more focused and creative results.`
        : `🌊 Structured Workflow for: "${input}"\n\n📋 Step-by-step Process:\n\n1. **Analysis Phase**\n   - Break down core requirements\n   - Identify key stakeholders\n\n2. **Planning Phase**\n   - Define success metrics\n   - Create timeline\n\n3. **Execution Phase**\n   - Implement solution\n   - Monitor progress\n\n4. **Review Phase**\n   - Evaluate results\n   - Iterate improvements`,

      polish: `💎 Polished Version:\n\n"${input}"\n\n🔧 Refinements Applied:\n• Grammar and clarity improvements\n• Professional tone enhancement\n• Structure optimization\n• Readability boost`,

      expand: `📈 Expanded Version:\n\n"${input}"\n\n🚀 Additional Context:\n• Detailed background information\n• Extended use cases\n• Comprehensive examples\n• Broader scope considerations`,

      compress: `⚡ Compressed Version:\n\n"${input}"\n\n🎯 Condensed to Essentials:\n• Core message preserved\n• Unnecessary details removed\n• Direct and actionable\n• Maximum impact, minimum words`
    }

    return effects[effectType as keyof typeof effects] || effects.enhance
  }

  const copyToClipboard = async (text: string, format: 'english' | 'json' | 'markdown' = 'english') => {
    try {
      let copyText = text
      if (format === 'json') {
        copyText = JSON.stringify({
          content: text,
          format,
          timestamp: new Date().toISOString(),
          mode: activeMode
        }, null, 2)
      } else if (format === 'markdown') {
        copyText = `# Enhanced Output\n\n${text}\n\n---\n*Generated by PromptBrain*`
      }

      await navigator.clipboard.writeText(copyText)
      setCopySuccess(`Copied as ${format.toUpperCase()}!`)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleRerun = async (messageId: string) => {
    const message = chatHistory.find(m => m.id === messageId)
    if (message) {
      setInput(message.input)
      await enhancePrompt(message.effectType || 'enhance')
    }
  }

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    console.log(`Feedback for ${messageId}: ${type}`)
    // Here you would typically send feedback to your backend
  }

  // Flow Mode Functions
  const handleFlowNext = () => {
    if (currentAnswer.trim()) {
      const newAnswers = [...flowAnswers]
      newAnswers[currentFlowStep] = currentAnswer.trim()
      setFlowAnswers(newAnswers)
    }

    setCurrentAnswer('')

    if (currentFlowStep < flowQuestions.length - 1) {
      setCurrentFlowStep(currentFlowStep + 1)
    } else {
      // All questions answered, ready to enhance
      handleFlowEnhance()
    }
  }

  const handleFlowSkip = () => {
    const newAnswers = [...flowAnswers]
    newAnswers[currentFlowStep] = '[Skipped]'
    setFlowAnswers(newAnswers)

    setCurrentAnswer('')

    if (currentFlowStep < flowQuestions.length - 1) {
      setCurrentFlowStep(currentFlowStep + 1)
    } else {
      handleFlowEnhance()
    }
  }

  const handleFlowEnhance = async () => {
    // Merge all flow answers into structured prompt
    const structuredPrompt = flowQuestions.map((q, index) => {
      const answer = flowAnswers[index] || '[Not answered]'
      return `${q.category}: ${answer}`
    }).join('\n\n')

    setInput(structuredPrompt)
    await enhancePrompt('flow')

    // Reset flow state
    setCurrentFlowStep(0)
    setFlowAnswers([])
    setIsFlowMode(false)
  }

  // Premium Output Bubble Component
  const OutputBubble = ({ message, onCopy, onRerun, onFeedback }: OutputBubbleProps) => {
    const [showFormatOptions, setShowFormatOptions] = useState(false)
    const [currentFormat, setCurrentFormat] = useState<'text' | 'json'>('text')

    const formatTimestamp = (timestamp: string) => {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getModeConfig = (mode: Mode) => {
      return mode === 'ideate'
        ? { emoji: '🪄', label: 'Ideate', color: 'from-purple-400 to-pink-500' }
        : { emoji: '🌊', label: 'Flow', color: 'from-blue-400 to-cyan-500' }
    }

    const modeInfo = getModeConfig(message.mode)

    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }}
        className="w-full max-w-[70%] mx-auto mt-6 mb-2"
      >
        {/* Premium Output Card */}
        <motion.div
          className="bg-gradient-to-br from-neutral-900 to-neutral-800 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative"
          whileHover={{
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            borderColor: 'rgba(255,255,255,0.2)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl" />

          {/* Header Row */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center space-x-3">
              {/* Mode Tag */}
              <motion.div
                className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${modeInfo.color} text-white shadow-lg`}
                whileHover={{ scale: 1.05 }}
              >
                {modeInfo.emoji} {modeInfo.label}
              </motion.div>

              {/* Timestamp */}
              <div className="flex items-center space-x-1 text-white/40 text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatTimestamp(message.timestamp)}</span>
              </div>
            </div>

            {/* Re-run Button */}
            <motion.button
              onClick={() => onRerun(message.id)}
              className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              title="Re-run enhancement"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Main Output Container */}
          <div className="relative z-10 p-6">
            <AnimatePresence mode="wait">
              {currentFormat === 'text' ? (
                <motion.div
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-200 leading-relaxed whitespace-pre-wrap text-base"
                >
                  {message.output}
                </motion.div>
              ) : (
                <motion.div
                  key="json"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-neutral-950 rounded-xl p-4 border border-green-500/20"
                >
                  <pre className="text-green-300 text-sm font-mono overflow-x-auto">
                    {JSON.stringify({
                      mode: message.mode,
                      input: message.input,
                      output: message.output,
                      timestamp: message.timestamp,
                      effectType: message.effectType
                    }, null, 2)}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Bar */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4 border-t border-white/5 bg-black/20">
            <div className="flex items-center space-x-3">
              {/* Copy Button with Success Animation */}
              <div className="relative">
                <motion.button
                  onClick={() => onCopy(message.output, 'english')}
                  className="flex items-center space-x-2 px-3 py-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-medium">Copy</span>
                </motion.button>

                {/* Copy Success Indicator */}
                <AnimatePresence>
                  {copySuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap"
                    >
                      {copySuccess} ✓
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Format Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowFormatOptions(!showFormatOptions)}
                  className="flex items-center space-x-2 px-3 py-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-medium">
                    {currentFormat === 'text' ? 'English' : 'JSON'}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </motion.button>

                {/* Format Options Dropdown */}
                <AnimatePresence>
                  {showFormatOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] backdrop-blur-xl rounded-xl border border-white/20 py-2 shadow-2xl z-30 min-w-[140px]"
                    >
                      {[
                        { key: 'text', label: 'English', desc: 'Human readable' },
                        { key: 'json', label: 'JSON', desc: 'Structured data' }
                      ].map((format) => (
                        <motion.button
                          key={format.key}
                          onClick={() => {
                            setCurrentFormat(format.key as 'text' | 'json')
                            setShowFormatOptions(false)
                          }}
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-all flex items-center justify-between group"
                          whileHover={{ x: 4 }}
                        >
                          <div>
                            <div className="font-medium text-sm">{format.label}</div>
                            <div className="text-xs text-white/50">{format.desc}</div>
                          </div>
                          {currentFormat === format.key && (
                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                          )}
                        </motion.button>
                      ))}

                      <div className="border-t border-white/10 mt-2 pt-2">
                        <motion.button
                          onClick={() => {
                            onCopy(message.output, 'markdown')
                            setShowFormatOptions(false)
                          }}
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-all"
                          whileHover={{ x: 4 }}
                        >
                          <div className="font-medium text-sm">Copy as Markdown</div>
                          <div className="text-xs text-white/50">With formatting</div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Feedback Buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => onFeedback(message.id, 'up')}
                className="p-2 text-white/40 hover:text-green-400 rounded-lg hover:bg-green-500/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Good response"
              >
                <ThumbsUp className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => onFeedback(message.id, 'down')}
                className="p-2 text-white/40 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Poor response"
              >
                <ThumbsDown className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707] flex relative overflow-hidden">
      {/* Premium Topbar */}
      <PremiumTopbar />

      {/* Main Layout Container */}
      <div className="flex w-full pt-16">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Premium Sidebar - Luxury Control Panel */}
        <motion.div
          id="premium-sidebar"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
          className={`relative z-20 h-full bg-neutral-950/80 backdrop-blur-md border-r transition-all duration-300 ease-out ${sidebarCollapsed ? 'w-16' : 'w-60'
            }`}
          style={{
            borderRightColor: 'transparent'
          }}
        >
          {/* Subtle neon border on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/30 via-cyan-500/50 to-purple-500/30" />

          {/* Core Navigation Items */}
          <div className="flex flex-col h-full py-6">
            <div className="flex-1 space-y-4 px-3">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = activeNavItem === item.id

                return (
                  <div key={item.id} className="relative group">
                    <motion.button
                      onClick={() => {
                        setActiveNavItem(item.id)
                        if (sidebarCollapsed) {
                          setSidebarCollapsed(false)
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-4 rounded-xl transition-all relative ${isActive
                        ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: isActive ? '0 0 20px rgba(168, 85, 247, 0.3)' : '0 0 10px rgba(6, 182, 212, 0.2)'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative flex-shrink-0">
                        <Icon className={`w-5 h-5 transition-all ${isActive ? 'text-purple-400' : 'text-white/60 group-hover:text-cyan-400'
                          }`} />
                        {(isActive || (!sidebarCollapsed && item.id === 'profile')) && (
                          <motion.div
                            className="absolute inset-0 bg-purple-400/30 rounded-full blur-sm"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </div>

                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 text-left"
                          >
                            <div className="font-medium text-sm">{item.label}</div>

                            {/* Expanded Content */}
                            {item.id === 'profile' && item.expandedContent && 'username' in item.expandedContent && 'email' in item.expandedContent && (
                              <div className="text-xs text-white/50 mt-1">
                                {item.expandedContent.username}
                                <br />
                                {item.expandedContent.email}
                              </div>
                            )}

                            {item.id === 'history' && item.expandedContent && 'recentPrompts' in item.expandedContent && (
                              <div className="text-xs text-white/50 mt-1">
                                {item.expandedContent.recentPrompts && item.expandedContent.recentPrompts.length > 0
                                  ? `${item.expandedContent.recentPrompts.length} recent items`
                                  : 'No recent activity'
                                }
                              </div>
                            )}

                            {item.id === 'settings' && item.expandedContent && 'theme' in item.expandedContent && (
                              <div className="text-xs text-white/50 mt-1">
                                Theme: {item.expandedContent.theme}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* Instant Tooltips for Collapsed State */}
                    {sidebarCollapsed && (
                      <motion.div
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-neutral-900/95 backdrop-blur-sm text-white text-sm rounded-lg border border-purple-500/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-0 z-40 whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {item.tooltip}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Optional Future Upgrade Button */}
            <div className="px-3 pb-4">
              <motion.button
                className="w-full flex items-center space-x-3 px-3 py-4 rounded-xl text-white/40 hover:text-white/60 hover:bg-white/5 transition-all opacity-50 cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
              >
                <Crown className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium text-sm">Upgrade</div>
                      <div className="text-xs text-white/30 mt-1">Coming soon</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Main Content - Premium Grok Style */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Chat History with Premium Output Bubbles */}
            {chatHistory.length > 0 && (
              <div className="w-full max-w-5xl mb-8 space-y-6">
                <AnimatePresence>
                  {chatHistory.map((message, index) => (
                    <div key={message.id} className="space-y-4">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 max-w-[75%] border border-white/10"
                          whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(255,255,255,0.1)' }}
                        >
                          <p className="text-white/90 text-base leading-relaxed">{message.input}</p>
                        </motion.div>
                      </div>

                      {/* AI Response with Premium Output Bubble */}
                      <div className="flex items-start space-x-4">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                        >
                          <span className="text-black font-bold text-sm">P</span>
                        </motion.div>
                        <div className="flex-1">
                          <OutputBubble
                            message={message}
                            onCopy={copyToClipboard}
                            onRerun={handleRerun}
                            onFeedback={handleFeedback}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Empty State Logo */}
            {chatHistory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
                className="text-center mb-16"
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-2xl"
                  whileHover={{
                    scale: 1.1,
                    rotate: 10,
                    boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4)'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <span className="text-black font-bold text-2xl">P</span>
                </motion.div>
                <h1 className="text-5xl font-bold text-white mb-4 tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                  PromptBrain
                </h1>
                <p className="text-white/50 text-xl">What do you want to enhance?</p>
              </motion.div>
            )}

            {/* Component 6: Main Chatbox (Prompt Console) - Command Center */}
            <div className="w-full max-w-4xl">
              {/* Chat Stream Container */}
              <div className="mb-8">
                {/* Flow Mode Questions Stream */}
                <AnimatePresence>
                  {isFlowMode && (
                    <div className="space-y-6 mb-8">
                      {/* Progress Indicator */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center space-x-2 mb-8"
                      >
                        <span className="text-white/50 text-sm">Flow Mode</span>
                        <div className="flex space-x-2">
                          {flowQuestions.map((_, index) => (
                            <motion.div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${index <= currentFlowStep ? 'bg-cyan-400' : 'bg-white/20'
                                }`}
                              animate={{
                                scale: index === currentFlowStep ? 1.2 : 1,
                                opacity: index <= currentFlowStep ? 1 : 0.5
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-white/50 text-sm">{currentFlowStep + 1}/{flowQuestions.length}</span>
                      </motion.div>

                      {/* Current Question */}
                      <motion.div
                        key={currentFlowStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4, ease: [0.2, 0.9, 0.2, 1] }}
                        className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-6 shadow-2xl"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">{currentFlowStep + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg mb-2">
                              {flowQuestions[currentFlowStep]?.question}
                            </h3>
                            <div className="text-cyan-300 text-sm mb-4">
                              {flowQuestions[currentFlowStep]?.category}
                              {flowQuestions[currentFlowStep]?.optional && (
                                <span className="ml-2 text-white/40">(Optional)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Previous Answers */}
                      {flowAnswers.slice(0, currentFlowStep).map((answer, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                              <span className="text-green-400 text-xs">✓</span>
                            </div>
                            <span className="text-white/60 text-sm">{flowQuestions[index]?.category}</span>
                          </div>
                          <p className="text-white/80 text-sm pl-9">
                            {answer === '[Skipped]' ? (
                              <span className="text-white/40 italic">Skipped</span>
                            ) : (
                              answer
                            )}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
              {/* Input Section - Docked at Bottom */}
              <motion.div
                className="relative bg-[#1A1A1A] backdrop-blur-xl rounded-3xl border overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  borderColor: isFlowMode ? 'rgba(6, 182, 212, 0.3)' : 'rgba(245, 158, 11, 0.3)'
                }}
                transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
                whileHover={{
                  boxShadow: isFlowMode
                    ? '0 25px 50px rgba(6, 182, 212, 0.2)'
                    : '0 25px 50px rgba(245, 158, 11, 0.2)',
                  borderColor: isFlowMode ? 'rgba(6, 182, 212, 0.5)' : 'rgba(245, 158, 11, 0.5)'
                }}
              >
                {/* Ambient glow overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${isFlowMode
                  ? 'from-cyan-500/10 via-transparent to-purple-500/10'
                  : 'from-amber-500/10 via-transparent to-yellow-500/10'
                  } rounded-3xl`} />

                {/* Mode Toggle - Integrated */}
                <div className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/10">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-[#0a0a0a] rounded-2xl p-1 border border-white/10">
                      {Object.entries(modeConfig).map(([key, config]) => {
                        const Icon = config.icon
                        const isActive = activeMode === key

                        return (
                          <motion.button
                            key={key}
                            onClick={() => handleModeToggle(key as Mode)}
                            className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 ${isActive
                              ? 'text-white shadow-lg'
                              : 'text-white/60 hover:text-white/90'
                              }`}
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeModeConsole"
                                className={`absolute inset-0 bg-gradient-to-r ${key === 'flow'
                                  ? 'from-cyan-400 to-purple-500'
                                  : 'from-amber-400 to-yellow-500'
                                  } rounded-xl shadow-lg`}
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
                    <div className="text-white/50 text-sm">
                      {isFlowMode ? `Question ${currentFlowStep + 1} of ${flowQuestions.length}` : modeConfig[activeMode].description}
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="relative z-10 p-8">
                  <div className="flex items-end space-x-6">
                    <div className="flex-1">
                      <motion.textarea
                        value={isFlowMode ? currentAnswer : input}
                        onChange={(e) => isFlowMode ? setCurrentAnswer(e.target.value) : setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault()
                            if (isFlowMode) {
                              handleFlowNext()
                            } else {
                              enhancePrompt()
                            }
                          }
                        }}
                        placeholder={
                          isFlowMode
                            ? flowQuestions[currentFlowStep]?.placeholder || 'Type your answer...'
                            : 'Type your raw idea or prompt...'
                        }
                        className="w-full bg-transparent text-white placeholder-white/40 text-xl resize-none focus:outline-none min-h-[100px] max-h-[200px] leading-relaxed"
                        style={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                          fontSize: '18px',
                          lineHeight: '1.6'
                        }}
                        whileFocus={{
                          scale: 1.01,
                          transition: { duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }
                        }}
                      />

                      {/* Typing glow animation */}
                      {(input || currentAnswer) && (
                        <motion.div
                          className={`absolute bottom-2 left-8 w-1 h-6 bg-gradient-to-t ${isFlowMode ? 'from-cyan-400' : 'from-amber-400'
                            } to-transparent rounded-full`}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      {isFlowMode ? (
                        <>
                          {/* Skip Button */}
                          {flowQuestions[currentFlowStep]?.optional && (
                            <motion.button
                              onClick={handleFlowSkip}
                              className="px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Skip
                            </motion.button>
                          )}

                          {/* Next/Finish Button */}
                          <motion.button
                            onClick={handleFlowNext}
                            disabled={!currentAnswer.trim() && !flowQuestions[currentFlowStep]?.optional}
                            className={`relative px-6 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all overflow-hidden ${(currentAnswer.trim() || flowQuestions[currentFlowStep]?.optional)
                              ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg hover:shadow-cyan-500/50'
                              : 'bg-white/10 text-white/30 cursor-not-allowed'
                              }`}
                            whileHover={(currentAnswer.trim() || flowQuestions[currentFlowStep]?.optional) ? {
                              scale: 1.05,
                              y: -2,
                              boxShadow: '0 10px 20px rgba(6, 182, 212, 0.4)'
                            } : {}}
                            whileTap={(currentAnswer.trim() || flowQuestions[currentFlowStep]?.optional) ? { scale: 0.95 } : {}}
                          >
                            <span>
                              {currentFlowStep === flowQuestions.length - 1 ? 'Finish' : 'Next'}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </motion.button>
                        </>
                      ) : (
                        /* Enhance Button - Command Center Style */
                        <div className="relative">
                          <motion.button
                            onClick={() => setShowEffectOptions(!showEffectOptions)}
                            disabled={!input.trim() || isEnhancing}
                            className={`relative px-8 py-4 rounded-2xl font-bold text-lg flex items-center space-x-3 transition-all overflow-hidden ${input.trim() && !isEnhancing
                              ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black shadow-2xl hover:shadow-amber-500/50'
                              : 'bg-white/10 text-white/30 cursor-not-allowed'
                              }`}
                            whileHover={input.trim() && !isEnhancing ? {
                              scale: 1.05,
                              y: -3,
                              boxShadow: '0 20px 40px rgba(245, 158, 11, 0.6)'
                            } : {}}
                            whileTap={input.trim() && !isEnhancing ? { scale: 0.95 } : {}}
                            animate={isEnhancing ? {
                              background: [
                                'linear-gradient(90deg, #f59e0b, #eab308, #f59e0b)',
                                'linear-gradient(90deg, #eab308, #f59e0b, #eab308)',
                                'linear-gradient(90deg, #f59e0b, #eab308, #f59e0b)'
                              ]
                            } : {}}
                            transition={isEnhancing ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                          >
                            {/* Power orb glow */}
                            {input.trim() && !isEnhancing && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-amber-400/50 to-yellow-500/50 rounded-2xl blur-xl"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              />
                            )}

                            <div className="relative z-10 flex items-center space-x-3">
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
                              <span className="whitespace-nowrap">
                                {isEnhancing ? 'Processing…' : 'Enhance ⚡'}
                              </span>
                            </div>

                            {/* Neon streak effect */}
                            {input.trim() && !isEnhancing && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              />
                            )}
                          </motion.button>

                          {/* Effect Options Dropdown */}
                          <AnimatePresence>
                            {showEffectOptions && input.trim() && !isEnhancing && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute top-full right-0 mt-3 bg-[#1a1a1a] backdrop-blur-xl rounded-2xl border border-white/20 py-3 shadow-2xl z-20 min-w-[200px]"
                              >
                                {[
                                  { key: 'enhance', label: '✨ Enhance', desc: 'Full enhancement' },
                                  { key: 'polish', label: '💎 Polish', desc: 'Refine & clean' },
                                  { key: 'expand', label: '📈 Expand', desc: 'Add more detail' },
                                  { key: 'compress', label: '⚡ Compress', desc: 'Make concise' }
                                ].map((effect) => (
                                  <motion.button
                                    key={effect.key}
                                    onClick={() => enhancePrompt(effect.key)}
                                    className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-all flex items-center justify-between group"
                                    whileHover={{ x: 4 }}
                                  >
                                    <div>
                                      <div className="font-medium">{effect.label}</div>
                                      <div className="text-xs text-white/50">{effect.desc}</div>
                                    </div>
                                    <motion.div
                                      className="opacity-0 group-hover:opacity-100"
                                      whileHover={{ scale: 1.2 }}
                                    >
                                      →
                                    </motion.div>
                                  </motion.button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Keyboard Hint */}
              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-white/30 text-sm">
                  Press ⌘ + Enter to {isFlowMode ? 'continue' : 'enhance'} •
                  {isFlowMode ? ` Step ${currentFlowStep + 1} of ${flowQuestions.length}` : ' Click enhance for options'}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}