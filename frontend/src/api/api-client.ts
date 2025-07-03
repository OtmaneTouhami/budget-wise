// src/api/api-client.ts

import axios from "axios";
import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/auth-store";

const baseURL = "/api/v1";

/**
 * The private, configured Axios instance.
 */
export const instance = axios.create({
  baseURL,
});

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

    // If the error is not a 401, or it's a 401 for the refresh token endpoint itself, reject it.
    if (
      error.response?.status !== 401 ||
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If we are already refreshing, add the new failed request to a queue
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return instance(originalRequest);
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
      // Make the call to the refresh token endpoint
      const response = await axios.post(
        `${baseURL}/auth/refresh`,
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
        }
      );

      const { access_token: newAccessToken, refresh_token: newRefreshToken } =
        response.data;

      // Update the tokens in our global store
      setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken });

      // Update the Authorization header on the original failed request
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      // Process the queue with the new token
      processQueue(null, newAccessToken);

      // Retry the original request
      return instance(originalRequest);
    } catch (refreshError) {
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
