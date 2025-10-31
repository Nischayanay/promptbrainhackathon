import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// Route configuration
export const routeConfig = {
  landing: "/",
  login: "/login", 
  signup: "/signup",
  dashboard: "/dashboard",
  profile: "/profile",
  auth: "/auth", // For the pbauth component
} as const;

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  isAuthed: boolean;
}

export function ProtectedRoute({ children, isAuthed }: ProtectedRouteProps) {
  if (!isAuthed) {
    return <Navigate to={routeConfig.login} replace />;
  }
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