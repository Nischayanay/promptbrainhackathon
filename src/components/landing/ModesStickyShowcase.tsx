import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";

type Mode = 'direct' | 'flow';

interface ModeDemo {
  direct: {
    input: string;
    output: string;
  };
  flow: {
    questions: Array<{ q: string; a: string }>;
    output: string;
  };
}

const demoContent: ModeDemo = {
  direct: {
    input: "Write a product announcement",
    output: `# Enhanced Prompt

Write a compelling product announcement for [Product Name], a [product category] targeting [target audience]. 

**Structure:**
1. Attention-grabbing headline
2. Problem/pain point identification  
3. Product introduction & key benefits
4. Social proof or credibility markers
5. Clear call-to-action with urgency

**Tone:** Professional yet approachable, benefits-focused
**Length:** 300-400 words
**Format:** Email/blog post ready

Include specific details about features, pricing, and availability timeframe.`
  },
  flow: {
    questions: [
      { q: "What type of content are you creating?", a: "Product announcement email" },
      { q: "Who is your target audience?", a: "B2B marketing managers" },
      { q: "What's the main goal?", a: "Drive sign-ups for our new analytics tool" },
      { q: "What tone should this have?", a: "Professional but conversational" }
    ],
    output: `# Forged Prompt

Write a product announcement email for marketing managers at B2B companies, introducing our new analytics dashboard "InsightFlow."

**Objective:** Drive sign-ups for 14-day free trial

**Structure:**
1. Subject line with intrigue (avoid spam triggers)
2. Personal greeting acknowledging their measurement challenges
3. Problem: Current analytics tools are too complex/expensive
4. Solution: InsightFlow's simple, affordable dashboard
5. 3 key benefits with specific outcomes
6. Social proof from similar companies
7. Risk-free trial CTA with time-sensitive bonus

**Tone:** Professional but conversational, peer-to-peer
**Length:** 250-300 words  
**Key metrics to highlight:** Time savings, cost reduction, accuracy improvement
**CTA:** "Start Your Free 14-Day Trial + Get Our Marketing ROI Template"`
  }
};

export function ModesStickyShowcase() {
  const [activeMode, setActiveMode] = useState<Mode>('direct');
  const [animationKey, setAnimationKey] = useState(0);

  const handleModeToggle = (mode: Mode) => {
    if (mode !== activeMode) {
      setActiveMode(mode);
      setAnimationKey(prev => prev + 1);
    }
  };

  return (
    <section id="modes-showcase" className="relative py-32 bg-chronicle-black">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="chronicle-theme mb-6">
            Two paths to better prompts
          </h2>
          <p className="text-chronicle-white/70 body max-w-2xl mx-auto">
            Choose your workflow: instant enhancement or guided conversation.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-chronicle-gray-200/50 p-2 chronicle-radius-pill border border-chronicle-white/10 backdrop-blur-sm">
            <div className="relative flex">
              {/* Toggle Background */}
              <motion.div
                className="absolute inset-y-1 bg-gradient-to-r from-gradient-blue to-gradient-purple chronicle-radius-pill"
                animate={{
                  x: activeMode === 'direct' ? 4 : '100%',
                  width: activeMode === 'direct' ? 'calc(50% - 8px)' : 'calc(50% - 8px)'
                }}
                transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
              />
              
              {/* Toggle Buttons */}
              <button
                onClick={() => handleModeToggle('direct')}
                className={`relative z-10 px-8 py-3 font-medium transition-colors duration-200 chronicle-radius-pill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  activeMode === 'direct' 
                    ? 'text-chronicle-white' 
                    : 'text-chronicle-white/60 hover:text-chronicle-white/80'
                }`}
              >
                Direct
              </button>
              <button
                onClick={() => handleModeToggle('flow')}
                className={`relative z-10 px-8 py-3 font-medium transition-colors duration-200 chronicle-radius-pill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  activeMode === 'flow' 
                    ? 'text-chronicle-white' 
                    : 'text-chronicle-white/60 hover:text-chronicle-white/80'
                }`}
              >
                Flow
              </button>
            </div>
          </div>
        </div>

        {/* Mode Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            className={`text-center transition-opacity duration-300 ${
              activeMode === 'direct' ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <h3 className="text-xl font-semibold text-chronicle-white mb-2">Direct Mode</h3>
            <p className="text-chronicle-white/60 text-sm">
              Paste your thought. Get an elevated prompt.
            </p>
          </motion.div>
          
          <motion.div
            className={`text-center transition-opacity duration-300 ${
              activeMode === 'flow' ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <h3 className="text-xl font-semibold text-chronicle-white mb-2">Flow Mode</h3>
            <p className="text-chronicle-white/60 text-sm">
              Answer 4 quick questions. Forge a precise brief.
            </p>
          </motion.div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-chronicle-gray-200/30 chronicle-radius-card p-8 border border-chronicle-white/10 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {activeMode === 'direct' && (
              <motion.div
                key={`direct-${animationKey}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                className="space-y-8"
              >
                {/* Input */}
                <div>
                  <label className="block text-chronicle-white/60 text-sm mb-3">
                    Your rough idea:
                  </label>
                  <div className="bg-chronicle-black/40 chronicle-radius-card p-4 border border-chronicle-white/10">
                    <p className="text-chronicle-white/80 font-mono">
                      {demoContent.direct.input}
                    </p>
                  </div>
                </div>

                {/* Transform Arrow */}
                <div className="flex justify-center">
                  <motion.div
                    className="px-6 py-2 bg-gradient-to-r from-gradient-blue to-gradient-purple chronicle-radius-pill text-chronicle-white text-sm font-medium"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ Enhanced instantly
                  </motion.div>
                </div>

                {/* Output */}
                <div>
                  <label className="block text-chronicle-white/60 text-sm mb-3">
                    Your enhanced prompt:
                  </label>
                  <div className="bg-gradient-to-br from-gradient-blue/10 to-gradient-purple/10 chronicle-radius-card p-6 border border-gradient-blue/20">
                    <pre className="text-chronicle-white/90 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {demoContent.direct.output}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMode === 'flow' && (
              <motion.div
                key={`flow-${animationKey}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                className="space-y-8"
              >
                {/* Questions */}
                <div>
                  <label className="block text-chronicle-white/60 text-sm mb-4">
                    Guided questions:
                  </label>
                  <div className="space-y-4">
                    {demoContent.flow.questions.map((qa, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-chronicle-black/40 chronicle-radius-card p-4 border border-chronicle-white/10"
                      >
                        <p className="text-chronicle-white/70 text-sm mb-2">{qa.q}</p>
                        <p className="text-chronicle-white font-mono text-sm">{qa.a}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Transform Arrow */}
                <div className="flex justify-center">
                  <motion.div
                    className="px-6 py-2 bg-gradient-to-r from-gradient-blue to-gradient-purple chronicle-radius-pill text-chronicle-white text-sm font-medium"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔥 Forged from answers
                  </motion.div>
                </div>

                {/* Output */}
                <div>
                  <label className="block text-chronicle-white/60 text-sm mb-3">
                    Your forged prompt:
                  </label>
                  <div className="bg-gradient-to-br from-gradient-blue/10 to-gradient-purple/10 chronicle-radius-card p-6 border border-gradient-blue/20">
                    <pre className="text-chronicle-white/90 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {demoContent.flow.output}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            className="px-8 py-4 bg-gradient-to-r from-gradient-blue to-gradient-purple text-chronicle-white font-medium chronicle-radius-pill chronicle-easing chronicle-duration-medium hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Try Both Modes Free
          </Button>
        </div>
      </div>
    </section>
  );
}