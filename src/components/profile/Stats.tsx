import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendingUp, Zap, Brain, Target, Calendar, Award, Loader2, AlertCircle } from "lucide-react";
import { motion, useAnimation } from "motion/react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { getCurrentSession } from "../../utils/auth";

interface StatsProps {
  className?: string;
}

interface StatItem {
  id: string;
  label: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  suffix?: string;
}

interface UserStats {
  prompts_enhanced: number;
  credits_remaining: number;
  direct_mode_count: number;
  guided_mode_count: number;
  flow_mode_count: number;
  current_streak: number;
  efficiency_score: number;
  total_saved_prompts: number;
  account_type: string;
  most_used_mode: string;
  weekly_goal_progress: number;
}

export function Stats({ className = "" }: StatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const session = await getCurrentSession();
      if (!session.success || !session.accessToken) {
        setError("Please sign in to view your statistics");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-08c24b4c/user/stats`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user statistics');
      }

      const data = await response.json();
      if (data.success) {
        setUserStats(data.stats);
      } else {
        throw new Error(data.error || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError('Failed to load your statistics');
    } finally {
      setLoading(false);
    }
  };

  const createStatsData = (stats: UserStats): StatItem[] => [
    {
      id: "enhanced",
      label: "Prompts Enhanced",
      value: stats.prompts_enhanced,
      icon: Zap,
      color: "text-landing-blue",
      bgColor: "from-landing-blue/20 to-landing-blue/5",
      suffix: ""
    },
    {
      id: "credits",
      label: "Credits Remaining",
      value: stats.credits_remaining,
      icon: Target,
      color: "text-landing-blue", 
      bgColor: "from-landing-blue/15 to-landing-blue/5",
      suffix: ""
    },
    {
      id: "saved",
      label: "Saved Prompts",
      value: stats.total_saved_prompts,
      icon: Brain,
      color: "text-landing-blue",
      bgColor: "from-landing-blue/10 to-landing-blue/5",
      suffix: ""
    },
    {
      id: "streak",
      label: "Daily Streak",
      value: stats.current_streak,
      icon: Calendar,
      color: "text-green-400",
      bgColor: "from-green-400/20 to-green-400/5",
      suffix: " days"
    }
  ];

  const statsData = userStats ? createStatsData(userStats) : [];

  useEffect(() => {
    if (!loading && userStats && statsData.length > 0) {
      setIsVisible(true);
      
      // Initialize animated values at 0
      const initialValues: Record<string, number> = {};
      statsData.forEach(stat => {
        initialValues[stat.id] = 0;
      });
      setAnimatedValues(initialValues);

      // Start animations after component mounts
      const timer = setTimeout(() => {
        controls.start("visible");
        animateCounters();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, userStats, statsData]);

  const animateCounters = () => {
    statsData.forEach((stat, index) => {
      const duration = 2000 + (index * 100); // Stagger animations
      const steps = 60;
      const increment = stat.value / steps;
      let currentValue = 0;
      let step = 0;

      const timer = setInterval(() => {
        currentValue += increment;
        step++;

        if (step >= steps || currentValue >= stat.value) {
          currentValue = stat.value;
          clearInterval(timer);
        }

        setAnimatedValues(prev => ({
          ...prev,
          [stat.id]: Math.floor(currentValue)
        }));
      }, duration / steps);
    });
  };

  // Show loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        className={className}
      >
        <Card className="bg-landing-white/5 border-landing-white/10 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Loader2 className="w-6 h-6 text-landing-blue animate-spin" />
              <div>
                <h2 className="text-lg font-semibold text-landing-white">Loading Activity</h2>
                <p className="text-landing-white/60 text-sm">Gathering your usage statistics...</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map((i) => (
                <Card key={i} className="bg-landing-white/5 border-landing-white/10">
                  <div className="p-4 animate-pulse">
                    <div className="w-8 h-8 bg-landing-white/10 rounded-lg mb-3"></div>
                    <div className="h-6 bg-landing-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-landing-white/5 rounded"></div>
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
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        className={className}
      >
        <Card className="bg-landing-white/5 border-red-500/20 backdrop-blur-sm">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-landing-white mb-2">Statistics Unavailable</h2>
            <p className="text-landing-white/60 mb-4 text-sm">{error}</p>
            <button 
              onClick={fetchUserStats}
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
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      className={className}
    >
      <Card className="bg-landing-white/5 border-landing-white/10 backdrop-blur-sm">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-landing-blue/20 to-landing-blue/10 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ duration: 0.2 }}
            >
              <TrendingUp className="w-5 h-5 text-landing-blue" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-landing-white">Activity</h2>
              <p className="text-landing-white/60 text-sm">Your usage metrics</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              const animatedValue = animatedValues[stat.id] || 0;
              
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={controls}
                  variants={{
                    visible: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }
                    }
                  }}
                >
                  <Card className={`
                    bg-gradient-to-br ${stat.bgColor} border-landing-white/10 
                    hover:border-landing-white/20 transition-all duration-300 
                    hover:shadow-lg hover:transform hover:scale-[1.02]
                  `}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <motion.div
                          className="w-8 h-8 bg-landing-white/10 rounded-lg flex items-center justify-center"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </motion.div>
                        
                        {/* Trending indicator for key stats */}
                        {stat.id === "enhanced" && animatedValue > 0 && (
                          <Badge 
                            variant="outline" 
                            className="border-green-400/50 text-green-400 bg-green-400/10 text-xs"
                          >
                            Active
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-baseline space-x-1">
                          <motion.span
                            className={`text-2xl font-bold ${stat.color}`}
                            key={animatedValue} // Force re-render for animation
                          >
                            {animatedValue.toLocaleString()}
                          </motion.span>
                          {stat.suffix && (
                            <span className={`text-sm ${stat.color} opacity-80`}>
                              {stat.suffix}
                            </span>
                          )}
                        </div>
                        <p className="text-landing-white/70 text-xs font-medium">
                          {stat.label}
                        </p>
                      </div>

                      {/* Special visual elements for certain stats */}
                      {stat.id === "streak" && animatedValue > 7 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 2.5 }}
                          className="mt-2 flex items-center space-x-1"
                        >
                          <span className="text-xs">🔥</span>
                          <span className="text-xs text-green-400 font-medium">On Fire!</span>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}