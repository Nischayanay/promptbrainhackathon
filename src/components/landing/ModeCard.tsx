import { motion } from "motion/react";

interface ModeCardProps {
  mode: 'direct' | 'flow';
  isActive: boolean;
  onActivate: () => void;
}

const modeContent = {
  direct: {
    title: "Direct Mode",
    subtitle: "Instant Enhancement",
    description: "Paste your rough prompt and get an enhanced version instantly. Perfect for quick improvements and rapid iteration.",
    demo: {
      input: "Write a product launch email",
      output: "Write a compelling product launch email for [target audience] introducing [product name]. Include: attention-grabbing subject line, problem identification, solution benefits, social proof, and clear CTA with urgency. Tone: [specify tone]. Length: 200-300 words."
    },
    cta: "Forge Prompt",
    features: [
      "Instant results",
      "One-click enhancement", 
      "Preserve your style"
    ]
  },
  flow: {
    title: "Flow Mode", 
    subtitle: "Guided Conversation",
    description: "Answer strategic questions to build comprehensive, structured prompts. Ideal for complex projects and thoughtful planning.",
    demo: {
      questions: [
        "What type of content are you creating?",
        "Who is your target audience?", 
        "What's the primary goal?",
        "What tone should this have?"
      ],
      output: "Write a [content type] for [specific audience] that [achieves goal]. Structure should include [framework]. Tone: [specified tone]. Include [specific elements]. Optimize for [success metrics]."
    },
    cta: "Step Into Flow",
    features: [
      "Strategic guidance",
      "Comprehensive prompts",
      "Unlock clarity"
    ]
  }
};

export function ModeCard({ mode, isActive, onActivate }: ModeCardProps) {
  const content = modeContent[mode];

  return (
    <motion.div
      onClick={onActivate}
      className={`relative bg-white rounded-2xl p-8 border-2 cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'border-landing-black shadow-xl scale-105' 
          : 'border-gray-200 shadow-lg hover:border-gray-300 hover:shadow-xl'
      }`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="landing-theme text-xl text-landing-black mb-2">
          {content.title}
        </h3>
        <p className="text-sm font-medium text-gray-500 mb-4">
          {content.subtitle}
        </p>
        <p className="text-gray-600 leading-relaxed">
          {content.description}
        </p>
      </div>

      {/* Demo */}
      <div className="mb-6">
        {mode === 'direct' ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Input:</p>
              <p className="mono text-sm text-gray-800">"{content.demo.input}"</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-xs text-green-600 mb-2">Enhanced:</p>
              <p className="mono text-sm text-gray-800 leading-relaxed">"{content.demo.output}"</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-3">Guided Questions:</p>
              <div className="space-y-2">
                {content.demo.questions.map((question, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-xs font-medium text-gray-400 mt-1">{index + 1}.</span>
                    <p className="text-sm text-gray-700">{question}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-landing-blue mb-2">Generated Prompt:</p>
              <p className="mono text-sm text-gray-800 leading-relaxed">"{content.demo.output}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mb-6">
        <div className="grid grid-cols-1 gap-2">
          {content.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-landing-blue rounded-full" />
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
        isActive
          ? 'bg-landing-black text-landing-white hover:bg-gray-800'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}>
        {content.cta}
      </button>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute -top-1 -right-1 w-6 h-6 bg-landing-black rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-3 h-3 text-landing-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}