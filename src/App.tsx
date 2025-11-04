import { PRDLandingPage } from "./components/PRDLandingPage";
import { PBAuthPage } from "./components/pages/PBAuthPage";
import { CustomDashboardPage } from "./components/pages/CustomDashboardPage";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { routeConfig, ThemeWrapper } from "./routes/index";
import { RouteTransition } from "./components/common/RouteTransition";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CreditProvider } from "./contexts/CreditContext";

function AppContent() {
  const navigate = useNavigate();

  // Simple route components without protection
  const LandingPage = () => (
    <RouteTransition>
      <ThemeWrapper theme="landing">
        <main id="main-content" role="main">
          <PRDLandingPage
            onNavigateToSignup={() => navigate(routeConfig.auth)}
            onNavigateToLogin={() => navigate(routeConfig.auth)}
          />
        </main>
      </ThemeWrapper>
    </RouteTransition>
  );

  const UserDashboard = () => (
    <RouteTransition>
      <main id="main-content" role="main">
        <CustomDashboardPage />
      </main>
    </RouteTransition>
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

  return (
    <Routes>
      <Route path={routeConfig.landing} element={<LandingPage />} />
      <Route path={routeConfig.auth} element={<AuthPage />} />
      <Route path={routeConfig.dashboard} element={<UserDashboard />} />
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
