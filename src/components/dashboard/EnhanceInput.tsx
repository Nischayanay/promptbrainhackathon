import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { ModeToggle } from "./ModeToggle";

import { Zap, Brain, Wand2, Sparkles, Circle } from "lucide-react";

interface EnhanceInputProps {
  onEnhance: (prompt: string, mode: 'direct' | 'guided') => void;
  onStartFlowZone?: () => void;
  initialPrompt?: string;
  credits: number;
  isLoading?: boolean;
}

export function EnhanceInput({ onEnhance, onStartFlowZone, initialPrompt = '', credits, isLoading = false }: EnhanceInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [mode, setMode] = useState<'direct' | 'guided'>('direct');

  const handleEnhance = async () => {
    if (credits <= 0) return;
    
    if (mode === 'guided' && onStartFlowZone) {
      // Flow Zone doesn't need input prompt
      onStartFlowZone();
      return;
    }
    
    if (!prompt.trim()) return;
    
    // Call parent enhancement function directly
    onEnhance(prompt, mode);
  };

  const handleStartFlow = () => {
    if (credits <= 0) return;
    if (onStartFlowZone) {
      onStartFlowZone();
    }
  };

  const handleModeToggle = (newMode: 'direct' | 'guided') => {
    // Preserve the current input when switching modes - no context loss
    setMode(newMode);
  };

  const sacredExamples = [
    "Write a compelling product launch email that creates urgency and drives action",
    "Create detailed user personas for a mobile app with behavioral insights", 
    "Generate a comprehensive technical specification with clear requirements",
    "Draft a persuasive project proposal that secures stakeholder buy-in",
    "Design an onboarding flow that reduces user churn by 40%",
    "Write marketing copy that increases conversion rates"
  ];

  const handleSacredExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="w-full space-y-16">
      {/* Centered Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1 
          className="text-6xl font-light text-marble-white mb-4 leading-tight"
          style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Enhance your raw ideas into
          <motion.span 
            className="block text-transparent bg-gradient-to-r from-royal-gold via-royal-gold to-royal-gold bg-clip-text mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            powerful context
          </motion.span>
        </motion.h1>
      </motion.div>

      {/* Floating Mode Toggle - Top Center with proper spacing */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <ModeToggle 
          activeMode={mode} 
          onChange={handleModeToggle}
          className="mt-6" 
        />
      </motion.div>



      {/* Minimal Mode Description */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {mode === 'direct' && (
          <motion.p 
            className="text-marble-white/50 text-sm font-light"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Transform your ideas instantly
          </motion.p>
        )}

        {mode === 'guided' && (
          <motion.p 
            className="text-marble-white/50 text-sm font-light"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Step-by-step prompt crafting
          </motion.p>
        )}
      </motion.div>

      {/* Central Input Field - Always Visible */}
      <motion.div 
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="relative group">
          {/* Glass input container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-temple-black/40 via-temple-black/60 to-temple-black/40 backdrop-blur-xl rounded-3xl border border-marble-white/10 group-focus-within:border-royal-gold/30 transition-all duration-500" />
            
            {/* Floating glow on focus */}
            <div className="absolute inset-0 bg-gradient-to-br from-royal-gold/5 via-transparent to-royal-gold/5 rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'direct' ? "Enter your raw idea or prompt..." : "Start with any idea - we'll guide you through the process"}
              className="relative z-10 min-h-40 w-full bg-transparent border-none text-marble-white placeholder:text-marble-white/40 resize-none p-8 text-lg font-light leading-relaxed focus:outline-none focus:ring-0"
              disabled={isLoading}
              style={{ fontFamily: '"Inter", sans-serif' }}
            />
            
            {/* Character count - subtle */}
            {prompt && (
              <motion.div 
                className="absolute bottom-4 right-6 text-xs text-marble-white/30 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {prompt.length}
              </motion.div>
            )}
          </div>
        </div>

        {/* Only show templates for Direct mode if no input */}
        {mode === 'direct' && !prompt && (
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {/* Simple label */}
            <div className="text-center mb-8">
              <p className="text-sm text-marble-white/50 font-light">Or start with a template</p>
            </div>
            
            {/* Horizontal scrollable cards */}
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max justify-center">
                {sacredExamples.slice(0, 3).map((example, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSacredExampleClick(example)}
                    className="group relative w-80 flex-shrink-0"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                  >
                    {/* Glass card background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-marble-white/5 to-marble-white/10 backdrop-blur-sm rounded-2xl border border-marble-white/10 group-hover:border-royal-gold/30 transition-all duration-300" />
                    
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-royal-gold/5 to-royal-gold/3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="relative p-6">
                      <p className="text-sm text-marble-white/70 group-hover:text-marble-white/90 font-light leading-relaxed transition-colors duration-300 text-left">
                        {example}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Central Enhancement Button */}
      <motion.div 
        className="flex justify-center mt-16"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.button
          onClick={() => {
            if (credits <= 0 || isLoading) return;
            
            if (mode === 'guided') {
              onStartFlowZone();
            } else {
              // Direct mode - require input
              if (!prompt.trim()) {
                // Could show a subtle hint or focus the input
                return;
              }
              onEnhance(prompt, mode);
            }
          }}
          disabled={credits <= 0 || isLoading || (mode === 'direct' && !prompt.trim())}
          className="group relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Large glowing button */}
          <div className={`
            px-12 py-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 
            ${credits > 0 && !isLoading && (mode === 'guided' || prompt.trim())
              ? 'bg-gradient-to-r from-royal-gold/20 to-royal-gold/30 border-royal-gold/50 hover:border-royal-gold/70 shadow-lg shadow-royal-gold/20' 
              : 'bg-gradient-to-r from-marble-white/5 to-marble-white/10 border-marble-white/20 cursor-not-allowed'
            }
          `}>
            
            <div className="flex items-center space-x-3">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-royal-gold" />
                  </motion.div>
                  <span className="text-lg font-light text-royal-gold">Enhancing...</span>
                </>
              ) : (
                <>
                  <Zap className={`w-6 h-6 ${
                    credits > 0 && (mode === 'guided' || prompt.trim())
                      ? 'text-royal-gold' 
                      : 'text-marble-white/40'
                  }`} />
                  <span className={`text-lg font-light ${
                    credits > 0 && (mode === 'guided' || prompt.trim())
                      ? 'text-royal-gold' 
                      : 'text-marble-white/40'
                  }`}>
                    {mode === 'direct' ? 'Enhance Prompt' : 'Start Flow Mode'}
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Minimal Credits Status */}
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.2 }}
      >
        {credits <= 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-soft-red/10 backdrop-blur-sm rounded-full border border-soft-red/20"
          >
            <Circle className="w-3 h-3 text-soft-red" />
            <span className="text-soft-red text-sm font-light">Energy depleted</span>
          </motion.div>
        ) : credits <= 3 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-royal-gold/10 backdrop-blur-sm rounded-full border border-royal-gold/20"
          >
            <Circle className="w-3 h-3 text-royal-gold" />
            <span className="text-royal-gold text-sm font-light">{credits} keys remaining</span>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
}