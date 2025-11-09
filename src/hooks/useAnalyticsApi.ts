import { analyticsService } from "@/api/analytics-service";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/api/query-keys";

export const useUserAnalyticsApi = () => {
  const queryClient = useQueryClient();

  const useGetTotalVisitsForEstablishmentOwner = () => {
    return useQuery({
      queryKey: [QueryKeys.TOTAL_VISITS],
      queryFn: () =>
        analyticsService
          .getTotalVisitsForEstablishmentOwner()
          .then((res) => res.data),
    });
  };

  const useGetAdminAnalyticsChart = () => {
    return useQuery({
      queryKey: [QueryKeys.ADMIN_ANALYTICS_CHART],
      queryFn: () =>
        analyticsService.getAdminAnalyticsChart().then((res) => res.data),
    });
  };

  // Invalidation function for analytics queries
  const invalidateAnalyticsQueries = () => {
    return queryClient.invalidateQueries({
      queryKey: [QueryKeys.TOTAL_VISITS, QueryKeys.ADMIN_ANALYTICS_CHART],
    });
  };

  return {
    useGetTotalVisitsForEstablishmentOwner,
    useGetAdminAnalyticsChart,
    invalidateAnalyticsQueries,
  };
};
