import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
// Import the generated TypeScript type for a user profile
import type { UserProfileResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";

// Define the shape of your store's state and actions
interface AuthState {
  isAuth: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfileResponse | null;
  // Action to set tokens and user profile after a successful login/verification
  login: (
    tokens: { accessToken: string; refreshToken: string },
    user: UserProfileResponse
  ) => void;
  // Action to clear everything on logout
  logout: () => void;
  // Action to update just the tokens (useful for token refresh)
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  // Use persist middleware to save the store to localStorage
  persist(
    (set) => ({
      isAuth: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      login: (tokens, user) => set({ ...tokens, user, isAuth: true }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuth: false,
        }),
      setTokens: (tokens) => set({ ...tokens }),
    }),
    {
      name: "auth-storage", // Name for the localStorage item
      storage: createJSONStorage(() => localStorage),
    }
  )
);
