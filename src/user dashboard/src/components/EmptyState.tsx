import { motion } from 'motion/react';
import { Sparkles, Zap, Brain, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type: 'first-use' | 'empty-prompt' | 'no-credits' | 'error';
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const states = {
    'first-use': {
      icon: Zap,
      headline: "Let's get your first enhanced prompt ⚡",
      description: "Type anything you'd like to improve—a question, instruction, or creative idea.",
      subtext: "We'll transform it into a powerful, context-rich prompt.",
      cta: "Try your first idea",
      iconColor: '#00D9FF',
      gradient: 'from-[#00D9FF]/20 to-[#0099FF]/10'
    },
    'empty-prompt': {
      icon: Brain,
      headline: "Your brain is ready to optimize 🧠",
      description: "Start typing to see the magic happen.",
      subtext: "Every prompt you create gets 10X better with PromptBrain.",
      cta: "Start enhancing",
      iconColor: '#00D9FF',
      gradient: 'from-[#00D9FF]/20 to-transparent'
    },
    'no-credits': {
      icon: AlertCircle,
      headline: "Daily credits refreshing at midnight 🕛",
      description: "You've used all your credits for today.",
      subtext: "Your balance will reset automatically, or upgrade for unlimited access.",
      cta: "Get more credits",
      iconColor: '#FF006E',
      gradient: 'from-[#FF006E]/20 to-transparent'
    },
    'error': {
      icon: AlertCircle,
      headline: "Something went sideways 🔄",
      description: "We couldn't process that request.",
      subtext: "Please try again, or contact support if the issue persists.",
      cta: "Try again",
      iconColor: '#FF006E',
      gradient: 'from-[#FF006E]/20 to-transparent'
    }
  };

  const state = states[type];
  const Icon = state.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full backdrop-blur-xl border border-white/10 rounded-2xl bg-gradient-to-br ${state.gradient}`}
      style={{
        padding: 'var(--spacing-6)',
        background: 'var(--pb-near-black)',
      }}
    >
      <div className="flex flex-col items-center text-center" style={{ gap: 'var(--spacing-4)' }}>
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 20px ${state.iconColor}40`,
                `0 0 40px ${state.iconColor}60`,
                `0 0 20px ${state.iconColor}40`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
            style={{
              width: 'var(--spacing-10)',
              height: 'var(--spacing-10)'
            }}
          >
            <Icon 
              className="w-10 h-10" 
              style={{ color: state.iconColor }}
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <div className="flex flex-col" style={{ gap: 'var(--spacing-2)' }}>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-white"
            style={{ fontSize: 'var(--text-2xl)', lineHeight: 1.3 }}
          >
            {state.headline}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-white/70"
            style={{ fontSize: 'var(--text-base)', lineHeight: 1.6 }}
          >
            {state.description}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-white/50"
            style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5 }}
          >
            {state.subtext}
          </motion.p>
        </div>

        {/* CTA Button */}
        {onAction && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            onClick={onAction}
            className="relative overflow-hidden bg-gradient-to-r from-[#00D9FF] to-[#0099FF] text-white rounded-full"
            style={{
              padding: 'var(--spacing-2) var(--spacing-4)',
              fontSize: 'var(--text-base)',
              minHeight: 'var(--min-touch-target)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={state.cta}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
            <span className="relative z-10">{state.cta}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
