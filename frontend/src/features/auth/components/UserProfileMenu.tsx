import { Link, useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/api/generated/hooks/authentication/authentication";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiErrorResponse } from "@/types/error";

export const UserProfileMenu = () => {
  const navigate = useNavigate();
  const { user, logout: authStoreLogout } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      // Call the API endpoint to invalidate the token on the backend
      await logoutMutation.mutateAsync();
      toast.success("You have been logged out.");
    } catch (error) {
      // Even if the API call fails, we should still clear the client-side state
      const apiError = error as { data: ApiErrorResponse };
      toast.error(apiError.data?.message || "Logout failed. Please try again.");
    } finally {
      // Clear user state from Zustand and redirect
      authStoreLogout();
      navigate("/login");
    }
  };
  
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-auto w-full items-center justify-start gap-3 p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
                {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};