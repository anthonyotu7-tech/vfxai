import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free', price: '$0', period: 'forever',
    features: ['3 videos / month', '720p exports', '1 AI avatar', 'Community support'],
    cta: 'Start free',
  },
  {
    name: 'Creator', price: '$19', period: '/month',
    features: ['50 videos / month', '1080p exports', '10 AI avatars', 'All templates', 'Priority rendering', 'Email support'],
    cta: 'Go Creator', highlight: true,
  },
  {
    name: 'Pro', price: '$49', period: '/month',
    features: ['Unlimited videos', '4K exports', 'Unlimited avatars', 'API access', 'Team seats', 'Dedicated support'],
    cta: 'Go Pro',
  },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-5xl font-bold">Pricing that scales with you</h1>
        <p className="mt-4 text-white/60">Start free. Upgrade when you need more.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map(p => (
          <div key={p.name} className={`relative rounded-2xl p-[1px] ${p.highlight ? 'bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink shadow-neon' : 'bg-white/10'}`}>
            <div className="h-full rounded-2xl bg-ink-900 p-8">
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className="text-sm text-white/50">{p.period}</span>
              </div>
              <ul className="mt-7 space-y-3 text-sm">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-white/80">
                    <Check className="h-4 w-4 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-8 block">
                <Button variant={p.highlight ? 'primary' : 'outline'} className="w-full" size="lg">{p.cta}</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}