import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Lock, Sparkles, Zap, FileText } from "lucide-react";

interface CreditsTeaseProps {
  onGetStarted: () => void;
}

export function CreditsTease({ onGetStarted }: CreditsTeaseProps) {
  const [isLockHovered, setIsLockHovered] = useState(false);

  return (
    <section className="relative py-32 bg-chronicle-black">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="chronicle-theme mb-6">
            Start with 50 free credits
          </h2>
          <p className="text-chronicle-white/70 body max-w-2xl mx-auto">
            Keep what works. Upgrade when you need more.
          </p>
        </div>

        {/* Credits & Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Credits Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-chronicle-gray-200/30 chronicle-radius-card p-8 border border-chronicle-white/10 backdrop-blur-sm"
          >
            {/* Credits Badge */}
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-gradient-blue to-gradient-purple rounded-full flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(58, 141, 255, 0.3)',
                    '0 0 40px rgba(58, 141, 255, 0.5)',
                    '0 0 20px rgba(58, 141, 255, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-chronicle-white" />
              </motion.div>
              <div>
                <h3 className="text-3xl font-bold text-chronicle-white">50</h3>
                <p className="text-chronicle-white/60">Free Credits</p>
              </div>
            </div>

            {/* What you get */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-chronicle-white mb-4">
                What you can create:
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-gradient-blue" />
                  <span className="text-chronicle-white/80">
                    <span className="font-semibold text-gradient-blue">30+</span> Direct mode enhancements
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gradient-purple" />
                  <span className="text-chronicle-white/80">
                    <span className="font-semibold text-gradient-purple">15+</span> Flow mode conversations
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-green-500 rounded chronicle-radius-pill"></div>
                  <span className="text-chronicle-white/80">
                    Unlimited saves & exports
                  </span>
                </div>
              </div>
            </div>

            {/* No Credit Card */}
            <div className="mt-8 pt-6 border-t border-chronicle-white/10">
              <p className="text-chronicle-white/50 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </p>
            </div>
          </motion.div>

          {/* Right: PRD Generator Tease (Locked) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Locked Feature Card */}
            <div 
              className="bg-chronicle-gray-200/20 chronicle-radius-card p-8 border border-chronicle-white/10 backdrop-blur-sm relative overflow-hidden cursor-pointer transition-all duration-300 hover:border-chronicle-white/20"
              onMouseEnter={() => setIsLockHovered(true)}
              onMouseLeave={() => setIsLockHovered(false)}
            >
              {/* Blur Overlay */}
              <motion.div
                className="absolute inset-0 backdrop-blur-sm bg-chronicle-black/20 z-10"
                animate={isLockHovered ? { opacity: 0.8 } : { opacity: 0.6 }}
                transition={{ duration: 0.2 }}
              />

              {/* Lock Icon */}
              <motion.div
                className="absolute top-6 right-6 z-20"
                animate={isLockHovered ? { 
                  rotate: [0, -3, 3, 0],
                  y: [0, -2, 0]
                } : {}}
                transition={{ duration: 0.12 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gradient-blue to-gradient-purple rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-chronicle-white" />
                </div>
              </motion.div>

              {/* Content (slightly blurred) */}
              <motion.div
                className="relative z-5"
                animate={isLockHovered ? { filter: "blur(1px)" } : { filter: "blur(0.5px)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-chronicle-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-chronicle-white">PRD Generator</h3>
                    <p className="text-chronicle-white/60 text-sm">Coming Soon</p>
                  </div>
                </div>

                <p className="text-chronicle-white/70 mb-6 leading-relaxed">
                  Transform product ideas into comprehensive Product Requirements Documents with structured sections, user stories, and technical specifications.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-blue rounded-full"></div>
                    <span className="text-chronicle-white/60 text-sm">Executive Summary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-purple rounded-full"></div>
                    <span className="text-chronicle-white/60 text-sm">User Stories & Acceptance Criteria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-chronicle-white/60 text-sm">Technical Requirements</span>
                  </div>
                </div>
              </motion.div>

              {/* Unlock Message Overlay */}
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={isLockHovered ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-chronicle-white font-medium mb-2">
                    Unlock with Pro Plan
                  </p>
                  <p className="text-chronicle-white/60 text-sm">
                    Available after free credits
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Coming Soon Badge */}
            <div className="absolute -top-3 -right-3 z-40">
              <div className="bg-gradient-to-r from-gradient-blue to-gradient-purple px-4 py-1 chronicle-radius-pill text-chronicle-white text-xs font-medium">
                Coming Soon
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={onGetStarted}
            className="px-12 py-4 bg-gradient-to-r from-gradient-blue to-gradient-purple text-chronicle-white font-medium chronicle-radius-pill chronicle-easing chronicle-duration-medium hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-lg"
          >
            Claim Your 50 Free Credits
          </Button>
          
          <p className="text-chronicle-white/50 text-sm mt-4">
            Join 2,500+ users enhancing their prompts
          </p>
        </motion.div>
      </div>
    </section>
  );
}