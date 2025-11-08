import { forwardRef, ReactNode } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'

interface EnhancedButtonProps extends Omit<MotionProps, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'auth'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  satisfying?: boolean // Enable extra satisfying animations
}

const buttonVariants = {
  primary: 'bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
  ghost: 'text-white hover:bg-white/10',
  auth: 'bg-white text-black hover:bg-gray-50 shadow-md hover:shadow-lg'
}

const sizeVariants = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    disabled = false,
    satisfying = false,
    className,
    onClick,
    type = 'button',
    ...motionProps 
  }, ref) => {
    
    const handleClick = () => {
      if (disabled || isLoading) return
      
      // Haptic feedback on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }
      
      onClick?.()
    }

    const baseAnimations = {
      whileHover: { 
        scale: 1.02,
        y: -1,
        transition: { duration: 0.15, ease: 'easeOut' }
      },
      whileTap: { 
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1, ease: 'easeInOut' }
      }
    }

    const satisfyingAnimations = satisfying ? {
      whileHover: { 
        scale: 1.05,
        y: -2,
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        transition: { duration: 0.2, ease: 'easeOut' }
      },
      whileTap: { 
        scale: 0.95,
        y: 1,
        transition: { duration: 0.1, ease: 'easeInOut' }
      }
    } : baseAnimations

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={cn(
          'relative overflow-hidden rounded-lg font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        {...satisfyingAnimations}
        {...motionProps}
      >
        {/* Shimmer effect for primary buttons */}
        {variant === 'primary' && !disabled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ width: '100%', height: '100%' }}
          />
        )}

        {/* Loading spinner */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-inherit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}

        {/* Button content */}
        <motion.span
          className={cn(
            'relative z-10 flex items-center justify-center gap-2',
            isLoading && 'opacity-0'
          )}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>

        {/* Ripple effect on click */}
        {satisfying && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </motion.button>
    )
  }
)

EnhancedButton.displayName = 'EnhancedButton'