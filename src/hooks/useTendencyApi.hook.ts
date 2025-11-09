import { tendencyService, type Tendency } from "@/api/tendency-service";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useTendencyApi = () => {
  const qc = useQueryClient();
  const useListTendencies = useSuspenseQuery<{ data: Tendency[] }>({
    queryKey: ["tendencies"],
    queryFn: () => tendencyService.list().then((res) => res?.data),
  });

  const useCreateOrUpdateTendency = useMutation({
    mutationFn: (payload: { establishmentId: string; position: number }) =>
      tendencyService.createOrUpdate(payload).then((res) => res?.data),
    onSuccess: ({ message }) => {
      toast.success(message ?? "Tendencia guardada");
      qc.invalidateQueries({ queryKey: ["tendencies"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Error al guardar tendencia",
        );
      }
    },
  });

  const useReorderTendencies = useMutation({
    mutationFn: (items: { id: string; position: number }[]) =>
      tendencyService.reorder(items).then((res) => res?.data),
    onSuccess: ({ message }) => {
      toast.success(message ?? "Tendencias reordenadas");
      qc.invalidateQueries({ queryKey: ["tendencies"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message ?? "Error al reordenar");
      }
    },
  });

  const useRemoveTendency = useMutation({
    mutationFn: (id: string) =>
      tendencyService.remove(id).then((res) => res?.data),
    onSuccess: ({ message }) => {
      toast.success(message ?? "Tendencia eliminada");
      qc.invalidateQueries({ queryKey: ["tendencies"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ?? "Error al eliminar tendencia",
        );
      }
    },
  });

  return {
    useListTendencies,
    useCreateOrUpdateTendency,
    useReorderTendencies,
    useRemoveTendency,
  };
};
