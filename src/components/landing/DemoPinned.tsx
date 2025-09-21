import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DemoCard } from "./DemoCard";

const demoSteps = [
  {
    id: 1,
    title: "Enhanced Structure",
    description: "What PromptBrain adds",
    before: {
      prompt: "create a blog post about productivity",
      issues: ["Generic topic", "No angle", "Unclear purpose"]
    },
    after: {
      prompt: "Write a 1200-word blog post for remote workers struggling with focus, titled 'The 5-Minute Rule: How Micro-Productivity Beats Marathon Sessions.' Include actionable techniques, scientific backing, and real examples. Target tone: encouraging but realistic. Include subheadings and a compelling introduction that hooks burned-out professionals.",
      improvements: ["Specific angle", "Clear structure", "Target emotion"]
    }
  },
  {
    id: 2,
    title: "AI-Ready Output",
    description: "Ready for better results",
    before: {
      prompt: "help me write code",
      issues: ["No language specified", "No context", "Unclear goal"]
    },
    after: {
      prompt: "Write a Python function that processes CSV files containing user analytics data. Requirements: handle missing values, calculate monthly retention rates, export summary statistics to JSON. Include error handling, type hints, and docstrings. Optimize for files up to 100MB. Provide usage examples.",
      improvements: ["Technical specifics", "Clear requirements", "Complete scope"]
    }
  }
];

export function DemoPinned() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const stepProgress = useTransform(scrollYProgress, [0, 1], [0, demoSteps.length - 1]);

  useEffect(() => {
    return stepProgress.on("change", (progress) => {
      const newStep = Math.min(Math.floor(progress), demoSteps.length - 1);
      setActiveStep(Math.max(0, newStep));
    });
  }, [stepProgress]);

  return (
    <section ref={containerRef} className="relative min-h-[300vh] bg-landing-black">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Copy that changes */}
            <div className="space-y-8">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="landing-theme text-3xl md:text-4xl mb-4">
                  {demoSteps[activeStep].title}
                </h2>
                <p className="landing-theme text-xl text-landing-white/60">
                  {demoSteps[activeStep].description}
                </p>
              </motion.div>

              {/* Progress indicator */}
              <div className="flex gap-3">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index <= activeStep ? 'bg-landing-white w-8' : 'bg-landing-white/20 w-4'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Demo card that morphs */}
            <div className="lg:ml-auto">
              <DemoCard
                step={demoSteps[activeStep]}
                isActive={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}