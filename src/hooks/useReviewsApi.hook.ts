import { reviewService } from "@/api/review-service";
import type { CreateReviewDto } from "@/types/common/api-request.interface";
import type { Review } from "@/types/reviews/review.interface";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useReviewsApi = () => {
  const useGetEstablishmentReviews = (establishmentId: string) => {
    return useSuspenseQuery({
      queryFn: () =>
        reviewService
          .getReviewsByEstablishmentId(establishmentId)
          .then((res) => res.data.data),
      queryKey: ["reviews", establishmentId],
    });
  };

  const createReview = useMutation({
    mutationFn: ({
      review,
      establishmentId,
    }: {
      review: CreateReviewDto;
      establishmentId: string;
    }) =>
      reviewService
        .createReview(establishmentId, review)
        .then((res) => res.data.data),
    onSuccess: () => toast.success("Review creado correctamente"),
  });

  const updateReview = useMutation({
    mutationFn: ({ review }: { review: Review }) =>
      reviewService
        .updateReview(review.id, review)
        .then((res) => res.data.data),
    onSuccess: () => toast.success("Review actualizado correctamente"),
  });

  const deleteReview = useMutation({
    mutationFn: ({ reviewId }: { reviewId: string }) =>
      reviewService.deleteReview(reviewId).then((res) => res.data.data),
    onSuccess: () => toast.success("Review eliminado correctamente"),
  });

  return {
    useGetEstablishmentReviews,
    createReview,
    updateReview,
    deleteReview,
  };
};
