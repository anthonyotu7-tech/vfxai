import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';
import { LOGO } from '@/lib/brand';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const { push } = useToast();
  const navigate = useNavigate();
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
    // Check if Supabase is configured
    if (!supabase) {
      push({ type: 'error', title: 'Configuration error', description: 'Supabase is not configured' });
      setLoading(false);
      return;
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !user) {
      push({ type: 'error', title: 'Login failed', description: 'Invalid credentials' });
      setLoading(false);
      return;
    }

    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    push({ type: 'success', title: 'Welcome back' });
    
    // Redirect based on role
    if (user.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/dashboard';
    }
  } catch (err: any) {
    push({ type: 'error', title: 'Login failed', description: err?.message || 'Check your credentials.' });
    setLoading(false);
  }
};
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6 py-12">
      <Card className="w-full">
        <div className="flex justify-center mb-5"><LOGO /></div>
        <h1 className="text-center text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-white/60">Log in to continue creating.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={e => setEmail(e.target.value)} 
            error={errors.email} 
            icon={<Mail className="h-4 w-4" />} 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={e => setPassword(e.target.value)} 
            error={errors.password} 
            icon={<Lock className="h-4 w-4" />} 
          />
          
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link to="/signup" className="text-neon-purple hover:underline font-medium">
            Create account
          </Link>
        </p>
      </Card>
    </div>
  );
}