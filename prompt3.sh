#!/bin/bash
set -e

echo "🎬 Setting up Prompt 3: Avatar Studio Deep Dive..."

# ─────────────────────────────────────────────
# 1. New Component: AvatarPreview (Real-time visual updates)
# ──────────────────────────────────────────────

cat > src/components/ui/AvatarPreview.tsx << 'EOF'
import { UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  background: string;
  clothing: string;
  expression: string;
  style: string;
  sourceUrl?: string;
}

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

export function AvatarPreview({ name, background, clothing, expression, style, sourceUrl }: Props) {
  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-xl transition-all duration-500", bgStyles[background] || bgStyles['Studio'])}>
      {/* Grid overlay for tech feel */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Avatar Image / Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        {sourceUrl ? (
          <img src={sourceUrl} alt={name} className={cn("h-4/5 w-4/5 rounded-full object-cover border-4 transition-all duration-500", clothingColors[clothing] || 'border-white/20')} />
        ) : (
          <div className={cn("flex h-48 w-48 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border-4 transition-all duration-500", clothingColors[clothing] || 'border-white/20')}>
            <UserRound className="h-24 w-24 text-white/80" />
          </div>
        )}
      </div>

      {/* Expression Indicator */}
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

      {/* Name Tag */}
      {name && (
        <div className="absolute top-4 left-4 rounded-lg bg-neon-purple/20 border border-neon-purple/50 px-3 py-1 backdrop-blur-md">
          <p className="text-sm font-bold text-white">{name}</p>
        </div>
      )}
    </div>
  );
}
EOF

# ─────────────────────────────────────────────
# 2. New Component: VoiceCloner
# ──────────────────────────────────────────────

