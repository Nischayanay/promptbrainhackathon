import { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../../lib/clipboardUtils';

interface PromptBodyProps {
  content: string;
  isTyping?: boolean;
  className?: string;
}

export function PromptBody({ content, isTyping = false, className = '' }: PromptBodyProps) {
  const [copied, setCopied] = useState(false);

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

  // Format content with structured markup
  const formatContent = (text: string): string => {
    let formatted = text;
    
    // Bold headings (lines starting with ##)
    formatted = formatted.replace(/^## (.+)$/gm, '<h3 class="text-lg font-semibold text-neon-cyan mb-3 mt-6 first:mt-0">$1</h3>');
    
    // Bold important terms
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-glass-white">$1</strong>');
    
    // Bullet points
    formatted = formatted.replace(/^- (.+)$/gm, '<li class="text-glass-white/90 mb-2">$1</li>');
    
    // Wrap consecutive list items
    formatted = formatted.replace(/(<li[^>]*>.*<\/li>\s*)+/g, '<ul class="list-disc list-inside space-y-2 mb-4 ml-4">$&</ul>');
    
    // Highlight keywords
    const keywords = ['context', 'clarity', 'enhance', 'improve', 'specific', 'detailed', 'professional', 'effective'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      formatted = formatted.replace(regex, '<span class="text-deep-emerald font-medium relative"><span class="absolute inset-0 bg-deep-emerald/10 rounded px-1 -mx-1"></span><span class="relative">$1</span></span>');
    });
    
    // Paragraphs
    formatted = formatted.replace(/\n\n/g, '</p><p class="text-glass-white/90 leading-relaxed mb-4">');
    formatted = '<p class="text-glass-white/90 leading-relaxed mb-4">' + formatted + '</p>';
    
    return formatted;
  };

  const formattedContent = formatContent(content);

  return (
    <div className={`relative ${className}`}>
      {/* Copy Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="
          absolute top-0 right-0 z-10
          flex items-center space-x-2 px-3 py-2
          bg-glass-overlay backdrop-blur-md rounded-lg
          border border-glass-border
          text-glass-white/80 hover:text-glass-white
          transition-all duration-300
          hover:bg-glass-overlay/80
        "
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-deep-emerald" />
            <span className="text-sm font-medium text-deep-emerald">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="text-sm font-medium">Copy</span>
          </>
        )}
      </motion.button>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: isTyping ? 2 : 0.6,
          ease: "easeOut"
        }}
        className="
          pr-20 pt-2
          text-base leading-relaxed
          font-normal
        "
      >
        {isTyping ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {content.split('\n\n').map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.3,
                  duration: 0.6
                }}
                className="text-glass-white/90 leading-relaxed"
              >
                {paragraph}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div 
            dangerouslySetInnerHTML={{ __html: formattedContent }}
            className="
              prose prose-invert max-w-none content-structured
              prose-headings:text-neon-cyan prose-headings:font-semibold
              prose-strong:text-glass-white prose-strong:font-semibold
              prose-p:text-glass-white/90 prose-p:leading-relaxed
              prose-li:text-glass-white/90 prose-li:leading-relaxed
              prose-ul:space-y-2 prose-ul:my-4
              [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-neon-cyan [&>h3]:mb-3 [&>h3]:mt-6 [&>h3:first-child]:mt-0
              [&>p]:mb-4 [&>p]:leading-relaxed
              [&>ul]:mb-4 [&>ul]:ml-4 [&>ul]:space-y-2
              [&>li]:mb-2
            "
          />
        )}
      </motion.div>

      {/* Reading Progress Indicator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ 
          duration: isTyping ? 2 : 0.8,
          ease: "easeOut",
          delay: 0.2
        }}
        className="
          absolute bottom-0 left-0 h-0.5
          bg-gradient-to-r from-neon-cyan to-deep-emerald
          rounded-full origin-left
          w-full
        "
      />

      {/* Word Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="
          absolute bottom-4 right-0
          text-xs text-glass-white/40 font-mono
        "
      >
        {content.split(' ').length} words
      </motion.div>
    </div>
  );
}