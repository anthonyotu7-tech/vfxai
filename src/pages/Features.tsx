import { Sparkles, Video, Wand2, Phone, Radio, Share2, Zap, Shield, Globe } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const features = [
  { icon: Sparkles, title: 'AI Avatar Studio', desc: 'Generate lifelike digital presenters with customizable voice, expression and wardrobe.' },
  { icon: Video, title: 'AI Video Generator', desc: 'Turn text prompts into cinematic videos with styles from corporate to gaming.' },
  { icon: Wand2, title: 'Real-Time AI Effects', desc: 'Apply face effects, backgrounds and stylizations to your live camera feed.' },
  { icon: Phone, title: 'AI Video Calls', desc: 'Host calls where you appear as an AI avatar — great for privacy and branding.' },
  { icon: Radio, title: 'Live Studio', desc: 'Stream with AI overlays, virtual sets and real-time scene switching.' },
  { icon: Share2, title: 'Social Video Creator', desc: 'One-click exports for TikTok, Instagram Reels, YouTube Shorts and more.' },
  { icon: Zap, title: 'Lightning Rendering', desc: 'Cloud rendering pipeline optimized for speed without sacrificing quality.' },
  { icon: Shield, title: 'Ethical by design', desc: 'Consent-first workflows. No impersonation. No deepfake misuse.' },
  { icon: Globe, title: 'Multi-language', desc: 'Generate voices and subtitles in dozens of languages.' },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-5xl font-bold">Features built for the AI video era</h1>
        <p className="mt-4 text-white/60">Every tool you need to go from idea to published video — in minutes.</p>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(f => (
          <Card key={f.title}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/10 border border-neon-purple/30">
              <f.icon className="h-5 w-5 text-neon-purple" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
            <p className="mt-1.5 text-sm text-white/60">{f.desc}</p>
          </Card>
        ))}
      </div>
      <div className="mt-14 text-center">
        <Link to="/signup"><Button size="lg">Try all features free</Button></Link>
      </div>
    </div>
  );
}