import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Save, Share2, RefreshCw, Zap, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react';
import { useCreditSystem } from '../credits/CreditSystem';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';

interface PromptEnhancerProps {
  initialPrompt?: string;
  selectedMode?: string;
  onSave?: (prompt: string, enhancement: string) => void;
}

export function PromptEnhancer({ initialPrompt = '', selectedMode = 'general', onSave }: PromptEnhancerProps) {
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const { credits, spendCredits, isLowOnCredits } = useCreditSystem();

  const placeholderExamples = {
    general: "Write me a pitch for my startup",
    product: "Build a social media app",
    research: "Analyze customer feedback trends"
  };

  const enhancePrompt = async () => {
    if (!inputPrompt.trim()) {
      toast.error('Please enter a prompt to enhance');
      return;
    }

    if (!spendCredits(1, `Enhanced prompt: ${inputPrompt.slice(0, 30)}...`)) {
      toast.error('Not enough credits! Earn more by using the app daily.');
      return;
    }

    setIsEnhancing(true);
    setShowOutput(false);

    // Simulate API call delay
    setTimeout(() => {
      const mockEnhancement = generateMockEnhancement(inputPrompt, selectedMode);
      setEnhancedPrompt(mockEnhancement);
      setIsEnhancing(false);
      setShowOutput(true);
      toast.success('Prompt enhanced successfully! ✨');
    }, 2500);
  };

  const generateMockEnhancement = (prompt: string, mode: string): string => {
    const basePrompt = prompt.trim();
    
    if (mode === 'product') {
      return `Create a comprehensive Product Requirements Document (PRD) for "${basePrompt}":

## PRODUCT OVERVIEW
- Define the core purpose and primary user problem this solves
- Identify target user personas and their specific use cases
- Establish success metrics and key performance indicators

## FUNCTIONAL REQUIREMENTS
- Core features and user workflows
- User authentication and onboarding experience
- Data management and persistence strategy
- Integration requirements with external services

## TECHNICAL SPECIFICATIONS
- Platform requirements (web/mobile/desktop)
- Technology stack recommendations
- Database schema and API endpoints
- Performance benchmarks and scalability needs

## USER EXPERIENCE
- Wireframes for key user journeys
- Accessibility requirements (WCAG compliance)
- Error handling and edge case scenarios
- Mobile responsiveness considerations

## GO-TO-MARKET
- Development timeline and milestones
- Resource requirements and team structure
- Launch strategy and success criteria
- Post-launch iteration and feedback loops

Please structure this as a detailed, actionable document ready for development team handoff.`;
    }
    
    if (mode === 'research') {
      return `Conduct a comprehensive research analysis on "${basePrompt}" using this structured approach:

## EXECUTIVE SUMMARY
- 3-5 key findings with immediate actionable insights
- Primary recommendations for stakeholders
- Critical implications for decision-making
- Confidence level and reliability assessment

## METHODOLOGY & SCOPE
- Research approach and data collection methods
- Primary and secondary data sources utilized
- Sample size, timeframe, and geographical scope
- Limitations, assumptions, and potential biases

## DETAILED FINDINGS
- Quantitative results with statistical significance
- Qualitative insights organized by themes
- Comparative analysis and benchmarking data
- Trend identification and pattern recognition

## STRATEGIC IMPLICATIONS
- Short-term and long-term business impacts
- Risk assessment and mitigation strategies
- Opportunity identification and prioritization
- Resource allocation recommendations

## ACTIONABLE RECOMMENDATIONS
- Specific next steps with timeline
- Required resources and budget considerations
- Success metrics and monitoring framework
- Stakeholder communication plan

Format this for: [SPECIFY TARGET AUDIENCE] with [URGENCY LEVEL] priority level.`;
    }
    
    // General enhancement
    return `Create a compelling and comprehensive response for "${basePrompt}" that includes:

## STRUCTURE & APPROACH
- Clear objective and target audience identification
- Logical flow with introduction, body, and conclusion
- Key messaging hierarchy and supporting points
- Call-to-action with specific next steps

## CONTENT REQUIREMENTS
- Opening hook that captures attention immediately
- Problem statement with relevant context
- Solution or approach with unique value proposition
- Supporting evidence, examples, or case studies
- Professional tone adapted for intended audience

## OPTIMIZATION ELEMENTS
- SEO considerations and keyword integration
- Visual elements or formatting suggestions
- Length and readability optimization
- Platform-specific adaptations if needed

## DELIVERY SPECIFICATIONS
- Preferred format (document, presentation, email, etc.)
- Timeline and deadline requirements
- Review process and stakeholder approval
- Distribution and follow-up strategy

Please ensure the output is immediately actionable and professionally formatted for maximum impact.`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  const saveToLibrary = () => {
    onSave?.(inputPrompt, enhancedPrompt);
    setIsSaved(true);
    toast.success('Saved to your library!');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const sharePrompt = () => {
    const shareText = `Check out this enhanced prompt from PromptBrain:\n\nOriginal: ${inputPrompt}\n\nEnhanced: ${enhancedPrompt.slice(0, 200)}...\n\nTry it yourself at promptbrain.ai`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Enhanced Prompt from PromptBrain',
        text: shareText,
      });
    } else {
      copyToClipboard(shareText);
      toast.success('Share text copied to clipboard!');
    }
  };

  const retryEnhancement = () => {
    if (!spendCredits(1, `Re-enhanced prompt: ${inputPrompt.slice(0, 30)}...`)) {
      toast.error('Not enough credits! Earn more by using the app daily.');
      return;
    }
    
    setShowOutput(false);
    enhancePrompt();
  };

  return (
    <div className="prompt-enhancer max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-marble-white">
            Transform Your Prompt
          </h2>
          <div className="flex items-center gap-2 text-sm text-marble-white/60">
            <Zap className="w-4 h-4 text-royal-gold" />
            <span>{credits} credits</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={placeholderExamples[selectedMode as keyof typeof placeholderExamples] || "Enter your prompt here..."}
            className="w-full p-4 bg-temple-dark border border-royal-gold/20 rounded-xl text-marble-white placeholder-marble-white/50 focus:border-royal-gold focus:outline-none resize-none transition-colors"
            rows={4}
          />
          
          {inputPrompt.trim() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-4 right-4"
            >
              <Button
                onClick={enhancePrompt}
                disabled={isEnhancing || isLowOnCredits}
                className="bg-gradient-to-r from-royal-gold to-cyan-glow text-temple-black font-medium hover:opacity-90 disabled:opacity-50"
              >
                {isEnhancing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isEnhancing ? 'Enhancing...' : 'Enhance (1 credit)'}
              </Button>
            </motion.div>
          )}
        </div>

        {isLowOnCredits && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-soft-red/10 border border-soft-red/30 rounded-lg"
          >
            <p className="text-sm text-soft-red">
              Running low on credits! Use the app daily or invite friends to earn more.
            </p>
          </motion.div>
        )}
      </div>

      {/* Processing Animation */}
      <AnimatePresence>
        {isEnhancing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-gradient-to-r from-royal-gold/10 to-cyan-glow/10 border border-royal-gold/30 rounded-xl text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-gradient-to-r from-royal-gold to-cyan-glow rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles className="w-6 h-6 text-temple-black" />
            </motion.div>
            <h3 className="text-lg font-semibold text-royal-gold mb-2">
              Enhancing Your Prompt
            </h3>
            <p className="text-marble-white/70">
              Our AI is analyzing and restructuring your prompt for maximum effectiveness...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output Section */}
      <AnimatePresence>
        {showOutput && enhancedPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-royal-gold flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Enhanced Output
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryEnhancement}
                  className="border-royal-gold/30 text-royal-gold hover:bg-royal-gold/10"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Retry
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-temple-dark to-temple-black border border-royal-gold/30 rounded-xl p-6">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-marble-white text-sm leading-relaxed font-sans">
                  {enhancedPrompt}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => copyToClipboard(enhancedPrompt)}
                variant="outline"
                className="border-royal-gold/30 text-royal-gold hover:bg-royal-gold/10"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>

              <Button
                onClick={saveToLibrary}
                variant="outline"
                disabled={isSaved}
                className="border-cyan-glow/30 text-cyan-glow hover:bg-cyan-glow/10"
              >
                {isSaved ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaved ? 'Saved!' : 'Save'}
              </Button>

              <Button
                onClick={sharePrompt}
                variant="outline"
                className="border-violet/30 text-violet hover:bg-violet/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                className="bg-gradient-to-r from-royal-gold to-cyan-glow text-temple-black font-medium ml-auto"
                onClick={() => {
                  // Open in new prompt enhancement
                  setInputPrompt('');
                  setEnhancedPrompt('');
                  setShowOutput(false);
                }}
              >
                Enhance Another
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Usage Tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-cyan-glow/5 border border-cyan-glow/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-cyan-glow mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-cyan-glow mb-1">
                    Pro Tip
                  </h4>
                  <p className="text-xs text-marble-white/70">
                    Copy this enhanced prompt and use it directly in ChatGPT, Claude, or any AI tool for better results!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}