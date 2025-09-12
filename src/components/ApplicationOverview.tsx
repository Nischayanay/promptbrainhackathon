import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Database, 
  Shield, 
  Smartphone, 
  Zap, 
  Users, 
  Crown, 
  Eye, 
  Settings,
  Gift,
  Home,
  Server,
  Palette,
  Code2
} from "lucide-react";

interface ApplicationOverviewProps {
  onClose: () => void;
}

export function ApplicationOverview({ onClose }: ApplicationOverviewProps) {
  const features = [
    {
      category: "Authentication & Backend",
      icon: Shield,
      color: "text-cyan-glow",
      items: [
        "Supabase Authentication Integration",
        "KV Store for User Data & Roles", 
        "Credit System (10 Temple Keys)",
        "Onboarding Completion Tracking",
        "Session Management"
      ]
    },
    {
      category: "User Experience Flow",
      icon: Users,
      color: "text-royal-gold",
      items: [
        "Login → Signup → Role Selection → Gift Ceremony → Temple",
        "Mystical Temple Branding Throughout",
        "Smooth Page Transitions",
        "Emotional Engagement Design",
        "Chronicle-Style Minimal Aesthetics"
      ]
    },
    {
      category: "Visual Design System",
      icon: Palette,
      color: "text-violet",
      items: [
        "Ancient Egyptian x Modern AI Aesthetics",
        "Floating Pyramid Animations",
        "Cosmic Background Effects",
        "Mystical Golden Color Palette",
        "Custom Animation Library"
      ]
    },
    {
      category: "Responsive Design",
      icon: Smartphone,
      color: "text-electric-blue",
      items: [
        "Mobile-First Approach",
        "50/50 Split Layout (Desktop)",
        "Stacked Layout (Mobile)",
        "Scalable Typography",
        "Touch-Friendly Interactions"
      ]
    },
    {
      category: "Technical Architecture",
      icon: Code2,
      color: "text-magenta",
      items: [
        "React + TypeScript",
        "Tailwind CSS v4",
        "Motion/React Animations",
        "Shadcn/UI Components",
        "Modular Component Structure"
      ]
    }
  ];

  const pages = [
    {
      name: "Login Page",
      icon: Home,
      description: "Access the Temple - mystical login with cosmic animations",
      status: "Complete"
    },
    {
      name: "Signup Page", 
      icon: Crown,
      description: "Forge your Key - elegant signup with conversion clarity",
      status: "Complete"
    },
    {
      name: "Role Selection",
      icon: Settings,
      description: "Choose Your Path - three glowing doorways for role selection",
      status: "Complete"
    },
    {
      name: "Gift of Entry",
      icon: Gift,
      description: "Temple Keys Ceremony - scroll animation with 10 credits",
      status: "Complete"
    },
    {
      name: "Mind Temple",
      icon: Eye,
      description: "Dashboard - main application interface (placeholder)",
      status: "Placeholder"
    }
  ];

  const metrics = [
    { label: "Components", value: "25+", description: "Reusable UI components" },
    { label: "Pages", value: "5", description: "Complete user flow" },
    { label: "Animations", value: "15+", description: "Custom CSS animations" },
    { label: "Backend Routes", value: "3", description: "Auth, role, onboarding" }
  ];

  return (
    <div className="fixed inset-0 bg-temple-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-6xl w-full">
        <Card className="bg-temple-black/95 border-royal-gold/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl font-light text-royal-gold mb-4"
              style={{ 
                fontFamily: '"Playfair Display", "Georgia", serif',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
              }}
            >
              PromptBrain Temple
            </h1>
            <p className="text-marble-white/70 text-lg max-w-2xl mx-auto">
              Complete ceremonial login experience with mystical onboarding flow, 
              blending ancient temple aesthetics with modern AI intelligence forging.
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="text-2xl font-bold text-royal-gold">{metric.value}</div>
                  <div className="text-sm text-marble-white/60">{metric.label}</div>
                  <div className="text-xs text-marble-white/40">{metric.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pages Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-marble-white mb-4">User Flow Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {pages.map((page) => {
                const Icon = page.icon;
                return (
                  <Card key={page.name} className="bg-marble-white/5 border-marble-white/10 p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="w-5 h-5 text-royal-gold" />
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          page.status === 'Complete' 
                            ? 'border-cyan-glow/50 text-cyan-glow' 
                            : 'border-violet/50 text-violet'
                        }`}
                      >
                        {page.status}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-marble-white mb-1">{page.name}</h3>
                    <p className="text-xs text-marble-white/60">{page.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-marble-white mb-4">Feature Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.category} className="bg-marble-white/5 border-marble-white/10 p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                      <h3 className="font-medium text-marble-white">{feature.category}</h3>
                    </div>
                    <ul className="space-y-1">
                      {feature.items.map((item, index) => (
                        <li key={index} className="text-sm text-marble-white/70 flex items-center space-x-2">
                          <div className="w-1 h-1 bg-royal-gold rounded-full"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Technical Specs */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-marble-white mb-4">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-marble-white/5 border-marble-white/10 p-4">
                <h3 className="font-medium text-marble-white mb-3 flex items-center">
                  <Server className="w-4 h-4 text-cyan-glow mr-2" />
                  Backend & Data
                </h3>
                <ul className="space-y-1 text-sm text-marble-white/70">
                  <li>• Supabase Authentication & Database</li>
                  <li>• KV Store for flexible data structure</li>
                  <li>• Edge Functions for server logic</li>
                  <li>• Row Level Security (RLS)</li>
                  <li>• Credit system with 10 initial keys</li>
                </ul>
              </Card>

              <Card className="bg-marble-white/5 border-marble-white/10 p-4">
                <h3 className="font-medium text-marble-white mb-3 flex items-center">
                  <Zap className="w-4 h-4 text-electric-blue mr-2" />
                  Frontend & UX
                </h3>
                <ul className="space-y-1 text-sm text-marble-white/70">
                  <li>• React 18 + TypeScript</li>
                  <li>• Tailwind CSS v4 with custom theme</li>
                  <li>• Motion/React for smooth animations</li>
                  <li>• Responsive mobile-first design</li>
                  <li>• Custom mystical animation library</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <Button 
              onClick={onClose}
              className="bg-royal-gold/20 hover:bg-royal-gold/30 text-royal-gold border-royal-gold/40"
            >
              Continue to Application
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}