import type {
  DeleteAppReviewResponse,
  GetAppReviewsResponse,
  UpdateAppReviewResponse,
} from "@/types/common/api-response.interface";
import api from "./axios-instance";
import type { AppReviewDto } from "@/types/common/api-request.interface";

export const appReviewService = {
  findAll: () => api.get(`/app-review`),
  createAppReview: (payload: AppReviewDto): GetAppReviewsResponse =>
    api.post(`/app-review`, payload),
  updateAppReview: (
    reviewId: string,
    payload: AppReviewDto,
  ): UpdateAppReviewResponse => api.put(`/app-review/${reviewId}`, payload),
  deleteAppReview: (reviewId: string): DeleteAppReviewResponse =>
    api.delete(`/app-review/${reviewId}`),
};
