import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smooth?: boolean;
}

export function useLenis(options: LenisOptions = {}) {
  const lenisRef = useRef<any>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Skip if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }

    // Simple smooth scroll implementation without external dependencies
    const smoothScrollTo = (target: number, duration: number = 1000) => {
      const start = window.scrollY;
      const change = target - start;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cubic bezier easing (0.2, 0.8, 0.2, 1)
        const easeProgress = progress < 0.5 
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, start + change * easeProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };

    // Override native smooth scroll for better control
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (anchor && anchor.hash) {
        e.preventDefault();
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          smoothScrollTo(targetPosition, options.duration || 1000);
        }
      }
    };

    document.addEventListener('click', handleClick);

    // Store reference for cleanup
    lenisRef.current = { destroy: () => document.removeEventListener('click', handleClick) };

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, [prefersReducedMotion, options.duration]);

  return lenisRef.current;
}