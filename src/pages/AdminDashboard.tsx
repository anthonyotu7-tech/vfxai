import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  duration: string;
}

interface User {
  id: string;
  email: string;
  plan: string;
  videosCreated: number;
  joinedAt: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  // Simple authentication (you can enhance this later)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Change 'admin123' to your preferred password
    if (password === 'admin123') {
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      alert('Incorrect password!');
    }
  };

  const loadDashboardData = () => {
    // Load demo data (you can replace with real API calls later)
    setVideos([
      { id: '1', title: 'Cinematic product ad', status: 'completed', createdAt: '2024-01-15', duration: '00:30' },
      { id: '2', title: 'Social media promo', status: 'processing', createdAt: '2024-01-14', duration: '00:15' },
      { id: '3', title: 'Brand introduction', status: 'completed', createdAt: '2024-01-13', duration: '01:00' },
    ]);

    setUsers([
      { id: '1', email: 'user1@example.com', plan: 'Pro', videosCreated: 15, joinedAt: '2024-01-10' },
      { id: '2', email: 'user2@example.com', plan: 'Free', videosCreated: 3, joinedAt: '2024-01-12' },
      { id: '3', email: 'user3@example.com', plan: 'Enterprise', videosCreated: 47, joinedAt: '2024-01-05' },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">VFXAI Admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Login
            </button>
          </form>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-gray-400 hover:text-white"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">VFXAI Admin Panel</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-4 mb-8">
          {['dashboard', 'videos', 'users', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-2">Total Videos</h3>
                <p className="text-3xl font-bold text-white">156</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-2">Active Users</h3>
                <p className="text-3xl font-bold text-white">42</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-2">Processing</h3>
                <p className="text-3xl font-bold text-yellow-400">3</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-2">Revenue</h3>
                <p className="text-3xl font-bold text-green-400">$2,450</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span className="text-white">New video created: "Cinematic product ad"</span>
                  <span className="text-gray-400 text-sm">2 minutes ago</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span className="text-white">New user registered</span>
                  <span className="text-gray-400 text-sm">15 minutes ago</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span className="text-white">Video completed processing</span>
                  <span className="text-gray-400 text-sm">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Videos Management */}
        {activeTab === 'videos' && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Video Management</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Title</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Duration</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Created</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id} className="border-t border-gray-700">
                    <td className="px-6 py-4 text-white">{video.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        video.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                      } text-white`}>
                        {video.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{video.duration}</td>
                    <td className="px-6 py-4 text-gray-300">{video.createdAt}</td>
                    <td className="px-6 py-4">
                      <button className="text-purple-400 hover:text-purple-300 mr-3">View</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">User Management</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Plan</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Videos</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Joined</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-700">
                    <td className="px-6 py-4 text-white">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        user.plan === 'Pro' ? 'bg-purple-600' : 
                        user.plan === 'Enterprise' ? 'bg-blue-600' : 'bg-gray-600'
                      } text-white`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.videosCreated}</td>
                    <td className="px-6 py-4 text-gray-300">{user.joinedAt}</td>
                    <td className="px-6 py-4">
                      <button className="text-purple-400 hover:text-purple-300 mr-3">View</button>
                      <button className="text-red-400 hover:text-red-300">Block</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Admin Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Change Admin Password</label>
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">AI API Key</label>
                <input
                  type="password"
                  placeholder="Enter API key"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}