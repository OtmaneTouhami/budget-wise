import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/error";

/**
 * Helper function to extract the error message from an API error response
 * @param error - The axios error object
 * @returns A user-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Handle axios error with response
    if (axiosError.response?.data) {
      const errorData = axiosError.response.data;

      // Return the API error message if available
      if (errorData.message) {
        return errorData.message;
      }

      // Check for validation errors
      if (errorData.validationErrors) {
        const validationMessages = Object.values(errorData.validationErrors);
        if (validationMessages.length > 0) {
          return validationMessages.join(", ");
        }
      }

      // Fallback to the error field
      if (errorData.error) {
        return errorData.error;
      }
    }

    // For network errors or other axios errors
    if (axiosError.message) {
      if (axiosError.message === "Network Error") {
        return "Cannot connect to the server. Please check your internet connection.";
      }
      return axiosError.message;
    }
  }

  // For non-axios errors
  if (error instanceof Error) {
    return error.message;
  }

  // Last resort
  return "An unexpected error occurred";
};

/**
 * Type guard to check if an error is an unauthorized error (401/403)
 * @param error - The error to check
 * @returns True if the error is a 401 or 403 error
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError;
    return (
      axiosError.response?.status === 401 || axiosError.response?.status === 403
    );
  }
  return false;
};
