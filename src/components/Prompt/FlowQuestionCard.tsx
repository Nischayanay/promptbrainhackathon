import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  SkipForward, 
  HelpCircle,
  X
} from 'lucide-react'

export interface FlowQuestion {
  id: string
  question: string
  placeholder: string
  category: string
  optional?: boolean
  example?: string
}

interface FlowQuestionCardProps {
  question: FlowQuestion
  currentStep: number
  totalSteps: number
  answer: string
  onAnswerChange: (answer: string) => void
  onNext: () => void
  onPrevious?: () => void
  onSkip?: () => void
  isLastQuestion?: boolean
  className?: string
}

interface FlowContextChipProps {
  answers: string[]
  questions: FlowQuestion[]
  currentStep: number
  onEditAnswer: (stepIndex: number) => void
}

// Default flow questions
export const defaultFlowQuestions: FlowQuestion[] = [
  {
    id: 'what',
    question: 'What is the core task or goal of your prompt?',
    placeholder: 'Describe what you want to accomplish...',
    category: 'What',
    example: 'Create compelling product descriptions for an e-commerce store'
  },
  {
    id: 'who',
    question: 'Who is the audience or target for this output?',
    placeholder: 'Who will use or see this output?...',
    category: 'Who',
    example: 'Marketing team and potential customers browsing our online store'
  },
  {
    id: 'why',
    question: 'Why do you need this prompt? What\'s the context?',
    placeholder: 'Explain the background or situation...',
    category: 'Why',
    example: 'We need to improve conversion rates and make products more appealing'
  },
  {
    id: 'format',
    question: 'What format or tone should the output have?',
    placeholder: 'Formal, casual, technical, creative, etc...',
    category: 'Format',
    example: 'Professional yet approachable, highlighting key benefits and features'
  },
  {
    id: 'constraints',
    question: 'Are there any constraints (length, style, exclusions)?',
    placeholder: 'Any limitations or requirements...',
    category: 'Constraints',
    example: 'Keep descriptions under 150 words, avoid technical jargon'
  },
  {
    id: 'example',
    question: 'Provide a small example if you have one (optional)',
    placeholder: 'Share an example to guide the output...',
    category: 'Example',
    optional: true,
    example: 'Like our current best-selling product description format'
  }
]

export function FlowQuestionCard({
  question,
  currentStep,
  totalSteps,
  answer,
  onAnswerChange,
  onNext,
  onPrevious,
  onSkip,
  isLastQuestion = false,
  className = ''
}: FlowQuestionCardProps) {
  const [showExample, setShowExample] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const canProceed = answer.trim().length >= 3 || question.optional
  const progress = ((currentStep + 1) / totalSteps) * 100

  // Typing indicator
  useEffect(() => {
    if (answer.length > 0) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [answer])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canProceed) {
      e.preventDefault()
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.2, 0.9, 0.2, 1] 
      }}
      className={`
        w-full max-w-3xl mx-auto mb-6
        ${className}
      `}
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">
            Question {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm text-text-muted">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="w-full h-1 bg-glass rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel rounded-2xl border border-glass-border overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-glass-border/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-semibold rounded-full">
                  {question.category}
                </div>
                {question.optional && (
                  <div className="px-2 py-1 bg-glass text-text-muted text-xs rounded-full">
                    Optional
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-text-primary leading-relaxed">
                {question.question}
              </h3>
            </div>

            {/* Example toggle */}
            {question.example && (
              <motion.button
                onClick={() => setShowExample(!showExample)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  p-2 text-text-muted hover:text-text-primary rounded-lg 
                  hover:bg-glass transition-all duration-150 premium-focus
                "
                title="Show example"
              >
                <HelpCircle className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Example */}
          <AnimatePresence>
            {showExample && question.example && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-glass rounded-lg border border-glass-border"
              >
                <div className="text-sm text-text-muted mb-1">Example:</div>
                <div className="text-sm text-text-primary italic">
                  "{question.example}"
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-6">
          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={question.placeholder}
              className="
                w-full bg-transparent text-text-primary placeholder-text-muted/60
                text-base leading-relaxed resize-none focus:outline-none
                min-h-[100px] max-h-[200px] font-body
              "
              style={{ 
                fontSize: '16px',
                lineHeight: '1.6'
              }}
            />

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-2 right-2 flex space-x-1"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-1 h-1 bg-cyan-400 rounded-full"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Character count */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-text-muted">
              {answer.length} characters
            </div>
            
            {!canProceed && (
              <div className="text-xs text-yellow-400">
                Need at least 3 characters to continue
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-glass-border/50">
          {/* Previous Button */}
          <div>
            {onPrevious && currentStep > 0 && (
              <motion.button
                onClick={onPrevious}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  flex items-center space-x-2 px-4 py-2 text-text-muted 
                  hover:text-text-primary rounded-lg hover:bg-glass 
                  transition-all duration-150 premium-focus
                "
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </motion.button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Skip Button (for optional questions) */}
            {question.optional && onSkip && (
              <motion.button
                onClick={onSkip}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  flex items-center space-x-2 px-4 py-2 text-text-muted 
                  hover:text-text-primary rounded-lg hover:bg-glass 
                  transition-all duration-150 premium-focus
                "
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip</span>
              </motion.button>
            )}

            {/* Next/Complete Button */}
            <motion.button
              onClick={onNext}
              disabled={!canProceed}
              whileHover={canProceed ? { scale: 1.02 } : undefined}
              whileTap={canProceed ? { scale: 0.98 } : undefined}
              className={`
                flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold
                transition-all duration-200 premium-focus min-w-[120px] justify-center
                ${canProceed
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg hover:shadow-xl' 
                  : 'bg-glass text-text-muted cursor-not-allowed'
                }
              `}
            >
              {isLastQuestion ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Complete</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Context chips showing accumulated answers
export function FlowContextChips({
  answers,
  questions,
  currentStep,
  onEditAnswer
}: FlowContextChipProps) {
  if (answers.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="text-sm text-text-muted mb-3">Context so far:</div>
      <div className="flex flex-wrap gap-2">
        {answers.map((answer, index) => {
          if (!answer || answer === '[Skipped]') return null
          
          const question = questions[index]
          const isCurrentStep = index === currentStep
          
          return (
            <motion.button
              key={index}
              onClick={() => onEditAnswer(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                group relative px-3 py-2 rounded-lg text-sm
                glass-panel border transition-all duration-200
                ${isCurrentStep 
                  ? 'border-cyan-400/50 bg-cyan-400/10' 
                  : 'border-glass-border hover:border-brand-gold/30'
                }
                premium-focus
              `}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs text-text-muted font-medium">
                  {question?.category || 'Unknown'}:
                </span>
                <span className="text-text-primary truncate max-w-[200px]">
                  {typeof answer === 'string' && answer.length > 50 ? `${answer.slice(0, 50)}...` : String(answer || '')}
                </span>
              </div>
              
              {/* Edit indicator */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}