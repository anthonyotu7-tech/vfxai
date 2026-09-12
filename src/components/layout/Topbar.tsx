import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-ink-950/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search videos, avatars, templates..."
            className="w-64 rounded-xl border border-white/10 bg-ink-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-neon-purple/50 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 md:w-96"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-neon-pink" />
        </button>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-900/50 py-1.5 pl-1.5 pr-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink text-xs font-bold text-white">
            {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.full_name || 'Demo User'}</p>
            <p className="text-xs text-white/50">{user?.email || 'user@vfxai.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}