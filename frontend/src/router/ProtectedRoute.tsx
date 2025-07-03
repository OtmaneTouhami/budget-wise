import { useAuthStore } from '@/store/auth-store';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();

  // If there's no token, redirect to the login page
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the child routes
  return <Outlet />;
};