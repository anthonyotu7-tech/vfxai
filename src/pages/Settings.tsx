import { useState } from 'react';
import { User, Mail, Lock, Bell, Palette, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Mail },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function Settings() {
  const { user } = useAuth();
  const { push } = useToast();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
  });

  const save = () => push({ type: 'success', title: 'Settings saved' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Settings</h1>
        <p className="mt-1 text-white/60">Manage your account.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="p-2 h-fit">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                  tab === t.id ? 'bg-neon-purple/15 text-white border border-neon-purple/30' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </nav>
        </Card>

        <Card>
          {tab === 'profile' && (
            <div className="space-y-5">
              <h2 className="font-semibold text-lg">Profile</h2>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xl font-bold">
                  {(profile.full_name || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <Button variant="outline">Change picture</Button>
              </div>
              <Input label="Full name" value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} />
              <Input label="Username" value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} />
              <Input label="Email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
              <Button onClick={save}>Save changes</Button>
            </div>
          )}
          {tab === 'account' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Account</h2>
              <p className="text-sm text-white/60">Account ID: <code className="rounded bg-white/5 px-1.5 py-0.5">{user?.id}</code></p>
              <p className="text-sm text-white/60">Role: <b>{user?.role}</b></p>
              <Button variant="danger">Delete account</Button>
            </div>
          )}
          {tab === 'password' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Password</h2>
              <Input label="Current password" type="password" />
              <Input label="New password" type="password" />
              <Input label="Confirm new password" type="password" />
              <Button onClick={save}>Update password</Button>
            </div>
          )}
          {tab === 'notifications' && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Notifications</h2>
              {['Video generation complete', 'Credits low', 'New features', 'Marketing emails'].map(n => (
                <label key={n} className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-800/50 px-4 py-3">
                  <span className="text-sm">{n}</span>
                  <input type="checkbox" defaultChecked className="accent-neon-purple" />
                </label>
              ))}
            </div>
          )}
          {tab === 'appearance' && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Appearance</h2>
              <div className="flex gap-2">
                {['Dark', 'Midnight', 'AMOLED'].map(t => (
                  <button key={t} className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:border-neon-purple/40">{t}</button>
                ))}
              </div>
            </div>
          )}
          {tab === 'billing' && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Billing</h2>
              <p className="text-sm text-white/60">Plan: <b>Free</b></p>
              <Button variant="outline">Manage subscription</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}