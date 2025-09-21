import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { signUp, signInWithGoogle, signInWithGitHub } from "../utils/auth";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface SignupCardProps {
  onNavigateToLogin: () => void;
  onNavigateToLanding?: () => void;
  onSignupSuccess?: () => void;
}

export function SignupCard({ onNavigateToLogin, onNavigateToLanding, onSignupSuccess }: SignupCardProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    return newErrors;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(formData.email, formData.password, formData.fullName);
      if (result.success) {
        toast.success("Welcome to PromptBrain! Entering the Mind Temple...");
        // Navigate directly to dashboard
        setTimeout(() => onSignupSuccess?.(), 1500);
      } else {
        toast.error(result.error || "Account creation failed");
      }
    } catch (error) {
      toast.error("Network error during signup");
      console.log("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        toast.success("Redirecting to Google...");
      } else {
        toast.error(result.error || "Google signup failed");
      }
    } catch (error) {
      toast.error("Network error during Google signup");
      console.log("Google signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignup = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGitHub();
      if (result.success) {
        toast.success("Redirecting to GitHub...");
      } else {
        toast.error(result.error || "GitHub signup failed");
      }
    } catch (error) {
      toast.error("Network error during GitHub signup");
      console.log("GitHub signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-md bg-temple-black/80 backdrop-blur-md border-royal-gold/20 shadow-2xl">
      <CardHeader className="space-y-1 pb-6">
        {onNavigateToLanding && (
          <div className="flex justify-end mb-2">
            <button 
              onClick={onNavigateToLanding}
              className="text-marble-white/60 hover:text-marble-white transition-colors text-sm"
            >
              ← Back
            </button>
          </div>
        )}
        <div className="text-center">
        <CardTitle 
          className="text-2xl font-light text-marble-white tracking-wide"
          style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
        >
          Begin Your{" "}
          <span 
            className="text-royal-gold"
            style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.4)' }}
          >
            Journey
          </span>
        </CardTitle>
        <CardDescription className="text-marble-white/70 text-sm leading-relaxed">
          Create your temple key to unlock intelligence.
        </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label 
              htmlFor="fullName" 
              className="text-marble-white/90 text-sm font-medium"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              className={`bg-input-background border-royal-gold/20 text-marble-white placeholder:text-marble-white/40 focus:border-royal-gold/60 focus:ring-royal-gold/20 transition-all duration-300 ${errors.fullName ? 'border-red-500/50' : ''}`}
            />
            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="text-marble-white/90 text-sm font-medium"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              className={`bg-input-background border-royal-gold/20 text-marble-white placeholder:text-marble-white/40 focus:border-royal-gold/60 focus:ring-royal-gold/20 transition-all duration-300 ${errors.email ? 'border-red-500/50' : ''}`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          
          {/* Password */}
          <div className="space-y-2">
            <Label 
              htmlFor="password" 
              className="text-marble-white/90 text-sm font-medium"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange('password')}
                className={`bg-input-background border-royal-gold/20 text-marble-white placeholder:text-marble-white/40 focus:border-royal-gold/60 focus:ring-royal-gold/20 transition-all duration-300 pr-12 ${errors.password ? 'border-red-500/50' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-marble-white/40 hover:text-marble-white/70 transition-colors duration-200"
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
          
          {/* Confirm Password */}
          <div className="space-y-2">
            <Label 
              htmlFor="confirmPassword" 
              className="text-marble-white/90 text-sm font-medium"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className={`bg-input-background border-royal-gold/20 text-marble-white placeholder:text-marble-white/40 focus:border-royal-gold/60 focus:ring-royal-gold/20 transition-all duration-300 pr-12 ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-marble-white/40 hover:text-marble-white/70 transition-colors duration-200"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          
          {/* Create Account Button */}
          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-transparent border-2 border-royal-gold text-royal-gold hover:bg-royal-gold hover:text-temple-black transition-all duration-300 font-medium tracking-wide mt-6 disabled:opacity-50"
            style={{ 
              boxShadow: isLoading ? 'none' : '0 0 20px rgba(255, 215, 0, 0.2)',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.2)';
              }
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-royal-gold/30 border-t-royal-gold rounded-full animate-spin"></div>
                Forging your key...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        
        {/* Divider with star icons */}
        <div className="flex items-center space-x-4 my-6">
          <Separator className="flex-1 bg-royal-gold/20" />
          <div className="flex space-x-2">
            <span className="text-royal-gold/60 text-xs">★</span>
            <span className="text-royal-gold/40 text-xs">★</span>
            <span className="text-royal-gold/60 text-xs">★</span>
          </div>
          <Separator className="flex-1 bg-royal-gold/20" />
        </div>
        
        {/* OAuth Buttons */}
        <div className="space-y-3">
          <Button 
            variant="outline"
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-marble-white/5 border-marble-white/20 text-marble-white hover:bg-marble-white/10 hover:border-marble-white/30 transition-all duration-300 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          
          <Button 
            variant="outline"
            type="button"
            onClick={handleGitHubSignup}
            disabled={isLoading}
            className="w-full bg-marble-white/5 border-marble-white/20 text-marble-white hover:bg-marble-white/10 hover:border-marble-white/30 transition-all duration-300 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </Button>
        </div>
        
        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-marble-white/70 text-sm">
            Already a seeker?{" "}
            <button 
              onClick={onNavigateToLogin}
              className="text-royal-gold hover:text-royal-gold/80 transition-colors duration-300 font-medium"
              style={{ textShadow: '0 0 5px rgba(255, 215, 0, 0.3)' }}
            >
              Enter the Mind Temple
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}