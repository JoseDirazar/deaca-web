import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appReviewService } from "@/api/app-review-service";
import type { AppReviewDto } from "@/types/common/api-request.interface";

export const useAppReviewApi = () => {
  const qc = useQueryClient();

  const getReviewForUser = useQuery({
    queryKey: ["app-reviews", "user"],
    queryFn: () => appReviewService.getReviewForUser().then((res) => res.data),
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: AppReviewDto) =>
      appReviewService.createAppReview(data).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["app-reviews"] });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: AppReviewDto;
    }) =>
      appReviewService.updateAppReview(reviewId, data).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["app-reviews"] });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id: string) =>
      appReviewService.deleteAppReview(id).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["app-reviews"] });
    },
  });

  return {
    createReviewMutation,
    updateReviewMutation,
    deleteReviewMutation,
    getReviewForUser,
  };
};
