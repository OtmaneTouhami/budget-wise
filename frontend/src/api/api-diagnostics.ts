import { checkApiConnection } from "./api-logger";

/**
 * Diagnostics utility for checking API connectivity at startup
 * Can help identify if the API is reachable before the user tries to log in
 */
export async function runApiDiagnostics(): Promise<void> {
  console.log("🔍 Running API connectivity diagnostics...");

  const apiUrl = "/api/v1";
  const isConnected = await checkApiConnection(apiUrl);

  if (isConnected) {
    console.log("✅ API connection successful. Backend server is reachable.");
  } else {
    console.error("❌ API connection failed! Please check:");
    console.error("  1. Is the backend server running?");
    console.error("  2. Is it running on the expected port?");
    console.error("  3. Is the Vite proxy configured correctly?");
    console.error("  4. Are there any network issues or CORS restrictions?");
    console.warn(
      "The application may not function correctly until the API connection is established."
    );
  }
}
