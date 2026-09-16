import { useState, useEffect } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

interface DepositRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  proof_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  credits_granted: number;
  created_at: string;
  profile?: { full_name: string; email: string; credits: number };
}

export default function AdminDepositRequests() {
  const { push } = useToast();
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ type: 'approve' | 'reject'; request: DepositRequest } | null>(null);
  const [creditsToGrant, setCreditsToGrant] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('deposit_requests')
        .select(`*, profile:profiles!inner(full_name, email, credits)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formatted = (data || []).map((req: any) => ({
        ...req,
        profile: req.profile ? { full_name: req.profile.full_name, email: req.profile.email, credits: req.profile.credits || 0 } : undefined
      }));
      setRequests(formatted);
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!modal?.request || !creditsToGrant || parseInt(creditsToGrant) <= 0) {
      push({ type: 'error', title: 'Error', description: 'Enter valid credits to grant' });
      return;
    }
    setProcessing(true);
    try {
      const credits = parseInt(creditsToGrant);
      const req = modal.request;

      await supabase!.from('deposit_requests').update({
        status: 'approved', credits_granted: credits, admin_notes: adminNotes || 'Approved', updated_at: new Date().toISOString()
      }).eq('id', req.id);

      const newBalance = (req.profile?.credits || 0) + credits;
      await supabase!.from('profiles').update({ credits: newBalance, updated_at: new Date().toISOString() }).eq('id', req.user_id);

      await supabase!.from('credit_transactions').insert({
        user_id: req.user_id, amount: credits, reason: `Deposit approved: ${req.amount} ${req.currency} via ${req.payment_method}. Note: ${adminNotes || 'N/A'}`
      });

      push({ type: 'success', title: 'Success', description: `Granted ${credits} credits to ${req.profile?.email}` });
      setModal(null); setCreditsToGrant(''); setAdminNotes(''); loadRequests();
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally { setProcessing(false); }
  };

  const handleReject = async () => {
    if (!modal?.request) return;
    setProcessing(true);
    try {
      await supabase!.from('deposit_requests').update({
        status: 'rejected', admin_notes: adminNotes || 'Rejected', updated_at: new Date().toISOString()
      }).eq('id', modal.request.id);
      push({ type: 'success', title: 'Success', description: 'Deposit request rejected' });
      setModal(null); setAdminNotes(''); loadRequests();
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally { setProcessing(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-white/60">Loading requests...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-white">Deposit Requests</h1><p className="text-white/60 mt-2">Review and process user deposit requests.</p></div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/5">
              <tr className="text-left text-sm text-white/60">
                <th className="p-4">Date</th><th className="p-4">User</th><th className="p-4">Amount</th><th className="p-4">Method</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/60">No deposit requests found.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/70 text-sm">{new Date(req.created_at).toLocaleDateString()}</td>
                    <td className="p-4"><div className="text-white font-medium">{req.profile?.full_name || 'Unknown'}</div><div className="text-white/50 text-sm">{req.profile?.email}</div></td>
                    <td className="p-4 text-white font-mono">{req.amount} {req.currency.toUpperCase()}</td>
                    <td className="p-4"><span className="px-2 py-1 text-xs rounded bg-white/10 text-white/80 capitalize">{req.payment_method}</span></td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded capitalize ${req.status === 'approved' ? 'bg-green-500/20 text-green-400' : req.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{req.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button onClick={() => setModal({ type: 'approve', request: req })} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30" title="Approve"><Check className="h-4 w-4" /></button>
                            <button onClick={() => setModal({ type: 'reject', request: req })} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30" title="Reject"><X className="h-4 w-4" /></button>
                          </>
                        )}
                        {req.status !== 'pending' && <span className="text-white/40 text-sm px-2">{req.credits_granted > 0 ? `+${req.credits_granted} cr` : 'N/A'}</span>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{modal.type === 'approve' ? '✅ Approve Deposit' : '❌ Reject Deposit'}</h3>
              <button onClick={() => setModal(null)} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
              <div className="flex justify-between"><span className="text-white/60 text-sm">User:</span><span className="text-white font-medium">{modal.request.profile?.email}</span></div>
              <div className="flex justify-between"><span className="text-white/60 text-sm">Requested:</span><span className="text-white font-medium">{modal.request.amount} {modal.request.currency.toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-white/60 text-sm">Current Balance:</span><span className="text-neon-purple font-bold">{modal.request.profile?.credits || 0} cr</span></div>
              {modal.request.proof_url && <div className="pt-2 border-t border-white/10"><a href={modal.request.proof_url} target="_blank" rel="noopener noreferrer" className="text-neon-blue text-sm hover:underline flex items-center gap-1"><Eye className="h-3 w-3" /> View Proof</a></div>}
            </div>
            {modal.type === 'approve' && (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-white mb-2">Credits to Grant</label>
                <Input type="number" min="1" placeholder="e.g., 500" value={creditsToGrant} onChange={(e) => setCreditsToGrant(e.target.value)} className="w-full" autoFocus /></div>
              </div>
            )}
            <div className="space-y-4 mt-4">
              <div><label className="block text-sm font-medium text-white mb-2">Admin Notes</label>
              <Input type="text" placeholder="Optional reason..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className="w-full" /></div>
              <div className="flex gap-3 pt-2">
                <Button onClick={modal.type === 'approve' ? handleApprove : handleReject} loading={processing} className={`flex-1 ${modal.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                  {modal.type === 'approve' ? 'Confirm & Grant Credits' : 'Confirm Rejection'}
                </Button>
                <Button variant="outline" onClick={() => setModal(null)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
