import { PRDLandingPage } from "./components/PRDLandingPage";
import { LoginCard } from "./components/LoginCard";
import { SignupCard } from "./components/SignupCard";
import { Dashboard2Pro } from "./components/Dashboard2Pro";
import { Dashboard2ProRedesigned } from "./components/Dashboard2ProRedesigned";
import { Dashboard2ProSimple } from "./components/Dashboard2ProSimple";
import { PromptEnhancer } from "./components/PromptEnhancer";
import { Profile } from "./components/Profile";
import { DesktopSplitLayout } from "./components/layouts/DesktopSplitLayout";
import { MobileLayout } from "./components/layouts/MobileLayout";
import { AppLayout } from "./components/layouts/AppLayout";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { getCurrentSession } from "./utils/auth";
import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase/client";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const {
    currentPage,
    previousPage,
    navigateToSignup,
    navigateToLogin,
    navigateToLanding,
    navigateToPage,
    navigateToTemple,
    navigateToEnhance,
    navigateToProfile,
    navigateBack,
  } = useAppNavigation();

  // Check for existing session on app load (handles OAuth redirects)
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log(
          "PromptBrain: Checking for existing session...",
        );
        const session = await getCurrentSession();
        console.log(
          "PromptBrain: Session check result:",
          session,
        );

        // Don't automatically redirect on session check
        // Only redirect after explicit sign-in actions
        if (session.success) {
          console.log(
            "PromptBrain: Active session found, staying on current page",
          );
        } else {
          console.log(
            "PromptBrain: No active session, staying on landing page",
          );
        }
      } catch (error) {
        console.error(
          "PromptBrain: Session check failed:",
          error,
        );
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Add proper auth state change listener that only redirects on SIGNED_IN events
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[AUTH EVENT]", event);
        if (event === "SIGNED_IN") {
          console.log(
            "PromptBrain: User signed in, redirecting to enhance tool",
          );
          navigateToEnhance(); // Only redirect on explicit sign in
        }
      },
    );

    return () => sub?.subscription?.unsubscribe?.();
  }, [navigateToEnhance]);

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-landing-black flex items-center justify-center">
        <div className="text-landing-white text-xl">
          Loading PromptBrain...
        </div>
      </div>
    );
  }

  // Show error screen if something went wrong
  if (hasError) {
    return (
      <div className="min-h-screen bg-landing-black flex items-center justify-center">
        <div className="text-landing-white text-center">
          <h1 className="text-2xl mb-4">PromptBrain</h1>
          <p className="mb-4">
            Something went wrong during initialization.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-landing-blue text-white rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show Landing Page
  if (currentPage === "landing") {
    try {
      return (
        <main id="main-content" role="main">
          <PRDLandingPage
            onNavigateToSignup={navigateToSignup}
            onNavigateToLogin={navigateToLogin}
          />
          {/* Dashboard2 Pro Test Button */}
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => {
                console.log("Clicking Dashboard 2.0 Pro button - navigating to enhance")
                navigateToPage('enhance')
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#6E00FF] to-[#3B82F6] text-white rounded-lg shadow-lg hover:scale-105 transition-transform font-semibold"
            >
              🚀 NEW Dashboard 2.0 Pro
            </button>
          </div>
        </main>
      );
    } catch (error) {
      console.error("Landing page render error:", error);
      return (
        <div className="min-h-screen bg-landing-black flex items-center justify-center">
          <div className="text-landing-white text-center">
            <h1 className="text-2xl mb-4">PromptBrain</h1>
            <p className="mb-4">Landing page failed to load.</p>
            <button
              onClick={() => navigateToLogin()}
              className="px-4 py-2 bg-landing-blue text-white rounded mr-2"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigateToPage('enhance')}
              className="px-4 py-2 bg-gradient-to-r from-[#6E00FF] to-[#3B82F6] text-white rounded mr-2"
            >
              Dashboard 2.0
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
  }

  // Show Dashboard - REDIRECT TO NEW DASHBOARD 2.0
  if (currentPage === "temple") {
    // Automatically redirect temple to enhance (new dashboard)
    console.log("Redirecting from temple to enhance (Dashboard 2.0)")
    navigateToPage('enhance')
    return null
  }

  // Show Dashboard 2.0 (Premium Redesigned)
  if (currentPage === "enhance") {
    console.log("Loading Dashboard 2.0 Pro Redesigned on enhance page")
    
    // LOAD NEW REDESIGNED DASHBOARD
    return (
      <main id="main-content" role="main">
        <div className="fixed top-4 left-4 bg-green-900/80 text-white p-2 rounded text-xs z-50">
          ✅ Dashboard 2.0 Pro Redesigned Loading
        </div>
        <Dashboard2ProRedesigned />
      </main>
    );
  }

  // Show Profile Page
  if (currentPage === "profile") {
    try {
      return (
        <AppLayout
          currentPage={currentPage}
          onNavigate={navigateToPage}
          className="min-h-screen bg-cinematic-base"
        >
          <main id="main-content" role="main">
            <Profile
              onNavigateBack={navigateBack}
              onNavigateToTemple={navigateToTemple}
              onNavigateToLanding={navigateToLanding}
            />
          </main>
        </AppLayout>
      );
    } catch (error) {
      console.error("Profile render error:", error);
      return (
        <div className="min-h-screen bg-temple-black flex items-center justify-center">
          <div className="text-marble-white text-center">
            <h1 className="text-2xl mb-4">Profile</h1>
            <p className="mb-4">Profile page failed to load.</p>
            <button
              onClick={() => navigateToTemple()}
              className="px-4 py-2 bg-royal-gold text-temple-black rounded"
            >
              Back to Temple
            </button>
          </div>
        </div>
      );
    }
  }

  // Show Login/Signup Pages
  const isLogin = currentPage === "login";

  try {
    const cardComponent = isLogin ? (
      <LoginCard
        onNavigateToSignup={navigateToSignup}
        onNavigateToLanding={navigateToLanding}
        onLoginSuccess={navigateToEnhance}
      />
    ) : (
      <SignupCard
        onNavigateToLogin={navigateToLogin}
        onNavigateToLanding={navigateToLanding}
        onSignupSuccess={navigateToEnhance}
      />
    );

    return (
      <AppLayout
        currentPage={currentPage}
        onNavigate={navigateToPage}
      >
        <main id="main-content" role="main">
          {/* Desktop 50/50 Split Layout */}
          <DesktopSplitLayout isLogin={isLogin}>
            {cardComponent}
          </DesktopSplitLayout>

          {/* Mobile/Tablet Stacked Layout */}
          <MobileLayout isLogin={isLogin}>
            {cardComponent}
          </MobileLayout>
        </main>
      </AppLayout>
    );
  } catch (error) {
    console.error("Auth page render error:", error);
    return (
      <div className="min-h-screen bg-landing-black flex items-center justify-center">
        <div className="text-landing-white text-center">
          <h1 className="text-2xl mb-4">PromptBrain</h1>
          <p className="mb-4">
            Authentication page failed to load.
          </p>
          <button
            onClick={() => navigateToLanding()}
            className="px-4 py-2 bg-landing-blue text-white rounded"
          >
            Back to Landing
          </button>
        </div>
      </div>
    );
  }
}