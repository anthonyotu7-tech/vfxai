import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

const promptExamples = [
  { category: 'Product', prompt: 'Create a cinematic product advertisement for a new smartphone showcasing its sleek design and advanced camera features', style: 'Advertisement' },
  { category: 'Social', prompt: 'Create an energetic TikTok-style video introducing a new fitness app with quick cuts and dynamic transitions', style: 'Social Media' },
  { category: 'Business', prompt: 'Create a professional corporate presentation video explaining our new AI technology to investors', style: 'Corporate' },
  { category: 'Gaming', prompt: 'Create an epic gaming montage intro with fast-paced action and dramatic music', style: 'Gaming' },
  { category: 'News', prompt: 'Create a professional news anchor presentation for a weekly tech digest', style: 'News' },
];

export function PromptBuilder({ onSelect }: { onSelect: (prompt: string, style: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(promptExamples.map(p => p.category)))];
  const filtered = selectedCategory === 'All' ? promptExamples : promptExamples.filter(p => p.category === selectedCategory);

  return (
    <Card className="space-y-4 mt-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-neon-purple" />
        <h3 className="font-semibold text-white">Smart Prompt Builder</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${selectedCategory === cat ? 'bg-neon-purple/20 text-white border border-neon-purple/50' : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/20'}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((example, idx) => (
          <div key={idx} className="group relative rounded-xl border border-white/10 bg-ink-800/50 p-4 hover:border-neon-purple/40 transition">
            <p className="text-xs font-semibold text-neon-purple mb-1">{example.category}</p>
            <p className="text-sm text-white/80 line-clamp-3 mb-3">{example.prompt}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">{example.style}</span>
              <Button size="sm" variant="outline" onClick={() => onSelect(example.prompt, example.style)} className="h-7 px-2 text-xs">Use This</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}