import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const users = [
  { name: 'Alex Morgan', email: 'alex@demo.com', plan: 'Pro', status: 'active' },
  { name: 'Jamie Lee', email: 'jamie@demo.com', plan: 'Creator', status: 'active' },
  { name: 'Sam Rivera', email: 'sam@demo.com', plan: 'Free', status: 'active' },
  { name: 'Taylor Kim', email: 'taylor@demo.com', plan: 'Creator', status: 'past_due' },
];

export default function Users() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Users</h1>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/60 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.email} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-white/70">{u.email}</td>
                  <td className="px-4 py-3">{u.plan}</td>
                  <td className="px-4 py-3">
                    <Badge tone={u.status === 'active' ? 'success' : 'warning'}>{u.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}