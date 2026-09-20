import { useState, useEffect } from 'react';
import { CreditCard, Check, Sparkles, Zap, Crown, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/lib/supabase';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    credits: 500,
    icon: Zap,
    features: ['500 Credits', 'HD Video Generation', 'Basic Avatars', 'Email Support'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    credits: 1500,
    icon: Sparkles,
    features: ['1,500 Credits', '4K Video Generation', 'Premium Avatars', 'Priority Support', 'Custom Styles'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    credits: 3500,
    icon: Crown,
    features: ['3,500 Credits', '8K Video Generation', 'All Avatars Unlocked', '24/7 Support', 'API Access', 'Custom Branding'],
    popular: false,
  },
];

export default function Credits() {
  const { push } = useToast();
  const { credits, refresh } = useCredits();
  const [loading, setLoading] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleCheckout = (plan: any) => {
    setCheckoutPlan(plan);
    setCardNumber('');
    setExpiry('');
    setCvc('');
  };

  const handlePayment = async () => {
    if (!cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
      push({ type: 'error', title: 'Error', description: 'Please fill in all card details' });
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, this would call Stripe/PayPal API
      // For now, we'll add credits directly
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('users')
            .update({ 
              credits: (credits || 0) + checkoutPlan.credits,
              plan: checkoutPlan.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (error) throw error;
          await refresh();
        }
      }

      push({ 
        type: 'success', 
        title: 'Payment Successful!', 
        description: `${checkoutPlan.credits} credits added to your account` 
      });
      
      setCheckoutPlan(null);
      setCardNumber('');
      setExpiry('');
      setCvc('');
    } catch (err: any) {
      push({ type: 'error', title: 'Payment Failed', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-white">Upgrade Your Studio</h1>
        <p className="mt-2 text-white/60">Choose a plan that fits your creative needs</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-neon-purple/20 rounded-full">
          <CreditCard className="h-5 w-5 text-neon-purple" />
          <span className="text-white font-medium">Current Balance: {credits || 0} credits</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={plan.id} 
              className={`p-6 relative ${
                plan.popular 
                  ? 'border-2 border-neon-purple bg-gradient-to-br from-neon-purple/10 to-transparent' 
                  : 'border border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-neon-purple text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-neon-purple/20 rounded-xl mb-3">
                  <Icon className="h-6 w-6 text-neon-purple" />
                </div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/60">/month</span>
                </div>
                <p className="text-sm text-white/60 mt-1">{plan.credits} credits</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handleCheckout(plan)}
                loading={loading === plan.id}
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-neon-purple to-neon-blue' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Get {plan.name}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Checkout Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Checkout</h3>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white/80">{checkoutPlan.name} Plan</span>
                <span className="text-white font-bold">${checkoutPlan.price}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-neon-purple"
                  />
                </div>
              </div>

              <Button
                onClick={handlePayment}
                loading={processing}
                className="w-full bg-gradient-to-r from-neon-purple to-neon-blue"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ${checkoutPlan.price}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
