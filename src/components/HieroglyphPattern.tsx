export function HieroglyphPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Egyptian-inspired geometric patterns */}
      <div className="hieroglyph-pattern absolute top-20 left-10 w-16 h-16 opacity-5">
        <svg viewBox="0 0 64 64" className="w-full h-full text-royal-gold">
          <path
            d="M32 8L40 24H24L32 8ZM16 32L32 24L48 32L32 40L16 32ZM24 40H40L32 56L24 40Z"
            fill="currentColor"
          />
        </svg>
      </div>
      
      <div 
        className="hieroglyph-pattern absolute top-40 right-20 w-12 h-12 opacity-6" 
        style={{ animationDelay: '2s' }}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full text-cyan-glow">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="24" cy="24" r="4" fill="currentColor" />
        </svg>
      </div>
      
      <div 
        className="hieroglyph-pattern absolute bottom-32 left-20 w-14 h-14 opacity-7" 
        style={{ animationDelay: '4s' }}
      >
        <svg viewBox="0 0 56 56" className="w-full h-full text-electric-blue">
          <rect x="14" y="14" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="21" y="21" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" />
          <rect x="26" y="26" width="4" height="4" fill="currentColor" />
        </svg>
      </div>
      
      <div 
        className="hieroglyph-pattern absolute top-60 left-1/3 w-10 h-10 opacity-8" 
        style={{ animationDelay: '6s' }}
      >
        <svg viewBox="0 0 40 40" className="w-full h-full text-violet">
          <polygon points="20,5 35,15 35,25 20,35 5,25 5,15" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="20,12 28,17 28,23 20,28 12,23 12,17" fill="currentColor" />
        </svg>
      </div>
      
      <div 
        className="hieroglyph-pattern absolute bottom-20 right-1/4 w-18 h-18 opacity-6" 
        style={{ animationDelay: '8s' }}
      >
        <svg viewBox="0 0 72 72" className="w-full h-full text-magenta">
          <path
            d="M36 10L46 26L62 26L50 38L54 54L36 46L18 54L22 38L10 26L26 26Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}