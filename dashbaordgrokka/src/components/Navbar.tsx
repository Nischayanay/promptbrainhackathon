import { User, Coins, Menu } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';

export function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [credits] = useState(1250);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-white/10 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="w-8 h-8 rounded-full border-2 border-white relative transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white -rotate-45 origin-center" />
            </div>
          </div>
          <span className="text-white text-xl tracking-tight">PromptBrain</span>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-4">
          {/* Credits */}
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full
                     hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Coins className="w-4 h-4 text-[#00D9FF]" />
            <span className="text-white text-sm">{credits.toLocaleString()}</span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#FF006E] rounded-full 
                       flex items-center justify-center hover:scale-110 transition-all duration-200 active:scale-95
                       hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]"
              aria-label="Profile menu"
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white text-sm">Solo Founder</p>
                  <p className="text-white/60 text-xs">founder@promptbrain.ai</p>
                </div>
                <button className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3">
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3">
                  <Coins className="w-4 h-4" />
                  Purchase Credits
                </button>
                <div className="border-t border-white/10">
                  <button className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-white/10 transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
