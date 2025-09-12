import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Target, Zap, Check, X } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface EnhancedOnboardingProps {
  onComplete: (selectedMode: string, samplePrompt: string) => void;
  onSkip?: () => void;
}

export function EnhancedOnboarding({ onComplete, onSkip }: EnhancedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [samplePrompt, setSamplePrompt] = useState<string>('');
  const [isTransforming, setIsTransforming] = useState(false);

  const modes = [
    {
      id: 'general',
      name: 'General Enhancement',
      description: 'Perfect for everyday AI tasks',
      icon: <Sparkles className="w-6 h-6" />,
      samplePrompt: 'Write me a pitch',
      transformedPrompt: `Create a compelling 2-minute pitch presentation for [PRODUCT/SERVICE] that:

• Clearly defines the problem and target audience
• Presents a unique solution with key benefits
• Includes market opportunity and competitive advantages  
• Ends with a specific call-to-action

Structure: Hook → Problem → Solution → Proof → Ask

Tone: [Professional/Conversational/Urgent] for [TARGET AUDIENCE]`
    },
    {
      id: 'product',
      name: 'Product Spec',
      description: 'Structured specs and requirements',
      icon: <Target className="w-6 h-6" />,
      samplePrompt: 'Build a todo app',
      transformedPrompt: `Create a comprehensive Product Requirements Document (PRD) for a Todo Application:

## PRODUCT OVERVIEW
- Core purpose and user problem solved
- Primary user personas and use cases
- Success metrics and KPIs

## FUNCTIONAL REQUIREMENTS
- User authentication and onboarding
- Task creation, editing, deletion, completion
- Task organization (categories, tags, priorities)
- Search and filtering capabilities
- Data persistence and sync

## TECHNICAL SPECIFICATIONS  
- Platform requirements (web/mobile/desktop)
- Database schema and API endpoints
- Integration requirements
- Performance and scalability needs

## USER EXPERIENCE
- Wireframes for key user flows
- Accessibility requirements
- Error handling and edge cases

Include development timeline, resource requirements, and launch criteria.`
    },
    {
      id: 'research',
      name: 'Research Mode',
      description: 'Deep analysis and insights',
      icon: <Zap className="w-6 h-6" />,
      samplePrompt: 'Summarize this research',
      transformedPrompt: `Conduct a comprehensive research analysis with the following structure:

## EXECUTIVE SUMMARY
- Key findings and implications (3-5 bullet points)
- Primary recommendations
- Critical insights for decision-making

## METHODOLOGY & SCOPE
- Research approach and data sources
- Limitations and assumptions
- Sample size and timeframe

## DETAILED FINDINGS
- Organized by themes/categories
- Supporting data and evidence
- Comparative analysis where relevant

## IMPLICATIONS & RECOMMENDATIONS
- Strategic implications for stakeholders
- Actionable next steps
- Risk assessment and mitigation

## APPENDIX
- Data tables and supporting materials
- Additional context and references

Format for: [TARGET AUDIENCE] with [URGENCY LEVEL] priority`
    }
  ];

  const steps: OnboardingStep[] = [
    {
      id: 'mode-selection',
      title: 'Pick Your Enhancement Mode',
      description: 'Choose the type of prompts you want to enhance',
      component: (
        <div className="space-y-4">
          {modes.map((mode) => (
            <motion.button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedMode === mode.id
                  ? 'border-royal-gold bg-royal-gold/10'
                  : 'border-temple-dark hover:border-royal-gold/50 bg-temple-dark/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedMode === mode.id ? 'bg-royal-gold/20' : 'bg-temple-dark'
                }`}>
                  {mode.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-marble-white mb-1">{mode.name}</h3>
                  <p className="text-sm text-marble-white/70">{mode.description}</p>
                </div>
                {selectedMode === mode.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-royal-gold rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-temple-black" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )
    },
    {
      id: 'prompt-input',
      title: 'Type Any Raw Prompt',
      description: 'Enter a simple prompt to see the magic happen',
      component: (
        <div className="space-y-4">
          {selectedMode && (
            <div className="p-4 bg-temple-dark/50 rounded-xl border border-royal-gold/20">
              <h4 className="text-sm font-medium text-royal-gold mb-2">
                Suggested prompt for {modes.find(m => m.id === selectedMode)?.name}:
              </h4>
              <p className="text-marble-white/80 text-sm">
                {modes.find(m => m.id === selectedMode)?.samplePrompt}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-marble-white">
              Your Prompt
            </label>
            <textarea
              value={samplePrompt}
              onChange={(e) => setSamplePrompt(e.target.value)}
              placeholder={selectedMode ? modes.find(m => m.id === selectedMode)?.samplePrompt : "Type your prompt here..."}
              className="w-full p-3 bg-temple-dark border border-royal-gold/20 rounded-xl text-marble-white placeholder-marble-white/50 focus:border-royal-gold focus:outline-none resize-none"
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'transformation',
      title: 'See the 10× Transformation',
      description: 'Watch your simple prompt become incredibly detailed',
      component: (
        <div className="space-y-4">
          <div className="p-4 bg-temple-dark/30 rounded-xl border border-royal-gold/10">
            <h4 className="text-sm font-medium text-marble-white/60 mb-2">Your Input:</h4>
            <p className="text-marble-white">{samplePrompt || modes.find(m => m.id === selectedMode)?.samplePrompt}</p>
          </div>
          
          <div className="flex items-center justify-center py-4">
            <motion.div
              animate={{ rotate: isTransforming ? 360 : 0 }}
              transition={{ duration: 2, repeat: isTransforming ? Infinity : 0, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-r from-royal-gold to-cyan-glow rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-temple-black" />
            </motion.div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-royal-gold/10 to-cyan-glow/10 rounded-xl border border-royal-gold/30">
            <h4 className="text-sm font-medium text-royal-gold mb-3">Enhanced Output:</h4>
            <div className="text-sm text-marble-white whitespace-pre-line leading-relaxed">
              {selectedMode && modes.find(m => m.id === selectedMode)?.transformedPrompt}
            </div>
          </div>
          
          <div className="p-3 bg-cyan-glow/10 border border-cyan-glow/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-cyan-glow">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Credit Cost: 1 credit</span>
              <span className="text-marble-white/60">• You start with 50 free credits</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep === 0 && !selectedMode) return;
    if (currentStep === 1 && !samplePrompt.trim()) {
      setSamplePrompt(modes.find(m => m.id === selectedMode)?.samplePrompt || '');
    }
    
    if (currentStep === 1) {
      setIsTransforming(true);
      setTimeout(() => {
        setIsTransforming(false);
        setCurrentStep(currentStep + 1);
      }, 2000);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(selectedMode, samplePrompt || modes.find(m => m.id === selectedMode)?.samplePrompt || '');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return selectedMode;
    if (currentStep === 1) return true; // Allow proceeding with suggested prompt
    return true;
  };

  return (
    <div className="fixed inset-0 bg-temple-black/95 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl mx-4 bg-temple-dark border border-royal-gold/30 rounded-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 w-8 h-8 bg-temple-black/50 hover:bg-temple-black rounded-full flex items-center justify-center text-marble-white/60 hover:text-marble-white transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-temple-black">
          <motion.div
            className="h-full bg-gradient-to-r from-royal-gold to-cyan-glow"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.h2
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-royal-gold mb-2"
            >
              {steps[currentStep].title}
            </motion.h2>
            <motion.p
              key={`desc-${currentStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-marble-white/70"
            >
              {steps[currentStep].description}
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].component}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 py-2 text-marble-white/60 hover:text-marble-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-royal-gold' : 'bg-temple-black'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isTransforming}
              className="px-6 py-2 bg-royal-gold text-temple-black rounded-full font-medium hover:bg-royal-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Start Enhancing' : 'Next'}
              {!isTransforming && <ArrowRight className="w-4 h-4" />}
              {isTransforming && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}