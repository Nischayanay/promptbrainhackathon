import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Lock, 
  FileText, 
  Rocket, 
  Users, 
  Target,
  Lightbulb,
  Sparkles
} from "lucide-react";

export function PrdGenerator() {
  const features = [
    {
      icon: Target,
      title: "Vision & Strategy",
      description: "Generate clear product vision, goals, and success metrics"
    },
    {
      icon: Users,
      title: "User Research",
      description: "Create user personas, journey maps, and pain point analysis"
    },
    {
      icon: Lightbulb,
      title: "Feature Specs",
      description: "Define requirements, user stories, and acceptance criteria"
    },
    {
      icon: Rocket,
      title: "Go-to-Market",
      description: "Launch strategy, marketing plans, and rollout timeline"
    }
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Main Lock Visual */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            {/* Glowing Lock Container */}
            <div className="w-32 h-32 bg-gradient-to-br from-royal-gold/10 to-violet/20 rounded-full flex items-center justify-center mx-auto relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-royal-gold/5 to-violet/10 animate-pulse"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-royal-gold/20 to-violet/30 rounded-xl flex items-center justify-center relative z-10">
                <Lock className="w-10 h-10 text-royal-gold" />
              </div>
              {/* Orbiting Particles */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-2 left-1/2 w-1 h-1 bg-royal-gold rounded-full transform -translate-x-1/2"></div>
                <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-violet rounded-full transform -translate-x-1/2"></div>
                <div className="absolute left-2 top-1/2 w-1 h-1 bg-electric-blue rounded-full transform -translate-y-1/2"></div>
                <div className="absolute right-2 top-1/2 w-1 h-1 bg-cyan-glow rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          <h1 
            className="text-4xl font-light text-royal-gold mb-4 temple-glow"
            style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            🚧 The PRD Generator
          </h1>
          
          <div className="inline-flex items-center space-x-2 mb-6">
            <Badge variant="outline" className="border-violet/50 text-violet text-sm px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Coming Soon
            </Badge>
            <Badge variant="outline" className="border-royal-gold/50 text-royal-gold text-sm px-4 py-2">
              Next Release
            </Badge>
          </div>

          <p className="text-marble-white/70 text-lg mb-8 leading-relaxed">
            <strong>Blueprints for founders, crafted instantly.</strong>
            <br />
            Transform ideas into comprehensive Product Requirements Documents
            <br />
            with the wisdom of temple intelligence.
          </p>
        </div>

        {/* Feature Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-marble-white/5 border-marble-white/10 hover:bg-marble-white/8 hover:border-royal-gold/20 transition-all duration-300 group p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-royal-gold/10 to-violet/10 rounded-lg flex items-center justify-center shrink-0 group-hover:from-royal-gold/20 group-hover:to-violet/20 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-royal-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-marble-white font-medium mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-marble-white/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-royal-gold/5 to-violet/5 border-royal-gold/20 p-8">
            <div className="flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-royal-gold mr-3" />
              <h2 className="text-xl font-medium text-marble-white">
                Ready to Transform Product Planning?
              </h2>
            </div>
            
            <p className="text-marble-white/60 mb-8 leading-relaxed">
              The PRD Generator will help you create professional Product Requirements Documents 
              in minutes, not days. Complete with market analysis, technical specifications, 
              and implementation roadmaps.
            </p>
            
            <Button
              disabled
              className="bg-royal-gold/10 text-royal-gold/50 border-royal-gold/30 cursor-not-allowed px-8 py-3 text-lg"
              size="lg"
            >
              <Lock className="w-5 h-5 mr-2" />
              Locked for now
            </Button>
            
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-marble-white/50">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-royal-gold/60 rounded-full"></div>
                <span>In Development</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-violet/60 rounded-full"></div>
                <span>Coming Q2 2024</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Mystic Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-marble-white/40 text-sm">
            <div className="w-1 h-1 bg-royal-gold/40 rounded-full animate-pulse"></div>
            <span>The temple's greatest secrets take time to forge</span>
            <div className="w-1 h-1 bg-royal-gold/40 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}