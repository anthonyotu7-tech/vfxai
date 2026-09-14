import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';

export default function PaymentSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    paymentsEnabled: true,
    bitcoinWalletAddress: '',
    minimumWithdrawal: '10',
    platformFee: '2.5',
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .single();

      if (data) {
        setSettings({
          paymentsEnabled: data.payments_enabled ?? true,
          bitcoinWalletAddress: data.bitcoin_wallet_address ?? '',
          minimumWithdrawal: data.minimum_withdrawal?.toString() ?? '10',
          platformFee: data.platform_fee?.toString() ?? '2.5',
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
        alert('Supabase not configured');
        setLoading(false);
        return;
      }

      // Upsert settings
      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          id: 1,
          payments_enabled: settings.paymentsEnabled,
          bitcoin_wallet_address: settings.bitcoinWalletAddress,
          minimum_withdrawal: parseFloat(settings.minimumWithdrawal),
          platform_fee: parseFloat(settings.platformFee),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      alert('Payment settings saved successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Payment Settings</h1>
        <p className="text-white/60 mt-2">Configure payment options and wallet settings</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Payments Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Enable Payments</h3>
              <p className="text-sm text-white/60">Allow users to make payments and withdrawals</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, paymentsEnabled: !settings.paymentsEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.paymentsEnabled ? 'bg-neon-purple' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.paymentsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Bitcoin Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <Wallet className="inline h-4 w-4 mr-1" />
              Bitcoin Wallet Address
            </label>
            <Input
              type="text"
              placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
              value={settings.bitcoinWalletAddress}
              onChange={(e) => setSettings({ ...settings, bitcoinWalletAddress: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-white/40 mt-1">Your Bitcoin wallet address for receiving payments</p>
          </div>

          {/* Minimum Withdrawal */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Minimum Withdrawal (Credits)
            </label>
            <Input
              type="number"
              placeholder="10"
              value={settings.minimumWithdrawal}
              onChange={(e) => setSettings({ ...settings, minimumWithdrawal: e.target.value })}
              className="w-full max-w-xs"
            />
          </div>

          {/* Platform Fee */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Platform Fee (%)
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="2.5"
              value={settings.platformFee}
              onChange={(e) => setSettings({ ...settings, platformFee: e.target.value })}
              className="w-full max-w-xs"
            />
            <p className="text-xs text-white/40 mt-1">Percentage fee charged on transactions</p>
          </div>

          <Button onClick={saveSettings} loading={loading} className="mt-4">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
