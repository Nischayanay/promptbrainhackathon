import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Gift, Users, TrendingUp } from 'lucide-react';

interface CreditSystemProps {
  userId?: string;
  onCreditsUpdate?: (credits: number) => void;
}

interface CreditTransaction {
  id: string;
  type: 'earn' | 'spend' | 'bonus';
  amount: number;
  description: string;
  timestamp: Date;
}

export function CreditSystem({ userId, onCreditsUpdate }: CreditSystemProps) {
  const [credits, setCredits] = useState(50); // Starting with 50 free credits
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [showEarnModal, setShowEarnModal] = useState(false);
  const [dailyLoginStreak, setDailyLoginStreak] = useState(1);
  const [lastLoginDate, setLastLoginDate] = useState<Date | null>(null);

  // Initialize user with 50 free credits
  useEffect(() => {
    if (userId && !lastLoginDate) {
      const today = new Date();
      setLastLoginDate(today);
      addTransaction({
        id: `welcome-${Date.now()}`,
        type: 'bonus',
        amount: 50,
        description: 'Welcome bonus - Free credits to get started!',
        timestamp: today
      });
    }
  }, [userId, lastLoginDate]);

  // Daily login bonus check
  useEffect(() => {
    if (userId && lastLoginDate) {
      const today = new Date();
      const timeDiff = today.getTime() - lastLoginDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - increase streak
        const newStreak = dailyLoginStreak + 1;
        setDailyLoginStreak(newStreak);
        const bonusCredits = Math.min(newStreak * 2, 20); // Max 20 credits per day
        
        earnCredits(bonusCredits, `Daily login bonus (${newStreak} day streak)`);
        setLastLoginDate(today);
      } else if (daysDiff > 1) {
        // Streak broken - reset to 1
        setDailyLoginStreak(1);
        earnCredits(5, 'Daily login bonus');
        setLastLoginDate(today);
      }
    }
  }, [userId]);

  const addTransaction = (transaction: CreditTransaction) => {
    setTransactions(prev => [transaction, ...prev.slice(0, 9)]); // Keep last 10 transactions
  };

  const earnCredits = (amount: number, description: string) => {
    const newCredits = credits + amount;
    setCredits(newCredits);
    onCreditsUpdate?.(newCredits);
    
    addTransaction({
      id: `earn-${Date.now()}`,
      type: 'earn',
      amount,
      description,
      timestamp: new Date()
    });

    // Show celebration animation for earning credits
    if (amount >= 10) {
      setShowEarnModal(true);
      setTimeout(() => setShowEarnModal(false), 3000);
    }
  };

  const spendCredits = (amount: number, description: string): boolean => {
    if (credits >= amount) {
      const newCredits = credits - amount;
      setCredits(newCredits);
      onCreditsUpdate?.(newCredits);
      
      addTransaction({
        id: `spend-${Date.now()}`,
        type: 'spend',
        amount: -amount,
        description,
        timestamp: new Date()
      });
      
      return true;
    }
    return false;
  };

  const getProgressToNextBonus = () => {
    const usedCredits = 50 - credits + transactions
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const nextBonusAt = Math.ceil((usedCredits + 1) / 5) * 5;
    const progress = ((usedCredits % 5) / 5) * 100;
    
    return { progress, nextBonusAt, remaining: nextBonusAt - usedCredits };
  };

  const { progress, remaining } = getProgressToNextBonus();

  return (
    <div className="credit-system">
      {/* Credits Display */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-royal-gold/10 to-cyan-glow/10 border border-royal-gold/20 rounded-full">
        <Zap className="w-4 h-4 text-royal-gold" />
        <span className="font-semibold text-marble-white">{credits}</span>
        <span className="text-sm text-marble-white/70">credits</span>
      </div>

      {/* Progress to Next Bonus */}
      {remaining > 0 && (
        <div className="mt-2 text-xs text-marble-white/60">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>{remaining} uses until bonus</span>
          </div>
          <div className="w-full bg-temple-dark rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-royal-gold to-cyan-glow rounded-full h-1 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Earn Credits Modal */}
      <AnimatePresence>
        {showEarnModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-temple-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-temple-dark border border-royal-gold/30 rounded-2xl p-8 text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="w-16 h-16 bg-gradient-to-br from-royal-gold to-cyan-glow rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Gift className="w-8 h-8 text-temple-black" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-royal-gold mb-2">Bonus Credits Earned!</h3>
              <p className="text-marble-white/80 text-sm">
                Keep using PromptBrain to unlock more rewards
              </p>
              
              <button
                onClick={() => setShowEarnModal(false)}
                className="mt-4 px-6 py-2 bg-royal-gold text-temple-black rounded-full font-medium hover:bg-royal-gold/90 transition-colors"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Low Credits Warning */}
      {credits < 5 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-soft-red/10 border border-soft-red/30 rounded-lg"
        >
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-soft-red" />
            <span className="text-soft-red font-medium">Low on credits!</span>
          </div>
          <p className="text-xs text-marble-white/70 mt-1">
            Invite friends or use the app daily to earn more
          </p>
          
          <button
            onClick={() => earnCredits(10, 'Share bonus')}
            className="mt-2 flex items-center gap-2 px-3 py-1 bg-royal-gold/20 border border-royal-gold/40 rounded-full text-xs text-royal-gold hover:bg-royal-gold/30 transition-colors"
          >
            <Users className="w-3 h-3" />
            Share & Earn 10 Credits
          </button>
        </motion.div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="mt-4 text-xs">
          <h4 className="text-marble-white/60 mb-2">Recent Activity</h4>
          <div className="space-y-1">
            {transactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <span className="text-marble-white/50 truncate flex-1">
                  {transaction.description}
                </span>
                <span className={`font-medium ml-2 ${
                  transaction.amount > 0 ? 'text-success-green' : 'text-soft-red'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for using the credit system
export function useCreditSystem(userId?: string) {
  const [credits, setCredits] = useState(50);

  const spendCredits = (amount: number, description: string): boolean => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      return true;
    }
    return false;
  };

  const earnCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  return {
    credits,
    spendCredits,
    earnCredits,
    hasCredits: credits > 0,
    isLowOnCredits: credits < 5
  };
}