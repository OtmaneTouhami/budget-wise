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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainLinks = [
  { to: "/dashboard", icon: BarChart, text: "Dashboard" },
  { to: "/transactions", icon: Wallet, text: "Transactions" },
  { to: "/budgets", icon: BadgeDollarSign, text: "Budgets" },
  { to: "/recurring", icon: Repeat, text: "Recurring" },
];

const bottomLinks = [
  { to: "/notifications", icon: Bell, text: "Notifications" },
  { to: "/settings", icon: Settings, text: "Settings" },
];

interface NavLinksProps {
  isSidebarOpen: boolean;
}

export const NavLinks = ({ isSidebarOpen }: NavLinksProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: notifications } = useGetMyNotifications({
    query: { enabled: !!accessToken, refetchInterval: 30000 },
  });

  const unreadCount = React.useMemo(
    () => notifications?.filter((n) => !n.read).length || 0,
    [notifications]
  );

  const renderNavLink = (link: {
    to: string;
    icon: React.ElementType;
    text: string;
  }) => {
    const isNotificationLink = link.to === "/notifications";

    const linkContent = (
      <NavLink
        to={link.to}
        className={({ isActive }) =>
          cn(
            "relative flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted text-primary",
            !isSidebarOpen && "justify-center"
          )
        }
      >
        <link.icon className="h-5 w-5 flex-shrink-0" />
        <span className={cn("truncate", !isSidebarOpen && "hidden")}>
          {link.text}
        </span>
        {isNotificationLink && unreadCount > 0 && (
          <span
            className={cn(
              "absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white",
              isSidebarOpen ? "right-3" : "top-1 right-1 h-4 w-4 text-[10px]"
            )}
          >
            {unreadCount}
          </span>
        )}
      </NavLink>
    );

    if (!isSidebarOpen) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{link.text}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return linkContent;
  };

  return (
    <nav className="flex flex-col gap-1 py-4">
      {mainLinks.map((link) => (
        <div key={link.to}>{renderNavLink(link)}</div>
      ))}
      <div className="mt-4 space-y-1">
        <h4
          className={cn(
            "px-3 text-xs font-semibold text-muted-foreground",
            !isSidebarOpen && "text-center"
          )}
        >
          {isSidebarOpen ? "General" : "•"}
        </h4>
        {bottomLinks.map((link) => (
          <div key={link.to}>{renderNavLink(link)}</div>
        ))}
      </div>
    </nav>
  );
};
