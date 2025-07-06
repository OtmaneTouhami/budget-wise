// --- File: frontend/src/router/index.tsx ---
import { createBrowserRouter } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { VerifyPage } from "../pages/VerifyPage";
import { _404Page } from "../pages/_404Page";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { BudgetsPage } from "@/pages/BudgetsPage";
import { TransactionsPage } from "@/pages/TransactionsPage";
import { RecurringTransactionsPage } from "@/pages/RecurringTransactionsPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { LandingPage } from "@/pages/LandingPage";
import { AppLayout } from "../components/layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";

export const router = createBrowserRouter([
  // Guest-only routes
  {
    element: <GuestRoute />,
    errorElement: <_404Page />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/verify", element: <VerifyPage /> },
    ],
  },

  // Protected app routes
  {
    element: <ProtectedRoute />,
    errorElement: <_404Page />,
    children: [
      {
        // AppLayout acts as the container for all authenticated pages
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/transactions", element: <TransactionsPage /> },
          { path: "/budgets", element: <BudgetsPage /> },
          { path: "/recurring", element: <RecurringTransactionsPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
