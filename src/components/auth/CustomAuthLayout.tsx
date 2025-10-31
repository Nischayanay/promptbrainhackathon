import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PBAuthForm } from "./PBAuthForm";
import { InteractiveBubbles, getRandomEmoji, getRandomAffirmation } from "../visual/InteractiveBubbles";
import { NeuralBackground } from "../visual/NeuralBackground";
import { AnimatedBubble } from "../visual/AnimatedBubble";

interface Bubble {
  id: number;
  x: number;
  y: number;
  text: string;
  type: "affirmation" | "emoji";
}

interface CustomAuthLayoutProps {
  mode: "login" | "signup";
  onNavigateToSignup?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToLanding?: () => void;
  onAuthSuccess?: () => void;
}

export function CustomAuthLayout({ 
  mode, 
  onNavigateToSignup, 
  onNavigateToLogin, 
  onNavigateToLanding, 
  onAuthSuccess: _onAuthSuccess 
}: CustomAuthLayoutProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const handleInteraction = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBubble: Bubble = {
      id: Date.now(),
      x,
      y,
      text: Math.random() > 0.5 ? getRandomEmoji() : getRandomAffirmation(),
      type: Math.random() > 0.5 ? "emoji" : "affirmation",
    };

    setBubbles(prev => [...prev, newBubble]);

    // Remove bubble after animation
    setTimeout(() => {
      setBubbles(prev => prev.filter(bubble => bubble.id !== newBubble.id));
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Interactive Visual Zone */}
      <div 
        className="flex-1 relative overflow-hidden cursor-pointer"
        onClick={handleInteraction}
      >
        {/* Background Effects */}
        <NeuralBackground />
        
        {/* Interactive Bubbles */}
        <InteractiveBubbles bubbles={bubbles} />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Welcome to PromptBrain
            </h1>
            <p className="text-xl text-white/80 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Click anywhere to see the magic ✨
            </p>
            <p className="text-lg text-white/60" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {mode === "login" 
                ? "Ready to enhance your prompts?" 
                : "Join thousands of creators building smarter prompts"
              }
            </p>
          </motion.div>
          
          <AnimatedBubble />
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <PBAuthForm onAuthSuccess={_onAuthSuccess} />
          
          {/* Navigation Links */}
          <div className="mt-6 text-center space-y-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {mode === "login" ? (
              <p className="text-sm" style={{ color: '#4B5563' }}>
                Don't have an account?{" "}
                <button
                  onClick={onNavigateToSignup}
                  className="font-medium hover:underline"
                  style={{ color: '#1976D2' }}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm" style={{ color: '#4B5563' }}>
                Already have an account?{" "}
                <button
                  onClick={onNavigateToLogin}
                  className="font-medium hover:underline"
                  style={{ color: '#1976D2' }}
                >
                  Log in
                </button>
              </p>
            )}
            
            <button
              onClick={onNavigateToLanding}
              className="block w-full text-sm hover:underline"
              style={{ color: '#6B7280' }}
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}