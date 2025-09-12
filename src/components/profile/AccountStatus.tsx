import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Crown, Sparkles, ArrowRight, Zap } from "lucide-react";
import { motion } from "motion/react";

interface AccountStatusProps {
  className?: string;
}

export function AccountStatus({ className = "" }: AccountStatusProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulseActive, setIsPulseActive] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Activate pulse animation after component loads
    const timer = setTimeout(() => {
      setIsPulseActive(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const accountData = {
    type: "Free",
    isPaid: false,
    creditsRemaining: 47,
    totalCredits: 50,
    upgradePrice: "$9.99"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className={className}
    >
      <Card className="bg-landing-white/5 border-landing-white/10 backdrop-blur-sm hover:border-landing-white/20 transition-all duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-landing-blue/20 to-landing-blue/10 rounded-xl flex items-center justify-center"
                animate={isPulseActive ? { 
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 40px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.3)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Crown className="w-5 h-5 text-landing-blue" />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-landing-white">Account Status</h2>
                <p className="text-landing-white/60 text-sm">Current plan and benefits</p>
              </div>
            </div>
            
            <Badge 
              variant="outline" 
              className={`${
                accountData.isPaid 
                  ? "border-landing-blue/50 text-landing-blue bg-landing-blue/10" 
                  : "border-landing-blue/50 text-landing-blue bg-landing-blue/10"
              } px-3 py-1 font-medium`}
            >
              {accountData.isPaid ? "Premium" : "Free Tier"}
            </Badge>
          </div>

          {/* Account Type Info */}
          <div className="mb-6">
            <div className="bg-landing-white/5 rounded-lg p-4 border border-landing-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-landing-white/70 text-sm">Account Type</span>
                <span className="text-landing-white font-medium">{accountData.type}</span>
              </div>
              
              {!accountData.isPaid && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-landing-white/70 text-sm">Credits Remaining</span>
                    <span className="text-landing-blue font-medium">
                      {accountData.creditsRemaining} / {accountData.totalCredits}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="w-full bg-landing-white/10 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-landing-blue to-landing-blue/80 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(accountData.creditsRemaining / accountData.totalCredits) * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Upgrade CTA */}
          {!accountData.isPaid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <div className="bg-gradient-to-br from-landing-blue/10 to-landing-blue/5 rounded-lg p-4 border border-landing-blue/20">
                <div className="text-center">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-landing-blue/30 to-landing-blue/20 rounded-full flex items-center justify-center mx-auto mb-3"
                    animate={isPulseActive ? { 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 40px rgba(59, 130, 246, 0.5)", 
                        "0 0 20px rgba(59, 130, 246, 0.3)"
                      ]
                    } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-6 h-6 text-landing-blue" />
                  </motion.div>
                  
                  <h3 className="text-lg font-semibold text-landing-white mb-2">
                    Unlock Unlimited Power
                  </h3>
                  <p className="text-landing-white/70 mb-4 text-sm leading-relaxed">
                    Upgrade to Premium and get unlimited credits, advanced features, and priority support.
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-landing-white/60 line-through text-sm">$19.99</span>
                    <span className="text-landing-blue font-bold text-xl">{accountData.upgradePrice}</span>
                    <span className="text-landing-white/70 text-sm">/month</span>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="sm"
                      disabled // Non-clickable as per PRD
                      className={`
                        w-full bg-gradient-to-r from-landing-blue to-landing-blue/80 text-white font-medium 
                        hover:from-landing-blue/90 hover:to-landing-blue/70 transition-all duration-300
                        shadow-lg hover:shadow-xl hover:shadow-landing-blue/25
                        cursor-not-allowed opacity-75
                        ${isPulseActive ? 'animate-pulse' : ''}
                      `}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>

                  <p className="text-landing-white/50 text-xs mt-2">
                    ✨ Coming Soon - Future upgrade path
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}