import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Show a loading spinner while Supabase checks the session
  // This prevents the app from kicking you back to login while it's still loading!
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="h-10 w-10 text-neon-purple animate-spin" />
        <p className="text-white ml-3 text-lg">Loading session...</p>
      </div>
    );
  }

  // 2. If no user is found, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If it's an admin route but the user isn't an admin, kick them to the user dashboard
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. If all checks pass, show the page
  return <>{children}</>;
}