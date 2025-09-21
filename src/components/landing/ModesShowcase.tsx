import { motion } from "framer-motion";
import { useState } from "react";
import { Edit3, Compass, Zap, ArrowRight } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export function ModesShowcase() {
  const [activeMode, setActiveMode] = useState<'direct' | 'flow'>('direct');

  const modes = {
    direct: {
      icon: Edit3,
      title: "Direct Mode",
      subtitle: "Type + Enhance",
      description: "Paste your rough idea and get an instantly enhanced prompt.",
      demo: {
        input: "Write a landing page for my app",
        output: "Create a high-converting landing page for a B2B SaaS productivity app targeting remote teams (50-200 employees). Include: compelling hero headline emphasizing time savings, social proof section with customer logos, three key feature benefits with icons, pricing table with 3 tiers, FAQ section addressing security concerns, and strong CTAs throughout. Optimize for conversion with A/B testing recommendations for headline and CTA button colors."
      }
    },
    flow: {
      icon: Compass,
      title: "Flow Mode", 
      subtitle: "Step-by-step Q&A",
      description: "Answer guided questions to build the perfect prompt systematically.",
      demo: {
        questions: [
          "What type of content are you creating?",
          "Who is your target audience?", 
          "What's the main goal or outcome?",
          "Any specific requirements or constraints?"
        ],
        result: "Based on your answers, we'll generate a comprehensive prompt tailored to your exact needs."
      }
    }
  };

  return (
    <section className="py-24 bg-chronicle-black text-chronicle-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(58, 141, 255, 0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Two powerful ways to
            <span className="block bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
              enhance prompts
            </span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Choose the approach that fits your workflow and experience level.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex gap-2">
            {Object.entries(modes).map(([key, mode]) => (
              <Button
                key={key}
                variant={activeMode === key ? "default" : "ghost"}
                onClick={() => setActiveMode(key as 'direct' | 'flow')}
                className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  activeMode === key 
                    ? 'bg-gradient-to-r from-gradient-blue to-gradient-purple text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <mode.icon className="w-4 h-4" />
                {mode.title}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Mode Content */}
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gradient-blue to-gradient-purple rounded-xl flex items-center justify-center">
                {activeMode === 'direct' ? (
                  <Edit3 className="w-6 h-6 text-white" />
                ) : (
                  <Compass className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{modes[activeMode].title}</h3>
                <p className="text-gradient-blue font-medium">{modes[activeMode].subtitle}</p>
              </div>
            </div>
            
            <p className="text-lg text-white/80 leading-relaxed">
              {modes[activeMode].description}
            </p>

            <div className="flex items-center gap-2 text-gradient-blue">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Instant results</span>
            </div>
          </div>

          {/* Right: Interactive Demo */}
          <div className="space-y-4">
            {activeMode === 'direct' ? (
              <>
                <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-gradient-blue/30 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Edit3 className="w-4 h-4" />
                      Your input
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-white/90">
                      "{modes.direct.demo.input}"
                    </div>
                  </div>
                </Card>

                <div className="flex justify-center">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-gradient-blue rotate-90" />
                  </motion.div>
                </div>

                <Card className="p-6 bg-gradient-to-br from-gradient-blue/10 to-gradient-purple/10 border-gradient-blue/30">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gradient-blue text-sm font-medium">
                      <Zap className="w-4 h-4" />
                      Enhanced prompt
                    </div>
                    <div className="text-white/90 leading-relaxed">
                      "{modes.direct.demo.output}"
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-gradient-blue text-sm font-medium">
                    <Compass className="w-4 h-4" />
                    Guided questions
                  </div>
                  
                  <div className="space-y-3">
                    {modes.flow.demo.questions.map((question, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 text-white/80"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-gradient-blue to-gradient-purple rounded-full flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>
                        {question}
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-white/70 italic">
                      {modes.flow.demo.result}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}