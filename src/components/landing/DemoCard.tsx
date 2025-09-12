import { motion } from "motion/react";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  before: {
    prompt: string;
    issues: string[];
  };
  after: {
    prompt: string;
    improvements: string[];
  };
}

interface DemoCardProps {
  step: DemoStep;
  isActive: boolean;
}

export function DemoCard({ step, isActive }: DemoCardProps) {
  return (
    <motion.div
      layout
      className="bg-landing-white rounded-2xl p-8 shadow-2xl max-w-lg"
      animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.8 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Before section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-sm font-medium text-gray-600">Before</span>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="mono text-sm text-gray-800 leading-relaxed">
            "{step.before.prompt}"
          </p>
        </div>
        
        <div className="space-y-2">
          {step.before.issues.map((issue, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-1 h-1 bg-red-400 rounded-full" />
              {issue}
            </div>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-8">
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-r from-landing-blue to-blue-600 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </div>

      {/* After section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-landing-blue rounded-full" />
          <span className="text-sm font-medium text-gray-600">After PromptBrain</span>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
          <p className="mono text-sm text-gray-800 leading-relaxed">
            "{step.after.prompt}"
          </p>
        </div>
        
        <div className="space-y-2">
          {step.after.improvements.map((improvement, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-landing-blue">
              <div className="w-1 h-1 bg-landing-blue rounded-full" />
              {improvement}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}