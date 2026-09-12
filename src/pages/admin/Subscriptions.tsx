import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const subs = [
  { user: 'alex@demo.com', plan: 'Pro', status: 'active', mrr: 49 },
  { user: 'jamie@demo.com', plan: 'Creator', status: 'active', mrr: 19 },
  { user: 'taylor@demo.com', plan: 'Creator', status: 'past_due', mrr: 19 },
];

export default function Subscriptions() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Subscriptions</h1>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/60 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subs.map(s => (
                <tr key={s.user}>
                  <td className="px-4 py-3">{s.user}</td>
                  <td className="px-4 py-3 font-medium">{s.plan}</td>
                  <td className="px-4 py-3"><Badge tone={s.status === 'active' ? 'success' : 'warning'}>{s.status}</Badge></td>
                  <td className="px-4 py-3">${s.mrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}