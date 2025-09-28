import { establishmentService } from "@/api/establishment-service";
import type { Establishment } from "@/types/establishment/etablihment.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateEstablishment() {
    const qc = useQueryClient();
    const { data, isPending, isError, error, mutateAsync, mutate } = useMutation({
        mutationFn: (payload: Partial<Establishment>) => establishmentService.createMine(payload),
        onSuccess: async () => {
            // invalidate my establishments list
            await qc.invalidateQueries({ queryKey: ["user-establishments"] });
            await qc.invalidateQueries({ queryKey: ["establishments", "mine"] });
        }
    });
    return {
        establishmentCreated: data?.data,
        isLoading: isPending,
        isError,
        error,
        createEstablishment: mutate,
        createEstablishmentAsync: mutateAsync,
    };
}