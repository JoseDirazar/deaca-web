import { establishmentService } from "@/api/establishment-service";
import { useQuery } from "@tanstack/react-query";

export function useGetMyEstablishment() {
    const { data, isPending, isError, error, refetch } = useQuery({
        queryKey: ["user-establishments"],
        queryFn: () => establishmentService.getMine(),
    });

    return {
        myEstablishments: data?.data.data ?? [],
        isPending,
        isError,
        error,
        refetch,
    };
}