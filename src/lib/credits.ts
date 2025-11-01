// Server-authoritative credits system - no localStorage
import * as React from 'react';
import { supabase } from '../utils/supabase/client';

export type CreditsState = {
  credits: number;
  isLow: boolean;
  canSpend: boolean;
  isLoading: boolean;
  dailyRefresh?: {
    credits_added: number;
    refresh_type: 'initial' | 'daily' | 'none';
    days_missed?: number;
    next_refresh?: string;
  };
  spend: (amount: number, reason?: string, promptId?: string) => Promise<boolean>;
  earn: (amount: number, reason?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  manualRefresh: () => Promise<boolean>;
};

export function useCredits(): CreditsState {
  const [credits, setCredits] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [dailyRefresh, setDailyRefresh] = React.useState<any>(null);

  // Track auth state
  React.useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    
    getUser();
    
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load balance when user changes
  React.useEffect(() => {
    if (userId) {
      refresh();
    } else {
      setCredits(0);
      setIsLoading(false);
    }
  }, [userId]);

  const isLow = credits < 5;
  const canSpend = credits > 0;

  const spend = React.useCallback(async (
    amount: number = 1, 
    reason: string = 'prompt_enhancement',
    promptId?: string
  ): Promise<boolean> => {
    if (!userId) return false;
    if (amount <= 0) return true;

    try {
      const { data, error } = await supabase.rpc('spend_credits', {
        p_user_id: userId,
        p_prompt_id: promptId || null,
        p_amount: amount,
        p_reason: reason
      });

      if (error) {
        console.error('Credit spend failed:', error);
        await refresh();
        return false;
      }
      
      if (data?.success) {
        setCredits(data.balance);
        return true;
      } else {
        console.error('Credit spend failed:', data?.error);
        await refresh();
        return false;
      }
    } catch (error) {
      console.error('Credit spend error:', error);
      return false;
    }
  }, [userId]);

  const earn = React.useCallback(async (
    amount: number,
    reason: string = 'credit_bonus'
  ): Promise<boolean> => {
    if (!userId || amount <= 0) return false;

    try {
      const { data, error } = await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_reason: reason
      });

      if (error) {
        console.error('Credit earn failed:', error);
        return false;
      }
      
      if (data?.success) {
        setCredits(data.balance);
        return true;
      } else {
        console.error('Credit earn failed:', data?.error);
        return false;
      }
    } catch (error) {
      console.error('Credit earn error:', error);
      return false;
    }
  }, [userId]);

  const refresh = React.useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('get_user_balance', {
        p_user_id: userId
      });

      if (error) {
        console.error('Balance fetch failed:', error);
        setCredits(0);
        return;
      }
      
      if (data?.success) {
        setCredits(data.balance);
      } else {
        console.error('Balance fetch failed:', data?.error);
        setCredits(0);
      }
    } catch (error) {
      console.error('Balance refresh error:', error);
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const manualRefresh = React.useCallback(async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      // For now, just refresh the balance. 24-hour refresh logic is handled in the backend
      await refresh();
      return true;
    } catch (error) {
      console.error('Manual refresh error:', error);
      return false;
    }
  }, [userId, refresh]);

  return { credits, isLow, canSpend, isLoading, dailyRefresh, spend, earn, refresh, manualRefresh };
}


