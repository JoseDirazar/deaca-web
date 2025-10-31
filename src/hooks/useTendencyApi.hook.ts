import { tendencyService, type Tendency } from "@/api/tendency-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useTendencyApi = () => {
  const qc = useQueryClient();

  const useListTendencies = useQuery<{ data: Tendency[] }>({
    queryKey: ["tendencies"],
    queryFn: () => tendencyService.list(),
  });

  const useCreateOrUpdateTendency = useMutation({
    mutationFn: (payload: { establishmentId: string; position: number }) =>
      tendencyService.createOrUpdate(payload),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ["tendencies"] });
      toast.success(message ?? "Tendencia guardada");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message ?? "Error al guardar tendencia");
      }
    },
  });

  const useReorderTendencies = useMutation({
    mutationFn: (items: { id: string; position: number }[]) => tendencyService.reorder(items),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ["tendencies"] });
      toast.success(message ?? "Tendencias reordenadas");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message ?? "Error al reordenar");
      }
    },
  });

  const useRemoveTendency = useMutation({
    mutationFn: (id: string) => tendencyService.remove(id),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ["tendencies"] });
      toast.success(message ?? "Tendencia eliminada");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message ?? "Error al eliminar tendencia");
      }
    },
  });

  return { useListTendencies, useCreateOrUpdateTendency, useReorderTendencies, useRemoveTendency };
};


