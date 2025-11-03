import { toast as sonnerToast } from 'sonner@2.0.3';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 3000,
      icon: <CheckCircle2 className="w-5 h-5" />,
      style: {
        background: 'linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(139,92,246,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,217,255,0.3)',
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        boxShadow: '0 0 20px rgba(0,217,255,0.2), 0 20px 25px -5px rgba(0,0,0,0.4)',
        padding: 'var(--spacing-3) var(--spacing-4)',
      },
      className: 'premium-toast',
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <AlertCircle className="w-5 h-5" />,
      style: {
        background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(139,92,246,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        boxShadow: '0 0 20px rgba(239,68,68,0.2), 0 20px 25px -5px rgba(0,0,0,0.4)',
        padding: 'var(--spacing-3) var(--spacing-4)',
      },
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 3000,
      icon: <Info className="w-5 h-5" />,
      style: {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)',
        padding: 'var(--spacing-3) var(--spacing-4)',
      },
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      style: {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)',
        padding: 'var(--spacing-3) var(--spacing-4)',
      },
    });
  },

  custom: (message: string, options?: ToastOptions & { icon?: React.ReactNode }) => {
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration || 3000,
      icon: options?.icon || <Sparkles className="w-5 h-5 text-[#00D9FF]" />,
      style: {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)',
        padding: 'var(--spacing-3) var(--spacing-4)',
      },
    });
  },
};
