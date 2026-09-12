import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, icon, className, ...rest }, ref) => (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-white/80">{label}</label>}
      <div className="relative">
        {icon && <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            'w-full h-11 rounded-xl bg-ink-800/70 border border-white/10 px-3 text-sm text-white placeholder:text-white/40',
            'focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/60 transition',
            icon && 'pl-10',
            error && 'border-rose-500/70',
            className,
          )}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';