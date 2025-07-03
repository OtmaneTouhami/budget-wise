import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useGetUserProfile } from '@/api/generated/hooks/user-profile/user-profile';

export const useAuth = () => {
  const { accessToken, user, login, logout } = useAuthStore();

  const { data: profile, isError } = useGetUserProfile({
    query: {
      // Only run this query if there's a token but no user object in the store yet
      enabled: !!accessToken && !user,
    },
  });

  useEffect(() => {
    // If we successfully fetched a profile, update the store
    if (profile) {
      // We don't have new tokens, so we just update the user part of the store
      // This is a simplified way; a real `login` action is better.
      const tokens = useAuthStore.getState();
      if(tokens.accessToken && tokens.refreshToken) {
        login({accessToken: tokens.accessToken, refreshToken: tokens.refreshToken}, profile);
      }
    }
  }, [profile, login]);

  useEffect(() => {
    // If the token is invalid (query returns an error), log the user out
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  return { isAuthenticated: !!accessToken, user };
};