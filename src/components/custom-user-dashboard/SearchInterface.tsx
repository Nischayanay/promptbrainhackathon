import { useState, useEffect, useRef } from 'react';
import { AudioWaveform, Send, Sparkles, Copy, ChevronDown, FileText, Code } from 'lucide-react';
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
  
  // Hybrid approach: Try Backend Brain first, then Gemini fallback
  const tryBackendBrain = async (prompt: string) => {
    try {
      console.log('🧠 Attempting Backend Brain enhancement...');
      const { createBackendBrainService } = await import('../../backend-brain/services/backend-brain-service');
      const backendBrainService = createBackendBrainService();
      const result = await backendBrainService.enhancePrompt(prompt);
      
      if (result.success && result.enhancedPrompt) {
        console.log('✅ Backend Brain success!');
        return {
          success: true,
          output: result.enhancedPrompt,
          metadata: `Quality Score: ${Math.round(result.qualityScore * 100)}% | Enhancement Ratio: ${result.metadata.enhancementRatio}x | Backend Brain Pipeline`
        };
      }
    } catch (error) {
      console.warn('⚠️ Backend Brain failed:', error);
    }
    return { success: false };
  };

  // Secure Gemini enhancement via server-side endpoint
  const enhanceWithGemini = async (prompt: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/gemini-enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          output: data.output,
          metadata: data.metadata
        };
      } else {
        throw new Error(data.error || 'Enhancement failed');
      }
    } catch (error) {
      console.error('❌ Secure Gemini enhancement failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [isFirstUse, setIsFirstUse] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [magneticSend, setMagneticSend] = useState({ x: 0, y: 0 });
  const [showParticles, setShowParticles] = useState(false);
  const [particlePos, setParticlePos] = useState({ x: 0, y: 0 });
  const [showCopyDropdown, setShowCopyDropdown] = useState(false);
  const sendButtonRef = useRef<HTMLButtonElement>(null);



  // Check if first use
  useEffect(() => {
    const hasUsed = localStorage.getItem('promptbrain_used');
    if (hasUsed) {
      setIsFirstUse(false);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCopyDropdown) {
        setShowCopyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCopyDropdown]);

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

    try {
      console.log('🧠 Starting hybrid enhancement process...');
      console.log('📝 Input prompt:', value);
      
      // Use only Gemini enhancement (Backend Brain disabled)
      console.log('🔄 Using Gemini enhancement...');
      const geminiResult = await enhanceWithGemini(value);
      
      let finalResult;
      if (geminiResult.success) {
        finalResult = geminiResult;
        console.log('✅ Using Gemini result');
      } else {
        console.error('❌ Gemini failed:', geminiResult.error);
        throw new Error(`Gemini enhancement failed: ${geminiResult.error}`);
      }
      
      console.log('🎯 Final result:', finalResult);
      
      // Clean formatted output
      setOutput(finalResult.output);
      setIsProcessing(false);
      
      // Show success affirmation
      const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      toast.success(affirmation.message, {
        description: 'Enhanced prompt generated successfully',
        duration: 3000
      });
      
      setValue('');
      setCharCount(0);
      setIsTyping(false);
      
    } catch (error) {
      console.error('❌ Complete enhancement failure:', error);
      setIsProcessing(false);
      setValidationMessage(`❌ Enhancement failed: ${error instanceof Error ? error.message : 'Please try again'}`);
      
      toast.error('Enhancement failed', {
        description: error instanceof Error ? error.message : 'Please try again',
        duration: 4000
      });
    }
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

  const handleCopy = async (format: 'english' | 'json') => {
    try {
      let textToCopy = '';
      
      if (format === 'english') {
        textToCopy = output;
      } else {
        // JSON format
        textToCopy = JSON.stringify({
          prompt: "Enhanced Prompt",
          content: output,
          timestamp: new Date().toISOString(),
          format: "PromptBrain Enhanced"
        }, null, 2);
      }
      
      await navigator.clipboard.writeText(textToCopy);
      
      // Show success toast
      toast.success(`Copied as ${format.toUpperCase()}!`, {
        description: 'Enhanced prompt copied to clipboard',
        duration: 2000
      });
      
      // Close dropdown
      setShowCopyDropdown(false);
      
      // Reset to original state
      setTimeout(() => {
        setOutput('');
        setValue('');
        setCharCount(0);
        setIsTyping(false);
        setHasInteracted(false);
        
        // Focus back to input
        const textarea = document.getElementById('prompt-input') as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
        }
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to copy', {
        description: 'Please try again',
        duration: 2000
      });
    }
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
            transition: 'all var(--transition-base) var(--ease-out)',
            pointerEvents: 'auto'
          }}
          animate={{
            scale: isTyping ? 1.01 : 1
          }}
          transition={spring}
          onClick={() => {
            const textarea = document.getElementById('prompt-input') as HTMLTextAreaElement;
            if (textarea) {
              textarea.focus();
            }
          }}
        >
          {/* Text Input */}
          <textarea
            id="prompt-input"
            placeholder="Engineer your perfect prompt..."
            value={value}
            onChange={(e) => {
              console.log('⌨️ Input changed:', e.target.value);
              const inputValue = e.target.value;
              if (inputValue.length <= 2000) {
                setValue(inputValue);
                setIsTyping(inputValue.length > 0);
                setCharCount(inputValue.length);
                setValidationMessage('');
              } else {
                setValidationMessage('⚠️ Maximum 2000 characters allowed');
              }
            }}
            onFocus={() => {
              console.log('🎯 Input focused');
              setIsFocused(true);
              setHasInteracted(true);
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.currentTarget.focus();
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
              padding: 'var(--spacing-2, 8px) 0',
              color: 'var(--pb-white, #ffffff)',
              fontSize: 'var(--text-base, 16px)',
              minHeight: 'var(--min-touch-target, 44px)',
              background: 'transparent',
              border: 'none',
              width: '100%',
              pointerEvents: 'auto',
              zIndex: 10
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
                className="flex items-center justify-between mb-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="flex items-center" style={{ gap: 'var(--spacing-1)' }}>
                  <Sparkles className="w-5 h-5 text-[#00D9FF]" aria-hidden="true" />
                  <span className="text-white/60" style={{ fontSize: 'var(--text-sm)' }}>
                    PromptBrain
                  </span>
                </div>
                
                {/* Copy Dropdown Button */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowCopyDropdown(!showCopyDropdown)}
                    className="group relative flex items-center gap-3 px-6 py-3 rounded-2xl text-white font-bold overflow-hidden transition-all duration-300"
                    style={{
                      background: showCopyDropdown 
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)' 
                        : 'linear-gradient(135deg, #10B981 0%, #059669 30%, #06B6D4 70%, #0891B2 100%)',
                      fontSize: '15px',
                      fontFamily: 'SF Pro Display, Inter, system-ui, sans-serif',
                      fontWeight: '600',
                      letterSpacing: '0.025em',
                      boxShadow: showCopyDropdown 
                        ? '0 12px 35px rgba(16,185,129,0.4), 0 0 25px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.2)' 
                        : '0 8px 25px rgba(16,185,129,0.3), 0 0 15px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                    whileHover={{ 
                      scale: 1.08,
                      boxShadow: '0 15px 40px rgba(16,185,129,0.5), 0 0 30px rgba(6,182,212,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
                      y: -2
                    }}
                    whileTap={{ 
                      scale: 0.96,
                      y: 0
                    }}
                  >
                    {/* Animated background shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      style={{ width: '100%', height: '100%' }}
                    />
                    
                    {/* Copy icon with micro-animation */}
                    <motion.div
                      animate={showCopyDropdown ? { rotate: 5 } : { rotate: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Copy className="w-5 h-5 relative z-10" />
                    </motion.div>
                    
                    {/* Text with better spacing */}
                    <span className="relative z-10">Copy</span>
                    
                    {/* Chevron with enhanced animation */}
                    <motion.div
                      animate={{ 
                        rotate: showCopyDropdown ? 180 : 0,
                        scale: showCopyDropdown ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="relative z-10"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                    
                    {/* Pulse effect on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)'
                      }}
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0, 0.3, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.button>
                  
                  {/* Dropdown Menu - Enhanced Visibility */}
                  <AnimatePresence>
                    {showCopyDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 rounded-xl shadow-2xl z-[9999]"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(15,25,35,0.95) 100%)',
                          backdropFilter: 'blur(25px) saturate(200%)',
                          border: '1px solid rgba(16,185,129,0.4)',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 30px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                        }}
                      >
                        <div className="p-3">
                          <button
                            onClick={() => handleCopy('english')}
                            className="w-full flex items-center gap-4 px-4 py-4 text-left text-white hover:bg-gradient-to-r hover:from-[#10B981]/15 hover:to-[#059669]/10 rounded-xl transition-all duration-200 group hover:scale-[1.02]"
                            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', fontWeight: '500' }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/30 flex items-center justify-center group-hover:from-[#10B981]/30 group-hover:to-[#059669]/40 transition-all duration-200 group-hover:scale-110">
                              <FileText className="w-5 h-5 text-[#10B981]" />
                            </div>
                            <div>
                              <div className="text-white font-medium">Copy as Text</div>
                              <div className="text-white/60 text-xs">Plain enhanced prompt</div>
                            </div>
                          </button>
                          
                          <div className="my-2 h-px bg-white/10"></div>
                          
                          <button
                            onClick={() => handleCopy('json')}
                            className="w-full flex items-center gap-4 px-4 py-4 text-left text-white hover:bg-gradient-to-r hover:from-[#06B6D4]/15 hover:to-[#0891B2]/10 rounded-xl transition-all duration-200 group hover:scale-[1.02]"
                            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', fontWeight: '500' }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4]/20 to-[#0891B2]/30 flex items-center justify-center group-hover:from-[#06B6D4]/30 group-hover:to-[#0891B2]/40 transition-all duration-200 group-hover:scale-110">
                              <Code className="w-5 h-5 text-[#06B6D4]" />
                            </div>
                            <div>
                              <div className="text-white font-medium">Copy as JSON</div>
                              <div className="text-white/60 text-xs">Structured format</div>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
