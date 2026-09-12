import { Card } from '@/components/ui/Card';
import { MOCK_AVATARS } from '@/lib/mock-data';

export default function Avatars() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Avatars</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_AVATARS.map(a => (
          <Card key={a.id} className="p-0 overflow-hidden">
            <img src={a.thumbnail_url} alt={a.name} className="aspect-square w-full object-cover" />
            <div className="p-4">
              <p className="font-semibold">{a.name}</p>
              <p className="text-xs text-white/50">{a.style} · {a.voice}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}