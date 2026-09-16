import { useState } from 'react';
import { Check, X, CreditCard, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';

const plans = [
  { name: 'Starter', price: 19, credits: 500, features: ['500 AI Credits', '720p Export', '5 Avatars', 'Standard Support'] },
  { name: 'Pro', price: 49, credits: 1500, features: ['1500 AI Credits', '1080p Export', 'Unlimited Avatars', 'Priority Support', 'No Watermark'], popular: true },
  { name: 'Studio', price: 99, credits: 5000, features: ['5000 AI Credits', '4K Export', 'Custom Voice Cloning', 'API Access', 'Dedicated Manager'] },
];

export default function Credits() {
  const { push } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleBuy = (plan: any) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const processPayment = () => {
    setShowCheckout(false);
    push({ type: 'success', title: 'Payment successful!', description: `${selectedPlan.credits} credits added to your account.` });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold">Upgrade Your Studio</h1>
        <p className="mt-2 text-white/60">Choose a plan that fits your creative needs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map(plan => (
          <Card key={plan.name} className={`relative p-6 flex flex-col ${plan.popular ? 'border-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.2)]' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neon-purple px-3 py-1 text-xs font-bold text-white">
                MOST POPULAR
      <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-purple/30 flex flex-col sm:flex-row items-center justify-between gap-4">
     <div>
       <h3 className="text-lg font-bold text-white">Prefer manual payment?</h3>
       <p className="text-sm text-white/70">Submit a bank or crypto deposit request for manual credit approval.</p>
     </div>
     <Link to="/deposit">
       <Button variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 whitespace-nowrap">
         Manual Deposit
       </Button>
     </Link>
   </div>          
            )}
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">${plan.price}</span>
              <span className="text-white/60">/month</span>
            </div>
            <p className="mt-2 text-sm text-neon-purple font-semibold">{plan.credits} AI Credits</p>
            <ul className="mt-6 space-y-3 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                  <Check className="h-4 w-4 text-emerald-400" /> {f}
                </li>
              ))}
            </ul>
            <Button onClick={() => handleBuy(plan)} className="mt-6 w-full" variant={plan.popular ? 'default' : 'outline'}>
              Get {plan.name}
            </Button>
          </Card>
        ))}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md glass rounded-2xl p-6 border border-white/10">
            <button onClick={() => setShowCheckout(false)} className="absolute right-4 top-4 text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
            <h2 className="text-xl font-bold text-white mb-4">Checkout</h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-ink-800 p-4 flex justify-between items-center">
                <span className="text-white/80">{selectedPlan.name} Plan</span>
                <span className="font-bold text-white">${selectedPlan.price}</span>
              </div>
              <Input label="Card Number" placeholder="1234 5678 9012 3456" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry" placeholder="MM/YY" />
                <Input label="CVC" placeholder="123" />
              </div>
              <Button onClick={processPayment} className="w-full mt-4">
                <CreditCard className="h-4 w-4 mr-2" /> Pay ${selectedPlan.price}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
