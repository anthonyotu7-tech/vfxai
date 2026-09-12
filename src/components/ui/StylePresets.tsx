import { Film, Camera, Tv, Gamepad2, Megaphone, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

const stylePresets = [
  { name: 'Cinematic', icon: <Film className="h-5 w-5" />, description: 'Movie-quality with dramatic lighting', color: 'from-purple-500 to-pink-500' },
  { name: 'Realistic', icon: <Camera className="h-5 w-5" />, description: 'Natural, documentary-style', color: 'from-blue-500 to-cyan-500' },
  { name: 'Social Media', icon: <Tv className="h-5 w-5" />, description: 'Trendy, fast-paced, engaging', color: 'from-pink-500 to-rose-500' },
  { name: 'Advertisement', icon: <Megaphone className="h-5 w-5" />, description: 'Professional product showcase', color: 'from-orange-500 to-red-500' },
  { name: 'Corporate', icon: <Building className="h-5 w-5" />, description: 'Clean, professional business', color: 'from-emerald-500 to-teal-500' },
  { name: 'Gaming', icon: <Gamepad2 className="h-5 w-5" />, description: 'Energetic, neon, high-contrast', color: 'from-violet-500 to-purple-500' },
];

export function StylePresets({ selected, onSelect }: { selected: string; onSelect: (style: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stylePresets.map((style) => (
        <button key={style.name} onClick={() => onSelect(style.name)}
          className={cn('group relative overflow-hidden rounded-xl border p-4 text-left transition-all', selected === style.name ? 'border-neon-purple bg-neon-purple/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-white/10 bg-ink-800/50 hover:border-white/20 hover:bg-white/5')}>
          <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br ${style.color} opacity-20 blur-xl group-hover:opacity-30 transition`} />
          <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white', style.color)}>{style.icon}</div>
          <p className="font-semibold text-white">{style.name}</p>
          <p className="mt-1 text-xs text-white/60">{style.description}</p>
        </button>
      ))}
    </div>
  );
}