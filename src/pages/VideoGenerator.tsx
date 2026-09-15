import { useState, useEffect } from 'react';
import { Sparkles, Play, Download, Pencil, RefreshCw, Share2, Film } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

// Safe imports with fallbacks to prevent black screen crashes
let Progress: any = () => <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-neon-purple w-1/2 animate-pulse" /></div>;
let PromptBuilder: any = () => <div className="text-white/50 text-sm p-4 border border-white/10 rounded-xl">Prompt Builder (Loading...)</div>;
let StylePresets: any = () => <div className="text-white/50 text-sm p-4 border border-white/10 rounded-xl">Style Presets (Loading...)</div>;
let GenerationQueue: any = () => null;
let DemoBadge: any = () => <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Demo</span>;

try {
  const loader = require('@/components/ui/Loader');
  if (loader.Progress) Progress = loader.Progress;
} catch (e) {}

try {
  const pb = require('@/components/ui/PromptBuilder');
  if (pb.PromptBuilder) PromptBuilder = pb.PromptBuilder;
} catch (e) {}

try {
  const sp = require('@/components/ui/StylePresets');
  if (sp.StylePresets) StylePresets = sp.StylePresets;
} catch (e) {}

try {
  const gq = require('@/components/ui/GenerationQueue');
  if (gq.GenerationQueue) GenerationQueue = gq.GenerationQueue;
} catch (e) {}

try {
  const toast = require('@/components/ui/Toast');
  if (toast.DemoBadge) DemoBadge = toast.DemoBadge;
} catch (e) {}

// Safe credits hook
const useCreditsSafe = () => {
  try {
    const creditsHook = require('@/hooks/useCredits');
    return creditsHook.useCredits ? creditsHook.useCredits() : { credits: 100, consume: () => true };
  } catch (e) {
    return { credits: 100, consume: () => true };
  }
};

// Safe AI and Mock Data
let MOCK_AVATARS: any[] = [];
try {
  const mock = require('@/lib/mock-data');
  MOCK_AVATARS = mock.MOCK_AVATARS || [];
} catch (e) {
  MOCK_AVATARS = [{ id: 'default', name: 'Default', thumbnail_url: 'https://ui-avatars.com/api/?name=AI&background=8b5cf6&color=fff' }];
}

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
  const { credits, consume } = useCreditsSafe();
  
  const [prompt, setPrompt] = useState('');
  const [avatarId, setAvatarId] = useState(MOCK_AVATARS[0]?.id || '');
  const [voice, setVoice] = useState('Female — Warm');
  const [style, setStyle] = useState('Cinematic');
  const [duration, setDuration] = useState(10);
  const [ratio, setRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [progress, setProgress] = useState<any>(null);
  const [result, setResult] = useState<{ videoUrl: string; thumbnailUrl: string } | null>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('vfxai_video_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setPrompt(draft.prompt || '');
        setStyle(draft.style || 'Cinematic');
        setDuration(draft.duration || 10);
        setRatio(draft.ratio || '16:9');
      } catch (e) { console.error('Failed to load draft:', e); }
    }
  }, []);

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
    
    setProgress({ stage: 'preparing', percent: 10, message: 'Starting generation…' });
    setResult(null);

    const newProject = {
      id: 'p_' + Math.random().toString(36).slice(2),
      title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''),
      status: 'queued',
    };
    
    setQueue(prev => [...prev, newProject]);

    try {
      // Simulate generation for now to prevent crashes if AI provider is missing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setProgress({ stage: 'complete', percent: 100, message: 'Complete!' });
      setResult({ 
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
        thumbnailUrl: 'https://ui-avatars.com/api/?name=Video&background=8b5cf6&color=fff&size=400' 
      });
      
      push({ type: 'success', title: 'Video ready', description: 'Demo generation complete.' });
      setQueue(prev => prev.filter(p => p.id !== newProject.id));
      localStorage.removeItem('vfxai_video_draft');
      
      // Deduct credits safely
      if (consume) consume(CREDIT_COST, 'video-generation');
      
    } catch (err) {
      push({ type: 'error', title: 'Generation failed', description: String(err) });
      setProgress(null);
      setQueue(prev => prev.filter(p => p.id !== newProject.id));
    }
  };

  const Chip = ({ label, active, onClick }: any) => (
    <button onClick={onClick} className={`rounded-lg border px-3 py-1.5 text-xs transition ${active ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20'}`}>
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">AI Video Generator</h1>
          <p className="mt-1 text-white/60">Turn ideas into videos with AI.</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="p-1">
          <div className="relative w-full overflow-hidden rounded-xl bg-gray-900" style={{ paddingTop: aspectRatioStyles[ratio].paddingBottom }}>
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
            <div className="mt-4 flex flex-wrap gap-2 p-2">
              <Button variant="outline" size="sm"><Play className="h-4 w-4 mr-2" /> Play</Button>
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Download</Button>
              <Button variant="outline" size="sm" onClick={generate}><RefreshCw className="h-4 w-4 mr-2" /> Regenerate</Button>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Prompt</label>
              <textarea 
                value={prompt} 
                onChange={e => { setPrompt(e.target.value); setCharCount(e.target.value.length); }} 
                rows={3} 
                placeholder="Create a cinematic product advertisement..." 
                className="w-full rounded-xl bg-gray-800/70 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 resize-none" 
              />
              <div className="mt-1 flex justify-between text-xs">
                <span className={charCount > 500 ? 'text-rose-400' : 'text-white/50'}>{charCount}/500</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Avatar</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {MOCK_AVATARS.map((a: any) => (
                  <button key={a.id} onClick={() => setAvatarId(a.id)} className={`flex-shrink-0 rounded-xl border p-1 transition ${avatarId === a.id ? 'border-neon-purple' : 'border-white/10'}`}>
                    <img src={a.thumbnail_url} alt={a.name} className="h-14 w-14 rounded-lg object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Voice</label>
              <select value={voice} onChange={e => setVoice(e.target.value)} className="w-full rounded-xl bg-gray-800/70 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-purple/50">
                {['Female — Warm', 'Female — Bright', 'Male — Deep', 'Male — Energetic'].map(v => <option key={v} className="bg-gray-900">{v}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">Duration</label>
                <div className="flex flex-wrap gap-2">{durations.map(d => <Chip key={d} label={`${d}s`} active={duration === d} onClick={() => setDuration(d)} />)}</div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">Aspect ratio</label>
                <div className="flex flex-wrap gap-2">{ratios.map(r => <Chip key={r} label={r} active={ratio === r} onClick={() => setRatio(r)} />)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-gray-800/50 px-4 py-3">
              <div><p className="text-xs text-white/60">Credit cost</p><p className="font-display text-xl font-bold text-white">{CREDIT_COST} credits</p></div>
              <p className="text-xs text-white/50">Balance: {credits}</p>
            </div>

            <Button onClick={generate} loading={!!progress && progress.stage !== 'complete'} className="w-full" size="lg">
              <Sparkles className="h-4 w-4 mr-2" /> Generate Video
            </Button>
          </Card>
          <StylePresets selected={style} onSelect={setStyle} />
        </div>
      </div>
      <PromptBuilder onSelect={handlePromptSelect} />
      <GenerationQueue queue={queue} onCancel={(id: string) => setQueue(prev => prev.filter(p => p.id !== id))} />
    </div>
  );
}
