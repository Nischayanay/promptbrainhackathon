import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface DemoData {
  mode: string;
  rawPrompt: string;
  enhancedPrompt: string;
  title: string;
  description: string;
}

const demoData: DemoData[] = [
  {
    mode: "general",
    title: "General Enhancement",
    description: "Transform vague ideas into clear, actionable prompts",
    rawPrompt: "write something about AI for my blog",
    enhancedPrompt: "Create a comprehensive 1,500-word blog post titled 'The Future of AI in Everyday Life: 5 Ways Artificial Intelligence Will Transform Your Daily Routine by 2025.' \n\nStructure the post with:\n- Engaging introduction with a relatable scenario\n- 5 detailed sections covering specific AI applications (smart homes, healthcare, transportation, work productivity, entertainment)\n- Real-world examples and case studies for each application\n- Balanced discussion of benefits and potential concerns\n- Conclusion with actionable insights for readers\n\nTone: Informative yet accessible, avoiding technical jargon while maintaining credibility. Target audience: General consumers interested in technology trends."
  },
  {
    mode: "research",
    title: "Research Mode",
    description: "Academic-grade prompts for deep analysis and insights",
    rawPrompt: "research climate change impact",
    enhancedPrompt: "Conduct a comprehensive literature review analyzing the socioeconomic impacts of climate change on coastal communities in Southeast Asia from 2010-2024.\n\nResearch Parameters:\n- Primary focus: Economic displacement, agricultural productivity, and migration patterns\n- Methodology: Systematic review of peer-reviewed journals, government reports, and NGO studies\n- Geographic scope: Indonesia, Philippines, Vietnam, Thailand, and Myanmar\n- Key databases: JSTOR, ScienceDirect, Google Scholar, World Bank Open Data\n\nDeliverables:\n1. Executive summary (500 words)\n2. Detailed analysis with statistical correlations\n3. Case study comparisons between 3 representative coastal regions\n4. Policy recommendations based on successful adaptation strategies\n5. Bibliography with 25+ credible sources\n\nEvaluation criteria: Data reliability, methodological rigor, and practical applicability of findings."
  },
  {
    mode: "product",
    title: "Product Spec Mode",
    description: "Detailed technical specifications and requirements",
    rawPrompt: "build a mobile app for fitness",
    enhancedPrompt: "Product Requirements Document: FitTrack Pro - Comprehensive Fitness Mobile Application\n\nCore Features:\n• Workout Planning: Custom routines, exercise library (500+ exercises), progressive overload tracking\n• Nutrition Tracking: Calorie counter, macro management, meal planning, barcode scanner\n• Progress Analytics: Body metrics, performance graphs, photo progress, strength progression\n• Social Features: Community challenges, workout sharing, trainer connections\n\nTechnical Specifications:\n• Platform: React Native (iOS/Android)\n• Backend: Node.js with PostgreSQL database\n• Authentication: OAuth 2.0, biometric login\n• Integrations: Apple Health, Google Fit, Fitbit, MyFitnessPal API\n• Offline Capability: Local data sync, cached workouts\n\nUser Experience:\n• Onboarding: 3-step goal setting, fitness assessment\n• Navigation: Tab-based with quick-action floating button\n• Accessibility: WCAG 2.1 AA compliance, voice commands\n\nSuccess Metrics: 80% user retention after 30 days, 4.5+ app store rating, 50% feature adoption rate"
  }
];

interface ModeToggleProps {
  modes: DemoData[];
  activeMode: string;
  onModeChange: (mode: string) => void;
}

