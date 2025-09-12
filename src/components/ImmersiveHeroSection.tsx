import { FloatingPyramid } from "./FloatingPyramid";

export function ImmersiveHeroSection() {
  return (
    <div className="relative h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Enhanced Cosmic Background with Layered Geometric Rings */}
      <div className="absolute inset-0">
        {/* Deep cosmic gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(58, 134, 255, 0.15) 0%, rgba(75, 77, 237, 0.1) 30%, rgba(123, 47, 247, 0.08) 60%, rgba(10, 10, 10, 1) 100%)'
          }}
        />
        
        {/* Layered ethereal geometric rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outermost ring */}
          <div 
            className="w-[1000px] h-[1000px] rounded-full border border-electric-blue/3"
            style={{ animation: 'orbit-slow 80s linear infinite' }}
          />
          
          {/* Large ring */}
          <div 
            className="absolute w-[800px] h-[800px] rounded-full border border-violet/4"
            style={{ animation: 'orbit-slow 60s linear infinite reverse' }}
          />
          
          {/* Medium ring */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full border border-royal-gold/2"
            style={{ animation: 'orbit-slow 45s linear infinite' }}
          />
          
          {/* Inner ring */}
          <div 
            className="absolute w-[400px] h-[400px] rounded-full border border-cyan-glow/3"
            style={{ animation: 'orbit-slow 30s linear infinite reverse' }}
          />
        </div>
        
        {/* Light cosmic particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 25 }, (_, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-marble-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle-subtle ${2 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Floating light orbs for depth */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-sm"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                background: i % 3 === 0 ? 'rgba(255, 215, 0, 0.1)' : i % 3 === 1 ? 'rgba(58, 134, 255, 0.1)' : 'rgba(123, 47, 247, 0.1)',
                animation: `float-particle ${4 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Enhanced Floating Pyramid with breathing glow - much bigger size */}
        <div className="mb-12 scale-150" style={{ animation: 'slow-glow 6s ease-in-out infinite' }}>
          <FloatingPyramid />
        </div>
        
        {/* Tagline with elegant serif typography */}
        <div className="space-y-6">
          <h1 
            className="text-3xl font-light text-marble-white tracking-wide"
            style={{ 
              fontFamily: '"Playfair Display", "Georgia", serif',
              textShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
              animation: 'temple-glow 5s ease-in-out infinite'
            }}
          >
            Access the Temple.
          </h1>
          
          {/* Decorative line */}
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-royal-gold/40 to-transparent mx-auto"></div>
        </div>
      </div>
      
      {/* Bottom tagline */}
      <div className="absolute bottom-8 left-8">
        {/* Ideas Become Immortal - bold, different font, no quotes */}
        <div className="text-royal-gold/70 text-sm tracking-widest">
          <span 
            className="font-bold"
            style={{ 
              fontFamily: '"Inter", "Arial", sans-serif',
              textShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
              letterSpacing: '0.15em'
            }}
          >
            IDEAS BECOME IMMORTAL
          </span>
        </div>
      </div>
      
      {/* Ambient glow effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-electric-blue/3 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-32 right-32 w-80 h-80 bg-violet/2 rounded-full blur-3xl opacity-40" />
    </div>
  );
}