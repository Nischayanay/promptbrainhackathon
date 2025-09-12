import { motion } from "motion/react";
import { Button } from "../ui/button";

interface FinalCTAProps {
  onGetStarted: () => void;
}

export function FinalCTA({ onGetStarted }: FinalCTAProps) {
  return (
    <section className="relative py-32 bg-chronicle-white overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '40px 40px'
             }}
        />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gradient-blue/10 to-gradient-purple/10 rounded-full chronicle-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-gradient-purple/10 to-gradient-blue/10 rounded-full chronicle-glow-large"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        
        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold text-chronicle-black mb-8 leading-tight"
        >
          Don't let your ideas die as{" "}
          <span className="bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
            bad prompts
          </span>
        </motion.h2>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-xl text-chronicle-black/70 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Transform your rough thoughts into precise AI instructions that deliver exceptional results.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-8"
        >
          <Button
            onClick={onGetStarted}
            className="px-12 py-6 text-xl bg-gradient-to-r from-gradient-blue to-gradient-purple text-chronicle-white font-semibold chronicle-radius-pill chronicle-easing chronicle-duration-medium hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gradient-blue shadow-2xl hover:shadow-3xl"
            style={{
              boxShadow: '0 20px 40px rgba(58, 141, 255, 0.3)'
            }}
          >
            Start Enhancing Free
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 text-chronicle-black/60"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">50 free credits</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">No credit card required</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">2.3 second setup</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-chronicle-black/10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
                2,500+
              </div>
              <div className="text-chronicle-black/60 text-sm">
                Enhanced prompts daily
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
                37%
              </div>
              <div className="text-chronicle-black/60 text-sm">
                Better first outputs
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
                2.3s
              </div>
              <div className="text-chronicle-black/60 text-sm">
                Average enhancement
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}