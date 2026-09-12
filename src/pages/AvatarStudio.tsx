import { useState, useEffect } from 'react';
import { Upload, Sparkles, UserRound, Trash2, Star, Mic, Play, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Loader';
import { DemoBadge } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { AI, type GenerationProgress } from '@/lib/ai-provider';
import { MOCK_AVATARS } from '@/lib/mock-data';
import type { Avatar } from '@/types';

const voices = ['Female — Warm', 'Female — Bright', 'Male — Deep', 'Male — Energetic'];
const expressions = ['Friendly', 'Confident', 'Playful', 'Serious', 'Neutral'];
const clothingOptions = ['Business', 'Casual', 'Streetwear', 'Formal'];
const backgrounds = ['Studio', 'Neon City', 'Abstract', 'Office'];
const styles = ['Realistic', 'Cinematic', 'Social Media', 'Stylized'];

const bgStyles: Record<string, string> = {
  'Studio': 'bg-gradient-to-br from-gray-800 to-gray-950',
  'Neon City': 'bg-gradient-to-br from-purple-900 via-blue-900 to-black',
  'Abstract': 'bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600',
  'Office': 'bg-gradient-to-br from-slate-700 to-slate-900',
};

const clothingColors: Record<string, string> = {
  'Business': 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]',
  'Casual': 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]',
  'Streetwear': 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]',
  'Formal': 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.5)]',
};

