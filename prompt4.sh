#!/bin/bash
set -e

echo " Setting up Prompt 4: Video Generator Deep Dive..."

# ─────────────────────────────────────────────
# 1. New Component: PromptBuilder
# ──────────────────────────────────────────────

cat > src/components/ui/PromptBuilder.tsx << 'EOF'
import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface PromptExample {
  category: string;
  prompt: string;
  style: string;
}

const promptExamples: PromptExample[] = [
  { category: 'Product', prompt: 'Create a cinematic product advertisement for a new smartphone showcasing its sleek design and advanced camera features', style: 'Advertisement' },
  { category: 'Product', prompt: 'Showcase a luxury watch with dramatic lighting and slow-motion details', style: 'Cinematic' },
  { category: 'Social', prompt: 'Create an energetic TikTok-style video introducing a new fitness app with quick cuts and dynamic transitions', style: 'Social Media' },
  { category: 'Social', prompt: 'Make an Instagram Reel showing a day in the life with smooth transitions and trending music vibes', style: 'Social Media' },
  { category: 'Business', prompt: 'Create a professional corporate presentation video explaining our new AI technology to investors', style: 'Corporate' },
  { category: 'Business', prompt: 'Design a clean explainer video about our SaaS platform features and benefits', style: 'Corporate' },
  { category: 'Gaming', prompt: 'Create an epic gaming montage intro with fast-paced action and dramatic music', style: 'Gaming' },
  { category: 'Gaming', prompt: 'Make a YouTube gaming channel intro with neon effects and energetic vibes', style: 'Gaming' },
  { category: 'News', prompt: 'Create a professional news anchor presentation for a weekly tech digest', style: 'News' },
  { category: 'News', prompt: 'Design a broadcast-style news segment about climate change innovations', style: 'News' },
];

interface Props {
  onSelect: (prompt: string, style: string) => void;
}

export function PromptBuilder({ onSelect }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(promptExamples.map(p => p.category)))];
  
  const filtered = selectedCategory === 'All' 
    ? promptExamples 
    : promptExamples.filter(p => p.category === selectedCategory);

  const copyToClipboard = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const usePrompt = (prompt: string, style: string) => {
    onSelect(prompt, style);
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-neon-purple" />
        <h3 className="font-semibold text-white">Smart Prompt Builder</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              selectedCategory === cat
                ? 'bg-neon-purple/20 text-white border border-neon-purple/50'
                : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((example, idx) => (
          <div
            key={idx}
            className="group relative rounded-xl border border-white/10 bg-ink-800/50 p-4 hover:border-neon-purple/40 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs font-semibold text-neon-purple mb-1">{example.category}</p>
                <p className="text-sm text-white/80 line-clamp-3">{example.prompt}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => copyToClipboard(example.prompt, `copy-${idx}`)}
                  className="rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/5 transition"
                  title="Copy prompt"
                >
                  {copiedId === `copy-${idx}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-white/50">{example.style}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => usePrompt(example.prompt, example.style)}
                className="h-7 px-2 text-xs"
              >
                Use This
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
EOF

# ─────────────────────────────────────────────
# 2. New Component: StylePresets
# ──────────────────────────────────────────────

cat > src/components/ui/StylePresets.tsx << 'EOF'
import { Film, Camera, Tv, Gamepad2, Megaphone, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StylePreset {
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const stylePresets: StylePreset[] = [
  { name: 'Cinematic', icon: <Film className="h-5 w-5" />, description: 'Movie-quality with dramatic lighting', color: 'from-purple-500 to-pink-500' },
  { name: 'Realistic', icon: <Camera className="h-5 w-5" />, description: 'Natural, documentary-style', color: 'from-blue-500 to-cyan-500' },
  { name: 'Social Media', icon: <Tv className="h-5 w-5" />, description: 'Trendy, fast-paced, engaging', color: 'from-pink-500 to-rose-500' },
  { name: 'Advertisement', icon: <Megaphone className="h-5 w-5" />, description: 'Professional product showcase', color: 'from-orange-500 to-red-500' },
  { name: 'Corporate', icon: <Building className="h-5 w-5" />, description: 'Clean, professional business', color: 'from-emerald-500 to-teal-500' },
  { name: 'Gaming', icon: <Gamepad2 className="h-5 w-5" />, description: 'Energetic, neon, high-contrast', color: 'from-violet-500 to-purple-500' },
];

interface Props {
  selected: string;
  onSelect: (style: string) => void;
}

export function StylePresets({ selected, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stylePresets.map((style) => (
        <button
          key={style.name}
          onClick={() => onSelect(style.name)}
          className={cn(
            'group relative overflow-hidden rounded-xl border p-4 text-left transition-all',
            selected === style.name
              ? 'border-neon-purple bg-neon-purple/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : 'border-white/10 bg-ink-800/50 hover:border-white/20 hover:bg-white/5'
          )}
        >
          <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br ${style.color} opacity-20 blur-xl group-hover:opacity-30 transition`} />
          <div className={cn(
            'mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white',
            style.color
          )}>
            {style.icon}
          </div>
          <p className="font-semibold text-white">{style.name}</p>
          <p className="mt-1 text-xs text-white/60">{style.description}</p>
        </button>
      ))}
    </div>
  );
}
EOF

