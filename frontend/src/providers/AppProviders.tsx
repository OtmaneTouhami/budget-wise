import React, { useEffect } from "react";
import { TanstackProvider } from "./TanstackProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./AuthProvider";
import { useAuthStore } from "@/store/auth-store";
import { refreshAuthTokens } from "@/api/auth-refresh";
import { isTokenExpired } from "@/api/auth-utils";
import { toast } from "sonner";
import { ConnectionProvider } from "./ConnectionProvider";
import { ConnectionErrorDialog } from "@/components/ConnectionErrorDialog";

/**
 * TokenRefreshManager - Component that handles periodic token refresh
 */
const TokenRefreshManager: React.FC = () => {
  const {
    accessToken,
    refreshToken: storedRefreshToken,
    setTokens,
    logout,
  } = useAuthStore();

  useEffect(() => {
    // Only set up token refresh if we have both tokens
    if (!accessToken || !storedRefreshToken) return;

    // Function to check and refresh token if needed
    const checkAndRefreshToken = async () => {
      try {
        if (isTokenExpired(accessToken, 300)) {
          // 5 minutes buffer
          console.log("Access token is expiring soon, refreshing...");
          const response = await refreshAuthTokens();

          if (response?.access_token && response?.refresh_token) {
            console.log("Token refreshed successfully");
            setTokens({
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
            });
          }
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        toast.error("Your session has expired. Please log in again.");
        logout();
      }
    };

    // Run once on mount
    checkAndRefreshToken();

    // Set up periodic check (every 4 minutes)
    const intervalId = setInterval(checkAndRefreshToken, 4 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [accessToken, storedRefreshToken, setTokens, logout]);

  return null; // This component doesn't render anything
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TanstackProvider>
      <ConnectionProvider>
        <AuthProvider>
          <TokenRefreshManager />
          {children}
          <ConnectionErrorDialog />
          <Toaster />
        </AuthProvider>
      </ConnectionProvider>
    </TanstackProvider>
  );
};
