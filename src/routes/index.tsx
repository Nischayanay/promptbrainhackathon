import React, { ReactNode } from "react";

// Route configuration - Simple routes only
export const routeConfig = {
  landing: "/",
  auth: "/auth",
  dashboard: "/dashboard",
} as const;

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