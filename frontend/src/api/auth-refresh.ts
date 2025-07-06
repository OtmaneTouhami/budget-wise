import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import type { AuthenticationResponse } from "@/api/generated/hooks/openAPIDefinition.schemas";
import { setupAxiosLogger } from "./api-logger";

const refreshInstance = axios.create({
  baseURL: "/api/v1",
  timeout: 10000, // Adding a reasonable timeout
});

// Set up logger for the refresh token instance
setupAxiosLogger(refreshInstance, "Auth Refresh");

/**
 * Refreshes the authentication tokens using the refresh token
 * This function is separate from the generated API hooks to have better control
 * over the refresh process and avoid interceptor loops
 */
export const refreshAuthTokens = async (): Promise<AuthenticationResponse> => {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await refreshInstance.post<AuthenticationResponse>(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};
