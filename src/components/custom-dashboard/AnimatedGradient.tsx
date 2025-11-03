import { useEffect, useRef } from 'react';

export function AnimatedGradient() {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orb1 = orb1Ref.current;
    const orb2 = orb2Ref.current;
    const orb3 = orb3Ref.current;

    if (!orb1 || !orb2 || !orb3) return;

    let frame = 0;

    const animate = () => {
      frame += 0.005;

      // Animate orb 1 (cyan)
      const x1 = Math.sin(frame * 0.7) * 20 + 50;
      const y1 = Math.cos(frame * 0.5) * 20 + 30;
      orb1.style.transform = `translate(${x1}%, ${y1}%)`;

      // Animate orb 2 (blue)
      const x2 = Math.cos(frame * 0.6) * 25 + 70;
      const y2 = Math.sin(frame * 0.8) * 15 + 50;
      orb2.style.transform = `translate(${x2}%, ${y2}%)`;

      // Animate orb 3 (pink/orange)
      const x3 = Math.sin(frame * 0.9) * 30 + 30;
      const y3 = Math.cos(frame * 0.7) * 25 + 60;
      orb3.style.transform = `translate(${x3}%, ${y3}%)`;

      requestAnimationFrame(animate);
    };

    const rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        {/* Orb 1 - Cyan/Teal */}
        <div
          ref={orb1Ref}
          className="absolute w-[800px] h-[800px] rounded-full opacity-40 blur-[120px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.6) 0%, rgba(0, 150, 200, 0.3) 40%, transparent 70%)',
            left: '-200px',
            top: '-200px',
            willChange: 'transform',
          }}
        />

        {/* Orb 2 - Blue */}
        <div
          ref={orb2Ref}
          className="absolute w-[700px] h-[700px] rounded-full opacity-35 blur-[100px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0, 100, 255, 0.5) 0%, rgba(0, 60, 180, 0.3) 40%, transparent 70%)',
            right: '-150px',
            top: '-100px',
            willChange: 'transform',
          }}
        />

        {/* Orb 3 - Pink/Orange accent */}
        <div
          ref={orb3Ref}
          className="absolute w-[600px] h-[600px] rounded-full opacity-25 blur-[90px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 100, 150, 0.4) 0%, rgba(200, 80, 120, 0.2) 40%, transparent 70%)',
            left: '10%',
            bottom: '-150px',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Subtle grain texture overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
    </div>
  );
}
