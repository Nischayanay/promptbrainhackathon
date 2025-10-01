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
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) return false;

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/credits/spend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          reason,
          prompt_id: promptId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCredits(result.balance);
        if (result.daily_refresh) {
          setDailyRefresh(result.daily_refresh);
        }
        return true;
      } else {
        console.error('Credit spend failed:', result.error);
        // Refresh balance to sync with server
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
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) return false;

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/credits/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          reason
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCredits(result.balance);
        return true;
      } else {
        console.error('Credit earn failed:', result.error);
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
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        setCredits(0);
        return;
      }

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/credits/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setCredits(result.balance);
        if (result.daily_refresh) {
          setDailyRefresh(result.daily_refresh);
        }
      } else {
        console.error('Balance fetch failed:', result.error);
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
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) return false;

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/credits/refresh`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setCredits(result.balance);
        setDailyRefresh(result);
        return true;
      } else {
        console.error('Manual refresh failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Manual refresh error:', error);
      return false;
    }
  }, [userId]);

  return { credits, isLow, canSpend, isLoading, dailyRefresh, spend, earn, refresh, manualRefresh };
}


