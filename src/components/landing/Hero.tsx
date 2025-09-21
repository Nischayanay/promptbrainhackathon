import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface HeroProps {
  onStartEnhancing: () => void;
  onSeeHowItWorks: () => void;
  onAuthSuccess?: (user: any) => void;
}

export function Hero({ onStartEnhancing, onSeeHowItWorks, onAuthSuccess }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const { scrollY } = useScroll();
  const isInView = useInView(containerRef, { once: true });
  
  // Parallax transforms - text moves slower than background
  const textY = useTransform(scrollY, [0, 500], [0, 100]); // Text moves slower
  const backgroundY = useTransform(scrollY, [0, 500], [0, 200]); // Background moves faster
  const secondaryY = useTransform(scrollY, [0, 500], [0, 150]); // Secondary layer transform
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Background gradient shift on scroll
  const gradientShift = useTransform(scrollY, [0, 500], [0, 50]);
  const gradientTranslateX = useTransform(gradientShift, [0, 50], ['translateX(0px)', 'translateX(25px)']);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track mouse position for gradient effect
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Split headline into individual letters for stagger animation  
  const headlineText = "PromptBrain — Architecting Context for Smarter Prompts";
  const headlineWords = ["PromptBrain", "—", "Architecting", "Context", "for", "Smarter", "Prompts"];
  const subheadlineWords = [
    "PromptBrain", "helps", "creators,", "students,", "and", "founders", "enhance", "prompts", "with", "context", "—", 
    "making", "AI", "outputs", "clearer,", "smarter,", "and", "instantly", "usable."
  ];
  
  // Shimmer words with specific styling
  const shimmerWords = {
    "PromptBrain": "shimmer-text-blue",
    "Architecting": "shimmer-text-cyan",
    "Context": "shimmer-text-blue", 
    "Smarter": "shimmer-text-cyan",
    "context": "shimmer-text-cyan",
    "AI": "shimmer-text-blue",
    "clearer,": "shimmer-text-blue",
    "smarter,": "shimmer-text-cyan"
  };
  
  // Split text into letters for letter-by-letter stagger
  const splitTextIntoLetters = (text: string) => {
    return text.split('').map((char, index) => ({ char, index }));
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-landing-black overflow-hidden"
    >
      {/* Dynamic parallax gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReducedMotion ? 0 : backgroundY,
          background: prefersReducedMotion ? 
            'linear-gradient(45deg, #000000, #1a1a1a, #000000)' :
            `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, 
             rgba(59, 130, 246, 0.1) 0%, 
             rgba(59, 130, 246, 0.05) 40%, 
             transparent 80%)`
        }}
      />

      {/* Secondary gradient layer for depth */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: prefersReducedMotion ? 0 : secondaryY,
          background: `linear-gradient(135deg, 
            rgba(0, 255, 247, 0.03) 0%, 
            transparent 30%, 
            rgba(139, 92, 246, 0.03) 70%, 
            transparent 100%)`,
          transform: prefersReducedMotion ? 'none' : gradientTranslateX
        }}
      />

      {/* AI Neuron Network Effect */}
      {mounted && !prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating AI particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-landing-blue rounded-full ai-neuron-pulse"
              style={{
                left: `${15 + (i * 12)}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + (i * 0.5),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Connection lines between particles */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.line
                key={i}
                x1={`${15 + (i * 12)}%`}
                y1={`${20 + (i % 3) * 25}%`}
                x2={`${27 + (i * 12)}%`}
                y2={`${45 + (i % 3) * 25}%`}
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 1
                }}
              />
            ))}
          </svg>
        </div>
      )}

      {/* Main content with parallax */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        style={{ y: prefersReducedMotion ? 0 : textY, opacity: prefersReducedMotion ? 1 : opacity }}
      >
        {/* Primary H1 Heading for SEO */}
        <div className="mb-6">
          {mounted && (
            <h1 className="landing-theme text-4xl md:text-5xl lg:text-7xl">
              <motion.span
                className="inline-block mr-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                We
              </motion.span>
              <motion.span
                className="inline-block mr-4 shimmer-text-cyan"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                Architect
              </motion.span>
              <motion.span
                className="inline-block shimmer-text-blue"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                Context
              </motion.span>
            </h1>
          )}
        </div>

        {/* Secondary headline */}
        <div ref={headlineRef} className="mb-8">
          {mounted && (
            <h2 className="landing-theme text-2xl md:text-3xl lg:text-4xl mb-6 text-landing-white/90">
              {prefersReducedMotion ? (
                // Reduced motion: Show words with simple fade-in
                headlineWords.map((word, index) => {
                  const shimmerClass = shimmerWords[word as keyof typeof shimmerWords];
                  return (
                    <motion.span
                      key={index}
                      className={`inline-block mr-3 last:mr-0 ${shimmerClass || ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.5 + index * 0.1,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      style={{
                        animationDelay: shimmerClass ? `${0.5 + index * 0.5}s` : undefined
                      }}
                    >
                      {word}
                    </motion.span>
                  );
                })
              ) : (
                // Full motion: Letter-by-letter stagger
                headlineText.split(' ').map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block mr-3 last:mr-0">
                    {splitTextIntoLetters(word).map(({ char, index }) => (
                      <motion.span
                        key={`${wordIndex}-${index}`}
                        className="inline-block"
                        initial={{ opacity: 0, y: 50, rotateX: -90 }}
                        animate={isInView ? { 
                          opacity: 1, 
                          y: 0, 
                          rotateX: 0 
                        } : { 
                          opacity: 0, 
                          y: 50, 
                          rotateX: -90 
                        }}
                        transition={{
                          duration: 0.8,
                          delay: 0.5 + (wordIndex * 0.3) + (index * 0.05),
                          ease: [0.25, 0.1, 0.25, 1]
                        }}
                        style={{
                          transformOrigin: '50% 100%'
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ))}
                  </span>
                ))
              )}
            </h2>
          )}
        </div>

        {/* Subheadline */}
        <div className="mb-12">
          {mounted && (
            <div className="subhead text-landing-white/80 max-w-4xl mx-auto font-[Inter] text-[20px]">
              {subheadlineWords.map((word, index) => {
                const shimmerClass = shimmerWords[word as keyof typeof shimmerWords];
                return (
                  <motion.span
                    key={index}
                    className={`inline-block mr-2 last:mr-0 ${shimmerClass || ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{
                      duration: 0.6,
                      delay: 2 + (index * 0.05),
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    style={{
                      animationDelay: shimmerClass ? `${2 + index * 0.3}s` : undefined
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </div>
          )}
        </div>



        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary CTA with infinite glow pulse */}
          <motion.button
            onClick={onStartEnhancing}
            className="group relative px-8 py-4 bg-landing-blue text-landing-white font-semibold rounded-full transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-blue/50"
            animate={!prefersReducedMotion ? {
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(59, 130, 246, 0.6)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={!prefersReducedMotion ? { 
              scale: 1.05,
              boxShadow: "0 0 50px rgba(59, 130, 246, 0.8)"
            } : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Start Enhancing</span>
            
            {/* Infinite glow pulse background */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-landing-blue/30 to-cyan-400/30 blur-lg"
              animate={!prefersReducedMotion ? {
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Enhanced hover glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-landing-blue/20 to-landing-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl scale-110" />
          </motion.button>

          {/* Secondary CTA */}
          <button
            onClick={onSeeHowItWorks}
            className="group px-8 py-4 border-2 border-landing-white/20 text-landing-white font-semibold rounded-full transition-all duration-300 hover:border-landing-white/40 hover:bg-landing-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-white/50"
          >
            See How It Works
          </button>
        </motion.div>

        {/* Floating indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 2.8 }}
          className="absolute -bottom-24 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-landing-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [2, 14, 2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-landing-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}