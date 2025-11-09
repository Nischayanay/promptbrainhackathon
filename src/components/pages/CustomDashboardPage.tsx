import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useCredits } from '../../contexts/CreditContext';
import { HeroSection } from '../custom-user-dashboard/HeroSection';
import { FeedbackSection } from '../custom-user-dashboard/FeedbackSection';
import { Footer } from '../custom-user-dashboard/Footer';
import { FloatingCTA } from '../custom-user-dashboard/FloatingCTA';
import { MidpointCTA } from '../custom-user-dashboard/MidpointCTA';
import { FloatingCreditsOrb } from '../credits/FloatingCreditsOrb';
import '../../styles/custom-dashboard.css';

export function CustomDashboardPage() {
  const { user } = useAuth();
  const { balance, refreshCredits } = useCredits();
  
  // Each user gets 20 credits per day, resets at midnight
  const maxCredits = 20;



  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Refresh credits when dashboard loads
    if (user) {
      refreshCredits();
    }
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [user, refreshCredits]);


  return (
    <div 
      className="min-h-screen text-white relative overflow-x-hidden" 
      style={{ 
        background: 'var(--pb-black, #0a0a0a)',
        minHeight: '100vh',
        color: 'white'
      }}
    >
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="skip-to-content"
        style={{
          position: 'absolute',
          top: '-40px',
          left: 0,
          background: 'var(--pb-black, #0a0a0a)',
          color: 'var(--pb-cyan, #00d9ff)',
          padding: 'var(--spacing-2, 8px)',
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
      <MidpointCTA onAction={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          document.getElementById('prompt-input')?.focus();
        }, 600);
      }} />

      {/* Feedback Section - Tertiary Zone */}
      <section className="relative" aria-labelledby="feedback-heading">
        <FeedbackSection />
      </section>

      {/* Footer - Tertiary Zone */}
      <footer className="relative">
        <Footer />
      </footer>

      {/* Floating CTA - Conversion Optimization */}
      <FloatingCTA onAction={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          document.getElementById('prompt-input')?.focus();
        }, 600);
      }} />

      {/* Floating Credits Orb */}
      {user && (
        <FloatingCreditsOrb
          credits={balance}
          maxCredits={maxCredits}
          onAddCredits={() => {
            // Force refresh credits
            refreshCredits();
          }}
        />
      )}

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