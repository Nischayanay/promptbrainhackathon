import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

// Import GSAP with ScrollTrigger  
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StoryText {
  id: string;
  text: string;
  highlightWords: string[]; // Words to apply shimmer effect
  theme: 'problem' | 'frustration' | 'solution' | 'future';
}

const storyTexts: StoryText[] = [
  {
    id: 'problem',
    text: 'Problem: AI outputs are messy, unclear.',
    highlightWords: ['AI outputs'],
    theme: 'problem'
  },
  {
    id: 'frustration', 
    text: 'Frustration: Wasted hours editing broken prompts.',
    highlightWords: ['Wasted hours'],
    theme: 'frustration'
  },
  {
    id: 'solution',
    text: 'Solution: PromptBrain transforms them instantly.',
    highlightWords: ['PromptBrain', 'instantly'],
    theme: 'solution'
  },
  {
    id: 'future',
    text: 'Future: Scale your creativity, research, productivity.',
    highlightWords: ['Scale', 'creativity', 'productivity'],
    theme: 'future'
  }
];

export function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Helper function to render text with shimmer effects
  const renderTextWithShimmer = (text: string, highlightWords: string[], theme: string, isActive: boolean) => {
    let processedText = text;
    
    highlightWords.forEach(word => {
      const shimmerClass = theme === 'solution' ? 'shimmer-text-blue' : 
                          theme === 'future' ? 'shimmer-text-cyan' : 
                          theme === 'problem' ? 'shimmer-text' : 'shimmer-text';
      
      const highlightedWord = isActive ? 
        `<span class="${shimmerClass}" style="animation-delay: ${Math.random() * 2}s">${word}</span>` : 
        `<span class="highlight-word text-current opacity-90">${word}</span>`;
      
      processedText = processedText.replace(
        new RegExp(`\\b${word}\\b`, 'gi'), 
        highlightedWord
      );
    });
    
    return processedText;
  };

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || !textContainerRef.current || !timelineRef.current) return;

    const container = containerRef.current;
    const textContainer = textContainerRef.current;
    const timeline = timelineRef.current;
    const texts = gsap.utils.toArray(container.querySelectorAll(".story-text"));
    const bgs = gsap.utils.toArray(container.querySelectorAll(".bg"));
    const timelineProgress = timeline.querySelector(".timeline-progress-bar");

    // Set initial states with null checks
    if (texts.length > 0) {
      gsap.set(texts, { opacity: 0, y: 30 });
    }
    if (bgs.length > 0) {
      gsap.set(bgs, { opacity: 0 });
    }
    if (timelineProgress) {
      gsap.set(timelineProgress, { scaleX: 0 });
    }

    // Create main scroll trigger for the entire section with smooth scrubbing
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      pin: textContainer,
      pinSpacing: false,
      scrub: 2, // Smoother scrubbing - was 1, now 2 for more fluid movement
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);
        
        // Smoother timeline progress bar update
        if (timelineProgress) {
          gsap.to(timelineProgress, {
            scaleX: progress,
            duration: 0.2,
            ease: "power1.out"
          });
        }
        
        // Calculate active section with better threshold handling
        const sectionProgress = progress * storyTexts.length;
        const newActiveSection = Math.min(Math.floor(sectionProgress + 0.1), storyTexts.length - 1); // Small offset for better sync
        if (newActiveSection !== activeSection) {
          setActiveSection(newActiveSection);
        }
      }
    });

    // Create individual animations for each text section with improved timing
    storyTexts.forEach((story, i) => {
      const text = texts[i] as HTMLElement;
      const bg = bgs[i] as HTMLElement;
      
      // Skip if elements don't exist
      if (!text || !bg) return;
      
      const sectionStart = i / storyTexts.length;
      const sectionEnd = (i + 1) / storyTexts.length;
      const fadeInDuration = 0.15; // Longer fade transitions
      const holdDuration = 0.7; // Longer hold time for better readability
      const fadeOutDuration = 0.15;

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 2, // Matching main scrub value for consistency
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Calculate opacity and transform based on section position with better timing
          let opacity = 0;
          let y = 20; // Reduced initial offset for smoother animation
          let bgOpacity = 0;
          
          if (progress >= sectionStart && progress <= sectionEnd) {
            // Active section with extended timing
            const sectionProgress = (progress - sectionStart) / (sectionEnd - sectionStart);
            
            if (sectionProgress < fadeInDuration) {
              // Fade in phase
              const fadeProgress = sectionProgress / fadeInDuration;
              opacity = fadeProgress;
              bgOpacity = fadeProgress * 0.8; // Smoother background fade
              y = 20 * (1 - fadeProgress);
            } else if (sectionProgress > (1 - fadeOutDuration) && i < storyTexts.length - 1) {
              // Fade out phase (except for last section)
              const fadeProgress = (sectionProgress - (1 - fadeOutDuration)) / fadeOutDuration;
              opacity = 1 - fadeProgress;
              bgOpacity = (1 - fadeProgress) * 0.8;
              y = 20 * fadeProgress;
            } else {
              // Hold phase - fully visible for longer
              opacity = 1;
              bgOpacity = 0.8;
              y = 0;
            }
            

          } else if (progress < sectionStart) {
            // Before this section
            opacity = 0;
            bgOpacity = 0;
            y = 20;

          } else {
            // After this section
            opacity = i === storyTexts.length - 1 ? 1 : 0; // Keep last section visible
            bgOpacity = i === storyTexts.length - 1 ? 0.8 : 0;
            y = 0;

          }
          
          // Apply smoother animations
          gsap.to(text, {
            opacity,
            y,
            duration: 0.2,
            ease: "power1.out"
          });
          
          gsap.to(bg, {
            opacity: bgOpacity,
            duration: 0.3,
            ease: "power1.out"
          });
        }
      });
    });

    // Trigger shimmer effects when sections become active
    const shimmerTriggers = storyTexts.map((_, i) => {
      return ScrollTrigger.create({
        trigger: container,
        start: () => `${(i / storyTexts.length) * 100 + 10}% top`,
        end: () => `${((i + 1) / storyTexts.length) * 100 - 10}% top`,
        onEnter: () => {
          if (!prefersReducedMotion) {
            const shimmerElements = document.querySelectorAll(`#story-${i} .shimmer-text, #story-${i} .shimmer-text-blue, #story-${i} .shimmer-text-cyan`);
            shimmerElements.forEach((element) => {
              element.classList.add('shimmer-text-repeat');
            });
          }
        },
        onLeave: () => {
          const shimmerElements = document.querySelectorAll(`#story-${i} .shimmer-text, #story-${i} .shimmer-text-blue, #story-${i} .shimmer-text-cyan`);
          shimmerElements.forEach((element) => {
            element.classList.remove('shimmer-text-repeat');
          });
        }
      });
    });

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      shimmerTriggers.forEach(t => t.kill());
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion, activeSection]);

  const getBackgroundComponent = (text: StoryText, index: number) => {
    switch (text.theme) {
      case 'problem':
        return (
          <div className="bg absolute inset-0">
            {/* Glitchy AI Output Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-landing-black via-gray-900 to-landing-black">
              {/* Glitch Text Overlay */}
              <div className="absolute inset-0 overflow-hidden">
                {!prefersReducedMotion && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-xs font-mono text-red-400/20 whitespace-nowrap"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          transform: `rotate(${Math.random() * 20 - 10}deg)`,
                        }}
                        animate={{
                          opacity: [0.1, 0.3, 0.1],
                          x: [0, Math.random() * 10 - 5, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      >
                        {'ERROR: INVALID_PROMPT_STRUCTURE'.repeat(3)}
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
              
              {/* Static Noise Overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
            </div>
          </div>
        );

      case 'frustration':
        return (
          <div className="bg absolute inset-0">
            {/* Red Undertone Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/50 via-landing-black to-red-900/30">
              {/* Clock Ticking Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!prefersReducedMotion && (
                  <motion.div
                    className="relative w-32 h-32 border-4 border-red-500/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Clock hands */}
                    <div className="absolute top-1/2 left-1/2 w-1 h-12 bg-red-400/40 origin-bottom -translate-x-1/2 -translate-y-full" />
                    <motion.div
                      className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-red-300/60 origin-bottom -translate-x-1/2 -translate-y-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Hour markers */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-4 bg-red-500/30"
                        style={{
                          top: '4px',
                          left: '50%',
                          transformOrigin: '50% 60px',
                          transform: `translateX(-50%) rotate(${i * 30}deg)`,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
              
              {/* Wasted Time Particles */}
              {!prefersReducedMotion && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-red-400/30 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -50, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'solution':
        return (
          <div className="bg absolute inset-0">
            {/* Solution Background with Orb Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-landing-blue/20 via-landing-black to-cyan-400/20">
              {/* Central Orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative w-40 h-40 bg-gradient-radial from-landing-blue/80 to-landing-blue/20 rounded-full"
                  animate={!prefersReducedMotion ? {
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Orb Core */}
                  <div className="absolute inset-8 bg-landing-white rounded-full opacity-90" />
                  
                  {/* Orb Rings */}
                  {!prefersReducedMotion && (
                    <>
                      <motion.div
                        className="absolute inset-0 border-2 border-landing-blue/40 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.8, 0, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"
                        animate={{
                          scale: [1, 2, 1],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: 0.5
                        }}
                      />
                    </>
                  )}
                </motion.div>
              </div>
              
              {/* Enhancement Particles */}
              {!prefersReducedMotion && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
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
                        opacity: [0.4, 1, 0.4],
                        scale: [1, 2, 1],
                      }}
                      transition={{
                        duration: 5 + Math.random() * 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'future':
        return (
          <div className="bg absolute inset-0">
            {/* Expansive Future Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-landing-black via-purple-950/30 to-landing-black">
              {/* Stars Layer */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(2px 2px at 20px 30px, rgba(59, 130, 246, 0.3), transparent),
                                   radial-gradient(2px 2px at 40px 70px, rgba(139, 92, 246, 0.3), transparent),
                                   radial-gradient(1px 1px at 90px 40px, rgba(0, 255, 247, 0.3), transparent)`,
                  backgroundSize: '100px 100px, 120px 120px, 80px 80px',
                }}
              />

              {/* Energy Beams */}
              {!prefersReducedMotion && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-px h-20 bg-gradient-to-t from-transparent via-landing-blue/40 to-transparent"
                      style={{
                        left: `${(i * 8 + 10)}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scaleY: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 4 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Future Particles */}
              {!prefersReducedMotion && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(25)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        x: [0, (Math.random() - 0.5) * 200],
                        y: [0, (Math.random() - 0.5) * 200],
                        opacity: [0.2, 1, 0.2],
                        scale: [1, Math.random() * 2 + 1, 1],
                      }}
                      transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="story-timeline relative min-h-[400vh] bg-landing-black overflow-hidden"
      style={{ 
        isolation: 'isolate',
        position: 'relative'
      }}
    >
      {/* Backgrounds Layer (z-index: 0) */}
      <div className="backgrounds fixed inset-0" style={{ zIndex: 0 }}>
        {storyTexts.map((text, index) => (
          <div key={text.id}>
            {getBackgroundComponent(text, index)}
          </div>
        ))}
      </div>

      {/* Horizontal Timeline - Fixed Position */}
      <div 
        ref={timelineRef}
        className="fixed top-8 left-1/2 transform -translate-x-1/2 z-30"
      >

        
        {/* Overall Progress Bar */}
        <div className="mt-2 w-full h-1 bg-landing-white/10 rounded-full overflow-hidden">
          <div 
            className="timeline-progress-bar h-full bg-gradient-to-r from-landing-blue to-cyan-400 rounded-full origin-left"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </div>

      {/* Story Text Container Layer (z-index: 20) - Pinned */}
      <div 
        ref={textContainerRef}
        className="story-text-container sticky top-0 h-screen flex items-center justify-center pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Text Elements - Each will be animated by GSAP */}
          {storyTexts.map((text, index) => (
            <div 
              key={text.id}
              id={`story-${index}`}
              className="story-text absolute inset-0 flex items-center justify-center"
              style={{ pointerEvents: 'none' }}
            >
              <h1 
                className={`text-4xl md:text-6xl lg:text-7xl font-bold ${
                  text.theme === 'future' ? 'tracking-wider' : ''
                }`}
                style={{
                  color: text.theme === 'problem' ? '#FFFFFF' :
                         text.theme === 'frustration' ? '#EF4444' : 
                         text.theme === 'solution' ? '#3B82F6' :
                         text.theme === 'future' ? '#00FFF7' : '#FFFFFF',
                  textShadow: text.theme === 'solution' ? '0 0 30px rgba(59, 130, 246, 0.5)' :
                             text.theme === 'future' ? '0 0 30px rgba(0, 255, 247, 0.5)' : 
                             text.theme === 'problem' ? '0 0 20px rgba(255, 255, 255, 0.3)' :
                             text.theme === 'frustration' ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none',
                  position: 'relative',
                  zIndex: 25
                }}
                dangerouslySetInnerHTML={{
                  __html: renderTextWithShimmer(text.text, text.highlightWords, text.theme, activeSection === index)
                }}
              />
            </div>
          ))}


        </div>
      </div>
    </section>
  );
}