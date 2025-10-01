import type { AxiosResponse } from "axios";
import type { User } from "../user/user.interface";
import type { Establishment } from "../establishment/etablihment.interface";
import type { Category } from "../category/category.interface";
import type { Subcategory } from "../category/subcategory.interface";

export type ApiPayload<T> = {
    ok: boolean;
    data: T;
}
export type ApiPaginatedPayload<T> = {
    ok: boolean;
    data: T;
    meta: {
        itemCount: number;
        itemsPerPage: number;
        currentPage: number;
        totalItems: number;
        totalPages: number;
    }
}
export type ApiResponse<T> = Promise<AxiosResponse<ApiPayload<T>>>;
export type ApiPaginatedResponse<T> = Promise<AxiosResponse<ApiPaginatedPayload<T>>>;

// -------- AUTH ---------------- AUTH ---------------- AUTH --------
export type SignInResponse = ApiResponse<{ accessToken: string, refreshToken: string, user: User }>
export type SignOutResponse = ApiResponse<void>;
export type SignUpResponse = ApiResponse<{ accessToken: string, refreshToken: string, user: User }>
export type GoogleAuthResponse = ApiResponse<{ accessToken: string, refreshToken: string, user: User }>
export type RefreshTokenResponse = ApiResponse<{ accessToken: string, refreshToken: string }>
export type ConfirmEmailResponse = ApiResponse<User>;
export type RequestPasswordResetResponse = ApiResponse<void>;
export type ResetPasswordResponse = ApiResponse<{ accessToken: string, refreshToken: string, user: User }>;
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
// -------- USER ---------------- USER ---------------- USER --------
export type GetUsersResponse = ApiPaginatedResponse<User[]>;
export type GetMyProfileResponse = ApiResponse<User>;
export type EditProfileResponse = ApiResponse<User>;
export type UploadAvatarResponse = ApiResponse<User>;
export type ApproveEstablishmentOwnerResponse = ApiResponse<User>;
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
