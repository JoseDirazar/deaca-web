import api from "./axios-instance";
import type { AppReviewDto } from "@/types/common/api-request.interface";

export const appReviewService = {
    findAll: () => api.get(`/app-review`),
    createAppReview: (payload: AppReviewDto) => api.post(`/app-review`, payload),
    updateAppReview: (reviewId: string, payload: AppReviewDto) => api.put(`/app-review/${reviewId}`, payload),
    deleteAppReview: (reviewId: string) => api.delete(`/app-review/${reviewId}`),
};
