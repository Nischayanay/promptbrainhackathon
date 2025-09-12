import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { ArrowRight } from "lucide-react";

interface FinalCTAProps {
  onEnhancePrompt: () => void;
}

export function FinalCTA({ onEnhancePrompt }: FinalCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const spotlightControls = useAnimation();
  const orbControls = useAnimation();
  const buttonControls = useAnimation();

  // Cinematic spotlight reveal animation
  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      // Sequence: Fade in spotlight → Reveal content → Start orb animation → Start button breathing
      const sequence = async () => {
        await spotlightControls.start({
          opacity: [0, 0.8, 1],
          scale: [2, 1.2, 1],
          transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1] }
        });
        
        // Start orb pulsing
        orbControls.start({
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
          transition: { 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        });
        
        // Start button breathing
        buttonControls.start({
          scale: [1, 1.02, 1],
          transition: { 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        });
      };
      
      sequence();
    }
  }, [isInView, prefersReducedMotion, spotlightControls, orbControls, buttonControls]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-landing-black overflow-hidden landing-theme"
    >
      {/* Cinematic Spotlight Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-landing-blue/20 via-transparent to-landing-black"
        initial={{ opacity: 0, scale: 2 }}
        animate={spotlightControls}
      />
      
      {/* Secondary Spotlight Layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-cyan-400/10 via-transparent to-transparent"
        initial={{ opacity: 0, scale: 1.5 }}
        animate={isInView ? {
          opacity: [0, 0.6, 0.3],
          scale: [1.5, 1, 0.8],
        } : { opacity: 0, scale: 1.5 }}
        transition={{ duration: 3, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Floating Particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-landing-blue/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 100, 0],
                y: [0, (Math.random() - 0.5) * 100, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        
        {/* Bold Statement */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{
              fontFamily: "'Space Grotesk', 'Inter Tight', 'Inter', sans-serif",
              textShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
            }}
          >
            <span className="text-landing-white">Stop wasting hours on </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              broken prompts
            </span>
            <span className="text-landing-white">.</span>
          </h1>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-landing-blue to-cyan-400"
            style={{
              fontFamily: "'Space Grotesk', 'Inter Tight', 'Inter', sans-serif",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Start enhancing today.
          </motion.h2>
        </motion.div>

        {/* CTA Section with Orb */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          
          {/* Solution Orb - Left Side */}
          <motion.div
            className="relative order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 1, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              className="relative w-32 h-32 md:w-40 md:h-40"
              animate={orbControls}
            >
              {/* Main Orb */}
              <div className="absolute inset-0 bg-gradient-radial from-landing-blue/80 to-landing-blue/20 rounded-full">
                <div className="absolute inset-6 bg-landing-white rounded-full opacity-90" />
              </div>
              
              {/* Orb Energy Rings */}
              {!prefersReducedMotion && (
                <>
                  <motion.div
                    className="absolute inset-0 border-2 border-landing-blue/40 rounded-full"
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"
                    animate={{
                      scale: [1, 2.2, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 border border-cyan-400/20 rounded-full"
                    animate={{
                      scale: [1, 2.8, 1],
                      opacity: [0.4, 0, 0.4],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 1
                    }}
                  />
                </>
              )}
            </motion.div>

            {/* Orb Energy Particles */}
            {!prefersReducedMotion && (
              <div className="absolute inset-0 overflow-visible">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-landing-blue/70 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      transformOrigin: "50% 50%"
                    }}
                    animate={{
                      x: [0, Math.cos(i * 45 * Math.PI / 180) * 80],
                      y: [0, Math.sin(i * 45 * Math.PI / 180) * 80],
                      opacity: [0.8, 0, 0.8],
                      scale: [1, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Primary CTA Button - Right Side */}
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.button
              onClick={onEnhancePrompt}
              className="group relative inline-flex items-center gap-4 px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-landing-blue to-cyan-400 rounded-full text-landing-white font-bold text-lg md:text-xl transition-all duration-300 hover:shadow-2xl hover:shadow-landing-blue/30 focus:outline-none focus:ring-4 focus:ring-landing-blue/30"
              animate={buttonControls}
              whileHover={!prefersReducedMotion ? { 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
              } : {}}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-landing-blue/20 to-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <span className="relative z-10">Enhance My Prompt</span>
              
              <motion.div
                className="relative z-10"
                animate={!prefersReducedMotion ? {
                  x: [0, 4, 0],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>

              {/* Button Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Button Supporting Text */}
            <motion.p
              className="mt-4 subhead text-landing-white/60 text-base"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              Transform chaos into clarity in seconds
            </motion.p>
          </motion.div>
        </div>

        {/* Additional Elements */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Trust Indicators */}
          <div className="inline-flex items-center gap-6 text-landing-white/40 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span>Free to start</span>
            </div>
            <div className="w-px h-4 bg-landing-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Instant results</span>
            </div>
            <div className="w-px h-4 bg-landing-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>No setup required</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Enhancement */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0, 255, 247, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>
    </section>
  );
}