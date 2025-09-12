import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface StepInputProps {
  isActive: boolean;
  inputText: string;
  isReplaying: boolean;
}

export function StepInput({ isActive, inputText, isReplaying }: StepInputProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (!isActive && !isReplaying) return;
    if (prefersReducedMotion) {
      setDisplayedText(inputText);
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);
    let currentIndex = 0;

    intervalRef.current = setInterval(() => {
      if (currentIndex <= inputText.length) {
        setDisplayedText(inputText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 80);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, inputText, isReplaying, prefersReducedMotion]);

  // Cursor blinking effect
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, [prefersReducedMotion]);

  // Reset when replaying
  useEffect(() => {
    if (isReplaying) {
      setDisplayedText("");
      setIsTyping(false);
    }
  }, [isReplaying]);

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
              ? 'bg-landing-white text-landing-black' 
              : 'bg-landing-white/20 text-landing-white/60'
          }`}>
            1
          </div>
          <h3 className="landing-theme text-xl font-semibold text-landing-white">
            The Chaos
          </h3>
        </div>
        <p className="text-landing-white/70 text-sm">
          It starts with chaos
        </p>
      </motion.div>

      {/* Input Container */}
      <motion.div
        className={`relative p-6 rounded-2xl border transition-all duration-500 ${
          isActive
            ? 'bg-landing-white/[0.02] border-landing-white/20 shadow-lg'
            : 'bg-landing-white/[0.01] border-landing-white/10'
        }`}
        animate={{
          borderColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Input Field Simulation */}
        <div className="mb-4">
          <div className="text-xs text-landing-white/50 mb-2 font-mono">
            INPUT:
          </div>
          <div 
            className={`min-h-[80px] p-4 bg-landing-white/[0.03] border border-landing-white/10 rounded-lg font-mono text-sm transition-all duration-300 ${
              isActive ? 'border-landing-white/20' : ''
            }`}
          >
            <span className="text-landing-white/80">
              {displayedText}
            </span>
            <AnimatePresence>
              {(isTyping || showCursor) && (
                <motion.span
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-landing-white/60"
                >
                  |
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chaos Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0.5 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <div className="text-xs text-landing-white/40 mb-2">
            ISSUES DETECTED:
          </div>
          <div className="flex flex-wrap gap-2">
            {['Too vague', 'No context', 'Unclear goal'].map((issue, index) => (
              <motion.span
                key={issue}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isActive ? 1 : 0.5, scale: 1 }}
                transition={{ delay: 1 + (index * 0.1) }}
                className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300"
              >
                {issue}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Glitch Effect */}
        {isActive && !prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute inset-0 bg-red-500/5 rounded-2xl"
              animate={{
                opacity: [0, 0.1, 0],
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          </div>
        )}
      </motion.div>

      {/* Chaos Particles */}
      {isActive && !prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-400/40 rounded-full"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                x: [0, Math.random() * 20 - 10, 0],
                y: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + (i * 0.3),
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