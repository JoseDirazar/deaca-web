import type { AxiosResponse } from "axios";
import type { User } from "../user/user.interface";
import type { Establishment } from "../establishment/etablihment.interface";
import type { Category } from "../category/category.interface";
import type { Subcategory } from "../category/subcategory.interface";
import type { Review } from "../reviews/review.interface";
import type { AppReview } from "../reviews/app-review.interface";

export interface ApiPayload<T> {
  data: T;
  message?: string;
}
export interface ApiPaginatedPayload<T> extends ApiPayload<T> {
  meta: {
    itemCount: number;
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}
export type ApiResponse<T> = Promise<AxiosResponse<ApiPayload<T>>>;
export type ApiPaginatedResponse<T> = Promise<
  AxiosResponse<ApiPaginatedPayload<T>>
>;

// -------- AUTH ---------------- AUTH ---------------- AUTH --------
export type SignUpResponse = ApiResponse<void>;
export type SignInResponse = ApiResponse<{ accessToken: string }>;
export type SignOutResponse = ApiResponse<void>;
export type GoogleAuthResponse = ApiResponse<{ accessToken: string }>;
export type RefreshTokenResponse = ApiResponse<{ accessToken: string }>;
export type ConfirmEmailResponse = ApiResponse<User>;
export type RequestPasswordResetResponse = ApiResponse<void>;
export type ResetPasswordResponse = ApiResponse<void>;
// -------- ESTABLISHMENT ---------------- ESTABLISHMENT ---------------- ESTABLISHMENT --------
export type GetEstablishmentsResponse = ApiPaginatedResponse<Establishment[]>;
export type GetMyEstablishmentsResponse = ApiResponse<Establishment[]>;
export type GetEstablishmentByIdResponse = ApiResponse<Establishment>;
export type CreateEstablishmentResponse = ApiResponse<Establishment>;
export type UpdateMyEstablishmentResponse = ApiResponse<Establishment>;
export type DeleteMyEstablishmentResponse = ApiResponse<void>;
export type VerifyEstablishmentResponse = ApiResponse<Establishment>;
export type UploadEstablishmentAvatarResponse = ApiResponse<Establishment>;
export type UploadEstablishmentImagesResponse = ApiResponse<Establishment>;
export type RefreshCompletenessResponse = ApiResponse<boolean>;
export type DeleteEstablishmentImageResponse = ApiResponse<boolean>;
export type ChangeEstablishmentStatusResponse = ApiResponse<void>;
// -------- USER ---------------- USER ---------------- USER --------
export type GetUsersResponse = ApiPaginatedResponse<User[]>;
export type GetMyProfileResponse = ApiResponse<User>;
export type EditProfileResponse = ApiResponse<User>;
export type UploadAvatarResponse = ApiResponse<User>;
export type ApproveEstablishmentOwnerResponse = ApiResponse<User>;
export type ChangeUserAccountStatusResponse = ApiResponse<void>;
export type PromoteUserToAdminResponse = ApiResponse<void>;
// -------- CATEGORY ---------------- CATEGORY ---------------- CATEGORY --------
export type GetCategoriesResponse = ApiResponse<Category[]>;
export type GetSubcategoriesResponse = ApiResponse<Subcategory[]>;
export type GetSubcategoriesByCategoryResponse = ApiResponse<Subcategory[]>;
export type CreateCategoryResponse = ApiResponse<Category>;
export type CreateSubcategoryResponse = ApiResponse<Subcategory>;
export type UpdateCategoryResponse = ApiResponse<Category>;
export type UpdateSubcategoryResponse = ApiResponse<Subcategory>;
export type DeleteCategoryResponse = ApiResponse<void>;
export type DeleteSubcategoryResponse = ApiResponse<void>;
// -------- REVIEW ---------------- REVIEW ---------------- REVIEW --------
export type GetReviewsByEstablishmentIdResponse = ApiResponse<Review[]>;
export type CreateReviewResponse = ApiResponse<Review>;
export type UpdateReviewResponse = ApiResponse<Review>;
export type DeleteReviewResponse = ApiResponse<Review>;
// -------- APP REVIEW ---------------- APP REVIEW ---------------- APP REVIEW --------
export type CreateAppReviewResponse = ApiResponse<AppReview>;
export type UpdateAppReviewResponse = ApiResponse<AppReview>;
export type DeleteAppReviewResponse = ApiResponse<AppReview>;
export type GetAppReviewsResponse = ApiPaginatedResponse<AppReview[]>;
