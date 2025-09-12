import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit3, Check, X } from 'lucide-react';

interface PromptTitleProps {
  initialTitle: string;
  onTitleChange: (newTitle: string) => void;
  className?: string;
}

export function PromptTitle({ initialTitle, onTitleChange, className = '' }: PromptTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-generate title from first 5-6 keywords
  const generateTitle = (text: string): string => {
    const words = text.split(' ').filter(word => word.length > 3);
    return words.slice(0, 6).join(' ');
  };

  useEffect(() => {
    if (initialTitle !== title) {
      const autoTitle = generateTitle(initialTitle);
      setTitle(autoTitle);
      setTempTitle(autoTitle);
    }
  }, [initialTitle]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const newTitle = tempTitle.trim();
    if (newTitle) {
      setTitle(newTitle);
      onTitleChange(newTitle);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center space-x-3 flex-1">
        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 flex-1"
          >
            <input
              ref={inputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="
                flex-1 bg-transparent border-b-2 border-neon-cyan/40
                text-xl font-semibold text-glass-white
                focus:border-neon-cyan focus:outline-none
                transition-colors duration-300
                pb-1
              "
              placeholder="Enter prompt title..."
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveEdit}
              className="text-deep-emerald hover:text-deep-emerald/80 transition-colors"
            >
              <Check className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancelEdit}
              className="text-soft-red hover:text-soft-red/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center space-x-3 flex-1 group cursor-pointer"
            onClick={handleStartEdit}
          >
            <h2 className="text-xl font-semibold text-glass-white group-hover:text-neon-cyan transition-colors duration-300">
              {title}
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Edit3 className="w-4 h-4 text-neon-cyan/60" />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Status Indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center space-x-2"
      >
        <div className="w-2 h-2 bg-deep-emerald rounded-full animate-pulse" />
        <span className="text-xs text-glass-white/60 font-mono">Enhanced</span>
      </motion.div>
    </div>
  );
}