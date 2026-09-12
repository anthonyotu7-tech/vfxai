import { Link } from 'react-router-dom';
import {
  Sparkles, Video, Wand2, Phone, Radio, Share2,
  Check, ArrowRight, Zap, Play,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BRAND } from '@/lib/brand';

const features = [
  { icon: Sparkles, title: 'AI Avatar Studio', desc: 'Create and customize AI-powered digital avatars.' },
  { icon: Video, title: 'AI Video Generator', desc: 'Turn ideas and prompts into engaging videos.' },
  { icon: Wand2, title: 'Real-Time AI Effects', desc: 'Transform your live camera experience with AI-powered effects.' },
  { icon: Phone, title: 'AI Video Calls', desc: 'Create interactive video experiences with AI avatars.' },
  { icon: Radio, title: 'Live Studio', desc: 'Prepare your AI-powered live streaming workspace.' },
  { icon: Share2, title: 'Social Video Creator', desc: 'Create content optimized for TikTok, Instagram, YouTube and more.' },
];

const steps = [
  { n: '01', t: 'Choose your AI tool', d: 'Pick from avatars, video generation, live effects or calls.' },
  { n: '02', t: 'Create or upload your content', d: 'Use a prompt, image or video as your starting point.' },
  { n: '03', t: 'Customize your video', d: 'Adjust style, voice, avatar and aspect ratio.' },
  { n: '04', t: 'Generate and share', d: 'Render in the cloud and publish everywhere.' },
];

const socials = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'X'];

const plans = [
  { name: 'Free', price: '$0', features: ['3 videos / month', '720p exports', 'Community support'], cta: 'Start free' },
  { name: 'Creator', price: '$19', features: ['50 videos / month', '1080p exports', 'Priority rendering', 'All templates'], cta: 'Go Creator', highlight: true },
  { name: 'Pro', price: '$49', features: ['Unlimited videos', '4K exports', 'API access', 'Dedicated support'], cta: 'Go Pro' },
];

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-x-0 top-0 h-[500px] bg-radial-glow" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1 text-xs font-medium text-neon-purple">
              <Zap className="h-3.5 w-3.5" /> AI-native video studio
            </div>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Create. <span className="neon-text">Transform.</span><br />Imagine.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Create professional videos with AI avatars, generative video tools and real-time visual
              effects — all in one powerful studio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg">Start Creating <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/features"><Button size="lg" variant="outline">Explore Features</Button></Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> Free plan available</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> Cancel anytime</span>
            </div>
          </div>

          {/* Hero preview */}
          <div className="relative">
            <div className="gradient-border aspect-video overflow-hidden">
              <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-ink-800 to-ink-950 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-6 rounded-full bg-neon-purple/30 blur-2xl animate-pulse-slow" />
                    <button className="relative h-20 w-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-neon hover:scale-105 transition">
                      <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/40 backdrop-blur px-3 py-2 text-xs">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Live preview</span>
                  <span className="text-white/60">00:12 / 00:30</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:block">
              <Card className="w-56">
                <p className="text-xs text-white/60">Generating</p>
                <p className="mt-1 font-semibold">Cinematic product ad</p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-neon-purple to-neon-pink" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Your AI Video Studio</h2>
          <p className="mt-4 text-white/60">Everything you need to create, transform and ship video at the speed of thought.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(f => (
            <Card key={f.title} className="group hover:border-neon-purple/40 transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/10 border border-neon-purple/30">
                <f.icon className="h-5 w-5 text-neon-purple" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-white/60">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center">How it works</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative glass rounded-2xl p-6">
              <div className="font-display text-5xl font-bold neon-text">{s.n}</div>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-white/60">{s.d}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Create once. Share everywhere.</h2>
          <p className="mt-4 text-white/60">Optimized exports for every major platform.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {socials.map(s => (
            <div key={s} className="glass rounded-2xl p-5 text-center hover:border-neon-purple/40 transition">
              <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-neon-purple/30 to-neon-pink/20 flex items-center justify-center text-xl font-bold">
                {s[0]}
              </div>
              <p className="mt-3 text-sm font-medium">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-white/60">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map(p => (
            <div key={p.name} className={`relative rounded-2xl p-[1px] ${p.highlight ? 'bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink' : 'bg-white/10'}`}>
              <div className="h-full rounded-2xl bg-ink-900 p-7">
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">{p.price}</span>
                  <span className="text-sm text-white/50">/month</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-white/80">
                      <Check className="h-4 w-4 text-emerald-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="mt-7 block">
                  <Button variant={p.highlight ? 'primary' : 'outline'} className="w-full">{p.cta}</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-neon-purple/30 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-10 sm:p-16 text-center">
          <div className="absolute inset-0 bg-radial-glow opacity-60" />
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-5xl font-bold">Ready to create with AI?</h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">
              Join thousands of creators shipping better video, faster.
            </p>
            <Link to="/signup"><Button size="lg" className="mt-8">Start Creating <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}