import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { LOGO } from '@/lib/brand';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const { push } = useToast();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !user) {
        push({ type: 'error', title: 'Login failed', description: 'Invalid credentials' });
        return;
      }

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      push({ type: 'success', title: 'Welcome back' });
      
      // Redirect based on role
      if (user.role === 'admin') {
        nav('/admin');
      } else {
        nav('/dashboard');
      }
    } catch (err: any) {
      push({ type: 'error', title: 'Login failed', description: err?.message || 'Check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      push({ type: 'info', title: 'Google sign-in', description: err?.message || 'Not configured in demo mode.' });
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6 py-12">
      <Card className="w-full">
        <div className="flex justify-center mb-5"><LOGO /></div>
        <h1 className="text-center text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-white/60">Log in to continue creating.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)} error={errors.email} icon={<Mail className="h-4 w-4" />} />
          <Input label="Password" type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)} error={errors.password} icon={<Lock className="h-4 w-4" />} />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/70">
              <input type="checkbox" className="accent-neon-purple" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-neon-purple hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg">
            <LogIn className="h-4 w-4" /> Log in
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-white/40">
          <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={google}>
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link to="/signup" className="text-neon-purple hover:underline font-medium">Create account</Link>
        </p>
      </Card>
    </div>
  );
}