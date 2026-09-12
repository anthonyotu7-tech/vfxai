import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Video, UserRound, Radio, Sparkles, LayoutDashboard, Settings, CreditCard, BarChart3, FolderOpen } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const commands: Command[] = [
    { id: '1', label: 'Go to Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, action: () => navigate('/dashboard'), shortcut: '' },
    { id: '2', label: 'Create New Video', icon: <Sparkles className="h-4 w-4" />, action: () => navigate('/video-generator') },
    { id: '3', label: 'AI Avatar Studio', icon: <UserRound className="h-4 w-4" />, action: () => navigate('/avatar-studio') },
    { id: '4', label: 'Live Studio', icon: <Radio className="h-4 w-4" />, action: () => navigate('/live-studio') },
    { id: '5', label: 'My Videos', icon: <Video className="h-4 w-4" />, action: () => navigate('/videos') },
    { id: '6', label: 'Video Editor', icon: <Video className="h-4 w-4" />, action: () => navigate('/editor/demo') },
    { id: '7', label: 'Templates', icon: <FolderOpen className="h-4 w-4" />, action: () => navigate('/templates') },
    { id: '8', label: 'Credits & Billing', icon: <CreditCard className="h-4 w-4" />, action: () => navigate('/credits') },
    { id: '9', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, action: () => navigate('/analytics') },
    { id: '10', label: 'Settings', icon: <Settings className="h-4 w-4" />, action: () => navigate('/settings') },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass rounded-2xl shadow-neon overflow-hidden border border-white/10">
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <Search className="h-5 w-5 text-white/40" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">ESC</kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/50">No results found.</div>
          ) : (
            filtered.map(cmd => (
              <button
                key={cmd.id}
                onClick={() => { cmd.action(); onClose(); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-neon-purple">
                  {cmd.icon}
                </div>
                {cmd.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}