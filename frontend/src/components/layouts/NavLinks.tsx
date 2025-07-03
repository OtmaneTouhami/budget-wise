// --- File: frontend/src/components/layouts/NavLinks.tsx ---
import { NavLink } from "react-router-dom";
import { BarChart, BadgeDollarSign, Wallet, Repeat, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard", icon: BarChart, text: "Dashboard" },
  { to: "/transactions", icon: Wallet, text: "Transactions" },
  { to: "/budgets", icon: BadgeDollarSign, text: "Budgets" },
  { to: "/recurring", icon: Repeat, text: "Recurring" },
  { to: "/settings", icon: Settings, text: "Settings" },
];

export const NavLinks = () => {
  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => (
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