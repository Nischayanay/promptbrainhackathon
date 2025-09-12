import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { DemoMode } from "./HowItWorks";

interface StepOutputProps {
  isActive: boolean;
  outputText: string;
  mode: DemoMode;
  isReplaying: boolean;
}

export function StepOutput({ isActive, outputText, mode, isReplaying }: StepOutputProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const lines = useMemo(() => outputText.split('\n').filter(line => line.trim()), [outputText]);

  // Staggered text reveal animation
  useEffect(() => {
    if (!isActive && !isReplaying) return;
    
    if (prefersReducedMotion) {
      setVisibleLines(lines);
      setIsRevealing(false);
      return;
    }

    setVisibleLines([]);
    setIsRevealing(true);
    
    lines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
        
        // Mark as complete when all lines are revealed
        if (index === lines.length - 1) {
          setTimeout(() => setIsRevealing(false), 200);
        }
      }, index * 150);
    });
  }, [isActive, outputText, isReplaying, prefersReducedMotion, lines]);

  // Reset when replaying
  useEffect(() => {
    if (isReplaying) {
      setVisibleLines([]);
      setIsRevealing(false);
    }
  }, [isReplaying]);

  const getModeIcon = () => {
    switch (mode) {
      case 'research':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'product':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
    }
  };

  const formatLine = (line: string, index: number) => {
    // Highlight different types of content
    if (line.includes(':')) {
      const [key, ...value] = line.split(':');
      return (
        <span>
          <span className="text-landing-blue font-medium">{key}:</span>
          <span className="text-landing-white/90">{value.join(':')}</span>
        </span>
      );
    }
    
    if (line.startsWith('•') || line.startsWith('-')) {
      return (
        <span className="text-landing-white/85">
          <span className="text-landing-blue mr-2">•</span>
          {line.replace(/^[•-]\s*/, '')}
        </span>
      );
    }
    
    if (line.match(/^\d+\./)) {
      return <span className="text-landing-white/90 font-medium">{line}</span>;
    }
    
    return <span className="text-landing-white/85">{line}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      {/* Step Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
            isActive 
              ? 'bg-gradient-to-r from-landing-blue to-cyan-400 text-landing-white shadow-lg shadow-landing-blue/50' 
              : 'bg-landing-white/20 text-landing-white/60'
          }`}>
            3
          </div>
          <h3 className="landing-theme text-xl font-semibold text-landing-white">
            The Clarity
          </h3>
        </div>
        <p className="text-landing-white/70 text-sm">
          Clarity emerges
        </p>
      </motion.div>

      {/* Output Container */}
      <motion.div
        className={`relative p-6 rounded-2xl border transition-all duration-500 ${
          isActive
            ? 'bg-gradient-to-br from-landing-blue/5 to-cyan-400/5 border-landing-blue/20 shadow-lg'
            : 'bg-landing-white/[0.01] border-landing-white/10'
        }`}
        style={{ minHeight: '300px', maxHeight: '400px' }}
      >
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs text-landing-white/50 font-mono flex items-center gap-2">
              {getModeIcon()}
              OUTPUT - {mode.toUpperCase()} MODE:
            </div>
          </div>
          
          {/* Enhancement Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0.5, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-landing-blue/20 border border-landing-blue/40 rounded-full text-xs text-landing-blue"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Enhanced
          </motion.div>
        </div>

        {/* Output Content */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '280px' }}>
          <AnimatePresence mode="wait">
            {visibleLines.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {visibleLines.map((line, index) => (
                  <motion.div
                    key={`${mode}-${index}`}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4,
                      delay: prefersReducedMotion ? 0 : index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="text-sm leading-relaxed"
                  >
                    {formatLine(line, index)}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading dots while revealing */}
          {isRevealing && (
            <motion.div
              className="flex items-center gap-1 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-landing-blue/60 rounded-full"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Success Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive && !isRevealing ? 1 : 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <div className="text-xs text-landing-white/40 mb-2 font-mono">
            IMPROVEMENTS:
          </div>
          <div className="flex flex-wrap gap-2">
            {['Specific context', 'Clear structure', 'Actionable format'].map((improvement, index) => (
              <motion.span
                key={improvement}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 + (index * 0.1) }}
                className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-300"
              >
                {improvement}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Glow Effect */}
        {isActive && !prefersReducedMotion && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-landing-blue/5 to-transparent blur-xl pointer-events-none" />
        )}
      </motion.div>

      {/* Success Particles */}
      {isActive && !isRevealing && !prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400/60 rounded-full"
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${25 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2.5 + (i * 0.3),
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}


    </motion.div>
  );
}