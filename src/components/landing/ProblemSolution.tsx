import { motion } from "motion/react";
import { X, Check, ArrowRight } from "lucide-react";
import { Card } from "../ui/card";

export function ProblemSolution() {
  const problems = [
    "Vague prompts that waste time",
    "Inconsistent AI responses", 
    "Missing context and specificity",
    "No systematic approach"
  ];

  const solutions = [
    {
      title: "Enhanced Precision",
      before: "Write a blog post about AI",
      after: "Create a comprehensive 2,000-word blog post analyzing the transformative impact of generative AI on modern business operations, including specific case studies from healthcare, finance, and education sectors, targeting C-level executives with actionable insights and implementation strategies."
    },
    {
      title: "Contextual Intelligence", 
      before: "Help me with marketing",
      after: "Develop a comprehensive B2B SaaS marketing strategy for a fintech startup targeting mid-market companies (100-1000 employees), focusing on account-based marketing tactics, content pillars around regulatory compliance and ROI optimization, with specific KPIs and a 90-day implementation roadmap."
    }
  ];

  return (
    <section className="py-24 bg-chronicle-white text-chronicle-black">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Pain Points */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-chronicle-black mb-6 leading-tight">
                Stop wasting time on
                <span className="block text-gradient-blue">bad prompts</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Most people struggle with creating effective AI prompts, leading to frustration and poor results.
              </p>
            </div>

            <div className="space-y-4">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-base">{problem}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Solution Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <Check className="w-6 h-6 text-green-500" />
              <h3 className="text-2xl font-semibold">PromptBrain transforms them</h3>
            </div>

            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-white border border-gray-200 hover:border-gradient-blue/30 transition-colors duration-300 hover:shadow-lg">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-chronicle-black">{solution.title}</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Before</div>
                        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border">
                          {solution.before}
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <ArrowRight className="w-4 h-4 text-gradient-blue" />
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-gradient-blue mb-1 uppercase tracking-wide">After</div>
                        <div className="text-sm text-chronicle-black bg-gradient-to-r from-gradient-blue/5 to-gradient-purple/5 rounded-lg p-3 border border-gradient-blue/20">
                          {solution.after}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}