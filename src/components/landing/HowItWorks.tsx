import { motion } from "motion/react";
import { Edit3, Zap, Copy, ArrowDown } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Edit3,
      title: "Type your idea",
      description: "Start with any rough concept, question, or basic prompt. No matter how vague or incomplete.",
      color: "from-gradient-blue to-gradient-blue"
    },
    {
      icon: Zap,
      title: "PromptBrain enhances",
      description: "Our AI analyzes your input and transforms it into a comprehensive, effective prompt with context and specificity.",
      color: "from-gradient-blue to-gradient-purple"
    },
    {
      icon: Copy,
      title: "Copy in English or JSON",
      description: "Get your enhanced prompt in readable English or structured JSON format, ready to use with any AI model.",
      color: "from-gradient-purple to-gradient-purple"
    }
  ];

  return (
    <section className="py-24 bg-light-gray text-chronicle-black relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(58, 141, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
          `
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Simple process,
            <span className="block bg-gradient-to-r from-gradient-blue to-gradient-purple bg-clip-text text-transparent">
              powerful results
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into world-class prompts in three simple steps.
          </p>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Icon and Number */}
                <div className="flex-shrink-0 relative">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-2xl`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-chronicle-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-chronicle-black">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                  viewport={{ once: true }}
                  className="absolute left-10 top-20 w-0.5 h-16 bg-gradient-to-b from-gradient-blue to-gradient-purple origin-top"
                />
              )}

              {/* Animated arrow */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute left-8 top-32"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  <ArrowDown className="w-6 h-6 text-gradient-blue" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500">
            Ready to transform your prompts? 
            <span className="text-gradient-blue font-medium ml-1">Get started free below.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}