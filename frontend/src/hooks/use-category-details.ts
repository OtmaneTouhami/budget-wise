import { useGetCategoryById } from "@/api/generated/hooks/categories/categories";
import { useAuthStore } from "@/store/auth-store";

/**
 * A custom hook to fetch the details of a single category by its ID.
 * Leverages React Query's caching to avoid redundant API calls.
 * @param categoryId The ID of the category to fetch.
 * @returns The query result from React Query, containing category data, loading state, etc.
 */
export const useCategoryDetails = (categoryId: string | undefined) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const categoryQuery = useGetCategoryById(categoryId!, {
    query: {
      // Only run the query if we have an access token and a valid categoryId.
      enabled: !!accessToken && !!categoryId,
    },
  });

  return categoryQuery;
};