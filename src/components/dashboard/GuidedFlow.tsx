import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles,
  Target,
  Users,
  FileText,
  Settings,
  Check,
  MessageSquare,
  Palette,
  Wand2,
  ChevronDown,
  Copy,
  Download,
  Eye
} from "lucide-react";
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface GuidedFlowProps {
  originalPrompt?: string;
  onComplete: (enhancedPrompt: string, outputFormat?: 'english' | 'json') => void;
  onClose: () => void;
}

interface FlowStep {
  id: string;
  title: string;
  question: string;
  icon: any;
  optional?: boolean;
}

type FlowState = 'welcome' | 'flow' | 'output';

export function GuidedFlow({ originalPrompt = '', onComplete, onClose }: GuidedFlowProps) {
  const [flowState, setFlowState] = useState<FlowState>('welcome');
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [enhancedJson, setEnhancedJson] = useState('');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [showTextModal, setShowTextModal] = useState<{ text: string; format: string } | null>(null);

  const steps: FlowStep[] = [
    {
      id: 'audience',
      title: 'Audience',
      question: 'Who is this prompt for?',
      icon: Users
    },
    {
      id: 'purpose',
      title: 'Purpose', 
      question: 'What do you want to achieve with this prompt?',
      icon: Target
    },
    {
      id: 'style',
      title: 'Tone/Style',
      question: 'Choose the style.',
      icon: Palette
    },
    {
      id: 'constraints',
      title: 'Constraints',
      question: 'Any constraints or formats?',
      icon: Settings,
      optional: true
    },
    {
      id: 'review',
      title: 'Review',
      question: 'Review & Forge',
      icon: Check
    }
  ];

  const handleStartFlow = () => {
    setFlowState('flow');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      processGuidedFlow();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateResponse = (stepId: string, value: string) => {
    setResponses({ ...responses, [stepId]: value });
  };

  const copyToClipboard = async (text: string, format: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopySuccess(format);
        setTimeout(() => setCopySuccess(''), 2000);
        return;
      }
      
      // Fallback for non-secure contexts or older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.prepend(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopySuccess(format);
        setTimeout(() => setCopySuccess(''), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed: ', fallbackError);
        // Show text for manual selection
        setShowTextModal({ text, format });
      } finally {
        textArea.remove();
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Show text for manual selection as fallback
      setShowTextModal({ text, format });
    }
  };

  const processGuidedFlow = async () => {
    setIsProcessing(true);
    
    try {
      // Call Supabase Edge Function with flow data
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/enhance-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          mode: 'flow',
          originalPrompt,
          flowData: {
            audience: responses.audience || 'General audience',
            purpose: responses.purpose || 'General purpose', 
            style: responses.style || 'Professional',
            constraints: responses.constraints || 'No specific constraints'
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setEnhancedPrompt(data.enhancedPrompt);
        setEnhancedJson(data.jsonFormat);
        setFlowState('output');
      } else {
        // Fallback to local enhancement
        const localEnhanced = generateEnhancedPrompt();
        const localJson = generateJsonFormat();
        setEnhancedPrompt(localEnhanced);
        setEnhancedJson(localJson);
        setFlowState('output');
      }
    } catch (error) {
      // Fallback to local enhancement
      const localEnhanced = generateEnhancedPrompt();
      const localJson = generateJsonFormat();
      setEnhancedPrompt(localEnhanced);
      setEnhancedJson(localJson);
      setFlowState('output');
    }
    
    setIsProcessing(false);
  };

  const generateEnhancedPrompt = () => {
    const audience = responses.audience || 'General audience';
    const purpose = responses.purpose || 'General purpose';
    const style = responses.style || 'Professional';
    const constraints = responses.constraints || '';

    const constraintsText = constraints ? ` with constraints: ${constraints}` : '';
    
    return `A ${style.toLowerCase()} ${purpose.toLowerCase()} tailored for ${audience.toLowerCase()}${constraintsText}.`;
  };

  const generateJsonFormat = () => {
    const jsonData = {
      audience: responses.audience || 'General audience',
      purpose: responses.purpose || 'General purpose',
      tone: responses.style || 'Professional',
      constraints: responses.constraints || 'No specific constraints',
      enhanced_prompt: generateEnhancedPrompt()
    };
    
    return JSON.stringify(jsonData, null, 2);
  };

  const getCurrentStepData = () => steps[currentStep];
  const currentStepData = getCurrentStepData();
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const audienceChips = ['General', 'Business', 'Creative', 'Academic'];
  const styleOptions = [
    { value: 'Professional', label: 'Professional', icon: '💼' },
    { value: 'Casual', label: 'Casual', icon: '😊' },
    { value: 'Persuasive', label: 'Persuasive', icon: '🎯' },
    { value: 'Creative', label: 'Creative', icon: '🎨' },
    { value: 'Analytical', label: 'Analytical', icon: '📊' }
  ];

  // Welcome Screen
  if (flowState === 'welcome') {
    return (
      <div className="fixed inset-0 bg-temple-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        {/* Dynamic mystical background */}
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-violet/10 to-temple-black"></div>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-royal-gold/3 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Floating mystical particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-violet/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-royal-gold/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-cyan-glow/30 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="relative bg-temple-black/60 backdrop-blur-xl border-violet/30 p-8 max-w-lg w-full rounded-2xl shadow-2xl">
            <div className="text-center space-y-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 hover:bg-marble-white/10 text-marble-white/60 hover:text-marble-white"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Mystical icon with glow effect */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-violet to-electric-blue rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Brain className="w-8 h-8 text-temple-black" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-violet/30 to-electric-blue/30 rounded-full mx-auto animate-ping"></div>
              </div>
              
              <div>
                <h2 className="text-2xl font-light text-violet mb-2 temple-glow" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                  Enter the Flow Zone
                </h2>
                <p className="text-marble-white/70">
                  A sacred ritual to forge perfect prompts from pure intention
                </p>
              </div>

              {/* Sacred steps preview */}
              <div className="bg-temple-black/40 rounded-xl p-6 border border-violet/20">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {steps.slice(0, -1).map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <motion.div 
                        key={step.id} 
                        className="text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-violet/20 to-electric-blue/20 rounded-lg flex items-center justify-center mb-2 mx-auto border border-violet/30">
                          <Icon className="w-4 h-4 text-violet" />
                        </div>
                        <p className="text-xs text-marble-white/60 font-medium">{step.title}</p>
                      </motion.div>
                    );
                  })}
                </div>
                <p className="text-xs text-marble-white/50 text-center">Four sacred steps to intelligence transcendence</p>
              </div>

              <Button
                onClick={handleStartFlow}
                className="w-full bg-gradient-to-r from-violet to-electric-blue hover:from-violet/80 hover:to-electric-blue/80 text-temple-black font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-violet/25 hover:shadow-xl"
              >
                Begin the Ritual
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Processing State - "The Temple is crafting your wisdom..."
  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-temple-black/80 backdrop-blur-md z-50 flex items-center justify-center">
        {/* Enhanced mystical background during processing */}
        <div className="absolute inset-0 bg-gradient-to-br from-royal-gold/8 via-violet/12 to-temple-black"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-royal-gold/8 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Orbiting particles during processing */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-32 h-32 -mt-16 -ml-16">
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-royal-gold/60 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="absolute top-1/2 right-0 w-1 h-1 bg-violet/60 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-cyan-glow/60 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-0 w-1 h-1 bg-electric-blue/60 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1.5s' }}></div>
          </div>
        </div>
        
        <Card className="relative bg-temple-black/60 backdrop-blur-xl border-royal-gold/30 p-8 max-w-md w-full mx-4 rounded-2xl shadow-2xl">
          <div className="text-center space-y-6">
            {/* Mystical forging icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-royal-gold/20 to-violet/20 rounded-full flex items-center justify-center mx-auto animate-pulse border border-royal-gold/40">
                <Wand2 className="w-10 h-10 text-royal-gold animate-pulse" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-royal-gold/10 to-violet/10 rounded-full mx-auto animate-ping"></div>
            </div>
            
            <div>
              <h3 className="text-xl font-light text-royal-gold mb-2 temple-glow" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                The Temple is crafting your wisdom...
              </h3>
              <p className="text-marble-white/70 text-sm">
                Sacred algorithms weave your intentions into perfect form
              </p>
            </div>
            
            {/* Enhanced loading animation */}
            <div className="flex justify-center items-center space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full animate-pulse ${ 
                    i === 2 ? 'bg-royal-gold' : 'bg-violet/60'
                  }`}
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.5s'
                  }}
                ></div>
              ))}
            </div>
            
            {/* Sacred geometry during processing */}
            <div className="flex justify-center items-center space-x-4 opacity-30">
              <div className="w-4 h-4 border border-royal-gold/40 rotate-45 animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="w-3 h-3 border border-violet/40 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="w-4 h-4 border border-royal-gold/40 rotate-45 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Output Screen
  if (flowState === 'output') {
    return (
      <div className="fixed inset-0 bg-temple-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-violet/10 to-temple-black"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="relative bg-temple-black/60 backdrop-blur-xl border-violet/30 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-royal-gold to-violet rounded-xl flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 10px rgba(255, 215, 0, 0.3)',
                      '0 0 20px rgba(255, 215, 0, 0.6)',
                      '0 0 10px rgba(255, 215, 0, 0.3)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-5 h-5 text-temple-black" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-light text-royal-gold temple-glow" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                    Sacred Wisdom Forged
                  </h2>
                  <p className="text-sm text-marble-white/70">Flow Zone mastery achieved</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-marble-white/10 text-marble-white/60 hover:text-marble-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Enhanced Prompt Display */}
            <div className="bg-temple-black/40 rounded-xl p-6 border border-violet/20 mb-6">
              <motion.div 
                className="bg-gradient-to-br from-royal-gold/5 to-violet/5 rounded-lg p-6 border border-royal-gold/20 mb-4 shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.1), inset 0 0 15px rgba(123, 47, 247, 0.05)'
                }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 bg-royal-gold rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-marble-white/60 uppercase tracking-wider">Enhanced Intelligence</span>
                </div>
                <p className="text-marble-white leading-relaxed text-base font-light">
                  {enhancedPrompt}
                </p>
              </motion.div>
              
              {/* Enhanced Copy Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-marble-white/50">
                    Ready to forge destiny
                  </div>
                  {copySuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs text-success-green bg-success-green/10 px-2 py-1 rounded-full border border-success-green/30"
                    >
                      {copySuccess} copied!
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(enhancedPrompt, 'English')}
                    className="border-violet/30 hover:bg-violet/10 text-marble-white transition-all duration-200"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-violet/30 hover:bg-violet/10 text-marble-white transition-all duration-200"
                      >
                        Copy As
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-temple-black/95 border-violet/30 backdrop-blur-xl">
                      <DropdownMenuItem 
                        onClick={() => copyToClipboard(enhancedPrompt, 'English')}
                        className="text-marble-white hover:bg-violet/10"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        English
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => copyToClipboard(enhancedJson, 'JSON')}
                        className="text-marble-white hover:bg-violet/10"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        JSON Format
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => {
                  setFlowState('welcome');
                  setCurrentStep(0);
                  setResponses({});
                }}
                className="text-marble-white/60 hover:text-marble-white hover:bg-marble-white/10"
              >
                Create New Flow
              </Button>
              
              <Button
                onClick={() => {
                  onComplete(enhancedPrompt);
                  onClose();
                }}
                className="bg-gradient-to-r from-violet to-electric-blue hover:from-violet/80 hover:to-electric-blue/80 text-temple-black font-semibold px-6"
              >
                <Check className="w-4 h-4 mr-2" />
                Use This Prompt
              </Button>
            </div>
          </Card>
          
          {/* Manual Copy Modal - shown when clipboard fails */}
          {showTextModal && (
            <div className="absolute inset-0 bg-temple-black/90 backdrop-blur-sm flex items-center justify-center z-10">
              <Card className="bg-temple-black/80 border-violet/30 p-6 max-w-lg w-full mx-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-marble-white font-medium">Manual Copy - {showTextModal.format}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTextModal(null)}
                      className="text-marble-white/60 hover:text-marble-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-marble-white/10 p-4 rounded-lg">
                    <textarea
                      readOnly
                      value={showTextModal.text}
                      className="w-full h-32 bg-transparent text-marble-white text-sm resize-none border-none outline-none"
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                  <p className="text-xs text-marble-white/60 text-center">
                    Select the text above and copy manually (Ctrl+C or Cmd+C)
                  </p>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Flow Steps - Dynamic background based on current step
  const getStepBackground = () => {
    const stepColors = [
      'from-electric-blue/5 via-violet/8 to-temple-black',  // Audience
      'from-violet/6 via-royal-gold/5 to-temple-black',     // Purpose  
      'from-royal-gold/5 via-electric-blue/6 to-temple-black', // Style
      'from-cyan-glow/4 via-violet/8 to-temple-black',     // Constraints
      'from-royal-gold/8 via-violet/10 to-temple-black'    // Review
    ];
    return stepColors[currentStep] || stepColors[0];
  };

  return (
    <div className="fixed inset-0 bg-temple-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Dynamic background that shifts with each step */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getStepBackground()} transition-all duration-1000 ease-in-out`}></div>
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-royal-gold/3 rounded-full blur-3xl animate-pulse"></div>
      
      {/* Step-specific mystical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-1/4 w-1 h-1 bg-violet/40 rounded-full animate-twinkle" style={{ animationDelay: `${currentStep * 0.3}s` }}></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-royal-gold/30 rounded-full animate-pulse" style={{ animationDelay: `${currentStep * 0.5}s` }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-cyan-glow/40 rounded-full animate-twinkle" style={{ animationDelay: `${currentStep * 0.7}s` }}></div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative bg-temple-black/60 backdrop-blur-xl border-violet/30 p-8 max-w-lg w-full rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-violet to-electric-blue rounded-xl flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Brain className="w-5 h-5 text-temple-black" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-light text-violet temple-glow" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                    Flow Zone
                  </h2>
                  <p className="text-sm text-marble-white/70">
                    Sacred Step {currentStep + 1} of {steps.length} — {getCurrentStepData().title}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-marble-white/10 text-marble-white/60 hover:text-marble-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-violet' 
                      : isActive 
                        ? 'bg-violet scale-125' 
                        : 'bg-marble-white/20'
                  }`}></div>
                  {index < steps.length - 1 && (
                    <div className={`w-6 h-0.5 mx-1 transition-all duration-300 ${
                      isCompleted ? 'bg-violet/60' : 'bg-marble-white/10'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-full bg-marble-white/10 rounded-full h-1">
            <div 
              className="h-1 bg-gradient-to-r from-violet to-electric-blue rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

            {/* Current Step Content */}
            <div className="space-y-6">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-light text-marble-white mb-2 temple-glow" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                  {currentStepData.question}
                </h3>
                {currentStepData.optional && (
                  <p className="text-marble-white/50 text-sm">This step is optional in your sacred journey</p>
                )}
              </motion.div>

              <div className="space-y-4">
                {/* Audience Step */}
                {currentStepData.id === 'audience' && (
                  <div className="space-y-4">
                    <Input
                      value={responses.audience || ''}
                      onChange={(e) => updateResponse('audience', e.target.value)}
                      placeholder="Who will receive this wisdom? (e.g., Startup founders, students, creative minds)"
                      className="bg-input-background/50 border-violet/30 focus:border-violet/60 text-marble-white placeholder:text-marble-white/40 rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-violet/10"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {audienceChips.map((chip) => (
                        <Button
                          key={chip}
                          variant="outline"
                          size="sm"
                          onClick={() => updateResponse('audience', chip)}
                          className={`border-violet/30 hover:bg-violet/20 text-marble-white text-sm transition-all duration-200 ${
                            responses.audience === chip ? 'bg-violet/20 border-violet shadow-lg' : ''
                          }`}
                        >
                          {chip}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-marble-white/50 text-center">Choose a sacred archetype or speak your own</p>
                  </div>
                )}

                {/* Purpose Step */}
                {currentStepData.id === 'purpose' && (
                  <div className="space-y-4">
                    <Textarea
                      value={responses.purpose || ''}
                      onChange={(e) => updateResponse('purpose', e.target.value)}
                      placeholder="Speak your sacred intention... (e.g., Write a compelling pitch, Create educational wisdom, Generate persuasive copy)"
                      className="bg-input-background/50 border-violet/30 focus:border-violet/60 text-marble-white placeholder:text-marble-white/40 min-h-24 rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-violet/10"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Create compelling content',
                        'Write technical documentation', 
                        'Generate marketing copy',
                        'Craft educational material'
                      ].map((template) => (
                        <Button
                          key={template}
                          variant="outline"
                          size="sm"
                          onClick={() => updateResponse('purpose', template)}
                          className={`text-xs border-violet/20 hover:bg-violet/10 text-marble-white/70 hover:text-violet transition-all duration-200 ${
                            responses.purpose === template ? 'bg-violet/10 border-violet' : ''
                          }`}
                        >
                          {template}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Style Step */}
                {currentStepData.id === 'style' && (
                  <div className="grid grid-cols-1 gap-3">
                    {styleOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        onClick={() => updateResponse('style', option.value)}
                        className={`h-auto p-4 border-violet/30 hover:bg-violet/20 text-left justify-start ${
                          responses.style === option.value ? 'bg-violet/20 border-violet' : ''
                        }`}
                      >
                        <span className="text-lg mr-3">{option.icon}</span>
                        <div>
                          <div className="text-marble-white font-medium">{option.label}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Constraints Step */}
                {currentStepData.id === 'constraints' && (
                  <div className="space-y-4">
                    <Textarea
                      value={responses.constraints || ''}
                      onChange={(e) => updateResponse('constraints', e.target.value)}
                      placeholder="Set sacred boundaries... (e.g., 300 words max, bullet points, specific format)"
                      className="bg-input-background/50 border-violet/30 focus:border-violet/60 text-marble-white placeholder:text-marble-white/40 min-h-20 rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-violet/10"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Keep it concise',
                        'Use bullet points',
                        'JSON format',
                        'Step-by-step guide'
                      ].map((constraint) => (
                        <Button
                          key={constraint}
                          variant="outline"
                          size="sm"
                          onClick={() => updateResponse('constraints', constraint)}
                          className={`text-xs border-violet/20 hover:bg-violet/10 text-marble-white/70 hover:text-violet transition-all duration-200 ${
                            responses.constraints === constraint ? 'bg-violet/10 border-violet' : ''
                          }`}
                        >
                          {constraint}
                        </Button>
                      ))}
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => {
                          updateResponse('constraints', '');
                          handleNext();
                        }}
                        className="text-marble-white/50 hover:text-marble-white/70 text-sm underline transition-colors duration-200"
                      >
                        ✨ No constraints needed - proceed with pure freedom
                      </button>
                    </div>
                  </div>
                )}

                {/* Review Step - Enhanced with glow effect for dramatic presentation */}
                {currentStepData.id === 'review' && (
                  <div className="space-y-6">
                    <motion.div 
                      className="bg-gradient-to-br from-temple-black/60 to-violet/5 rounded-xl p-6 border border-royal-gold/30 shadow-2xl"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        boxShadow: '0 0 30px rgba(255, 215, 0, 0.1), inset 0 0 20px rgba(123, 47, 247, 0.05)'
                      }}
                    >
                      <div className="text-center mb-6">
                        <h4 className="text-royal-gold font-light text-lg mb-2 temple-glow" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                          Sacred Context Review
                        </h4>
                        <p className="text-marble-white/60 text-sm">Your intentions, perfectly aligned</p>
                      </div>
                      
                      <div className="space-y-4">
                        <motion.div 
                          className="flex items-center justify-between p-3 bg-temple-black/40 rounded-lg border border-violet/20"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-violet" />
                            <span className="text-marble-white/70 text-sm">Audience:</span>
                          </div>
                          <span className="text-marble-white font-medium">{responses.audience || 'Universal'}</span>
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center justify-between p-3 bg-temple-black/40 rounded-lg border border-violet/20"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-royal-gold" />
                            <span className="text-marble-white/70 text-sm">Purpose:</span>
                          </div>
                          <span className="text-marble-white font-medium">{responses.purpose || 'Universal wisdom'}</span>
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center justify-between p-3 bg-temple-black/40 rounded-lg border border-violet/20"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center space-x-2">
                            <Palette className="w-4 h-4 text-electric-blue" />
                            <span className="text-marble-white/70 text-sm">Style:</span>
                          </div>
                          <span className="text-marble-white font-medium">{responses.style || 'Balanced'}</span>
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center justify-between p-3 bg-temple-black/40 rounded-lg border border-violet/20"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4 text-cyan-glow" />
                            <span className="text-marble-white/70 text-sm">Constraints:</span>
                          </div>
                          <span className="text-marble-white font-medium">{responses.constraints || 'None'}</span>
                        </motion.div>
                      </div>
                      
                      {/* Sacred geometry accent */}
                      <div className="flex justify-center mt-6 space-x-3 opacity-30">
                        <div className="w-2 h-2 bg-royal-gold/60 rotate-45 animate-pulse"></div>
                        <div className="w-1 h-1 bg-violet/60 rounded-full animate-ping"></div>
                        <div className="w-2 h-2 bg-royal-gold/60 rotate-45 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-violet/10">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="text-marble-white/60 hover:text-marble-white hover:bg-marble-white/10 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStep ? 'bg-violet scale-125' : 
                        index < currentStep ? 'bg-violet/60' : 'bg-marble-white/20'
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="outline" className="border-violet/50 text-violet text-xs">
                  {currentStep + 1} / {steps.length}
                </Badge>
              </div>

              <Button
                onClick={handleNext}
                disabled={currentStepData.id === 'audience' && !responses.audience ||
                         currentStepData.id === 'purpose' && !responses.purpose ||
                         currentStepData.id === 'style' && !responses.style}
                className={`px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLastStep 
                    ? 'bg-gradient-to-r from-royal-gold to-violet hover:from-royal-gold/80 hover:to-violet/80 text-temple-black shadow-lg hover:shadow-royal-gold/25 hover:shadow-xl pulse-glow' 
                    : 'bg-gradient-to-r from-violet to-electric-blue hover:from-violet/80 hover:to-electric-blue/80 text-temple-black'
                }`}
              >
                {isLastStep ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Forge Prompt ⚡
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}