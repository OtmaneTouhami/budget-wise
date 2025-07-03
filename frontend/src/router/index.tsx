import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { VerifyPage } from "../pages/VerifyPage";
import { _404Page } from "../pages/_404Page";
import { ProfilePage } from "@/pages/ProfilePage";
import { AppLayout } from "../components/layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { SettingsPage } from "@/pages/SettingsPage";
import { BudgetsPage } from "@/pages/BudgetsPage";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify",
    element: <VerifyPage />,
  },

  // Protected routes inside the main app layout
  {
    path: "/",
    element: <ProtectedRoute />,
    errorElement: <_404Page />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          // --- ADD THIS NEW ROUTE ---
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "budgets",
            element: <BudgetsPage />,
          },
        ],
      },
    ],
  },
]);
