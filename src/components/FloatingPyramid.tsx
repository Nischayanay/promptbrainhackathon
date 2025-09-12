export function FloatingPyramid() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Main pyramid triangle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Pyramid shape */}
          <div 
            className="w-20 h-20 bg-gradient-to-b from-electric-blue/20 to-violet/30 backdrop-blur-sm"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              filter: 'drop-shadow(0 0 20px rgba(58, 134, 255, 0.3))'
            }}
          />
          
          {/* Glowing apex */}
          <div 
            className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-royal-gold rounded-full"
            style={{
              animation: 'pyramid-glow 3s ease-in-out infinite',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.3)'
            }}
          />
          
          {/* Apex beam */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-8 bg-gradient-to-t from-royal-gold/60 to-transparent"
            style={{
              animation: 'apex-beam 4s ease-in-out infinite'
            }}
          />
        </div>
      </div>
      
      {/* Subtle orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-28 h-28 rounded-full border border-electric-blue/10"
          style={{ animation: 'orbit-slow 20s linear infinite' }}
        />
        <div 
          className="absolute w-36 h-36 rounded-full border border-royal-gold/5"
          style={{ animation: 'orbit-slow 30s linear infinite reverse' }}
        />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-royal-gold/40 rounded-full"
            style={{
              left: `${30 + i * 20}%`,
              top: `${40 + i * 10}%`,
              animation: `float-particle ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}