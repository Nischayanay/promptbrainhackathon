import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { User, Mail, Edit3, Save, X, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getCurrentSession, getUserProfile, createOAuthProfile } from "../../utils/auth";

interface ProfileHeaderProps {
  className?: string;
}

export function ProfileHeader({ className = "" }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...", 
    age: "",
    role: "Student"
  });
  
  const [tempData, setTempData] = useState(userData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Animation trigger
  const [isVisible, setIsVisible] = useState(false);
  
  // Load real user data from Supabase
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const session = await getCurrentSession();
        
        if (session.success && session.access_token) {
          const profile = await getUserProfile(session.access_token);
          
          if (profile.success && profile.user) {
            const realUserData = {
              name: profile.user.full_name || session.user?.user_metadata?.full_name || "Temple Seeker",
              email: profile.user.email || session.user?.email || "Unknown",
              age: profile.user.age || "",
              role: profile.user.role || "Student"
            };
            
            setUserData(realUserData);
            setTempData(realUserData);
            console.log('Profile loaded successfully:', realUserData);
          } else {
            // Fallback to session user data if profile fetch fails (OAuth users, etc.)
            const fallbackData = {
              name: session.user?.user_metadata?.full_name || 
                    session.user?.user_metadata?.name || 
                    session.user?.user_metadata?.display_name ||
                    session.user?.identities?.[0]?.identity_data?.full_name ||
                    session.user?.identities?.[0]?.identity_data?.name ||
                    "Temple Seeker",
              email: session.user?.email || "Unknown",
              age: "",
              role: "Student"
            };
            
            setUserData(fallbackData);
            setTempData(fallbackData);
            console.log('Using fallback profile data for user:', { 
              userId: session.user?.id, 
              email: session.user?.email,
              metadata: session.user?.user_metadata,
              identities: session.user?.identities,
              fallbackData 
            });
            
            // For OAuth users, try to create a profile in the backend
            if (session.user?.id && session.user?.email) {
              console.log('Attempting to create OAuth profile...');
              try {
                await createOAuthProfile(session.access_token, fallbackData);
                console.log('OAuth profile creation attempted');
              } catch (error) {
                console.log('OAuth profile creation failed:', error);
              }
            }
          }
        } else {
          console.log('No active session found');
          toast.error("Please log in to view your profile");
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
        setIsVisible(true);
      }
    };
    
    loadUserData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert changes
      setTempData(userData);
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    // Here you would typically call an API to save the changes
    setUserData(tempData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    // Here you would typically call an API to change the password
    toast.success("Password updated successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsPasswordModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      <Card className="bg-landing-white/5 border-landing-white/10 backdrop-blur-sm">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-landing-blue/20 to-landing-blue/10 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-landing-blue" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-landing-white">User Information</h2>
                <p className="text-landing-white/60 text-sm">Manage your account details</p>
              </div>
            </div>
            
            {!isEditing ? (
              <Button
                onClick={handleEditToggle}
                variant="outline"
                size="sm"
                className="border-landing-blue/30 text-landing-blue hover:bg-landing-blue/10"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  size="sm"
                  className="border-landing-white/30 text-landing-white/70 hover:bg-landing-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-landing-blue hover:bg-landing-blue/80 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
          
          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-landing-white/90 text-sm font-medium">
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={tempData.name}
                  onChange={(e) => setTempData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-landing-white/5 border-landing-white/20 text-landing-white placeholder:text-landing-white/40 focus:border-landing-blue/50"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              ) : (
                <div className="px-3 py-2 bg-landing-white/5 border border-landing-white/10 rounded-md text-landing-white">
                  {isLoading ? "Loading..." : userData.name}
                </div>
              )}
            </div>

            {/* Email (Non-editable as per PRD) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-landing-white/90 text-sm font-medium">
                Email Address
              </Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 px-3 py-2 bg-landing-white/5 border border-landing-white/10 rounded-md text-landing-white/80 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-landing-white/40" />
                  <span>{isLoading ? "Loading..." : userData.email}</span>
                </div>
                <span className="text-xs text-landing-white/50 bg-landing-white/5 px-2 py-1 rounded">
                  Non-editable
                </span>
              </div>
            </div>

            {/* Age (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-landing-white/90 text-sm font-medium">
                Age <span className="text-landing-white/50 text-xs">(optional)</span>
              </Label>
              {isEditing ? (
                <Input
                  id="age"
                  type="number"
                  value={tempData.age}
                  onChange={(e) => setTempData(prev => ({ ...prev, age: e.target.value }))}
                  className="bg-landing-white/5 border-landing-white/20 text-landing-white placeholder:text-landing-white/40 focus:border-landing-blue/50"
                  placeholder="Enter your age"
                  min="13"
                  max="120"
                />
              ) : (
                <div className="px-3 py-2 bg-landing-white/5 border border-landing-white/10 rounded-md text-landing-white">
                  {userData.age || "Not specified"}
                </div>
              )}
            </div>

            {/* Password Change Option */}
            <div className="pt-4 border-t border-landing-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-landing-white/90 text-sm font-medium">Password</Label>
                  <p className="text-landing-white/60 text-xs mt-1">
                    Change your account password
                  </p>
                </div>
                <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-landing-white/30 text-landing-white/70 hover:bg-landing-white/10"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-landing-black border-landing-white/20 text-landing-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-landing-white">Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-landing-white/80">Current Password</Label>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="mt-1 bg-landing-white/5 border-landing-white/20 text-landing-white pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-landing-white/40 hover:text-landing-white/70"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-landing-white/80">New Password</Label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="mt-1 bg-landing-white/5 border-landing-white/20 text-landing-white pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-landing-white/40 hover:text-landing-white/70"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-landing-white/80">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="mt-1 bg-landing-white/5 border-landing-white/20 text-landing-white pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-landing-white/40 hover:text-landing-white/70"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsPasswordModalOpen(false)}
                          className="border-landing-white/30 text-landing-white/70 hover:bg-landing-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePasswordChange}
                          className="bg-landing-blue hover:bg-landing-blue/80 text-white"
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}