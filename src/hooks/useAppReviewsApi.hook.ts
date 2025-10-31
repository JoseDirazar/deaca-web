import { appReviewService } from "@/api/app-review-service";
import type { AppReviewDto } from "@/types/common/api-request.interface";
import type { AppReviewStatus } from "@/types/enums/app-review-status.enum";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useAppReviewsApi = () => {
  const useGetAppReviews = useQuery({
    queryKey: ["app-reviews"],
    queryFn: () => appReviewService.findAll().then((res) => res.data),
  });

  const useCreateAppReview = useMutation({
    mutationFn: (payload: AppReviewDto) =>
      appReviewService.createAppReview(payload),
  });

  const useUpdateAppReview = useMutation({
    mutationFn: (payload: AppReviewDto) =>
      appReviewService.updateAppReview(payload),
    onSuccess: ({ data: { message } }) => {
      toast(message ?? "Comentario actualizado exitosamente");
      // queryClient.invalidateQueries({ queryKey: ["app-reviews"] });
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof AxiosError) {
        toast(error.response?.data.message ?? "Error al actualizar comentario");
      }
    },
  });

  const useDeleteAppReview = useMutation({
    mutationFn: (reviewId: string) =>
      appReviewService.deleteAppReview(reviewId),
    onSuccess: ({ data: { message } }) => {
      toast(message ?? "Comentario eliminado exitosamente");
      // queryClient.invalidateQueries({ queryKey: ["app-reviews"] });
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof AxiosError) {
        toast(error.response?.data.message ?? "Error al eliminar comentario");
      }
    },
  });

  const useUpdateAppReviewStatus = useMutation({
    mutationFn: ({
      reviewId,
      status,
    }: {
      reviewId: string;
      status: AppReviewStatus;
    }) => appReviewService.updateAppReviewStatus(reviewId, status),
    onSuccess: ({ data: { message } }) => {
      toast(message ?? "Comentario actualizado exitosamente");
      // queryClient.invalidateQueries({ queryKey: ["app-reviews"] });
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof AxiosError) {
        toast(error.response?.data.message ?? "Error al actualizar comentario");
      }
    },
  });

  return {
    useGetAppReviews,
    useCreateAppReview,
    useUpdateAppReview,
    useDeleteAppReview,
    useUpdateAppReviewStatus,
  };
};
