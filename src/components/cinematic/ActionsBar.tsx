import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Star, RotateCcw, Crown, Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { copyToClipboard } from '../../lib/clipboardUtils';

interface ActionsBarProps {
  content: string;
  onSave: () => Promise<void>;
  onReEnhance: () => void;
  onUpgrade?: () => void;
  credits: number;
  isLoading?: boolean;
  className?: string;
}

export function ActionsBar({ 
  content, 
  onSave, 
  onReEnhance, 
  onUpgrade,
  credits,
  isLoading = false,
  className = '' 
}: ActionsBarProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopy = async () => {
    const result = await copyToClipboard(content);
    
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      console.error('Copy failed:', result.error);
      // Show user-friendly error message
      alert('Copy failed. Please manually select and copy the text.');
    }
  };

  const handleSave = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`
        flex items-center justify-between
        pt-6 mt-8 border-t border-glass-border/50
        ${className}
      `}
    >
      {/* Primary Actions */}
      <div className="flex items-center space-x-3">
        {/* Copy Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="
              bg-glass-overlay/50 backdrop-blur-md
              border-glass-border hover:border-neon-cyan/40
              text-glass-white hover:text-neon-cyan
              transition-all duration-300
              disabled:opacity-50
            "
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-deep-emerald" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </motion.div>

        {/* Save Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSave}
            variant="outline"
            size="sm"
            disabled={isLoading || saving}
            className="
              bg-glass-overlay/50 backdrop-blur-md
              border-glass-border hover:border-accent-gold/40
              text-glass-white hover:text-accent-gold
              transition-all duration-300
              disabled:opacity-50
            "
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4 mr-2 text-deep-emerald" />
                Saved
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Save to Profile
              </>
            )}
          </Button>
        </motion.div>

        {/* Re-Enhance Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onReEnhance}
            variant="outline"
            size="sm"
            disabled={isLoading || credits <= 0}
            className="
              bg-glass-overlay/50 backdrop-blur-md
              border-glass-border hover:border-deep-emerald/40
              text-glass-white hover:text-deep-emerald
              transition-all duration-300
              disabled:opacity-50
            "
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Re-Enhance
          </Button>
        </motion.div>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center space-x-3">
        {/* Credits Status */}
        <div className="flex items-center space-x-2 text-sm text-glass-white/60">
          <div className={`w-2 h-2 rounded-full ${credits > 0 ? 'bg-deep-emerald' : 'bg-soft-red'}`} />
          <span className="font-mono">{credits} credits</span>
        </div>

        {/* Upgrade Button (for free users hitting limit) */}
        {onUpgrade && credits <= 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onUpgrade}
              size="sm"
              className="
                bg-gradient-to-r from-accent-gold to-deep-emerald
                text-cinematic-dark font-semibold
                border-0 hover:shadow-lg hover:shadow-accent-gold/20
                transition-all duration-300
              "
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}