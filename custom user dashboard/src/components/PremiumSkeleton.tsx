import { motion } from 'motion/react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function PremiumSkeleton({ 
  variant = 'rectangular', 
  width = '100%', 
  height = 20,
  className = ''
}: SkeletonProps) {
  const getStyles = () => {
    const baseStyles = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    };

    switch (variant) {
      case 'text':
        return {
          ...baseStyles,
          borderRadius: 'var(--radius-xs)',
        };
      case 'circular':
        return {
          width: typeof height === 'number' ? `${height}px` : height,
          height: typeof height === 'number' ? `${height}px` : height,
          borderRadius: '50%',
        };
      case 'card':
        return {
          ...baseStyles,
          borderRadius: 'var(--radius-lg)',
        };
      default:
        return {
          ...baseStyles,
          borderRadius: 'var(--radius-md)',
        };
    }
  };

  return (
    <motion.div
      className={`skeleton ${className}`}
      style={getStyles()}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}

// Preset skeleton layouts
export function SkeletonCard() {
  return (
    <div 
      className="glass-card p-4 space-y-4"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-4)'
      }}
    >
      <div className="flex items-center gap-3">
        <PremiumSkeleton variant="circular" height={40} />
        <div className="flex-1 space-y-2">
          <PremiumSkeleton variant="text" height={16} width="60%" />
          <PremiumSkeleton variant="text" height={12} width="40%" />
        </div>
      </div>
      <PremiumSkeleton variant="rectangular" height={100} />
      <div className="space-y-2">
        <PremiumSkeleton variant="text" height={12} />
        <PremiumSkeleton variant="text" height={12} width="90%" />
        <PremiumSkeleton variant="text" height={12} width="75%" />
      </div>
    </div>
  );
}

export function SkeletonOutput() {
  return (
    <div 
      className="glass-card space-y-3"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-5)'
      }}
    >
      <div className="flex items-center justify-between">
        <PremiumSkeleton variant="text" height={20} width={120} />
        <PremiumSkeleton variant="rectangular" height={32} width={80} />
      </div>
      <div className="space-y-2">
        <PremiumSkeleton variant="text" height={14} />
        <PremiumSkeleton variant="text" height={14} />
        <PremiumSkeleton variant="text" height={14} width="95%" />
        <PremiumSkeleton variant="text" height={14} width="88%" />
        <PremiumSkeleton variant="text" height={14} width="92%" />
      </div>
      <div className="pt-3 border-t" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="flex gap-2">
          <PremiumSkeleton variant="rectangular" height={36} width={100} />
          <PremiumSkeleton variant="rectangular" height={36} width={100} />
        </div>
      </div>
    </div>
  );
}
