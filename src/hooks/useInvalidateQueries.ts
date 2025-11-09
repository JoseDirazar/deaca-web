import { QueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/api/query-keys';

type QueryKey = keyof typeof QueryKeys;

export const useInvalidateQueries = (queryClient: QueryClient) => {
  const invalidateQueries = (keys: QueryKey | QueryKey[]) => {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    return queryClient.invalidateQueries({
      queryKey: keysArray.map(key => [QueryKeys[key]]),
    });
  };

  // Specific invalidation helpers
  const invalidateUserQueries = () => invalidateQueries(['USER', 'USERS', 'ADMIN_USERS_CHART'] as const);
  const invalidateAnalyticsQueries = () => invalidateQueries(['TOTAL_VISITS', 'ADMIN_ANALYTICS_CHART'] as const);
  const invalidateEstablishmentQueries = () => invalidateQueries(['ESTABLISHMENTS', 'ESTABLISHMENT'] as const);
  const invalidateCategoryQueries = () => invalidateQueries(['CATEGORIES', 'CATEGORY'] as const);
  const invalidateSubcategoryQueries = () => invalidateQueries(['SUBCATEGORIES', 'SUBCATEGORY'] as const);
  const invalidateEventQueries = () => invalidateQueries(['EVENTS', 'EVENT'] as const);
  const invalidateNatureSpotQueries = () => invalidateQueries(['NATURE_SPOTS', 'NATURE_SPOT'] as const);
  const invalidateReviewQueries = () => invalidateQueries(['REVIEWS', 'REVIEW'] as const);
  const invalidateAppReviewQueries = () => invalidateQueries('APP_REVIEWS');
  const invalidatePharmacyQueries = () => invalidateQueries('PHARMACIES');
  const invalidateTendencyQueries = () => invalidateQueries(['TENDENCIES', 'TENDENCY'] as const);

  return {
    invalidateQueries,
    invalidateUserQueries,
    invalidateAnalyticsQueries,
    invalidateEstablishmentQueries,
    invalidateCategoryQueries,
    invalidateSubcategoryQueries,
    invalidateEventQueries,
    invalidateNatureSpotQueries,
    invalidateReviewQueries,
    invalidateAppReviewQueries,
    invalidatePharmacyQueries,
    invalidateTendencyQueries,
  };
};
