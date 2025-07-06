/**
 * API Logger utility for debugging API connection issues
 */

import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";

export function setupAxiosLogger(instance: AxiosInstance, name = "API") {
  // Request interceptor for logging
  instance.interceptors.request.use(
    (config) => {
      console.log(`🚀 [${name} Request]`, {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
      });
      return config;
    },
    (error) => {
      console.error(`❌ [${name} Request Error]`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for logging
  instance.interceptors.response.use(
    (response) => {
      console.log(`✅ [${name} Response]`, {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });
      return response;
    },
    (error: AxiosError) => {
      console.error(`❌ [${name} Response Error]`, {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
}

/**
 * Check connection to the server by making a simple ping request
 * Can be used to verify if the API server is reachable
 */
export async function checkApiConnection(baseURL: string): Promise<boolean> {
  try {
    console.log(`🔍 Checking connection to ${baseURL}`);

    // Create a temporary axios instance for the health check
    const tempInstance = axios.create({
      baseURL,
      timeout: 5000,
      // Don't throw errors on non-2xx responses
      validateStatus: () => true,
    });

    // As a last resort, try OPTIONS request which many servers support
    const optionsCheck = await tempInstance.options("/");

    if (optionsCheck.status < 500) {
      console.log(
        `✅ Successfully connected to ${baseURL} via OPTIONS request`
      );
      return true;
    }

    // If we get here and haven't returned true, connection likely failed
    console.error(`❌ Server responded with error status`);
    return false;
  } catch (error) {
    console.error(`❌ Failed to connect to ${baseURL}`, error);
    return false;
  }
}
