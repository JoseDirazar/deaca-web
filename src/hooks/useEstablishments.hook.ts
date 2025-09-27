import { useQuery } from "@tanstack/react-query";
import { establishmentService } from "../api/establishment-service";

export const useGetPaginatedEstablishments = (query: string) => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["establishments", query],
    queryFn: () => establishmentService.getEstablishments(query),
  });

  return {
    establishments: data?.data.data ?? [],
    meta: data?.data.meta,
    isLoading: isPending,
    error,
    isError,
  };
};
