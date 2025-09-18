import { useState } from 'react';
import { motion } from 'motion/react';
import { Chrome, Loader2, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';
import { signInWithGoogle } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

interface GoogleAuthProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  mode?: 'signup' | 'login';
}

export function GoogleAuth({ onSuccess, onError, mode = 'signup' }: GoogleAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        onError?.(result.error);
        toast.error(result.error);
        return;
      }
      // Supabase OAuth will redirect; if it does not (e.g. popup), navigate on success
      onSuccess?.(null);
      toast.success('Redirecting to Google...');
      // Optional: navigate('/enhance') after auth listener catches SIGNED_IN
    } catch (e) {
      onError?.('Authentication failed. Please try again.');
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Button
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium py-3 h-auto transition-all duration-200"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
        ) : (
          <Chrome className="w-5 h-5 mr-3" />
        )}
        <span className="flex-1">
          {mode === 'signup' ? 'Sign up' : 'Continue'} with Google
        </span>
        {mode === 'signup' && (
          <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
            <Zap className="w-3 h-3" />
            <span>50 credits</span>
          </div>
        )}
      </Button>
      
      {mode === 'signup' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-center text-gray-500 mt-3"
        >
          🎁 Get instant access with 50 free credits to enhance your prompts
        </motion.p>
      )}
    </motion.div>
  );
}

// Hook for checking authentication status
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useState(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('promptbrain_user');
      const authToken = localStorage.getItem('promptbrain_auth_token');
      
      if (storedUser && authToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('promptbrain_user');
          localStorage.removeItem('promptbrain_auth_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  });

  const signOut = () => {
    localStorage.removeItem('promptbrain_user');
    localStorage.removeItem('promptbrain_auth_token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Signed out successfully');
  };

  const updateUserCredits = (credits: number) => {
    if (user) {
      const updatedUser = { ...user, credits };
      setUser(updatedUser);
      localStorage.setItem('promptbrain_user', JSON.stringify(updatedUser));
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
    updateUserCredits
  };
}