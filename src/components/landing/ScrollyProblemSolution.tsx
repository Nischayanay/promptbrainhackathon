import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const problemSteps = [
  {
    id: 1,
    title: "Vague in, vague out.",
    description: "You type a rushed idea. AI gives you generic, unfocused responses that miss the mark.",
    before: {
      prompt: "Write me a marketing email",
      output: "Dear Customer,\n\nWe have a new product. It's great. You should buy it.\n\nThanks!"
    },
    after: {
      prompt: "Write a compelling product launch email for busy entrepreneurs introducing our AI-powered project management tool, emphasizing time-saving benefits with social proof and a limited-time 30% discount.",
      output: "Subject: Finally, project management that works as fast as you do\n\nHi Sarah,\n\nI know you're juggling 15 projects right now (been there).\n\nThat's why I'm excited to share TaskFlow AI – the project management tool that actually keeps up with entrepreneurs like you.\n\n✓ 47% faster project completion (verified by 1,200+ users)\n✓ AI-powered task prioritization\n✓ One-click team alignment\n\n'TaskFlow cut my planning time from 3 hours to 20 minutes' – Maria Chen, StartupLab\n\n30% off ends Friday →\n[Get TaskFlow AI]"
    }
  },
  {
    id: 2,
    title: "Generic tone. Generic results.",
    description: "Your prompts lack personality and context. The output sounds like everyone else's.",
    before: {
      prompt: "Write a blog post about productivity",
      output: "Productivity is important. Here are some tips:\n\n1. Make a to-do list\n2. Set priorities\n3. Take breaks\n\nConclusion: Being productive helps you achieve your goals."
    },
    after: {
      prompt: "Write a 800-word blog post for burned-out remote workers about sustainable productivity, using a warm, empathetic tone with actionable micro-habits they can implement in under 5 minutes daily.",
      output: "# The 5-Minute Revolution: Productivity for the Perpetually Exhausted\n\nIf you're reading this at 11 PM with seventeen browser tabs open, wondering where your day went – this one's for you.\n\nI'm not here to tell you to wake up at 5 AM or meditate for an hour. You're tired, not broken. You need micro-changes, not life overhauls.\n\n## The Problem With Productivity Advice\n\nMost productivity content assumes you have endless energy..."
    }
  },
  {
    id: 3,
    title: "Time lost to rewrites.",
    description: "You spend more time fixing AI outputs than if you'd written it yourself.",
    before: {
      prompt: "Create a social media strategy",
      output: "Post content regularly. Use hashtags. Engage with followers. Measure results. Repeat."
    },
    after: {
      prompt: "Create a 30-day Instagram content strategy for a sustainable fashion brand targeting eco-conscious millennials, including specific post types, optimal posting times, relevant hashtags, and engagement tactics to build an authentic community.",
      output: "# 30-Day Instagram Strategy: EcoStyle Brand\n\n## Week 1-2: Foundation Building\n**Monday/Wednesday/Friday**: Behind-the-scenes content\n- Show sustainable fabric sourcing\n- Highlight artisan partnerships\n- Best times: 11 AM, 2 PM, 5 PM EST\n\n**Tuesday/Thursday**: Educational carousels\n- 'Fast Fashion vs. Sustainable' comparisons\n- Care tips for lasting garments\n\n## Hashtag Strategy\nPrimary: #SustainableFashion #EcoStyle #SlowFashion\nNiche: #EthicalMade #PlantDyed #ZeroWasteCloset..."
    }
  }
];

export function ScrollyProblemSolution() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Transform scroll progress to step index
  const stepProgress = useTransform(scrollYProgress, [0, 1], [0, problemSteps.length - 1]);

  useEffect(() => {
    return stepProgress.on("change", (progress) => {
      const newStep = Math.min(Math.floor(progress), problemSteps.length - 1);
      setActiveStep(Math.max(0, newStep));
    });
  }, [stepProgress]);

  return (
    <section ref={containerRef} className="relative py-32 bg-chronicle-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: Problem Steps (Sticky) */}
          <div className="space-y-24">
            {problemSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`transition-all duration-500 ${
                  activeStep === index ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition-colors duration-300 ${
                    activeStep === index 
                      ? 'border-gradient-blue bg-gradient-blue text-chronicle-white' 
                      : 'border-chronicle-white/20 text-chronicle-white/40'
                  }`}>
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-chronicle-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-chronicle-white/70 body">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Before/After Demo (Changes per step) */}
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <div className="bg-chronicle-gray-200/50 chronicle-radius-card p-8 backdrop-blur-sm border border-chronicle-white/10">
              
              {/* Step Indicator */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex gap-2">
                  {problemSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeStep ? 'bg-gradient-blue w-6' : 'bg-chronicle-white/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-chronicle-white/60 text-sm">
                  Step {activeStep + 1} of {problemSteps.length}
                </span>
              </div>

              {/* Before/After Comparison */}
              <div className="space-y-8">
                
                {/* Before */}
                <motion.div
                  key={`before-${activeStep}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
                  className="bg-chronicle-black/30 chronicle-radius-card p-6 border border-chronicle-white/5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-chronicle-white/50 text-sm font-medium">Before</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-chronicle-white/40 text-sm mb-2">Prompt:</p>
                      <p className="text-chronicle-white/80 font-mono text-sm bg-chronicle-black/50 p-3 rounded-lg">
                        "{problemSteps[activeStep].before.prompt}"
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-chronicle-white/40 text-sm mb-2">Output:</p>
                      <div className="text-chronicle-white/60 text-sm bg-chronicle-black/50 p-3 rounded-lg whitespace-pre-line font-mono">
                        {problemSteps[activeStep].before.output}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-gradient-blue to-gradient-purple flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <svg className="w-4 h-4 text-chronicle-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </div>

                {/* After */}
                <motion.div
                  key={`after-${activeStep}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
                  className="bg-gradient-to-br from-gradient-blue/10 to-gradient-purple/10 chronicle-radius-card p-6 border border-gradient-blue/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-gradient-blue rounded-full"></div>
                    <span className="text-chronicle-white font-medium text-sm">After PromptBrain</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-chronicle-white/40 text-sm mb-2">Enhanced Prompt:</p>
                      <p className="text-chronicle-white font-mono text-sm bg-chronicle-black/30 p-3 rounded-lg border border-gradient-blue/20">
                        "{problemSteps[activeStep].after.prompt}"
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-chronicle-white/40 text-sm mb-2">Better Output:</p>
                      <div className="text-chronicle-white/90 text-sm bg-chronicle-black/30 p-3 rounded-lg whitespace-pre-line font-mono border border-gradient-blue/20">
                        {problemSteps[activeStep].after.output}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Solution Label */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <p className="text-gradient-blue font-medium">
                  PromptBrain tightens scope, tone, and structure.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}