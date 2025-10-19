import { useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { FeedbackSection } from './components/FeedbackSection';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner@2.0.3';
import { FloatingCTA } from './components/FloatingCTA';
import { MidpointCTA } from './components/MidpointCTA';

export default function App() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Focus on input after scroll
    setTimeout(() => {
      document.getElementById('prompt-input')?.focus();
    }, 600);
  };

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ background: 'var(--pb-black)' }}>
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="skip-to-content"
        style={{
          position: 'absolute',
          top: '-40px',
          left: 0,
          background: 'var(--pb-black)',
          color: 'var(--pb-cyan)',
          padding: 'var(--spacing-2)',
          zIndex: 9999,
          transition: 'top var(--transition-fast) var(--ease-out)',
          textDecoration: 'none',
          fontWeight: 600,
        }}
        onFocus={(e) => e.currentTarget.style.top = '0'}
        onBlur={(e) => e.currentTarget.style.top = '-40px'}
      >
        Skip to main content
      </a>

      {/* Hero Section - Full Screen - Primary Zone */}
      <main id="main-content" className="relative">
        <HeroSection />
      </main>

      {/* Midpoint CTA - F-Pattern Optimization */}
      <MidpointCTA onAction={scrollToHero} />

      {/* Feedback Section - Tertiary Zone */}
      <section className="relative" aria-labelledby="feedback-heading">
        <FeedbackSection />
      </section>

      {/* Footer - Tertiary Zone */}
      <footer className="relative">
        <Footer />
      </footer>

      {/* Floating CTA - Conversion Optimization */}
      <FloatingCTA onAction={scrollToHero} />

      {/* Toast Notifications - Accessible announcements */}
      <Toaster 
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--pb-near-black)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            color: 'var(--pb-white)',
          },
        }}
      />
    </div>
  );
}
