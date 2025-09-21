import { useState, useEffect } from "react";
import { ProfileHeader } from "./profile/ProfileHeader";
import { AccountStatus } from "./profile/AccountStatus";
import { SavedPrompts } from "./profile/SavedPrompts";
import { Stats } from "./profile/Stats";
import { Button } from "./ui/button";
import { ArrowLeft, LogOut, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "../utils/auth";
import { toast } from "sonner";

interface ProfileProps {
  onNavigateBack?: () => void;
  onNavigateToTemple?: () => void;
  onNavigateToLanding?: () => void;
}

export function Profile({ onNavigateBack, onNavigateToTemple, onNavigateToLanding }: ProfileProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await signOut();
      if (result.success) {
        toast.success("Successfully logged out. Safe travels!");
        // Small delay for user to see the message, then redirect to landing
        setTimeout(() => {
          onNavigateToLanding?.();
        }, 1000);
      } else {
        toast.error(result.error || "Logout failed");
        setIsLoggingOut(false);
      }
    } catch (error) {
      toast.error("Network error during logout");
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-landing-black landing-theme">
      {/* Minimal background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient overlay */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-landing-blue/5 to-landing-blue/3 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-landing-blue/3 to-landing-blue/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="border-b border-landing-white/10 bg-landing-black/80 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {onNavigateBack && (
                  <Button
                    onClick={onNavigateBack}
                    variant="outline"
                    size="sm"
                    className="border-landing-white/20 text-landing-white hover:bg-landing-white/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                
                <div>
                  <h1 className="text-2xl font-semibold text-landing-white">
                    Profile
                  </h1>
                  <p className="text-landing-white/60 text-sm">
                    Manage your account and view your activity
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {onNavigateToTemple && (
                  <Button
                    onClick={onNavigateToTemple}
                    variant="outline"
                    size="sm"
                    className="border-landing-blue/40 text-landing-blue hover:bg-landing-blue/10 hover:border-landing-blue/60"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Enter Temple
                  </Button>
                )}
                
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  size="sm"
                  className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Cards */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* User Info & Account Status Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ProfileHeader className="lg:col-span-2" />
              <AccountStatus />
            </div>

            {/* Activity Section */}
            <div className="space-y-8">
              <Stats />
              <SavedPrompts />
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
          className="border-t border-landing-white/10 bg-landing-black/80 backdrop-blur-sm mt-16"
        >
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-landing-blue to-landing-blue/80 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <div>
                  <div className="text-landing-white font-semibold">PromptBrain</div>
                  <div className="text-landing-white/60 text-xs">Architecting Context for Smarter Prompts</div>
                </div>
              </div>
              
              <div className="text-landing-white/40 text-sm">
                © 2024 PromptBrain. All rights reserved.
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}