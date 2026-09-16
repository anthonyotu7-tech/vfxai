import { useState, useEffect } from 'react';
import { Wallet, Building2, Bitcoin, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

export default function Deposit() {
  const { push } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({ amount: '', payment_method: 'bank', proof_text: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      if (!supabase) return;
      const { data } = await supabase.from('platform_settings').select('*').single();
      setSettings(data);
      if (data && data.bitcoin_active && !data.bank_active) {
        setFormData(prev => ({ ...prev, payment_method: 'bitcoin' }));
      }
    } catch (err) { console.log('No settings found'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      push({ type: 'error', title: 'Error', description: 'Please enter a valid amount' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase!.from('deposit_requests').insert({
        user_id: user.id, amount: amount, currency: 'usd', payment_method: formData.payment_method,
        proof_url: formData.proof_text || null, status: 'pending'
      });
      if (error) throw error;
      push({ type: 'success', title: 'Request Submitted', description: 'Your deposit request is pending admin approval.' });
      setFormData({ amount: '', payment_method: formData.payment_method, proof_text: '' });
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally { setLoading(false); }
  };

  if (!settings) return <div className="max-w-4xl mx-auto p-8 text-center"><h2 className="text-2xl font-bold text-white mb-4">Deposit Funds</h2><p className="text-white/60">Payment methods are currently being configured.</p></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center"><h1 className="font-display text-3xl font-bold text-white">Deposit Funds</h1><p className="mt-2 text-white/60">Submit a deposit request to add credits to your account.</p></div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {settings.bank_active && (
            <Card className="p-6 border-l-4 border-l-neon-blue">
              <div className="flex items-center gap-3 mb-4"><Building2 className="h-6 w-6 text-neon-blue" /><h3 className="text-xl font-bold text-white">Bank Transfer</h3></div>
              <div className="space-y-2 text-sm text-white/80">
                <p><span className="text-white/50">Bank Name:</span> {settings.bank_name || 'N/A'}</p>
                <p><span className="text-white/50">Account Name:</span> {settings.account_name || 'N/A'}</p>
                <p><span className="text-white/50">Account Number:</span> <span className="font-mono text-white">{settings.account_number || 'N/A'}</span></p>
                <p><span className="text-white/50">Branch:</span> {settings.bank_branch || 'N/A'}</p>
              </div>
              <p className="mt-4 text-xs text-white/50 italic">{settings.bank_payment_instructions}</p>
            </Card>
          )}
          {settings.bitcoin_active && (
            <Card className="p-6 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-4"><Bitcoin className="h-6 w-6 text-orange-500" /><h3 className="text-xl font-bold text-white">Bitcoin (BTC)</h3></div>
              <div className="space-y-2 text-sm text-white/80">
                <p><span className="text-white/50">Network:</span> {settings.bitcoin_network || 'Bitcoin'}</p>
                <p><span className="text-white/50">Wallet Address:</span> <span className="font-mono text-white break-all">{settings.bitcoin_wallet_address || 'N/A'}</span></p>
              </div>
              <p className="mt-4 text-xs text-white/50 italic">{settings.bitcoin_payment_instructions}</p>
            </Card>
          )}
        </div>
        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Wallet className="h-5 w-5 text-neon-purple" /> Submit Deposit Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Payment Method</label>
              <select value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-purple" required>
                {settings.bank_active && <option value="bank">Bank Transfer</option>}
                {settings.bitcoin_active && <option value="bitcoin">Bitcoin</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Amount Paid (USD)</label>
              <Input type="number" min="1" step="0.01" placeholder="e.g., 50.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Transaction Reference / Proof Notes</label>
              <textarea placeholder="Enter transaction ID, sender name, or any notes to help us verify..." value={formData.proof_text} onChange={(e) => setFormData({ ...formData, proof_text: e.target.value })} className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-purple min-h-[100px]" required />
            </div>
            <Button type="submit" loading={loading} className="w-full mt-4 bg-gradient-to-r from-neon-purple to-neon-blue">
              <CheckCircle className="h-4 w-4 mr-2" /> Submit Request
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
