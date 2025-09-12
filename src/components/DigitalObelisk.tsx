export function DigitalObelisk() {
  return (
    <div className="relative w-64 h-96 mx-auto">
      {/* Glow beams rising upward */}
      <div className="absolute inset-0 flex items-end justify-center">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-32 bg-gradient-to-t from-royal-gold/30 via-cyan-glow/20 to-transparent beam-rise"
            style={{
              left: `${45 + i * 2.5}%`,
              animationDelay: `${i * 0.8}s`
            }}
          />
        ))}
      </div>
      
      {/* Main obelisk structure */}
      <div className="absolute inset-0 flex flex-col items-center">
        {/* Divine Crown Capstone */}
        <div className="w-12 h-16 bg-gradient-to-b from-royal-gold via-royal-gold/80 to-royal-gold/60 relative shadow-lg shadow-royal-gold/30">
          <div className="absolute inset-1 bg-gradient-to-b from-cyan-glow/30 to-transparent rounded-sm"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-marble-white rounded-full pulse-glow"></div>
          
          {/* Hieroglyphic etchings on capstone */}
          <svg className="absolute inset-0 w-full h-full text-temple-black/30" viewBox="0 0 48 64">
            <path d="M24 8 L32 16 L24 24 L16 16 Z" fill="currentColor" opacity="0.3" />
            <circle cx="24" cy="40" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        
        {/* Main shaft with hieroglyphic etchings */}
        <div className="w-16 h-72 bg-gradient-to-b from-temple-black via-temple-black/90 to-temple-black relative overflow-hidden border-2 border-royal-gold/20 shadow-inner">
          {/* Hieroglyphic lines etched into surface */}
          <svg className="absolute inset-0 w-full h-full text-royal-gold/15" viewBox="0 0 64 288">
            {/* Vertical hieroglyphic columns */}
            <g stroke="currentColor" strokeWidth="0.3" fill="none">
              <line x1="16" y1="20" x2="16" y2="268" opacity="0.4" />
              <line x1="32" y1="20" x2="32" y2="268" opacity="0.6" />
              <line x1="48" y1="20" x2="48" y2="268" opacity="0.4" />
            </g>
            
            {/* Hieroglyphic symbols */}
            <g fill="currentColor" opacity="0.3">
              <rect x="14" y="30" width="4" height="8" />
              <circle cx="32" cy="50" r="3" />
              <polygon points="46,70 50,78 42,78" />
              <rect x="30" y="90" width="4" height="12" />
              <path d="M14 120 L18 128 L14 136 L10 128 Z" />
              <circle cx="48" cy="150" r="2" />
              <rect x="14" y="170" width="4" height="6" />
              <polygon points="30,190 34,198 26,198" />
              <circle cx="48" cy="210" r="3" />
              <rect x="14" y="230" width="4" height="8" />
            </g>
          </svg>
          
          {/* Enhanced neural network lines */}
          <div className="absolute inset-0">
            {/* Vertical central line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-royal-gold/60 via-cyan-glow/40 to-royal-gold/60 transform -translate-x-1/2"></div>
            
            {/* Horizontal connection lines */}
            {Array.from({ length: 8 }, (_, i) => (
              <div 
                key={i} 
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal-gold/30 to-transparent" 
                style={{ top: `${(i + 1) * 12}%`, animationDelay: `${i * 0.5}s` }}
              >
                <div 
                  className="absolute left-1/4 top-0 w-1 h-1 bg-royal-gold rounded-full pulse-glow" 
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                <div 
                  className="absolute right-1/4 top-0 w-1 h-1 bg-cyan-glow rounded-full pulse-glow" 
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              </div>
            ))}
          </div>
          
          {/* Enhanced data flow particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }, (_, i) => (
              <div 
                key={i} 
                className="absolute w-1 h-1 bg-royal-gold rounded-full opacity-80" 
                style={{ 
                  left: '50%', 
                  animation: `data-flow-${i % 2 === 0 ? 'up' : 'down'} 4s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Foundation Base with gold gradient */}
        <div className="w-20 h-8 bg-gradient-to-t from-royal-gold via-royal-gold/80 to-royal-gold/60 relative shadow-lg shadow-royal-gold/30">
          <div className="absolute inset-1 bg-gradient-to-t from-transparent to-cyan-glow/20 rounded-sm"></div>
          
          {/* Base hieroglyphic etchings */}
          <svg className="absolute inset-0 w-full h-full text-temple-black/30" viewBox="0 0 80 32">
            <g fill="currentColor" opacity="0.4">
              <rect x="20" y="12" width="8" height="8" />
              <rect x="36" y="12" width="8" height="8" />
              <rect x="52" y="12" width="8" height="8" />
            </g>
          </svg>
        </div>
      </div>
      
      {/* Enhanced surrounding energy rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-80 h-80 rounded-full border border-royal-gold/15 animate-spin" 
          style={{ animationDuration: '25s' }}
        />
        <div 
          className="absolute w-96 h-96 rounded-full border border-cyan-glow/10 animate-spin" 
          style={{ animationDuration: '35s', animationDirection: 'reverse' }}
        />
        <div 
          className="absolute w-72 h-72 rounded-full border border-royal-gold/10 animate-spin" 
          style={{ animationDuration: '15s' }}
        />
      </div>
    </div>
  );
}