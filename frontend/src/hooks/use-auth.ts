import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useGetUserProfile } from "@/api/generated/hooks/user-profile/user-profile";
import { isUnauthorizedError } from "@/api/error-utils";
import { toast } from "sonner";

export const useAuth = () => {
  const { accessToken, user, login, logout } = useAuthStore();

  const {
    data: profile,
    isError,
    error,
  } = useGetUserProfile({
    query: {
      // Only run this query if there's a token but no user object in the store yet
      enabled: !!accessToken && !user,
    },
  });

  useEffect(() => {
    // If we successfully fetched a profile, update the store
    if (profile) {
      console.log("User profile fetched successfully", profile);
      // We don't have new tokens, so we just update the user part of the store
      const tokens = useAuthStore.getState();
      if (tokens.accessToken && tokens.refreshToken) {
        login(
          {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
          profile
        );
      }
    }
  }, [profile, login]);

  useEffect(() => {
    // If the token is invalid (query returns an error), log the user out
    if (isError) {
      console.error("Error fetching user profile:", error);

      if (isUnauthorizedError(error)) {
        toast.error("Your session has expired. Please log in again.");
        logout();
      }
    }
  }, [isError, error, logout]);

  return { isAuthenticated: !!accessToken, user };
};
