import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap } from 'lucide-react';
import { GoogleAuth } from './GoogleAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
  mode?: 'signup' | 'login';
}

export function AuthModal({ isOpen, onClose, onAuthSuccess, mode = 'signup' }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>(mode);

  const handleAuthSuccess = (user: any) => {
    onAuthSuccess(user);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-temple-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-landing-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-landing-blue/5 to-cyan-400/5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-landing-blue to-cyan-400 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {authMode === 'signup' ? 'Join PromptBrain' : 'Welcome Back'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {authMode === 'signup' ? 'Get 50 free credits to start' : 'Continue enhancing prompts'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Benefits for signup */}
                {authMode === 'signup' && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">What you get:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-landing-blue rounded-full" />
                        50 free credits to enhance your prompts
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-landing-blue rounded-full" />
                        Transform simple prompts into detailed instructions
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-landing-blue rounded-full" />
                        Save and organize your enhanced prompts
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-landing-blue rounded-full" />
                        Earn more credits through daily use and sharing
                      </li>
                    </ul>
                  </div>
                )}

                {/* Google Auth Component */}
                <GoogleAuth
                  mode={authMode}
                  onSuccess={handleAuthSuccess}
                  onError={(error) => {
                    console.error('Auth error:', error);
                  }}
                />

                {/* Mode Toggle */}
                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                      className="text-landing-blue font-medium hover:underline"
                    >
                      {authMode === 'signup' ? 'Sign in' : 'Sign up'}
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}