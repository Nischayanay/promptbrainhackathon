import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// Route configuration
export const routeConfig = {
  landing: "/",
  login: "/login", 
  signup: "/signup",
  dashboard: "/dashboard", // Now points to custom dashboard
  profile: "/profile",
  auth: "/auth", // For the pbauth component
} as const;

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  isAuthed: boolean;
}

export function ProtectedRoute({ children, isAuthed }: ProtectedRouteProps) {
  console.log('🔒 ProtectedRoute check:', { isAuthed });
  
  if (!isAuthed) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to={routeConfig.auth} replace />;
  }
  
  console.log('✅ Authenticated, rendering protected content');
  return <>{children}</>;
}

// Theme Wrapper Component
interface ThemeWrapperProps {
  children: ReactNode;
  theme: "landing" | "cinematic" | "temple";
}

export function ThemeWrapper({ children, theme }: ThemeWrapperProps) {
  return (
    <div className={`${theme}-theme`}>
      {children}
    </div>
  );
}