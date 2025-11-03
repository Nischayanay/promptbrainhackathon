import { useState, useEffect, useRef } from 'react';
import { Mic, ChevronDown, AudioWaveform, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from './PremiumToast';
import { EmptyState } from './EmptyState';
import { ParticleEffect } from './ParticleEffect';
import { SkeletonOutput } from './PremiumSkeleton';

// Spring animation config
const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30
};

const affirmations = [
  { message: "Refined brilliance unlocked!", type: 'brilliant' as const },
  { message: "Context expanded!", type: 'context' as const },
  { message: "Prompt optimized to perfection!", type: 'optimized' as const },
  { message: "Enhanced with precision!", type: 'enhanced' as const },
  { message: "Intelligence amplified!", type: 'brilliant' as const },
  { message: "Clarity achieved!", type: 'success' as const }
];

export function SearchInterface() {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Auto');
  const [isTyping, setIsTyping] = useState(false);
  const [isFirstUse, setIsFirstUse] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [magneticSend, setMagneticSend] = useState({ x: 0, y: 0 });
  const [showParticles, setShowParticles] = useState(false);
  const [particlePos, setParticlePos] = useState({ x: 0, y: 0 });
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  const dropdownOptions = ['Auto', 'Creative', 'Precise', 'Balanced'];

  // Check if first use
  useEffect(() => {
    const hasUsed = localStorage.getItem('promptbrain_used');
    if (hasUsed) {
      setIsFirstUse(false);
    }
  }, []);

  // Proactive validation on blur
  const handleBlur = () => {
    setIsFocused(false);
    
    if (value.trim().length > 0 && value.trim().length < 10) {
      setValidationMessage('💡 Try adding more detail for better results');
    } else if (value.trim().length > 1000) {
      setValidationMessage('⚠️ Prompt is quite long—consider breaking it into parts');
    } else {
      setValidationMessage('');
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
  };

  const handleSend = async () => {
    if (!value.trim()) {
      setValidationMessage('✍️ Please enter a prompt to enhance');
      return;
    }

    // Mark as used
    if (isFirstUse) {
      localStorage.setItem('promptbrain_used', 'true');
      setIsFirstUse(false);
    }

    setIsProcessing(true);
    setOutput('');
    setValidationMessage('');
    setHasInteracted(true);

    // Trigger particle effect at send button
    if (sendButtonRef.current) {
      const rect = sendButtonRef.current.getBoundingClientRect();
      setParticlePos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setShowParticles(true);
    }

    // Simulate API call - replace with your edge function
    setTimeout(() => {
      setOutput(`Processed result for: "${value}"\n\nThis is where your edge function output will appear. The input has been processed and here's the intelligent response based on your query.`);
      setIsProcessing(false);
      
      // Show random affirmation with premium toast
      const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      toast.success(affirmation.message, {
        description: 'Enhanced prompt generated',
        duration: 3000
      });
      
      setValue('');
      setCharCount(0);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Magnetic button effect
  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 6;
    const y = (e.clientY - rect.top - rect.height / 2) / 6;
    setMagneticSend({ x, y });
  };

  const handleMagneticLeave = () => {
    setMagneticSend({ x: 0, y: 0 });
  };

  return (
    <>
      {/* Particle Effect on Send */}
      {showParticles && (
        <ParticleEffect 
          x={particlePos.x} 
          y={particlePos.y}
          onComplete={() => setShowParticles(false)}
        />
      )}
      
      <div className="w-full max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {/* Search Input Area */}
      <div className="relative w-full" role="search">
        {/* Animated gradient glow on focus */}
        <motion.div 
          className="absolute inset-0 rounded-full opacity-0 blur-3xl"
          animate={{
            opacity: isFocused ? 1 : 0
          }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'radial-gradient(circle, rgba(0,217,255,0.3) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />
        
        <motion.div 
          className="relative flex items-center w-full premium-hover"
          style={{
            background: isFocused 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            backdropFilter: 'blur(var(--glass-blur)) saturate(180%)',
            border: `1.5px solid ${isFocused ? 'rgba(0,217,255,0.4)' : 'var(--glass-border)'}`,
            borderRadius: 'var(--radius-2xl)',
            minHeight: 'var(--spacing-8)',
            padding: 'var(--spacing-2) var(--spacing-4)',
            gap: 'var(--spacing-2)',
            boxShadow: isFocused 
              ? 'var(--shadow-cyan-lg), inset 0 1px 0 rgba(255,255,255,0.1)' 
              : 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.05)',
            transition: 'all var(--transition-base) var(--ease-out)'
          }}
          animate={{
            scale: isTyping ? 1.01 : 1
          }}
          transition={spring}
        >
          {/* Text Input */}
          <textarea
            id="prompt-input"
            placeholder="Engineer your perfect prompt..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setIsTyping(e.target.value.length > 0);
              setCharCount(e.target.value.length);
              setValidationMessage('');
            }}
            onFocus={() => {
              setIsFocused(true);
              setHasInteracted(true);
            }}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            rows={1}
            className={`
              flex-1 bg-transparent text-white outline-none resize-none max-h-32
              placeholder:transition-all
              ${isFocused ? 'placeholder:opacity-50 placeholder:translate-x-1' : 'placeholder:opacity-100'}
            `}
            style={{
              padding: 'var(--spacing-2) 0',
              color: 'var(--pb-white)',
              fontSize: 'var(--text-base)',
              minHeight: 'var(--min-touch-target)'
            }}
            aria-label="Prompt engineering input"
            aria-describedby="prompt-description prompt-validation"
            aria-invalid={validationMessage.includes('⚠️')}
          />
          <span id="prompt-description" className="sr-only">
            Enter your prompt to engineer better AI outputs. Press Enter to submit or use voice input.
          </span>
          {validationMessage && (
            <span id="prompt-validation" className="sr-only">
              {validationMessage}
            </span>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Mode Dropdown */}
            <div className="relative">
              <motion.button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center text-white/80 hover:text-white hover:bg-white/5 rounded-xl"
                style={{
                  gap: 'var(--spacing-1)',
                  padding: 'var(--spacing-1) var(--spacing-2)',
                  fontSize: 'var(--text-sm)',
                  minHeight: 'var(--min-touch-target)',
                  transition: 'all var(--transition-fast) var(--ease-out)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Mode: ${selectedMode}`}
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                <span>{selectedMode}</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  style={{ transition: 'transform var(--transition-base) var(--ease-out)' }}
                  aria-hidden="true"
                />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={spring}
                    className="absolute bottom-full right-0 w-36 glass-card overflow-hidden"
                    style={{ 
                      marginBottom: 'var(--spacing-2)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-2xl)'
                    }}
                    role="menu"
                    aria-label="Mode selection"
                  >
                    {dropdownOptions.map((option, index) => (
                      <motion.button
                        key={option}
                        onClick={() => {
                          setSelectedMode(option);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left text-white hover:bg-[#00D9FF]/10 hover:text-[#00D9FF] premium-hover"
                        style={{
                          padding: 'var(--spacing-2) var(--spacing-2-5)',
                          fontSize: 'var(--text-sm)',
                          minHeight: 'var(--min-touch-target)',
                          transition: 'all var(--transition-fast) var(--ease-out)'
                        }}
                        whileHover={{ x: 4 }}
                        transition={spring}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedMode(option);
                            setShowDropdown(false);
                          }
                        }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Send/Voice Button */}
            {value.trim() ? (
              <motion.button 
                ref={sendButtonRef}
                onClick={handleSend}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="flex-shrink-0 rounded-full bg-gradient-to-br from-[#00D9FF] via-[#0099FF] to-[#8B5CF6]
                         flex items-center justify-center relative overflow-hidden magnetic-button"
                style={{
                  width: 'var(--spacing-6)',
                  height: 'var(--spacing-6)',
                  minWidth: 'var(--min-touch-target)',
                  minHeight: 'var(--min-touch-target)',
                  boxShadow: 'var(--shadow-cyan-sm)'
                }}
                animate={{ 
                  x: magneticSend.x, 
                  y: magneticSend.y 
                }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: 'var(--shadow-cyan-md)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                aria-label="Enhance prompt"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
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
                <Send className="w-5 h-5 text-white relative z-10" aria-hidden="true" />
              </motion.button>
            ) : (
              <motion.button 
                onClick={handleVoiceInput}
                className={`
                  flex-shrink-0 rounded-full flex items-center justify-center 
                  ${isRecording ? 'bg-gradient-to-br from-[#00D9FF] to-[#8B5CF6]' : 'bg-white'}
                `}
                style={{
                  width: 'var(--spacing-6)',
                  height: 'var(--spacing-6)',
                  minWidth: 'var(--min-touch-target)',
                  minHeight: 'var(--min-touch-target)',
                  boxShadow: isRecording ? 'var(--shadow-cyan-md)' : 'var(--shadow-md)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
                transition={isRecording ? { duration: 1, repeat: Infinity } : spring}
                aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                aria-pressed={isRecording}
              >
                <AudioWaveform 
                  className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-black'}`} 
                  aria-hidden="true"
                />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Validation Message */}
        <AnimatePresence>
          {validationMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center text-white/70 mt-2"
              style={{
                fontSize: 'var(--text-sm)',
                gap: 'var(--spacing-1)',
                paddingLeft: 'var(--spacing-3)'
              }}
              role="alert"
              aria-live="polite"
            >
              <span>{validationMessage}</span>
              {charCount > 0 && (
                <span className="text-white/40 ml-auto">
                  {charCount} characters
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Output Display - Secondary Zone with Live Region */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        aria-label="Prompt processing results"
      >
        <AnimatePresence mode="wait">
          {/* First Use Empty State */}
          {isFirstUse && !hasInteracted && !isProcessing && !output && (
            <EmptyState 
              type="first-use" 
              onAction={() => {
                document.getElementById('prompt-input')?.focus();
              }}
            />
          )}

          {/* Empty Prompt State (after interaction) */}
          {!isFirstUse && hasInteracted && !value.trim() && !isProcessing && !output && (
            <EmptyState 
              type="empty-prompt" 
              onAction={() => {
                document.getElementById('prompt-input')?.focus();
              }}
            />
          )}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={spring}
            >
              <SkeletonOutput />
            </motion.div>
          )}

          {output && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={spring}
              className="w-full gradient-border"
              style={{
                padding: 'var(--spacing-5)',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                backdropFilter: 'blur(var(--glass-blur)) saturate(180%)',
                boxShadow: 'var(--shadow-cyan-md), var(--shadow-xl), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <motion.div 
                className="flex items-center mb-4"
                style={{ gap: 'var(--spacing-1)' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Sparkles className="w-5 h-5 text-[#00D9FF]" aria-hidden="true" />
                <span className="text-white/60" style={{ fontSize: 'var(--text-sm)' }}>
                  PromptBrain
                </span>
              </motion.div>
              <motion.p 
                className="text-white leading-relaxed whitespace-pre-wrap"
                style={{ fontSize: 'var(--text-base)', lineHeight: 1.6 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {output}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}
