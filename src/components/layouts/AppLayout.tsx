import { ReactNode } from "react";
import { DemoNavigation } from "../DemoNavigation";

import { Toaster } from "../ui/sonner";

type AppPage = 'login' | 'signup' | 'temple';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  className?: string;
}

export function AppLayout({ 
  children, 
  currentPage, 
  onNavigate, 
  className = "min-h-screen bg-cinematic-base overflow-hidden cinematic-theme" 
}: AppLayoutProps) {
  return (
    <div className={className}>
      {children}
      
      {/* Demo Navigation */}
      <DemoNavigation 
        currentPage={currentPage} 
        onNavigate={onNavigate}
      />
      

      
      <Toaster position="top-right" />
    </div>
  );
}