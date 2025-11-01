import { useEffect } from "react";
import { Hero } from "./landing/Hero";
import { ValueProps } from "./landing/ValueProps";
import { ScrollStory } from "./story/ScrollStory";
import { HowItWorksDemo } from "./landing/HowItWorksDemo";
import { Testimonials } from "./testimonials/Testimonials";
import { FinalCTA } from "./cta/FinalCTA";
import { Footer } from "./footer/Footer";
import { StructuredContent } from "./landing/StructuredContent";
import { useLenis } from "../hooks/useLenis";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface PRDLandingPageProps {
  onNavigateToSignup: () => void;
  onNavigateToLogin: () => void;
  AuthComponent?: React.ComponentType<any>;
  onAuthSuccess?: (user: any) => void;
}

export function PRDLandingPage({ onNavigateToSignup, onNavigateToLogin, AuthComponent, onAuthSuccess }: PRDLandingPageProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Initialize Lenis smooth scroll for cinematic experience
  useLenis({ 
    duration: prefersReducedMotion ? 0 : 1200,
    smooth: !prefersReducedMotion
  });

  return (
    <div className="min-h-screen bg-landing-black overflow-x-hidden landing-theme">
      {/* Structured Content for GEO (Hidden from users, visible to crawlers) */}
      <StructuredContent />
      
      {/* Hero Section - Premium storytelling with AI neuron effects */}
      <Hero 
        onStartEnhancing={onNavigateToSignup}
        onSeeHowItWorks={() => {
          // Smooth scroll to value props section
          const valueSection = document.querySelector('[data-section="value"]');
          if (valueSection) {
            valueSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onAuthSuccess={onAuthSuccess}
      />

      {/* Value Proposition - What makes PromptBrain different */}
      <div data-section="value">
        <ValueProps />
      </div>

      {/* Storytelling Timeline - Cinematic Problem → Solution Journey */}
      <div data-section="story">
        <ScrollStory />
      </div>

      {/* How It Works Demo - Bridge emotional journey → proof of product */}
      <div data-section="how-it-works">
        <HowItWorksDemo onStartEnhancing={onNavigateToLogin} />
      </div>

      {/* Social Proof + Testimonials - Act 3 validation */}
      <div data-section="testimonials">
        <Testimonials />
      </div>

      {/* Final CTA - Climactic conversion moment */}
      <div data-section="final-cta">
        <FinalCTA onEnhancePrompt={onNavigateToLogin} />
      </div>

      {/* Footer - Manifesto epilogue with architectural grid */}
      <div data-section="footer">
        <Footer onNavigateToLogin={onNavigateToLogin} />
      </div>
    </div>
  );
}