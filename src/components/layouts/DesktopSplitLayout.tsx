import { ReactNode } from "react";
import { ImmersiveHeroSection } from "../ImmersiveHeroSection";
import { SignupHeroSection } from "../SignupHeroSection";

interface DesktopSplitLayoutProps {
  isLogin: boolean;
  children: ReactNode;
}

export function DesktopSplitLayout({ isLogin, children }: DesktopSplitLayoutProps) {
  return (
    <div className="hidden lg:flex h-screen">
      {/* Left Section - Immersive/Inspirational (50%) */}
      <div className="flex-1 relative">
        {isLogin ? <ImmersiveHeroSection /> : <SignupHeroSection />}
      </div>
      
      {/* Right Section - Conversion Card (50%) */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}