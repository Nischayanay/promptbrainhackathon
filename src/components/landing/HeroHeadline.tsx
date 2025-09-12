import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface HeroHeadlineProps {
  onCTAClick: () => void;
}

export function HeroHeadline({ onCTAClick }: HeroHeadlineProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const headlineWords = ["Turn", "vague", "prompts", "→", "powerful", "results"];

  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Kinetic Headline */}
      <div className="mb-8">
        {mounted && (
          <h1 className="landing-theme text-4xl md:text-5xl lg:text-6xl">
            {headlineWords.map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-4 last:mr-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
        )}
      </div>

      {/* Subhead */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="landing-theme text-lg md:text-xl text-landing-white/70 mb-12 max-w-2xl mx-auto"
      >
        Intelligent prompt enhancement that turns your rough ideas into structured, effective AI instructions.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      >
        <button
          onClick={onCTAClick}
          className="group relative px-8 py-4 bg-landing-white text-landing-black font-semibold rounded-full transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-white/50"
        >
          <span className="relative z-10">Try PromptBrain Free</span>
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-landing-gradient-start to-landing-gradient-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        </button>
      </motion.div>
    </div>
  );
}