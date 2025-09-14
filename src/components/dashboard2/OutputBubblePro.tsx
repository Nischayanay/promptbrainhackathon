import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, MoreHorizontal, Sparkles, Waves } from 'lucide-react'
import { Button } from '../ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu'

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

interface OutputBubbleProProps {
  message: ChatMessage
  index: number
  onCopy?: (message: string, format: OutputFormat) => void
}

export function OutputBubblePro({ message, index, onCopy }: OutputBubbleProProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (format: OutputFormat = 'english') => {
    try {
      let textToCopy = message.output
      
      if (format === 'json') {
        textToCopy = JSON.stringify({
          mode: message.mode,
          input: message.input,
          output: message.output,
          timestamp: message.timestamp,
          title: message.title
        }, null, 2)
      }
      
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      onCopy?.(textToCopy, format)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getModeIcon = (mode: Mode) => {
    return mode === 'ideate' ? Sparkles : Waves
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.1 
      }}
      className="group relative"
    >
      {/* User Message */}
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-white/10 rounded-2xl rounded-tr-md px-4 py-3 border border-white/10">
          <p className="text-white text-sm leading-relaxed">{message.input}</p>
        </div>
      </div>

      {/* AI Response */}
      <div className="flex items-start space-x-3 mb-6">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center">
          <span className="text-black font-bold text-xs">P</span>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-white">PromptBrain</span>
              <div className="flex items-center space-x-1 px-2 py-0.5 bg-white/5 rounded-full">
                {(() => {
                  const Icon = getModeIcon(message.mode)
                  return <Icon className="w-3 h-3 text-white/60" />
                })()}
                <span className="text-xs text-white/60 capitalize">{message.mode}</span>
              </div>
              <span className="text-xs text-white/40">{formatTimestamp(message.timestamp)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard()}
                className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/10"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/10"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-[#1a1a1a] border-white/10"
                >
                  <DropdownMenuItem
                    onClick={() => copyToClipboard('english')}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Copy as text
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => copyToClipboard('json')}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Copy as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                    Regenerate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                    Save to library
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
              {message.output}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}