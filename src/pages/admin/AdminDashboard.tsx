import { Users, UserCheck, Video, UserRound, Coins, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const stats = [
  { label: 'Total Users', value: '1,284', icon: Users, tone: 'from-neon-purple to-neon-blue' },
  { label: 'Active Users', value: '412', icon: UserCheck, tone: 'from-neon-blue to-neon-cyan' },
  { label: 'Videos Generated', value: '9,842', icon: Video, tone: 'from-neon-cyan to-neon-pink' },
  { label: 'Avatars Created', value: '3,107', icon: UserRound, tone: 'from-neon-pink to-neon-purple' },
  { label: 'Credits Used', value: '128K', icon: Coins, tone: 'from-neon-purple to-neon-pink' },
  { label: 'Revenue', value: '$24,580', icon: DollarSign, tone: 'from-emerald-400 to-neon-cyan' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Admin Overview</h1>
        <p className="mt-1 text-white/60">Platform-wide metrics.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(s => (
          <Card key={s.label} className="relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.tone} opacity-20 blur-2xl`} />
            <div className="relative flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.tone}`}>
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
      <Card>
        <h3 className="font-semibold">Recent activity</h3>
        <ul className="mt-3 divide-y divide-white/5 text-sm">
          {[
            'New user: alex@demo.com',
            'Video generated: "Product Advertisement"',
            'Avatar created: "Nova v2"',
            'Subscription upgraded: Creator → Pro',
          ].map((a, i) => (
            <li key={i} className="py-2.5 text-white/70">{a}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}