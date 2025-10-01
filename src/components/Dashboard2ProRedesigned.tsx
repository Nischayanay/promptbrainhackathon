import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell, AppShellHero } from './Layout/AppShell'
import { CollapsibleSidebar } from './Layout/CollapsibleSidebar'
import { FloatingCreditsOrb } from './Layout/FloatingCreditsOrb'
import { useCredits } from '../lib/credits'
import { PromptConsole } from './Prompt/PromptConsole'
import { FlowQuestionCard, FlowContextChips } from './Prompt/FlowQuestionCard'
import { useFlowMode } from '../hooks/useFlowMode'
import { designTokens } from '../lib/designTokens'
import { supabase } from '../lib/supabase'

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
  const [announcement, setAnnouncement] = useState('')
  const HISTORY_KEY = 'pbm_chat_history_v1'
  
  // Layout state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeNavItem, setActiveNavItem] = useState('enhance')
  
  // Credits system (server-authoritative)
  const { credits, canSpend, isLoading: creditsLoading, dailyRefresh, spend, earn, manualRefresh } = useCredits()

  // Restore and persist chat history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setChatHistory(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(chatHistory))
    } catch {}
  }, [chatHistory])
  
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
  const handleFlowNext = async () => {
    if (!canProceed()) return
    
    // Update current answer
    updateAnswer(flowState.currentStep, getCurrentAnswer())
    
    if (flowState.currentStep >= flowState.questions.length - 1) {
      // Complete flow and enhance immediately in the same chat interface
      completeFlow()
      const structuredPrompt = getStructuredPrompt()
      setInput(structuredPrompt)
      setActiveMode('ideate')
      await enhancePrompt('enhance')
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

  // Enhancement logic with accessibility announcements
  const enhancePrompt = async (effectType = 'enhance') => {
    if (!input.trim() || isEnhancing || !canSpend) return

    setIsEnhancing(true)
    setAnnouncement('Enhancement started...')
    
    // Generate prompt ID for audit trail
    const promptId = crypto.randomUUID()
    
    const spent = await spend(1, 'prompt_enhancement', promptId)
    if (!spent) {
      setIsEnhancing(false)
      setAnnouncement('Insufficient credits to enhance prompt')
      return
    }

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
        outputText = generateEnhancedOutput(input, activeMode, effectType)
      }

      const newMessage: ChatMessage = {
        id: promptId,
        mode: activeMode,
        timestamp: new Date().toISOString(),
        input: input.trim(),
        output: outputText,
        title: `Enhanced ${activeMode === 'ideate' ? 'Idea' : 'Flow'} • ${effectType}`
      }

      setChatHistory(prev => [newMessage, ...prev])
      setInput('')
      setAnnouncement(`Prompt enhanced successfully! ${credits - 1} credits remaining.`)

    } catch (error) {
      console.error('Enhancement failed:', error)
      setAnnouncement('Enhancement failed. Please try again.')
      
      // Rollback credit deduction on failure
      await earn(1, 'enhancement_failed_rollback')
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
  const handleAddCredits = async () => {
    const refreshed = await manualRefresh()
    if (!refreshed) {
      await earn(10, 'daily_bonus')
    }
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
    <div 
      className="min-h-screen text-text-primary font-body"
      style={{ 
        backgroundColor: designTokens.colors.background,
        fontFamily: designTokens.typography.fontBody
      }}
    >
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Low Credits Banner with improved accessibility */}
      {!creditsLoading && credits < 5 && (
        <div 
          role="alert"
          aria-live="assertive"
          className="sticky top-0 z-40 border-b text-sm px-4 py-2"
          style={{
            backgroundColor: `${designTokens.colors.error}20`,
            borderColor: `${designTokens.colors.error}40`,
            color: designTokens.colors.textPrimary
          }}
        >
          <span className="font-medium">Low credits warning:</span> You have {credits} credits remaining. Earn more or upgrade to continue enhancing.
        </div>
      )}
      
      {/* Daily Credits Refresh Notification */}
      {!creditsLoading && dailyRefresh && dailyRefresh.credits_added > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="sticky top-0 z-40 border-b text-sm px-4 py-2"
          style={{
            backgroundColor: `${designTokens.colors.brandGold}20`,
            borderColor: `${designTokens.colors.brandGold}40`,
            color: designTokens.colors.textPrimary
          }}
        >
          <span className="font-medium">🎉 Daily Credits Refreshed!</span> 
          {' '}+{dailyRefresh.credits_added} credits added. 
          {dailyRefresh.days_missed > 1 && ` (${dailyRefresh.days_missed} days worth)`}
          {' '}Current balance: {credits} credits.
        </motion.div>
      )}

      {/* Credits Loading State */}
      {creditsLoading && (
        <div 
          className="sticky top-0 z-40 border-b text-sm px-4 py-2"
          style={{
            backgroundColor: `${designTokens.colors.glass}20`,
            borderColor: `${designTokens.colors.glassBorder}40`,
            color: designTokens.colors.textMuted
          }}
        >
          Loading credits balance...
        </div>
      )}
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

        {/* Enhancing Skeleton with improved accessibility */}
        <AnimatePresence>
          {isEnhancing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto mt-8 p-6 rounded-2xl border animate-pulse"
              style={{
                backgroundColor: designTokens.colors.glass,
                borderColor: designTokens.colors.glassBorder,
                borderRadius: designTokens.borderRadius.lg
              }}
              role="status"
              aria-label="Enhancing your prompt"
            >
              <div 
                className="h-4 w-24 rounded mb-4"
                style={{ backgroundColor: designTokens.colors.glass }}
              />
              <div 
                className="h-3 w-3/4 rounded mb-2"
                style={{ backgroundColor: designTokens.colors.glass }}
              />
              <div 
                className="h-3 w-2/3 rounded mb-2"
                style={{ backgroundColor: designTokens.colors.glass }}
              />
              <div 
                className="h-3 w-1/2 rounded"
                style={{ backgroundColor: designTokens.colors.glass }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat History with improved accessibility */}
        <AnimatePresence>
          {chatHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 space-y-6"
              role="region"
              aria-label="Recent enhancements"
            >
              <h3 
                className="text-xl font-semibold text-center mb-8"
                style={{ 
                  color: designTokens.colors.textPrimary,
                  fontSize: designTokens.typography.h3,
                  fontWeight: designTokens.typography.semibold
                }}
              >
                Recent Enhancements
              </h3>
              
              {chatHistory.slice(0, 3).map((message, index) => (
                <motion.article
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl p-6 max-w-4xl mx-auto"
                  style={{
                    backgroundColor: designTokens.colors.glass,
                    borderColor: designTokens.colors.glassBorder,
                    borderRadius: designTokens.borderRadius.lg,
                    border: `1px solid ${designTokens.colors.glassBorder}`
                  }}
                  role="article"
                  aria-labelledby={`message-${message.id}-title`}
                >
                  {/* Message Header */}
                  <header className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: message.mode === 'ideate' 
                            ? `linear-gradient(135deg, ${designTokens.colors.accentPurple}, ${designTokens.colors.brandGold})`
                            : `linear-gradient(135deg, ${designTokens.colors.accentCyan}, ${designTokens.colors.brandGold})`,
                          color: designTokens.colors.background
                        }}
                      >
                        {message.mode === 'ideate' ? '🪄 Ideate' : '🌊 Flow'}
                      </div>
                      <time 
                        className="text-sm"
                        style={{ color: designTokens.colors.textMuted }}
                        dateTime={message.timestamp}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </time>
                    </div>
                  </header>

                  {/* Input */}
                  <section className="mb-4">
                    <h4 
                      className="text-sm mb-2"
                      style={{ color: designTokens.colors.textMuted }}
                    >
                      Input:
                    </h4>
                    <div 
                      className="rounded-lg p-3 text-sm"
                      style={{
                        backgroundColor: designTokens.colors.panel,
                        color: designTokens.colors.textPrimary,
                        borderRadius: designTokens.borderRadius.md
                      }}
                    >
                      {message.input}
                    </div>
                  </section>

                  {/* Output with tabs */}
                  <section>
                    <h4 
                      className="text-sm mb-2"
                      style={{ color: designTokens.colors.textMuted }}
                    >
                      Enhanced Output:
                    </h4>
                    <div 
                      className="rounded-lg p-0 border"
                      style={{
                        backgroundColor: designTokens.colors.panel,
                        borderColor: designTokens.colors.glassBorder,
                        borderRadius: designTokens.borderRadius.md
                      }}
                    >
                      <div 
                        className="flex items-center gap-2 px-3 py-2 border-b text-xs"
                        style={{ borderColor: designTokens.colors.glassBorder }}
                        role="tablist"
                        aria-label="Output format tabs"
                      >
                        <button 
                          className="px-2 py-1 rounded text-white"
                          style={{ backgroundColor: designTokens.colors.glass }}
                          role="tab"
                          aria-selected="true"
                          aria-controls={`output-${message.id}-text`}
                        >
                          Text
                        </button>
                        <button 
                          className="px-2 py-1 rounded hover:text-white transition-colors"
                          style={{ color: designTokens.colors.textMuted }}
                          role="tab"
                          aria-selected="false"
                          aria-controls={`output-${message.id}-json`}
                        >
                          JSON
                        </button>
                      </div>
                      <div 
                        id={`output-${message.id}-text`}
                        className="p-4 text-sm leading-relaxed whitespace-pre-wrap"
                        style={{ 
                          color: designTokens.colors.textPrimary,
                          fontSize: designTokens.typography.body
                        }}
                        role="tabpanel"
                        aria-labelledby={`output-${message.id}-text-tab`}
                      >
                        {message.output}
                      </div>
                    </div>
                  </section>

                  {/* Actions */}
                  <footer className="flex items-center justify-end mt-4 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 text-sm rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{
                        color: designTokens.colors.textMuted,
                        backgroundColor: 'transparent',
                        borderRadius: designTokens.borderRadius.md,
                        focusRingColor: designTokens.colors.focusRing
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(message.output)
                        setAnnouncement('Output copied to clipboard')
                      }}
                      aria-label={`Copy output for ${message.mode} enhancement`}
                    >
                      Copy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 text-sm rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{
                        color: designTokens.colors.textMuted,
                        backgroundColor: 'transparent',
                        borderRadius: designTokens.borderRadius.md,
                        focusRingColor: designTokens.colors.focusRing
                      }}
                      onClick={() => {
                        setInput(message.input)
                        setAnnouncement('Input loaded for editing')
                      }}
                      aria-label={`Use "${message.input.substring(0, 30)}..." as new input`}
                    >
                      Use as new input
                    </motion.button>
                  </footer>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </AppShell>
    </div>
  )
}