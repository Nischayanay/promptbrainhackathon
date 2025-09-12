import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Circle, Crown, Settings, Gift, Eye, Zap, Shield, Users } from "lucide-react";

interface FlowShowcaseProps {
  currentPage: string;
}

export function FlowShowcase({ currentPage }: FlowShowcaseProps) {
  const flowSteps = [
    {
      id: 'login',
      title: 'Temple Access',
      description: 'Mystical login experience with ancient temple aesthetics',
      features: ['Responsive 50/50 split layout', 'Cosmic background animations', 'Floating pyramid', 'Mobile-optimized'],
      status: 'complete'
    },
    {
      id: 'signup',
      title: 'Key Forging',
      description: 'Elegant signup with mystical branding and conversion clarity', 
      features: ['Chronicle-style minimal design', 'Pyramid mysticism', 'Supabase auth integration', 'Mobile-first'],
      status: 'complete'
    },
    {
      id: 'temple',
      title: 'Mind Temple Dashboard',
      description: 'Full-featured prompt enhancement workspace with mystical aesthetics',
      features: ['Direct & Guided enhancement modes', 'Output panel with copy/export', 'Credits orb system', 'Sacred geometry background'],
      status: 'complete'
    }
  ];

  const techStack = [
    { name: 'React + TypeScript', icon: '⚛️' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'Motion/React', icon: '✨' },
    { name: 'Supabase Auth', icon: '🔐' },
    { name: 'Streamlined UX', icon: '🚀' },
    { name: 'Mobile First', icon: '📱' },
    { name: 'Dashboard UI', icon: '🎛️' },
    { name: 'Enhancement Engine', icon: '🧠' }
  ];

  const currentStep = flowSteps.find(step => step.id === currentPage);

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs">
      <Card className="bg-temple-black/95 backdrop-blur-md border-royal-gold/20 p-3">
        {/* Current Step Info */}
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-3 h-3 text-royal-gold" />
            <h3 className="text-royal-gold font-medium text-sm">Current View</h3>
          </div>
          
          {currentStep && (
            <div className="bg-marble-white/5 rounded-lg p-2 border border-royal-gold/10">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-marble-white font-medium text-sm">{currentStep.title}</h4>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    currentStep.status === 'complete' 
                      ? 'border-cyan-glow/50 text-cyan-glow' 
                      : 'border-violet/50 text-violet'
                  }`}
                >
                  {currentStep.status === 'complete' ? '✓' : '○'}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Flow Progress */}
        <div className="mb-3">
          <h4 className="text-marble-white/80 font-medium mb-2 text-xs">Progress</h4>
          <div className="space-y-0.5">
            {flowSteps.map((step, index) => {
              const isActive = step.id === currentPage;
              const isComplete = step.status === 'complete';
              
              return (
                <div 
                  key={step.id}
                  className={`flex items-center space-x-2 text-xs ${
                    isActive ? 'text-royal-gold' : isComplete ? 'text-cyan-glow/70' : 'text-marble-white/50'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="w-2 h-2" />
                  ) : (
                    <Circle className="w-2 h-2" />
                  )}
                  <span className={`${isActive ? 'font-medium' : ''} truncate`}>{step.title}</span>
                  {isActive && <div className="w-1 h-1 bg-royal-gold rounded-full flex-shrink-0"></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack - Condensed */}
        <div className="mt-2 pt-2 border-t border-royal-gold/10">
          <h4 className="text-marble-white/80 font-medium mb-1 text-xs">Tech</h4>
          <div className="flex flex-wrap gap-1">
            {techStack.slice(0, 4).map((tech) => (
              <Badge
                key={tech.name}
                variant="outline"
                className="text-xs border-marble-white/20 text-marble-white/60 px-1 py-0"
              >
                <span className="mr-1">{tech.icon}</span>
                <span className="text-xs">{tech.name.split(' ')[0]}</span>
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}