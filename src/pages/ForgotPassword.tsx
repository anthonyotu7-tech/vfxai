import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { LOGO } from '@/lib/brand';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      push({ type: 'error', title: 'Invalid email' });
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      push({ type: 'success', title: 'Reset link sent', description: 'Check your inbox.' });
    } catch (err: any) {
      push({ type: 'error', title: 'Could not send reset', description: err?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6 py-12">
      <Card className="w-full">
        <div className="flex justify-center mb-5"><LOGO /></div>
        <h1 className="text-center text-2xl font-bold">Reset your password</h1>
        <p className="mt-1 text-center text-sm text-white/60">
          {sent ? "We've emailed you a reset link." : "Enter your email and we'll send a reset link."}
        </p>

        {!sent ? (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} />
            <Button type="submit" loading={loading} className="w-full" size="lg">Send reset link</Button>
          </form>
        ) : (
          <div className="mt-6 text-center">
            <Button as="a" href="mailto:" variant="outline" className="w-full">Open email app</Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}