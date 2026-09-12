import { Link } from 'react-router-dom';
import {
  Video, UserRound, Clock, Coins, Plus, Sparkles, Radio, Phone, Play, MoreVertical,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { DemoBadge } from '@/components/ui/Toast';

const stats = [
  { label: 'Videos Created', value: 12, icon: Video, tone: 'from-neon-purple to-neon-blue' },
  { label: 'AI Avatars', value: 4, icon: UserRound, tone: 'from-neon-blue to-neon-cyan' },
  { label: 'Minutes Generated', value: '38 min', icon: Clock, tone: 'from-neon-cyan to-neon-pink' },
  { label: 'Credits Remaining', value: 500, icon: Coins, tone: 'from-neon-pink to-neon-purple' },
];

const quick = [
  { to: '/video-generator', label: 'Create Video', icon: Sparkles },
  { to: '/avatar-studio', label: 'Create Avatar', icon: UserRound },
  { to: '/live-studio', label: 'Start Live', icon: Radio },
  { to: '/video-calls', label: 'AI Video Call', icon: Phone },
];

const statusTone = {
  completed: 'success', processing: 'warning', queued: 'info', failed: 'danger',
} as const;

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}</h1>
        <p className="mt-1 text-white/60">Create something amazing today.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.tone} opacity-20 blur-2xl`} />
            <div className="relative flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.tone}`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60">{s.label}</p>
                <p className="font-display text-2xl font-bold">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Quick actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map(q => (
            <Link key={q.to} to={q.to}>
              <Card className="group cursor-pointer hover:border-neon-purple/40 transition">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/10 border border-neon-purple/30 group-hover:from-neon-purple/30">
                    <q.icon className="h-5 w-5 text-neon-purple" />
                  </div>
                  <span className="font-medium">{q.label}</span>
                  <Plus className="ml-auto h-4 w-4 text-white/40 group-hover:text-white" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Recent projects</h2>
          <Link to="/videos" className="text-xs text-white/60 hover:text-white">View all →</Link>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_PROJECTS.map(p => (
            <Card key={p.id} className="group overflow-hidden p-0">
              <div className="relative aspect-video bg-ink-800 overflow-hidden">
                <img src={p.thumbnail_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px]">
                  <Play className="h-3 w-3" /> 0:{p.duration_sec.toString().padStart(2, '0')}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                </div>
              </div>
              <div className="p-4 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-white/50 mt-0.5">{p.created_at}</p>
                </div>
                <button className="text-white/50 hover:text-white"><MoreVertical className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-neon-pink/30 bg-neon-pink/5 px-4 py-3 text-sm text-white/80">
        <DemoBadge /> Preview data — connect Supabase to load real projects.
      </div>
    </div>
  );
}