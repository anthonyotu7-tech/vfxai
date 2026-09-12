import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { LOGO } from '@/lib/brand';

export default function Signup() {
  const { signUp } = useAuth();
  const { push } = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = 'Required';
    if (!form.username.trim()) e.username = 'Required';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) e.username = '3–20 chars, letters/numbers/_';
    if (!form.email) e.email = 'Required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (form.password.length < 8) e.password = 'At least 8 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({
        full_name: form.full_name, username: form.username,
        email: form.email, password: form.password,
      });
      push({ type: 'success', title: 'Account created', description: 'Welcome to VFXAI.' });
      nav('/dashboard');
    } catch (err: any) {
      push({ type: 'error', title: 'Signup failed', description: err?.message || 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6 py-12">
      <Card className="w-full">
        <div className="flex justify-center mb-5"><LOGO /></div>
        <h1 className="text-center text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-center text-sm text-white/60">Start creating AI videos in minutes.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Full name" placeholder="Jane Creator" value={form.full_name}
            onChange={set('full_name')} error={errors.full_name} icon={<User className="h-4 w-4" />} />
          <Input label="Username" placeholder="janecreator" value={form.username}
            onChange={set('username')} error={errors.username} icon={<AtSign className="h-4 w-4" />} />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email}
            onChange={set('email')} error={errors.email} icon={<Mail className="h-4 w-4" />} />
          <Input label="Password" type="password" placeholder="At least 8 characters" value={form.password}
            onChange={set('password')} error={errors.password} icon={<Lock className="h-4 w-4" />} />
          <Input label="Confirm password" type="password" placeholder="Repeat password" value={form.confirm}
            onChange={set('confirm')} error={errors.confirm} icon={<Lock className="h-4 w-4" />} />

          <Button type="submit" loading={loading} className="w-full" size="lg">Create account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-neon-purple hover:underline font-medium">Log in</Link>
        </p>
      </Card>
    </div>
  );
}