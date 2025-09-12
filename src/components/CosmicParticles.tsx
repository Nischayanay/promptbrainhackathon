export function CosmicParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated particle drift - tiny stars like cosmic temple dust */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-royal-gold rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `cosmic-drift-${i % 3 + 1} ${15 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`
          }}
        />
      ))}
      
      {/* Larger cosmic dust particles */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`large-${i}`}
          className="absolute w-0.5 h-0.5 bg-cyan-glow rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `cosmic-drift-${i % 3 + 1} ${20 + Math.random() * 15}s linear infinite`,
            animationDelay: `${Math.random() * 15}s`
          }}
        />
      ))}
      
      {/* Tiny twinkling stars */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={`star-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          <div className="w-px h-px bg-marble-white rounded-full opacity-40" />
        </div>
      ))}
    </div>
  );
}