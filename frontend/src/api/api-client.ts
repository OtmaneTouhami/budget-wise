// src/api/api-client.ts

import axios from "axios";
import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/auth-store";
import { setupAxiosLogger } from "./api-logger";

const baseURL = "/api/v1";

/**
 * The private, configured Axios instance.
 */
export const instance = axios.create({
  baseURL,
  timeout: 10000, // Adding a reasonable timeout
});

// Setup logger for the main API instance
setupAxiosLogger(instance, "Main API");

/**
 * Request Interceptor: Attaches the JWT access token to every outgoing request.
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// This flag prevents an infinite loop if the refresh token call itself fails with a 401
let isRefreshing = false;
// This array will hold all the requests that failed due to an expired token
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response Interceptor: Handles expired access tokens by attempting to refresh them.
 */
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If there's no config (cancelled request) or no response, just reject
    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    // If the error is not a 401/403, or it's for the refresh token endpoint itself, reject it
    if (
      (error.response?.status !== 401 && error.response?.status !== 403) ||
      originalRequest.url?.includes("auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Avoid retrying already retried requests
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If we are already refreshing, add the new failed request to a queue
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return instance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      // No refresh token available, logout and reject.
      logout();
      return Promise.reject(error);
    }

    try {
      console.log("Attempting to refresh the token");

      // Import the refresh function directly to avoid circular dependencies
      const { refreshAuthTokens } = await import("./auth-refresh");

      // Use our custom refresh function that properly handles the proxy
      const response = await refreshAuthTokens();

      console.log("Token refresh successful");

      const newAccessToken = response.access_token || "";
      const newRefreshToken = response.refresh_token || "";

      // Don't proceed if tokens are missing
      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Received invalid tokens from refresh request");
      }

      // Update the tokens in our global store
      setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });

      // Update the Authorization header on the original failed request
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      // Process the queue with the new token
      processQueue(null, newAccessToken);

      // Retry the original request
      return instance(originalRequest);
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);

      // If the refresh call fails, logout the user and reject all queued requests
      processQueue(refreshError as AxiosError, null);
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * The public-facing API client function (mutator) for orval.
 */
export const apiClient = <T>(config: AxiosRequestConfig): Promise<T> => {
  const controller = new AbortController();
  const promise = instance({ ...config, signal: controller.signal }).then(
    ({ data }) => data
  );
  // @ts-ignore
  promise.cancel = () => controller.abort();
  return promise;
};
