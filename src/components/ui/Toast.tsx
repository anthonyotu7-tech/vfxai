import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { ToastItem } from '@/types';
import { cn } from '@/lib/utils';

export function ToastContainer({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
      {items.map(t => (
        <div key={t.id} className="glass rounded-xl p-3 flex gap-3 shadow-neon animate-[float_.3s_ease-out]">
          <div className="mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            {t.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400" />}
            {t.type === 'info' && <Info className="h-5 w-5 text-sky-400" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{t.title}</p>
            {t.description && <p className="text-xs text-white/60 mt-0.5">{t.description}</p>}
          </div>
          <button onClick={() => onDismiss(t.id)} className="text-white/50 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-neon-pink/15 text-neon-pink border border-neon-pink/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider', className)}>
      Demo
    </span>
  );
}