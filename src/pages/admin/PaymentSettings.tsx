import { useState, useEffect } from 'react';
import { Save, Wallet, Building2, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

export default function PaymentSettings() {
  const { push } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Bitcoin
    bitcoinWalletAddress: '',
    bitcoinNetwork: 'Bitcoin',
    bitcoinActive: false,
    bitcoinInstructions: 'Send Bitcoin to the wallet address below. Your deposit will be credited after 3 confirmations.',
    bitcoinQrCode: '',
    // Bank
    bankName: '',
    accountName: '',
    accountNumber: '',
    bankBranch: '',
    bankActive: false,
    bankInstructions: 'Transfer to the bank account below and submit proof of payment.',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      if (!supabase) return;
      const { data } = await supabase
        .from('platform_settings')
        .select('*')
        .single();

      if (data) {
        setSettings({
          bitcoinWalletAddress: data.bitcoin_wallet_address || '',
          bitcoinNetwork: data.bitcoin_network || 'Bitcoin',
          bitcoinActive: data.bitcoin_active || false,
          bitcoinInstructions: data.bitcoin_payment_instructions || '',
          bitcoinQrCode: data.bitcoin_qr_code || '',
          bankName: data.bank_name || '',
          accountName: data.account_name || '',
          accountNumber: data.account_number || '',
          bankBranch: data.bank_branch || '',
          bankActive: data.bank_active || false,
          bankInstructions: data.bank_payment_instructions || '',
        });
      }
    } catch (err) {
      console.log('No existing settings found');
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        push({ type: 'error', title: 'Error', description: 'Supabase not configured' });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          id: 1,
          bitcoin_wallet_address: settings.bitcoinWalletAddress,
          bitcoin_network: settings.bitcoinNetwork,
          bitcoin_active: settings.bitcoinActive,
          bitcoin_payment_instructions: settings.bitcoinInstructions,
          bitcoin_qr_code: settings.bitcoinQrCode,
          bank_name: settings.bankName,
          account_name: settings.accountName,
          account_number: settings.accountNumber,
          bank_branch: settings.bankBranch,
          bank_active: settings.bankActive,
          bank_payment_instructions: settings.bankInstructions,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) throw error;

      push({ type: 'success', title: 'Success', description: 'Payment settings saved' });
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Payment Settings</h1>
        <p className="text-white/60 mt-2">Configure payment methods for user deposits</p>
      </div>

      {/* Bitcoin Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Bitcoin className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Bitcoin Payment</h2>
            <p className="text-sm text-white/60">Accept Bitcoin deposits</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Active</p>
              <p className="text-sm text-white/60">Show Bitcoin option to users</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, bitcoinActive: !settings.bitcoinActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.bitcoinActive ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.bitcoinActive ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Wallet Address</label>
            <Input
              type="text"
              placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
              value={settings.bitcoinWalletAddress}
              onChange={(e) => setSettings({ ...settings, bitcoinWalletAddress: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Network</label>
            <select
              value={settings.bitcoinNetwork}
              onChange={(e) => setSettings({ ...settings, bitcoinNetwork: e.target.value })}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white"
            >
              <option>Bitcoin</option>
              <option>Lightning Network</option>
              <option>Bitcoin Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Payment Instructions</label>
            <textarea
              value={settings.bitcoinInstructions}
              onChange={(e) => setSettings({ ...settings, bitcoinInstructions: e.target.value })}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white min-h-[80px]"
              placeholder="Instructions shown to users..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">QR Code URL (optional)</label>
            <Input
              type="text"
              placeholder="https://example.com/qr.png"
              value={settings.bitcoinQrCode}
              onChange={(e) => setSettings({ ...settings, bitcoinQrCode: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Bank Transfer Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Bank Transfer</h2>
            <p className="text-sm text-white/60">Accept bank transfer deposits</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Active</p>
              <p className="text-sm text-white/60">Show bank transfer option to users</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, bankActive: !settings.bankActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.bankActive ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.bankActive ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Bank Name</label>
            <Input
              type="text"
              placeholder="e.g. Chase Bank"
              value={settings.bankName}
              onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Account Name</label>
            <Input
              type="text"
              placeholder="e.g. John Doe"
              value={settings.accountName}
              onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Account Number</label>
            <Input
              type="text"
              placeholder="e.g. 1234567890"
              value={settings.accountNumber}
              onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Branch (optional)</label>
            <Input
              type="text"
              placeholder="e.g. Main Street Branch"
              value={settings.bankBranch}
              onChange={(e) => setSettings({ ...settings, bankBranch: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Payment Instructions</label>
            <textarea
              value={settings.bankInstructions}
              onChange={(e) => setSettings({ ...settings, bankInstructions: e.target.value })}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white min-h-[80px]"
              placeholder="Instructions shown to users..."
            />
          </div>
        </div>
      </Card>

      <Button onClick={saveSettings} loading={loading} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Payment Settings
      </Button>
    </div>
  );
}
