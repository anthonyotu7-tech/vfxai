import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export default function Videos() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Videos</h1>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/60 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Style</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_PROJECTS.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-white/70">{p.style}</td>
                  <td className="px-4 py-3">0:{p.duration_sec.toString().padStart(2, '0')}</td>
                  <td className="px-4 py-3">{p.credits_used}</td>
                  <td className="px-4 py-3"><Badge tone={p.status === 'completed' ? 'success' : 'warning'}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}