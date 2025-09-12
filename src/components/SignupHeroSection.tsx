import { CosmicBackground } from "./CosmicBackground";
import { FloatingPyramid } from "./FloatingPyramid";
import { SacredGeometry } from "./SacredGeometry";
import { HieroglyphPattern } from "./HieroglyphPattern";

export function SignupHeroSection() {
  return (
    <div className="relative h-full bg-temple-black overflow-hidden flex flex-col items-center justify-center">
      {/* Cosmic Background */}
      <CosmicBackground />
      
      {/* Sacred Geometry Orbital Rings */}
      <SacredGeometry />
      
      {/* Hieroglyph Pattern Overlay */}
      <HieroglyphPattern />
      
      {/* Signup-specific cosmic particles - subtle variations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating light particles with different timing */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`signup-particle-${i}`}
            className="absolute w-1 h-1 bg-royal-gold/30 rounded-full"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + i * 8}%`,
              animation: `float-particle ${4 + (i * 0.8)}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`
            }}
          />
        ))}
        
        {/* Subtle energy streams - different from login */}
        <div 
          className="absolute left-1/4 top-1/3 w-px h-12 bg-gradient-to-b from-transparent via-cyan-glow/20 to-transparent"
          style={{ animation: 'beam-rise 5s ease-out infinite', animationDelay: '1s' }}
        />
        <div 
          className="absolute right-1/3 bottom-1/3 w-px h-8 bg-gradient-to-t from-transparent via-violet/20 to-transparent"
          style={{ animation: 'beam-rise 4s ease-out infinite', animationDelay: '2.5s' }}
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-20 text-center px-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 
            className="text-4xl lg:text-5xl font-light text-marble-white mb-6 leading-tight tracking-wide"
            style={{ 
              fontFamily: '"Playfair Display", "Georgia", serif',
              textShadow: '0 0 25px rgba(255, 215, 0, 0.3)'
            }}
          >
            Forge your place in the Mind Temple.
          </h1>
        </div>
        
        {/* Enhanced Floating Pyramid with breathing glow - much bigger size */}
        <div className="mb-12 scale-150" style={{ animation: 'slow-glow 6s ease-in-out infinite' }}>
          <FloatingPyramid />
        </div>
      </div>
      
      {/* Bottom tagline */}
      <div className="absolute bottom-8 left-8">
        {/* Every immortal idea begins here */}
        <div className="text-royal-gold/70 text-sm tracking-widest">
          <span 
            className="font-bold"
            style={{ 
              fontFamily: '"Inter", "Arial", sans-serif',
              textShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
              letterSpacing: '0.15em'
            }}
          >
            EVERY IMMORTAL IDEA BEGINS HERE
          </span>
        </div>
      </div>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-temple-black/20 via-transparent to-temple-black/10 pointer-events-none" />
    </div>
  );
}