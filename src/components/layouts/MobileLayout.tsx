import { ReactNode } from "react";
import { MobileHeroSection } from "./MobileHeroSection";

interface MobileLayoutProps {
  isLogin: boolean;
  children: ReactNode;
}

export function MobileLayout({ isLogin, children }: MobileLayoutProps) {
  return (
    <div className="lg:hidden min-h-screen">
      {/* Top Hero Section - Shrunk pyramid */}
      <MobileHeroSection isLogin={isLogin} />
      
      {/* Card - Full width */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}