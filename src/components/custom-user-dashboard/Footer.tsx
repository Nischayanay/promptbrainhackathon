import { useState } from 'react';
import { motion } from 'motion/react';

// Spring animation config
const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30
};

export function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const navigationLinks = ['Feedbacks', 'Careers', 'Pricing'];
  const socialLinks = [
    { name: 'Instagram', url: '#' },
    { name: 'X', url: '#' },
    { name: 'Telegram', url: '#' }
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('promptbrain.ops@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div 
      className="w-full text-white border-t" 
      style={{ 
        padding: 'var(--spacing-8) var(--spacing-6)',
        background: 'var(--pb-black)',
        borderColor: 'var(--glass-border)'
      }}
    >
      <div 
        className="flex items-start justify-between flex-wrap"
        style={{ gap: 'var(--spacing-6)', padding: 'var(--spacing-3)' }}
      >
        {/* Left Section - Brand Statement */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex flex-col leading-[0.85] tracking-tighter">
              <span className="text-[42px] font-[900] uppercase" style={{ fontFamily: "'Tourney', sans-serif", fontWeight: 900 }}>WE</span>
              <span className="text-[42px] font-[900] uppercase" style={{ fontFamily: "'Tourney', sans-serif", fontWeight: 900 }}>ARCHITECT</span>
              <span className="text-[42px] font-[900] uppercase" style={{ fontFamily: "'Tourney', sans-serif", fontWeight: 900 }}>CONTEXT</span>
              <span className="text-[42px] font-[900]" style={{ fontFamily: "'Tourney', sans-serif", fontWeight: 900 }}>:-)</span>
            </div>
          </div>
          <p className="text-[11px] text-white/60 uppercase tracking-[0.15em] mt-2">
            BUILT BY A SOLO FOUNDER
          </p>
        </div>

        {/* Divider */}
        <div className="h-32 w-px bg-white/30" />

        {/* Middle-Left Section - Navigation Links */}
        <nav 
          className="flex flex-col pt-1"
          style={{ gap: 'var(--spacing-2)' }}
          aria-label="Footer navigation"
        >
          {navigationLinks.map((link) => (
            <motion.a
              key={link}
              href="#"
              className="text-white hover:text-white/90 relative group"
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 500,
                letterSpacing: 'var(--tracking-tight)'
              }}
              whileHover={{ x: 4 }}
              transition={spring}
            >
              {link}
              <motion.span 
                className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6]" 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-32 w-px bg-white/30" />

        {/* Middle-Right Section - Contact */}
        <div className="flex flex-col pt-1" style={{ gap: 'var(--spacing-2)' }}>
          <h3 
            className="text-white/60 uppercase"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.15em'
            }}
          >
            CONTACT US
          </h3>
          <button
            onClick={handleCopyEmail}
            className="text-white hover:text-white/70 text-left relative group"
            style={{
              fontSize: 'var(--text-base)',
              transition: 'all var(--transition-fast) var(--ease-out)'
            }}
            aria-label="Copy email address to clipboard"
          >
            promptbrain.ops@gmail.com
            {copiedEmail && (
              <span 
                className="absolute text-[#00D9FF] animate-in fade-in slide-in-from-bottom-2 duration-200"
                style={{
                  top: '-2rem',
                  left: 0,
                  fontSize: 'var(--text-xs)'
                }}
                role="status"
                aria-live="polite"
              >
                ✓ Copied!
              </span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-px bg-white/70 group-hover:w-full transition-all duration-300" />
          </button>
        </div>

        {/* Right Section - Social Links & Copyright */}
        <div 
          className="flex flex-col items-end pt-1 ml-auto"
          style={{ gap: 'var(--spacing-3)' }}
        >
          <nav 
            className="flex items-center"
            style={{ gap: 'var(--spacing-2)' }}
            aria-label="Social media links"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                className="glass-card rounded-full text-white premium-hover"
                style={{
                  padding: 'var(--spacing-1-5) var(--spacing-4)',
                  fontSize: 'var(--text-sm)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 500,
                  letterSpacing: 'var(--tracking-tight)'
                }}
                whileHover={{ 
                  scale: 1.1,
                  background: 'linear-gradient(135deg, rgba(0,217,255,0.1) 0%, rgba(139,92,246,0.1) 100%)',
                  borderColor: 'rgba(0,217,255,0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                aria-label={`Visit our ${social.name} page`}
              >
                {social.name}
              </motion.a>
            ))}
          </nav>
          <p 
            className="text-white/40"
            style={{ fontSize: 'var(--text-xs)' }}
          >
            © 2025 — Copyright
          </p>
        </div>
      </div>
    </div>
  );
}
