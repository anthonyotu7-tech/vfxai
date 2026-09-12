import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import { CreditsProvider } from '@/hooks/useCredits';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminShell } from '@/components/layout/AdminShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { CommandPalette } from '@/components/ui/CommandPalette';

import Landing from '@/pages/Landing';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';

import Dashboard from '@/pages/Dashboard';
import AvatarStudio from '@/pages/AvatarStudio';
import VideoGenerator from '@/pages/VideoGenerator';
import LiveStudio from '@/pages/LiveStudio';
import VideoCalls from '@/pages/VideoCalls';
import MyVideos from '@/pages/MyVideos';
import VideoEditor from '@/pages/VideoEditor';
import Templates from '@/pages/Templates';
import Credits from '@/pages/Credits';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import Users from '@/pages/admin/Users';
import Videos from '@/pages/admin/Videos';
import Avatars from '@/pages/admin/Avatars';
import CreditsAdmin from '@/pages/admin/CreditsAdmin';
import Transactions from '@/pages/admin/Transactions';
import Subscriptions from '@/pages/admin/Subscriptions';
import AdminSettings from '@/pages/admin/AdminSettings';

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CreditsProvider>
            <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
            <Routes>
              {/* Public */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Protected app */}
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/avatar-studio" element={<AvatarStudio />} />
                <Route path="/video-generator" element={<VideoGenerator />} />
                <Route path="/live-studio" element={<LiveStudio />} />
                <Route path="/video-calls" element={<VideoCalls />} />
                <Route path="/videos" element={<MyVideos />} />
                <Route path="/editor/:id" element={<VideoEditor />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute adminOnly><AdminShell /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/videos" element={<Videos />} />
                <Route path="/admin/avatars" element={<Avatars />} />
                <Route path="/admin/credits" element={<CreditsAdmin />} />
                <Route path="/admin/transactions" element={<Transactions />} />
                <Route path="/admin/subscriptions" element={<Subscriptions />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CreditsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}