import type {
  DeleteAppReviewResponse,
  GetAppReviewResponse,
  GetAppReviewsResponse,
  UpdateAppReviewResponse,
} from "@/types/common/api-response.interface";
import api from "./axios-instance";
import type { AppReviewDto } from "@/types/common/api-request.interface";
import type { AppReviewStatus } from "@/types/enums/app-review-status.enum";

export const appReviewService = {
  findAll: (): GetAppReviewsResponse => api.get(`/app-review`),
  getReviewForUser: (): GetAppReviewResponse => api.get(`/app-review/user`),
  createAppReview: (payload: AppReviewDto): GetAppReviewResponse =>
    api.post(`/app-review`, payload),
  updateAppReview: (payload: AppReviewDto): UpdateAppReviewResponse =>
    api.put(`/app-review/user`, payload),
  deleteAppReview: (reviewId: string): DeleteAppReviewResponse =>
    api.delete(`/app-review/${reviewId}`),
  updateAppReviewStatus: (
    reviewId: string,
    status: AppReviewStatus,
  ): UpdateAppReviewResponse =>
    api.put(`/app-review/${reviewId}/status`, { status }),
};
