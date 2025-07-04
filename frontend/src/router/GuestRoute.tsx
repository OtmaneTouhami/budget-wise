// --- File: frontend/src/router/GuestRoute.tsx ---
import { useAuthStore } from "@/store/auth-store";
import { Navigate, Outlet } from "react-router-dom";

export const GuestRoute = () => {
  const { accessToken } = useAuthStore();

  // If there IS a token, redirect the user away from guest pages (like landing/login)
  // to their main dashboard.
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  // If there is no token, render the child route (e.g., the LandingPage)
  return <Outlet />;
};
