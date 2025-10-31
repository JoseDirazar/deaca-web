import { analyticsService } from "@/api/analytics-service";
import { useQuery } from "@tanstack/react-query";

export const useUserAnalyticsApi = () => {
  const useGetTotalVisitsForEstablishmentOwner = () => {
    return useQuery({
      queryKey: ["total-visits-for-establishment-owner"],
      queryFn: () => analyticsService.getTotalVisitsForEstablishmentOwner(),
    });
  };

  const useGetAdminAnalyticsChart = () => {
    return useQuery({
      queryKey: ["admin-analytics-chart"],
      queryFn: () => analyticsService.getAdminAnalyticsChart(),
    });
  };

  return {
    useGetTotalVisitsForEstablishmentOwner,
    useGetAdminAnalyticsChart,
  };
};
