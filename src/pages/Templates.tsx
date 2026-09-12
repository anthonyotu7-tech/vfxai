import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MOCK_TEMPLATES } from '@/lib/mock-data';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const { push } = useToast();
  const nav = useNavigate();
  const useTemplate = (id: string, title: string) => {
    push({ type: 'info', title: `Template loaded`, description: title });
    nav('/video-generator');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Templates</h1>
        <p className="mt-1 text-white/60">Start from a proven template.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_TEMPLATES.map(t => (
          <Card key={t.id} className="p-0 overflow-hidden group">
            <div className="relative aspect-video bg-ink-800">
              <img src={t.thumbnail_url} alt={t.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[11px]">{t.aspect_ratio}</div>
            </div>
            <div className="p-4">
              <p className="text-xs text-white/50">{t.category}</p>
              <p className="font-semibold mt-0.5">{t.title}</p>
              <p className="text-xs text-white/60 mt-1 line-clamp-2">{t.description}</p>
              <Button size="sm" className="mt-3 w-full" onClick={() => useTemplate(t.id, t.title)}>Use Template</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}