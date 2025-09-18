import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell, AppShellHero } from './Layout/AppShell'
import { CollapsibleSidebar } from './Layout/CollapsibleSidebar'
import { FloatingCreditsOrb } from './Layout/FloatingCreditsOrb'
import { useCredits } from '../lib/credits'
import { PromptConsole } from './Prompt/PromptConsole'
import { FlowQuestionCard, FlowContextChips } from './Prompt/FlowQuestionCard'
import { useFlowMode } from '../hooks/useFlowMode'

type Mode = 'ideate' | 'flow'

interface ChatMessage {
  id: string
  mode: Mode
  timestamp: string
  input: string
  output: string
  title: string
  effectType?: string
}

export function Dashboard2ProRedesigned() {
  // Core state
  const [activeMode, setActiveMode] = useState<Mode>('ideate')
  const [input, setInput] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  
  // Layout state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeNavItem, setActiveNavItem] = useState('enhance')
  
  // Credits system (unified hook)
  const { credits, canSpend, spend, earn } = useCredits(50)
  
  // Flow mode
  const {
    flowState,
    startFlow,
    updateAnswer,
    nextStep,
    previousStep,
    goToStep,
    skipCurrentStep,
    completeFlow,
    resetFlow,
    getStructuredPrompt,
    getCurrentQuestion,
    getCurrentAnswer,
    canProceed
  } = useFlowMode()

  // Handle mode changes
  const handleModeChange = (mode: Mode) => {
    setActiveMode(mode)
    
    if (mode === 'flow' && !flowState.isActive) {
      startFlow()
      setInput('')
    } else if (mode === 'ideate') {
      if (flowState.isActive) {
        resetFlow()
      }
    }
  }

  // Handle Flow mode progression
  const handleFlowNext = () => {
    if (!canProceed()) return
    
    // Update current answer
    updateAnswer(flowState.currentStep, getCurrentAnswer())
    
    if (flowState.currentStep >= flowState.questions.length - 1) {
      // Complete flow and prepare for enhancement
      completeFlow()
      const structuredPrompt = getStructuredPrompt()
      setInput(structuredPrompt)
      setActiveMode('ideate') // Switch back to ideate for enhancement
    } else {
      nextStep()
    }
  }

  const handleFlowPrevious = () => {
    previousStep()
  }

  const handleFlowSkip = () => {
    skipCurrentStep()
  }

  const handleFlowAnswerChange = (answer: string) => {
    updateAnswer(flowState.currentStep, answer)
  }

  // Enhancement logic
  const enhancePrompt = async (effectType = 'enhance') => {
    if (!input.trim() || isEnhancing || !canSpend) return

    setIsEnhancing(true)
    const spent = spend(1, 'enhance')
    if (!spent) {
      setIsEnhancing(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1800))

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        mode: activeMode,
        timestamp: new Date().toISOString(),
        input: input.trim(),
        output: generateEnhancedOutput(input, activeMode, effectType),
        title: `Enhanced ${activeMode === 'ideate' ? 'Idea' : 'Flow'} • ${effectType}`
      }

      setChatHistory(prev => [newMessage, ...prev])
      setInput('')

    } catch (error) {
      console.error('Enhancement failed:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  // Generate mock enhanced output
  const generateEnhancedOutput = (input: string, mode: Mode, effectType: string): string => {
    const effects = {
      enhance: mode === 'ideate'
        ? `✨ Enhanced Creative Prompt:\n\n"${input}"\n\n🎯 Key Improvements:\n• Added specific context and constraints\n• Clarified desired output format\n• Enhanced with creative direction\n• Optimized for AI understanding\n\nThis refined prompt will generate more focused and creative results.`
        : `🌊 Structured Workflow for: "${input}"\n\n📋 Step-by-step Process:\n\n1. **Analysis Phase**\n   - Break down core requirements\n   - Identify key stakeholders\n\n2. **Planning Phase**\n   - Define success metrics\n   - Create timeline\n\n3. **Execution Phase**\n   - Implement solution\n   - Monitor progress\n\n4. **Review Phase**\n   - Evaluate results\n   - Iterate improvements`
    }

    return effects[effectType as keyof typeof effects] || effects.enhance
  }

  // Handle insufficient credits
  const handleAddCredits = () => {
    earn(10, 'bonus')
  }

  // Navigation handlers
  const handleNavItemSelect = (itemId: string) => {
    setActiveNavItem(itemId)
    
    // Handle navigation logic
    switch (itemId) {
      case 'home':
        // Navigate to home
        break
      case 'enhance':
        // Already on enhance page
        break
      case 'history':
        // Show history
        break
      case 'logout':
        // Handle logout
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-premium-bg text-text-primary font-body">
      <AppShell
        sidebar={
          <CollapsibleSidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeItem={activeNavItem}
            onItemSelect={handleNavItemSelect}
            recentHistory={chatHistory}
          />
        }
        creditsOrb={
          <FloatingCreditsOrb
            credits={credits}
            maxCredits={100}
            usedToday={0}
            onAddCredits={handleAddCredits}
            onUseCredit={() => spend(1)}
            isAnimating={false}
          />
        }
      >
        {/* Hero Section */}
        <AppShellHero
          title="PromptBrain"
          subtitle="Transform your ideas into powerful, structured prompts with AI-powered enhancement"
        />

        {/* Flow Context Chips */}
        {activeMode === 'flow' && flowState.isActive && (
          <FlowContextChips
            answers={flowState.answers}
            questions={flowState.questions}
            currentStep={flowState.currentStep}
            onEditAnswer={goToStep}
          />
        )}

        {/* Flow Question Card */}
        <AnimatePresence mode="wait">
          {activeMode === 'flow' && flowState.isActive && getCurrentQuestion() && (
            <FlowQuestionCard
              key={flowState.currentStep}
              question={getCurrentQuestion()!}
              currentStep={flowState.currentStep}
              totalSteps={flowState.questions.length}
              answer={getCurrentAnswer()}
              onAnswerChange={handleFlowAnswerChange}
              onNext={handleFlowNext}
              onPrevious={flowState.currentStep > 0 ? handleFlowPrevious : undefined}
              onSkip={getCurrentQuestion()?.optional ? handleFlowSkip : undefined}
              isLastQuestion={flowState.currentStep >= flowState.questions.length - 1}
            />
          )}
        </AnimatePresence>

        {/* Main Prompt Console */}
        <AnimatePresence mode="wait">
          {(activeMode === 'ideate' || !flowState.isActive) && (
            <PromptConsole
              input={input}
              setInput={setInput}
              activeMode={activeMode}
              onModeChange={handleModeChange}
              isEnhancing={isEnhancing}
              onEnhance={() => enhancePrompt()}
              flowState={flowState}
            />
          )}
        </AnimatePresence>

        {/* Chat History */}
        <AnimatePresence>
          {chatHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 space-y-6"
            >
              <h3 className="text-xl font-semibold text-text-primary text-center mb-8">
                Recent Enhancements
              </h3>
              
              {chatHistory.slice(0, 3).map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-panel rounded-2xl p-6 max-w-4xl mx-auto"
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${message.mode === 'ideate' 
                          ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
                          : 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                        }
                      `}>
                        {message.mode === 'ideate' ? '🪄 Ideate' : '🌊 Flow'}
                      </div>
                      <span className="text-text-muted text-sm">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="mb-4">
                    <div className="text-sm text-text-muted mb-2">Input:</div>
                    <div className="text-text-primary bg-glass rounded-lg p-3 text-sm">
                      {message.input}
                    </div>
                  </div>

                  {/* Output */}
                  <div>
                    <div className="text-sm text-text-muted mb-2">Enhanced Output:</div>
                    <div className="text-text-primary bg-glass rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {message.output}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end mt-4 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="
                        px-4 py-2 text-sm text-text-muted hover:text-text-primary
                        rounded-lg hover:bg-glass transition-all duration-150
                        premium-focus
                      "
                    >
                      Copy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="
                        px-4 py-2 text-sm text-text-muted hover:text-text-primary
                        rounded-lg hover:bg-glass transition-all duration-150
                        premium-focus
                      "
                    >
                      Re-run
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </AppShell>
    </div>
  )
}