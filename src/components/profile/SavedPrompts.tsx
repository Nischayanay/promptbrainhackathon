import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { BookOpen, Expand, Trash2, Copy, Calendar, Zap, Brain, Star, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { getCurrentSession } from "../../utils/auth";

interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  original: string;
  mode: "direct" | "guided" | "flow";
  created_at: string;
  date: string;
  category?: string;
}

interface SavedPromptsProps {
  className?: string;
}

export function SavedPrompts({ className = "" }: SavedPromptsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedPrompts();
  }, []);

  const fetchSavedPrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await getCurrentSession();
      if (!session.success || !session.accessToken) {
        setError("Please sign in to view your saved prompts");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/user/saved-prompts`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch saved prompts');
      }

      const data = await response.json();
      if (data.success) {
        setSavedPrompts(data.saved_prompts || []);
        setIsVisible(true);
      } else {
        throw new Error(data.error || 'Failed to load saved prompts');
      }
    } catch (err) {
      console.error('Error fetching saved prompts:', err);
      setError('Failed to load your saved prompts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const handleCopyPrompt = (prompt: string, type: "original" | "enhanced") => {
    navigator.clipboard.writeText(prompt);
    toast.success(`${type === "original" ? "Original" : "Enhanced"} prompt copied to clipboard!`);
  };

  const handleDeletePrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
    toast.success("Prompt deleted successfully");
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Business": return "border-landing-blue/50 text-landing-blue bg-landing-blue/10";
      case "Creative": return "border-purple-400/50 text-purple-400 bg-purple-400/10";
      case "Analytics": return "border-landing-blue/50 text-landing-blue bg-landing-blue/10";
      case "Education": return "border-green-400/50 text-green-400 bg-green-400/10";
      case "Design": return "border-pink-400/50 text-pink-400 bg-pink-400/10";
      default: return "border-landing-white/50 text-landing-white/70 bg-landing-white/10";
    }
  };

  const getModeIcon = (mode: "direct" | "guided" | "flow") => {
    switch (mode) {
      case "direct":
        return <Zap className="w-3 h-3" />;
      case "guided":
        return <Brain className="w-3 h-3" />;
      case "flow":
        return <Star className="w-3 h-3" />;
      default:
        return <Zap className="w-3 h-3" />;
    }
  };

  const getModeStyle = (mode: "direct" | "guided" | "flow") => {
    switch (mode) {
      case "direct":
        return "border-landing-blue/50 text-landing-blue bg-landing-blue/10";
      case "guided":
        return "border-purple-400/50 text-purple-400 bg-purple-400/10";
      case "flow":
        return "border-green-400/50 text-green-400 bg-green-400/10";
      default:
        return "border-landing-blue/50 text-landing-blue bg-landing-blue/10";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        className={className}
      >
        <Card className="bg-landing-white/5 border-landing-white/10 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Loader2 className="w-6 h-6 text-landing-blue animate-spin" />
              <div>
                <h2 className="text-lg font-semibold text-landing-white">Loading Saved Prompts</h2>
                <p className="text-landing-white/60 text-sm">Retrieving your enhanced prompts...</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[1,2,3].map((i) => (
                <Card key={i} className="bg-landing-white/5 border-landing-white/10">
                  <div className="p-4 animate-pulse">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-6 bg-landing-white/10 rounded"></div>
                      <div className="w-8 h-6 bg-landing-white/10 rounded"></div>
                    </div>
                    <div className="h-4 bg-landing-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-landing-white/5 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        className={className}
      >
        <Card className="bg-landing-white/5 border-red-500/20 backdrop-blur-sm">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-landing-white mb-2">Failed to Load Prompts</h2>
            <p className="text-landing-white/60 mb-4 text-sm">{error}</p>
            <button 
              onClick={fetchSavedPrompts}
              className="px-4 py-2 bg-landing-blue hover:bg-landing-blue/80 rounded-lg text-white font-medium transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
      className={className}
    >
      <Card className="bg-landing-white/5 border-landing-white/10 backdrop-blur-sm">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-landing-blue/20 to-landing-blue/10 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="w-5 h-5 text-landing-blue" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-landing-white">Saved Prompts</h2>
              <p className="text-landing-white/60 text-sm">Your enhanced prompt collection ({savedPrompts.length} total)</p>
            </div>
          </div>

          {/* Prompts List View */}
          {savedPrompts.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-landing-white/5 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <BookOpen className="w-8 h-8 text-landing-white/40" />
              </motion.div>
              <h3 className="text-lg font-medium text-landing-white/70 mb-2">No Saved Prompts Yet</h3>
              <p className="text-landing-white/50 text-sm">
                Enhanced prompts will appear here when you save them
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredCard(prompt.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className={`
                    bg-landing-white/5 border-landing-white/10 transition-all duration-300 cursor-pointer
                    ${hoveredCard === prompt.id 
                      ? 'border-landing-blue/30 shadow-lg shadow-landing-blue/10 transform scale-[1.01]' 
                      : 'hover:border-landing-white/20'
                    }
                  `}>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Title and Badges */}
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-landing-white font-medium text-sm">
                              {prompt.title}
                            </h3>
                            <Badge variant="outline" size="sm" className={getCategoryColor(prompt.category)}>
                              {prompt.category}
                            </Badge>
                            <Badge variant="outline" size="sm" className={getModeStyle(prompt.mode)}>
                              {getModeIcon(prompt.mode)}
                              <span className="ml-1 capitalize">{prompt.mode}</span>
                            </Badge>
                          </div>
                          
                          {/* Content Preview */}
                          <div className="space-y-1 mb-3">
                            <p className="text-landing-white/70 text-xs line-clamp-1">
                              <span className="text-landing-white/50 font-medium">Original:</span> {prompt.original}
                            </p>
                            <p className="text-landing-white/80 text-xs line-clamp-1">
                              <span className="text-landing-blue font-medium">Enhanced:</span> {prompt.content}
                            </p>
                          </div>
                          
                          {/* Date */}
                          <div className="flex items-center text-landing-white/50 text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(prompt.created_at)}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-1 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-landing-white/60 hover:text-landing-blue hover:bg-landing-blue/10"
                                onClick={() => setSelectedPrompt(prompt)}
                              >
                                <Expand className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-landing-black border-landing-white/20 text-landing-white max-w-3xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle className="text-landing-white flex items-center">
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  {selectedPrompt?.title}
                                </DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="max-h-[60vh]">
                                {selectedPrompt && (
                                  <div className="space-y-4">
                                    {/* Metadata */}
                                    <div className="flex items-center space-x-3 pb-3 border-b border-landing-white/20">
                                      <Badge variant="outline" className={getCategoryColor(selectedPrompt.category)}>
                                        {selectedPrompt.category}
                                      </Badge>
                                      <Badge variant="outline" className={getModeStyle(selectedPrompt.mode)}>
                                        {getModeIcon(selectedPrompt.mode)}
                                        <span className="ml-1 capitalize">{selectedPrompt.mode} Mode</span>
                                      </Badge>
                                      <div className="flex items-center text-landing-white/50 text-xs">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {formatDate(selectedPrompt.created_at)}
                                      </div>
                                    </div>
                                    
                                    {/* Original Prompt */}
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-landing-white font-medium text-sm">Original Prompt</h4>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleCopyPrompt(selectedPrompt.original, "original")}
                                          className="border-landing-white/30 text-landing-white/70 hover:bg-landing-white/10"
                                        >
                                          <Copy className="w-3 h-3 mr-1" />
                                          Copy
                                        </Button>
                                      </div>
                                      <div className="bg-landing-white/5 rounded-lg p-3 border border-landing-white/10">
                                        <p className="text-landing-white/80 text-sm leading-relaxed">
                                          {selectedPrompt.original}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {/* Enhanced Prompt */}
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-landing-blue font-medium text-sm">Enhanced Prompt</h4>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleCopyPrompt(selectedPrompt.content, "enhanced")}
                                          className="border-landing-blue/30 text-landing-blue hover:bg-landing-blue/10"
                                        >
                                          <Copy className="w-3 h-3 mr-1" />
                                          Copy
                                        </Button>
                                      </div>
                                      <div className="bg-gradient-to-br from-landing-blue/10 to-landing-blue/5 rounded-lg p-3 border border-landing-blue/20">
                                        <p className="text-landing-white text-sm leading-relaxed">
                                          {selectedPrompt.content}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-landing-white/60 hover:text-red-400 hover:bg-red-400/10"
                            onClick={() => handleDeletePrompt(prompt.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}