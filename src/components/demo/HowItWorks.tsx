import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { StepInput } from "./StepInput";
import { StepProcessing } from "./StepProcessing";
import { StepOutput } from "./StepOutput";
import { ModeToggle } from "./ModeToggle";

export type DemoMode = "general" | "research" | "product";

interface DemoData {
  mode: DemoMode;
  title: string;
  inputText: string;
  outputText: string;
}

const demoData: DemoData[] = [
  {
    mode: "general",
    title: "General Enhancement",
    inputText: "write something about AI for my blog",
    outputText: "Create a comprehensive 1,500-word blog post titled 'The Future of AI in Everyday Life: 5 Ways Artificial Intelligence Will Transform Your Daily Routine by 2025.'\n\nStructure the post with:\n- Engaging introduction with a relatable scenario\n- 5 detailed sections covering specific AI applications (smart homes, healthcare, transportation, work productivity, entertainment)\n- Real-world examples and case studies for each application\n- Balanced discussion of benefits and potential concerns\n- Conclusion with actionable insights for readers\n\nTone: Informative yet accessible, avoiding technical jargon while maintaining credibility. Target audience: General consumers interested in technology trends."
  },
  {
    mode: "research",
    title: "Research Mode",
    inputText: "research climate change impact",
    outputText: "Conduct a comprehensive literature review analyzing the socioeconomic impacts of climate change on coastal communities in Southeast Asia from 2010-2024.\n\nResearch Parameters:\n- Primary focus: Economic displacement, agricultural productivity, and migration patterns\n- Methodology: Systematic review of peer-reviewed journals, government reports, and NGO studies\n- Geographic scope: Indonesia, Philippines, Vietnam, Thailand, and Myanmar\n- Key databases: JSTOR, ScienceDirect, Google Scholar, World Bank Open Data\n\nDeliverables:\n1. Executive summary (500 words)\n2. Detailed analysis with statistical correlations\n3. Case study comparisons between 3 representative coastal regions\n4. Policy recommendations based on successful adaptation strategies\n5. Bibliography with 25+ credible sources\n\nEvaluation criteria: Data reliability, methodological rigor, and practical applicability of findings."
  },
  {
    mode: "product",
    title: "Product Spec Mode",
    inputText: "build a mobile app for fitness",
    outputText: "Product Requirements Document: FitTrack Pro - Comprehensive Fitness Mobile Application\n\nCore Features:\n• Workout Planning: Custom routines, exercise library (500+ exercises), progressive overload tracking\n• Nutrition Tracking: Calorie counter, macro management, meal planning, barcode scanner\n• Progress Analytics: Body metrics, performance graphs, photo progress, strength progression\n• Social Features: Community challenges, workout sharing, trainer connections\n\nTechnical Specifications:\n• Platform: React Native (iOS/Android)\n• Backend: Node.js with PostgreSQL database\n• Authentication: OAuth 2.0, biometric login\n• Integrations: Apple Health, Google Fit, Fitbit, MyFitnessPal API\n• Offline Capability: Local data sync, cached workouts\n\nUser Experience:\n• Onboarding: 3-step goal setting, fitness assessment\n• Navigation: Tab-based with quick-action floating button\n• Accessibility: WCAG 2.1 AA compliance, voice commands\n\nSuccess Metrics: 80% user retention after 30 days, 4.5+ app store rating, 50% feature adoption rate"
  }
];

export function HowItWorks() {
  const [activeMode, setActiveMode] = useState<DemoMode>("general");
  const [currentStep, setCurrentStep] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Calculate which step should be active based on scroll
  const stepProgress = useTransform(scrollYProgress, [0, 1], [0, 3]);
  
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    return stepProgress.on("change", (progress) => {
      const newStep = Math.min(Math.floor(progress), 2);
      setCurrentStep(Math.max(0, newStep));
    });
  }, [stepProgress, prefersReducedMotion]);

  const currentDemo = demoData.find(demo => demo.mode === activeMode) || demoData[0];

  const handleReplay = () => {
    setIsReplaying(true);
    setCurrentStep(0);
    
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    setTimeout(() => setIsReplaying(false), 1000);
  };

  const handleModeChange = (mode: DemoMode) => {
    setActiveMode(mode);
    // Reset to first step when changing modes
    setCurrentStep(0);
  };

  return (
    <section ref={containerRef} className="relative min-h-[400vh] bg-landing-black overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="landing-theme text-3xl md:text-4xl lg:text-5xl font-bold text-landing-white mb-6">
              How it works
            </h2>
            <p className="subhead text-landing-white/80 max-w-3xl mx-auto mb-8">
              Watch the magic unfold as chaos transforms into clarity through our AI-powered enhancement process.
            </p>
            
            {/* Mode Toggle */}
            <ModeToggle 
              activeMode={activeMode}
              onModeChange={handleModeChange}
              demoData={demoData}
            />
          </motion.div>

          {/* Main Demo Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center min-h-[60vh]">
            
            {/* Step 1: Input (Chaos) */}
            <div className="relative">
              <StepInput
                isActive={currentStep >= 0}
                inputText={currentDemo.inputText}
                isReplaying={isReplaying}
              />
            </div>

            {/* Step 2: Processing (Magic) */}
            <div className="relative">
              <StepProcessing
                isActive={currentStep >= 1}
                isReplaying={isReplaying}
              />
            </div>

            {/* Step 3: Output (Clarity) */}
            <div className="relative">
              <StepOutput
                isActive={currentStep >= 2}
                outputText={currentDemo.outputText}
                mode={activeMode}
                isReplaying={isReplaying}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <motion.div 
            className="flex justify-center items-center gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    currentStep >= step 
                      ? 'bg-landing-blue shadow-lg shadow-landing-blue/50' 
                      : 'bg-landing-white/20'
                  }`}
                />
                {step < 2 && (
                  <div 
                    className={`w-12 h-px mx-2 transition-all duration-500 ${
                      currentStep > step ? 'bg-landing-blue' : 'bg-landing-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </motion.div>

          {/* Replay Button */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <button
              onClick={handleReplay}
              disabled={isReplaying}
              className="inline-flex items-center gap-2 px-6 py-3 bg-landing-white/[0.05] hover:bg-landing-white/[0.1] border border-landing-white/20 rounded-full text-landing-white/80 hover:text-landing-white transition-all duration-300 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${isReplaying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isReplaying ? 'Replaying...' : 'Replay Animation'}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Ambient Particles */}
      {!prefersReducedMotion && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-landing-blue/30 rounded-full"
              style={{
                left: `${10 + (i * 8)}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.1, 0.6, 0.1],
                scale: [1, 1.8, 1],
              }}
              transition={{
                duration: 8 + (i * 0.5),
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}