import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './useAuth';

type CreditsCtx = {
  credits: number;
  consume: (amount: number, reason: string) => boolean;
  add: (amount: number, reason: string) => void;
};

const Ctx = createContext<CreditsCtx | null>(null);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [credits, setCredits] = useState<Record<string, number>>({ u1: 500 });

  const current = user ? (credits[user.id] ?? 500) : 0;

  const consume = useCallback((amount: number, _reason: string) => {
    if (!user) return false;
    const cur = credits[user.id] ?? 500;
    if (cur < amount) return false;
    setCredits(s => ({ ...s, [user.id]: cur - amount }));
    return true;
  }, [credits, user]);

  const add = useCallback((amount: number, _reason: string) => {
    if (!user) return;
    setCredits(s => ({ ...s, [user.id]: (s[user.id] ?? 500) + amount }));
  }, [user]);

  const value = useMemo(() => ({ credits: current, consume, add }), [current, consume, add]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCredits() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCredits must be used within CreditsProvider');
  return c;
}