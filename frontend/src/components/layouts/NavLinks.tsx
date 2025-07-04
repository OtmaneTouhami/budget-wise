import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart,
  BadgeDollarSign,
  Wallet,
  Repeat,
  Settings,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetMyNotifications } from "@/api/generated/hooks/notifications/notifications";
import { useAuthStore } from "@/store/auth-store";

const mainLinks = [
  { to: "/dashboard", icon: BarChart, text: "Dashboard" },
  { to: "/transactions", icon: Wallet, text: "Transactions" },
  { to: "/budgets", icon: BadgeDollarSign, text: "Budgets" },
  { to: "/recurring", icon: Repeat, text: "Recurring" },
];

const settingsLinks = [{ to: "/settings", icon: Settings, text: "Settings" }];

export const NavLinks = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: notifications } = useGetMyNotifications({
    query: {
      // Only fetch if the user is logged in
      enabled: !!accessToken,
      // Refetch every 30 seconds to keep the badge up-to-date
      refetchInterval: 30000,
    },
  });

  const unreadCount = React.useMemo(
    () => notifications?.filter((n) => !n.read).length || 0,
    [notifications]
  );

  return (
    <nav className="flex flex-col gap-2">
      {mainLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )
          }
        >
          <link.icon className="h-4 w-4" />
          {link.text}
        </NavLink>
      ))}
      {/* Notifications Link with Badge */}
      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          cn(
            "relative flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted text-primary"
          )
        }
      >
        <Bell className="h-4 w-4" />
        Notifications
        {unreadCount > 0 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </NavLink>
      {settingsLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )
          }
        >
          <link.icon className="h-4 w-4" />
          {link.text}
        </NavLink>
      ))}
    </nav>
  );
};
