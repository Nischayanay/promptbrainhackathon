import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ApplicationOverview } from "./ApplicationOverview";
import { Eye, ArrowRight, Settings, Crown, Gift, Home, Info, User } from "lucide-react";

type AppPage = 'login' | 'signup' | 'temple' | 'profile';

interface DemoNavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export function DemoNavigation({ currentPage, onNavigate }: DemoNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  const pages = [
    {
      id: 'login' as AppPage,
      title: 'Login Page',
      description: 'Access the Temple',
      icon: Home,
      status: 'Active'
    },
    {
      id: 'signup' as AppPage,
      title: 'Signup Page', 
      description: 'Forge your Key',
      icon: Crown,
      status: 'Active'
    },
    {
      id: 'temple' as AppPage,
      title: 'Mind Temple',
      description: 'Dashboard/Home',
      icon: Eye,
      status: 'Main App'
    },
    {
      id: 'profile' as AppPage,
      title: 'Sacred Profile',
      description: 'User Settings',
      icon: Settings,
      status: 'Profile Page'
    }
  ];

  return (
    <>
      {/* Application Overview Modal */}
      {showOverview && (
        <ApplicationOverview onClose={() => setShowOverview(false)} />
      )}

      {/* Compact Navigation Button */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative" ref={dropdownRef}>
          {/* Main Toggle Button - REMOVED */}

          {/* Dropdown Panel */}
          {isExpanded && (
            <div className="absolute top-12 right-0 w-80">
              <Card className="bg-temple-black/95 backdrop-blur-md border-royal-gold/20 p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-royal-gold font-medium">PromptBrain Flow</h3>
                    <Button
                      onClick={() => setIsExpanded(false)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-royal-gold/20 text-marble-white/50 hover:text-royal-gold"
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-marble-white/60 text-sm">Navigate through the streamlined journey</p>
                </div>

                <div className="space-y-1">
                  {pages.map((page) => {
                    const Icon = page.icon;
                    const isActive = currentPage === page.id;
                    
                    return (
                      <button
                        key={page.id}
                        onClick={() => {
                          onNavigate(page.id);
                          setIsExpanded(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg border transition-all group ${
                          isActive 
                            ? 'bg-royal-gold/20 border-royal-gold/40 text-royal-gold' 
                            : 'bg-marble-white/5 border-marble-white/10 text-marble-white/70 hover:bg-marble-white/10 hover:border-marble-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-3 h-3 ${isActive ? 'text-royal-gold' : 'text-marble-white/50'}`} />
                            <div>
                              <div className={`font-medium text-xs ${isActive ? 'text-royal-gold' : 'text-marble-white'}`}>
                                {page.title}
                              </div>
                              <div className="text-xs text-marble-white/50">
                                {page.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                isActive 
                                  ? 'border-royal-gold/50 text-royal-gold' 
                                  : 'border-marble-white/20 text-marble-white/50'
                              }`}
                            >
                              {page.status}
                            </Badge>
                            {isActive && <ArrowRight className="w-2 h-2 text-royal-gold" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-royal-gold/10">
                  <Button
                    onClick={() => {
                      setShowOverview(true);
                      setIsExpanded(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full border-royal-gold/30 text-royal-gold hover:bg-royal-gold/20"
                  >
                    <Info className="w-3 h-3 mr-2" />
                    View Complete Overview
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}