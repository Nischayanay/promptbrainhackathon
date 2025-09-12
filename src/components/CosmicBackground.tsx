export function CosmicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main cosmic gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-electric-blue/20 via-violet/10 to-temple-black"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(58, 134, 255, 0.15) 0%, rgba(123, 47, 247, 0.08) 40%, rgba(10, 10, 10, 1) 100%)'
        }}
      />
      
      {/* Subtle geometric orbits */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Large orbit */}
        <div 
          className="w-[800px] h-[800px] rounded-full border border-electric-blue/5"
          style={{ animation: 'orbit-slow 40s linear infinite' }}
        />
        
        {/* Medium orbit */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full border border-royal-gold/3"
          style={{ animation: 'orbit-slow 60s linear infinite reverse' }}
        />
        
        {/* Small orbit */}
        <div 
          className="absolute w-[400px] h-[400px] rounded-full border border-violet/5"
          style={{ animation: 'orbit-slow 30s linear infinite' }}
        />
      </div>
      
      {/* Subtle stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-marble-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle-subtle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Soft glow effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-violet/3 rounded-full blur-3xl" />
    </div>
  );
}