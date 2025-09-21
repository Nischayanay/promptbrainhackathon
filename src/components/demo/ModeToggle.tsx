import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { DemoMode } from "./HowItWorks";

interface ModeToggleProps {
  activeMode: DemoMode;
  onModeChange: (mode: DemoMode) => void;
  demoData: Array<{
    mode: DemoMode;
    title: string;
    inputText: string;
    outputText: string;
  }>;
}

export function ModeToggle({ activeMode, onModeChange, demoData }: ModeToggleProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const getModeIcon = (mode: DemoMode) => {
    switch (mode) {
      case 'research':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'product':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
    }
  };

  const getModeLabel = (mode: DemoMode) => {
    switch (mode) {
      case 'research':
        return 'Research';
      case 'product':
        return 'Product Spec';
      default:
        return 'General';
    }
  };

  return (
    <div className="flex justify-center">
      <div className="relative bg-landing-white/[0.03] backdrop-blur-sm border border-landing-white/10 rounded-full p-1">
        {demoData.map((demo) => (
          <button
            key={demo.mode}
            onClick={() => onModeChange(demo.mode)}
            className={`relative px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeMode === demo.mode
                ? 'text-landing-white'
                : 'text-landing-white/60 hover:text-landing-white/80'
            }`}
          >
            {/* Active background */}
            {activeMode === demo.mode && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-landing-blue rounded-full"
                initial={false}
                transition={prefersReducedMotion ? { duration: 0 } : { 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 35 
                }}
              />
            )}
            
            {/* Icon and Text */}
            <span className="relative z-10 flex items-center gap-2">
              {getModeIcon(demo.mode)}
              <span className="hidden sm:inline">
                {getModeLabel(demo.mode)}
              </span>
              <span className="sm:hidden">
                {demo.mode === 'product' ? 'Spec' : getModeLabel(demo.mode)}
              </span>
            </span>

            {/* Hover effect */}
            {activeMode !== demo.mode && (
              <motion.div
                className="absolute inset-0 bg-landing-white/[0.05] rounded-full opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}

        {/* Glow effect for active mode */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 bg-landing-blue/20 rounded-full blur-lg opacity-0"
            animate={{
              opacity: activeMode ? [0, 0.3, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    </div>
  );
}