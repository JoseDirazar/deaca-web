import type { CreateReviewDto } from "@/types/common/api-request.interface";
import type { CreateReviewResponse, GetReviewsByEstablishmentIdResponse, UpdateReviewResponse, DeleteReviewResponse } from "@/types/common/api-response.interface";
import api from "./axios-instance";

export const reviewService = {
    getReviewsByEstablishmentId: (establishmentId: string): GetReviewsByEstablishmentIdResponse => api.get(`/establishment/${establishmentId}/review`),
    createReview: (establishmentId: string, payload: CreateReviewDto): CreateReviewResponse => api.post(`/establishment/${establishmentId}/review`, payload),
    updateReview: (reviewId: string, payload: CreateReviewDto): UpdateReviewResponse => api.put(`/establishment/review/${reviewId}`, payload),
    deleteReview: (reviewId: string): DeleteReviewResponse => api.delete(`/establishment/review/${reviewId}`),
};
