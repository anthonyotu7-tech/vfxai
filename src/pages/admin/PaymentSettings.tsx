import { useState } from 'react';

export default function PaymentSettings() {
  const [bitcoinWallet, setBitcoinWallet] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Payment Settings</h1>
      
      {saved && (
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
          Settings saved successfully!
        </div>
      )}

      <div className="bg-gray-900 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Bitcoin Payment</h2>
        <div>
          <label className="block text-sm text-white/60 mb-2">Wallet Address</label>
          <input
            type="text"
            value={bitcoinWallet}
            onChange={(e) => setBitcoinWallet(e.target.value)}
            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white"
            placeholder="bc1q..."
          />
        </div>
      </div>

      <div className="bg-gray-900 border border-white/10 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Bank Transfer</h2>
        <div>
          <label className="block text-sm text-white/60 mb-2">Bank Name</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Account Name</label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold px-6 py-3 rounded-lg"
      >
        Save Settings
      </button>
    </div>
  );
}
