import { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

interface DepositRequest {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  transaction_reference: string;
  receipt_url: string;
  note: string;
  status: string;
  admin_note: string;
  created_at: string;
  users?: { email: string; name: string };
}

export default function DepositRequests() {
  const { push } = useToast();
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      if (!supabase) return;
      let query = supabase
        .from('deposit_requests')
        .select('*, users(email, name)')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: DepositRequest) => {
    if (!confirm(`Approve deposit of ${request.amount} for ${request.users?.email}?`)) return;
    setProcessing(true);
    try {
      // Get current user balance
      const { data: userData } = await supabase!
        .from('users')
        .select('credits')
        .eq('id', request.user_id)
        .single();

      const newBalance = (userData?.credits || 0) + request.amount;

      // Update user credits
      await supabase!
        .from('users')
        .update({ credits: newBalance })
        .eq('id', request.user_id);

      // Update deposit request
      const { error } = await supabase!
        .from('deposit_requests')
        .update({
          status: 'approved',
          admin_note: adminNote || 'Approved by admin',
          admin_id: (await supabase!.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (error) throw error;

      push({ type: 'success', title: 'Success', description: 'Deposit approved and credited' });
      setSelectedRequest(null);
      setAdminNote('');
      loadRequests();
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (request: DepositRequest) => {
    if (!confirm(`Reject deposit from ${request.users?.email}?`)) return;
    setProcessing(true);
    try {
      const { error } = await supabase!
        .from('deposit_requests')
        .update({
          status: 'rejected',
          admin_note: adminNote || 'Rejected by admin',
          admin_id: (await supabase!.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (error) throw error;

      push({ type: 'success', title: 'Success', description: 'Deposit rejected' });
      setSelectedRequest(null);
      setAdminNote('');
      loadRequests();
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Deposit Requests</h1>
        <p className="text-white/60 mt-2">Review and manage user deposit requests</p>
      </div>

      <div className="flex gap-2">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === f ? 'bg-neon-purple text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-white/60 p-8 text-center">Loading...</div>
      ) : requests.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-white/60">No deposit requests found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-neon-purple/20 rounded-lg">
                    <DollarSign className="h-6 w-6 text-neon-purple" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{req.users?.email || 'Unknown User'}</p>
                    <p className="text-white/60 text-sm">
                      {req.payment_method === 'bitcoin' ? ' Bitcoin' : '🏦 Bank Transfer'} • {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${req.amount}</p>
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRequest(req)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Review
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Deposit Request Details</h3>
            
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-sm">User</p>
                <p className="text-white">{selectedRequest.users?.email}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-sm">Amount</p>
                <p className="text-white font-bold text-2xl">${selectedRequest.amount}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-sm">Payment Method</p>
                <p className="text-white capitalize">{selectedRequest.payment_method.replace('_', ' ')}</p>
              </div>
              {selectedRequest.transaction_reference && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm">Transaction Reference</p>
                  <p className="text-white font-mono text-sm">{selectedRequest.transaction_reference}</p>
                </div>
              )}
              {selectedRequest.receipt_url && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm">Receipt</p>
                  <a href={selectedRequest.receipt_url} target="_blank" rel="noopener noreferrer" className="text-neon-purple underline">
                    View Receipt
                  </a>
                </div>
              )}
              {selectedRequest.note && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm">User Note</p>
                  <p className="text-white">{selectedRequest.note}</p>
                </div>
              )}
              {selectedRequest.admin_note && (
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm">Admin Note</p>
                  <p className="text-white">{selectedRequest.admin_note}</p>
                </div>
              )}
            </div>

            {selectedRequest.status === 'pending' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">Admin Note</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white min-h-[60px]"
                    placeholder="Add a note..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(selectedRequest)}
                    loading={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve & Credit
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedRequest)}
                    loading={processing}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => { setSelectedRequest(null); setAdminNote(''); }}
              className="w-full mt-2"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}