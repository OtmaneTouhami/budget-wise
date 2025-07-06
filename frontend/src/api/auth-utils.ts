import { useAuthStore } from "@/store/auth-store";
import { jwtDecode } from "jwt-decode";

/**
 * Utility function to check if an access token is expired
 * @param token - JWT token to check
 * @param bufferSeconds - Buffer time in seconds before actual expiration to consider the token expired
 * @returns boolean - true if the token is expired or about to expire
 */
export const isTokenExpired = (token: string, bufferSeconds = 60): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    // Get the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if the token is expired or will expire within the buffer time
    return !decoded.exp || decoded.exp < currentTime + bufferSeconds;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // If we can't decode the token, consider it expired
  }
};

/**
 * Hook to check if the current access token is expired
 * @returns boolean - true if the token is expired or about to expire
 */
export const useIsTokenExpired = (bufferSeconds = 60): boolean => {
  const { accessToken } = useAuthStore();

  if (!accessToken) return true;

  return isTokenExpired(accessToken, bufferSeconds);
};
