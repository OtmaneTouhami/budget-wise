import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { NavLinks } from "./NavLinks";
import { UserProfileMenu } from "@/features/auth/components/UserProfileMenu";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { logo, logoName } from "@/assets/images";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen border-r bg-background p-2 transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-auto"
      )}
    >
      {/* Header with Logo */}
      <div className="flex h-14 items-center border-b px-2">
        <div
          className={cn(
            "flex items-center",
            isSidebarOpen ? "justify-between w-full" : "w-full justify-center"
          )}
        >
          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="BudgetWise Logo"
              className={"h-8 w-auto flex-shrink-0"}
            />

            {isSidebarOpen && (
              <h1 className={"text-lg font-medium text-[#1A3A53]"}>
                BudgetWise<span className={"text-[#FBBF24]"}>+</span>
              </h1>
            )}
          </div>

          {/* Toggle button - shown beside logo when sidebar is open */}
          {isSidebarOpen && (
            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className="p-2 h-auto"
              size="sm"
            >
              <PanelLeftClose className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Toggle button - shown below logo but above nav links when sidebar is closed */}
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className="my-2 justify-center"
        >
          <PanelRightClose className="h-5 w-5" />
        </Button>
      )}

      {/* Main content area with NavLinks and footer */}
      <div className="flex flex-col justify-between flex-1 overflow-y-auto">
        <NavLinks isSidebarOpen={isSidebarOpen} />

        {/* The footer content is now inside the same scrolling container but pushed down */}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Separator />
          <UserProfileMenu isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </aside>
  );
};
