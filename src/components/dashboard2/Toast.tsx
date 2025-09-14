import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, X } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', isVisible, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-green-400" />
      case 'error':
        return <X className="w-4 h-4 text-red-400" />
      default:
        return <Copy className="w-4 h-4 text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/80 border-green-500/20'
      case 'error':
        return 'bg-red-900/80 border-red-500/20'
      default:
        return 'bg-[#1A1A1A]/80 border-[#FFD95A]/20'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.2, ease: [0.2, 0.9, 0.2, 1] }}
          className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg border backdrop-blur-md ${getBgColor()}`}
        >
          {getIcon()}
          <span className="text-white text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}