export default function AvatarStudio() {
  const { push } = useToast();
  const [name, setName] = useState('Nova');
  const [voice, setVoice] = useState(voices[0]);
  const [expression, setExpression] = useState(expressions[0]);
  const [clothing, setClothing] = useState(clothingOptions[0]);
  const [background, setBackground] = useState(backgrounds[0]);
  const [style, setStyle] = useState(styles[0]);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [myAvatars, setMyAvatars] = useState<Avatar[]>(MOCK_AVATARS);
  const [cloning, setCloning] = useState(false);
  const [clonedVoices, setClonedVoices] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAvatars = localStorage.getItem('vfxai_avatars');
    const savedVoices = localStorage.getItem('vfxai_voices');
    
    if (savedAvatars) {
      try {
        setMyAvatars(JSON.parse(savedAvatars));
      } catch (e) {
        console.error('Failed to load avatars:', e);
      }
    }
    
    if (savedVoices) {
      try {
        setClonedVoices(JSON.parse(savedVoices));
      } catch (e) {
        console.error('Failed to load voices:', e);
      }
    }
    
    setLoaded(true);
  }, []);

  // Save avatars to localStorage whenever they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('vfxai_avatars', JSON.stringify(myAvatars));
    }
  }, [myAvatars, loaded]);

  // Save voices to localStorage whenever they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('vfxai_voices', JSON.stringify(clonedVoices));
    }
  }, [clonedVoices, loaded]);

  const generate = async () => {
    if (!name.trim()) { push({ type: 'error', title: 'Name your avatar' }); return; }
    setShowModal(true);
    setProgress({ stage: 'preparing', percent: 0, message: 'Initializing AI models...' });
    
    try {
      const res = await AI.generateAvatar(
        { name, voice, expression, clothing, background, style },
        setProgress,
      );
      
      const newAvatar: Avatar = {
        id: 'a_' + Math.random().toString(36).slice(2),
        user_id: 'u1',
        name, voice, expression, clothing, background, style,
        thumbnail_url: res.avatarUrl,
        status: 'ready',
        created_at: new Date().toISOString(),
      };
      
      setMyAvatars(prev => [newAvatar, ...prev]);
      setName('');
      
    } catch (error) {
      console.error('Generation error:', error);
      push({ type: 'error', title: 'Generation failed' });
    }
  };

  const handleCloneVoice = () => {
    setCloning(true);
    setTimeout(() => {
      setClonedVoices(prev => {
        const newVoice = `My Voice ${prev.length + 1}`;
        setVoice(newVoice);
        push({ type: 'success', title: 'Voice cloned successfully!' });
        return [...prev, newVoice];
      });
      setCloning(false);
    }, 2500);
  };

  const Select = ({ label, value, onChange, options }: any) => (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o: string) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              value === o
                ? 'border-neon-purple bg-neon-purple/15 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'border-white/10 text-white/70 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">AI Avatar Studio</h1>
          <p className="mt-1 text-white/60">Create and customize your digital presenter.</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-0 overflow-hidden">
          <div className={`relative aspect-square w-full overflow-hidden rounded-xl transition-all duration-500 ${bgStyles[background] || bgStyles['Studio']}`}>
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`flex h-48 w-48 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border-4 transition-all duration-500 ${clothingColors[clothing] || 'border-white/20'}`}>
                <UserRound className="h-24 w-24 text-white/80" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/60 backdrop-blur-md px-4 py-2 border border-white/10">
              <div>
                <p className="text-xs text-white/60">Expression</p>
                <p className="font-semibold text-white">{expression}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">Style</p>
                <p className="font-semibold text-white">{style}</p>
              </div>
            </div>
            {name && (
              <div className="absolute top-4 left-4 rounded-lg bg-neon-purple/20 border border-neon-purple/50 px-3 py-1 backdrop-blur-md">
                <p className="text-sm font-bold text-white">{name}</p>
              </div>
            )}
            {progress && progress.stage !== 'complete' && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <Progress value={progress.percent} label={progress.message} />
              </div>
            )}
          </div>

          <div className="p-4 flex flex-wrap gap-2">
            <Button variant="outline"><Upload className="h-4 w-4" /> Upload Image</Button>
            <Button variant="outline"><Upload className="h-4 w-4" /> Upload Video</Button>
            <Button onClick={generate} loading={showModal && progress?.stage !== 'complete'}>
              <Sparkles className="h-4 w-4" /> Generate Avatar
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-4">
            <Input label="Avatar Name" placeholder="e.g. Nova" value={name} onChange={e => setName(e.target.value)} />
            <Select label="Voice" value={voice} onChange={setVoice} options={voices} />
            <Select label="Expression" value={expression} onChange={setExpression} options={expressions} />
            <Select label="Clothing" value={clothing} onChange={setClothing} options={clothingOptions} />
            <Select label="Background" value={background} onChange={setBackground} options={backgrounds} />
            <Select label="Speaking Style" value={style} onChange={setStyle} options={styles} />

            <Button onClick={generate} loading={showModal && progress?.stage !== 'complete'} className="w-full" size="lg">
              <Sparkles className="h-4 w-4" /> Generate Avatar
            </Button>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-neon-purple" />
              <h3 className="font-semibold text-white">Voice Cloning</h3>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-neon-pink bg-neon-pink/10 px-2 py-0.5 rounded-full">Beta</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/20 bg-ink-900/50 p-3">
              <Upload className="h-5 w-5 text-white/40" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white/80">Upload voice sample</p>
                <p className="text-xs text-white/50">WAV or MP3, min 10 seconds</p>
              </div>
              <Button variant="outline" size="sm">Browse</Button>
            </div>
            {clonedVoices.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-white/50">Your Cloned Voices</p>
                {clonedVoices.map((v, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-ink-900 p-2 border border-white/5">
                    <div className="flex items-center gap-2">
                      <button className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-purple/20 text-neon-purple">
                        <Play className="h-3 w-3" />
                      </button>
                      <span className="text-sm text-white">{v}</span>
                    </div>
                    <span className="text-xs text-white/50">0:15</span>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={handleCloneVoice} loading={cloning} className="w-full" variant="secondary">
              {cloning ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Mic className="h-4 w-4" /> Clone Voice</>}
            </Button>
          </Card>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Your Avatars</h2>
          <span className="text-sm text-white/50">{myAvatars.length} saved</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {myAvatars.map(a => (
            <Card key={a.id} className="p-0 overflow-hidden group relative">
              <div className="aspect-square bg-ink-800">
                <img src={a.thumbnail_url} alt={a.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold truncate">{a.name}</p>
                  <button className="text-white/40 hover:text-yellow-400"><Star className="h-4 w-4" /></button>
                </div>
                <p className="text-xs text-white/50 mt-0.5">{a.style} · {a.voice}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-rose-600" onClick={() => setMyAvatars(myAvatars.filter(x => x.id !== a.id))}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg glass rounded-2xl shadow-neon overflow-hidden border border-neon-purple/30 p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neon-purple/20 text-neon-purple">
              <Sparkles className="h-10 w-10 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white">Generating Avatar</h2>
            <p className="mt-2 text-white/60">Our AI is synthesizing your digital presenter...</p>
            <div className="mt-8">
              <Progress value={progress?.percent || 0} label={progress?.message || 'Initializing...'} />
            </div>
            {progress?.stage === 'complete' && (
              <button onClick={() => { setShowModal(false); push({ type: 'success', title: 'Avatar created!' }); }} className="mt-6 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue px-6 py-2.5 font-semibold text-white hover:brightness-110 transition">
                Continue to Studio
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}