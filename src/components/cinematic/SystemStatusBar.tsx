import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface SystemStatusBarProps {
  credits: number;
  mode: 'direct' | 'flow';
  isOnline: boolean;
  userName?: string;
}

export function SystemStatusBar({ 
  credits, 
  mode, 
  isOnline,
  userName = 'User'
}: SystemStatusBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate sync events
  useEffect(() => {
    const syncTimer = setInterval(() => {
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('synced'), 1000);
    }, 10000);
    return () => clearInterval(syncTimer);
  }, []);

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'text-accent-gold';
      case 'error': return 'text-soft-red';
      default: return 'text-deep-emerald';
    }
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing': return '◐';
      case 'error': return '◯';
      default: return '●';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 right-4 z-40"
    >
      <div className="glass-card rounded-full px-4 py-2 min-w-[300px]">
        <div className="flex items-center justify-between space-x-4">
          {/* User & Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-deep-emerald animate-pulse' : 'bg-soft-red'}`} />
            <span className="text-glass-white font-mono text-xs opacity-80">
              {userName}
            </span>
          </div>

          {/* Mode Indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-neon-cyan font-mono text-xs uppercase tracking-wider">
              {mode}
            </span>
            <div className="w-px h-4 bg-glass-border" />
          </div>

          {/* Credits */}
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{
                scale: credits <= 10 ? [1, 1.1, 1] : 1,
                color: credits <= 10 ? '#FF4D4D' : '#FFD600'
              }}
              transition={{ duration: 0.5, repeat: credits <= 10 ? Infinity : 0 }}
              className="font-mono text-xs font-semibold"
            >
              {credits}
            </motion.div>
            <span className="text-accent-gold font-mono text-xs opacity-60">
              credits
            </span>
            <div className="w-px h-4 bg-glass-border" />
          </div>

          {/* Sync Status */}
          <div className="flex items-center space-x-1">
            <motion.span
              animate={{ 
                rotate: syncStatus === 'syncing' ? 360 : 0 
              }}
              transition={{ 
                duration: 1, 
                repeat: syncStatus === 'syncing' ? Infinity : 0,
                ease: 'linear'
              }}
              className={`${getSyncColor()} font-mono text-xs`}
            >
              {getSyncIcon()}
            </motion.span>
            <span className="text-glass-white font-mono text-xs opacity-60">
              {syncStatus}
            </span>
            <div className="w-px h-4 bg-glass-border" />
          </div>

          {/* Time */}
          <div className="text-glass-white font-mono text-xs opacity-60">
            {currentTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan/10 to-deep-emerald/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Connection Pulse */}
      {isOnline && (
        <motion.div
          className="absolute -top-1 -left-1 w-4 h-4 bg-deep-emerald rounded-full opacity-30"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  );
}