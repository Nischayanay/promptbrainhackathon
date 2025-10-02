import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Copy, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  User, 
  Bot,
  Check,
  Sparkles,
  Waves
} from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip'

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  mode: 'ideate' | 'flow'
  metadata?: {
    quality_score?: number
    enhancement_ratio?: number
    processing_time?: number
    title?: string
  }
}

interface ChatThreadProps {
  messages: ChatMessage[]
  isLoading?: boolean
  onMessageAction?: (messageId: string, action: 'copy' | 'reuse' | 'regenerate' | 'rate') => void
  onRateMessage?: (messageId: string, rating: 'up' | 'down') => void
  className?: string
}

interface MessageBubbleProps {
  message: ChatMessage
  onAction?: (action: 'copy' | 'reuse' | 'regenerate') => void
  onRate?: (rating: 'up' | 'down') => void
}

function MessageBubble({ message, onAction, onRate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [rating, setRating] = useState<'up' | 'down' | null>(null)

  const isUser = message.type === 'user'
  const modeIcon = message.mode === 'ideate' ? Sparkles : Waves
  const ModeIcon = modeIcon

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      onAction?.('copy')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleRate = (newRating: 'up' | 'down') => {
    setRating(newRating)
    onRate?.(newRating)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
      className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-yellow-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-black" />
        </div>
      )}

      {/* Message Content */}
      <div className={`
        max-w-[80%] min-w-[200px]
        ${isUser ? 'order-first' : ''}
      `}>
        {/* Message Header */}
        <div className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            {!isUser && <ModeIcon className="w-3 h-3" />}
            <span>{isUser ? 'You' : 'PromptBrain'}</span>
            {message.metadata?.title && !isUser && (
              <>
                <span>•</span>
                <span className="text-brand-gold">{message.metadata.title}</span>
              </>
            )}
          </div>
          <time className="text-xs text-text-muted">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </time>
        </div>

        {/* Message Bubble */}
        <div className={`
          rounded-2xl px-4 py-3 relative
          ${isUser 
            ? 'bg-brand-gold text-black ml-auto' 
            : 'bg-glass border border-glass-border text-text-primary'
          }
        `}>
          {/* Message Content */}
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>

          {/* Enhancement Metadata */}
          {!isUser && message.metadata && (
            <div className="mt-3 pt-3 border-t border-glass-border/50">
              <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                {message.metadata.quality_score && (
                  <div className="flex items-center gap-1">
                    <span>Quality:</span>
                    <span className="text-green-400">
                      {(message.metadata.quality_score * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
                {message.metadata.enhancement_ratio && (
                  <div className="flex items-center gap-1">
                    <span>Enhancement:</span>
                    <span className="text-blue-400">
                      {message.metadata.enhancement_ratio.toFixed(1)}x
                    </span>
                  </div>
                )}
                {message.metadata.processing_time && (
                  <div className="flex items-center gap-1">
                    <span>Time:</span>
                    <span>{message.metadata.processing_time}ms</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Message Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2 text-text-muted hover:text-text-primary"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Copied!' : 'Copy message'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAction?.('reuse')}
                  className="h-8 px-2 text-text-muted hover:text-text-primary"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use as new input</p>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-1 ml-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRate('up')}
                    className={`h-8 px-2 ${
                      rating === 'up' 
                        ? 'text-green-400 bg-green-400/10' 
                        : 'text-text-muted hover:text-green-400'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Good response</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRate('down')}
                    className={`h-8 px-2 ${
                      rating === 'down' 
                        ? 'text-red-400 bg-red-400/10' 
                        : 'text-text-muted hover:text-red-400'
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Poor response</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-glass-border flex items-center justify-center">
          <User className="w-4 h-4 text-text-primary" />
        </div>
      )}
    </motion.div>
  )
}

function LoadingMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 justify-start"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-yellow-500 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Bot className="w-4 h-4 text-black" />
        </motion.div>
      </div>

      {/* Loading Bubble */}
      <div className="max-w-[80%] min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-text-muted">PromptBrain is thinking...</span>
        </div>
        
        <div className="bg-glass border border-glass-border rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-text-muted rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-text-muted">Enhancing your prompt...</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ChatThread({ 
  messages, 
  isLoading = false, 
  onMessageAction,
  onRateMessage,
  className = '' 
}: ChatThreadProps) {
  const handleMessageAction = (messageId: string, action: 'copy' | 'reuse' | 'regenerate') => {
    onMessageAction?.(messageId, action)
  }

  const handleRateMessage = (messageId: string, rating: 'up' | 'down') => {
    onRateMessage?.(messageId, rating)
  }

  if (messages.length === 0 && !isLoading) {
    return null
  }

  return (
    <TooltipProvider>
      <div className={`chat-thread space-y-6 ${className}`}>
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onAction={(action) => handleMessageAction(message.id, action)}
            onRate={(rating) => handleRateMessage(message.id, rating)}
          />
        ))}
        
        {isLoading && <LoadingMessage key="loading" />}
      </AnimatePresence>
    </div>
    </TooltipProvider>
  )
}