function ModeToggle({ modes, activeMode, onModeChange }: ModeToggleProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="flex justify-center mb-12">
      <div className="relative bg-landing-white/[0.03] backdrop-blur-sm border border-landing-white/10 rounded-full p-1">
        {modes.map((mode, index) => (
          <button
            key={mode.mode}
            onClick={() => onModeChange(mode.mode)}
            className={`relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeMode === mode.mode
                ? 'text-landing-white'
                : 'text-landing-white/60 hover:text-landing-white/80'
            }`}
          >
            {/* Active background */}
            {activeMode === mode.mode && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-landing-blue rounded-full"
                initial={false}
                transition={prefersReducedMotion ? { duration: 0 } : { 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 35 
                }}
              />
            )}
            
            {/* Text */}
            <span className="relative z-10 capitalize">
              {mode.mode === 'product' ? 'Product Spec' : mode.mode}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface PromptCardProps {
  title: string;
  content: string;
  isEnhanced: boolean;
  isVisible: boolean;
}

function PromptCard({ title, content, isEnhanced, isVisible }: PromptCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: isEnhanced ? 50 : -50 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.3, 
        x: 0,
        scale: isVisible ? 1 : 0.95
      }}
      transition={prefersReducedMotion ? { duration: 0 } : { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1],
        delay: isEnhanced ? 0.2 : 0
      }}
      className={`relative h-full ${
        isEnhanced 
          ? 'bg-gradient-to-br from-landing-blue/10 to-landing-blue/5 border-landing-blue/20' 
          : 'bg-landing-white/[0.02] border-landing-white/10'
      } backdrop-blur-sm border rounded-2xl p-8 transition-all duration-500`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${
            isEnhanced ? 'bg-landing-blue' : 'bg-landing-white/40'
          }`} />
          <h3 className="landing-theme text-lg font-semibold text-landing-white">
            {title}
          </h3>
        </div>
        <div className={`h-px ${
          isEnhanced 
            ? 'bg-gradient-to-r from-landing-blue/60 to-transparent' 
            : 'bg-gradient-to-r from-landing-white/20 to-transparent'
        }`} />
      </div>

      {/* Content */}
      <div className={`${
        isEnhanced ? 'max-h-96 overflow-y-auto' : 'h-20'
      } custom-scrollbar`}>
        <motion.p
          key={content}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`landing-theme ${
            isEnhanced 
              ? 'text-landing-white/90 text-sm leading-relaxed' 
              : 'text-landing-white/60 text-lg'
          } whitespace-pre-wrap`}
        >
          {content}
        </motion.p>
      </div>

      {/* Enhancement indicator */}
      {isEnhanced && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-landing-blue/20 rounded-full border border-landing-blue/40">
            <svg className="w-4 h-4 text-landing-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-medium text-landing-blue">Enhanced</span>
          </div>
        </div>
      )}

      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isEnhanced 
          ? 'bg-gradient-to-r from-landing-blue/5 to-transparent blur-xl' 
          : 'bg-gradient-to-r from-landing-white/5 to-transparent blur-xl'
      }`} />
    </motion.div>
  );
}

export function DemoShowcase() {
  const [activeMode, setActiveMode] = useState("general");
  const [inView, setInView] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const currentDemo = demoData.find(demo => demo.mode === activeMode) || demoData[0];

  return (
    <section ref={sectionRef} className="py-24 bg-landing-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="landing-theme text-3xl md:text-4xl lg:text-5xl font-bold text-landing-white mb-6">
            See the magic in action
          </h2>
          <p className="subhead text-landing-white/80 max-w-3xl mx-auto">
            Watch how PromptBrain transforms vague ideas into professional-grade prompts. Choose a mode below to see the difference.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ModeToggle 
            modes={demoData} 
            activeMode={activeMode} 
            onModeChange={setActiveMode} 
          />
        </motion.div>

        {/* Demo Description */}
        <motion.div
          key={activeMode}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="landing-theme text-xl font-semibold text-landing-white mb-2">
            {currentDemo.title}
          </h3>
          <p className="text-landing-white/70">
            {currentDemo.description}
          </p>
        </motion.div>

        {/* Split Screen Demo */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Before - Raw Prompt */}
          <div className="group">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-landing-white/[0.03] border border-landing-white/10 rounded-full text-sm text-landing-white/60">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Before: Raw Input
              </span>
            </div>
            <AnimatePresence mode="wait">
              <PromptCard
                key={`raw-${activeMode}`}
                title="Your original prompt"
                content={currentDemo.rawPrompt}
                isEnhanced={false}
                isVisible={inView}
              />
            </AnimatePresence>
          </div>

          {/* After - Enhanced Prompt */}
          <div className="group">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-landing-blue/10 border border-landing-blue/20 rounded-full text-sm text-landing-blue">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                After: PromptBrain Enhanced
              </span>
            </div>
            <AnimatePresence mode="wait">
              <PromptCard
                key={`enhanced-${activeMode}`}
                title="AI-enhanced version"
                content={currentDemo.enhancedPrompt}
                isEnhanced={true}
                isVisible={inView}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-landing-white/60 mb-6">
            Ready to transform your prompts?
          </p>
          <button className="premium-hover bg-landing-blue hover:bg-landing-blue/90 text-landing-white px-8 py-4 rounded-full font-semibold transition-all duration-300">
            Start Enhancing Free
          </button>
        </motion.div>
      </div>

      {/* Floating particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-landing-blue/40 rounded-full"
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${20 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 6 + (i * 0.5),
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.6);
        }
      `}</style>
    </section>
  );
}