import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('glass rounded-2xl p-5 shadow-glass', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function GradientCard({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('gradient-border p-[1px]', className)} {...rest}>
      <div className="rounded-2xl bg-ink-900/80 p-5 h-full">{children}</div>
    </div>
  );
}