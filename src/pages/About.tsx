import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-5xl font-bold">About {BRAND.name}</h1>
      <p className="mt-6 text-lg text-white/70 leading-relaxed">
        {BRAND.name} is the AI video studio built for creators, teams and brands who refuse to
        compromise on quality. We combine generative video, AI avatars, real-time effects and
        live streaming into a single, elegant workspace.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          { t: 'Mission', d: 'Make professional video creation accessible to everyone.' },
          { t: 'Values', d: 'Speed, craft, and ethical AI — in that order.' },
          { t: 'Vision', d: 'A world where every idea becomes a video in minutes.' },
        ].map(c => (
          <div key={c.t} className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-lg">{c.t}</h3>
            <p className="mt-2 text-sm text-white/60">{c.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <Link to="/signup"><Button size="lg">Start creating</Button></Link>
      </div>
    </div>
  );
}