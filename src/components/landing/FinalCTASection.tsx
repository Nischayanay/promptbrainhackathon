import { motion } from "framer-motion";

interface FinalCTASectionProps {
  onGetStarted: () => void;
}

export function FinalCTASection({ onGetStarted }: FinalCTASectionProps) {
  return (
    <section className="relative py-32 bg-landing-black overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-landing-gradient-start to-landing-gradient-end rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-landing-gradient-end to-landing-gradient-start rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        
        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="landing-theme text-4xl md:text-5xl lg:text-6xl mb-8"
        >
          Enhance your first prompt in{" "}
          <span className="relative">
            5s
            {/* Subtle underline effect */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-landing-gradient-start to-landing-gradient-end rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </span>
        </motion.h2>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="landing-theme text-xl text-landing-white/70 mb-12 max-w-2xl mx-auto"
        >
          Join thousands of creators, marketers, and developers who've transformed their AI workflow with PromptBrain.
        </motion.p>

        {/* CTA Button with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={onGetStarted}
            className="group relative px-12 py-6 text-xl bg-landing-blue text-landing-white font-bold rounded-full transition-all duration-300 hover:scale-105 electric-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-landing-blue/50"
          >
            <span className="relative z-10">Get Started Free</span>
            
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-landing-blue/20 to-landing-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl scale-110" />
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-landing-white/50"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-landing-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">No credit card required</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-landing-blue" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Start enhancing immediately</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}