import { useState, useEffect } from 'react';
import { Edit2, CreditCard, MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  plan: string;
  status: string;
  created_at: string;
}

export default function Users() {
  const { push } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditType, setCreditType] = useState<'add' | 'remove'>('add');

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

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveUser = async () => {
    if (!editingUser || !supabase) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          plan: editingUser.plan,
          status: editingUser.status,
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      push({ type: 'success', title: 'Success', description: 'User updated successfully' });
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    }
  };

  const handleCreditUser = async () => {
    if (!selectedUser || !creditAmount || !supabase) return;

    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      push({ type: 'error', title: 'Error', description: 'Invalid amount' });
      return;
    }

    try {
      const newCredits = creditType === 'add' 
        ? selectedUser.credits + amount 
        : selectedUser.credits - amount;

      const { error } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', selectedUser.id);

      if (error) throw error;

      push({ 
        type: 'success', 
        title: 'Success', 
        description: `${amount} credits ${creditType === 'add' ? 'added to' : 'removed from'} user` 
      });
      setShowCreditModal(false);
      setSelectedUser(null);
      setCreditAmount('');
      loadUsers();
    } catch (err: any) {
      push({ type: 'error', title: 'Error', description: err.message });
    }
  };

  const openCreditModal = (user: User, type: 'add' | 'remove') => {
    setSelectedUser(user);
    setCreditType(type);
    setShowCreditModal(true);
  };

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      Pro: 'bg-purple-500/20 text-purple-300',
      Creator: 'bg-blue-500/20 text-blue-300',
      Free: 'bg-gray-500/20 text-gray-300',
    };
    return colors[plan] || colors.Free;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-300',
      past_due: 'bg-yellow-500/20 text-yellow-300',
      inactive: 'bg-red-500/20 text-red-300',
    };
    return colors[status] || colors.inactive;
  };

  if (loading) {
    return <div className="text-white/60">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-white/60 mt-2">Manage user accounts and credits</p>
        </div>
        <div className="text-white/60">
          Total Users: <span className="text-white font-bold">{users.length}</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="text-left py-3 px-4 text-white/60 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium">Plan</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium">Credits</th>
              <th className="text-left py-3 px-4 text-white/60 font-medium">Status</th>
              <th className="text-right py-3 px-4 text-white/60 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-white">{user.name}</td>
                <td className="py-3 px-4 text-white/60">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${getPlanBadge(user.plan)}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="py-3 px-4 text-white font-mono">{user.credits || 0}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openCreditModal(user, 'add')}
                      className="text-green-400 hover:text-green-300"
                      title="Add Credits"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openCreditModal(user, 'remove')}
                      className="text-red-400 hover:text-red-300"
                      title="Remove Credits"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditUser(user)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Edit User"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Edit User</h2>
            <div className="space-y-4">
              <Input
                label="Name"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
              <div>
                <label className="block text-sm text-white/60 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Plan</label>
                <select
                  value={editingUser.plan}
                  onChange={(e) => setEditingUser({ ...editingUser, plan: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                >
                  <option value="Free">Free</option>
                  <option value="Creator">Creator</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Status</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="past_due">Past Due</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleSaveUser} className="flex-1">Save Changes</Button>
              <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Credit/Debit Modal */}
      {showCreditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {creditType === 'add' ? 'Add' : 'Remove'} Credits
            </h2>
            <p className="text-white/60 mb-4">User: {selectedUser.name}</p>
            <div className="space-y-4">
              <Input
                label="Amount"
                type="number"
                placeholder="Enter amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
              <div className="text-sm text-white/60">
                Current Credits: <span className="text-white font-bold">{selectedUser.credits}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleCreditUser} className="flex-1">
                {creditType === 'add' ? 'Add' : 'Remove'} Credits
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreditModal(false);
                  setSelectedUser(null);
                  setCreditAmount('');
                }} 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}