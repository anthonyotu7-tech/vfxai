import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UserRound, Video, Radio, Phone, Folder, LayoutTemplate,
  Coins, Settings, HelpCircle, LogOut, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LOGO } from '@/lib/brand';
import { cn } from '@/lib/utils';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/avatar-studio', label: 'AI Avatar Studio', icon: UserRound },
  { to: '/video-generator', label: 'AI Video Generator', icon: Sparkles },
  { to: '/live-studio', label: 'Live Studio', icon: Radio },
  { to: '/video-calls', label: 'AI Video Calls', icon: Phone },
  { to: '/videos', label: 'My Videos', icon: Folder },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/credits', label: 'Credits', icon: Coins },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const bottom = [
  { to: '#', label: 'Help', icon: HelpCircle },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signOut } = useAuth();
  const nav = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
      isActive
        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-blue/10 text-white border border-neon-purple/30'
        : 'text-white/70 hover:text-white hover:bg-white/5',
    );

  const content = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5 border-b border-white/5">
        <NavLink to="/dashboard" className="flex items-center"><LOGO /></NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map(it => (
          <NavLink key={it.to} to={it.to} onClick={onClose} className={linkClass}>
            <it.icon className="h-4 w-4" />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 px-3 py-3 space-y-1">
        {bottom.map(b => (
          <a key={b.label} href={b.to} className={linkClass({ isActive: false })}>
            <b.icon className="h-4 w-4" /><span>{b.label}</span>
          </a>
        ))}
        <button
          onClick={() => { signOut(); nav('/'); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" /><span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-white/5 bg-ink-900/60 backdrop-blur-xl h-[100dvh] sticky top-0">
        {content}
      </aside>
      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-ink-900 border-r border-white/10">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}