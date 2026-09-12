import { Card } from '@/components/ui/Card';
import { Eye, Clock, TrendingUp, Users } from 'lucide-react';

const stats = [
  { label: 'Total Views', value: '124,592', change: '+12%', icon: Eye, color: 'text-neon-purple' },
  { label: 'Watch Time', value: '8,420 hrs', change: '+5%', icon: Clock, color: 'text-neon-blue' },
  { label: 'Engagement', value: '68.4%', change: '+2.1%', icon: TrendingUp, color: 'text-neon-pink' },
  { label: 'New Followers', value: '3,201', change: '+18%', icon: Users, color: 'text-emerald-400' },
];

// Mock data for chart
const chartData = [40, 65, 45, 80, 55, 90, 70];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Analytics() {
  const maxVal = Math.max(...chartData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics Dashboard</h1>
        <p className="mt-1 text-white/60">Track your content performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-white/60 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Views Over Last 7 Days</h3>
        <div className="flex items-end justify-between h-64 gap-4">
          {chartData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full relative flex items-end h-full">
                <div 
                  className="w-full bg-gradient-to-t from-neon-purple to-neon-blue rounded-t-lg transition-all duration-500 group-hover:opacity-80"
                  style={{ height: `${(val / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-xs text-white/60">{days[i]}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}