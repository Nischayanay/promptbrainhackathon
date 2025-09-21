import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const processSteps = [
  {
    id: 1,
    title: "Type",
    description: "Paste your rough idea or answer guided questions",
    icon: "✍️",
    color: "from-gradient-blue to-blue-500"
  },
  {
    id: 2,
    title: "Forge", 
    description: "AI analyzes context, tone, and structure needs",
    icon: "🔥",
    color: "from-gradient-purple to-purple-500"
  },
  {
    id: 3,
    title: "Copy",
    description: "Get your enhanced prompt in English or JSON",
    icon: "📋",
    color: "from-emerald-500 to-green-500"
  }
];

export function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      // Stagger the step animations
      const timer = setTimeout(() => {
        setActiveStep(0);
        const interval = setInterval(() => {
          setActiveStep(prev => {
            if (prev < processSteps.length - 1) {
              return prev + 1;
            } else {
              clearInterval(interval);
              return prev;
            }
          });
        }, 300);
        
        return () => clearInterval(interval);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section ref={containerRef} className="relative py-32 bg-chronicle-black">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="chronicle-theme mb-6">
            Simple process, powerful results
          </h2>
          <p className="text-chronicle-white/70 body">
            From rough idea to refined prompt in seconds.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-24 left-0 right-0 h-0.5 bg-chronicle-white/10">
            {/* Animated Progress Line */}
            <motion.div
              className="h-full bg-gradient-to-r from-gradient-blue via-gradient-purple to-emerald-500"
              initial={{ width: "0%" }}
              animate={isInView ? { width: "100%" } : { width: "0%" }}
              transition={{ 
                duration: 0.9,
                delay: 0.3,
                ease: [0.2, 0.8, 0.2, 1]
              }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={activeStep >= index ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: [0.2, 0.8, 0.2, 1]
                }}
              >
                {/* Step Circle */}
                <motion.div
                  className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl relative z-10`}
                  initial={{ scale: 0 }}
                  animate={activeStep >= index ? { scale: 1 } : { scale: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.2 + 0.2,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {step.icon}
                  
                  {/* Glow Effect */}
                  {activeStep >= index && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-gradient-blue/30 to-gradient-purple/30 blur-xl"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>

                {/* Step Number */}
                <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-2 bg-chronicle-black flex items-center justify-center text-sm font-semibold transition-all duration-300 z-20 ${
                  activeStep >= index
                    ? 'border-gradient-blue text-gradient-blue'
                    : 'border-chronicle-white/20 text-chronicle-white/40'
                }`}>
                  {step.id}
                </div>

                {/* Step Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={activeStep >= index ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.2 + 0.4
                  }}
                >
                  <h3 className="text-xl font-semibold text-chronicle-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-chronicle-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={activeStep >= processSteps.length - 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ 
            duration: 0.6,
            delay: 1.2
          }}
        >
          <p className="text-chronicle-white/50 text-sm">
            Average enhancement time: <span className="text-gradient-blue font-medium">2.3 seconds</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}