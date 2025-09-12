import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface PromptConsoleProps {
  onEnhance: (prompt: string) => void;
  isLoading: boolean;
  credits: number;
  placeholder?: string;
}

export function PromptConsole({ 
  onEnhance, 
  isLoading, 
  credits,
  placeholder = "Enter your prompt to enhance..." 
}: PromptConsoleProps) {
  const [prompt, setPrompt] = useState('');
  const [showCaret, setShowCaret] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCaret(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (prompt.trim() && credits > 0 && !isLoading) {
      onEnhance(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Console Header */}
      <div className="glass-card rounded-t-2xl p-4 border-b border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Terminal Dots */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-soft-red opacity-80" />
              <div className="w-3 h-3 rounded-full bg-accent-gold opacity-80" />
              <div className="w-3 h-3 rounded-full bg-deep-emerald opacity-80" />
            </div>
            
            <span className="text-glass-white font-mono text-sm opacity-70">
              ai-prompt-console.exe
            </span>
          </div>
          
          {/* Credits Display */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            <span className="text-neon-cyan font-mono text-sm">
              {credits} credits
            </span>
          </div>
        </div>
      </div>

      {/* Console Body */}
      <div className="glass-card rounded-b-2xl relative overflow-hidden">
        {/* Scanline Effect */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-10 scanline-sweep" />
        </div>

        <div className="p-6 space-y-4 relative z-10">
          {/* Command Prompt Line */}
          <div className="flex items-center space-x-2 text-deep-emerald font-mono text-sm">
            <span>promptbrain@ai:~$</span>
            <span className="text-glass-white">enhance-prompt</span>
            {showCaret && (
              <span className="w-2 h-5 bg-neon-cyan terminal-caret-pulse" />
            )}
          </div>

          {/* Input Area */}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="
                w-full min-h-[120px] resize-none
                bg-transparent border-none outline-none
                text-glass-white font-mono text-base leading-relaxed
                placeholder:text-glass-white placeholder:opacity-40
                focus:ring-0 focus:outline-none
                p-0
              "
              disabled={isLoading || credits <= 0}
            />

            {/* Typing Effects */}
            {prompt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-2 right-2 text-neon-cyan font-mono text-xs opacity-60"
              >
                {prompt.length} chars
              </motion.div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-glass-border">
            <div className="flex items-center space-x-3 text-xs font-mono text-glass-white opacity-60">
              <span>Ctrl+Enter to enhance</span>
              <span>•</span>
              <span>AI-powered analysis</span>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || credits <= 0 || isLoading}
              className="
                bg-gradient-to-r from-neon-cyan to-deep-emerald 
                text-cinematic-dark font-semibold
                border-0 rounded-lg px-6 py-2
                hover:shadow-lg hover:shadow-neon-cyan/20
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                cinematic-hover
              "
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-cinematic-dark border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Enhance</span>
                  <div className="w-1 h-1 bg-cinematic-dark rounded-full" />
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-accent-gold animate-pulse' : 'bg-deep-emerald'}`} />
          <div className={`w-2 h-2 rounded-full ${credits > 0 ? 'bg-neon-cyan' : 'bg-soft-red'}`} />
        </div>
      </div>
    </motion.div>
  );
}