import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const tx = [
  { id: 'tx_1', user: 'alex@demo.com', amount: '+500', type: 'purchase', date: '2026-09-09' },
  { id: 'tx_2', user: 'jamie@demo.com', amount: '-20', type: 'video', date: '2026-09-09' },
  { id: 'tx_3', user: 'sam@demo.com', amount: '-50', type: 'avatar', date: '2026-09-08' },
  { id: 'tx_4', user: 'taylor@demo.com', amount: '+100', type: 'purchase', date: '2026-09-07' },
];

export default function Transactions() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Transactions</h1>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/60 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tx.map(t => (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                  <td className="px-4 py-3">{t.user}</td>
                  <td className={`px-4 py-3 font-semibold ${t.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{t.amount}</td>
                  <td className="px-4 py-3"><Badge>{t.type}</Badge></td>
                  <td className="px-4 py-3 text-white/60">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}