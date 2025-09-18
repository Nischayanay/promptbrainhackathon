// Unified credits hook with local persistence and Supabase stubs
import * as React from 'react';

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

  const isLow = credits < 5;
  const canSpend = credits > 0;

  const spend = React.useCallback((amount: number, _reason?: string) => {
    if (amount <= 0) return true;
    if (credits < amount) return false;
    const next = credits - amount;
    setCredits(next);
    saveLocal(next);
    // TODO: Supabase atomic decrement
    return true;
  }, [credits]);

  const earn = React.useCallback((amount: number, _reason?: string) => {
    if (amount <= 0) return;
    const next = credits + amount;
    setCredits(next);
    saveLocal(next);
    // TODO: Supabase increment
  }, [credits]);

  const refresh = React.useCallback(async () => {
    // TODO: fetch from Supabase when authenticated
    const local = loadLocal();
    if (local !== null) setCredits(local);
  }, []);

  return { credits, isLow, canSpend, spend, earn, refresh };
}


