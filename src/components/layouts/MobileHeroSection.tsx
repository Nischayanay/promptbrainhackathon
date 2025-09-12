import { FloatingPyramid } from "../FloatingPyramid";

interface MobileHeroSectionProps {
  isLogin: boolean;
}

export function MobileHeroSection({ isLogin }: MobileHeroSectionProps) {
  return (
    <div className="relative pt-8 pb-4">
      {/* Simplified cosmic background for mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/10 via-violet/5 to-temple-black"></div>
      
      {/* Mobile hero content */}
      <div className="relative z-10 text-center px-4">
        <div className="scale-110 mb-4">
          <FloatingPyramid />
        </div>
        <h1 
          className="text-xl font-light text-marble-white tracking-wide mb-2"
          style={{ 
            fontFamily: '"Playfair Display", "Georgia", serif',
            textShadow: '0 0 15px rgba(255, 215, 0, 0.2)'
          }}
        >
          {isLogin ? 'Access the Temple.' : 'Forge your place in the Mind Temple.'}
        </h1>
        
        {/* Mobile tagline */}
        <div className="mt-4">
          <div className="text-royal-gold/60 text-xs tracking-widest">
            <span 
              className="font-bold"
              style={{ 
                fontFamily: '"Inter", "Arial", sans-serif',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
                letterSpacing: '0.1em'
              }}
            >
              {isLogin ? 'IDEAS BECOME IMMORTAL' : 'EVERY IMMORTAL IDEA BEGINS HERE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}