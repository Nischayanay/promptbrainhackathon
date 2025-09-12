import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ModeCard } from "./ModeCard";

export function StickyModes() {
  const [activeMode, setActiveMode] = useState<'direct' | 'flow'>('direct');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-100px" });

  const handleModeChange = (mode: 'direct' | 'flow') => {
    setActiveMode(mode);
  };

  return (
    <section ref={containerRef} className="relative py-32 bg-landing-gray">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="landing-theme text-3xl md:text-4xl text-landing-black mb-6"
          >
            Choose your path
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="landing-theme text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Two powerful ways to enhance your prompts, designed for different workflows and thinking styles.
          </motion.p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
            <div className="relative flex">
              {/* Toggle Background */}
              <motion.div
                className="absolute inset-y-1 bg-landing-black rounded-full"
                animate={{
                  x: activeMode === 'direct' ? 4 : '100%',
                  width: activeMode === 'direct' ? 'calc(50% - 8px)' : 'calc(50% - 8px)'
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              />
              
              {/* Toggle Buttons */}
              <button
                onClick={() => handleModeChange('direct')}
                className={`relative z-10 px-6 py-3 font-semibold transition-colors duration-200 rounded-full ${
                  activeMode === 'direct' ? 'text-landing-white' : 'text-gray-600'
                }`}
              >
                Direct Mode
              </button>
              <button
                onClick={() => handleModeChange('flow')}
                className={`relative z-10 px-6 py-3 font-semibold transition-colors duration-200 rounded-full ${
                  activeMode === 'flow' ? 'text-landing-white' : 'text-gray-600'
                }`}
              >
                Flow Mode
              </button>
            </div>
          </div>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <ModeCard
            mode="direct"
            isActive={activeMode === 'direct'}
            onActivate={() => handleModeChange('direct')}
          />
          <ModeCard
            mode="flow"
            isActive={activeMode === 'flow'}
            onActivate={() => handleModeChange('flow')}
          />
        </div>
      </div>
    </section>
  );
}