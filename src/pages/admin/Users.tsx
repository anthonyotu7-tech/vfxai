import { useState, useEffect } from 'react';
import { Plus, Minus, Edit2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  status: string;
  phone?: string;
  username?: string;
}

export default function AdminUsers() {
  const { push } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    type: 'add' | 'deduct' | 'edit';
    user: User | null;
  } | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredit = async () => {
    if (!modal?.user || !amount || parseInt(amount) <= 0) {
      push({ type: 'error', title: 'Error', description: 'Enter a valid amount' });
      return;
    }
    setProcessing(true);
    try {
      const newBalance = (modal.user.credits || 0) + parseInt(amount);
      
      // Update user credits
      const { error: updateError } = await supabase!
        .from('users')
        .update({ credits: newBalance })
        .eq('id', modal.user.id);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transError } = await supabase!
        .from('admin_transactions')
        .insert({
          user_id: modal.user.id,
          admin_id: (await supabase!.auth.getUser()).data.user?.id,
          type: 'credit_add',
          amount: parseInt(amount),
          previous_balance: modal.user.credits,
          new_balance: newBalance,
          description: description || 'Credit added by admin',
        });

      if (transError) throw transError;

      push({ type: 'success', title: 'Success', description: `Added ${amount} credits to ${modal.user.email}` });
      setModal(null);
      setAmount('');
      setDescription('');
      loadUsers();
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeductCredit = async () => {
    if (!modal?.user || !amount || parseInt(amount) <= 0) {
      push({ type: 'error', title: 'Error', description: 'Enter a valid amount' });
      return;
    }
    if (parseInt(amount) > (modal.user.credits || 0)) {
      push({ type: 'error', title: 'Error', description: 'Insufficient balance' });
      return;
    }
    setProcessing(true);
    try {
      const newBalance = (modal.user.credits || 0) - parseInt(amount);
      
      const { error: updateError } = await supabase!
        .from('users')
        .update({ credits: newBalance })
        .eq('id', modal.user.id);

      if (updateError) throw updateError;

      const { error: transError } = await supabase!
        .from('admin_transactions')
        .insert({
          user_id: modal.user.id,
          admin_id: (await supabase!.auth.getUser()).data.user?.id,
          type: 'credit_deduct',
          amount: parseInt(amount),
          previous_balance: modal.user.credits,
          new_balance: newBalance,
          description: description || 'Credit deducted by admin',
        });

      if (transError) throw transError;

      push({ type: 'success', title: 'Success', description: `Deducted ${amount} credits from ${modal.user.email}` });
      setModal(null);
      setAmount('');
      setDescription('');
      loadUsers();
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleEditUser = async () => {
    if (!modal?.user) return;
    setProcessing(true);
    try {
      const { error } = await supabase!
        .from('users')
        .update({
          name: editForm.name || modal.user.name,
          email: editForm.email || modal.user.email,
          status: editForm.status || modal.user.status,
          phone: editForm.phone,
          username: editForm.username,
        })
        .eq('id', modal.user.id);

      if (error) throw error;

      push({ type: 'success', title: 'Success', description: 'User updated successfully' });
      setModal(null);
      setEditForm({});
      loadUsers();
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (type: 'add' | 'deduct' | 'edit', user: User) => {
    setModal({ type, user });
    setAmount('');
    setDescription('');
    setEditForm({
      name: user.name,
      email: user.email,
      status: user.status,
      phone: user.phone,
      username: user.username,
    });
  };

  if (loading) {
    return <div className="text-white p-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-white/60 mt-2">Manage user accounts and credits</p>
        </div>
        <div className="text-white/60">Total Users: {users.length}</div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="text-left text-sm text-white/60">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white font-medium">{user.name || '-'}</td>
                  <td className="p-4 text-white/70">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded bg-neon-purple/20 text-neon-purple">
                      {user.plan || 'free'}
                    </span>
                  </td>
                  <td className="p-4 text-white font-mono">{user.credits || 0}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal('add', user)}
                        className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                        title="Add Credits"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal('deduct', user)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Deduct Credits"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', user)}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {modal.type === 'add' && 'Add Credits'}
                {modal.type === 'deduct' && 'Deduct Credits'}
                {modal.type === 'edit' && 'Edit User'}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white/60 text-sm">User</p>
              <p className="text-white font-medium">{modal.user?.email}</p>
              <p className="text-white/60 text-sm mt-2">Current Balance</p>
              <p className="text-white font-mono text-lg">{modal.user?.credits || 0} credits</p>
            </div>

            {(modal.type === 'add' || modal.type === 'deduct') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description (optional)</label>
                  <Input
                    type="text"
                    placeholder="Reason for this transaction"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full"
                  />
                </div>
                {modal.type === 'deduct' && (
                  <p className="text-yellow-400 text-sm">️ Cannot deduct more than current balance</p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={modal.type === 'add' ? handleAddCredit : handleDeductCredit}
                    loading={processing}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {modal.type === 'add' ? 'Add Credits' : 'Deduct Credits'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setModal(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {modal.type === 'edit' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <Input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <Input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Username</label>
                  <Input
                    type="text"
                    value={editForm.username || ''}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone</label>
                  <Input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Status</label>
                  <select
                    value={editForm.status || 'active'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleEditUser}
                    loading={processing}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setModal(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
