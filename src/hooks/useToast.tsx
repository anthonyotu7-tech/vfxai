import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { ToastItem } from '@/types';
import { ToastContainer } from '@/components/ui/Toast';

type ToastCtx = { push: (t: Omit<ToastItem, 'id'>) => void };
const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setItems(s => [...s, { ...t, id }]);
    setTimeout(() => setItems(s => s.filter(x => x.id !== id)), 4200);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <ToastContainer items={items} onDismiss={(id) => setItems(s => s.filter(x => x.id !== id))} />
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be used within ToastProvider');
  return c;
}