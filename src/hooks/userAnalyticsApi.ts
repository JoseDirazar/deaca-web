import { analyticsService } from "@/api/analytics-service";
import { useQuery } from "@tanstack/react-query";

export const useUserAnalyticsApi = () => {
  const useGetTotalVisitsForEstablishmentOwner = () => {
    return useQuery({
      queryKey: ["total-visits-for-establishment-owner"],
      queryFn: () => analyticsService.getTotalVisitsForEstablishmentOwner(),
    });
  };

  return {
    useGetTotalVisitsForEstablishmentOwner,
  };
};
