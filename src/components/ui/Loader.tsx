export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`h-8 w-8 rounded-full border-2 border-white/10 border-t-neon-purple animate-spin ${className}`} />
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="w-full">
      {label && <div className="mb-1 flex justify-between text-xs text-white/60"><span>{label}</span><span>{Math.round(value)}%</span></div>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}