import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/Toaster';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';  // Add this import
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminShell } from '@/components/layout/AdminShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import Landing from '@/pages/Landing';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import MyVideos from '@/pages/MyVideos';
import VideoEditor from '@/pages/VideoEditor';
import AvatarStudio from '@/pages/AvatarStudio';
import VideoGenerator from '@/pages/VideoGenerator';
import LiveStudio from '@/pages/LiveStudio';
import VideoCalls from '@/pages/VideoCalls';
import Credits from '@/pages/Credits';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminVideos from '@/pages/admin/Videos';
import AdminAvatars from '@/pages/admin/Avatars';
import AdminCredits from '@/pages/admin/CreditsAdmin';
import AdminTransactions from '@/pages/admin/Transactions';
import AdminSubscriptions from '@/pages/admin/Subscriptions';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminPaymentSettings from '@/pages/admin/PaymentSettings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>  {/* Add this wrapper */}
          <Toaster />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<About />} />
            </Route>

            {/* Protected User Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="videos" element={<MyVideos />} />
              <Route path="video-editor" element={<VideoEditor />} />
              <Route path="avatar-studio" element={<AvatarStudio />} />
              <Route path="video-generator" element={<VideoGenerator />} />
              <Route path="live-studio" element={<LiveStudio />} />
              <Route path="video-calls" element={<VideoCalls />} />
              <Route path="credits" element={<Credits />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="avatars" element={<AdminAvatars />} />
              <Route path="credits" element={<AdminCredits />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="payment-settings" element={<AdminPaymentSettings />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>  {/* Close the wrapper */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
