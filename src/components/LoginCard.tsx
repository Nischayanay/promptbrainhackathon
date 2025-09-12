import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { signIn, signInWithGoogle, signInWithGitHub } from "../utils/auth";
import { toast } from "sonner@2.0.3";
import { Eye, EyeOff } from "lucide-react";

interface LoginCardProps {
  onNavigateToSignup: () => void;
  onNavigateToLanding?: () => void;
  onLoginSuccess?: () => void;
}

export function LoginCard({ onNavigateToSignup, onNavigateToLanding, onLoginSuccess }: LoginCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        toast.success("Redirecting to Google...");
        // OAuth will redirect to callback URL
      } else {
        toast.error(result.error || "Google sign in failed");
      }
    } catch (error) {
      toast.error("Network error during Google sign in");
      console.log("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Basic validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.success) {
        toast.success("Welcome back! Entering the Mind Temple...");
        console.log("Login successful:", result.user);
        // Navigate to dashboard
        setTimeout(() => onLoginSuccess?.(), 1000);
      } else {
        toast.error(result.error || "Sign in failed");
      }
    } catch (error) {
      toast.error("Network error during sign in");
      console.log("Email login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGitHub();
      if (result.success) {
        toast.success("Redirecting to GitHub...");
        // OAuth will redirect to callback URL
      } else {
        toast.error(result.error || "GitHub sign in failed");
      }
    } catch (error) {
      toast.error("Network error during GitHub sign in");
      console.log("GitHub login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Enhanced Glassmorphic Card with Soft Shadows */}
      <div 
        className="relative bg-card/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10"
        style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Header with Logo & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-gold to-electric-blue flex items-center justify-center pulse-glow">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-temple-black">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-marble-white">PromptBrain</span>
          </div>
          
          {onNavigateToLanding && (
            <button 
              onClick={onNavigateToLanding}
              className="text-marble-white/60 hover:text-marble-white transition-colors text-sm"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Heading with glow on "Temple" */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-marble-white mb-2">
            Enter the Mind{" "}
            <span 
              className="text-royal-gold"
              style={{ 
                textShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                animation: 'temple-glow 4s ease-in-out infinite'
              }}
            >
              Temple
            </span>
          </h1>
          <p className="text-white/70">
            Forge intelligence from imagination.
          </p>
        </div>

        {/* Login Methods */}
        <div className="space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-electric-blue to-violet hover:from-violet hover:to-electric-blue text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-electric-blue/25 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-marble-white/30 border-t-marble-white rounded-full animate-spin"></div>
                  Entering Temple...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </div>
              )}
            </Button>
            
            <Button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full h-12 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </div>
            </Button>
          </div>

          {/* Divider with subtle star icons */}
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-card px-4 flex items-center space-x-2">
                <svg className="w-3 h-3 text-royal-gold/40" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0L10 6H16L11 9L13 16L8 12L3 16L5 9L0 6H6L8 0Z" />
                </svg>
                <span className="text-sm text-white/50">or</span>
                <svg className="w-3 h-3 text-royal-gold/40" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0L10 6H16L11 9L13 16L8 12L3 16L5 9L0 6H6L8 0Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 bg-white/5 border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-electric-blue/50 focus:ring-0 transition-all duration-200 ${errors.email ? 'border-red-500/50' : ''}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-12 bg-white/5 border-white/10 rounded-lg text-white placeholder:text-white/40 focus:border-electric-blue/50 focus:ring-0 transition-all duration-200 pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-transparent border-2 border-royal-gold text-royal-gold font-medium rounded-lg hover:bg-royal-gold/10 hover:shadow-lg hover:shadow-royal-gold/25 transition-all duration-200 disabled:opacity-50"
              style={{
                boxShadow: isLoading ? 'none' : '0 0 20px rgba(255, 215, 0, 0.15)',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-royal-gold/30 border-t-royal-gold rounded-full animate-spin"></div>
                  Entering Temple...
                </div>
              ) : (
                "Enter with Email"
              )}
            </Button>
          </form>

          {/* Sign up link - highlighted cyan */}
          <div className="text-center">
            <span className="text-white/60 text-sm">
              No account?{" "}
              <button 
                onClick={onNavigateToSignup}
                className="text-cyan-glow hover:text-electric-blue transition-colors duration-200 font-medium"
                style={{ textShadow: '0 0 10px rgba(0, 255, 247, 0.3)' }}
              >
                Begin your journey
              </button>
            </span>
          </div>
        </div>


      </div>
    </div>
  );
}