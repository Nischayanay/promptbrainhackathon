import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HeroSection } from './HeroSection';
import { CinematicBackground } from './CinematicBackground';
import { DashboardCard } from './DashboardCard';
import { PromptConsole } from './PromptConsole';
import { SystemStatusBar } from './SystemStatusBar';
import { EnhancedOutput } from './EnhancedOutput';
import { getCurrentSession } from '../../utils/auth';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { getPromptContent, type EnhancedPrompt } from '../../lib/promptUtils';

interface CinematicDashboardProps {
  onNavigateToProfile?: () => void;
}

export function CinematicDashboard({ onNavigateToProfile }: CinematicDashboardProps) {
  const [showHero, setShowHero] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentMode, setCurrentMode] = useState<'direct' | 'flow'>('direct');
  const [credits, setCredits] = useState(50);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState<EnhancedPrompt>('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      try {
        const session = await getCurrentSession();
        if (session.success && session.profile) {
          setUserName(session.profile.name || 'User');
          setCredits(session.profile.credits || 50);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleHeroTransition = () => {
    setShowHero(false);
    setTimeout(() => {
      setShowDashboard(true);
    }, 100);
  };

  const handleEnhance = async (prompt: string) => {
    if (credits <= 0) return;
    
    setIsEnhancing(true);
    setOriginalPrompt(prompt);
    
    try {
      const session = await getCurrentSession();
      const authHeader = session.success && session.access_token 
        ? `Bearer ${session.access_token}` 
        : `Bearer ${publicAnonKey}`;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/enhance-prompt`,
        {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mode: currentMode,
            originalPrompt: prompt,
            flowData: {}
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to enhance prompt');
      }

      const data = await response.json();
      if (data.success) {
        setEnhancedPrompt(data.enhancedPrompt);
        setShowOutput(true);
        setCredits(prev => Math.max(0, prev - 1));
        
        // Show different success message based on response format
        const hasRulebook = typeof data.enhancedPrompt === 'object' && data.enhancedPrompt.short && data.enhancedPrompt.detailed;
        if (hasRulebook) {
          toast.success('Prompt enhanced with Rulebook! Both short and detailed versions ready ✨');
        } else {
          toast.success('Prompt enhanced successfully! ✨');
        }
      } else {
        throw new Error(data.error || 'Enhancement failed');
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error('Failed to enhance prompt. Please try again.');
      
      // Fallback to mock enhancement with rulebook format
      const mockEnhanced = {
        short: `Create a clear and effective response for: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`,
        detailed: `Enhanced Prompt: ${prompt}\n\nContext: This prompt has been optimized for clarity, specificity, and effectiveness using PromptBrain's cinematic AI principles. It includes structured formatting and clear instructions to generate better AI responses.\n\nKey improvements:\n- Added specific context and constraints\n- Structured the request with clear sections\n- Included output format specifications\n- Enhanced clarity and precision\n- Applied audience and purpose considerations`
      };
      
      setEnhancedPrompt(mockEnhanced);
      setShowOutput(true);
      setCredits(prev => Math.max(0, prev - 1));
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleModeSwitch = (mode: 'direct' | 'flow') => {
    setCurrentMode(mode);
  };

  const handleSaveToArchives = async (title: string, content: string) => {
    try {
      const session = await getCurrentSession();
      if (session.success && session.access_token) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/user/save-prompt`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: title,
              content: content,
              original: originalPrompt,
              mode: currentMode,
              category: 'General'
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            toast.success('Prompt saved successfully!');
          } else {
            console.error('Failed to save prompt:', data.error);
            toast.error('Failed to save prompt');
          }
        }
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    }
  };

  if (showHero) {
    return (
      <HeroSection 
        onTransitionComplete={handleHeroTransition}
        shouldStartTransition={true}
      />
    );
  }

  return (
    <CinematicBackground className="min-h-screen">
      {/* System Status Bar */}
      <SystemStatusBar
        credits={credits}
        mode={currentMode}
        isOnline={true}
        userName={userName}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showDashboard ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 py-8"
      >
        {/* Main Dashboard Layout */}
        <div className={`transition-all duration-500 ease-in-out ${
          showOutput ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 h-screen' : 'flex flex-col items-center justify-center min-h-screen'
        }`}>
          
          {/* Input Section */}
          <div className={`${showOutput ? 'flex flex-col justify-center' : 'w-full max-w-6xl'} space-y-8`}>
            {!showOutput && (
              <>
                {/* Welcome Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-center space-y-4 mb-12"
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-glass-white mb-4">
                    Mind
                    <span className="text-transparent bg-gradient-to-r from-neon-cyan to-deep-emerald bg-clip-text ml-4">
                      Temple
                    </span>
                  </h1>
                  <p className="text-xl text-glass-white opacity-80 font-light max-w-2xl mx-auto">
                    Transform your prompts with cinematic AI precision
                  </p>
                </motion.div>

                {/* Mode Selection Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                  <DashboardCard
                    title="Direct Mode"
                    glowColor={currentMode === 'direct' ? 'cyan' : 'gold'}
                    onClick={() => handleModeSwitch('direct')}
                    delay={0.1}
                    className={currentMode === 'direct' ? 'ring-2 ring-neon-cyan' : ''}
                  >
                    <p className="text-glass-white opacity-70 text-sm mb-3">
                      Instant AI enhancement with powerful algorithms
                    </p>
                    <div className="flex items-center space-x-2 text-neon-cyan text-xs">
                      <span>⚡</span>
                      <span>Fast processing</span>
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="Flow Mode"
                    glowColor={currentMode === 'flow' ? 'emerald' : 'gold'}
                    onClick={() => handleModeSwitch('flow')}
                    delay={0.2}
                    className={currentMode === 'flow' ? 'ring-2 ring-deep-emerald' : ''}
                  >
                    <p className="text-glass-white opacity-70 text-sm mb-3">
                      Guided enhancement with step-by-step refinement
                    </p>
                    <div className="flex items-center space-x-2 text-deep-emerald text-xs">
                      <span>🎯</span>
                      <span>Guided process</span>
                    </div>
                  </DashboardCard>
                </motion.div>
              </>
            )}

            {/* Prompt Console */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: showOutput ? 0 : 0.6, duration: 0.8 }}
            >
              <PromptConsole
                onEnhance={handleEnhance}
                isLoading={isEnhancing}
                credits={credits}
                placeholder={`Enter your prompt for ${currentMode} enhancement...`}
              />
            </motion.div>
          </div>

          {/* Output Section */}
          {showOutput && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center overflow-y-auto"
            >
              <EnhancedOutput
                content={getPromptContent(enhancedPrompt)}
                isVisible={showOutput}
                isTyping={isEnhancing}
                credits={credits}
                onSave={handleSaveToArchives}
                onReEnhance={() => handleEnhance(originalPrompt)}
                onUpgrade={() => toast.info('Upgrade functionality coming soon!')}
              />
            </motion.div>
          )}
        </div>

        {/* Quick Stats Dashboard - Only show when not in output mode */}
        {!showOutput && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <DashboardCard
              title="Usage Stats"
              glowColor="gold"
              delay={0.1}
              isFloating={false}
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-glass-white opacity-70">Today</span>
                  <span className="text-accent-gold font-mono">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-glass-white opacity-70">This Month</span>
                  <span className="text-accent-gold font-mono">180</span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Recent Activity"
              glowColor="cyan"
              delay={0.2}
              isFloating={false}
            >
              <div className="space-y-1 text-xs text-glass-white opacity-70">
                <div>Enhanced marketing copy</div>
                <div>Refined blog outline</div>
                <div>Optimized email subject</div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Quick Actions"
              glowColor="emerald"
              delay={0.3}
              isFloating={false}
            >
              <div className="space-y-2">
                <button 
                  onClick={onNavigateToProfile}
                  className="w-full text-left text-sm text-glass-white opacity-70 hover:opacity-100 transition-opacity"
                >
                  → View Profile
                </button>
                <button className="w-full text-left text-sm text-glass-white opacity-70 hover:opacity-100 transition-opacity">
                  → Browse Archives
                </button>
              </div>
            </DashboardCard>
          </motion.div>
        )}
      </motion.div>
    </CinematicBackground>
  );
}