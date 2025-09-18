import { PRDLandingPage } from "./components/PRDLandingPage";
import { LoginCard } from "./components/LoginCard";
import { SignupCard } from "./components/SignupCard";
import { Dashboard2ProRedesigned } from "./components/Dashboard2ProRedesigned";
import { Profile } from "./components/Profile";
import { DesktopSplitLayout } from "./components/layouts/DesktopSplitLayout";
import { MobileLayout } from "./components/layouts/MobileLayout";
import { AppLayout } from "./components/layouts/AppLayout";
import { getCurrentSession } from "./utils/auth";
import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase/client";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

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

        setIsAuthed(Boolean(session.success));
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
      (event) => {
        console.log("[AUTH EVENT]", event);
        if (event === "SIGNED_IN") {
          setIsAuthed(true);
          navigate('/enhance');
        }
        if (event === 'SIGNED_OUT') {
          setIsAuthed(false);
        }
      },
    );

    return () => sub?.subscription?.unsubscribe?.();
  }, [navigate]);

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

  // Below: Router-based rendering replaces manual page switching

  // Router-based enhance page replaces the block above

  // Router-based profile page replaces the block above

  // Router-based login/signup pages replace the block above

  // Router switch
  const LandingPage = () => (
    <main id="main-content" role="main">
      <PRDLandingPage
        onNavigateToSignup={() => navigate('/signup')}
        onNavigateToLogin={() => navigate('/enhance')}
      />
    </main>
  );

  const EnhancePage = () => (
    <main id="main-content" role="main">
      <Dashboard2ProRedesigned />
    </main>
  );

  const ProfilePage = () => {
    if (!isAuthed) return <Navigate to="/login" replace />;
    return (
      <AppLayout
        currentPage={'profile' as any}
        onNavigate={(p) => navigate(`/${p}`)}
        className="min-h-screen bg-cinematic-base"
      >
        <main id="main-content" role="main">
          <Profile
            onNavigateBack={() => navigate(-1)}
            onNavigateToTemple={() => navigate('/enhance')}
            onNavigateToLanding={() => navigate('/')}
          />
        </main>
      </AppLayout>
    );
  };

  const LoginPage = () => {
    return (
      <AppLayout currentPage={'login' as any} onNavigate={(p) => navigate(`/${p}`)}>
        <main id="main-content" role="main">
          <DesktopSplitLayout isLogin>
            <LoginCard
              onNavigateToSignup={() => navigate('/signup')}
              onNavigateToLanding={() => navigate('/')}
              onLoginSuccess={() => navigate('/enhance')}
            />
          </DesktopSplitLayout>
          <MobileLayout isLogin>
            <LoginCard
              onNavigateToSignup={() => navigate('/signup')}
              onNavigateToLanding={() => navigate('/')}
              onLoginSuccess={() => navigate('/enhance')}
            />
          </MobileLayout>
        </main>
      </AppLayout>
    );
  };

  const SignupPage = () => {
    return (
      <AppLayout currentPage={'signup' as any} onNavigate={(p) => navigate(`/${p}`)}>
        <main id="main-content" role="main">
          <DesktopSplitLayout isLogin={false}>
            <SignupCard
              onNavigateToLogin={() => navigate('/login')}
              onNavigateToLanding={() => navigate('/')}
              onSignupSuccess={() => navigate('/enhance')}
            />
          </DesktopSplitLayout>
          <MobileLayout isLogin={false}>
            <SignupCard
              onNavigateToLogin={() => navigate('/login')}
              onNavigateToLanding={() => navigate('/')}
              onSignupSuccess={() => navigate('/enhance')}
            />
          </MobileLayout>
        </main>
      </AppLayout>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/enhance" element={<EnhancePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}