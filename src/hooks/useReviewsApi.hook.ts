import { reviewService } from "@/api/review-service";
import type { CreateReviewDto } from "@/types/common/api-request.interface";
import type { Review } from "@/types/reviews/review.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useReviewsApi = () => {
    const qc = useQueryClient();

    const useGetEstablishmentReviews = (establishmentId: string) => {
        return useQuery({
            queryFn: () => reviewService.getReviewsByEstablishmentId(establishmentId).then((res) => res.data.data),
            queryKey: ["reviews", establishmentId],
        });
    }

    const createReview = useMutation({
        mutationFn: ({ review, establishmentId }: { review: CreateReviewDto, establishmentId: string }) => reviewService.createReview(establishmentId, review).then((res) => res.data.data),
        onSuccess: (review) => qc.invalidateQueries({ queryKey: ["reviews", review.establishment.id] }),
    });

    const updateReview = useMutation({
        mutationFn: ({ review }: { review: Review }) => reviewService.updateReview(review.id, review).then((res) => res.data.data),
        onSuccess: (review) => qc.invalidateQueries({ queryKey: ["reviews", review.establishment.id] }),
    });

    const deleteReview = useMutation({
        mutationFn: ({ reviewId }: { reviewId: string }) => reviewService.deleteReview(reviewId).then((res) => res.data.data),
        onSuccess: (review) => qc.invalidateQueries({ queryKey: ["reviews", review.establishment.id] }),
    });

    return {
        useGetEstablishmentReviews,
        createReview,
        updateReview,
        deleteReview,
    }

};
