import { PRDLandingPage } from "./components/PRDLandingPage";
import { Profile } from "./components/Profile";
import { AppLayout } from "./components/layouts/AppLayout";

// Import custom components
import { CustomAuthLayout } from "./components/auth/CustomAuthLayout";
import { PBAuthPage } from "./components/pages/PBAuthPage";
import { UserDashboardPage } from "./components/pages/UserDashboardPage";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ProtectedRoute, routeConfig, ThemeWrapper } from "./routes/index";
import { RouteTransition } from "./components/common/RouteTransition";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CreditProvider } from "./contexts/CreditContext";

function AppContent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading screen while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-landing-black flex items-center justify-center">
        <div className="text-landing-white text-xl">
          Loading PromptBrain...
        </div>
      </div>
    );
  }

  // Below: Router-based rendering replaces manual page switching

  // Router-based enhance page replaces the block above

  // Router-based profile page replaces the block above

  // Router-based login/signup pages replace the block above

  // Router components with custom designs and transitions
  const LandingPage = () => (
    <RouteTransition>
      <ThemeWrapper theme="landing">
        <main id="main-content" role="main">
          <PRDLandingPage
            onNavigateToSignup={() => navigate(routeConfig.signup)}
            onNavigateToLogin={() => navigate(routeConfig.login)}
          />
        </main>
      </ThemeWrapper>
    </RouteTransition>
  );

  const UserDashboard = () => (
    <ProtectedRoute isAuthed={!!user}>
      <RouteTransition>
        <main id="main-content" role="main">
          <UserDashboardPage />
        </main>
      </RouteTransition>
    </ProtectedRoute>
  );

  const AuthPage = () => (
    <RouteTransition>
      <main id="main-content" role="main">
        <PBAuthPage
          onNavigateToLanding={() => navigate(routeConfig.landing)}
          onAuthSuccess={() => navigate(routeConfig.dashboard)}
        />
      </main>
    </RouteTransition>
  );

  const ProfilePage = () => (
    <ProtectedRoute isAuthed={!!user}>
      <RouteTransition>
        <ThemeWrapper theme="cinematic">
          <AppLayout
            currentPage={"profile" as any}
            onNavigate={(p) => navigate(`/${p}`)}
            className="min-h-screen bg-cinematic-base"
          >
            <main id="main-content" role="main">
              <Profile
                onNavigateBack={() => navigate(-1)}
                onNavigateToTemple={() => navigate(routeConfig.dashboard)}
                onNavigateToLanding={() => navigate(routeConfig.landing)}
              />
            </main>
          </AppLayout>
        </ThemeWrapper>
      </RouteTransition>
    </ProtectedRoute>
  );

  const LoginPage = () => (
    <RouteTransition>
      <main id="main-content" role="main">
        <CustomAuthLayout
          mode="login"
          onNavigateToSignup={() => navigate(routeConfig.signup)}
          onNavigateToLanding={() => navigate(routeConfig.landing)}
          onAuthSuccess={() => navigate(routeConfig.dashboard)}
        />
      </main>
    </RouteTransition>
  );

  const SignupPage = () => (
    <RouteTransition>
      <main id="main-content" role="main">
        <CustomAuthLayout
          mode="signup"
          onNavigateToLogin={() => navigate(routeConfig.login)}
          onNavigateToLanding={() => navigate(routeConfig.landing)}
          onAuthSuccess={() => navigate(routeConfig.dashboard)}
        />
      </main>
    </RouteTransition>
  );

  return (
    <Routes>
      <Route path={routeConfig.landing} element={<LandingPage />} />
      <Route path={routeConfig.login} element={<LoginPage />} />
      <Route path={routeConfig.signup} element={<SignupPage />} />
      <Route path={routeConfig.auth} element={<AuthPage />} />
      <Route path={routeConfig.dashboard} element={<UserDashboard />} />
      <Route path={routeConfig.profile} element={<ProfilePage />} />
      <Route path="*" element={<Navigate to={routeConfig.landing} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CreditProvider>
        <AppContent />
      </CreditProvider>
    </AuthProvider>
  );
}