# ─────────────────────────────────────────────
# 3. New Component: GenerationQueue
# ──────────────────────────────────────────────

cat > src/components/ui/GenerationQueue.tsx << 'EOF'
import { Video, X, Pause, Play } from 'lucide-react';
import { Progress } from './Loader';
import { Badge } from './Badge';
import type { VideoProject } from '@/types';

interface Props {
  queue: VideoProject[];
  onCancel: (id: string) => void;
}

export function GenerationQueue({ queue, onCancel }: Props) {
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
                  <Badge tone={project.status === 'processing' ? 'warning' : 'info'}>
                    {project.status}
                  </Badge>
                  <span className="text-xs text-white/50">{project.duration_sec}s</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onCancel(project.id)}
              className="rounded-lg p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <Progress 
              value={project.status === 'processing' ? 65 : 10} 
              label={project.status === 'processing' ? 'Generating...' : 'Queued...'} 
            />
          </div>
        </div>
      ))}
    </div>
  );
}
EOF

# ─────────────────────────────────────────────
# 4. Update VideoGenerator Page
# ──────────────────────────────────────────────

cat > src/pages/VideoGenerator.tsx << 'EOF'
import { useState, useEffect } from 'react';
import { Sparkles, Upload, Play, Download, Pencil, RefreshCw, Share2, Film } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Loader';
import { PromptBuilder } from '@/components/ui/PromptBuilder';
import { StylePresets } from '@/components/ui/StylePresets';
import { GenerationQueue } from '@/components/ui/GenerationQueue';
import { DemoBadge } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useCredits } from '@/hooks/useCredits';
import { AI, type GenerationProgress } from '@/lib/ai-provider';
import { MOCK_AVATARS } from '@/lib/mock-data';
import type { VideoProject } from '@/types';

const CREDIT_COST = 20;
const durations = [5, 10, 15, 30];
const ratios: Array<'16:9' | '9:16' | '1:1'> = ['16:9', '9:16', '1:1'];

const aspectRatioStyles = {
  '16:9': { width: '100%', paddingBottom: '56.25%' },
  '9:16': { width: '56.25%', paddingBottom: '100%' },
  '1:1': { width: '100%', paddingBottom: '100%' },
};

