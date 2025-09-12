import { ReactNode } from "react";
import { AppLayout } from "./AppLayout";

type AppPage = 'login' | 'signup' | 'role-selection' | 'gift-of-entry' | 'temple';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  selectedRole?: string | null;
}

export function OnboardingLayout({ 
  children, 
  currentPage, 
  onNavigate, 
  selectedRole 
}: OnboardingLayoutProps) {
  return (
    <AppLayout 
      currentPage={currentPage} 
      onNavigate={onNavigate}
      selectedRole={selectedRole}
    >
      {children}
    </AppLayout>
  );
}