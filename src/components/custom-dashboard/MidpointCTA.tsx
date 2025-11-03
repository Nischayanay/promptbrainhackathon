import { motion } from 'motion/react';
import { Zap, TrendingUp } from 'lucide-react';

interface MidpointCTAProps {
  onAction: () => void;
}

export function MidpointCTA({ onAction }: MidpointCTAProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto"
      style={{
        padding: 'var(--spacing-8) var(--spacing-4)',
        marginTop: 'var(--spacing-10)',
        marginBottom: 'var(--spacing-10)'
      }}
    >
      <div 
        className="relative overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border border-[#00D9FF]/30 rounded-3xl"
        style={{ padding: 'var(--spacing-8)' }}
      >
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00D9FF] opacity-20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#0099FF] opacity-20 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center text-center" style={{ gap: 'var(--spacing-4)' }}>
          {/* Icon */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#0099FF] flex items-center justify-center shadow-[0_0_40px_rgba(0,217,255,0.5)]"
          >
            <TrendingUp className="w-8 h-8 text-white" aria-hidden="true" />
          </motion.div>

          {/* Heading */}
          <div className="flex flex-col" style={{ gap: 'var(--spacing-2)' }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-white"
              style={{ 
                fontSize: 'var(--text-3xl)',
                lineHeight: 1.2,
                fontFamily: "'Instrument Serif', serif"
              }}
            >
              Ready to 10X your prompts?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white/70"
              style={{ 
                fontSize: 'var(--text-base)',
                lineHeight: 1.6,
                maxWidth: '600px'
              }}
            >
              Transform basic instructions into powerful, context-rich prompts that deliver exceptional results. 
              No expertise required—just your ideas.
            </motion.p>
          </div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={onAction}
            className="relative overflow-hidden bg-gradient-to-r from-[#00D9FF] to-[#0099FF] text-white rounded-full"
            style={{
              padding: 'var(--spacing-3) var(--spacing-6)',
              fontSize: 'var(--text-lg)',
              minHeight: 'var(--min-touch-target)',
              marginTop: 'var(--spacing-2)'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 40px rgba(0,217,255,0.6)'
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to enhance section"
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

            <span className="relative z-10 flex items-center" style={{ gap: 'var(--spacing-2)' }}>
              <Zap className="w-5 h-5" aria-hidden="true" />
              Enhance Now
            </span>
          </motion.button>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center flex-wrap"
            style={{ 
              gap: 'var(--spacing-6)',
              marginTop: 'var(--spacing-4)',
              paddingTop: 'var(--spacing-4)',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="text-center">
              <div className="text-[#00D9FF]" style={{ fontSize: 'var(--text-2xl)' }}>10X</div>
              <div className="text-white/60" style={{ fontSize: 'var(--text-xs)' }}>Better Outputs</div>
            </div>
            <div className="text-center">
              <div className="text-[#00D9FF]" style={{ fontSize: 'var(--text-2xl)' }}>⚡</div>
              <div className="text-white/60" style={{ fontSize: 'var(--text-xs)' }}>Instant Results</div>
            </div>
            <div className="text-center">
              <div className="text-[#00D9FF]" style={{ fontSize: 'var(--text-2xl)' }}>∞</div>
              <div className="text-white/60" style={{ fontSize: 'var(--text-xs)' }}>Possibilities</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
