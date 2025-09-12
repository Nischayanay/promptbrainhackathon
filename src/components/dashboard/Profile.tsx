import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  User, 
  Mail, 
  Crown, 
  Edit3, 
  Save, 
  X,
  History,
  Zap,
  Brain,
  Trophy,
  Star
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ProfileProps {
  selectedRole?: string | null;
}

export function Profile({ selectedRole }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Temple Seeker");
  const [email, setEmail] = useState("seeker@promptbrain.temple");
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  // Mock credit history data
  const creditHistory = [
    { date: "Jan 15", action: "Enhanced Prompt", credits: -1, type: "direct" },
    { date: "Jan 15", action: "Flow Mode Enhancement", credits: -1, type: "guided" },
    { date: "Jan 14", action: "Daily Restoration", credits: +5, type: "restore" },
    { date: "Jan 13", action: "Enhanced Prompt", credits: -1, type: "direct" },
    { date: "Jan 12", action: "Enhanced Prompt", credits: -1, type: "direct" },
  ];

  const handleSave = () => {
    setName(tempName);
    setEmail(tempEmail);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setTempName(name);
    setTempEmail(email);
    setIsEditing(false);
  };

  const totalCreditsUsed = creditHistory.filter(h => h.credits < 0).length;
  const totalCreditsEarned = creditHistory.filter(h => h.credits > 0).reduce((sum, h) => sum + h.credits, 0);

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-3xl font-light text-royal-gold mb-3 temple-glow"
          style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
        >
          Sacred Profile
        </h1>
        <p className="text-marble-white/70">
          Your journey through the Mind Temple
        </p>
      </div>

      <div className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="bg-marble-white/5 border-royal-gold/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-marble-white">Temple Identity</h2>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-royal-gold/30 text-royal-gold hover:bg-royal-gold/20"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="bg-royal-gold/20 hover:bg-royal-gold/30 text-royal-gold border-royal-gold/40"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="border-marble-white/30 text-marble-white/60 hover:bg-marble-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Avatar & Basic Info */}
              <div className="flex items-start space-x-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-royal-gold/20 to-violet/20 rounded-full flex items-center justify-center relative">
                  <User className="w-12 h-12 text-royal-gold" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-violet to-electric-blue rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-temple-black" />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <Label className="text-marble-white/70 text-sm">Name</Label>
                    {isEditing ? (
                      <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="mt-1 bg-input-background/50 border-royal-gold/30 focus:border-royal-gold/60 text-marble-white"
                      />
                    ) : (
                      <p className="text-marble-white text-lg font-medium">{name}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-marble-white/70 text-sm">Email</Label>
                    {isEditing ? (
                      <Input
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        type="email"
                        className="mt-1 bg-input-background/50 border-royal-gold/30 focus:border-royal-gold/60 text-marble-white"
                      />
                    ) : (
                      <p className="text-marble-white/80">{email}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-marble-white/70 text-sm">Sacred Role</Label>
                    <div className="mt-1">
                      <Badge 
                        variant="outline" 
                        className="border-violet/50 text-violet px-3 py-1"
                      >
                        <Crown className="w-3 h-3 mr-2" />
                        Temple Seeker
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Credit History */}
            <Card className="bg-marble-white/5 border-royal-gold/20 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <History className="w-5 h-5 text-electric-blue" />
                <h2 className="text-xl font-medium text-marble-white">Temple Key History</h2>
              </div>

              <div className="space-y-3">
                {creditHistory.map((entry, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-marble-white/5 rounded-lg border border-marble-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        entry.type === 'restore' 
                          ? 'bg-success-green/20' 
                          : entry.type === 'guided' 
                          ? 'bg-violet/20' 
                          : 'bg-royal-gold/20'
                      }`}>
                        {entry.type === 'restore' ? (
                          <Star className="w-4 h-4 text-success-green" />
                        ) : entry.type === 'guided' ? (
                          <Brain className="w-4 h-4 text-violet" />
                        ) : (
                          <Zap className="w-4 h-4 text-royal-gold" />
                        )}
                      </div>
                      <div>
                        <p className="text-marble-white text-sm font-medium">
                          {entry.action}
                        </p>
                        <p className="text-marble-white/60 text-xs">
                          {entry.date}
                        </p>
                      </div>
                    </div>
                    <div className={`font-medium text-sm ${
                      entry.credits > 0 ? 'text-success-green' : 'text-marble-white/80'
                    }`}>
                      {entry.credits > 0 ? '+' : ''}{entry.credits} Keys
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <Card className="bg-gradient-to-br from-royal-gold/5 to-violet/5 border-royal-gold/20 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-royal-gold/20 to-violet/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-royal-gold" />
                </div>
                <h3 className="text-lg font-medium text-marble-white mb-2">
                  Temple Adept
                </h3>
                <p className="text-marble-white/60 text-sm mb-4">
                  Active member of the Mind Temple
                </p>
                <Badge 
                  variant="outline" 
                  className="border-cyan-glow/50 text-cyan-glow text-sm"
                >
                  ✨ Enlightened Status
                </Badge>
              </div>
            </Card>

            {/* Usage Stats */}
            <Card className="bg-marble-white/5 border-royal-gold/20 p-6">
              <h3 className="text-lg font-medium text-marble-white mb-4">Usage Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-marble-white/70 text-sm">Keys Used</span>
                  <span className="text-marble-white font-medium">{totalCreditsUsed}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-marble-white/70 text-sm">Keys Earned</span>
                  <span className="text-success-green font-medium">+{totalCreditsEarned}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-marble-white/70 text-sm">Direct Enhancements</span>
                  <span className="text-royal-gold font-medium">
                    {creditHistory.filter(h => h.type === 'direct').length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-marble-white/70 text-sm">Flow Mode Sessions</span>
                  <span className="text-violet font-medium">
                    {creditHistory.filter(h => h.type === 'guided').length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Next Restoration */}
            <Card className="bg-marble-white/5 border-success-green/20 p-6">
              <div className="text-center">
                <Star className="w-8 h-8 text-success-green mx-auto mb-3" />
                <h3 className="text-marble-white font-medium mb-2">
                  Next Key Restoration
                </h3>
                <p className="text-marble-white/60 text-sm mb-3">
                  Your temple energy renews daily
                </p>
                <div className="text-success-green font-medium">
                  +5 Keys Tomorrow
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}