export default function VideoGenerator() {
  const { push } = useToast();
  const { credits, consume } = useCredits();
  
  const [prompt, setPrompt] = useState('');
  const [avatarId, setAvatarId] = useState(MOCK_AVATARS[0]?.id || '');
  const [voice, setVoice] = useState('Female — Warm');
  const [style, setStyle] = useState('Cinematic');
  const [duration, setDuration] = useState(10);
  const [ratio, setRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [result, setResult] = useState<{ videoUrl: string; thumbnailUrl: string } | null>(null);
  const [queue, setQueue] = useState<VideoProject[]>([]);
  const [charCount, setCharCount] = useState(0);

  // Load saved draft
  useEffect(() => {
    const saved = localStorage.getItem('vfxai_video_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setPrompt(draft.prompt || '');
        setStyle(draft.style || 'Cinematic');
        setDuration(draft.duration || 10);
        setRatio(draft.ratio || '16:9');
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const draft = { prompt, style, duration, ratio };
    localStorage.setItem('vfxai_video_draft', JSON.stringify(draft));
  }, [prompt, style, duration, ratio]);

  const handlePromptSelect = (selectedPrompt: string, selectedStyle: string) => {
    setPrompt(selectedPrompt);
    setStyle(selectedStyle);
    push({ type: 'success', title: 'Prompt loaded', description: 'Customize and generate when ready!' });
  };

  const generate = async () => {
    if (!prompt.trim()) { push({ type: 'error', title: 'Enter a prompt' }); return; }
    if (credits < CREDIT_COST) { push({ type: 'error', title: 'Not enough credits' }); return; }
    if (!consume(CREDIT_COST, 'video-generation')) { push({ type: 'error', title: 'Credits failed' }); return; }
    
    setProgress({ stage: 'preparing', percent: 0, message: 'Starting…' });
    setResult(null);

    // Add to queue
    const newProject: VideoProject = {
      id: 'p_' + Math.random().toString(36).slice(2),
      user_id: 'u1',
      title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''),
      prompt,
      avatarId,
      voice,
      style,
      duration_sec: duration,
      aspect_ratio: ratio,
      thumbnail_url: 'https://ui-avatars.com/api/?name=Video&background=8b5cf6&color=fff&size=400',
      status: 'queued',
      credits_used: CREDIT_COST,
      created_at: new Date().toISOString(),
    };
    
    setQueue(prev => [...prev, newProject]);

    try {
      const r = await AI.textToVideo(
        { prompt, style, durationSec: duration, aspectRatio: ratio, avatarId, voice },
        setProgress,
      );
      setResult(r);
      push({ type: 'success', title: 'Video ready', description: 'Demo generation complete.' });
      
      // Update queue
      setQueue(prev => prev.filter(p => p.id !== newProject.id));
      
      // Clear draft
      localStorage.removeItem('vfxai_video_draft');
    } catch {
      push({ type: 'error', title: 'Generation failed' });
      setProgress(null);
      setQueue(prev => prev.filter(p => p.id !== newProject.id));
    }
  };

  const cancelGeneration = (id: string) => {
    setQueue(prev => prev.filter(p => p.id !== id));
    push({ type: 'info', title: 'Generation cancelled' });
  };

  const Chip = ({ label, active, onClick }: any) => (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs transition ${
        active ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">AI Video Generator</h1>
          <p className="mt-1 text-white/60">Turn ideas into videos with AI.</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Preview */}
        <Card>
          <div className="relative w-full overflow-hidden rounded-xl bg-ink-800" style={{ paddingTop: aspectRatioStyles[ratio].paddingBottom }}>
            {result ? (
              <video src={result.videoUrl} poster={result.thumbnailUrl} controls className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <Film className="mx-auto h-12 w-12 text-white/20" />
                  <p className="mt-3 text-sm text-white/50">Your generated video will appear here</p>
                  <p className="mt-1 text-xs text-white/40">Ratio: {ratio}</p>
                </div>
              </div>
            )}
            {progress && progress.stage !== 'complete' && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <Progress value={progress.percent} label={progress.message} />
              </div>
            )}
          </div>

          {result && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline"><Play className="h-4 w-4" /> Play</Button>
              <Button variant="outline"><Download className="h-4 w-4" /> Download</Button>
              <Button variant="outline"><Pencil className="h-4 w-4" /> Edit</Button>
              <Button variant="outline" onClick={generate}><RefreshCw className="h-4 w-4" /> Regenerate</Button>
              <Button variant="outline"><Share2 className="h-4 w-4" /> Share</Button>
            </div>
          )}

          <p className="mt-3 text-xs text-white/50">
            Demo generation — connect an AI provider to generate real videos.
          </p>
        </Card>

        {/* Controls */}
        <div className="space-y-4">
          <Card className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Prompt</label>
              <textarea
                value={prompt}
                onChange={e => { setPrompt(e.target.value); setCharCount(e.target.value.length); }}
                rows={3}
                placeholder="Create a cinematic product advertisement..."
                className="w-full rounded-xl bg-ink-800/70 border border-white/10 px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 resize-none"
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className={charCount > 500 ? 'text-rose-400' : 'text-white/50'}>{charCount}/500</span>
                <span className="text-white/40">Be specific for better results</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Avatar</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {MOCK_AVATARS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAvatarId(a.id)}
                    className={`flex-shrink-0 rounded-xl border p-1 transition ${avatarId === a.id ? 'border-neon-purple' : 'border-white/10'}`}
                  >
                    <img src={a.thumbnail_url} alt={a.name} className="h-14 w-14 rounded-lg object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Voice</label>
              <select
                value={voice}
                onChange={e => setVoice(e.target.value)}
                className="w-full rounded-xl bg-ink-800/70 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
              >
                {['Female — Warm', 'Female — Bright', 'Male — Deep', 'Male — Energetic'].map(v => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">Duration</label>
                <div className="flex flex-wrap gap-2">
                  {durations.map(d => <Chip key={d} label={`${d}s`} active={duration === d} onClick={() => setDuration(d)} />)}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">Aspect ratio</label>
                <div className="flex flex-wrap gap-2">
                  {ratios.map(r => <Chip key={r} label={r} active={ratio === r} onClick={() => setRatio(r)} />)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-800/50 px-4 py-3">
              <div>
                <p className="text-xs text-white/60">Credit cost</p>
                <p className="font-display text-xl font-bold">{CREDIT_COST} credits</p>
              </div>
              <p className="text-xs text-white/50">Balance: {credits}</p>
            </div>

            <Button onClick={generate} loading={!!progress && progress.stage !== 'complete'} className="w-full" size="lg">
              <Sparkles className="h-4 w-4" /> Generate Video
            </Button>
          </Card>

          <StylePresets selected={style} onSelect={setStyle} />
        </div>
      </div>

      <PromptBuilder onSelect={handlePromptSelect} />
      <GenerationQueue queue={queue} onCancel={cancelGeneration} />
    </div>
  );
}
EOF

echo "✅ Prompt 4 setup complete!"
echo "Run 'npm run dev' to see the updates."