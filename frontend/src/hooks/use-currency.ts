import { useAuthStore } from "@/store/auth-store";

/**
 * A custom hook to get the currency symbol of the logged-in user.
 * Provides a default fallback symbol if the user or symbol is not available.
 * @returns The user's currency symbol (e.g., "$", "€") or a default.
 */

export const useCurrency = () => {
  const user = useAuthStore((state) => state.user);

  const currencySymbol = user?.country?.currencySymbol || "$";

  return currencySymbol;
};
