import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Zap, Plus, Info, Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface CreditsOrbProps {
  credits: number;
}

export function CreditsOrb({ credits }: CreditsOrbProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getOrbColor = () => {
    if (credits <= 0) return 'from-marble-white/20 to-marble-white/10 border-marble-white/20';
    if (credits <= 3) return 'from-soft-red/30 to-royal-gold/20 border-royal-gold/40';
    if (credits <= 7) return 'from-royal-gold/30 to-electric-blue/20 border-royal-gold/50';
    return 'from-royal-gold/40 to-cyan-glow/30 border-cyan-glow/60';
  };

  const getGlowIntensity = () => {
    if (credits <= 0) return '';
    if (credits <= 3) return 'pulse-glow';
    return 'pulse-glow';
  };

  return (
    <TooltipProvider>
      <motion.div 
        className="fixed top-8 right-8 z-40"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glass Orb Background */}
              <div className="relative w-16 h-16">
                {/* Outer glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={credits > 0 ? {
                    boxShadow: [
                      '0 0 15px rgba(255, 215, 0, 0.2)',
                      '0 0 25px rgba(255, 215, 0, 0.4)',
                      '0 0 15px rgba(255, 215, 0, 0.2)'
                    ]
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Glass orb */}
                <div className={`
                  absolute inset-0 rounded-full backdrop-blur-xl border
                  ${credits <= 0 ? 'bg-gradient-to-br from-marble-white/10 to-marble-white/5 border-marble-white/20' :
                    credits <= 3 ? 'bg-gradient-to-br from-royal-gold/20 to-royal-gold/10 border-royal-gold/30' :
                    'bg-gradient-to-br from-royal-gold/30 to-electric-blue/20 border-royal-gold/40'
                  }
                  transition-all duration-300 group-hover:border-opacity-60
                `}>
                  
                  {/* Energy particles */}
                  {credits > 0 && (
                    <>
                      <motion.div 
                        className="absolute w-1 h-1 bg-royal-gold rounded-full top-2 left-3"
                        animate={{ 
                          y: [0, -3, 0],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div 
                        className="absolute w-0.5 h-0.5 bg-electric-blue rounded-full top-4 right-2"
                        animate={{ 
                          y: [0, -2, 0],
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                      />
                      <motion.div 
                        className="absolute w-0.5 h-0.5 bg-cyan-glow rounded-full bottom-3 left-2"
                        animate={{ 
                          y: [0, -2, 0],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      />
                    </>
                  )}
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-lg font-light ${
                      credits <= 0 ? 'text-marble-white/40' : 
                      credits <= 3 ? 'text-royal-gold' : 'text-marble-white'
                    }`}>
                      {credits}
                    </div>
                    <Circle className={`w-2 h-2 ${
                      credits <= 0 ? 'text-marble-white/20' : 
                      credits <= 3 ? 'text-royal-gold/60' : 'text-electric-blue/60'
                    }`} />
                  </div>
                </div>
              </div>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent className="bg-temple-black/90 backdrop-blur-sm border-royal-gold/20 text-marble-white">
            <div className="text-center">
              <p className="font-light">Temple Keys</p>
              <p className="text-xs text-marble-white/60">
                {credits > 0 ? `${credits} enhancements available` : 'Energy depleted'}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Minimal Expanded Details */}
        {showDetails && (
          <motion.div 
            className="absolute top-20 right-0 w-72"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Glass card */}
            <div className="bg-temple-black/80 backdrop-blur-xl border border-marble-white/10 rounded-2xl p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-royal-gold rounded-full animate-pulse" />
                    <h3 className="text-marble-white font-light">Temple Keys</h3>
                  </div>
                  <motion.button
                    onClick={() => setShowDetails(false)}
                    className="text-marble-white/40 hover:text-marble-white/60 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>

                {/* Current Status */}
                <div className="bg-gradient-to-br from-marble-white/5 to-marble-white/10 backdrop-blur-sm rounded-xl p-4 border border-marble-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-marble-white/60 font-light">Available</span>
                    <div className={`px-3 py-1 rounded-full text-xs font-light ${
                      credits <= 0 ? 'bg-marble-white/10 text-marble-white/50' :
                      credits <= 3 ? 'bg-royal-gold/20 text-royal-gold' :
                      'bg-electric-blue/20 text-electric-blue'
                    }`}>
                      {credits} Keys
                    </div>
                  </div>
                  
                  {/* Minimalist progress */}
                  <div className="w-full h-1 bg-marble-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        credits <= 0 ? 'bg-marble-white/20' :
                        credits <= 3 ? 'bg-royal-gold' :
                        'bg-gradient-to-r from-royal-gold to-electric-blue'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((credits / 10) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  
                  <p className="text-xs text-marble-white/50 mt-3 font-light">
                    {credits <= 0 
                      ? 'Energy regenerates naturally' 
                      : 'Each enhancement costs 1 key'
                    }
                  </p>
                </div>

                {/* Simple info */}
                <p className="text-xs text-marble-white/40 font-light leading-relaxed">
                  Sacred energy for prompt enhancement. More keys unlock as your wisdom grows.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}