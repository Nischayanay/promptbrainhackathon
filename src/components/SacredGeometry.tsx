export function SacredGeometry() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large sacred circles */}
      <div className="absolute top-20 left-20 w-96 h-96 opacity-5">
        <svg viewBox="0 0 400 400" className="w-full h-full text-royal-gold">
          <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="200" cy="200" r="20" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
      
      {/* Flower of Life pattern */}
      <div className="absolute bottom-32 right-32 w-80 h-80 opacity-6">
        <svg viewBox="0 0 300 300" className="w-full h-full text-cyan-glow">
          <g fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="150" cy="150" r="50" />
            <circle cx="150" cy="100" r="50" />
            <circle cx="150" cy="200" r="50" />
            <circle cx="106.7" cy="125" r="50" />
            <circle cx="193.3" cy="125" r="50" />
            <circle cx="106.7" cy="175" r="50" />
            <circle cx="193.3" cy="175" r="50" />
          </g>
        </svg>
      </div>
      
      {/* Golden ratio spiral */}
      <div className="absolute top-40 right-20 w-64 h-64 opacity-7">
        <svg viewBox="0 0 200 200" className="w-full h-full text-royal-gold">
          <path
            d="M100 100 Q100 50 150 50 Q200 50 200 100 Q200 150 150 150 Q100 150 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M100 100 Q75 100 75 125 Q75 150 100 150"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
          />
        </svg>
      </div>
      
      {/* Vesica Piscis */}
      <div className="absolute bottom-20 left-32 w-48 h-48 opacity-8">
        <svg viewBox="0 0 160 160" className="w-full h-full text-electric-blue">
          <g fill="none" stroke="currentColor" strokeWidth="0.5">
            <circle cx="70" cy="80" r="40" />
            <circle cx="90" cy="80" r="40" />
          </g>
        </svg>
      </div>
      
      {/* Star patterns */}
      <div className="absolute top-60 left-40 w-32 h-32 opacity-6">
        <svg viewBox="0 0 100 100" className="w-full h-full text-marble-white">
          <polygon
            points="50,10 58,38 86,38 64,56 72,84 50,66 28,84 36,56 14,38 42,38"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <polygon
            points="50,25 54,35 64,35 56,42 58,52 50,47 42,52 44,42 36,35 46,35"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
}