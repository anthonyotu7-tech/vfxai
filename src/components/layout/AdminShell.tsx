import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Video, UserRound, Coins, Receipt, CreditCard, Settings, LogOut, Shield,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LOGO } from '@/lib/brand';
import { cn } from '@/lib/utils';

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/videos', label: 'Videos', icon: Video },
  { to: '/admin/avatars', label: 'Avatars', icon: UserRound },
  { to: '/admin/credits', label: 'Credits', icon: Coins },
  { to: '/admin/transactions', label: 'Transactions', icon: Receipt },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell() {
  const { signOut } = useAuth();
  const nav = useNavigate();
  { icon: DollarSign, label: 'Deposits', path: '/admin/deposit-requests' }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
      isActive
        ? 'bg-gradient-to-r from-neon-pink/20 to-neon-purple/10 text-white border border-neon-pink/30'
        : 'text-white/70 hover:text-white hover:bg-white/5',
    );

  return (
    <div className="flex min-h-[100dvh]">
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-white/5 bg-ink-900/60 backdrop-blur-xl h-[100dvh] sticky top-0">
        <div className="px-5 py-5 border-b border-white/5 flex items-center gap-2">
          <LOGO />
          <Shield className="h-4 w-4 text-neon-pink" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-neon-pink">Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map(it => (
            <NavLink key={it.to} to={it.to} end={'end' in it ? (it as any).end : false} className={linkClass}>
              <it.icon className="h-4 w-4" /><span>{it.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/5 px-3 py-3">
          <NavLink to="/dashboard" className={linkClass({ isActive: false })}>
            <LayoutDashboard className="h-4 w-4" /><span>Exit Admin</span>
          </NavLink>
          <button
            onClick={() => { signOut(); nav('/'); }}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" /><span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-ink-950/70 px-6 backdrop-blur-xl">
          <Shield className="h-5 w-5 text-neon-pink" />
          <h1 className="text-sm font-semibold">Admin Console</h1>
          <span className="ml-auto text-xs text-white/50">Demo data</span>
        </header>
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
}
