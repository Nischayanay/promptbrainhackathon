import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";

const demoSteps = [
  {
    id: 'input',
    title: 'Input Raw Prompt',
    description: 'Start with any messy, unclear prompt',
    example: 'Write something about AI',
    icon: Target,
    theme: 'input'
  },
  {
    id: 'processing',
    title: 'AI Enhancement',
    description: 'Our engine architects your prompt for maximum clarity',
    example: 'Analyzing structure, context, and intent...',
    icon: Sparkles,
    theme: 'processing'
  },
  {
    id: 'output',
    title: 'Optimized Output',
    description: '10× clearer, structured prompt ready to use',
    example: 'Write a comprehensive 500-word article about artificial intelligence applications in healthcare, focusing on diagnostic accuracy improvements, patient outcome benefits, and implementation challenges. Include specific examples and cite recent research.',
    icon: Zap,
    theme: 'output'
  }
];

interface HowItWorksDemoProps {
  onStartEnhancing?: () => void;
}

export function HowItWorksDemo({ onStartEnhancing }: HowItWorksDemoProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Auto-advance through steps for demo effect
  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setActiveStep((current) => (current + 1) % demoSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView, prefersReducedMotion]);

  return (
    <section 
      ref={containerRef}
      className="relative py-24 bg-gradient-to-b from-landing-black via-gray-950 to-landing-black overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Floating Particles */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-landing-blue/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1],
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

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-landing-white">
            How It{' '}
            <span className="shimmer-text-blue inline-block">
              Works
            </span>
          </h2>
          <p className="subhead text-landing-white/80 max-w-3xl mx-auto text-lg md:text-xl">
            Three steps to transform any prompt into a precision-engineered AI instruction
          </p>
        </motion.div>

        {/* Interactive Demo Steps */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {demoSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            const isPast = activeStep > index;
            const isFuture = activeStep < index;

            return (
              <motion.div
                key={step.id}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.25, 0.1, 0.25, 1] 
                }}
                onClick={() => setActiveStep(index)}
              >
                {/* Connection Line */}
                {index < demoSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-12 h-px z-10">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-landing-white/10" />
                      <motion.div
                        className="absolute inset-0 bg-landing-blue"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isPast ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{ transformOrigin: 'left' }}
                      />
                      <ArrowRight 
                        className="absolute -right-2 -top-2 w-4 h-4 text-landing-blue"
                        style={{ opacity: isPast ? 1 : 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* Step Card */}
                <div 
                  className={`relative bg-landing-white/5 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? 'border-landing-blue/50 shadow-2xl shadow-landing-blue/10 bg-landing-white/8' 
                      : isPast
                      ? 'border-landing-white/20 bg-landing-white/3'
                      : 'border-landing-white/10 hover:border-landing-white/20'
                  }`}
                >
                  {/* Step Number & Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive 
                          ? 'bg-landing-blue text-landing-white shadow-lg shadow-landing-blue/30' 
                          : isPast
                          ? 'bg-landing-blue/80 text-landing-white'
                          : 'bg-landing-white/10 text-landing-white/60'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      {isActive && !prefersReducedMotion && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-landing-blue"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.8, 0.3, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="text-sm font-mono text-landing-blue/80">
                      Step {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-landing-white">
                      {step.title}
                    </h3>
                    <p className="text-landing-white/70">
                      {step.description}
                    </p>
                    
                    {/* Example Box */}
                    <div 
                      className={`mt-6 p-4 rounded-xl border font-mono text-sm transition-all duration-500 ${
                        step.theme === 'input' 
                          ? 'bg-red-950/20 border-red-500/20 text-red-300/80' 
                          : step.theme === 'processing'
                          ? 'bg-yellow-950/20 border-yellow-500/20 text-yellow-300/80'
                          : 'bg-green-950/20 border-green-500/20 text-green-300/80'
                      }`}
                    >
                      {isActive && step.theme === 'processing' ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="w-2 h-2 bg-yellow-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            {step.example}
                          </div>
                        </motion.div>
                      ) : (
                        step.example
                      )}
                    </div>
                  </div>

                  {/* Active Glow Effect */}
                  {isActive && !prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border border-landing-blue/30"
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ filter: 'blur(1px)' }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <motion.div
          className="flex justify-center items-center gap-3 mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {demoSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeStep === index 
                  ? 'bg-landing-blue shadow-lg shadow-landing-blue/50' 
                  : 'bg-landing-white/20 hover:bg-landing-white/40'
              }`}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="text-landing-white/60 mb-6">
            Ready to experience the transformation?
          </p>
          <motion.button
            onClick={onStartEnhancing}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-landing-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-landing-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-landing-blue/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5" />
            Try PromptBrain Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}