cat > src/components/ui/VoiceCloner.tsx << 'EOF'
import { useState } from 'react';
import { Mic, Upload, Play, Trash2, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '@/hooks/useToast';

interface ClonedVoice {
  id: string;
  name: string;
  duration: string;
}

export function VoiceCloner({ onVoiceCloned }: { onVoiceCloned: (name: string) => void }) {
  const { push } = useToast();
  const [cloning, setCloning] = useState(false);
  const [voices, setVoices] = useState<ClonedVoice[]>([]);

  const handleClone = () => {
    setCloning(true);
    setTimeout(() => {
      const newVoice: ClonedVoice = {
        id: Math.random().toString(36).slice(2),
        name: `My Voice ${voices.length + 1}`,
        duration: '0:15',
      };
      setVoices([...voices, newVoice]);
      onVoiceCloned(newVoice.name);
      push({ type: 'success', title: 'Voice cloned successfully!' });
      setCloning(false);
    }, 2500);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-ink-800/50 p-4 space-y-4">
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

      {voices.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-white/50">Your Cloned Voices</p>
          {voices.map(v => (
            <div key={v.id} className="flex items-center justify-between rounded-lg bg-ink-900 p-2 border border-white/5">
              <div className="flex items-center gap-2">
                <button className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30">
                  <Play className="h-3 w-3" />
                </button>
                <span className="text-sm text-white">{v.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">{v.duration}</span>
                <button onClick={() => setVoices(voices.filter(x => x.id !== v.id))} className="text-white/40 hover:text-rose-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleClone} loading={cloning} className="w-full" variant="secondary">
        {cloning ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing voice patterns...</> : <><Mic className="h-4 w-4" /> Clone Voice</>}
      </Button>
    </div>
  );
}
EOF

# ─────────────────────────────────────────────
# 3. New Component: GenerationModal
# ──────────────────────────────────────────────

cat > src/components/ui/GenerationModal.tsx << 'EOF'
import { useEffect, useState } from 'react';
import { X, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { Progress } from './Loader';
import type { GenerationProgress } from '@/lib/ai-provider';

interface Props {
  open: boolean;
  onClose: () => void;
  progress: GenerationProgress | null;
  onComplete: () => void;
}

export function GenerationModal({ open, onClose, progress, onComplete }: Props) {
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (progress?.stage === 'complete') {
      const t = setTimeout(() => setShowComplete(true), 500);
      return () => clearTimeout(t);
    } else {
      setShowComplete(false);
    }
  }, [progress]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg glass rounded-2xl shadow-neon overflow-hidden border border-neon-purple/30">
        <button onClick={onClose} className="absolute right-4 top-4 text-white/50 hover:text-white z-10">
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 text-center">
          {showComplete ? (
            <>
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 animate-[float_3s_ease-in-out_infinite]">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Avatar Created!</h2>
              <p className="mt-2 text-white/60">Your new digital presenter is ready to use.</p>
              <button onClick={onComplete} className="mt-6 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue px-6 py-2.5 font-semibold text-white hover:brightness-110 transition">
                Continue to Studio
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neon-purple/20 text-neon-purple">
                <Sparkles className="h-10 w-10 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white">Generating Avatar</h2>
              <p className="mt-2 text-white/60">Our AI is synthesizing your digital presenter...</p>
              
              <div className="mt-8">
                <Progress value={progress?.percent || 0} label={progress?.message || 'Initializing...'} />
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Do not close this window</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
EOF

# ─────────────────────────────────────────────
# 4. Overwrite AvatarStudio Page
# ──────────────────────────────────────────────

cat > src/pages/AvatarStudio.tsx << 'EOF'
import { useState } from 'react';
import { Upload, Sparkles, UserRound, Trash2, Star, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { AvatarPreview } from '@/components/ui/AvatarPreview';
import { VoiceCloner } from '@/components/ui/VoiceCloner';
import { GenerationModal } from '@/components/ui/GenerationModal';
import { DemoBadge } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { AI, type GenerationProgress } from '@/lib/ai-provider';
import { MOCK_AVATARS } from '@/lib/mock-data';
import type { Avatar } from '@/types';

const voices = ['Female — Warm', 'Female — Bright', 'Male — Deep', 'Male — Energetic'];
const expressions = ['Friendly', 'Confident', 'Playful', 'Serious', 'Neutral'];
const clothing = ['Business', 'Casual', 'Streetwear', 'Formal'];
const backgrounds = ['Studio', 'Neon City', 'Abstract', 'Office'];
const styles = ['Realistic', 'Cinematic', 'Social Media', 'Stylized'];

export default function AvatarStudio() {
  const { push } = useToast();
  const [name, setName] = useState('Nova');
  const [voice, setVoice] = useState(voices[0]);
  const [expression, setExpression] = useState(expressions[0]);
  const [clothing, setClothing] = useState(clothing[0]);
  const [background, setBackground] = useState(backgrounds[0]);
  const [style, setStyle] = useState(styles[0]);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [myAvatars, setMyAvatars] = useState<Avatar[]>(MOCK_AVATARS);

  const handleFileSelect = (file: File) => {
    setSourceFile(file);
    setSourceUrl(URL.createObjectURL(file));
  };

  const generate = async () => {
    if (!name.trim()) { push({ type: 'error', title: 'Please name your avatar' }); return; }
    setShowModal(true);
    setProgress({ stage: 'preparing', percent: 0, message: 'Initializing AI models...' });
    
    try {
      const res = await AI.generateAvatar(
        { name, voice, expression, clothing, background, style, sourceImage: sourceFile || undefined },
        setProgress
      );
      // In a real app, we'd save to DB here. For demo, we add to local state.
      const newAvatar: Avatar = {
        id: 'a_' + Math.random().toString(36).slice(2),
        user_id: 'u1',
        name, voice, expression, clothing, background, style,
        thumbnail_url: res.avatarUrl,
        status: 'ready',
        created_at: new Date().toISOString(),
      };
      setMyAvatars([newAvatar, ...myAvatars]);
    } catch {
      push({ type: 'error', title: 'Generation failed' });
    }
  };

  const handleModalComplete = () => {
    setShowModal(false);
    push({ type: 'success', title: 'Avatar added to your gallery!' });
  };

  const SelectChip = ({ label, value, onChange, options }: any) => (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">{label}</label>
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
        {/* Left: Preview & Upload */}
        <div className="space-y-6">
          <Card className="p-0 overflow-hidden">
            <AvatarPreview 
              name={name} 
              background={background} 
              clothing={clothing} 
              expression={expression} 
              style={style} 
              sourceUrl={sourceUrl || undefined} 
            />
          </Card>

          <Card>
            <h3 className="mb-3 font-semibold text-white">Source Material</h3>
            <FileUpload 
              onFileSelect={handleFileSelect} 
              accept="image/*" 
              label="Upload reference image (optional)" 
            />
            <p className="mt-2 text-xs text-white/50">
              For best results, use a clear, front-facing photo with good lighting.
            </p>
          </Card>
        </div>

        {/* Right: Settings & Controls */}
        <div className="space-y-6">
          <Card className="space-y-5">
            <Input label="Avatar Name" placeholder="e.g. Nova" value={name} onChange={e => setName(e.target.value)} />
            <SelectChip label="Voice" value={voice} onChange={setVoice} options={voices} />
            <SelectChip label="Expression" value={expression} onChange={setExpression} options={expressions} />
            <SelectChip label="Clothing" value={clothing} onChange={setClothing} options={clothing} />
            <SelectChip label="Background" value={background} onChange={setBackground} options={backgrounds} />
            <SelectChip label="Speaking Style" value={style} onChange={setStyle} options={styles} />

            <Button onClick={generate} className="w-full mt-4" size="lg">
              <Sparkles className="h-4 w-4" /> Generate Avatar
            </Button>
          </Card>

          <VoiceCloner onVoiceCloned={(v) => {
            setVoice(v);
            push({ type: 'info', title: 'Voice selected', description: v });
          }} />
        </div>
      </div>

      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Your Avatars</h2>
          <span className="text-sm text-white/50">{myAvatars.length} saved</span>
        </div>
        
        {myAvatars.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <UserRound className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-3 text-white/60">No avatars yet. Generate your first one above!</p>
          </div>
        ) : (
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
        )}
      </div>

      <GenerationModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        progress={progress} 
        onComplete={handleModalComplete} 
      />
    </div>
  );
}
EOF

echo "✅ Prompt 3 setup complete!"
echo "Run 'npm run dev' to see the updates."