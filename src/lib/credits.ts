// Unified credits hook with local persistence and Supabase stubs
import * as React from 'react';
import { supabase } from '../utils/supabase/client';

export type CreditsState = {
  credits: number;
  isLow: boolean;
  canSpend: boolean;
  spend: (amount: number, reason?: string) => boolean;
  earn: (amount: number, reason?: string) => void;
  refresh: () => Promise<void>;
};

const STORAGE_KEY = 'pbm_credits_v1';

function loadLocal(): number | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function saveLocal(value: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {}
}

export function useCredits(initial = 50): CreditsState {
  const [credits, setCredits] = React.useState<number>(() => loadLocal() ?? initial);
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // detect auth user
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id ?? null;
      setUserId(id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUserId(s?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isLow = credits < 5;
  const canSpend = credits > 0;

  const spend = React.useCallback((amount: number, _reason?: string) => {
    if (amount <= 0) return true;
    if (credits < amount) return false;
    const next = credits - amount;
    setCredits(next);
    saveLocal(next);
    // Supabase atomic decrement (best-effort)
    if (userId) {
      supabase.rpc('deduct_credits', { user_uuid: userId }).catch(() => {});
    }
    return true;
  }, [credits]);

  const earn = React.useCallback((amount: number, _reason?: string) => {
    if (amount <= 0) return;
    const next = credits + amount;
    setCredits(next);
    saveLocal(next);
    // Supabase increment (best-effort)
    if (userId) {
      // no RPC defined; write directly to table via upsert pattern
      supabase
        .from('user_credits')
        .upsert({ user_id: userId, credits_remaining: next }, { onConflict: 'user_id' })
        .catch(() => {});
    }
  }, [credits]);

  const refresh = React.useCallback(async () => {
    if (userId) {
      const { data } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .maybeSingle();
      if (typeof data?.credits_remaining === 'number') {
        setCredits(data.credits_remaining);
        saveLocal(data.credits_remaining);
        return;
      }
    }
    const local = loadLocal();
    if (local !== null) setCredits(local);
  }, [userId]);

  return { credits, isLow, canSpend, spend, earn, refresh };
}


