import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { FeedbackSection } from './components/FeedbackSection';
import { Footer } from './components/Footer';
import { Toaster } from 'sonner';
import { FloatingCTA } from './components/FloatingCTA';
import { MidpointCTA } from './components/MidpointCTA';
// Temporarily disable auth providers to fix the white screen
// import { AuthProvider } from './contexts/AuthContext';
// import { CreditProvider } from './contexts/CreditContext';

// Landing Page Component
function LandingPage() {
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
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ background: 'var(--pb-black, #0a0a0a)' }}>
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
          transition: 'top 0.2s ease-out',
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
            background: 'var(--pb-near-black, #0d0d0f)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            color: 'var(--pb-white, #ffffff)',
          },
        }}
      />
    </div>
  );
}

// Simple Login Component
function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--pb-black, #0a0a0a)' }}>
      <div className="text-center">
        <h1 className="text-4xl text-white mb-4">Login</h1>
        <p className="text-white/70 mb-8">Authentication will be integrated here</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] text-white rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// Main App with Routing
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}