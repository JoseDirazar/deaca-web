import { analyticsService } from "@/api/analytics-service";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useUserAnalyticsApi = () => {
  const useGetTotalVisitsForEstablishmentOwner = () => {
    return useSuspenseQuery({
      queryKey: ["total-visits-for-establishment-owner"],
      queryFn: () => analyticsService.getTotalVisitsForEstablishmentOwner(),
    });
  };

  const useGetAdminAnalyticsChart = () => {
    return useSuspenseQuery({
      queryKey: ["admin-analytics-chart"],
      queryFn: () => analyticsService.getAdminAnalyticsChart(),
    });
  };

  return {
    useGetTotalVisitsForEstablishmentOwner,
    useGetAdminAnalyticsChart,
  };
};
