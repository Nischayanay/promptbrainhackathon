import { motion } from 'motion/react';
import { Sparkles, Brain, Zap, CheckCircle, TrendingUp } from 'lucide-react';

interface AffirmativeToastProps {
  message: string;
  type?: 'success' | 'brilliant' | 'context' | 'optimized' | 'enhanced';
}

export function AffirmativeToast({ message, type = 'success' }: AffirmativeToastProps) {
  const configs = {
    success: {
      icon: CheckCircle,
      gradient: 'from-[#00D9FF] to-[#0099FF]',
      emojiBefore: '✨',
      emojiAfter: ''
    },
    brilliant: {
      icon: Sparkles,
      gradient: 'from-[#00D9FF] to-[#4DFFFF]',
      emojiBefore: '✨',
      emojiAfter: '✨'
    },
    context: {
      icon: Brain,
      gradient: 'from-[#0099FF] to-[#00D9FF]',
      emojiBefore: '🧠',
      emojiAfter: ''
    },
    optimized: {
      icon: TrendingUp,
      gradient: 'from-[#00D9FF] to-[#00FF88]',
      emojiBefore: '📈',
      emojiAfter: ''
    },
    enhanced: {
      icon: Zap,
      gradient: 'from-[#FFD700] to-[#00D9FF]',
      emojiBefore: '⚡',
      emojiAfter: ''
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 25
      }}
      className={`flex items-center bg-gradient-to-r ${config.gradient} text-white rounded-2xl shadow-2xl`}
      style={{
        padding: 'var(--spacing-2) var(--spacing-3)',
        gap: 'var(--spacing-2)',
        minWidth: '280px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      {/* Icon with pulse */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 1.5,
          times: [0, 0.5, 1],
          ease: 'easeInOut'
        }}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </motion.div>

      {/* Message */}
      <div className="flex-1" style={{ fontSize: 'var(--text-sm)' }}>
        {config.emojiBefore && <span className="mr-1">{config.emojiBefore}</span>}
        <span>{message}</span>
        {config.emojiAfter && <span className="ml-1">{config.emojiAfter}</span>}
      </div>

      {/* Sparkle particles */}
      <motion.div
        className="absolute -top-1 -right-1"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ 
          scale: [0, 1, 0],
          rotate: [0, 180, 360],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 1,
          times: [0, 0.5, 1]
        }}
      >
        <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
}
