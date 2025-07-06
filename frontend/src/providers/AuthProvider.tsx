import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { refreshAuthTokens } from "@/api/auth-refresh";
import { useConnection } from "./ConnectionProvider";
import { toast } from "sonner";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const {
    accessToken,
    refreshToken: storedRefreshToken,
    user,
    setTokens,
  } = useAuthStore();

  // This hook fetches the user profile if we have a token but no user data
  useAuth();

  // On initial mount, attempt to refresh the token if we have a refresh token but no user or access token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // If we already have a user and accessToken, we're already authenticated
        if (user && accessToken) {
          setIsInitializing(false);
          return;
        }

        // If we have a refresh token but no access token or user, try to refresh
        if (storedRefreshToken && (!accessToken || !user)) {
          console.log("Initializing auth: Attempting to refresh token");
          try {
            const result = await refreshAuthTokens();

            if (result?.access_token && result?.refresh_token) {
              console.log("Auth initialized with refreshed tokens");
              setTokens({
                accessToken: result.access_token,
                refreshToken: result.refresh_token,
              });
            }
          } catch (refreshError) {
            console.error(
              "Failed to refresh token during initialization:",
              refreshError
            );
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // A simple loading state while we're initializing auth
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        Initializing...
      </div>
    );
  }

  return <>{children}</>;
}
