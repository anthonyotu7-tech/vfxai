import { useEffect, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export function ConsentNotice() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('vfxai.consent')) return;
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, []);
  const accept = () => {
    localStorage.setItem('vfxai.consent', '1');
    setOpen(false);
  };
  if (!open) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[90] w-[min(680px,calc(100vw-2rem))] -translate-x-1/2">
      <div className="glass rounded-2xl p-4 shadow-neon flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-neon-purple mt-0.5 flex-shrink-0" />
        <div className="flex-1 text-sm">
          <p className="font-semibold">Ethical use & consent</p>
          <p className="text-white/70 mt-1">
            By using VFXAI you confirm that you have permission to use any images, videos or voices
            you upload. Do not impersonate real people without their explicit authorization.
          </p>
        </div>
        <button onClick={accept} className="rounded-lg bg-neon-purple px-3 py-1.5 text-xs font-semibold hover:brightness-110">
          I understand
        </button>
        <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}