import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LOGO } from '@/lib/brand';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const links = [
    { to: '/features', label: 'Features' },
    { to: '/dashboard', label: 'AI Studio' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
  ];
  const isActive = (p: string) => loc.pathname === p;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center"><LOGO /></Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive(l.to) ? 'text-white bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link to="/signup"><Button size="sm">Start Creating</Button></Link>
        </div>

        <button className="md:hidden rounded-lg p-2 text-white/80 hover:bg-white/5" onClick={() => setOpen(v => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-ink-950/95 px-4 py-3 space-y-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Log in</Button></Link>
            <Link to="/signup" className="flex-1"><Button size="sm" className="w-full">Start Creating</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}