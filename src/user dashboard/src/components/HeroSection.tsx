import { motion } from 'motion/react';
import { SearchInterface } from './SearchInterface';
import { AnimatedGradient } from './AnimatedGradient';

// Spring animation config
const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30
};

export function HeroSection() {
  const suggestions = [
    { icon: '💡', label: 'Creative Ideas', prompt: 'Help me brainstorm creative solutions for' },
    { icon: '📊', label: 'Data Analysis', prompt: 'Analyze and provide insights about' },
    { icon: '✍️', label: 'Writing Help', prompt: 'Help me write compelling content about' },
    { icon: '🎨', label: 'Design Ideas', prompt: 'Generate design concepts for' }
  ];

  const handleSuggestionClick = (prompt: string) => {
    const input = document.getElementById('prompt-input') as HTMLTextAreaElement;
    if (input) {
      input.value = prompt + ' ';
      input.focus();
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ padding: 'var(--spacing-10) var(--spacing-4)' }}
      aria-labelledby="hero-heading"
    >
      {/* Animated Gradient Background */}
      <AnimatedGradient />
      
      <div className="w-full max-w-6xl flex flex-col items-center relative z-10" style={{ gap: 'var(--spacing-6)' }}>
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 
            id="hero-heading"
            className="text-6xl md:text-7xl text-white"
            style={{ 
              fontFamily: "'Instrument Serif', serif",
              marginBottom: 'var(--spacing-2)',
              fontSize: 'var(--text-6xl)',
              lineHeight: 1.05,
              letterSpacing: 'var(--tracking-tighter)',
              fontWeight: 650
            }}
          >
            Prompt<span 
              className="text-[#00D9FF]"
              style={{
                textShadow: 'var(--shadow-cyan-md)'
              }}
            >Brain</span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/70"
            style={{ 
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'var(--text-xl)',
              letterSpacing: 'var(--tracking-tight)',
              fontWeight: 450
            }}
          >
            10X better prompts 10X better outputs
          </motion.p>
        </motion.div>

        {/* Search Interface - Primary Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full"
          role="search"
          aria-label="Prompt engineering interface"
        >
          <SearchInterface />
        </motion.div>

        {/* Suggestions */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center justify-center flex-wrap"
          style={{ gap: 'var(--spacing-2)' }}
          aria-label="Quick suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.label}
              onClick={() => handleSuggestionClick(suggestion.prompt)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              className="glass-card rounded-full text-white premium-hover"
              style={{
                padding: 'var(--spacing-1-5) var(--spacing-4)',
                fontSize: 'var(--text-sm)',
                borderRadius: 'var(--radius-full)',
                minHeight: 'var(--min-touch-target)',
                fontWeight: 500,
                letterSpacing: 'var(--tracking-tight)',
                boxShadow: 'var(--shadow-md)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-cyan-md)';
                e.currentTarget.style.borderColor = 'rgba(0,217,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
              aria-label={`Insert ${suggestion.label} prompt template`}
            >
              <span className="mr-2" aria-hidden="true">{suggestion.icon}</span>
              {suggestion.label}
            </motion.button>
          ))}
        </motion.nav>
      </div>

      {/* Section End Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
    </section>
  );
}
