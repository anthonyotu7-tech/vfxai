import { Video, X } from 'lucide-react';
import { Progress } from './Loader';
import { Badge } from './Badge';
import type { VideoProject } from '@/types';

export function GenerationQueue({ queue, onCancel }: { queue: VideoProject[]; onCancel: (id: string) => void }) {
  const activeQueue = queue.filter(p => p.status === 'processing' || p.status === 'queued');
  if (activeQueue.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-full max-w-md space-y-2">
      <h3 className="text-sm font-semibold text-white mb-2">Generation Queue ({activeQueue.length})</h3>
      {activeQueue.map((project) => (
        <div key={project.id} className="glass rounded-xl p-4 border border-white/10 shadow-neon">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-purple/20 text-neon-purple">
                <Video className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{project.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge tone={project.status === 'processing' ? 'warning' : 'info'}>{project.status}</Badge>
                  <span className="text-xs text-white/50">{project.duration_sec}s</span>
                </div>
              </div>
            </div>
            <button onClick={() => onCancel(project.id)} className="rounded-lg p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <Progress value={project.status === 'processing' ? 65 : 10} label={project.status === 'processing' ? 'Generating...' : 'Queued...'} />
          </div>
        </div>
      ))}
    </div>
  );
}