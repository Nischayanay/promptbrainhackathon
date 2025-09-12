import { useState } from 'react';
import { motion } from 'motion/react';
import { OutputContainer } from './OutputContainer';
import { PromptTitle } from './PromptTitle';
import { PromptBody } from './PromptBody';
import { ActionsBar } from './ActionsBar';

interface EnhancedOutputProps {
  content: string;
  isVisible: boolean;
  isTyping?: boolean;
  credits: number;
  onSave: (title: string, content: string) => Promise<void>;
  onReEnhance: () => void;
  onUpgrade?: () => void;
  className?: string;
}

export function EnhancedOutput({
  content,
  isVisible,
  isTyping = false,
  credits,
  onSave,
  onReEnhance,
  onUpgrade,
  className = ''
}: EnhancedOutputProps) {
  const [currentTitle, setCurrentTitle] = useState('');

  // Auto-generate title from content
  const generateTitle = (text: string): string => {
    const words = text.split(' ')
      .filter(word => word.length > 3)
      .slice(0, 6)
      .join(' ');
    return words || 'Enhanced Prompt';
  };

  const handleTitleChange = (newTitle: string) => {
    setCurrentTitle(newTitle);
  };

  const handleSave = async () => {
    const titleToSave = currentTitle || generateTitle(content);
    await onSave(titleToSave, content);
  };

  if (!isVisible || !content) return null;

  return (
    <OutputContainer isVisible={isVisible} className={className}>
      {/* Document-like Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <PromptTitle
          initialTitle={generateTitle(content)}
          onTitleChange={handleTitleChange}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <PromptBody 
          content={content} 
          isTyping={isTyping}
        />
      </motion.div>

      {/* Actions */}
      <ActionsBar
        content={content}
        onSave={handleSave}
        onReEnhance={onReEnhance}
        onUpgrade={onUpgrade}
        credits={credits}
        isLoading={isTyping}
      />
    </OutputContainer>
  );
}